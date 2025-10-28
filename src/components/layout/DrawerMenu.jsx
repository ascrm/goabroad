/**
 * 侧边抽屉菜单组件
 * 从左侧弹出的抽屉，包含用户信息和各种功能入口
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
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
import { useAppDispatch, useUserInfo } from '@/src/store/hooks';
import { logoutUser } from '@/src/store/slices/authSlice';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8; // 抽屉宽度为屏幕的80%

export default function DrawerMenu({ visible, onClose }) {
  const userInfo = useUserInfo(); // 使用统一的 userInfo hook（优先使用 profile.userInfo）
  const dispatch = useAppDispatch();
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

  // 底部账户抽屉状态
  const [showAccountSheet, setShowAccountSheet] = React.useState(false);
  const sheetSlideAnim = React.useRef(new Animated.Value(300)).current;
  const sheetBackdropOpacity = React.useRef(new Animated.Value(0)).current;

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

  // 底部抽屉动画效果
  React.useEffect(() => {
    if (showAccountSheet) {
      // 打开底部抽屉
      Animated.parallel([
        Animated.spring(sheetSlideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(sheetBackdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 关闭底部抽屉
      Animated.parallel([
        Animated.timing(sheetSlideAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(sheetBackdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showAccountSheet]);

  // Android返回键支持
  React.useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          // 如果底部抽屉打开，先关闭底部抽屉
          if (showAccountSheet) {
            setShowAccountSheet(false);
            return true;
          }
          // 否则关闭侧边抽屉
          onClose();
          return true; // 阻止默认的返回行为（退出应用）
        }
      );

      return () => backHandler.remove();
    }
  }, [visible, showAccountSheet, onClose]);

  const handleNavigate = (path) => {
    onClose();
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  const handleLogout = () => {
    // 关闭底部抽屉
    setShowAccountSheet(false);
    
    // 显示确认对话框
    setTimeout(() => {
      Alert.alert(
        '确认退出',
        '您确定要退出登录吗？',
        [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '退出',
            style: 'destructive',
            onPress: async () => {
              try {
                // 调用 Redux action 退出登录
                await dispatch(logoutUser()).unwrap();
                
                // 退出登录成功后，关闭侧边抽屉
                onClose();
                
                // 延迟导航到登录页面
                setTimeout(() => {
                  router.replace('/(auth)/login');
                }, 300);
              } catch (error) {
                console.error('退出登录失败:', error);
                // 即使失败也关闭抽屉并跳转
                onClose();
                setTimeout(() => {
                  router.replace('/(auth)/login');
                }, 300);
              }
            },
          },
        ]
      );
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
              
              {/* 账户切换按钮 */}
              <TouchableOpacity 
                style={styles.accountButton}
                onPress={() => setShowAccountSheet(true)}
                accessibilityLabel="切换账号"
              >
                <Ionicons 
                  name="person-circle-outline" 
                  size={28} 
                  color={COLORS.primary[600]} 
                />
              </TouchableOpacity>
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

        {/* 底部账户切换抽屉 */}
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
                      handleNavigate('/auth/login');
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
  sheetHandle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  sheetHandleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray[300],
    borderRadius: 2,
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
    textAlign: 'center',
  },
  sheetContent: {
    paddingVertical: 8,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sheetOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sheetOptionContent: {
    flex: 1,
  },
  sheetOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  sheetOptionDescription: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  sheetDivider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginLeft: 84, // 对齐图标右侧
  },
});

