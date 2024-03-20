import Cookies from 'js-cookie';
import { TAuthHeaders } from 'api/types';
import axios, { AxiosResponseHeaders } from 'axios';

const authHeadersKeys = ['access_token', 'refresh_token', 'expiry_time'];

export const setAuthCookies = (headers: TAuthHeaders | AxiosResponseHeaders): void => {
  authHeadersKeys.forEach((authKey) => Cookies.set(authKey, headers[authKey]));
};

export const deleteAuthCookies = (): void => {
  authHeadersKeys.forEach((authKey) => Cookies.remove(authKey));
};

export const setAuthHeaders = (accessToken: string): void => {
  axios.defaults.headers.common.authorization = accessToken;
};

export const updateAuthHeaders = (): void => {
  const accessToken = Cookies.get('access_token');
  if (accessToken) setAuthHeaders(accessToken);
};

export const deleteAuthHeaders = (): void => {
  delete axios.defaults.headers.common.authorization;
};

export const updateHeaders = (headers: TAuthHeaders): void => {
  setAuthHeaders(headers.access_token);
  setAuthCookies(headers);
};

export const removeHeaders = (): void => {
  deleteAuthCookies();
  deleteAuthHeaders();
};

export const setRefreshToken = (refreshToken: string): void => {
  axios.defaults.headers.common.refresh_token = refreshToken;
};

export const deleteRefreshToken = (): void => {
  delete axios.defaults.headers.common.refresh_token;
};
