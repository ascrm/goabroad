import { logFormattedData, maskSensitiveData } from '@/src/utils/logger';
import { clearAuthToken, getAuthToken } from '@/src/utils/token';

let storeRef;
let interceptorsInitialized = false;

export const injectStore = (providedStore) => {
  storeRef = providedStore;
};


//请求拦截器
const attachRequestInterceptor = (apiClient) => {
  apiClient.interceptors.request.use(
    async (config) => {
      config.metadata = { startTime: Date.now() };

      try {
        const token = await getAuthToken();
        if (token) {
          config.headers = {
            ...(config.headers || {}),
            Authorization: token,
          };
        }
      } catch (error) {
        console.warn('[API] 读取 token 失败:', error);
      }
      requestLog(config);

      return config;
    },
    (error) => {
      console.error('[API Request Error]', {
        message: error.message,
        config: error.config
          ? {
              method: error.config.method?.toUpperCase(),
              url: `${error.config.baseURL}${error.config.url}`,
            }
          : null,
      });
      return Promise.reject(error);
    },
  );
};

//响应拦截器
const attachResponseInterceptor = (apiClient) => {
  apiClient.interceptors.response.use(
    (response) => {
      const duration = response.config.metadata?.startTime
        ? Date.now() - response.config.metadata.startTime
        : null;

      const responseData = response.data;

      if (responseData && typeof responseData === 'object' && 'code' in responseData) {
        if (responseData.code !== 200) {
          logResponseBusinessError({
            ...getRequestMeta(response.config),
            status: response.status,
            code: responseData.code,
            duration,
            message: responseData.message,
            data: responseData,
            label: '[API Response Error]',
          });

          const error = new Error(responseData.message || '请求失败');
          error.code = responseData.code;
          error.response = response;
          return Promise.reject(error);
        }

        const successResponse = {
          ...response,
          data: responseData.data,
          _raw: responseData,
        };

        logResponseSuccess({
          ...getRequestMeta(response.config),
          status: response.status,
          code: responseData.code,
          duration,
          message: responseData.message,
          data: responseData.data,
        });

        return successResponse;
      }

      logPlainResponse({
        ...getRequestMeta(response.config),
        status: response.status,
        duration,
        data: response.data,
      });

      return response;
    },
    async (error) => {
      const status = error?.response?.status;
      const responseData = error?.response?.data;
      const config = error?.config;
      const duration = config?.metadata?.startTime
        ? Date.now() - config.metadata.startTime
        : null;

      if (responseData && typeof responseData === 'object' && 'code' in responseData) {
        logResponseBusinessError({
          ...getRequestMeta(config),
          status,
          code: responseData.code,
          duration,
          message: responseData.message,
          data: responseData,
          label: '[API Response Business Error]',
        });

        const businessError = new Error(responseData.message || '请求失败');
        businessError.code = responseData.code;
        businessError.response = error.response;

        if (responseData.code === 40101 || status === 401 || status === 403) {
          console.warn('[API] 认证失效，清除本地状态');
          await clearAuthToken();
          if (storeRef) {
            storeRef.dispatch({ type: 'auth/clearAuth' });
          } else {
            console.warn('[API] store 未注入，无法派发清除认证动作');
          }
        }

        return Promise.reject(businessError);
      }

      logResponseHttpError({
        ...getRequestMeta(config),
        status,
        statusText: error?.response?.statusText,
        duration,
        message: error.message,
        data: responseData,
      });

      if (status === 401 || status === 403) {
        console.warn('[API] 认证失效，清除本地状态');
        await clearAuthToken();
        if (storeRef) {
          storeRef.dispatch({ type: 'auth/clearAuth' });
        } else {
          console.warn('[API] store 未注入，无法派发清除认证动作');
        }
      }

      if (!error.response) {
        console.error('[API Network Error]', {
          method: config?.method?.toUpperCase(),
          url: config ? `${config.baseURL}${config.url}` : 'unknown',
          message: error.message,
          code: error.code,
        });
      }

      return Promise.reject(error);
    },
  );
};

export const setupApiInterceptors = (apiClient) => {
  if (interceptorsInitialized) {
    return;
  }

  attachRequestInterceptor(apiClient);
  attachResponseInterceptor(apiClient);
  interceptorsInitialized = true;
};


const requestLog = (config) => {
  const method = config.method?.toUpperCase();
  const fullURL = `${config.baseURL}${config.url}`;
  console.log(`\n[API Request] ${method} ${fullURL}`);
  console.log('-----------------------请求参数-----------------');
  if (config.params) {
    logFormattedData('Query Params', config.params);
  }
  if (config.data) {
    logFormattedData('Request Body', config.data);
  }
  const maskedHeaders = maskSensitiveData(config.headers);
  if (maskedHeaders && Object.keys(maskedHeaders).length > 0) {
    logFormattedData('Headers', maskedHeaders);
  }
  console.log('------------------------------------------------\n');
};

const logResponseSuccess = ({ method, fullURL, status, code, duration, message, data }) => {
  console.log(`\n[API Response Success] ${method} ${fullURL}`);
  console.log(`Status: ${status} | Code: ${code} | Duration: ${formatDuration(duration)}`);
  console.log('-----------------------响应日志-----------------');
  if (message) {
    console.log(`Message: ${message}`);
  }
  logFormattedData('Response Data', data);
  console.log('------------------------------------------------\n');
};

const logResponseBusinessError = ({ method, fullURL, status, code, duration, message, data, label }) => {
  const tag = label || '[API Response Error]';
  console.error(`\n${tag} ${method} ${fullURL}`);
  console.error(`Status: ${status} | Code: ${code} | Duration: ${formatDuration(duration)}`);
  console.error('-----------------------响应日志-----------------');
  console.error(`Message: ${message || 'N/A'}`);
  logFormattedData('Response Data', data);
  console.error('------------------------------------------------\n');
};

const logResponseHttpError = ({ method, fullURL, status, statusText, duration, message, data }) => {
  console.error(`\n[API Response HTTP Error] ${method} ${fullURL}`);
  console.error(
    `Status: ${status} | StatusText: ${statusText || 'N/A'} | Duration: ${formatDuration(duration)}`,
  );
  console.error('-----------------------响应日志-----------------');
  console.error(`Message: ${message}`);
  if (data) {
    logFormattedData('Response Data', data);
  }
  console.error('------------------------------------------------\n');
};

const logPlainResponse = ({ method, fullURL, status, duration, data }) => {
  console.log(`\n[API Response] ${method} ${fullURL}`);
  console.log(`Status: ${status} | Duration: ${formatDuration(duration)}`);
  console.log('-----------------------响应日志-----------------');
  logFormattedData('Response Data', data);
  console.log('------------------------------------------------\n');
};

const getRequestMeta = (config) => ({
  method: config?.method?.toUpperCase(),
  fullURL: config ? `${config.baseURL}${config.url}` : 'unknown',
});

const formatDuration = (duration) => (duration ? `${duration}ms` : 'N/A');