/**
 * 我的计划页面
 * 显示用户创建的所有留学规划
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Progress from 'react-native-progress';

import { COLORS } from '@/src/constants';

// 模拟数据
const MOCK_PLANS = [
  {
    id: '1',
    title: '美国研究生申请计划',
    targetCountry: '美国',
    targetDegree: '研究生',
    targetYear: '2025',
    progress: 65,
    status: 'in_progress',
    createdAt: '2024-01-15',
    updatedAt: '2024-10-20',
  },
  {
    id: '2',
    title: '英国本科留学计划',
    targetCountry: '英国',
    targetDegree: '本科',
    targetYear: '2026',
    progress: 30,
    status: 'in_progress',
    createdAt: '2024-03-10',
    updatedAt: '2024-09-15',
  },
  {
    id: '3',
    title: '加拿大移民计划',
    targetCountry: '加拿大',
    targetDegree: '其他',
    targetYear: '2025',
    progress: 100,
    status: 'completed',
    createdAt: '2023-06-20',
    updatedAt: '2024-08-01',
  },
];

export default function MyPlans() {
  const router = useRouter();
  const [plans, setPlans] = useState(MOCK_PLANS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'in_progress', 'completed'

  // 刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: 调用 API 刷新数据
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // 筛选计划
  const getFilteredPlans = () => {
    if (filter === 'all') return plans;
    return plans.filter((plan) => plan.status === filter);
  };

  // 获取状态文本
  const getStatusText = (status) => {
    const map = {
      in_progress: '进行中',
      completed: '已完成',
      archived: '已归档',
    };
    return map[status] || status;
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    const map = {
      in_progress: COLORS.primary[600],
      completed: COLORS.success[600],
      archived: COLORS.gray[500],
    };
    return map[status] || COLORS.gray[500];
  };

  // 渲染计划卡片
  const renderPlanCard = ({ item }) => (
    <TouchableOpacity
      style={styles.planCard}
      onPress={() => router.push(`/planning/${item.id}`)}
      activeOpacity={0.7}
    >
      {/* 顶部信息 */}
      <View style={styles.planHeader}>
        <Text style={styles.planTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(item.status)}15` },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      {/* 计划详情 */}
      <View style={styles.planDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={14} color={COLORS.gray[500]} />
          <Text style={styles.detailText}>{item.targetCountry}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="school-outline" size={14} color={COLORS.gray[500]} />
          <Text style={styles.detailText}>{item.targetDegree}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={14} color={COLORS.gray[500]} />
          <Text style={styles.detailText}>{item.targetYear}</Text>
        </View>
      </View>

      {/* 进度条 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>完成进度</Text>
          <Text style={styles.progressValue}>{item.progress}%</Text>
        </View>
        <Progress.Bar
          progress={item.progress / 100}
          width={null}
          height={6}
          color={getStatusColor(item.status)}
          unfilledColor={COLORS.gray[200]}
          borderWidth={0}
          borderRadius={3}
        />
      </View>

      {/* 底部时间 */}
      <Text style={styles.updateTime}>
        更新于 {new Date(item.updatedAt).toLocaleDateString('zh-CN')}
      </Text>
    </TouchableOpacity>
  );

  // 渲染筛选按钮
  const FilterButton = ({ value, label }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === value && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(value)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === value && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // 空状态
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={64} color={COLORS.gray[300]} />
      <Text style={styles.emptyText}>还没有创建留学规划</Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/planning/create')}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={20} color={COLORS.white} />
        <Text style={styles.createButtonText}>创建规划</Text>
      </TouchableOpacity>
    </View>
  );

  const filteredPlans = getFilteredPlans();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的计划</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/planning/create')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color={COLORS.primary[600]} />
        </TouchableOpacity>
      </View>

      {/* 筛选栏 */}
      <View style={styles.filterContainer}>
        <FilterButton value="all" label="全部" />
        <FilterButton value="in_progress" label="进行中" />
        <FilterButton value="completed" label="已完成" />
      </View>

      {/* 计划列表 */}
      <FlatList
        data={filteredPlans}
        renderItem={renderPlanCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary[600]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  addButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[100],
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary[500],
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[700],
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 16,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  planDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginLeft: 4,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    color: COLORS.gray[600],
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  updateTime: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.gray[500],
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary[600],
    borderRadius: 24,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 6,
  },
});

