# 个人中心模块 - 快速开始

## 1. 文件结构

```
goabroad2/
├── app/
│   ├── (tabs)/
│   │   └── profile.jsx                    # 个人中心主页
│   └── profile/
│       ├── edit.jsx                       # 编辑资料
│       ├── settings.jsx                   # 设置
│       ├── notifications.jsx              # 通知设置
│       ├── my-plans.jsx                   # 我的计划
│       ├── my-posts.jsx                   # 我的发布
│       └── my-favorites.jsx               # 我的收藏
│
├── src/
│   ├── components/
│   │   └── profile/
│   │       ├── UserHeader.jsx             # 用户头部组件
│   │       ├── MembershipCard.jsx         # 会员卡片组件
│   │       └── MenuList.jsx               # 菜单列表组件
│   │
│   ├── store/
│   │   └── slices/
│   │       └── profileSlice.js            # Redux Slice
│   │
│   └── utils/
│       └── mockProfileData.js             # Mock 数据
│
└── docs/
    ├── PROFILE_MODULE_README.md           # 详细文档
    └── PROFILE_QUICKSTART.md              # 本文件
```

## 2. 快速集成

### 2.1 确认 Redux Store 配置

`src/store/index.js` 应该已经包含 profileSlice：

```javascript
import profileSlice from './slices/profileSlice';

const rootReducer = combineReducers({
  // ... 其他 reducers
  profile: profileSlice,
  // ...
});
```

### 2.2 使用个人中心功能

在任何组件中使用：

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, updateNickname } from '@/src/store/slices/profileSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const handleUpdate = () => {
    dispatch(updateNickname('新昵称'));
  };

  return (
    <View>
      <Text>{userInfo.nickname}</Text>
      <Button onPress={handleUpdate} title="更新昵称" />
    </View>
  );
}
```

### 2.3 导航到个人中心页面

```javascript
import { useRouter } from 'expo-router';

function SomeComponent() {
  const router = useRouter();

  // 跳转到主页
  router.push('/profile');

  // 跳转到编辑资料
  router.push('/profile/edit');

  // 跳转到设置
  router.push('/profile/settings');
}
```

## 3. Mock 数据使用

在开发环境自动加载 Mock 数据：

```javascript
// app/(tabs)/profile.jsx 中已包含
import { initializeMockProfileData } from '@/src/utils/mockProfileData';

useEffect(() => {
  if (__DEV__ && !userInfo.id) {
    initializeMockProfileData(dispatch, {
      setUserInfo,
      setMembership,
      updateStats,
      // ... 其他 actions
    });
  }
}, []);
```

## 4. 常用功能示例

### 4.1 更新用户头像

```javascript
import { updateAvatar } from '@/src/store/slices/profileSlice';
import * as ImagePicker from 'expo-image-picker';

const pickAndUploadAvatar = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    // 上传到服务器
    const uploadedUrl = await uploadToServer(result.assets[0].uri);
    
    // 更新 Redux
    dispatch(updateAvatar(uploadedUrl));
  }
};
```

### 4.2 更新用户信息

```javascript
import { setUserInfo } from '@/src/store/slices/profileSlice';

const saveProfile = () => {
  dispatch(setUserInfo({
    nickname: '新昵称',
    signature: '新签名',
    location: '上海',
  }));
};
```

### 4.3 管理会员状态

```javascript
import { setMembership } from '@/src/store/slices/profileSlice';

const activateMembership = () => {
  dispatch(setMembership({
    isPro: true,
    expireDate: '2025-12-31',
  }));
};
```

### 4.4 更新统计数据

```javascript
import { 
  updateStats, 
  incrementPostsCount 
} from '@/src/store/slices/profileSlice';

// 发布帖子后
dispatch(incrementPostsCount());

// 批量更新
dispatch(updateStats({
  postsCount: 15,
  favoritesCount: 42,
  likesCount: 200,
}));
```

### 4.5 管理通知设置

```javascript
import { updateNotifications } from '@/src/store/slices/profileSlice';

const toggleNotification = (enabled) => {
  dispatch(updateNotifications({
    pushEnabled: enabled,
    systemNotifications: enabled,
  }));
};
```

## 5. 组件使用示例

### 5.1 UserHeader 组件

```javascript
import UserHeader from '@/src/components/profile/UserHeader';

