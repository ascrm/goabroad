const createAuthModule = ({ apiClient }) => {
  /**
   * 用户登录
   * @param {Object} params - 登录参数
   * @param {string} params.account - 手机号或邮箱
   * @param {string} params.password - 密码
   * @returns {Promise} 响应数据，包含 token 和 user 信息
   * 
   * 注意：token 存储由 Redux slice (authSlice) 统一管理，此处不进行存储
   */
  const login = async ({ account, password }) =>
    await apiClient.post('/auth/login', { account, password });


  /**
   * 用户注册
   * @param {Object} params - 注册参数
   * @param {string} params.phone - 手机号
   * @param {string} params.code - 短信验证码
   * @param {string} params.password - 密码
   * @returns {Promise} 响应数据，包含 token
   * 
   * 注意：token 存储由 Redux slice (authSlice) 统一管理，此处不进行存储
   */
  const register = async ({ phone, code, password }) =>
    await apiClient.post('/auth/register', { phone, code, password, });
 
  /**
   * 用户登出
   * @returns {Promise} 响应数据
   * 
   * 注意：token 清除由 Redux slice (authSlice) 统一管理，此处仅调用 API
   */
  const logout = async () => await apiClient.post('/auth/logout');

  /**
   * 刷新访问令牌
   * @param {string} refreshToken - 刷新令牌
   * @returns {Promise} 响应数据，包含新的 token
   * 
   * 注意：token 存储由 Redux slice (authSlice) 统一管理，此处不进行存储
   */
  const refreshAccessToken = async (refreshToken) =>
    await apiClient.post('/auth/refresh', { refreshToken });

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


