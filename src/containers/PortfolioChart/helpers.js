export function transformIntoRunningTotal(arrayOfNumbers) {
  return arrayOfNumbers.reduce(
    (newArray, item, index) => [...newArray, item + (newArray[index - 1] || 0)],
    []
  );
}

const addTogether = (a, b) => a + b;

export function mergeTimeValueLists(...lists) {
  return lists.reduce((fullList, currentOrigList) => {
    const {
      defaultItem = { time: 0, value: 0 },
      sameTimeValueResolver = addTogether,
      aOnBResolver = addTogether,
    } = currentOrigList;

    const currentList = currentOrigList.list.reduce((l, item) => {
      const lastItem = l[l.length - 1];
      if (lastItem && lastItem.time === item.time) {
        return [
          ...l.slice(0, l.length - 1),
          {
            time: item.time,
            value: sameTimeValueResolver(lastItem.value, item.value),
          },
        ];
      } else {
        return [...l, item];
      }
    }, []);

    const newList = [];

    let prevUpToIndex = 0;
    let prevOtherListItem = { ...defaultItem };
    let lastProcessedItem = { ...defaultItem };

    for (let currI = 0; currI < currentList.length; currI++) {
      const currentItem = currentList[currI];
      lastProcessedItem = currentItem;
      let prevItem;

      if (currI === 0) {
        prevItem = { ...defaultItem };
      } else {
        prevItem = currentList[currI - 1];
      }

      const nextHigherTime = fullList.findIndex(
        item => item.time > currentItem.time
      );
      const upToIndex =
        nextHigherTime === -1 ? fullList.length : nextHigherTime;
      const lastMissedIndex = prevUpToIndex;
      prevUpToIndex = upToIndex;

      const missedItems = fullList.slice(lastMissedIndex, upToIndex);

      for (let missedI = 0; missedI < missedItems.length; missedI++) {
        const missedItem = missedItems[missedI];
        if (missedItem !== prevOtherListItem) {
          if (missedItem.time !== currentItem.time) {
            newList.push({
              time: missedItem.time,
              value: aOnBResolver(missedItem.value, prevItem.value),
            });
          }
        }

        prevOtherListItem = missedItem;
      }

      newList.push({
        time: currentItem.time,
        value: aOnBResolver(prevOtherListItem.value, currentItem.value),
      });
    }

    for (let curri = prevUpToIndex; curri < fullList.length; curri++) {
      const missedItem = fullList[curri];
      newList.push({
        time: missedItem.time,
        value: aOnBResolver(lastProcessedItem.value, missedItem.value),
      });
    }

    return newList;
  }, []);
}
