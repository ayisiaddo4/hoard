import {
  convertCurrency,
  CONVERT_CURRENCY_ERROR_EXISTENCE,
  CONVERT_CURRENCY_ERROR_PAIR,
  CONVERT_CURRENCY_ERROR_PRICE,
  CONVERT_CURRENCY_ERROR_AMOUNT_MISSING,
  CONVERT_CURRENCY_ERROR_SOLVE_FOR_MISSING,
  CONVERT_CURRENCY_ERROR_SOLVE_FOR_BOTH,
  SOLVE_FOR,
} from '../currency-helpers';

describe('Currency Helpers -- convertCurrency', () => {
  it('Should error missing params', () => {
    const nothingPassed = convertCurrency();
    const neither = convertCurrency({});
    const noDestination = convertCurrency({
      source: {
        amount: 150,
        price: 1,
      },
    });
    const noSource = convertCurrency({
      destination: {
        amount: 150,
        price: 1,
      },
    });
    expect(nothingPassed).toEqual(CONVERT_CURRENCY_ERROR_EXISTENCE);
    expect(neither).toEqual(CONVERT_CURRENCY_ERROR_EXISTENCE);
    expect(noDestination).toEqual(CONVERT_CURRENCY_ERROR_EXISTENCE);
    expect(noSource).toEqual(CONVERT_CURRENCY_ERROR_EXISTENCE);
  });

  it('Should error without common pair', () => {
    const noPair = convertCurrency({
      source: {},
      destination: {},
    });

    const differingPairs = convertCurrency({
      source: {
        pair: 'USD',
      },
      destination: {
        pair: 'BTC',
      },
    });

    expect(noPair).toEqual(CONVERT_CURRENCY_ERROR_PAIR);
    expect(differingPairs).toEqual(CONVERT_CURRENCY_ERROR_PAIR);
  });

  it('Should error if no currency was provided a price', () => {
    const result = convertCurrency({
      source: { pair: 'USD' },
      destination: { pair: 'USD' },
    });
    expect(result).toEqual(CONVERT_CURRENCY_ERROR_PRICE);
  });

  it('Should error if no currency was provided an amount', () => {
    const result = convertCurrency({
      source: {
        pair: 'USD',
        price: 1,
      },
      destination: {
        pair: 'USD',
        price: 1,
      },
    });
    expect(result).toEqual(CONVERT_CURRENCY_ERROR_AMOUNT_MISSING);
  });

  it('Should error if there is nothing to solve for', () => {
    const result = convertCurrency({
      source: {
        price: 1,
        amount: 1,
        pair: 'USD',
      },
      destination: {
        price: 1,
        amount: 1,
        pair: 'USD',
      },
    });
    expect(result).toEqual(CONVERT_CURRENCY_ERROR_SOLVE_FOR_MISSING);
  });

  it('Should error if no solution is possible to be found', () => {
    const result = convertCurrency({
      source: {
        amount: SOLVE_FOR,
        price: 1,
        pair: 'USD',
      },
      destination: {
        amount: SOLVE_FOR,
        price: 1,
        pair: 'USD',
      },
    });
    expect(result).toEqual(CONVERT_CURRENCY_ERROR_SOLVE_FOR_BOTH);
  });

  it('Should SUCCEED!!!', () => {
    const source = {
      amount: 1,
      price: 1,
      pair: 'USD',
    };

    const destination = {
      price: 100,
      pair: 'USD',
    };

    const result = convertCurrency({
      source,
      destination: {
        ...destination,
        amount: SOLVE_FOR,
      },
    });
    expect(result).toEqual({
      source,
      destination: {
        ...destination,
        amount: 0.01,
      },
      totalCost: 1,
    });
  });

  it('Should SUCCEED when given a 0 amount to buy with', () => {
    const source = {
      price: 1,
      pair: 'USD',
    };

    const destination = {
      price: 100,
      amount: 0,
      pair: 'USD',
    };

    const result = convertCurrency({
      source: {
        ...source,
        amount: SOLVE_FOR,
      },
      destination,
    });
    expect(result).toEqual({
      source: {
        ...source,
        amount: 0,
      },
      destination,
      totalCost: 0,
    });
  });

  it('Should SUCCEED when inverted!!!', () => {
    const source = {
      price: 1,
      pair: 'USD',
    };

    const destination = {
      price: 100,
      amount: 1,
      pair: 'USD',
    };

    const result = convertCurrency({
      source: {
        ...source,
        amount: SOLVE_FOR,
      },
      destination,
    });
    expect(result).toEqual({
      source: {
        ...source,
        amount: 100,
      },
      destination,
      totalCost: 100,
    });
  });
});
