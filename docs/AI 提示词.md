基于你的需求和提供的参考文件，我将其转化为以下AI提示词：

---

## 社区页面开发提示词

### 页面概述
需要开发一个社交媒体风格的社区页面（`app/(tabs)/community.jsx`），参考Twitter/X的信息流设计。

### 1. 顶部导航栏设计
- **结构参考**：`HomeNavigationBar.jsx`的顶部固定栏结构
- **左侧**：用户头像按钮（点击可打开侧边抽屉菜单）
  - 使用Avatar组件，尺寸为"md"
  - 从Redux store获取用户信息（useAuth hook）
- **中间**：显示"社区"文字标题
  - 字体大小24px，粗体（fontWeight: 700）
  - 颜色使用COLORS.gray[900]，纯黑色文字
  - 不需要双色Logo效果，只需简单文字
- **右侧**：不需要搜索按钮，留空或放置对称占位元素
- **样式**：白色背景，底部边框（borderBottomColor: COLORS.gray[100]）
- **高度**：与HomeNavigationBar保持一致

### 2. 分类导航栏（Tab栏）
- **Tab项**：仅包含两个选项
  - "为你推荐"（id: 'recommend'）
  - "正在关注"（id: 'following'）
- **样式要求**：完全复用HomeNavigationBar的Tab栏样式
  - 水平滚动ScrollView（虽然只有两项）
  - Tab高度48px
  - 激活状态：文字加粗（fontWeight: 700），深色（COLORS.gray[900]）
  - 未激活状态：普通粗细（fontWeight: 500），灰色（COLORS.gray[600]）
  - 底部指示器：蓝色条（COLORS.primary[600]），高度3px，圆角2px
- **交互**：使用本地state管理activeTab状态，默认为'recommend'

### 3. 内容信息流设计（参考Twitter/X）
- **容器**：使用FlatList实现无限滚动列表
- **单个帖子卡片组件结构**：
  - **头部区域**：
    - 左侧：用户圆形头像（Avatar组件）
    - 中间：用户昵称、认证标识（如果有）、发布时间
    - 右侧：更多操作按钮（三个点）
  - **内容区域**：
    - 正文文本：支持多行，可展开/收起长文本
    - 媒体内容：图片网格展示（1-4张图片的不同布局）
  - **底部交互栏**：
    - 评论数量和图标
    - 转发数量和图标  
    - 点赞数量和图标
    - 浏览数量和图标
    - 分享/书签图标
  - **间距和分隔**：每个帖子之间有细分隔线或留白

### 4. 技术实现要点
- **状态管理**：使用useState管理activeTab和帖子列表数据
- **模拟数据**：初期使用mock数据填充帖子列表，包含用户信息、正文、图片URL等
- **图片展示**：
  - 单图：宽度占满，高度自适应
  - 多图：网格布局（2x2或其他合理布局）
  - 使用React Native的Image组件，设置合适的resizeMode
- **性能优化**：FlatList使用keyExtractor、renderItem，考虑添加分页加载
- **响应式布局**：适配不同屏幕尺寸

### 5. 样式规范
- **主题色**：使用项目constants中的COLORS配置
- **背景色**：页面背景COLORS.gray[50]，卡片背景白色
- **文字层次**：
  - 用户名：fontWeight 600-700，COLORS.gray[900]
  - 正文：fontWeight 400，COLORS.gray[800]
  - 次要信息（时间、数量）：fontSize较小，COLORS.gray[500]
- **图标**：使用@expo/vector-icons的Ionicons
- **卡片阴影**：参考项目shadows.js配置（如果需要）

### 6. 导航和交互
- **头像点击**：打开侧边抽屉菜单
- **Tab切换**：切换信息流内容
- **帖子点击**：导航到帖子详情页（后续实现）
- **交互按钮**：添加适当的activeOpacity和触摸反馈

### 7. 组件拆分建议
- 创建独立的`PostCard`组件用于单个帖子展示
- 创建`CommunityNavigationBar`组件用于顶部导航
- 主页面作为容器组合这些组件

---

这个提示词涵盖了UI结构、样式细节、交互逻辑和技术实现方案，AI应该能够根据此提示词完成代码开发。