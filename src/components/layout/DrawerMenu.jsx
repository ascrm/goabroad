/**
 * 侧边抽屉菜单组件
 * 从左侧弹出的抽屉，包含用户信息和各种功能入口
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Avatar } from '@/src/components/ui';
import { COLORS } from '@/src/constants';
import { useAuth } from '@/src/store/hooks';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8; // 抽屉宽度为屏幕的80%

export default function DrawerMenu({ visible, onClose }) {
  const { userInfo, logout } = useAuth();
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

  // 抽屉动画效果
  React.useEffect(() => {
    if (visible) {
      // 打开抽屉：抽屉滑入 + 遮罩渐显
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 关闭抽屉：抽屉滑出 + 遮罩渐隐
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Android返回键支持
  React.useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          onClose();
          return true; // 阻止默认的返回行为（退出应用）
        }
      );

      return () => backHandler.remove();
    }
  }, [visible, onClose]);

  const handleNavigate = (path) => {
    onClose();
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => {
      logout();
    }, 300);
  };

  // 菜单项组件
  const MenuItem = ({ icon, label, onPress, badge, showChevron = true }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={22} color={COLORS.gray[700]} />
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {badge && (
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>{badge}</Text>
          </View>
        )}
        {showChevron && (
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        )}
      </View>
    </TouchableOpacity>
  );

  // 分组标题组件
  const SectionTitle = ({ title }) => (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
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
          {/* 顶部用户信息区 */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={() => handleNavigate('/profile/edit')}
                style={styles.avatarSection}
              >
                <Avatar
                  source={userInfo?.avatarUrl}
                  name={userInfo?.nickname || userInfo?.name}
                  size="lg"
                />
                <View style={styles.headerInfo}>
                  <Text style={styles.headerName}>
                    {userInfo?.nickname || userInfo?.name || '用户'}
                  </Text>
                  <Text style={styles.headerUsername}>
                    @{userInfo?.username || 'user'}
                  </Text>
                </View>
              </TouchableOpacity>
              
              {/* 账户图标（仅作为装饰） */}
              <View style={styles.accountButton}>
                <Ionicons 
                  name="person-circle-outline" 
                  size={28} 
                  color={COLORS.primary[600]} 
                />
              </View>
            </View>

            {/* 统计数据 */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>10</Text>
                <Text style={styles.statLabel}>规划</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>2</Text>
                <Text style={styles.statLabel}>未完成</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>已完成</Text>
              </View>
            </View>
          </View>

          {/* 可滚动的菜单区域 */}
          <ScrollView
            style={styles.menuScrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* 我的内容 */}
            <SectionTitle title="我的内容" />
            <MenuItem
              icon="person-outline"
              label="个人资料"
              onPress={() => handleNavigate('/profile/edit')}
            />
            <MenuItem
              icon="list-outline"
              label="我的规划"
              onPress={() => handleNavigate('/profile/my-plans')}
            />
            <MenuItem
              icon="pie-chart-outline"
              label="规划统计"
              onPress={() => handleNavigate('/planning/statistics')}
            />
            <MenuItem
              icon="heart-outline"
              label="我的收藏"
              onPress={() => handleNavigate('/profile/my-favorites')}
              badge={15}
            />
            <MenuItem
              icon="document-text-outline"
              label="我的帖子"
              onPress={() => handleNavigate('/profile/my-posts')}
            />
            {/* 快捷功能 */}
            <SectionTitle title="快捷功能" />
            <MenuItem
              icon="git-compare-outline"
              label="国家对比"
              onPress={() => handleNavigate('/country/compare')}
            />
            <MenuItem
              icon="calculator-outline"
              label="实用工具"
              onPress={() => handleNavigate('/tools')}
            />
            <MenuItem
              icon="download-outline"
              label="离线内容"
              onPress={() => handleNavigate('/offline')}
            />

            {/* 底部功能区 */}
            <View style={styles.divider} />
            <MenuItem
              icon="settings-outline"
              label="设置"
              onPress={() => handleNavigate('/profile/settings')}
            />
            <MenuItem
              icon="help-circle-outline"
              label="帮助与反馈"
              onPress={() => handleNavigate('/help')}
            />
            <MenuItem
              icon="moon-outline"
              label="深色模式"
              onPress={() => console.log('切换深色模式')}
              showChevron={false}
            />
            <View style={styles.bottomPlaceholder} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10, // 确保抽屉在遮罩层上方
  },
  
  // 顶部用户信息区
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  accountButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.gray[50],
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  headerUsername: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  // 菜单滚动区域
  menuScrollView: {
    flex: 1,
  },

  // 分组标题
  sectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitleText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // 菜单项
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 16,
    color: COLORS.gray[900],
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBadge: {
    backgroundColor: COLORS.primary[100],
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  menuBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary[600],
  },

  // 分割线
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginVertical: 8,
    marginHorizontal: 20,
  },

  // 底部占位
  bottomPlaceholder: {
    height: 40,
  },
});

