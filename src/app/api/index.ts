import ApiClient from '@/app/api/ApiClient';
import { IApi } from '@/app/api/types';
import AppData from '@/app/api/AppData';


export default function getApiClient({ apiPrefix }: { apiPrefix: string }): IApi {
  const api = new ApiClient({ prefix: apiPrefix });
  return {
    appData: new AppData({ apiClient: api })
  };
}