<UserHeader
  avatar={userInfo.avatar}
  nickname={userInfo.nickname}
  signature={userInfo.signature}
  level={userInfo.level}
  experience={userInfo.experience}
  experienceMax={userInfo.experienceMax}
  onEditPress={() => router.push('/profile/edit')}
  onAvatarPress={handleAvatarUpload}
/>
```

### 5.2 MembershipCard 组件

```javascript
import MembershipCard from '@/src/components/profile/MembershipCard';

<MembershipCard
  isPro={membership.isPro}
  expireDate={membership.expireDate}
  onUpgrade={handleUpgrade}
/>
```

### 5.3 MenuList 组件

```javascript
import MenuList from '@/src/components/profile/MenuList';

const menuItems = [
  {
    id: 'settings',
    icon: 'settings-outline',
    label: '设置',
    iconBg: COLORS.gray[100],
    iconColor: COLORS.gray[600],
    route: '/profile/settings',
  },
  { type: 'divider' },
  {
    id: 'about',
    icon: 'information-circle-outline',
    label: '关于我们',
    rightText: 'v1.0.0',
  },
];

<MenuList 
  items={menuItems} 
  onItemPress={(item) => {
    if (item.route) {
      router.push(item.route);
    }
  }} 
/>
```

## 6. Redux Selectors

使用预定义的 selectors 获取状态：

```javascript
import {
  selectUserInfo,
  selectMembership,
  selectStats,
  selectSettings,
  selectNotificationSettings,
  selectPrivacySettings,
  selectSecuritySettings,
} from '@/src/store/slices/profileSlice';

const userInfo = useSelector(selectUserInfo);
const membership = useSelector(selectMembership);
const stats = useSelector(selectStats);
const notifications = useSelector(selectNotificationSettings);
```

## 7. 样式定制

所有组件使用 `@/src/constants` 中的颜色系统：

```javascript
import { COLORS } from '@/src/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray[50],
  },
  text: {
    color: COLORS.gray[900],
  },
  button: {
    backgroundColor: COLORS.primary[600],
  },
});
```

## 8. API 集成建议

将来集成真实 API 时，建议创建以下服务：

```javascript
// src/services/profileService.js
export const profileService = {
  // 获取用户信息
  async getUserInfo() {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // 更新用户信息
  async updateUserInfo(data) {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  // 上传头像
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/user/avatar', formData);
    return response.data;
  },

  // 获取统计数据
  async getStats() {
    const response = await api.get('/user/stats');
    return response.data;
  },
};
```

然后在组件中使用：

```javascript
import { profileService } from '@/src/services/profileService';
import { setUserInfo } from '@/src/store/slices/profileSlice';

const loadProfile = async () => {
  try {
    const userInfo = await profileService.getUserInfo();
    dispatch(setUserInfo(userInfo));
  } catch (error) {
    console.error('加载用户信息失败:', error);
  }
};
```

## 9. 常见问题

### Q: 为什么看不到用户数据？
A: 检查是否在开发环境（`__DEV__`），Mock 数据会自动加载。生产环境需要调用 API。

### Q: 如何清除所有个人中心数据？
A: 使用 `resetProfile` action：
```javascript
import { resetProfile } from '@/src/store/slices/profileSlice';
dispatch(resetProfile());
```

### Q: 如何持久化某些设置？
A: Redux Persist 已配置，数据会自动持久化到 AsyncStorage。

### Q: 如何自定义等级系统？
A: 修改 `UserHeader.jsx` 中的 `LEVEL_CONFIG` 对象。

### Q: 图片上传失败怎么办？
A: 检查权限是否已授予，并确保图片格式和大小符合要求。

## 10. 下一步

1. **集成真实 API**: 替换所有 Mock 数据和 TODO 标记的地方
2. **添加测试**: 为组件和 Redux 逻辑添加单元测试
3. **性能优化**: 使用 React.memo、useMemo 等优化渲染
4. **错误处理**: 添加全局错误边界和提示
5. **国际化**: 添加多语言支持

## 参考资料

- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [Expo Router 文档](https://docs.expo.dev/router/introduction/)
- [Expo Image Picker 文档](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [React Native Progress 文档](https://github.com/oblador/react-native-progress)

---

**需要帮助？** 查看 `PROFILE_MODULE_README.md` 获取详细文档。

