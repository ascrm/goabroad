# 个人中心模块开发文档

## 概述

个人中心模块是 GoAbroad 应用的核心功能之一，提供用户信息管理、会员系统、设置配置等功能。

## 功能模块

### 1. Redux 状态管理

**文件**: `src/store/slices/profileSlice.js`

**功能**:
- 用户信息管理（头像、昵称、等级、经验值等）
- 会员信息管理（会员状态、到期时间、特权）
- 统计数据（规划进度、发帖数、收藏数、获赞数）
- 设置管理（账号安全、隐私、通知、通用设置）

**主要 Actions**:
```javascript
// 用户信息
setUserInfo, updateAvatar, updateNickname, updateSignature, updateLevel

// 会员信息
setMembership

// 统计数据
updateStats, incrementPostsCount, incrementFavoritesCount, decrementFavoritesCount

// 设置
updateSecurity, updatePrivacy, updateNotifications, updateGeneral
addToBlacklist, removeFromBlacklist, clearCache
```

### 2. 核心组件

#### UserHeader 组件
**文件**: `src/components/profile/UserHeader.jsx`

**功能**:
- 显示用户头像（支持点击上传）
- 显示昵称和等级徽章
- 显示个性签名
- 显示经验值进度条
- 提供编辑资料按钮

**Props**:
```javascript
{
  avatar: string,           // 头像 URL
  nickname: string,         // 昵称
  signature: string,        // 个性签名
  level: number,           // 等级 (1-5)
  experience: number,      // 当前经验值
  experienceMax: number,   // 升级所需经验值
  onEditPress: function,   // 编辑按钮回调
  onAvatarPress: function  // 头像点击回调
}
```

#### MembershipCard 组件
**文件**: `src/components/profile/MembershipCard.jsx`

**功能**:
- 显示会员状态（已开通/未开通）
- 展示会员特权列表
- 提供开通/续费按钮
- 渐变背景设计

**Props**:
```javascript
{
  isPro: boolean,        // 是否为会员
  expireDate: string,    // 到期时间
  onUpgrade: function    // 开通/续费回调
}
```

#### MenuList 组件
**文件**: `src/components/profile/MenuList.jsx`

**功能**:
- 渲染功能菜单列表
- 支持图标、标签、角标、右侧文本
- 支持禁用状态
- 支持分隔线

**Props**:
```javascript
{
  items: Array<{
    id: string,
    icon: string,          // Ionicons 图标名
    label: string,         // 菜单项文本
    iconBg: string,        // 图标背景色
    iconColor: string,     // 图标颜色
    route: string,         // 导航路由
    badge: string,         // 角标文本
    tag: string,           // 标签文本
    rightText: string,     // 右侧文本
    disabled: boolean,     // 是否禁用
    hideArrow: boolean,    // 隐藏箭头
    type: 'divider'        // 分隔线类型
  }>,
  onItemPress: function    // 点击回调
}
```

### 3. 页面

#### 3.1 个人中心主页
**文件**: `app/(tabs)/profile.jsx`

**功能**:
- 用户信息展示（UserHeader）
- 会员卡片展示（MembershipCard）
- 统计数据展示（会员专属）
- 功能菜单（我的计划、我的发布、我的收藏等）
- 工具和服务入口
- 设置和其他功能入口
- 退出登录

**特色**:
- 集成图片选择器（相册/拍照）
- Mock 数据初始化（开发环境）
- 完整的导航路由

#### 3.2 编辑资料页面
**文件**: `app/profile/edit.jsx`

**功能**:
- 头像上传（相册/拍照）
- 昵称编辑（唯一性校验）
- 性别选择
- 生日选择（DateTimePicker）
- 所在地输入
- 个性签名编辑
- 教育背景管理

**特色**:
- 表单验证
- 自动保存提示
- 放弃编辑确认

#### 3.3 设置页面
**文件**: `app/profile/settings.jsx`

**功能分类**:

**账号安全**:
- 修改密码
- 绑定手机/邮箱
- 第三方账号管理

**隐私设置**:
- 谁可以看我的帖子（所有人/仅关注者/仅自己）
- 谁可以评论（所有人/仅关注者/关闭）
- 黑名单管理

**通用设置**:
- 自动播放视频开关
- 省流量模式开关
- 清除缓存
- 检查更新
- 版本号显示

#### 3.4 通知设置页面
**文件**: `app/profile/notifications.jsx`

**功能**:
- 推送通知总开关
- 系统通知开关
- 互动通知开关（点赞、评论、关注）
- 规划提醒开关
- 社区动态开关

**特色**:
- 主开关控制所有子开关
- 提示信息展示
- 说明文档

#### 3.5 我的计划页面
**文件**: `app/profile/my-plans.jsx`

**功能**:
- 显示用户创建的留学规划列表
- 筛选功能（全部/进行中/已完成）
- 进度条展示
- 下拉刷新
- 空状态处理

**卡片信息**:
- 计划标题
- 目标国家/学位/年份
- 完成进度
- 状态标签
- 更新时间

