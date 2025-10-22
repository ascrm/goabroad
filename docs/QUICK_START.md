# 快速开始 - 登录和注册功能

## 🚀 快速测试

### 1. 启动后端服务器

确保你的后端 API 服务器正在运行在 `http://localhost:8080`。

如果你的后端地址不同，请修改 `src/config/env.js`：

```javascript
development: {
  API_URL: 'http://your-api-url:port/api',
  // ...
}
```

### 2. 启动应用

```bash
npm start
# 或
npx expo start
```

### 3. 测试登录功能

1. 在模拟器或真机中打开应用
2. 导航到登录页面 `/(auth)/login`
3. 输入账号（支持邮箱或手机号）和密码
4. 点击"登录"按钮

**登录成功后：**
- Token 会自动保存到 AsyncStorage
- 用户信息会保存到 Redux Store
- 自动跳转到首页 `/(main)/home`
- 下次打开应用会自动保持登录状态

### 4. 测试注册功能

1. 在登录页面点击"立即注册"
2. 输入手机号
3. 点击"获取验证码"（会调用后端 API）
4. 输入收到的验证码
5. 设置密码（会显示密码强度）
6. 勾选用户协议
7. 点击"注册"按钮

**注册成功后：**
- 自动登录
- 保存 Token 和用户信息
- 跳转到首页

## 📝 后端 API 要求

你的后端需要实现以下接口：

### 1. 登录接口
```
POST /api/auth/login
Body: { email, password }
Response: { data: { token, refreshToken, user, expiresIn } }
```

### 2. 注册接口
```
POST /api/auth/register
Body: { phone, verificationCode, password }
Response: { data: { token, refreshToken, user, expiresIn } }
```

### 3. 发送验证码
```
POST /api/auth/send-code
Body: { phone, type }
Response: { data: { success, message } }
```

### 4. 刷新 Token
```
POST /api/auth/refresh
Body: { refreshToken }
Response: { data: { token, refreshToken, expiresIn } }
```

### 5. 登出
```
POST /api/auth/logout
Headers: Authorization: Bearer {token}
Response: { data: { success } }
```

## 🔧 自定义配置

### 修改 API 基础地址

编辑 `src/config/env.js`：

```javascript
const config = {
  development: {
    API_URL: 'http://192.168.1.100:8080/api',  // 修改为你的地址
    TIMEOUT: 30000,
  },
};
```

### 修改 Token 存储策略

编辑 `src/store/index.js`：

```javascript
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', 'refreshToken', 'userInfo', 'isLoggedIn'],
  // 添加或移除需要持久化的字段
};
```

### 修改响应数据结构

如果你的后端响应格式不同，修改 `src/store/slices/authSlice.js`：

```javascript
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      
      // 根据你的响应格式调整
      return {
        token: response.data.token,           // 或 response.token
        refreshToken: response.data.refreshToken,
        userInfo: response.data.user,         // 或 response.user
        expiresIn: response.data.expiresIn || 3600,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## 🐛 调试技巧

### 查看网络请求

在 Chrome DevTools 或 React Native Debugger 中查看网络请求：

```javascript
// 在 src/services/api/interceptors.js 中添加日志
console.log('Request:', config.url, config.data);
console.log('Response:', response.data);
```

### 查看 Redux State

使用 Redux DevTools 或在组件中打印：

```javascript
import { useAppSelector } from '@/src/store/hooks';

function DebugComponent() {
  const auth = useAppSelector(state => state.auth);
  console.log('Auth State:', auth);
  
  return null;
}
```

### 清除持久化数据

如果需要清除所有存储的数据：

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor } from '@/src/store';

// 清除 Redux Persist
persistor.purge();

// 或清除所有 AsyncStorage
AsyncStorage.clear();
```

## ⚠️ 常见问题

### 问题 1: 网络请求失败

**症状:** 登录时提示"网络连接失败"

**解决方案:**
1. 检查后端服务器是否正在运行
2. 检查 `src/config/env.js` 中的 API_URL 是否正确
3. 如果使用真机测试，确保手机和电脑在同一网络，并使用局域网 IP 地址

### 问题 2: Token 未保存

**症状:** 关闭应用后重新打开需要重新登录

**解决方案:**
1. 检查 Redux Persist 是否正确配置
2. 查看 `src/store/index.js` 中 `authPersistConfig` 的 `whitelist` 配置
3. 确保在 `app/_layout.jsx` 中使用了 `PersistGate`

### 问题 3: 响应数据格式错误

**症状:** 登录成功但应用报错

**解决方案:**
1. 检查后端返回的数据格式是否符合要求
2. 在 `src/store/slices/authSlice.js` 中调整数据解析逻辑
3. 使用 `console.log` 打印响应数据查看实际格式

## 📚 更多文档

- [完整 API 集成文档](./API_INTEGRATION.md)
- [状态管理说明](../src/store/README.md)
- [组件使用文档](../src/components/README.md)

---

**提示:** 这是一个基础实现，你可以根据实际需求进行扩展和定制。

