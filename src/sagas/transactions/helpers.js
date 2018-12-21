export function asyncMemoize(func) {
  const memoizer = {};

  return async (...args) => {
    const key = args.join();

    if (!memoizer[key]) {
      memoizer[key] = func(...args);
    }

    const value = await memoizer[key];

    return value;
  };
}

export function getHalfwayPoint(startBlockNumber, endBlockNumber) {
  const difference = endBlockNumber - startBlockNumber;

  if (difference <= 1) {
    return null;
  }

  return startBlockNumber + Number.parseInt(difference / 2);
}

export class Queue {
  length = 0;
  _head = null;
  _tail = null;

  makeQueueItem(data) {
    return {
      next: null,
      data,
    };
  }

  push = data => {
    const item = this.makeQueueItem(data);

    if (this._tail) {
      this._tail.next = item;
    }

    if (!this._head) {
      this._head = item;
    }

    this._tail = item;
    this.length = this.length + 1;

    return this.length;
  };

  pop = () => {
    const item = this._head;

    if (item) {
      this._head = item.next;
      this.length = this.length - 1;
      return item.data;
    } else {
      this._tail = null;
      return null;
    }
  };
}

export class RequestLimiter {
  constructor(baseUrl, { numRequests, perTimestamp }, retryOnCondition) {
    this.baseUrl = baseUrl;
    this.numRequests = numRequests;
    this.perTimestamp = perTimestamp;
    this.shouldRetry = retryOnCondition;

    this.requestQueue = new Queue();

    this.currentlyProcessing = false;
  }

  processItem = async ({
    additionalUrlSpecifications,
    fetchOptions,
    resolve,
  }) => {
    try {
      const results = await fetch(
        this.baseUrl + additionalUrlSpecifications,
        fetchOptions
      );
      resolve(results);
    } catch (e) {
      resolve(e);
    }
  };

  processTotalQueue = () => {
    this.currentlyProcessing = true;

    const item = this.requestQueue.pop();
    if (item) {
      this.processItem(item);
    }

    setTimeout(() => {
      if (this.requestQueue.length) {
        this.processTotalQueue();
      } else {
        this.currentlyProcessing = false;
      }
    }, this.perTimestamp / this.numRequests);
  };

  makeRequest = async (additionalUrlSpecifications = '', fetchOptions = {}) => {
    const promise = new Promise(resolve =>
      this.requestQueue.push({
        additionalUrlSpecifications,
        fetchOptions,
        resolve,
      })
    );

    if (!this.currentlyProcessing) {
      this.processTotalQueue();
    }

    const request = await promise;

    if (request.ok) {
      const json = await request.json();
      if (this.shouldRetry(json)) {
        return this.makeRequest(additionalUrlSpecifications, fetchOptions);
      } else {
        return json;
      }
    } else {
      return request;
    }
  };
}
