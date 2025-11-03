/**
 * 发布选择器占位页面
 * 
 * 注意：此页面已改为全局Modal形式，实际功能在 src/components/layout/CreatePostModal.jsx
 * 此文件保留是为了保持 Tab 路由配置，实际点击行为已被 _layout.jsx 拦截
 * 
 * 交互流程：
 * 1. 用户点击底部中间的"+"按钮
 * 2. _layout.jsx 中的 tabBarButton 拦截导航
 * 3. 触发 Redux action: openCreatePostModal
 * 4. CreatePostModal 组件在当前页面上方弹出
 * 5. 不会触发此页面的渲染
 */

import React from 'react';
import { View } from 'react-native';

export default function CreatePostScreen() {
  // 空页面占位符
  // 实际上这个组件不会被渲染，因为导航已被拦截
  return <View />;
}

