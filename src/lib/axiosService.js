import axios from 'axios';

class Service {
  constructor() {
    const service = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });
    service.interceptors.response.use(
      response => {
        return response;
      },
      error => this.handleError(error),
    );
    this.service = service;
    this.subscribers = [];
    this.isAlreadyFetchingAccessToken = false;
    this.isTokenExpiredError = true;
  }

  setHeader(name, value) {
    this.service.defaults.headers.common[name] = value;
  }

  removeHeader(name) {
    delete this.service.defaults.headers.common[name];
  }

  handleSuccess(response) {
    return response;
  }

  handleError = error => {
    switch (error.response.status) {
      case 401:
        return this.resetTokenAndReattemptRequest(error);
      default:
        return Promise.reject(error);
    }
  };

  async resetTokenAndReattemptRequest(error) {
    try {
      const { response: errorResponse } = error;
      const retryOriginalRequest = new Promise(resolve => {
        /* We need to add the request retry
        to the queue since there another request
        that already to refresh the token */
        this.addSubscriber(accessToken => {
          errorResponse.config.headers.Authorization = `Bearer ${accessToken}`;
          return resolve(axios(errorResponse.config));
        });
      });
      if (!this.isAlreadyFetchingAccessToken) {
        this.isAlreadyFetchingAccessToken = true;
        const refreshToken = localStorage.getItem(process.env.REFRESH_TOKEN);
        try {
          const response = await axios({
            method: 'POST',
            url: `${process.env.API_ENDPOINT}/api/refresh-token`,
            data: {
              refreshToken,
            },
          });
          const newToken = response.data;
          localStorage.setItem(process.env.TOKEN, newToken);
          this.isAlreadyFetchingAccessToken = false;
          this.service.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          this.onAccessTokenFetched(newToken);
        } catch (err) {
          const { status } = err.response;
          // if (status === 401) {
          localStorage.removeItem(process.env.TOKEN);
          localStorage.removeItem(process.env.REFRESH_TOKEN);
          this.redirectTo(document, '/login');
          // }
          return Promise.reject(err);
        }
      }
      return retryOriginalRequest;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers.forEach(callback => callback(accessToken));
    this.subscribers = [];
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  redirectTo = (document, path) => {
    document.location = path;
  };

  get(endpoint, params) {
    return this.service.get(endpoint, { params });
  }

  post(endpoint, payload) {
    return this.service.request({
      method: 'POST',
      url: endpoint,
      responseType: 'json',
      data: payload,
    });
  }

  patch(endpoint, payload) {
    return this.service.request({
      method: 'PATCH',
      url: endpoint,
      responseType: 'json',
      data: payload,
    });
  }

  put(endpoint, payload) {
    return this.service.request({
      method: 'PUT',
      url: endpoint,
      responseType: 'json',
      data: payload,
    });
  }

  delete(endpoint, payload) {
    return this.service.request({
      method: 'DELETE',
      url: endpoint,
      responseType: 'json',
      data: payload,
    });
  }
}
const service = new Service();

export default service;
