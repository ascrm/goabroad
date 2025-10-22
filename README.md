# GoAbroad - 留学规划助手

> 一站式留学规划与信息服务平台

[![Expo](https://img.shields.io/badge/Expo-v50+-000020?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-v0.73+-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat&logo=redux)](https://redux-toolkit.js.org)

## ✨ 特性

- 🔐 **完善的认证系统** - 登录、注册、密码找回
- 🎨 **精美的 UI 设计** - 现代化界面，流畅动画
- 📱 **跨平台支持** - iOS、Android、Web
- 🔄 **状态持久化** - Redux Persist 本地存储
- ✅ **严格的表单验证** - React Hook Form + Yup
- 🌐 **完整的 API 集成** - Axios + 拦截器
- 📦 **组件化开发** - 丰富的 UI 组件库

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn
- Expo CLI
- iOS 模拟器 / Android 模拟器 / Expo Go

### 安装

```bash
# 克隆项目
git clone <repository-url>

# 进入项目目录
cd goabroad2

# 安装依赖
npm install
```

### 运行

```bash
# 启动开发服务器
npx expo start

# iOS
npx expo start --ios

# Android
npx expo start --android

# Web
npx expo start --web
```

## 📖 文档

- [快速启动指南](./docs/快速启动指南.md) - 新手入门必读
- [认证系统实现总结](./docs/认证系统实现总结.md) - 认证功能详解
- [路径别名配置](./docs/路径别名配置.md) - 模块导入规范
- [组件文档](./src/components/README.md) - UI 组件使用指南

## 📁 项目结构

```
goabroad2/
├── app/                    # 页面路由 (Expo Router)
│   ├── (auth)/            # 认证相关页面
│   ├── (main)/            # 主应用页面
│   ├── (tabs)/            # 标签页导航
│   └── index.jsx          # 应用入口
├── src/                   # 源代码
│   ├── components/        # UI 组件库
│   │   ├── ui/           # 基础 UI 组件
│   │   ├── form/         # 表单组件
│   │   └── layout/       # 布局组件
│   ├── store/            # Redux Store
│   │   ├── index.js      # Store 配置
│   │   ├── hooks.js      # 自定义 Hooks
│   │   └── slices/       # State Slices
│   ├── services/         # API 服务
│   │   └── api/          # API 客户端和模块
│   ├── utils/            # 工具函数
│   ├── constants/        # 常量定义
│   └── hooks/            # 自定义 Hooks
├── docs/                 # 项目文档
└── package.json          # 项目配置
```

## 🎨 功能模块

### ✅ 已完成

- [x] 用户认证系统
  - [x] 登录
  - [x] 注册
  - [x] 忘记密码
  - [x] 自动登录
  - [x] Token 刷新
- [x] Redux 状态管理
- [x] UI 组件库
- [x] API 服务封装
- [x] 表单验证

### 🚧 开发中

- [ ] 国家信息模块
- [ ] 留学规划功能
- [ ] 社区论坛
- [ ] 工具箱
- [ ] 个人中心

### 📋 计划中

- [ ] 社交登录
- [ ] 生物识别
- [ ] 消息推送
- [ ] 多语言支持
- [ ] 主题切换

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| [React Native](https://reactnative.dev) | 跨平台移动应用框架 |
| [Expo](https://expo.dev) | React Native 开发平台 |
| [Expo Router](https://expo.github.io/router/) | 文件系统路由 |
| [Redux Toolkit](https://redux-toolkit.js.org) | 状态管理 |
| [Redux Persist](https://github.com/rt2zz/redux-persist) | 状态持久化 |
| [React Hook Form](https://react-hook-form.com) | 表单管理 |
| [Yup](https://github.com/jquense/yup) | Schema 验证 |
| [Axios](https://axios-http.com) | HTTP 客户端 |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | 本地存储 |

## 📱 功能预览

### 认证流程

1. **登录** - 支持手机号/邮箱登录，记住登录状态
2. **注册** - 手机号注册，验证码验证，密码强度检测
3. **找回密码** - 验证码重置密码
4. **自动登录** - Token 持久化，自动刷新

### UI 组件

提供完整的 UI 组件库：

- Button（按钮）
- Input（输入框）
- Card（卡片）
- Toast（提示）
- Loading（加载）
- Avatar（头像）
- Badge（徽章）
- 表单组件系列
- 布局组件系列

## 🔧 开发指南

### 代码规范

```javascript
// 推荐的导入顺序
import React from 'react';                    // React
import { View } from 'react-native';         // React Native
import { router } from 'expo-router';        // 第三方库
import { Button } from '@/src/components';   // 项目组件
import { useAuth } from '@/src/store/hooks'; // Hooks
import { COLORS } from '@/src/constants';    // 常量
```

### 路径别名

使用 `@/src/*` 访问源代码目录：

```javascript
import { Button, Input } from '@/src/components';
import { useAuth } from '@/src/store/hooks';
import { loginUser } from '@/src/store/slices/authSlice';
```

### 组件开发

```javascript
/**
 * 组件说明
 * @param {Object} props - 组件属性
 */
export default function MyComponent({ title }) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}
```

## 🧪 测试

```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage

# E2E 测试
npm run test:e2e
```

## 📦 构建

```bash
# 构建预览版
eas build --profile preview --platform all

# 构建生产版
eas build --profile production --platform all
```

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

MIT License

## 👥 团队

GoAbroad 开发团队

## 📞 联系方式

- 📧 Email: support@goabroad.com
- 🌐 Website: https://goabroad.com
- 💬 Discord: https://discord.gg/goabroad

---

**开始你的留学规划之旅！** 🎓✈️

