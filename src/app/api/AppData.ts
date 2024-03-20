import config from '@/app/api/urls/url-config.json';
import Base from '@/app/api/Base';
import { TApiClientPromise } from '@/app/api/types';

export default class AppData extends Base {
  getAllProfessions(): TApiClientPromise {
    return this.apiClient.get(`${config.appData.professions}`);
  }

  setProfession(data: any): TApiClientPromise {
    return this.apiClient.post(config.appData.professions, data);
  }

  getAllGrades(): TApiClientPromise {
    return this.apiClient.get(config.appData.grades);
  }

  getAllCategories(): TApiClientPromise {
    return this.apiClient.get(config.appData.categories);
  }

  getAllQuestions(): TApiClientPromise {
    return this.apiClient.get(config.appData.questions);
  }

  getAllAnswers(): TApiClientPromise {
    return this.apiClient.get(config.appData.answers);
  }
}
