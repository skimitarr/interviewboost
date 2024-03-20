import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, ResponseType, AxiosResponseHeaders } from 'axios';
import pathOr from 'ramda/es/pathOr';
import {
  deleteRefreshToken,
  removeHeaders,
  setAuthCookies,
  setRefreshToken,
  updateAuthHeaders,
} from '@/app/api/headers';
import { IApiError, TApiClientPromise } from '@/app/api/types';
import moment from 'moment';
import Cookies from 'js-cookie';
import config from '@/app/api/urls/url-config.json';

class ApiClient {
  private readonly prefix: string;

  constructor({ prefix = 'localhost:3001/api' } = {}) {
    this.prefix = prefix;
    axios.defaults.headers.common['Content-Type'] ='application/x-www-form-urlencoded';
    updateAuthHeaders();
  }

  get(requestUrl: string, params = {}, responseType: ResponseType = 'json'): TApiClientPromise {
    return request({
      requestUrl,
      method: 'get',
      params,
      prefix: this.prefix,
      responseType,
    });
  }

  put(requestUrl: string, payload = {}): TApiClientPromise {
    return request({
      requestUrl,
      method: 'put',
      data: payload,
      prefix: this.prefix,
    });
  }

  post(requestUrl: string, payload = {}): TApiClientPromise {
    return request({
      requestUrl,
      method: 'post',
      data: payload,
      prefix: this.prefix,
    });
  }

  delete(requestUrl: string, params = {}): TApiClientPromise {
    return request({
      requestUrl,
      method: 'delete',
      params,
      prefix: this.prefix,
    });
  }
}

async function request({
  requestUrl, method, data = {}, params = {}, cancelToken, prefix, responseType = 'json',
}: AxiosRequestConfig & { prefix : string, requestUrl: string }): TApiClientPromise {
  const threeUnixMin = 180;
  const currentDate = moment(new Date()).unix();
  const refreshTokenValue = Cookies.get('refresh_token');
  const expiryDate = Number(Cookies.get('expiry_time'));
  const url = `${prefix}${requestUrl}`;
  console.log(axios.defaults.headers);
  if ((currentDate + threeUnixMin) > expiryDate && refreshTokenValue) {
    setRefreshToken(refreshTokenValue);
    try {
      const response: AxiosResponse = await axios.get(`${prefix}${config.authorization.refreshToken}`);
      setAuthCookies(response.headers as AxiosResponseHeaders);
      updateAuthHeaders();
    } catch (error) {
      console.warn(error.message); // eslint-disable-line no-console
      removeHeaders();
    } finally {
      deleteRefreshToken();
    }
  }
  return requestAxios({
    url, method, data, params, cancelToken, responseType,
  });
}

function requestAxios({
  url, method, data, params = {}, cancelToken, responseType,
}: AxiosRequestConfig): TApiClientPromise {
  return axios({
    method,
    url,
    params,
    data,
    cancelToken,
    responseType
  })
    .then((response: AxiosResponse): AxiosResponse => response,
      (xhr: AxiosError): IApiError => {
        const response = {
          error: {
            statusCode: pathOr(500, ['response', 'status'],xhr),
            messageCode: pathOr('', ['response', 'data', 'messageCode'],xhr),
            errorData: pathOr([], ['response', 'data', 'errorData'],xhr),
            status: 'error',
          },
        };
        response.error.toString = () => {
          let result = 'Bad response from server';
          if (xhr && xhr.response && xhr.response.data) {
            const { errorMessage, message } = xhr.response.data;
            result = message || errorMessage || xhr.message;
          } else {
            result = xhr.message;
          }
          return result;
        };
        return response;
      });
}

export default ApiClient;
