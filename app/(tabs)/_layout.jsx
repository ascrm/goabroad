/**
 * Tabs Layout
 * 底部标签栏布局 - 带中间凸起发布按钮和全局抽屉
 */

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { createContext, useContext, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CreatePostModal, DrawerGestureWrapper, DrawerMenu } from '@/src/components/layout';
import { COLORS } from '@/src/constants';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { closeCreatePostModal, openCreatePostModal } from '@/src/store/slices/uiSlice';

// 创建抽屉上下文，用于在所有 tabs 中共享抽屉状态
const DrawerContext = createContext({
  openDrawer: () => {},
  closeDrawer: () => {},
});

export const useDrawer = () => useContext(DrawerContext);

export default function TabsLayout() {
  const dispatch = useAppDispatch();
  
  // 从 Redux 获取角标数据
  const unreadCount = useAppSelector((state) => state.ui.unreadCount);
  const createPostModalVisible = useAppSelector((state) => state.ui.createPostModalVisible);
  
  // 抽屉状态
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 格式化角标数字（>99 显示 99+）
  const formatBadge = (count) => {
    if (!count || count <= 0) return undefined;
    return count > 99 ? '99+' : count.toString();
  };

  // 抽屉控制函数
  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);
  
  // 发布选择器控制函数
  const handleOpenCreatePost = () => {
    dispatch(openCreatePostModal());
  };
  
  const handleCloseCreatePost = () => {
    dispatch(closeCreatePostModal());
  };

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="dark" />
        
        <DrawerGestureWrapper onSwipeOpen={openDrawer}>
          {/* Tabs 内容 */}
          <View style={styles.tabsContainer}>
            <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary[600],
        tabBarInactiveTintColor: COLORS.gray[400],
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.gray[200],
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarShowLabel: false, // 隐藏所有标签文字
        tabBarBadgeStyle: {
          backgroundColor: COLORS.error[500],
          color: COLORS.white,
          fontSize: 10,
          fontWeight: '700',
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          lineHeight: 18,
          textAlign: 'center',
        },
      }}
    >
      {/* Tab 1 - 首页 */}
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={28}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: '首页',
        }}
      />

      {/* Tab 2 - 社区（从第4个移到第2个）*/}
      <Tabs.Screen
        name="community"
        options={{
          title: '社区',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={28}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: '社区',
        }}
      />

      {/* Tab 3 - 发布（中间凸起按钮）*/}
      <Tabs.Screen
        name="create-post"
        options={{
          title: '发布',
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerButtonContainer}>
              <View style={[
                styles.centerButton,
                focused && styles.centerButtonActive
              ]}>
                <Ionicons
                  name="add"
                  size={32}
                  color={COLORS.white}
                />
              </View>
            </View>
          ),
          tabBarAccessibilityLabel: '发布内容',
          // 自定义 Tab 按钮，拦截导航行为
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={(e) => {
                // 阻止默认导航行为
                e.preventDefault();
                // 触发 Modal 显示
                handleOpenCreatePost();
              }}
            />
          ),
        }}
      />

      {/* Tab 4 - 国家（从第5个移到第4个）*/}
      <Tabs.Screen
        name="countries"
        options={{
          title: '国家',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'globe' : 'globe-outline'}
              size={28}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: '国家',
        }}
      />

      {/* Tab 5 - 消息（新增）*/}
      <Tabs.Screen
        name="messages"
        options={{
          title: '消息',
          tabBarBadge: formatBadge(unreadCount),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={28}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: '消息',
        }}
      />
            </Tabs>
          </View>
        </DrawerGestureWrapper>
        
        {/* 全局抽屉菜单 */}
        <DrawerMenu visible={drawerVisible} onClose={closeDrawer} />
        
        {/* 全局发布选择器 Modal */}
        <CreatePostModal 
          visible={createPostModalVisible}
          onClose={handleCloseCreatePost}
        />
      </SafeAreaView>
    </DrawerContext.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  tabsContainer: {
    flex: 1,
  },
  centerButtonContainer: {
    position: 'absolute',
    top: -20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  centerButtonActive: {
    backgroundColor: COLORS.primary[700],
    transform: [{ scale: 1.05 }],
  },
});
