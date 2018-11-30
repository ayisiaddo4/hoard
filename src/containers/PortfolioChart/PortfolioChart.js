import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';
import { VictoryArea } from 'victory-native';
import { getCurrencyHistory, Intervals } from 'components/GetCurrencyHistory';
import { Try } from 'components/Conditional';
import get from 'lodash/get';

import { mergeTimeValueLists } from './helpers';

function hexToRgb(hex) {
  const bigint = parseInt(hex.match(/[\d\w]+/), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255].join();
}

/**
   Shows a chart of your portfolio price over time.

   This price is determined by collating the price of
   trades into and out of fiat, the amount of a coin
   that is held over time, and the price of that coin
   as it fluctuates across time.

   Currently, only ethereum has history tracking enabled,
   so the portfolio chart only takes ethereum into account
 **/

const TransactionPropType = PropTypes.shape({
  price: PropTypes.number.isRequired,
  date: PropTypes.number.isRequired,
  from: PropTypes.string,
  to: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

export default class PortfolioChart extends Component {
  static propTypes = {
    colors: PropTypes.arrayOf(PropTypes.string),
    bottomPadding: PropTypes.number,
    fiatTrades: PropTypes.arrayOf(TransactionPropType).isRequired,
    transactionsToCoalesce: PropTypes.arrayOf(
      PropTypes.shape({
        symbol: PropTypes.string.isRequired,
        address: PropTypes.string,
        transactions: PropTypes.arrayOf(TransactionPropType).isRequired,
      })
    ),
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    bottomPadding: 20,
    colors: ['#00A073', '#007982'],
  };

  state = {
    initiallyHeldFiat: 0,
    // {symbol: [{time, value}]}
    holdingsOverTimeBySymbol: {},
    // {symbol: [{time, value}]}
    historicalPricesBySymbol: {},
    // [{x, y}]
    renderablePoints: [],
    height: 0,
    width: 0,
  };

  componentDidMount = async () => {
    const { transactionsToCoalesce, fiatTrades } = this.props;

    await Promise.all([
      ...transactionsToCoalesce.map(({ symbol, address, transactions }) =>
        this.compileHoldingsOverTimeBySymbol(symbol, address, transactions)
      ),
      this.compileHeldFiatOverTime(
        transactionsToCoalesce.reduce(
          (addressesToCheck, txList) => ({
            ...addressesToCheck,
            [txList.address]: true,
          }),
          {}
        ),
        fiatTrades
      ),
    ]);

    // do these after
    await Promise.all(
      transactionsToCoalesce.map(({ symbol }) =>
        this.compileHistoricalPricesBySymbol(
          symbol,
          this.state.holdingsOverTimeBySymbol[symbol] &&
            this.state.holdingsOverTimeBySymbol[symbol][0] &&
            this.state.holdingsOverTimeBySymbol[symbol][0].time
        )
      )
    );

    // after everything
    this.compileRenderablePoints();
  };

  getInitiallyHeldFiat = runningTotal =>
    runningTotal.reduce(
      ({ initialHoldings, prevValue }, newValue) => {
        const difference = newValue - prevValue;
        return {
          initialHoldings:
            difference < 0 ? initialHoldings - difference : initialHoldings,
          prevValue: newValue,
        };
      },
      { initialHoldings: 0, prevValue: 0 }
    ).initialHoldings;

  async compileHoldingsOverTimeBySymbol(symbol, address, transactions) {
    const holdingsOverTime = transactions.reduce(
      (holdingsOverTime, transaction, index) => {
        const previous = holdingsOverTime[index - 1] || { value: 0 };

        // change each transaction to a positive or negative impact to holdings
        const isSend = address === transaction.from;

        // ensure value is number type
        const numberValue = Number(transaction.amount);

        // if send, reduce running total of holdings by the send amount
        const adjustedValue = isSend ? -numberValue : numberValue;

        const runningTotalValue = adjustedValue + previous.value;

        return [
          ...holdingsOverTime,
          {
            time: transaction.date,
            value: runningTotalValue,
          },
        ];
      },
      []
    );

    this.setState(state => ({
      holdingsOverTimeBySymbol: {
        ...state.holdingsOverTimeBySymbol,
        [symbol]: holdingsOverTime,
      },
    }));
  }

  async compileHistoricalPricesBySymbol(symbol, earliestTime) {
    // i want 100 points;
    // now - initialTime / ms in day / 100
    // this will get us the aggregate number for the history request
    const aggregate = Math.round((Date.now() - earliestTime) / 86400000 / 100);
    const historicalPrices = await getCurrencyHistory(
      symbol,
      'USD',
      100,
      Intervals.day,
      aggregate,
      json =>
        json.Response === 'Success' && json.Data.map
          ? json.Data.map(v => ({ time: v.time * 1000, value: v.close }))
          : []
    );

    this.setState(state => ({
      historicalPricesBySymbol: {
        ...state.historicalPricesBySymbol,
        [symbol]: historicalPrices,
      },
    }));
  }

  async compileHeldFiatOverTime(addressesToCheck, transactions) {
    const runningTotal = transactions.reduce(
      (runningTotal, transaction, index) => {
        const previous = runningTotal[index - 1] || { value: 0 };

        // change each transaction to a positive or negative impact to holdings
        const isSend = !!addressesToCheck[transaction.from];

        // ensure value is number type
        const numberValue = Number(transaction.tradePrice || transaction.price);

        // if send, increase running total of holdings by the send amount
        const adjustedValue = isSend ? numberValue : -numberValue;

        const runningTotalValue = adjustedValue + previous.value;

        return [
          ...runningTotal,
          {
            time: transaction.date,
            value: runningTotalValue,
          },
        ];
      },
      []
    );

    // get the usd i must have started with to make these trades
    const initiallyHeldFiat = this.getInitiallyHeldFiat(runningTotal);

    const heldFiatOverTime = runningTotal.map(item => ({
      ...item,
      value: item.value + initiallyHeldFiat,
    }));

    this.setState({
      heldFiatOverTime,
      initiallyHeldFiat,
    });
  }

  async compileRenderablePoints() {
    const {
      holdingsOverTimeBySymbol,
      historicalPricesBySymbol,
      heldFiatOverTime,
      initiallyHeldFiat,
    } = this.state;

    const amountOfCryptoHoldingsBySymbol = {};

    for (const symbol in holdingsOverTimeBySymbol) {
      const historicalPrices = historicalPricesBySymbol[symbol];
      const holdingsOverTime = holdingsOverTimeBySymbol[symbol];

      // removeAllPrices before holdings history
      const sliceIndex = holdingsOverTime[0]
        ? historicalPrices.findIndex(
            value => value.time >= holdingsOverTime[0].time
          )
        : 0;

      // multiply the holdings by the final prices over time => usd/time
      const amountOfCryptoHoldingsForSymbol = mergeTimeValueLists(
        {
          // add list together
          list: holdingsOverTime.sort((a, b) => a.time - b.time),
          // if we run into the same time within "holdingsOverTime",
          // use the later item
          sameTimeValueResolver: (a, b) => b,
        },
        {
          list: historicalPrices.slice(sliceIndex),
          sameTimeValueResolver: (a, b) => (a > b ? a : b),
          aOnBResolver: (a, b) => a * b,
          defaultItem: { time: 0, value: 1 },
        } // multiply
      );

      amountOfCryptoHoldingsBySymbol[symbol] = amountOfCryptoHoldingsForSymbol;
    }

    const holdingsPerSymbolLists = Object.values(
      amountOfCryptoHoldingsBySymbol
    );

    const minimumTime = Math.min(
      ...holdingsPerSymbolLists
        .map(list => list[0] && list[0].time) // take first item
        .filter(v => v !== undefined) // ensure all items have defined values
    );

    const totalValuesOverTime = mergeTimeValueLists(
      // add together the symbol lists of usd/time
      ...holdingsPerSymbolLists.map(list => ({
        list,
        sameTimeValueResolver: (a, b) => b,
      })),
      // layer on held fiat over time
      {
        list: [
          // add item with initial fiat holdings to beginning of fiat history
          {
            time: minimumTime,
            value: initiallyHeldFiat,
          },
          ...heldFiatOverTime,
        ],
        sameTimeValueResolver: (a, b) => b,
      }
    );

    // transform into xy coordinates
    const renderablePoints = totalValuesOverTime
      .map(v => ({
        x: v.time,
        y: v.value,
      }))
      .filter(v => v.y && v.x && v.y < Infinity);

    this.setState({ renderablePoints });
  }

  isRenderable = () => {
    let totalCount = 0;

    if (this.props.transactionsToCoalesce) {
      for (const txList of this.props.transactionsToCoalesce) {
        totalCount += txList.transactions.length;
        if (totalCount > 1) {
          return true;
        }
      }
    }

    return false;
  };

  onLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }) => this.setState({ width, height: height - this.props.bottomPadding });

  render() {
    const { bottomPadding, colors, style } = this.props;

    const { renderablePoints, width, height } = this.state;

    if (!this.isRenderable() || !renderablePoints.length) {
      return null;
    }

    const color1 = hexToRgb(colors[0]).split(',');
    const color2 = hexToRgb(colors[1]).split(',');
    const averageColor = [
      parseInt((Number(color1[0]) * 3 + Number(color2[0]) + 255) / 5),
      parseInt((Number(color1[1]) * 3 + Number(color2[1]) + 255) / 5),
      parseInt((Number(color1[2]) * 3 + Number(color2[2]) + 255) / 5),
    ];

    const stroke = averageColor.join();
    const fill = 'rgba(255,255,255, 0.1083)';

    return (
      <View style={[{ flex: 1 }, style]} onLayout={this.onLayout}>
        <Try condition={!!renderablePoints.length && !!width && !!height}>
          <Fragment>
            <VictoryArea
              padding={{ bottom: 0, right: 0, top: 0, left: 0 }}
              height={height}
              width={width}
              style={{
                axis: {
                  stroke: 'red',
                },
                data: {
                  stroke: `rgba(${stroke}, 0.7)`,
                  strokeWidth: 2,
                  fill,
                },
              }}
              data={renderablePoints}
            />
            <View
              style={{
                width: '100%',
                height: bottomPadding,
                backgroundColor: fill,
              }}
            />
          </Fragment>
        </Try>
      </View>
    );
  }
}
