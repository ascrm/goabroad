# 🚀 GoAbroad 项目开发 AI 提示词（完整版）

---
## 📌 项目背景信息

**项目名称**: GoAbroad 出国助手  
**技术栈**: Expo + React Native + JavaScript + Redux Toolkit  
**当前状态**: 已初始化项目,依赖已安装,需要完整开发  
**目标**: 构建一个出国留学/工作/移民全流程助手移动应用

---

## 🎯 阶段 0: 项目架构设计与基础配置

### 提示词 0.1 - 项目目录结构规划

```
我正在开发 GoAbroad 出国助手 App，使用 Expo + React Native。
请帮我设计完整的项目目录结构，要求：

1. 遵循以下架构原则：
   - 清晰的功能模块划分
   - 可扩展的组件体系
   - 统一的状态管理
   - 便于维护的代码组织

2. 需要包含以下核心模块：
   - 用户认证（登录/注册）
   - 首页（个性化推荐、进度展示）
   - 国家信息（国家列表、详情）
   - 规划系统（创建规划、时间线、材料清单）
   - 社区（帖子、评论、点赞）
   - 工具箱（费用计算器、GPA转换等）
   - 个人中心

3. 目录结构要求：
   - src/ 为主要开发目录
   - 使用 expo-router 进行路由管理
   - 使用 JavaScript (ES6+)
   - 集成 Redux Toolkit 状态管理
   - 统一的 API 请求封装
   - 清晰的代码注释

请给出详细的目录结构，包括每个文件夹的用途说明。
```

### 提示词 0.2 - 设计系统配置

```
基于 GoAbroad 产品设计文档，帮我创建完整的设计系统配置文件。

设计规范如下：

**色彩系统**：
- 主色调：深蓝色系 (#2563EB 为标准色)
  - Primary-900 到 Primary-50 共9个色阶
- 辅助色：Success绿色、Warning橙色、Error红色、Info蓝色
- 中性色：Gray-900 到 Gray-50 的灰度系统

**字体系统**：
- 中文：'PingFang SC', 'Microsoft YaHei', sans-serif
- 英文/数字：'SF Pro Display', 'Roboto', sans-serif
- 字号：从 H1(32px) 到 Tiny(12px)
- 字重：Light(300) 到 Extra Bold(800)

**间距系统**：基于 8px 网格
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px

**圆角系统**：
- sm: 4px, md: 8px, lg: 12px, xl: 16px, 2xl: 24px, full: 9999px

**阴影系统**：
- sm, md, lg, xl, 2xl 五个级别

请创建以下文件：
1. src/constants/theme.js - 主题配置
2. src/constants/colors.js - 颜色定义
3. src/constants/typography.js - 字体规范
4. src/constants/spacing.js - 间距规范
5. src/styles/shadows.js - 阴影样式

每个文件都要导出配置对象和具体值，添加清晰的注释说明。
```

### 提示词 0.3 - Redux 状态管理架构

```
帮我设计 GoAbroad App 的 Redux 状态管理架构。

需要管理的状态模块：
1. auth - 用户认证（token, userInfo, isLoggedIn）
2. user - 用户信息（profile, preferences, level）
3. countries - 国家信息列表和详情
4. planning - 用户的规划数据（plans, timeline, materials）
5. community - 社区内容（posts, comments, likes）
6. tools - 工具数据（计算器结果、缓存）
7. ui - UI状态（loading, modals, toasts）

要求：
1. 使用 @reduxjs/toolkit 的 createSlice
2. 集成 redux-persist 实现数据持久化（auth 和 user 需要持久化）
3. 使用 createAsyncThunk 处理异步操作
4. 每个 slice 要有清晰的注释说明
5. 创建统一的 store 配置
6. 实现 Redux DevTools 集成

请创建：
- src/store/index.js - Store 配置
- src/store/slices/ - 各个 slice
- src/store/hooks.js - 自定义 hooks (useAppDispatch, useAppSelector)
```

### 提示词 0.4 - API 服务封装

```
创建统一的 API 请求服务层。

要求：
1. 基于 axios 封装
2. 请求/响应拦截器
3. 统一的错误处理
4. Token 自动添加到 header
5. 请求重试机制
6. 请求取消功能
7. 清晰的函数注释和参数说明

需要创建的 API 模块：
- authApi - 登录、注册、登出
- userApi - 用户信息、更新资料
- countryApi - 国家列表、详情、搜索
- planningApi - 创建规划、更新进度、材料管理
- communityApi - 帖子、评论、点赞、收藏
- toolsApi - 各种工具的接口

文件结构：
- src/services/api/client.js - axios 实例配置
- src/services/api/interceptors.js - 拦截器
- src/services/api/modules/ - 各API模块

请提供完整的代码实现。
```

---

## 🎯 阶段 1: 基础组件库开发

### 提示词 1.1 - 通用UI组件

```
基于设计系统创建通用 UI 组件库。

需要创建的组件（完全按照设计文档规范）：

1. **Button 组钮**
   - 变体：primary, secondary, outline, ghost, text
   - 尺寸：sm, md, lg
   - 状态：normal, hover, active, disabled, loading
   - 支持图标、全宽模式

2. **Input 输入框**
   - 类型：text, password, email, phone, number
   - 状态：normal, focus, error, disabled
   - 支持前缀图标、后缀图标、清除按钮
   - 错误提示显示

3. **Card 卡片**
   - 白色背景 + shadow-md
   - 圆角 lg (12px)
   - 内边距 16px
   - 支持标题、内容、底部操作区

4. **Badge 徽章**
   - 颜色：primary, success, warning, error, info
   - 尺寸：sm, md, lg
   - 形状：rounded, pill

5. **Avatar 头像**
   - 尺寸：xs(24px), sm(32px), md(40px), lg(56px), xl(80px)
   - 支持图片、文字、图标
   - 在线状态指示器

6. **Loading 加载**
   - Spinner 旋转器
   - Skeleton 骨架屏
   - 页面级 Loading

7. **Toast 提示**
   - 类型：success, error, warning, info
   - 位置：top, center, bottom
   - 自动消失

文件位置：src/components/ui/
每个组件包含：
- 组件文件 (.jsx)
- 样式定义（使用 StyleSheet）
- PropTypes 验证或详细注释说明参数

使用 React Native Paper 作为基础，但要完全符合我们的设计规范。
```

