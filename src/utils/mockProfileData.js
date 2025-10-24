/**
 * Mock 数据 - 个人中心
 * 用于开发和测试
 */

export const MOCK_USER_INFO = {
  id: 'user_001',
  avatar: null,
  nickname: '留学追梦人',
  username: 'dreamer2024',
  signature: '一步一个脚印，向着梦想前进 🌟',
  level: 3,
  experience: 450,
  experienceMax: 1000,
  gender: 'female',
  birthday: '2000-05-15',
  location: '北京',
  education: [
    {
      school: '清华大学',
      degree: '本科',
      major: '计算机科学与技术',
      startYear: '2018',
      endYear: '2022',
    },
  ],
};

export const MOCK_MEMBERSHIP = {
  isPro: false,
  expireDate: null,
  benefits: [
    '无限制AI对话次数',
    '专属留学规划方案',
    '深度数据分析报告',
    '优先客服支持',
  ],
};

export const MOCK_STATS = {
  planProgress: 45,
  postsCount: 12,
  favoritesCount: 38,
  likesCount: 156,
};

export const MOCK_SETTINGS = {
  security: {
    hasPassword: true,
    hasPhone: true,
    hasEmail: false,
    phoneNumber: '138****8888',
    email: '',
    linkedAccounts: [],
  },
  privacy: {
    whoCanSeeMyPosts: 'everyone',
    whoCanComment: 'everyone',
    blacklist: [],
  },
  notifications: {
    pushEnabled: true,
    systemNotifications: true,
    interactionNotifications: true,
    planReminders: true,
    communityUpdates: true,
  },
  general: {
    language: 'zh-CN',
    cacheSize: 12582912, // 12 MB
    autoPlayVideo: true,
    dataUsageMode: false,
  },
};

// 初始化 mock 数据到 Redux
export const initializeMockProfileData = (dispatch, actions) => {
  dispatch(actions.setUserInfo(MOCK_USER_INFO));
  dispatch(actions.setMembership(MOCK_MEMBERSHIP));
  dispatch(actions.updateStats(MOCK_STATS));
  
  // 设置是独立管理的，需要单独更新
  dispatch(actions.updateSecurity(MOCK_SETTINGS.security));
  dispatch(actions.updatePrivacy(MOCK_SETTINGS.privacy));
  dispatch(actions.updateNotifications(MOCK_SETTINGS.notifications));
  dispatch(actions.updateGeneral(MOCK_SETTINGS.general));
};

