export * from "./button";

export const getApiUrl = () => {
  return process.env.VITE_APP_CLOUD_API_DOMAIN || "";
};
