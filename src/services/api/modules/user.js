/**
 * 用户模块 API
 * - 用户偏好设置相关接口
 */

const createUserModule = ({ apiClient }) => {
  // 获取用户详细资料
  const getUserProfile = async () => apiClient.get('/user/profile');
  
  // 更新用户详细资料
  const updateUserProfile = async (profileData) => 
    apiClient.put('/user/profile', profileData);
 
  return {
    getUserProfile,
    updateUserProfile,
  };
};

export default createUserModule;