### 提示词 1.2 - 表单组件

```
创建表单相关组件，集成 react-hook-form 和 yup 验证。

组件列表：

1. **FormInput** - 表单输入框
   - 自动集成 Controller
   - 错误提示显示
   - 支持所有 Input 的功能

2. **FormSelect** - 下拉选择
   - 单选/多选
   - 搜索功能
   - 自定义选项渲染

3. **FormDatePicker** - 日期选择
   - 日期/时间/日期时间
   - 最小/最大日期限制
   - 自定义格式

4. **FormRadio** - 单选框组
   - 垂直/水平布局
   - 自定义样式

5. **FormCheckbox** - 复选框
   - 单个复选框
   - 复选框组

6. **FormTextArea** - 多行文本
   - 自动高度
   - 字数统计

创建通用的 Form 包装组件，提供：
- 统一的验证规则
- 错误处理
- 提交状态管理
- 重置功能

文件：src/components/form/
```

### 提示词 1.3 - 布局组件

```
创建布局相关组件。

1. **Screen** - 页面容器
   - SafeAreaView 包装
   - 支持滚动/非滚动
   - 统一的背景色
   - KeyboardAvoidingView 处理

2. **Header** - 页面头部
   - 左侧：返回按钮
   - 中间：标题
   - 右侧：操作按钮（1-3个）
   - 搜索模式
   - 固定/滚动透明

3. **TabBar** - 底部标签栏
   - 5个Tab：首页、国家、规划、社区、我的
   - 图标+文字
   - 选中状态高亮
   - 角标支持（数字、红点）

4. **Section** - 页面区块
   - 标题+右侧操作
   - 内容区
   - 统一间距

5. **List** - 列表容器
   - FlatList 优化
   - 下拉刷新
   - 上拉加载更多
   - 空状态
   - 分隔线

6. **Modal** - 模态框
   - 底部弹出（Sheet）
   - 居中弹窗
   - 全屏模态
   - 关闭手势

文件：src/components/layout/
```


### 提示词 1.4 - 底部导航栏实现
---
实现 GoAbroad App 的底部导航栏（完全按照设计文档 4.3.1 节）。

**背景说明**：
当前项目的 app/(tabs)/_layout.jsx 使用的是 Stack 导航，需要改为 Tabs 底部导航栏。
同时需要创建 3 个缺失的 Tab 页面（planning、community、profile）。

**设计规范**（严格遵守）：

