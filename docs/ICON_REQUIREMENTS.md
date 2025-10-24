# 📦 GoAbroad 项目 Icon 需求文档

**项目名称**：GoAbroad 出国助手  
**版本**：v1.0  
**创建日期**：2024年10月24日  
**更新日期**：2024年10月24日

---

## 📋 目录

1. [已使用的 Icon](#已使用的-icon)
2. [需要新增的 Icon](#需要新增的-icon)
3. [Icon 规范](#icon-规范)
4. [资源推荐](#资源推荐)

---

## ✅ 已使用的 Icon

### 当前项目中使用的 Icon 库
- **@expo/vector-icons** (已安装)
  - 包含 Ionicons, MaterialIcons, FontAwesome 等多个图标库
  - 用于界面中的常用图标

### 已使用的 Ionicons 图标列表

| 图标名称 | 用途 | 使用位置 |
|---------|------|---------|
| `search` | 搜索按钮 | 首页顶部导航栏 |
| `notifications-outline` | 通知按钮 | 首页顶部导航栏 |
| `rocket` | 开始规划按钮 | 空状态卡片 |
| `airplane` | 旅行场景图标 | 空状态插画 |
| `chevron-forward` | 右箭头 | 国家卡片、攻略列表 |
| `document-text-outline` | 文档图标 | 攻略来源标识 |
| `eye-outline` | 阅读量图标 | 攻略阅读数 |

---

## 🆕 需要新增的 Icon

目前项目中已使用的 Ionicons 图标库已经满足基本需求，**暂时不需要额外下载新的 icon 资源**。

### 未来可能需要的图标

如果后续开发需要以下场景的图标，可以考虑添加：

#### 1. 规划流程相关
- [ ] 时间线图标（timeline）
- [ ] 检查清单图标（checklist）
- [ ] 进度条图标（progress）
- [ ] 目标图标（target）

#### 2. 国家/地区相关
- [ ] 地球图标（globe）
- [ ] 地图图标（map）
- [ ] 护照图标（passport）
- [ ] 签证图标（visa）

#### 3. 学习/教育相关
- [ ] 毕业帽图标（graduation-cap）
- [ ] 学校建筑图标（school）
- [ ] 书本图标（book）
- [ ] 证书图标（certificate）

#### 4. 社交/互动相关
- [ ] 点赞图标（thumbs-up）
- [ ] 评论图标（comment）
- [ ] 分享图标（share）
- [ ] 收藏图标（bookmark）

#### 5. 其他功能图标
- [ ] 筛选图标（filter）
- [ ] 排序图标（sort）
- [ ] 设置图标（settings）
- [ ] 帮助图标（help-circle）

---

## 🎨 Icon 规范

### 设计规范

#### 尺寸规范
```javascript
// 图标尺寸标准
const ICON_SIZES = {
  xs: 16,   // 极小图标
  sm: 20,   // 小图标
  md: 24,   // 标准图标（最常用）
  lg: 32,   // 大图标
  xl: 48,   // 特大图标
};
```

#### 颜色规范
```javascript
// 常用图标颜色
import { COLORS } from '@/src/constants';

const ICON_COLORS = {
  primary: COLORS.primary[600],    // 主要操作
  secondary: COLORS.gray[600],     // 次要操作
  tertiary: COLORS.gray[400],      // 辅助信息
  disabled: COLORS.gray[300],      // 禁用状态
  error: COLORS.error[500],        // 错误提示
  success: COLORS.success[500],    // 成功提示
  warning: COLORS.warning[500],    // 警告提示
};
```

### 使用示例

```jsx
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/constants';

// 基本用法
<Ionicons name="search" size={24} color={COLORS.gray[700]} />

// 带触摸反馈
<TouchableOpacity onPress={handlePress}>
  <Ionicons name="notifications-outline" size={24} color={COLORS.gray[700]} />
</TouchableOpacity>

// 在按钮中使用
<TouchableOpacity style={styles.button}>
  <Ionicons name="rocket" size={20} color="#FFFFFF" />
  <Text style={styles.buttonText}>开始规划</Text>
</TouchableOpacity>
```

---

## 📚 资源推荐

### 在线图标库

#### 1. Ionicons（推荐，已集成）
- **官网**：https://ionic.io/ionicons
- **特点**：
  - ✅ 已通过 @expo/vector-icons 集成
  - ✅ 图标丰富，超过 1,300+ 图标
  - ✅ 支持 outline 和 filled 两种风格
  - ✅ 无需额外下载，直接使用

#### 2. Material Icons
- **官网**：https://fonts.google.com/icons
- **特点**：
  - ✅ 已通过 @expo/vector-icons 集成
  - Google 设计规范
  - 图标库最全面

#### 3. FontAwesome
- **官网**：https://fontawesome.com/icons
- **特点**：
  - ✅ 已通过 @expo/vector-icons 集成
  - 商业使用友好
  - 图标种类丰富

### SVG 插画资源

#### 1. unDraw（推荐）
- **官网**：https://undraw.co/illustrations
- **特点**：
  - ✅ 免费商用
  - ✅ 支持自定义颜色
  - ✅ SVG 格式
  - 适合空状态、引导页等场景

#### 2. Illustrations.co
- **官网**：https://illlustrations.co/
- **特点**：
  - 高质量插画
  - 多种风格

#### 3. Blush
- **官网**：https://blush.design/
- **特点**：
  - 支持自定义
  - 适合品牌化设计

### 国旗图标资源

#### 1. Unicode Emoji（当前使用）
- **特点**：
  - ✅ 无需下载，直接使用
  - ✅ 跨平台兼容
  - 示例：🇺🇸 🇬🇧 🇨🇦 🇦🇺

```javascript
// 当前使用方式
const countries = [
  { name: '美国', flag: '🇺🇸' },
  { name: '英国', flag: '🇬🇧' },
  { name: '加拿大', flag: '🇨🇦' },
];
```

#### 2. FlagKit（备选）
- **GitHub**：https://github.com/madebybowtie/FlagKit
- **特点**：
  - 高质量国旗图标
  - SVG 格式
  - 需要手动集成

---

## 🛠️ 如何添加新图标

### 方法 1：使用 @expo/vector-icons（推荐）

```javascript
// 1. 查看可用图标
// 访问：https://icons.expo.fyi/

// 2. 在代码中使用
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

// Ionicons
<Ionicons name="airplane" size={24} color="black" />

// Material Icons
<MaterialIcons name="flight" size={24} color="black" />

// FontAwesome
<FontAwesome name="plane" size={24} color="black" />
```

### 方法 2：添加自定义 SVG 图标

```javascript
// 1. 安装依赖（已安装）
// npm install react-native-svg

// 2. 使用 SVG 组件
import Svg, { Path, Circle } from 'react-native-svg';

const CustomIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path d="M..." fill="#000" />
  </Svg>
);
```

### 方法 3：使用图片格式图标

```javascript
// 1. 将图标文件放到 assets/images/ 目录

// 2. 使用 expo-image 加载
import { Image } from 'expo-image';

<Image
  source={require('@/assets/images/custom-icon.png')}
  style={{ width: 24, height: 24 }}
/>
```

---

## ✅ 当前资源清单

### 已有资源
- ✅ `@expo/vector-icons` - 图标库（已安装）
- ✅ `react-native-svg` - SVG 支持（已安装）
- ✅ `expo-image` - 图片组件（已安装）
- ✅ `assets/images/travelers_blanket.svg` - 旅行插画

### 暂不需要新增的资源
- ❌ 额外的图标包（当前 Ionicons 已足够）
- ❌ 自定义图标文件（可使用内置图标）

---

## 📝 使用建议

### 1. 优先使用内置图标
- 使用 Ionicons 作为首选
- 图标库已包含 1,300+ 常用图标
- 性能更好，包体积更小

### 2. 保持一致性
- 在同一个项目中尽量使用同一个图标库
- 避免混用多种风格的图标
- 统一图标尺寸和颜色

### 3. 性能优化
- 避免使用过大的图标文件
- SVG 图标优于 PNG/JPG
- 合理使用图标缓存

### 4. 可访问性
- 为图标添加语义化的 accessibilityLabel
- 确保图标和背景有足够的对比度
- 重要操作不要仅依赖图标

---

## 🔄 更新记录

| 日期 | 版本 | 更新内容 |
|-----|------|---------|
| 2024-10-24 | v1.0 | 创建文档，整理当前图标使用情况 |

---

## 📞 联系方式

如需添加特定图标或有疑问，请联系开发团队。

---

**注意**：当前项目已有的图标库（@expo/vector-icons）已经能满足大部分需求，建议优先使用内置图标，只有在确实找不到合适图标时才考虑添加自定义图标资源。

