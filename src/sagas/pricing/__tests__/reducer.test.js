import {
  getCurrencyHistory,
  getCurrencyHistoryFailure,
  getCurrencyHistorySuccess,
  getCurrencyPrice,
  getCurrencyPriceFailure,
  getCurrencyPriceSuccess,
} from '../actions';

import reducer from '../reducer';

describe('pricing reducer', () => {
  describe('get single currency price', () => {
    describe('on requesting', () => {
      it("should initialize a new state if one doesn't already exist", () => {
        expect(reducer(undefined, getCurrencyPrice('ETH')).ETH.price).toEqual({
          requesting: true,
          successful: false,
          errors: [],
          price: null,
        });
      });
      it('should change the requesting state of the price key', () => {
        expect(
          reducer(
            {
              BTC: {},
              ETH: {
                price: {
                  requesting: false,
                  successful: null,
                  errors: [],
                  price: null,
                },
                history: {
                  requesting: null,
                  successful: null,
                  errors: [],
                  interval: null,
                  limit: null,
                  data: [],
                  positive: null,
                  change: null,
                },
              },
            },
            getCurrencyPrice('ETH')
          )
        ).toEqual({
          BTC: {},
          ETH: {
            price: {
              requesting: true,
              successful: null,
              errors: [],
              price: null,
            },
            history: {
              requesting: null,
              successful: null,
              errors: [],
              interval: null,
              limit: null,
              data: [],
              positive: null,
              change: null,
            },
          },
        });
      });
    });

    describe('on success', () => {
      it('should update the price of the coin', () => {
        expect(
          reducer(
            {
              BTC: {},
              ETH: {
                price: {
                  requesting: true,
                  successful: null,
                  errors: [],
                  price: null,
                },
                history: {
                  requesting: null,
                  successful: null,
                  errors: [],
                  interval: null,
                  limit: null,
                  data: [],
                  positive: null,
                  change: null,
                },
              },
            },
            getCurrencyPriceSuccess('ETH', 1, true, '12%')
          )
        ).toEqual({
          BTC: {},
          ETH: {
            price: {
              requesting: false,
              successful: true,
              errors: [],
              price: 1,
            },
            history: {
              requesting: null,
              successful: null,
              errors: [],
              interval: null,
              limit: null,
              data: [],
              positive: null,
              change: null,
            },
          },
        });
      });
      it('should clear the previous errors', () => {
        expect(
          reducer(
            {
              ETH: {
                price: {
                  errors: ['a'],
                },
              },
            },
            getCurrencyPriceSuccess('ETH', 1, true, '12%')
          ).ETH.price.errors
        ).toEqual([]);
      });
    });

    describe('on failure', () => {
      it('should surface errors but not overwrite the previous price', () => {
        expect(
          reducer(
            {
              BTC: {},
              ETH: {
                price: {
                  requesting: true,
                  successful: null,
                  errors: [],
                  price: 1,
                },
                history: {
                  requesting: null,
                  successful: null,
                  errors: [],
                  interval: null,
                  limit: null,
                  data: [],
                  positive: null,
                  change: null,
                },
              },
            },
            getCurrencyPriceFailure('ETH', ['a', 'b'])
          )
        ).toEqual({
          BTC: {},
          ETH: {
            price: {
              requesting: false,
              successful: false,
              errors: ['a', 'b'],
              price: 1,
            },
            history: {
              requesting: null,
              successful: null,
              errors: [],
              interval: null,
              limit: null,
              data: [],
              positive: null,
              change: null,
            },
          },
        });
      });
    });
  });

  describe('get single currency history', () => {
    describe('on requesting', () => {
      it("should initialize a new state if one doesn't already exist", () => {
        expect(
          reducer(
            undefined,
            getCurrencyHistory('ETH', { limit: 1, interval: 'hour' })
          ).ETH.history
        ).toEqual({
          requesting: true,
          successful: false,
          errors: [],
          interval: 'hour',
          limit: 1,
          data: [],
          positive: null,
          change: null,
        });
      });

      it('should change the requesting state of the price key', () => {
        expect(
          reducer(
            {
              BTC: {},
              ETH: {
                price: {
                  requesting: null,
                  successful: null,
                  errors: [],
                  price: null,
                },
                history: {
                  requesting: false,
                  successful: null,
                  errors: [],
                  interval: null,
                  limit: null,
                  data: [],
                  positive: null,
                  change: null,
                },
              },
            },
            getCurrencyHistory('ETH', { limit: 1, interval: 'hour' })
          )
        ).toEqual({
          BTC: {},
          ETH: {
            price: {
              requesting: null,
              successful: null,
              errors: [],
              price: null,
            },
            history: {
              requesting: true,
              successful: null,
              errors: [],
              interval: 'hour',
              limit: 1,
              data: [],
              positive: null,
              change: null,
            },
          },
        });
      });
    });

    describe('on success', () => {
      it('should update the history of the coin', () => {
        expect(
          reducer(
            {
              BTC: {},
              ETH: {
                price: {
                  requesting: null,
                  successful: null,
                  errors: [],
                  price: null,
                },
                history: {
                  requesting: null,
                  successful: null,
                  errors: [],
                  interval: null,
                  limit: null,
                  data: [],
                  positive: null,
                  change: null,
                },
              },
            },
            getCurrencyHistorySuccess('ETH', [1, 2, 3, 4, 5, 6], true, 'a')
          )
        ).toEqual({
          BTC: {},
          ETH: {
            price: {
              requesting: null,
              successful: null,
              errors: [],
              price: null,
            },
            history: {
              requesting: false,
              successful: true,
              errors: [],
              interval: null,
              limit: null,
              data: [1, 2, 3, 4, 5, 6],
              positive: true,
              change: 'a',
            },
          },
        });
      });
    });

    describe('on failure', () => {
      it('should surface errors but not overwrite the previous price', () => {
        expect(
          reducer(
            {
              BTC: {},
              ETH: {
                price: {
                  requesting: null,
                  successful: null,
                  errors: [],
                  price: null,
                },
                history: {
                  requesting: null,
                  successful: null,
                  errors: [],
                  interval: null,
                  limit: null,
                  data: [],
                  positive: null,
                  change: null,
                },
              },
            },
            getCurrencyHistoryFailure('ETH', ['a', 'b'])
          )
        ).toEqual({
          BTC: {},
          ETH: {
            price: {
              requesting: null,
              successful: null,
              errors: [],
              price: null,
            },
            history: {
              requesting: false,
              successful: false,
              errors: ['a', 'b'],
              interval: null,
              limit: null,
              data: [],
              positive: null,
              change: null,
            },
          },
        });
      });
    });
  });
});
