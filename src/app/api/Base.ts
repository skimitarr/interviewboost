import ApiClient from './ApiClient';

class Base {
  public apiClient: ApiClient;

  constructor({ apiClient }: { apiClient: ApiClient }) {
    if (!apiClient) throw new Error('[apiClient] required');
    this.apiClient = apiClient;
  }
}

export default Base;