#### 3.6 我的发布页面
**文件**: `app/profile/my-posts.jsx`

**功能**:
- 显示用户发布的帖子列表
- 筛选功能（全部/帖子/提问/视频）
- 统计数据（浏览、点赞、评论、收藏）
- 图片预览
- 下拉刷新

**卡片信息**:
- 类型标签
- 标题和内容
- 图片缩略图
- 互动数据
- 发布时间

#### 3.7 我的收藏页面
**文件**: `app/profile/my-favorites.jsx`

**功能**:
- 显示用户收藏的内容列表
- 收藏夹筛选
- 取消收藏
- 下拉刷新
- 空状态处理

**卡片信息**:
- 类型标签
- 标题和内容
- 作者信息
- 缩略图
- 收藏夹标签
- 互动数据

### 4. Mock 数据

**文件**: `src/utils/mockProfileData.js`

**提供的数据**:
- `MOCK_USER_INFO`: 用户基本信息
- `MOCK_MEMBERSHIP`: 会员信息
- `MOCK_STATS`: 统计数据
- `MOCK_SETTINGS`: 设置数据
- `initializeMockProfileData`: 初始化函数

**使用方式**:
```javascript
import { initializeMockProfileData } from '@/src/utils/mockProfileData';

// 在组件中初始化
useEffect(() => {
  if (__DEV__ && !userInfo.id) {
    initializeMockProfileData(dispatch, actions);
  }
}, []);
```

## 设计特点

### 1. 用户体验
- **等级系统**: 5级成长体系，每级有独特图标和颜色
- **进度可视化**: 经验值进度条、计划完成度
- **会员特权**: 渐变背景卡片，视觉突出
- **空状态**: 友好的空状态提示和引导按钮

### 2. 交互设计
- **图片上传**: 支持相册选择和拍照两种方式
- **表单验证**: 实时验证和错误提示
- **确认对话框**: 重要操作（退出登录、清除缓存）需确认
- **下拉刷新**: 所有列表页面支持下拉刷新

### 3. 视觉设计
- **色彩系统**: 使用设计系统中的颜色变量
- **卡片设计**: 圆角、阴影、间距统一
- **图标使用**: Ionicons 图标库，统一风格
- **渐变效果**: 会员卡片使用 LinearGradient

## 依赖库

```json
{
  "@expo/vector-icons": "^15.0.2",
  "expo-image-picker": "~17.0.8",
  "expo-linear-gradient": "~15.0.7",
  "@react-native-community/datetimepicker": "^8.4.5",
  "react-native-progress": "^5.0.1",
  "@reduxjs/toolkit": "^2.9.1",
  "react-redux": "^9.2.0"
}
```

## 待开发功能

以下功能在当前版本中显示为"开发中"或"v2.0"：

1. **服务模块** (v2.0)
   - 留学顾问咨询
   - 文书修改服务
   - 背景提升推荐

2. **我的评论** 
   - 用户发表的评论列表
   - 评论管理

3. **我的文件**
   - 文档管理
   - 云端存储

4. **工具箱**
   - GPA 计算器
   - 申请材料清单
   - 时间轴规划

5. **会员系统**
   - 会员购买流程
   - 支付集成
   - 会员权益详情

6. **教育背景管理**
   - 添加/编辑教育经历
   - 学校信息完善

## 开发建议

### 1. 状态持久化
当前 Redux 配置已包含持久化，个人中心数据会自动保存到 AsyncStorage。

### 2. API 集成
所有标记为 `TODO: 调用 API` 的地方需要替换为实际 API 调用：
- 用户信息获取/更新
- 头像上传
- 昵称唯一性验证
- 数据列表获取（计划、帖子、收藏）

### 3. 权限处理
已实现相册和相机权限请求，建议添加：
- 通知权限请求
- 位置权限请求（如需要）

### 4. 性能优化
- 图片上传时添加压缩
- 列表使用虚拟滚动（大数据量）
- 数据缓存策略

### 5. 错误处理
建议添加全局错误处理：
- 网络错误
- 权限被拒绝
- API 错误

## 测试建议

1. **单元测试**
   - Redux actions 和 reducers
   - 工具函数

2. **组件测试**
   - UserHeader 组件渲染
   - MembershipCard 不同状态
   - MenuList 各种配置

3. **集成测试**
   - 完整的编辑资料流程
   - 设置修改和保存
   - 图片上传流程

4. **E2E 测试**
   - 用户登录到个人中心
   - 完整的资料编辑流程
   - 会员购买流程（待开发）

## 总结

个人中心模块已完成核心功能开发，包括：
- ✅ Redux 状态管理
- ✅ 3个核心组件
- ✅ 7个页面
- ✅ Mock 数据支持
- ✅ 完整的导航路由
- ✅ 表单验证
- ✅ 图片上传
- ✅ 权限请求

模块设计遵循了 Material Design 和 iOS Human Interface Guidelines，提供了良好的用户体验。代码结构清晰，易于维护和扩展。

---

**最后更新**: 2024-10-24
**开发者**: AI Assistant
**版本**: v1.0.0

