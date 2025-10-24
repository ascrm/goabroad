# 首页模块组件

首页是 GoAbroad 应用的核心入口，展示用户的个性化内容、计划进度、快捷工具和推荐内容。

## 📦 组件列表

### 1. GreetingHeader（问候区）
**文件**：`GreetingHeader.jsx`

**功能**：
- 根据时间显示动态问候语（早上好/下午好/晚上好）
- 显示用户昵称
- 显示距离目标日期的倒计时

**Props**：
```javascript
{
  userName: string,        // 用户昵称
  targetDate: string,      // 目标日期 (YYYY-MM-DD)
  targetCountry: string,   // 目标国家/项目名称
}
```

**示例**：
```jsx
<GreetingHeader
  userName="张三"
  targetDate="2026-09-01"
  targetCountry="美国留学"
/>
```

---

### 2. PlanCard（我的计划卡片）
**文件**：`PlanCard.jsx`

**功能**：
- 显示用户的留学/工作/移民计划
- 环形进度图显示整体完成度
- 展示已完成/总任务数
- 显示距离出发的倒计时
- 列出近期待办事项（3条）
- 空状态时引导用户创建计划

**依赖**：
- `react-native-circular-progress` - 环形进度图

**Props**：
```javascript
{
  plan: {
    id: string,              // 计划ID
    name: string,            // 计划名称
    targetDate: string,      // 目标日期
    completedTasks: number,  // 已完成任务数
    totalTasks: number,      // 总任务数
    upcomingTasks: Array<{   // 近期待办事项
      title: string,
      dueDate: string,
    }>,
  } | null,
}
```

**示例**：
```jsx
<PlanCard
  plan={{
    id: '1',
    name: '美国留学计划',
    targetDate: '2026-09-01',
    completedTasks: 17,
    totalTasks: 25,
    upcomingTasks: [
      { title: '准备托福考试', dueDate: '2024-12-15' },
      { title: '撰写个人陈述', dueDate: '2024-12-20' },
    ],
  }}
/>
```

**特性**：
- ✅ 自动计算进度百分比
- ✅ 自动计算倒计时天数
- ✅ 点击卡片跳转到规划详情页
- ✅ 空状态引导创建计划

---

### 3. QuickTools（快捷工具区）
**文件**：`QuickTools.jsx`

**功能**：
- 横向滚动展示常用工具入口
- 每个工具带图标、名称和简短描述
- 点击工具跳转到对应功能页面

**内置工具**：
1. 💰 费用计算器
2. 📅 签证预约助手
3. 🔄 GPA转换器
4. 📋 清单下载
5. 💱 汇率换算
6. ⏰ 时差查询

**Props**：无（工具列表内置）

**示例**：
```jsx
<QuickTools />
```

**自定义**：
可以在组件内部的 `TOOLS` 数组中添加或修改工具：
```javascript
const TOOLS = [
  {
    id: 'cost-calculator',
    icon: 'calculator',           // Ionicons 图标名
    name: '费用计算',
    description: '计算留学费用',
    color: '#2563EB',            // 图标颜色
    bgColor: '#EFF6FF',          // 背景颜色
    route: '/tools/cost-calculator',
  },
  // ... 更多工具
];
```

---

### 4. RecommendFeed（为你推荐）
**文件**：`RecommendFeed.jsx`

**功能**：
- 显示推荐的社区内容（帖子/经验分享）
- 每个帖子包含封面图、标题、作者、标签、互动数据
- 点击卡片跳转到帖子详情
- 点击"查看更多"跳转到社区页面

**依赖**：
- `expo-image` - 优化的图片组件

**Props**：无（目前使用模拟数据）

**示例**：
```jsx
<RecommendFeed />
```

**数据结构**：
```javascript
{
  id: number,
  title: string,              // 帖子标题
  author: {
    name: string,             // 作者昵称
    avatar: string,           // 头像URL
  },
  coverImage: string,         // 封面图URL
  tags: string[],             // 标签数组
  likes: number,              // 点赞数
  comments: number,           // 评论数
  publishTime: string,        // 发布时间
}
```

**TODO**：
- [ ] 对接后端API获取真实推荐数据
- [ ] 添加个性化推荐算法
- [ ] 支持下拉刷新

---

## 🎨 设计规范

