import axios from 'axios';

const onSuccess = function(response) {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.debug('Request Successful!', response);
  }

  return response.data;
};

const onError = function(error) {
  // const contentType = response.headers.get("content-type");
  // if (contentType && contentType.indexOf("application/json") !== -1) {
  //   return response.json();
  // } else {
  //   return response.text();
  // }

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn('Request Failed:', error.config);
  }

  if (error.response) {
    // Request was made but server responded with something
    // other than 2xx

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn({
        'Status:': error.response.status,
        'Data:': error.response.data,
        'Headers:': error.response.headers,
      });
    }
  } else {
    // Something else happened while setting up the request
    // triggered the error
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn('Error Message:', error.message);
    }
  }

  return Promise.reject(error.response.data || error.response || error.message);
};

const api = {
  async get(url, options = {}) {
    return axios({
      url: url,
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      withCredentials: true,
      ...options,
    })
      .then(onSuccess)
      .catch(onError);
  },

  async post(url, body, options = {}) {
    return axios({
      url: url,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: body && JSON.stringify(body),
      ...options,
    })
      .then(onSuccess)
      .catch(onError);
  },

  async put(url, body, options = {}) {
    return axios({
      url: url,
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      data: body && JSON.stringify(body),
      ...options,
    })
      .then(onSuccess)
      .catch(onError);
  },

  async delete(url, options = {}) {
    return axios({
      url: url,
      method: 'DELETE',
      withCredentials: true,
      ...options,
    })
      .then(onSuccess)
      .catch(onError);
  },
};

export default api;
