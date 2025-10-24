/**
 * 国家详情页
 * 展示国家的详细信息，包括概览、留学、工作、移民、生活等Tab
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ImmigrationTab from '@/src/components/country/detail/ImmigrationTab';
import LifeTab from '@/src/components/country/detail/LifeTab';
import OverviewTab from '@/src/components/country/detail/OverviewTab';
import StudyTab from '@/src/components/country/detail/StudyTab';
import WorkTab from '@/src/components/country/detail/WorkTab';
import { COLORS } from '@/src/constants';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 280;
const TAB_BAR_HEIGHT = 50;

export default function CountryDetailPage() {
  const router = useRouter();
  const { code } = useLocalSearchParams();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  // 模拟数据 - 实际应该从API获取
  const countryData = {
    US: {
      code: 'US',
      flag: '🇺🇸',
      name: '美国',
      englishName: 'United States of America',
      bannerImage: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74',
      description: '教育资源丰富，世界顶尖名校云集',
    },
    GB: {
      code: 'GB',
      flag: '🇬🇧',
      name: '英国',
      englishName: 'United Kingdom',
      bannerImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
      description: '学制短，名校多，教育质量高',
    },
    CA: {
      code: 'CA',
      flag: '🇨🇦',
      name: '加拿大',
      englishName: 'Canada',
      bannerImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce',
      description: '移民友好，教育质量高，生活舒适',
    },
  };

  const country = countryData[code] || countryData.US;

  // Tab配置
  const tabs = [
    { key: 'overview', label: '概览' },
    { key: 'study', label: '留学' },
    { key: 'work', label: '工作' },
    { key: 'immigration', label: '移民' },
    { key: 'life', label: '生活' },
  ];

  // 头部动画
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100, HEADER_HEIGHT],
    outputRange: [1, 0.8, 0],
    extrapolate: 'clamp',
  });

  // Tab栏固定效果
  const tabBarTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - TAB_BAR_HEIGHT],
    outputRange: [0, -(HEADER_HEIGHT - TAB_BAR_HEIGHT)],
    extrapolate: 'clamp',
  });

  // 处理收藏
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log('收藏/取消收藏:', country.name);
  };

  // 处理创建规划
  const handleCreatePlan = () => {
    console.log('创建规划:', country.name);
    // TODO: 导航到规划创建页面
    // router.push(`/planning/create?country=${code}`);
  };

  // 渲染Tab内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab country={country} />;
      case 'study':
        return <StudyTab country={country} />;
      case 'work':
        return <WorkTab country={country} />;
      case 'immigration':
        return <ImmigrationTab country={country} />;
      case 'life':
        return <LifeTab country={country} />;
      default:
        return <OverviewTab country={country} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* 滚动内容 */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 占位符，给头部留空间 */}
        <View style={{ height: HEADER_HEIGHT + TAB_BAR_HEIGHT }} />

        {/* Tab 内容 */}
        <View style={styles.tabContent}>{renderTabContent()}</View>

        {/* 底部留白，给按钮留空间 */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* 固定的头部Banner */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          },
        ]}
      >
        {/* 背景渐变（模拟图片背景） */}
        <LinearGradient
          colors={['#4C6EF5', '#7C3AED', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerGradient}
        >
          {/* 遮罩层 */}
          <View style={styles.bannerOverlay} />

          {/* 国家信息 */}
          <View style={styles.bannerContent}>
            <Text style={styles.bannerFlag}>{country.flag}</Text>
            <Text style={styles.bannerName}>{country.name}</Text>
            <Text style={styles.bannerEnglishName}>{country.englishName}</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* 固定的Tab栏 */}
      <Animated.View
        style={[
          styles.tabBar,
          {
            transform: [{ translateY: tabBarTranslateY }],
            top: HEADER_HEIGHT,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* 顶部导航栏 */}
      <SafeAreaView edges={['top']} style={styles.navbar}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleFavorite}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? COLORS.error[500] : '#FFFFFF'}
          />
        </TouchableOpacity>
      </SafeAreaView>

      {/* 底部固定按钮 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.planButton} onPress={handleCreatePlan}>
          <Ionicons name="rocket" size={20} color="#FFFFFF" />
          <Text style={styles.planButtonText}>开始规划</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.default,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1,
  },
  bannerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  bannerContent: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  bannerFlag: {
    fontSize: 64,
    marginBottom: 8,
  },
  bannerName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bannerEnglishName: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    backgroundColor: COLORS.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    zIndex: 2,
  },
  tabBarContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    height: TAB_BAR_HEIGHT,
  },
  tabItem: {
    paddingHorizontal: 16,
    height: TAB_BAR_HEIGHT,
    justifyContent: 'center',
    position: 'relative',
  },
  tabItemActive: {
    // 激活状态
  },
  tabText: {
    fontSize: 15,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary[600],
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: COLORS.primary[600],
    borderRadius: 1.5,
  },
  tabContent: {
    backgroundColor: COLORS.background.default,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 3,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: COLORS.background.paper,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary[600],
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: COLORS.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