**1. 视觉规范**
- 高度：iOS 60px，Android 56px
- 图标大小：24px
- 文字大小：12px，字重 Medium (500)
- 激活颜色：Primary-600 (#2563EB)
- 未激活颜色：Gray-400 (#9CA3AF)
- 背景色：白色
- 顶部边框：Gray-200，1px

**2. 五个 Tab 配置**

Tab 1 - 首页：
- 图标：home（实心/空心切换）
- 标题："首页"
- 路由：app/(tabs)/index.jsx
- 角标：无

Tab 2 - 国家：
- 图标：globe（实心/空心切换）
- 标题："国家"
- 路由：app/(tabs)/countries.jsx
- 角标：无

Tab 3 - 规划：
- 图标：clipboard（实心/空心切换）
- 标题："规划"
- 路由：app/(tabs)/planning.jsx
- 角标：显示待办任务数量（红色圆形，数字白色，>99 显示 99+）

Tab 4 - 社区：
- 图标：chatbubbles（实心/空心切换）
- 标题："社区"
- 路由：app/(tabs)/community.jsx
- 角标：显示未读消息数量（红色圆形，数字白色）

Tab 5 - 我的：
- 图标：person（实心/空心切换）
- 标题："我的"
- 路由：app/(tabs)/profile.jsx
- 角标：无

**3. 交互行为**
- 点击 Tab 切换页面，有平滑过渡动画
- 选中状态：图标从空心变实心，文字和图标变为 Primary-600
- 未选中状态：图标空心，文字和图标为 Gray-400
- 角标数字从 Redux 状态中获取，实时更新
- 角标样式：最小宽度 18px，高度 18px，圆形，字号 10px

**4. 实现要求**

**修改 app/(tabs)/_layout.jsx**：
- 使用 Expo Router 的 Tabs 组件（不是 Stack）
- 使用 @expo/vector-icons 的 Ionicons 图标库
- 根据 Platform.OS 区分 iOS 和 Android 的高度和内边距
- 从 Redux 的 ui slice 和 planning slice 获取角标数据
- 为每个 Tab 配置：
  * name（路由名称）
  * title（显示标题）
  * tabBarIcon（图标组件，根据 focused 状态切换实心/空心）
  * tabBarBadge（角标数字，没有则不显示）
  * tabBarBadgeStyle（角标样式）

**创建缺失的 Tab 页面**：
目前只有 index.jsx 和 countries.jsx，需要创建：

1. app/(tabs)/planning.jsx
   - 规划列表页面
   - 现阶段先创建占位页面，显示"📋 规划"和"功能开发中..."
   - 使用 Screen 布局组件包裹
   - 背景色 Gray-50

2. app/(tabs)/community.jsx
   - 社区 Feed 流页面
   - 现阶段先创建占位页面，显示"💬 社区"和"功能开发中..."
   - 使用 Screen 布局组件包裹
   - 背景色 Gray-50

3. app/(tabs)/profile.jsx
   - 个人中心页面
   - 现阶段先创建占位页面，显示"👤 我的"和"功能开发中..."
   - 使用 Screen 布局组件包裹
   - 背景色 Gray-50

**5. Redux 状态准备**

在 src/store/slices/uiSlice.js 中添加：
- unreadCount（未读消息数量，用于社区 Tab 角标）

在 src/store/slices/planningSlice.js 中添加：
- todoCount（待办任务数量，用于规划 Tab 角标）

如果这些 slice 还不存在，先添加占位状态，初始值为 0。

**6. 颜色常量引用**

确保从 src/constants/colors.js 引入颜色：
- colors.primary[600]
- colors.gray[400]
- colors.gray[200]
- colors.white
- colors.gray[50]
- colors.error[500]

**7. 测试验证**

完成后需要验证：
- ✅ 5 个 Tab 都能正常显示和切换
- ✅ 图标在选中/未选中状态下正确变化
- ✅ 文字颜色正确变化
- ✅ 底部导航栏高度在 iOS 和 Android 上符合规范
- ✅ 顶部边框显示正确
- ✅ 角标（如果有数据）正确显示
- ✅ 页面切换动画流畅

**8. 注意事项**
- 使用 Tabs 而不是 Stack
- 图标必须支持实心/空心切换（outline 后缀）
- 角标只在数值 > 0 时显示
- 角标数字超过 99 显示为 "99+"
- 确保 TabBar 在所有页面都可见（不被键盘遮挡）
- iOS 底部有安全区域，需要额外的 paddingBottom

请按照以上要求完整实现底部导航栏功能。




## 🎯 阶段 2: 认证系统开发

### 提示词 2.1 - 启动页与引导页

```
实现 App 启动流程（完全按照设计文档 2.1 节）。

**2.1.1 启动页 (Splash Screen)**
- 渐变背景（Primary-600 → Primary-800）
- 白色 Logo 居中
- 标语："出国，从未如此简单"
- Loading 进度条
- 显示 1-2 秒

**2.1.2 引导页 (Onboarding) - 3 页**

第1页：欢迎
- 插画：地球仪+飞机（使用 Lottie 动画）
- 标题："欢迎来到 GoAbroad"
- 副标题："你的AI出国助手，一站式解决出国全流程"
- 指示器：● ○ ○
- 按钮："下一步 →"

第2页：功能介绍
- 插画：清单+时间轴
- 标题："个性化时间线规划"
- 说明文字
- 指示器：○ ● ○
- "跳过" + "下一步 →"

第3页：开始使用
- 插画：社区+交流
- 标题："真实经验，随时获取"
- 说明文字
- 指示器：○ ○ ●
- 按钮："登录"、"注册"、"先逛逛 →"

实现要求：
1. 使用 AsyncStorage 记录是否首次启动
2. 支持左右滑动切换
3. 跳过后不再显示
4. 平滑的页面切换动画

文件：
- app/(auth)/splash.jsx
- app/(auth)/onboarding.jsx
- 插画：使用 Lottie 动画或 SVG
```

### 提示词 2.2 - 登录注册页面

```
实现登录注册功能（设计文档 2.1.3）。

**登录页面**：
```
[设计稿布局]
- Logo图标顶部居中
- "欢迎回来" 标题
- 手机号/邮箱输入框（带图标）
- 密码输入框（可显示/隐藏）
- 记住我 + 忘记密码
- 登录按钮（Primary色，全宽）
- 分隔线 "或"
- 第三方登录：Apple、微信、QQ
- 底部："还没账号？立即注册 →"
```

**注册页面**：
```
- 手机号输入
- 验证码输入 + 获取验证码按钮（60秒倒计时）
- 设置密码（6-20位，显示强度）
- 确认密码
- 用户协议勾选
- 注册按钮
- "已有账号？立即登录 →"
```

功能要求：
1. 表单验证（react-hook-form + yup）
2. 验证码倒计时
3. 密码强度检测
4. 第三方登录集成准备（暂时占位）
5. 登录成功后跳转到兴趣选择/首页
6. Token 存储到 Redux 和 AsyncStorage

文件：
- app/(auth)/login.jsx
- app/(auth)/register.jsx
- app/(auth)/forgot-password.jsx
- src/store/slices/authSlice.js
```

### 提示词 2.3 - 首次登录引导

```
实现首次登录后的兴趣选择流程（设计文档 2.1.4）。

**3步引导**：

步骤1：选择目标国家（可多选）
- 进度条：1/3
- 国家卡片网格（2列）
- 国旗 + 国家名
- 选中状态：✓ 已选
- 底部："跳过" + "下一步 →"

步骤2：选择目标
- 进度条：2/3
- 选项卡片：
  * 📚 留学（前往海外学习深造）
  * 💼 工作（海外就业、工作签证）
  * 🏠 移民（技术移民、投资移民）
  * 👀 先看看（暂时没有明确计划）

步骤3：出发时间 + 当前状态
- 进度条：3/3
- 单选：3个月内、半年内、1年内、1-2年、还没想好
- 单选：在校生、应届生、在职、待业
- 按钮："完成设置"

功能：
1. 选择结果保存到用户偏好
2. 根据选择个性化首页内容
3. 跳过则使用默认推荐
4. 完成后进入首页

文件：
- app/(auth)/interests.jsx
- 使用 React Native ViewPager 或自己实现
```

---

## 🎯 阶段 3: 首页与国家模块

### 提示词 3.1 - 首页有计划状态

```
实现首页（有计划状态），完全按照设计文档 2.2.1。

**布局结构**：

1. **顶部导航栏**
   - Logo "GoAbroad"
   - 搜索图标
   - 通知图标（带角标）

2. **问候区**
   - 动态问候语（早上好/下午好/晚上好）
   - 用户昵称
   - 倒计时："距离美国留学出发还有 X 天"

3. **我的计划卡片**
   - 标题："我的计划 - 美国留学"
   - 环形进度图（68%）
   - 完成统计："已完成 17/25 项任务"
   - 近期待办（3项）
   - "查看详细规划 →" 按钮

4. **快捷工具区**
   - 标题："⚡ 快捷工具"
   - 4个工具图标（横向滚动）
     * 💰 费用计算
     * 📅 签证预约
     * 🔄 GPA转换
     * 📋 清单下载

5. **为你推荐**
   - 标题："📱 为你推荐"
   - 帖子卡片列表（2-3个）
     * 封面图
     * 标题
     * 作者 + 时间
     * 点赞数 + 评论数
   - "查看更多 →"

6. **底部 TabBar**（5个Tab）

交互：
- 下拉刷新
- 卡片点击进入详情
- 工具图标点击打开对应工具
- 通知角标点击查看通知

文件：
- app/(tabs)/index.jsx
- src/components/home/PlanCard.jsx
- src/components/home/QuickTools.jsx
- src/components/home/RecommendFeed.jsx
```

### 提示词 3.2 - 首页无计划状态

```
实现首页（无计划状态），设计文档 2.2.2。

**布局差异**：
- 无问候区倒计时
- 用空状态卡片替代计划卡片
  * 空状态插画
  * 提示文案："还没有出国计划？让我们帮你规划吧！"
  * "🚀 开始规划" 按钮（Primary色）

- 热门目的地推荐（3个卡片）
  * 国旗
  * 国家名
  * 标签（最受欢迎/教育质量/移民友好）

- 最新攻略列表
  * 标题
  * 来源 + 时间

功能：
- "开始规划"跳转到规划创建流程
- 国家卡片点击进入国家详情
- 攻略点击查看内容

文件：
- 复用 app/(tabs)/index.jsx，根据 isHasPlan 条件渲染
- src/components/home/EmptyPlanCard.jsx
- src/components/home/HotCountries.jsx
```

### 提示词 3.3 - 搜索功能

```
实现全局搜索功能（设计文档 2.2.3）。

**搜索框获焦展开页面**：
1. 顶部：返回 + 搜索框 + 取消
2. 占位符："🔍 搜索国家、签证、问题..."
3. 输入时自动建议
4. 热门搜索（标签形式）
5. 搜索历史（可删除、可清空）

**搜索结果页**：
1. Tab切换：全部、国家、帖子、问答
2. 结果分类显示
   - 国家信息（卡片）
   - 相关帖子（列表）
3. 分页加载
4. 无结果状态

功能要求：
1. 防抖搜索（输入停止500ms后请求）
2. 搜索历史本地存储（最多10条）
3. 热门搜索从服务端获取
4. 结果高亮关键词
5. 最近搜索置顶

文件：
- app/search.jsx
- src/components/search/SearchBar.jsx
- src/components/search/SearchSuggestions.jsx
- src/components/search/SearchHistory.jsx
- src/components/search/SearchResults.jsx
```

### 提示词 3.4 - 国家列表页

```
实现国家列表页（设计文档 2.3.1）。

**页面布局**：
1. 顶部：标题 + 搜索 + 筛选图标
2. 筛选Tab：全部、留学热门、工作友好、移民推荐
3. 分区：
   - 🔥 热门推荐（3-5个）
   - 📝 全部国家

**国家卡片设计**：
```
┌───────────────────────────┐
│ 🇺🇸                        │
│ 美国 United States        │
│ 教育资源丰富 · 热门首选     │
│ ⭐⭐⭐⭐⭐ 难度高 · 费用高   │
│ 💰 $50-80万/年             │
│ [查看详情 →]               │
└───────────────────────────┘
```

字段包括：
- 国旗 emoji
- 中英文名称
- 一句话描述
- 评级星级
- 难度和费用标签
- 预估费用

功能：
1. 筛选切换（请求不同接口）
2. 卡片点击进入详情
3. 支持下拉刷新
4. 国家收藏功能
5. 骨架屏加载

文件：
- app/(tabs)/countries.jsx
- src/components/country/CountryCard.jsx
- src/components/country/CountryFilters.jsx
- src/store/slices/countrySlice.js
```

### 提示词 3.5 - 国家详情页

```
实现国家详情页（设计文档 2.3.2-2.3.4）。

**页面结构**：

1. **头部封面**
   - 国家背景图（可滚动视差效果）
   - 返回按钮（左上角）
   - 收藏按钮（右上角）
   - 国旗 + 国家名（覆盖在图片上）

2. **Tab 切换**
   - 概览 | 留学 | 工作 | 移民 | 生活
   - 吸顶效果

3. **概览 Tab 内容**：
   - 基本信息卡片
     * 首都、语言、货币、时区
   - 费用预估
     * 生活费、学费范围
     * 费用计算器入口
   - 优势 / 劣势（对比列表）
   - 适合人群
   - 签证通过率（图表）

4. **留学 Tab 内容**：
   - 教育体系介绍
   - 学历类型（本科/硕士/博士）
   - 申请流程（步骤卡片）
   - 语言要求
   - 材料清单
   - 时间规划建议
   - 常见问题（可展开）

5. **工作/移民/生活 Tab**：
   - 类似结构，不同内容

6. **底部固定按钮**：
   - "开始规划" 按钮（创建该国家的规划）

交互：
- Tab 滚动联动内容
- 卡片展开/收起
- 图表交互
- 常见问题手风琴
- 返回上一页/首页

文件：
- app/country/[code].jsx
- src/components/country/detail/OverviewTab.jsx
- src/components/country/detail/StudyTab.jsx
- src/components/country/detail/WorkTab.jsx
- src/components/country/detail/ImmigrationTab.jsx
- src/components/country/detail/LifeTab.jsx
- src/components/country/detail/InfoCard.jsx
```

---

## 🎯 阶段 4: 规划系统核心功能

### 提示词 4.1 - 规划创建流程

```
实现规划创建流程（设计文档 2.4.1），5步引导。

**步骤1：选择国家（1/5）**
- 标题："🌍 选择目标国家"
- 国家网格（2列）
- 单选模式
- 可搜索
- 取消 + 选中后自动进入下一步

**步骤2：选择目标（2/5）**
- 标题："🎯 你计划去[国家]做什么？"
- 选项卡片：
  * 📚 留学（Study Abroad）
  * 💼 工作（Work）
  * 🏠 移民（Immigration）
- 每个卡片包含描述
- 返回 + 选中后进入下一步

**步骤3：细分选择（3/5）**
- 标题："📚 选择学历层次"（动态标题）
- 留学选项：
  * 高中/中学
  * 本科（Bachelor）
  * 硕士（Master）
  * 博士（PhD）
  * 语言学校
  * 交换生/访问学者
- 单选，显示时长说明
- 返回 + 下一步

**步骤4：当前状态（4/5）**
- 标题："📝 填写你的当前状态"
- 表单字段：
  * 当前学历（下拉选择）
  * 专业（文本输入）
  * GPA / 成绩
  * 语言成绩状态（单选：还没考/正在备考/已有成绩）
  * 已有成绩展开输入（托福/雅思）
  * 是否有中介（单选）
- 返回 + 下一步

**步骤5：目标时间（5/5）**
- 标题："📅 计划什么时候入学？"
- 入学时间选择器（年份+学期）
- 💡 建议区（根据时间自动生成）
- 规划名称输入（可选，有默认值）
- 返回 + "🚀 生成我的规划" 按钮

**生成中页面**：
- Loading 动画（火箭发射 Lottie）
- 进度文案：
  * ✓ 分析目标时间
  * ✓ 匹配申请流程
  * ▶ 生成时间线...
  * ○ 准备材料清单
- "预计还需 X 秒..."

**生成成功页面**：
- 成功动画（✓打勾）
- 标题："🎉 规划生成成功！"
- 统计信息：
  * 为你规划了 X 个阶段
  * 共 X 项任务
  * 预计需要 X 个月完成
- "查看我的规划 →" 按钮
- "稍后再看" 文字按钮

实现要求：
1. 使用状态管理保存每步数据
2. 支持返回编辑
3. 表单验证
4. 生成时调用 API
5. 生成后跳转到规划详情

文件：
- app/planning/create.jsx（主流程）
- src/components/planning/create/步骤组件
- src/store/slices/planningSlice.js
```

### 提示词 4.2 - 规划时间线视图

```
实现规划时间线视图（设计文档 2.4.2）。

**页面头部**：
- 返回 + 规划名称 + 菜单（编辑/删除）
- 整体进度卡片：
  * 环形进度图（百分比）
  * "已完成 X/Y 项任务"
  * "距离入学还有 X 天"

**Tab切换**：时间线 | 材料清单 | 进度看板

**时间线内容**：

1. **下一步行动（紧急）**
   - 红色边框卡片
   - ⚠️ 任务名称
   - 截止时间倒计时
   - "立即处理" 按钮

2. **阶段列表**（可展开/收起）
   ```
   ════════════════════════════════
   阶段1: 语言考试准备 ✓ 已完成
   2024.06 - 2024.10
   ════════════════════════════════
   ✓ 了解托福/雅思考试
   ✓ 报名培训班
   ✓ 备考3个月
   ✓ 参加考试
   ✓ 达到目标分数
   [收起 ▲]
   ```

   状态：
   - ✓ 已完成（绿色）
   - ▶ 进行中（蓝色，显示百分比）
   - ⏸ 未开始（灰色）
   - ⚠️ 逾期（红色）

3. **任务项交互**：
   - 点击展开任务详情
   - 勾选完成
   - 设置提醒
   - 查看详细指南

设计要求：
- 阶段用分隔线区分
- 进行中的阶段默认展开
- 完成的阶段默认收起
- 平滑的展开/收起动画
- 列表虚拟化（性能优化）

文件：
- app/planning/[id].jsx
- src/components/planning/timeline/TimelineView.jsx
- src/components/planning/timeline/StageCard.jsx
- src/components/planning/timeline/TaskItem.jsx
- src/components/planning/timeline/ProgressCard.jsx
```

### 提示词 4.3 - 材料清单管理

```
实现材料清单 Tab（设计文档 2.4.3）。

**页面布局**：

1. **顶部统计**
   - 整体进度条
   - "已准备 X/Y 份材料"

2. **分类展示**
   - **必需材料** (8/10)
     * 展开状态
   - **支持性材料** (3/6)
   - **可选材料** (0/3)

3. **材料项设计**：
   ```
   ☑ 护照（有效期>6个月）
     已上传：passport.pdf
     上传于：2024-10-15
   
   □ DS-160确认页
     ➤ 查看要求
     ➤ 上传文件
     ⏰ 提醒：2025-03-01
   
   □ SEVIS费用收据
     ⚠️ 逾期：应于2025-02-15完成
   ```

**材料状态**：
- ☑ 已完成（绿色勾）
- □ 未完成（空心框）
- ⚠️ 逾期（红色感叹号）
- ⏳ 进行中（蓝色沙漏）

**操作功能**：
1. 查看材料要求（Modal）
   - 详细说明
   - 格式要求
   - 示例图片/文档
   - 注意事项

2. 上传文件
   - 拍照
   - 从相册选择
   - 从文件管理器选择
   - 上传进度
   - 上传成功/失败反馈

3. 设置提醒
   - 日期选择
   - 提前提醒（1天/3天/1周）

4. 标记完成
   - 勾选动画
   - 更新进度

**底部操作栏**：
- [导出清单] [分享] [打印]

文件：
- src/components/planning/materials/MaterialsView.jsx
- src/components/planning/materials/MaterialItem.jsx
- src/components/planning/materials/MaterialDetail.jsx
- src/components/planning/materials/FileUploader.jsx
- src/components/planning/materials/ReminderSetter.jsx
```

### 提示词 4.4 - 进度看板视图

```
实现进度看板 Tab（设计文档 2.4.4）。

**内容组成**：

1. **甘特图**
   - 横轴：时间（月份）
   - 纵轴：阶段
   - 条形图显示每个阶段的时间跨度
   - 当前进度标记（竖线）
   - 可滚动查看

2. **里程碑**
   - 关键节点列表
   - 时间点 + 事件名称
   - 完成状态
   - 倒计时
   ```
   🏁 托福考试       2024-12-15  (已完成)
   🎯 申请提交       2025-10-01  (还有198天)
   ✈️ 入学时间       2026-09-01  (还有526天)
   ```

3. **风险提示**
   - 逾期任务列表
   - 即将到期任务（7天内）
   - 前置任务未完成提示

4. **下一步行动建议**
   - 根据当前进度智能推荐
   - 3-5个优先任务
   - 点击可直接操作

可视化：
- 使用 react-native-chart-kit 或 victory-native
- 颜色：已完成（绿）、进行中（蓝）、未开始（灰）、逾期（红）
- 支持触摸查看详情

文件：
- src/components/planning/dashboard/DashboardView.jsx
- src/components/planning/dashboard/GanttChart.jsx
- src/components/planning/dashboard/MilestoneList.jsx
- src/components/planning/dashboard/RiskAlerts.jsx
- src/components/planning/dashboard/NextActions.jsx
```

---

## 🎯 阶段 5: 社区模块开发

### 提示词 5.1 - 社区Feed流

```
实现社区 Tab 主页（设计文档 2.5）。

**页面结构**：

1. **顶部Tab**
   - [推荐] 关注 国家 阶段
   - 固定吸顶

2. **分区选择器**（推荐 Tab 不显示）
   - 按国家：美国圈、英国圈...
   - 按阶段：准备阶段、申请中、等offer...
   - 按类型：留学、工作、移民

3. **帖子卡片**（Feed流）
   ```
   ┌───────────────────────────┐
   │ 👤 留学小王  [关注]         │
   │ 🏷️ #美国留学 #F1签证        │
   │                            │
   │ 美国F1签证面签攻略（2024）  │
   │                            │
   │ [封面图/多图/视频]          │
   │                            │
   │ 摘要文字...（展开查看更多）  │
   │                            │
   │ 👍 1.2k  💬 89  ⭐ 收藏     │
   │ 2天前                      │
   └───────────────────────────┘
   ```

**帖子类型**：
- 普通帖子（文字+图片）
- 视频帖子（封面+播放按钮）
- 问答（标记为问答样式）
- 经验帖（有"精华"标签）

**交互功能**：
- 下拉刷新
- 上拉加载更多
- 点赞（红心动画）
- 点击卡片进入详情
- 点击用户进入主页
- 长按弹出菜单（举报/屏蔽）

4. **右下角悬浮按钮**
   - [+] 发布按钮
   - 点击弹出选项：
     * 📝 发帖
     * ❓ 提问
     * 📹 视频

性能优化：
- FlatList 虚拟化
- 图片懒加载
- 分页加载（每页20条）

文件：
- app/(tabs)/community.jsx
- src/components/community/PostCard.jsx
- src/components/community/FeedList.jsx
- src/components/community/CategorySelector.jsx
- src/store/slices/communitySlice.js
```

### 提示词 5.2 - 帖子详情页

```
实现帖子详情页（设计文档 2.5.2）。

**页面布局**：

1. **头部**
   - 返回按钮
   - 分享按钮
   - 更多按钮（举报/删除）

2. **作者信息区**
   ```
   👤 [头像]  留学小王  [+ 关注]
   🏷️ #美国留学 #F1签证
   ⏰ 2024-10-15 18:30
   ```

3. **内容区**
   - 标题（H2，加粗）
   - 正文（Markdown 渲染）
   - 图片（轮播/网格）
   - 视频（播放器）
   - 最多9张图片，点击查看大图

4. **交互栏**
   ```
   👍 1.2k  💬 89  ⭐ 收藏 156  ↗️ 分享
   ```

5. **评论区**
   - 评论数："全部评论 (89)"
   - 排序：最新/最热
   - 评论列表：
     ```
     👤 用户A  [💬 回复]
        很有帮助，感谢分享！
        👍 12  2小时前
        
        └─ 👤 作者回复：
           不客气～
           1小时前
     ```

6. **底部输入栏**（固定）
   - 头像
   - 输入框："说说你的想法..."
   - 表情按钮
   - 发送按钮

**交互功能**：
1. 点赞（红心动画，取消点赞）
2. 收藏（星星动画）
3. 分享（弹出分享面板）
4. 评论（展开输入框）
5. 回复（@用户名）
6. 评论点赞
7. 图片查看器（Pinch缩放）
8. 视频播放（全屏）

**内容渲染**：
- 使用 Markdown 库（react-native-markdown-display）
- 支持：标题、列表、粗体、斜体、链接、代码块
- 图片点击放大
- 链接可点击

文件：
- app/community/post/[id].jsx
- src/components/community/PostDetail.jsx
- src/components/community/CommentList.jsx
- src/components/community/CommentItem.jsx
- src/components/community/CommentInput.jsx
- src/components/community/ImageViewer.jsx
```

### 提示词 5.3 - 发布帖子

```
实现发布帖子功能（设计文档 2.5.3）。

**发布页面**：

1. **顶部导航**
   - 取消 + 标题 + 发布按钮
   - 发布按钮状态：
     * 不可用（灰色，内容不足）
     * 可用（Primary色）
     * 发布中（Loading）

2. **内容类型选择**（初次进入显示）
   - 📝 发帖
   - ❓ 提问
   - 📹 发布视频

3. **编辑区**
   - 标题输入框（问答必填，其他可选）
     * 占位符："给你的帖子起个标题（可选）"
     * 字数限制：50字
   - 正文输入框（多行）
     * 占位符："分享你的经验或提出问题..."
     * 字数限制：5000字
     * 支持 Markdown 快捷按钮（B/I/链接）

4. **多媒体选择**
   - 图片选择器（最多9张）
   - 排序、删除
   - 上传进度
   - 压缩处理

   或

   - 视频选择（最多1个，最长5分钟）
   - 封面选择
   - 上传进度

5. **分区选择**（必选）
   - 按钮："选择分区 >"
   - 弹出 Modal 选择
   - 选中后显示标签

6. **标签添加**（选填，最多5个）
   - 输入框 + 标签列表
   - 热门标签推荐
   - 点击添加

7. **高级选项**（可展开）
   - 允许评论（默认开启）
   - 仅关注者可见
   - 设置封面（自动识别首图）

**功能要求**：
1. 草稿自动保存（本地）
2. 图片压缩（<2MB）
3. 视频压缩（可选）
4. 表单验证
5. 发布成功跳转到详情
6. 发布失败提示重试
7. 退出确认（有内容时）

文件：
- app/community/create.jsx
- src/components/community/create/PostEditor.jsx
- src/components/community/create/MediaPicker.jsx
- src/components/community/create/CategoryPicker.jsx
- src/components/community/create/TagInput.jsx
```

---

## 🎯 阶段 6: 工具箱与个人中心

### 提示词 6.1 - 工具箱页面

```
实现工具箱模块（设计文档 2.6）。

**页面布局**：

1. **工具列表**（网格或列表）
   - 💰 费用计算器
   - 📅 签证预约助手
   - 🔄 GPA转换器
   - ⏰ 时差查询
   - 💱 汇率换算
   - 🧳 行李清单
   - 📝 文书模板库
   - 🎓 学校对比

每个工具卡片：
- 图标（大）
- 工具名称
- 简短说明
- 点击进入

2. **最近使用**（顶部显示）
   - 3个最近使用的工具
   - 快速访问

**工具实现**：

**💰 费用计算器**：
```
页面：app/tools/cost-calculator.jsx

表单输入：
1. 学校类型：公立/私立
2. 地区：东西海岸/中部/南部
3. 学费滑块：$20,000 - $70,000
4. 住宿：校内宿舍/校外租房
5. 生活费滑块
6. 医疗保险
7. 机票往返
8. 其他开销

输出：
- 年度总费用（美元）
- 年度总费用（人民币）
- 4年总费用
- 饼图（费用构成）
- [保存方案] [分享] 按钮
```

**🔄 GPA转换器**：
```
页面：app/tools/gpa-converter.jsx

输入：
- 当前 GPA 制度：4.0/5.0/100分/其他
- 成绩输入
- 课程学分（可选）

输出：
- 转换后的 GPA（4.0制）
- 等级评定（A/B/C/D/F）
- 百分比
- 说明文字
```

**📅 签证预约助手**：
```
页面：app/tools/visa-slots.jsx

功能：
- 选择国家 + 签证类型
- 显示各使馆最早预约时间
- [🔔 订阅] 按钮（有新位置通知）
- 预约技巧（文字说明）
- 我的预约信息
```

其他工具类似实现。

文件：
- app/tools/index.jsx（工具列表）
- app/tools/[toolName].jsx（各个工具）
- src/components/tools/ToolCard.jsx
```

### 提示词 6.2 - 个人中心页面

```
实现"我的"Tab（设计文档 2.7）。

**页面布局**：

1. **用户信息区**
   - 头像（可点击编辑）
   - 昵称
   - 个性签名
   - 等级标识 + 经验值进度条
   - [编辑资料] 按钮

2. **会员卡片**（未开通显示）
   - 渐变背景
   - "💎 GoAbroad Pro"
   - 会员特权预览（3-4条）
   - [开通会员] 按钮

3. **数据统计**（已开通会员显示）
   - 规划进度、发帖数、收藏数、获赞数

4. **功能列表**
   ```
   🎯 我的计划
   📝 我的发布
   ⭐ 我的收藏
   💬 我的评论
   📂 我的文件
   ────────────
   🛠️ 工具箱
   💼 服务（v2.0，置灰）
   ────────────
   🔔 通知设置
   🌐 语言切换
   ⚙️ 设置
   💡 反馈建议
   ❓ 帮助中心
   ℹ️ 关于我们
   ```

5. **退出登录**（底部）

**子页面**：

**编辑资料**：
- 头像上传
- 昵称（唯一性校验）
- 性别
- 生日
- 所在地
- 个性签名
- 教育背景
- [保存] 按钮

**设置页面**：
- 账号安全
  * 修改密码
  * 绑定手机/邮箱
  * 第三方账号管理
- 隐私设置
  * 谁可以看我的帖子
  * 谁可以评论
  * 黑名单
- 消息通知
  * 推送通知开关
  * 通知类型选择
- 通用设置
  * 清除缓存
  * 检查更新
  * 版本号

**通知设置**：
- 系统通知
- 互动通知（点赞、评论、关注）
- 规划提醒
- 社区动态

文件：
- app/(tabs)/profile.jsx
- app/profile/edit.jsx
- app/profile/settings.jsx
- app/profile/notifications.jsx
- app/profile/my-plans.jsx
- app/profile/my-posts.jsx
- app/profile/my-favorites.jsx
- src/components/profile/UserHeader.jsx
- src/components/profile/MembershipCard.jsx
- src/components/profile/MenuList.jsx
```

---

## 🎯 阶段 7: 优化与上线准备

### 提示词 7.1 - 性能优化

```
对 GoAbroad App 进行全面性能优化。

**优化清单**：

1. **图片优化**
   - 实现图片懒加载
   - 使用 expo-image 的缓存功能
   - 压缩上传图片（质量80%，宽度<1080px）
   - 使用 WebP 格式（支持的情况下）
   - 占位符模糊效果

2. **列表优化**
   - FlatList/SectionList 设置：
     * windowSize={10}
     * maxToRenderPerBatch={10}
     * initialNumToRender={10}
     * removeClippedSubviews={true}
   - getItemLayout 优化
   - keyExtractor 稳定性
   - 避免匿名函数

3. **状态管理优化**
   - Redux selector 使用 reselect 缓存
   - 避免不必要的重渲染（React.memo）
   - useCallback/useMemo 使用
   - 合理拆分 slice

4. **包体积优化**
   - 移除未使用的依赖
   - 代码分割（动态 import）
   - 图片资源压缩
   - 字体子集化

5. **网络优化**
   - API 请求合并
   - 数据预加载
   - 请求缓存策略
   - 离线支持（关键数据）

6. **启动优化**
   - 启动页优化
   - 延迟非关键初始化
   - 预加载关键资源

7. **动画优化**
   - 使用 react-native-reanimated
   - 避免在主线程运行动画
   - 使用 useNativeDriver

请逐个实现优化点，并提供优化前后对比建议。
```

### 提示词 7.2 - 错误处理与监控

```
实现完善的错误处理和监控系统。

1. **全局错误边界**
   - React Error Boundary
   - 友好的错误页面
   - 错误信息上报
   - 刷新重试功能

2. **API 错误处理**
   - 统一错误码映射
   - 错误提示文案
   - 重试机制
   - 网络离线检测

3. **用户友好提示**
   - 网络错误："网络连接失败，请检查网络设置"
   - 服务器错误："服务器开小差了，请稍后再试"
   - 权限错误："需要登录才能继续"
   - 数据为空："暂无内容"

4. **Sentry 集成**
   - 安装配置 @sentry/react-native
   - 错误自动上报
   - 用户行为追踪
   - 性能监控
   - 发布版本区分

5. **日志系统**
   - 开发环境：console.log
   - 生产环境：关闭日志或仅错误
   - 可配置的日志级别

6. **Analytics 埋点**
   - 页面浏览（PV）
   - 按钮点击
   - 功能使用
   - 用户路径
   - 转化漏斗

文件：
- src/components/ErrorBoundary.jsx
- src/utils/errorHandler.js
- src/utils/logger.js
- src/utils/analytics.js
- src/config/sentry.js
```

### 提示词 7.3 - 测试与质量保证

```
为 GoAbroad App 编写测试用例。

**测试策略**：

1. **单元测试**（Jest）
   - 工具函数测试
   - Redux reducer/action 测试
   - API 函数测试（Mock）
   - 自定义 Hook 测试

示例：
```javascript
// src/utils/__tests__/formatters.test.js
describe('formatCurrency', () => {
  it('should format USD correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000');
  });
});
```

2. **组件测试**（React Native Testing Library）
   - 基础组件渲染测试
   - 交互行为测试
   - 快照测试

示例：
```javascript
// src/components/ui/__tests__/Button.test.js
import { render, fireEvent } from '@testing-library/react-native';

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click</Button>);
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

