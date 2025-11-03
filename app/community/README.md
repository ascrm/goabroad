# 社区模块页面

## 页面结构

### 发布相关页面
- `post/create.jsx` - 发布动态（X/Twitter 风格）
- `article/create.jsx` - 写攻略（长文章）
- `question/create.jsx` - 提问题（Q&A）
- `answer/create.jsx` - 写回答

### 浏览页面
- `post/[id].jsx` - 帖子详情页

### 旧文件（待废弃）
- `create.jsx` - 旧版通用发布页面，已被上述四个独立页面替代

## 路由说明

发布选择器（`CreatePostModal`）会根据用户选择跳转到对应页面：
- 发布动态 → `/community/post/create`
- 提问题 → `/community/question/create`
- 写回答 → `/community/answer/create`
- 写攻略 → `/community/article/create`
- 创建规划 → `/planning/create`

## 功能特点

### 发布动态 (POST)
- X/Twitter 风格设计
- 显示用户头像和信息
- 支持图片/视频上传（全屏预览模式）
- 可选标签和分区
- 自动保存草稿

### 写攻略 (ARTICLE)
- 标题 + 正文模式
- 支持封面图
- 富文本编辑器（简化版）
- 标签和分区
- 字数统计

### 提问题 (QUESTION)
- 标题 + 详细描述
- 必填标签（至少1个）
- 可选分区
- 进度提示（标题/描述/标签完成状态）
- 提示卡片引导

### 写回答 (ANSWER)
- 显示原问题卡片
- 回答输入区
- 可选图片上传
- 字数统计（最少10字）
- 通过路由参数接收问题信息

## 数据流

所有发布页面都使用 Redux 的 `publishPost` action 来发布内容，根据 `contentType` 区分：
- `POST` - 动态
- `ARTICLE` - 攻略
- `QUESTION` - 问题
- `ANSWER` - 回答（实际应该用评论 API）

## 草稿系统

每个页面都有独立的草稿存储：
- 发布动态：`community_post_draft`
- 写攻略：`community_article_draft`
- 提问题：`community_question_draft`
- 写回答：`community_answer_draft_{questionId}`

草稿会在以下情况自动保存：
1. 内容变化后 2 秒
2. 页面离开前
3. 发布成功后会清除草稿
