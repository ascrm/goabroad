看了代码，我发现了几个可能导致底部抽屉无法弹出的问题：

## 主要问题分析：

1. **两个独立的 Modal 可能存在冲突**：你有两个平级的 Modal（侧边抽屉和底部抽屉），在某些情况下，React Native 的 Modal 组件同时显示多个可能会有问题。

2. **层级和渲染顺序问题**：底部抽屉的 Modal 虽然有高 z-index，但它是完全独立于侧边抽屉 Modal 的，可能无法正常显示在上层。

3. **点击事件可能被拦截**：虽然你设置了点击事件，但在 Modal 内部的复杂手势处理可能会有问题。

## 解决方案：

建议将底部抽屉放在**同一个 Modal 内部**，作为侧边抽屉的覆盖层。这样可以确保正确的层级关系和事件处理。

```jsx:src/components/layout/DrawerMenu.jsx
// ... existing code ...

return (
  <Modal
    visible={visible}
    transparent
    animationType="none"
    onRequestClose={() => {
      if (showAccountSheet) {
        setShowAccountSheet(false);
      } else {
        onClose();
      }
    }}
  >
    <View style={styles.overlay}>
      {/* 遮罩层 - 必须在抽屉之前渲染，这样抽屉会在上层 */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* 抽屉内容 */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
        onStartShouldSetResponder={() => true}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* ... 抽屉内容保持不变 ... */}
      </Animated.View>

      {/* 底部账户切换抽屉 - 放在同一个 Modal 内 */}
      {showAccountSheet && (
        <>
          {/* 底部抽屉的遮罩层 */}
          <Animated.View
            style={[
              styles.sheetBackdrop,
              {
                opacity: sheetBackdropOpacity,
              },
            ]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFillObject}
              activeOpacity={1}
              onPress={() => setShowAccountSheet(false)}
            />
          </Animated.View>

          {/* 底部抽屉内容 */}
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                transform: [{ translateY: sheetSlideAnim }],
              },
            ]}
            onStartShouldSetResponder={() => true}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* 抽屉顶部拖动条 */}
            <View style={styles.sheetHandle}>
              <View style={styles.sheetHandleBar} />
            </View>

            {/* 标题 */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>账户管理</Text>
            </View>

            {/* 选项列表 */}
            <View style={styles.sheetContent}>
              <TouchableOpacity
                style={styles.sheetOption}
                onPress={() => {
                  setShowAccountSheet(false);
                  setTimeout(() => {
                    handleNavigate('/auth/register');
                  }, 300);
                }}
              >
                <View style={styles.sheetOptionIcon}>
                  <Ionicons name="person-add-outline" size={24} color={COLORS.primary[600]} />
                </View>
                <View style={styles.sheetOptionContent}>
                  <Text style={styles.sheetOptionTitle}>创建新账号</Text>
                  <Text style={styles.sheetOptionDescription}>注册一个全新的 GoAbroad 账号</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
              </TouchableOpacity>

              <View style={styles.sheetDivider} />

              <TouchableOpacity
                style={styles.sheetOption}
                onPress={() => {
                  setShowAccountSheet(false);
                  setTimeout(() => {
                    handleNavigate('/auth/add-account');
                  }, 300);
                }}
              >
                <View style={styles.sheetOptionIcon}>
                  <Ionicons name="people-outline" size={24} color={COLORS.primary[600]} />
                </View>
                <View style={styles.sheetOptionContent}>
                  <Text style={styles.sheetOptionTitle}>添加已有账号</Text>
                  <Text style={styles.sheetOptionDescription}>登录并切换到其他账号</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
              </TouchableOpacity>

              <View style={styles.sheetDivider} />

              <TouchableOpacity
                style={styles.sheetOption}
                onPress={() => {
                  setShowAccountSheet(false);
                  setTimeout(() => {
                    handleLogout();
                  }, 300);
                }}
              >
                <View style={styles.sheetOptionIcon}>
                  <Ionicons name="log-out-outline" size={24} color={COLORS.error[500]} />
                </View>
                <View style={styles.sheetOptionContent}>
                  <Text style={[styles.sheetOptionTitle, { color: COLORS.error[500] }]}>退出登录</Text>
                  <Text style={styles.sheetOptionDescription}>退出当前账号</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  </Modal>
);
```

同时，更新底部抽屉的样式，确保它在绝对定位且覆盖整个屏幕：

```jsx:src/components/layout/DrawerMenu.jsx
// ... existing styles ...

// 底部抽屉样式
sheetBackdrop: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 100, // 确保在侧边抽屉上方
},
bottomSheet: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: COLORS.white,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  paddingBottom: 40,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 10,
  zIndex: 101, // 确保在遮罩上方
},
```

## 关键改动：

1. **删除了第二个独立的 Modal**，将底部抽屉移到侧边抽屉 Modal 内部
2. **使用条件渲染**：`{showAccountSheet && (...)}`
3. **调整了样式**：给底部抽屉添加 `position: 'absolute'` 和 `bottom: 0`，确保它从底部出现
4. **修改了 onRequestClose**：处理返回键时先关闭底部抽屉，再关闭侧边抽屉

这样可以确保底部抽屉能够正确显示在侧边抽屉上方，并且事件处理也会更加可靠。

由于你在 **ask 模式**，我无法直接修改文件。请切换到 **agent 模式**，或者手动复制上述代码进行修改。