### 颜色
- 主色：`COLORS.primary[600]` (#2563EB)
- 成功色：`COLORS.success[500]` (#10B981)
- 警告色：`COLORS.warning[500]` (#F59E0B)
- 背景色：`COLORS.gray[50]` (#F9FAFB)

### 间距
- 卡片外边距：16px
- 卡片内边距：16-20px
- 区块间距：20-24px

### 圆角
- 卡片圆角：12-16px
- 按钮圆角：24px (药丸型)
- 头像圆角：50% (圆形)

### 阴影
```javascript
{
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 5,
}
```

---

## 📱 主页面组件

### Home（首页主文件）
**文件**：`app/(main)/home.jsx`

**功能**：
- 整合所有首页子组件
- 顶部导航栏（Logo + 搜索 + 通知）
- 下拉刷新功能
- 响应式布局

**布局结构**：
```
┌─────────────────────────────┐
│  Logo    [🔍]  [🔔3]        │  ← 顶部导航栏
├─────────────────────────────┤
│  早上好，张三                 │  ← 问候区
│  距离美国留学出发还有 526 天  │
├─────────────────────────────┤
│  ┌───────────────────────┐  │
│  │ 我的计划 - 美国留学    │  │  ← 计划卡片
│  │ [68% 进度图] 统计信息  │  │
│  │ 近期待办...           │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  ⚡ 快捷工具                │
│  [💰][📅][🔄][📋] →       │  ← 快捷工具（横向滚动）
├─────────────────────────────┤
│  📱 为你推荐               │
│  ┌───────────────────────┐  │
│  │ [封面图]              │  │  ← 推荐内容
│  │ 美国F1签证面签攻略...  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

---

## 🚀 使用方法

### 1. 安装依赖
确保项目已安装以下依赖：
```bash
npm install react-native-circular-progress expo-image
```

### 2. 导入组件
```javascript
import { GreetingHeader, PlanCard, QuickTools, RecommendFeed } from '@/src/components/home';
```

### 3. 使用示例
```jsx
export default function Home() {
  const { userInfo } = useAuth();
  const [userPlan, setUserPlan] = useState(null);

  return (
    <ScrollView>
      <GreetingHeader
        userName={userInfo?.name}
        targetDate={userPlan?.targetDate}
        targetCountry="美国留学"
      />
      <PlanCard plan={userPlan} />
      <QuickTools />
      <RecommendFeed />
    </ScrollView>
  );
}
```

---

## 🔧 待完成功能

### 短期（P0）
- [ ] 对接真实的用户计划数据（从 Redux 获取）
- [ ] 对接推荐内容 API
- [ ] 实现搜索功能入口
- [ ] 实现通知功能

### 中期（P1）
- [ ] 添加骨架屏加载状态
- [ ] 支持多个计划切换
- [ ] 工具使用次数统计
- [ ] 推荐内容个性化

### 长期（P2）
- [ ] 添加首页轮播 Banner
- [ ] 热门国家推荐区块
- [ ] 最近浏览历史
- [ ] 首页数据缓存优化

---

## 📊 性能优化

### 已优化
- ✅ 使用 `expo-image` 替代 `Image`（自动缓存）
- ✅ 横向滚动列表使用 `ScrollView`
- ✅ 卡片点击使用 `activeOpacity` 提升交互体验
- ✅ 下拉刷新防抖处理

### 待优化
- [ ] 图片懒加载
- [ ] 列表虚拟化（如果推荐内容过多）
- [ ] 使用 React.memo 优化子组件渲染
- [ ] 添加缓存策略

---

## 🐛 已知问题

1. **路由跳转**：部分跳转路由暂时注释，待对应页面创建后启用
2. **模拟数据**：当前使用 mock 数据，需要对接后端 API
3. **环形进度图在 Web 端**：可能需要额外配置才能正常显示

---

## 📝 更新日志

### v1.0.0 (2024-10-24)
- ✅ 创建问候区组件
- ✅ 创建计划卡片组件（有计划/无计划两种状态）
- ✅ 创建快捷工具区组件
- ✅ 创建为你推荐组件
- ✅ 整合首页主文件
- ✅ 添加下拉刷新功能
- ✅ 添加顶部导航栏（搜索/通知）

---

## 👥 维护者

GoAbroad 开发团队

如有问题或建议，请创建 Issue 或 PR。

