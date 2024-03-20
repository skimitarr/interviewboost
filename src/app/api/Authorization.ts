import { TApiClientPromise, TAuthSignInData } from 'api/types';
import config from 'api/urls/url-config.json';
import Base from 'api/Base';

export default class Authorizations extends Base {
  signIn(data: TAuthSignInData): TApiClientPromise {
    return this.apiClient.post(config.authorization.signIn, { ...data });
  }

  signOut(): TApiClientPromise {
    return this.apiClient.delete(config.authorization.signOut);
  }

  refreshToken(): TApiClientPromise {
    return this.apiClient.post(config.authorization.refreshToken, {});
  }
}