3. **集成测试**
   - 页面流程测试
   - 表单提交测试
   - 导航跳转测试

4. **E2E 测试**（Detox，可选）
   - 登录流程
   - 创建规划流程
   - 发布帖子流程

5. **测试覆盖率**
   - 目标：>70%

运行测试：
```bash
npm test                 # 运行所有测试
npm test -- --coverage   # 生成覆盖率报告
npm test -- --watch      # 监听模式
```

请为关键模块编写测试用例。
```

### 提示词 7.4 - 打包与发布准备

```
准备 App 打包和发布。

**iOS 打包**：

1. **配置检查**
   - app.json 配置完整
   - Bundle ID 设置
   - 版本号和构建号
   - 权限说明（相机、相册、定位等）
   - App图标和启动图

2. **EAS Build 配置**
   ```json
   // eas.json
   {
     "build": {
       "production": {
         "ios": {
           "buildConfiguration": "Release"
         }
       }
     }
   }
   ```

3. **打包命令**
   ```bash
   eas build --platform ios --profile production
   ```

4. **TestFlight 提交**
   - 下载 IPA
   - 上传到 App Store Connect
   - 填写测试信息

**Android 打包**：

1. **签名配置**
   - 生成 keystore
   - 配置签名信息

2. **打包命令**
   ```bash
   eas build --platform android --profile production
   ```

