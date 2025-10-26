/**
 * 抽屉手势包装组件
 * 为子组件添加从左向右滑动打开抽屉的手势支持
 */

import React from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';

const SWIPE_THRESHOLD = 50; // 滑动距离阈值（像素）
const EDGE_WIDTH = 40; // 边缘触发区域宽度（像素）

export default function DrawerGestureWrapper({ children, onSwipeOpen }) {
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // 只在屏幕左边缘区域开始滑动时响应
        return evt.nativeEvent.pageX < EDGE_WIDTH;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // 只在从左向右滑动时响应
        return evt.nativeEvent.pageX < EDGE_WIDTH && gestureState.dx > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        // 可以在这里添加实时跟随手指的动画效果
      },
      onPanResponderRelease: (evt, gestureState) => {
        // 如果滑动距离超过阈值，打开抽屉
        if (gestureState.dx > SWIPE_THRESHOLD) {
          onSwipeOpen && onSwipeOpen();
        }
      },
      onPanResponderTerminate: () => {
        // 手势被中断
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

