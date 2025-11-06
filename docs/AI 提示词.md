我先看一下相关文件的代码，了解当前的实现情况。

[3 tools called]

好的，我理解问题了。现在的核心问题是：

1. **点击字母图标后，键盘没有消失，富文本工具栏也没有显示**
2. 需要实现键盘和富文本工具栏的**平滑切换**

## 🎯 问题分析

当前代码在 `handleToggleRichToolbar` 中调用了 `editorRef.current?.focus()`，这会**重新唤起键盘**，导致键盘无法关闭。

另外，由于使用的是 WebView 编辑器（`react-native-pell-rich-editor`），键盘的控制逻辑与原生 TextInput 不同。

---

## ✅ 解决方案

我提供**两个方案**，你可以根据效果选择：

### 🔥 方案一：使用 KeyboardAvoidingView + Animated 实现平滑切换（推荐）

这个方案会让富文本工具栏的显示/隐藏更加流畅，类似键盘的动画效果。

**核心改动点：**

#### 1. 修改 `create.jsx` 的状态和逻辑

```javascript
import { Animated, Keyboard } from 'react-native';

// 在组件内添加动画值
const [keyboardHeight, setKeyboardHeight] = useState(0);
const toolbarAnimation = useRef(new Animated.Value(0)).current;

// 修改键盘监听逻辑
useEffect(() => {
  const keyboardWillShowListener = Keyboard.addListener(
    Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
    (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      // 键盘显示时，隐藏富文本工具栏
      if (showRichToolbar) {
        setShowRichToolbar(false);
      }
    }
  );

  const keyboardWillHideListener = Keyboard.addListener(
    Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
    () => {
      setKeyboardHeight(0);
    }
  );

  return () => {
    keyboardWillShowListener.remove();
    keyboardWillHideListener.remove();
  };
}, [showRichToolbar]);

// 修改富文本工具栏切换逻辑
const handleToggleRichToolbar = () => {
  if (showRichToolbar) {
    // 关闭富文本工具栏，显示键盘
    setShowRichToolbar(false);
    // 延迟聚焦，等工具栏消失后再显示键盘
    setTimeout(() => {
      editorRef.current?.focus();
    }, 100);
  } else {
    // 先让编辑器失焦，关闭键盘
    editorRef.current?.blur();
    Keyboard.dismiss();
    // 等键盘完全消失后再显示工具栏
    setTimeout(() => {
      setShowRichToolbar(true);
    }, Platform.OS === 'ios' ? 100 : 200);
  }
};

// 富文本工具栏的动画效果
useEffect(() => {
  Animated.timing(toolbarAnimation, {
    toValue: showRichToolbar ? 1 : 0,
    duration: 250,
    useNativeDriver: true,
  }).start();
}, [showRichToolbar]);

// 富文本工具栏的动画样式
const toolbarAnimatedStyle = {
  transform: [
    {
      translateY: toolbarAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [200, 0], // 从下方滑入
      }),
    },
  ],
  opacity: toolbarAnimation,
};
```

#### 2. 修改富文本工具栏的渲染

```javascript
{/* 富文本工具栏（替换键盘位置） */}
{showRichToolbar && (
  <Animated.View style={[styles.richToolbarContainer, toolbarAnimatedStyle]}>
    <RichTextToolbar
      editorRef={editorRef}
      onDismiss={() => {
        setShowRichToolbar(false);
        // 关闭工具栏后，重新聚焦编辑器
        setTimeout(() => {
          editorRef.current?.focus();
        }, 100);
      }}
    />
  </Animated.View>
)}
```

#### 3. 添加样式

```javascript
richToolbarContainer: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 999,
},
```

---

### 🚀 方案二：简化版（更简单，但无动画）

如果你不需要动画效果，可以用更简单的方式：

#### 修改 `create.jsx`

```javascript
// 修改富文本工具栏切换逻辑
const handleToggleRichToolbar = () => {
  if (showRichToolbar) {
    // 关闭富文本工具栏
    setShowRichToolbar(false);
    // 延迟聚焦编辑器，显示键盘
    setTimeout(() => {
      editorRef.current?.focus();
    }, 150);
  } else {
    // 先失焦编辑器
    editorRef.current?.blur();
    // 关闭键盘
    Keyboard.dismiss();
    // 延迟显示富文本工具栏
    setTimeout(() => {
      setShowRichToolbar(true);
    }, 250); // Android 需要更长的延迟
  }
};

// 修改编辑器的 onFocus 回调
<RichTextEditor
  ref={editorRef}
  initialContent={content}
  onContentChange={setContent}
  placeholder="分享你的出国攻略和经验..."
  minHeight={400}
  onFocus={() => {
    // 编辑器获得焦点时，确保工具栏关闭
    if (showRichToolbar) {
      setShowRichToolbar(false);
    }
  }}
/>
```