3. **Google Play 提交准备**
   - 应用图标（512x512）
   - 功能图片
   - 截图（手机+平板）
   - 隐私政策链接
   - 应用描述（中英文）

**发布检查清单**：
- [ ] 所有功能测试通过
- [ ] 性能测试通过
- [ ] 错误监控已配置
- [ ] 分析工具已集成
- [ ] App图标已设置
- [ ] 启动页已优化
- [ ] 权限说明已添加
- [ ] 隐私政策已准备
- [ ] 用户协议已准备
- [ ] 应用商店描述已撰写
- [ ] 截图已准备（5-8张）
- [ ] 宣传视频已制作（可选）

**应用商店素材**：

App 名称：GoAbroad - 出国助手

简短描述：
"一站式出国留学/工作/移民规划助手，让出国变得简单透明"

详细描述：
[参考产品计划书的描述撰写]

关键词：
留学,出国,签证,移民,规划,时间线,材料清单,社区,攻略

分类：
- 主类别：教育
- 次类别：旅行

请协助完成打包配置和应用商店素材准备。
```

---

## 📝 使用说明

### 如何使用这些提示词？

1. **按阶段顺序执行**：从阶段0开始，逐步推进
2. **每个提示词独立使用**：复制提示词到 AI 对话框
3. **验证后再继续**：完成一个阶段后测试验证再进入下一阶段
4. **根据实际调整**：可以根据项目实际情况微调提示词内容
5. **保持上下文**：在同一对话中完成相关提示词，保持上下文连贯

### 预计时间安排

- **阶段 0**：2-3天（基础架构）
- **阶段 1**：5-7天（组件库）
- **阶段 2**：3-4天（认证系统）
- **阶段 3**：5-6天（首页与国家）
- **阶段 4**：7-10天（规划系统）
- **阶段 5**：5-7天（社区模块）
- **阶段 6**：4-5天（工具与个人中心）
- **阶段 7**：3-5天（优化与发布）

**总计：约5-7周**

---

这套提示词完全基于您的产品设计文档，具有：
1. ✅ **清晰的阶段划分** - 7个大阶段，每个阶段3-4个提示词
2. ✅ **完整的UI实现** - 每个页面都按设计稿要求
3. ✅ **大局观架构** - 从目录结构到状态管理，全面考虑
4. ✅ **可执行性强** - 每个提示词都有明确的交付物和文件路径
5. ✅ **技术栈匹配** - 基于您已有的 Expo + React Native 项目

建议您切换到 **Agent 模式**，让 AI 根据这些提示词逐步实现项目！