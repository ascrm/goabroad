# 工具组件目录

存放编辑器相关的工具组件，如工具栏、富文本编辑器辅助组件等。

## 组件列表

### EditorToolbar

通用的编辑器工具栏组件，用于社区发布页面（问题、帖子、动态等）的底部工具栏。

**特性：**
- 灵活的配置项，支持显示/隐藏各个功能按钮
- 统一的样式和交互体验
- 支持自定义右侧提示文本
- 自动显示保存状态

**使用示例：**
```jsx
import EditorToolbar from '@/src/components/tools/EditorToolbar';

<EditorToolbar
  config={{
    showImage: true,
    showCamera: true,
    showMention: true,
    showTag: true,
  }}
  onPickImages={handlePickImages}
  onTakePhoto={handleTakePhoto}
  onMention={handleMention}
  onAddTag={handleAddTag}
  isSaving={isSaving}
  rightText="3张图片"
/>
```

详细文档请参考组件文件内的 JSDoc 注释。
