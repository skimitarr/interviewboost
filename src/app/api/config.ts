import apiFactory from './index';
import config from './urls/url-config.json';

const env = process.env.NODE_ENV || 'production';

export default apiFactory({
  apiPrefix: config[env].apiPrefix,
});
