import { transformIntoRunningTotal, mergeTimeValueLists } from '../helpers';

describe('PortfolioChart helpers', () => {
  describe('transformIntoRunningTotal', () => {
    it('should output an empty list when working with an empty list', () => {
      expect(transformIntoRunningTotal([])).toEqual([]);
    });

    it('should add each array value to the total of all the numbers before it', () => {
      expect(transformIntoRunningTotal([1])).toEqual([1]);
      expect(transformIntoRunningTotal([1, 100, 20])).toEqual([1, 101, 121]);
      expect(transformIntoRunningTotal([1, -100, -20, 120, 9, -10])).toEqual([
        1,
        -99,
        -119,
        1,
        10,
        0,
      ]);
    });
  });
  describe('mergeTimeValueLists', () => {
    const item = (time, value) => ({ time, value });
    const makeList = (
      list,
      sameTimeValueResolver,
      aOnBResolver,
      defaultItem
    ) => ({
      list,
      sameTimeValueResolver,
      aOnBResolver,
      defaultItem,
    });

    it('when dealing with one list, should return the same list', () => {
      const list = makeList([
        item(0, 0),
        item(1, 1),
        item(2, 2),
        item(3, 3),
        item(4, 4),
        item(5, 5),
        item(6, 6),
      ]);

      expect(mergeTimeValueLists(list)).toEqual(list.list);
    });

    it('when dealing with two equivalient lists, the new list should have the same length, and the times should be added together', () => {
      const list1 = makeList([
        item(0, 0),
        item(1, 1),
        item(2, 2),
        item(3, 3),
        item(4, 4),
        item(5, 5),
        item(6, 6),
      ]);

      const list2 = makeList([
        item(0, 16),
        item(1, 25),
        item(2, 34),
        item(3, 43),
        item(4, 52),
        item(5, 61),
        item(6, 70),
      ]);

      const expected = [
        item(0, 16),
        item(1, 26),
        item(2, 36),
        item(3, 46),
        item(4, 56),
        item(5, 66),
        item(6, 76),
      ];

      expect(mergeTimeValueLists(list1, list2)).toEqual(expected);
    });

    it('when dealing with a list that is of a different length than the other, should still work', () => {
      const list1 = makeList([item(0, 0), item(1, 1), item(2, 2), item(3, 3)]);

      const list2 = makeList([
        item(0, 16),
        item(1, 25),
        item(2, 34),
        item(3, 43),
        item(4, 52),
        item(5, 61),
        item(6, 70),
      ]);

      const expected = [
        item(0, 16),
        item(1, 26),
        item(2, 36),
        item(3, 46),
        item(4, 55),
        item(5, 64),
        item(6, 73),
      ];

      expect(mergeTimeValueLists(list1, list2)).toEqual(expected);
    });

    it('when dealing with a list that has a later start time than the other, should add them together', () => {
      const list1 = makeList([item(0, 0), item(1, 1), item(2, 2), item(3, 3)]);

      const list2 = makeList([
        item(10, 16),
        item(11, 25),
        item(12, 34),
        item(13, 43),
        item(14, 52),
        item(15, 61),
        item(16, 70),
      ]);

      const expected = [
        item(0, 0),
        item(1, 1),
        item(2, 2),
        item(3, 3),
        item(10, 19),
        item(11, 28),
        item(12, 37),
        item(13, 46),
        item(14, 55),
        item(15, 64),
        item(16, 73),
      ];

      expect(mergeTimeValueLists(list1, list2)).toEqual(expected);

      const list3 = makeList([
        item(0, 16),
        item(1, 25),
        item(2, 34),
        item(3, 43),
        item(4, 52),
        item(5, 61),
        item(6, 70),
      ]);

      const list4 = makeList([
        item(10, 0),
        item(11, 1),
        item(12, 2),
        item(13, 3),
      ]);

      const expected2 = [
        item(0, 16),
        item(1, 25),
        item(2, 34),
        item(3, 43),
        item(4, 52),
        item(5, 61),
        item(6, 70),
        item(10, 70),
        item(11, 71),
        item(12, 72),
        item(13, 73),
      ];

      expect(mergeTimeValueLists(list3, list4)).toEqual(expected2);
    });

    it('should fold together lists where the times are interspersed', () => {
      const list1 = makeList([
        item(0, 0),
        item(1, 1),
        item(3, 2),
        item(7, 4),
        item(9, 5),
      ]);

      const list2 = makeList([
        item(2, 6),
        item(4, 7),
        item(6, 8),
        item(8, 9),
        item(10, 10),
        item(12, 11),
        item(14, 12),
      ]);

      const expected = [
        item(0, 0),
        item(1, 1),
        item(2, 7),
        item(3, 8),
        item(4, 9),
        item(6, 10),
        item(7, 12),
        item(8, 13),
        item(9, 14),
        item(10, 15),
        item(12, 16),
        item(14, 17),
      ];

      expect(mergeTimeValueLists(list1, list2)).toEqual(expected);
    });

    it('should coalesce same times into one value', () => {
      const list1 = makeList([
        item(1, 1),
        item(1, 2),
        item(1, 3),
        item(1, 4),
        item(3, 2),
        item(5, 0),
        item(6, 1),
        item(7, 2),
      ]);

      const list2 = makeList([item(2, 6), item(3, 7), item(4, 8)]);

      const expected = [
        item(1, 10),
        item(2, 16),
        item(3, 9),
        item(4, 10),
        item(5, 8),
        item(6, 9),
        item(7, 10),
      ];

      expect(mergeTimeValueLists(list1, list2)).toEqual(expected);
    });

    it('you should be able to specify the value resolution method', () => {
      const list1 = makeList([item(1, 1), item(2, 2), item(3, 2), item(6, 3)]);

      const list2 = makeList(
        [
          item(1, 0),
          item(1, 1),
          item(2, 1),
          item(2, 2),
          item(3, 3),
          item(4, 7),
          item(5, 4),
          item(7, 2),
          item(8, 20),
          item(9, 200),
        ],
        (a, b) => (a > b ? a : b),
        (a, b) => a * b,
        { time: 0, value: 1 }
      );

      const expected = [
        item(1, 1),
        item(2, 4),
        item(3, 6),
        item(4, 14),
        item(5, 8),
        item(6, 12),
        item(7, 6),
        item(8, 60),
        item(9, 600),
      ];

      expect(mergeTimeValueLists(list1, list2)).toEqual(expected);

      const list3 = makeList([
        item(1, 0),
        item(2, 1),
        item(3, 2),
        item(4, 3),
        item(5, 4),
        item(6, 5),
        item(7, 6),
        item(8, 7),
        item(9, 8),
      ]);

      const expectedAddition = [
        item(1, 1),
        item(2, 5),
        item(3, 8),
        item(4, 17),
        item(5, 12),
        item(6, 17),
        item(7, 12),
        item(8, 67),
        item(9, 608),
      ];

      expect(mergeTimeValueLists(list1, list2, list3)).toEqual(
        expectedAddition
      );
    });
  });
});
