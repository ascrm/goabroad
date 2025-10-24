/**
 * 分区选择器组件
 * 用于选择帖子的发布分区
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '@/src/constants';

// 分区数据
const CATEGORIES = [
  {
    id: 'country',
    name: '按国家',
    icon: 'flag-outline',
    children: [
      '美国',
      '英国',
      '加拿大',
      '澳大利亚',
      '新西兰',
      '德国',
      '法国',
      '日本',
      '韩国',
      '新加坡',
      '中国香港',
      '其他国家',
    ],
  },
  {
    id: 'stage',
    name: '按阶段',
    icon: 'stats-chart-outline',
    children: [
      '准备阶段',
      '语言考试',
      '申请中',
      '等offer',
      '拿到offer',
      '签证办理',
      '行前准备',
      '已出国',
    ],
  },
  {
    id: 'type',
    name: '按类型',
    icon: 'grid-outline',
    children: [
      '留学经验',
      '工作经验',
      '移民经验',
      '生活分享',
      '学习方法',
      '求职技巧',
      '院校选择',
      '专业选择',
      '租房攻略',
      '签证经验',
    ],
  },
  {
    id: 'topic',
    name: '按话题',
    icon: 'chatbubbles-outline',
    children: [
      '本科申请',
      '硕士申请',
      '博士申请',
      '语言学校',
      '文书写作',
      '推荐信',
      '面试经验',
      '奖学金',
      '实习经验',
      '校园生活',
      '打工度假',
      '归国发展',
    ],
  },
];

export default function CategoryPicker({ visible, selectedCategory, onSelect, onClose }) {
  const [searchText, setSearchText] = useState('');
  const [activeGroup, setActiveGroup] = useState('country');

  // 筛选分区
  const getFilteredCategories = () => {
    const group = CATEGORIES.find((g) => g.id === activeGroup);
    if (!group) return [];

    if (!searchText.trim()) {
      return group.children;
    }

    return group.children.filter((cat) =>
      cat.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filteredCategories = getFilteredCategories();

  // 选择分区
  const handleSelect = (category) => {
    onSelect(category);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 头部 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={COLORS.gray[700]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>选择分区</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* 搜索框 */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.gray[400]}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索分区..."
            placeholderTextColor={COLORS.gray[400]}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={styles.searchClear}
            >
              <Ionicons name="close-circle" size={18} color={COLORS.gray[400]} />
            </TouchableOpacity>
          )}
        </View>

        {/* 分组 Tab */}
        <View style={styles.groupTabs}>
          {CATEGORIES.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={[
                styles.groupTab,
                activeGroup === group.id && styles.groupTabActive,
              ]}
              onPress={() => {
                setActiveGroup(group.id);
                setSearchText('');
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={group.icon}
                size={18}
                color={
                  activeGroup === group.id ? COLORS.primary[600] : COLORS.gray[600]
                }
              />
              <Text
                style={[
                  styles.groupTabText,
                  activeGroup === group.id && styles.groupTabTextActive,
                ]}
              >
                {group.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 分区列表 */}
        <FlatList
          data={filteredCategories}
          keyExtractor={(item, index) => `${activeGroup}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => handleSelect(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryText}>{item}</Text>
              {selectedCategory === item && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary[600]} />
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={COLORS.gray[300]} />
              <Text style={styles.emptyText}>未找到相关分区</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: COLORS.gray[100],
    borderRadius: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.gray[900],
  },
  searchClear: {
    padding: 4,
  },
  groupTabs: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  groupTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: COLORS.gray[50],
  },
  groupTabActive: {
    backgroundColor: COLORS.primary[50],
  },
  groupTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray[600],
    marginLeft: 4,
  },
  groupTabTextActive: {
    color: COLORS.primary[600],
  },
  listContent: {
    paddingVertical: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  categoryText: {
    fontSize: 16,
    color: COLORS.gray[900],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.gray[500],
    marginTop: 12,
  },
});

