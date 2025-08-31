import Axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios';

export const $axios = () => {
  const runtimeConfig = useRuntimeConfig();

  const headers: any = {};

  const cookieAccessToken = useCookie('access_token');

  if (cookieAccessToken.value) {
    headers.Authorization = `Bearer ${cookieAccessToken.value}`;
  }

  if ($timezone()) {
    headers['X-Timezone'] = $timezone();
  }

  if ($lang()) {
    headers['Accept-Language'] = $lang();
  }

  const onRequest = (req: InternalAxiosRequestConfig) => {
    headers['X-Retry-Count'] = req.headers['X-Retry-Count'] || '0';

    req.headers = headers;

    return req;
  };

  const onResponse = (res: AxiosResponse) => {
    return res.data;
  };

  const onResponseError = async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig;
    const dataError: ApiResponse = error?.response?.data as ApiResponse;

    // Handle refresh token
    if (dataError?.statusCode === 401) {
      if (config.url === '/auth/refresh') {
        await $auth().logout();
        return dataError;
      } else if (config.url !== '/auth/login') {
        const accessToken = await $auth().refreshToken();
        headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    //

    // Handle retry request
    const maxRetry = config.method === 'get' ? 2 : 1;
    let retryCount = +config.headers['X-Retry-Count'] || 0;
    if (retryCount < maxRetry) {
      retryCount++;

      config.headers['X-Retry-Count'] = retryCount.toString();

      if (config.headers['Content-Type'] === 'application/json') {
        if (typeof config.data === 'string') {
          config.data = JSON.parse(config.data);
        }
      }

      return axiosInstance(config);
    }
    //

    return dataError;
  };

  const axiosInstance = Axios.create();

  axiosInstance.defaults.baseURL = runtimeConfig.public.api_url;
  axiosInstance.defaults.timeout = 100000; // 10 minutes
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.interceptors.request.use(onRequest);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);

  return axiosInstance;
};

export const $apiErrorMessage = (res: ApiResponse, message?: string) => {
  if (res.message) {
    return res.message;
  } else if (message) {
    return message;
  } else {
    return $i18n().t('message.error_something_wrong');
  }
};
