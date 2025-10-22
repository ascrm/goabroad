# API 集成文档

## 概述

本文档说明了 GoAbroad 应用中登录和注册功能的 API 集成实现。

## 功能特性

### ✅ 已实现功能

1. **用户登录**
   - 支持邮箱登录
   - 支持手机号登录
   - 自动保存登录状态
   - Token 自动刷新机制

2. **用户注册**
   - 手机号注册
   - 验证码验证
   - 密码强度检测
   - 注册成功自动登录

3. **状态管理**
   - Redux Toolkit 状态管理
   - Redux Persist 持久化存储
   - 自动保存 token 和用户信息

4. **API 拦截器**
   - 自动添加 Authorization 头
   - Token 过期自动刷新
   - 统一错误处理
   - 网络错误提示

## 技术架构

### 文件结构

```
src/
├── config/
│   └── env.js                      # 环境配置
├── services/
│   └── api/
│       ├── client.js               # Axios 客户端配置
│       ├── interceptors.js         # 请求/响应拦截器
│       ├── index.js                # API 统一导出
│       └── modules/
│           └── authApi.js          # 认证相关 API
├── store/
│   ├── index.js                    # Redux Store 配置
│   └── slices/
│       └── authSlice.js            # 认证状态管理
app/
└── (auth)/
    ├── login.jsx                   # 登录页面
    └── register.jsx                # 注册页面
```

### 数据流

```
登录/注册页面
    ↓
dispatch(loginUser/registerUser)
    ↓
authSlice (Redux Thunk)
    ↓
authApi (API 调用)
    ↓
axios interceptors (添加 token、处理错误)
    ↓
后端 API
    ↓
响应处理 & 状态更新
    ↓
Redux Persist (持久化存储)
```

## API 接口

### 1. 登录接口

**邮箱登录**
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1...",
    "expiresIn": 3600,
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "用户名",
      "avatar": "https://...",
      "level": 1,
      "points": 100
    }
  }
}
```

### 2. 注册接口

```javascript
POST /api/auth/register
Content-Type: application/json

{
  "phone": "13800138000",
  "verificationCode": "123456",
  "password": "password123"
}

Response:
{
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1...",
    "expiresIn": 3600,
    "user": {
      "id": "123",
      "phone": "13800138000",
      "name": "用户",
      "avatar": null,
      "level": 1,
      "points": 0
    }
  }
}
```

### 3. 发送验证码

```javascript
POST /api/auth/send-code
Content-Type: application/json

{
  "phone": "13800138000",
  "type": "register"  // 或 "login", "reset"
}

Response:
{
  "data": {
    "success": true,
    "message": "验证码已发送"
  }
}
```

### 4. 刷新 Token

```javascript
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1..."
}

Response:
{
  "data": {
    "token": "eyJhbGciOiJIUzI1...",
    "refreshToken": "eyJhbGciOiJIUzI1...",
    "expiresIn": 3600
  }
}
```

### 5. 登出

```javascript
POST /api/auth/logout
Authorization: Bearer {token}

Response:
{
  "data": {
    "success": true,
    "message": "登出成功"
  }
}
```

## 使用示例

### 在组件中使用登录

```javascript
import { useAppDispatch } from '@/src/store/hooks';
import { loginUser } from '@/src/store/slices/authSlice';

function LoginComponent() {
  const dispatch = useAppDispatch();
  
  const handleLogin = async (email, password) => {
    try {
      const result = await dispatch(loginUser({ 
        email, 
        password 
      })).unwrap();
      
      console.log('登录成功:', result);
      // 跳转到首页
      router.replace('/(main)/home');
    } catch (error) {
      console.error('登录失败:', error);
    }
  };
  
  return (
    // ...
  );
}
```

### 在组件中使用注册

```javascript
import { useAppDispatch } from '@/src/store/hooks';
import { registerUser } from '@/src/store/slices/authSlice';
import { authApi } from '@/src/services/api';

function RegisterComponent() {
  const dispatch = useAppDispatch();
  
  // 发送验证码
  const sendCode = async (phone) => {
    try {
      await authApi.sendVerificationCode({ 
        phone, 
        type: 'register' 
      });
      console.log('验证码已发送');
    } catch (error) {
      console.error('发送失败:', error);
    }
  };
  
  // 注册
  const handleRegister = async (phone, code, password) => {
    try {
      const result = await dispatch(registerUser({
        phone,
        verificationCode: code,
        password,
      })).unwrap();
      
      console.log('注册成功:', result);
      // 跳转到首页（已自动登录）
      router.replace('/(main)/home');
    } catch (error) {
      console.error('注册失败:', error);
    }
  };
  
  return (
    // ...
  );
}
```

### 获取当前登录状态

```javascript
import { useAppSelector } from '@/src/store/hooks';

