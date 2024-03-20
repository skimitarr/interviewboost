import { AxiosResponse } from 'axios';
import AppData from '@/app/api/AppData';

export interface IApi {
  appData: AppData,
}

export type TAuthSignInData = {
  email: string;
  password: string;
};

export type TAuthHeaders = {
  access_token: string;
  refresh_token: string;
  expiry_time: string;
};

export type TApiClientResponseError = {
  statusCode: number,
  messageCode: string,
  errorData?: Array<Record<string, unknown>>,
  status: string,
  toString: () => string,
};

export interface IApiError {
  error: TApiClientResponseError;
}
export type TApiClientPromise = Promise<AxiosResponse | IApiError>;
