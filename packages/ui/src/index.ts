export * from './button';

export const getApiUrl = () => {
  return process.env.EO_CLOUD_API_DOMAIN || '';
};
