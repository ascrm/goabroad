import { clearAuthToken, setAuthToken } from '@/src/utils/token';

const createAuthModule = ({ apiClient }) => {
  const login = async ({ account, password }) => {
    const response = await apiClient.post('/auth/login', { account, password });

    if (response?.data?.token) {
      await setAuthToken(response.data.token);
    }

    return response;
  };

  const register = async ({ phone, code, password }) => {
    const response = await apiClient.post('/auth/register', {
      phone,
      code,
      password,
    });

    if (response?.data?.token) {
      await setAuthToken(response.data.token);
    }

    return response;
  };

  const logout = async () => {
    const response = await apiClient.post('/auth/logout');
    await clearAuthToken();
    return response;
  };

  const refreshAccessToken = async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });

    if (response?.data?.token) {
      await setAuthToken(response.data.token);
    }

    return response;
  };

  const sendVerificationCode = async ({ phone }) =>
    apiClient.get('/auth/send-sms-code', { params: { phone } });

  const getCurrentUser = async () => apiClient.get('/auth/me');

  return {
    login,
    register,
    logout,
    refreshAccessToken,
    sendVerificationCode,
    getCurrentUser,
  };
};

export default createAuthModule;