function ProfileComponent() {
  const { isLoggedIn, userInfo } = useAppSelector(state => state.auth);
  
  if (!isLoggedIn) {
    return <Text>请先登录</Text>;
  }
  
  return (
    <View>
      <Text>欢迎, {userInfo.name}</Text>
      <Text>积分: {userInfo.points}</Text>
    </View>
  );
}
```

### 直接调用 API

```javascript
import { authApi } from '@/src/services/api';

// 检查邮箱是否存在
const checkEmail = async (email) => {
  try {
    const result = await authApi.checkEmailExists(email);
    console.log('邮箱存在:', result.data.exists);
  } catch (error) {
    console.error('检查失败:', error);
  }
};

// 获取当前用户信息
const getCurrentUser = async () => {
  try {
    const result = await authApi.getCurrentUser();
    console.log('用户信息:', result.data);
  } catch (error) {
    console.error('获取失败:', error);
  }
};
```

## 环境配置

在 `src/config/env.js` 中配置不同环境的 API 地址：

```javascript
const config = {
  development: {
    API_URL: 'http://localhost:8080/api',
    TIMEOUT: 30000,
  },
  production: {
    API_URL: 'https://api.goabroad.com/api',
    TIMEOUT: 30000,
  },
};
```

应用会根据 `__DEV__` 自动选择对应的配置。

## 错误处理

拦截器会自动处理以下错误：

1. **网络错误** - 显示"网络连接失败"提示
2. **401 未授权** - 自动刷新 token，失败则退出登录
3. **403 禁止访问** - 显示"没有权限"提示
4. **404 未找到** - 返回"资源不存在"错误
5. **500 服务器错误** - 显示"服务器错误"提示

所有错误都会返回统一格式：

```javascript
{
  code: 'ERROR_CODE',
  message: '错误信息',
  data: {...},
  originalError: Error
}
```

## 安全性

1. **Token 存储**
   - Access Token 存储在 Redux Store 和 AsyncStorage
   - Refresh Token 仅存储在 Redux Store（由 Redux Persist 持久化）

2. **自动刷新**
   - Token 过期时自动使用 Refresh Token 刷新
   - 刷新失败自动退出登录

3. **请求签名**
   - 所有需要认证的请求自动添加 `Authorization: Bearer {token}` 头

## 后续开发建议

### 待实现功能

1. **第三方登录**
   - 微信登录
   - Apple 登录
   - QQ 登录

2. **密码重置**
   - 忘记密码
   - 邮箱验证
   - 重置密码

3. **账号安全**
   - 修改密码
   - 绑定/解绑手机号
   - 绑定/解绑邮箱

4. **实名认证**
   - 身份证验证
   - 护照验证

### 优化建议

1. **性能优化**
   - 实现请求缓存
   - 添加请求去重
   - 优化重试机制

2. **用户体验**
   - 添加加载动画
   - 优化错误提示
   - 实现离线模式

3. **安全增强**
   - 实现请求加密
   - 添加设备指纹
   - 实现防重放攻击

## 测试

### 单元测试示例

```javascript
import { loginUser, registerUser } from '@/src/store/slices/authSlice';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureMockStore([thunk]);

describe('Auth Actions', () => {
  it('should handle login success', async () => {
    const store = mockStore({});
    const credentials = { email: 'test@test.com', password: '123456' };
    
    await store.dispatch(loginUser(credentials));
    
    const actions = store.getActions();
    expect(actions[0].type).toBe('auth/loginUser/pending');
    expect(actions[1].type).toBe('auth/loginUser/fulfilled');
  });
});
```

## 常见问题

### Q: Token 刷新失败怎么办？
A: 拦截器会自动清除认证状态并退出登录，用户需要重新登录。

### Q: 如何修改 API 地址？
A: 修改 `src/config/env.js` 中对应环境的 `API_URL` 配置。

### Q: 如何添加新的 API？
A: 在 `src/services/api/modules/` 下创建新的 API 模块，并在 `index.js` 中导出。

### Q: 如何处理并发请求时的 token 刷新？
A: 拦截器已实现请求队列机制，当 token 正在刷新时，其他请求会等待刷新完成后重试。

## 相关文档

- [Redux Toolkit 文档](https://redux-toolkit.js.org/)
- [Redux Persist 文档](https://github.com/rt2zz/redux-persist)
- [Axios 文档](https://axios-http.com/)
- [React Hook Form 文档](https://react-hook-form.com/)

---

**最后更新:** 2025-10-22
**维护者:** GoAbroad 开发团队