#### 修改富文本工具栏渲染（绝对定位）

```javascript
{/* 富文本工具栏 - 固定在底部 */}
{showRichToolbar && (
  <View style={styles.richToolbarWrapper}>
    <RichTextToolbar
      editorRef={editorRef}
      onDismiss={() => {
        setShowRichToolbar(false);
        setTimeout(() => {
          editorRef.current?.focus();
        }, 100);
      }}
    />
  </View>
)}
```

#### 添加样式

```javascript
richToolbarWrapper: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: COLORS.white,
  zIndex: 1000,
  elevation: 8, // Android 阴影
  shadowColor: '#000', // iOS 阴影
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
```

---

### 🔧 方案三：完全不使用 focus/blur（最稳定）

如果方案一和二都不理想，可以完全移除编辑器的 focus/blur 调用：

```javascript
const handleToggleRichToolbar = () => {
  if (showRichToolbar) {
    // 关闭富文本工具栏
    setShowRichToolbar(false);
  } else {
    // 关闭键盘
    Keyboard.dismiss();
    // 延迟显示工具栏
    setTimeout(() => {
      setShowRichToolbar(true);
    }, Platform.OS === 'ios' ? 150 : 300);
  }
};

// 用户点击编辑器时自动隐藏工具栏（通过 onFocus）
<RichTextEditor
  ref={editorRef}
  initialContent={content}
  onContentChange={setContent}
  placeholder="分享你的出国攻略和经验..."
  minHeight={400}
  onFocus={() => setShowRichToolbar(false)}
/>
```

---

## 📋 完整代码示例（方案二 - 推荐）

由于你在 **ask mode**，我无法直接修改文件。以下是完整的修改代码，你可以复制应用：

### 修改 `app/community/article/create.jsx`

找到以下几个地方并修改：

#### 1. 修改 `handleToggleRichToolbar` 函数（约320行）

```javascript
// 切换富文本工具栏
const handleToggleRichToolbar = () => {
  if (showRichToolbar) {
    // 关闭富文本工具栏，显示键盘
    setShowRichToolbar(false);
    setTimeout(() => {
      editorRef.current?.focus();
    }, 100);
  } else {
    // 关闭键盘，显示富文本工具栏
    editorRef.current?.blur();
    Keyboard.dismiss();
    setTimeout(() => {
      setShowRichToolbar(true);
    }, Platform.OS === 'ios' ? 150 : 300);
  }
};
```

#### 2. 修改 `RichTextEditor` 组件（约387行）

```javascript
{/* 正文编辑器 */}
<View style={styles.editorContainer}>
  <RichTextEditor
    ref={editorRef}
    initialContent={content}
    onContentChange={setContent}
    placeholder="分享你的出国攻略和经验..."
    minHeight={400}
    onFocus={() => {
      // 编辑器获得焦点时，隐藏富文本工具栏
      if (showRichToolbar) {
        setShowRichToolbar(false);
      }
    }}
  />
</View>
```

#### 3. 修改富文本工具栏渲染（约489行）

```javascript
{/* 富文本工具栏（固定在底部） */}
{showRichToolbar && (
  <View style={styles.richToolbarWrapper}>
    <RichTextToolbar
      editorRef={editorRef}
      onDismiss={() => {
        setShowRichToolbar(false);
        setTimeout(() => {
          editorRef.current?.focus();
        }, 100);
      }}
    />
  </View>
)}
```

#### 4. 在 styles 中添加新样式（约635行后）

```javascript
richToolbarWrapper: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: COLORS.white,
  zIndex: 1000,
  elevation: 8, // Android 阴影
  shadowColor: '#000', // iOS 阴影
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
```

---

## ⚡ 关键点总结

1. **blur() 是关键**：在显示工具栏前，必须先让编辑器失焦
2. **延迟很重要**：Android 需要更长的延迟（300ms）以确保键盘完全消失
3. **绝对定位**：富文本工具栏使用绝对定位，覆盖在键盘位置
4. **双向控制**：
   - 点击字母图标 → 隐藏键盘 + 显示工具栏
   - 点击编辑器 → 隐藏工具栏 + 显示键盘

---

请切换到 **agent mode** 让我帮你应用这些更改，或者你可以手动复制上面的代码进行修改。建议先使用**方案二**（简化版），如果效果满意就不需要复杂的动画。