/**
 * 材料清单视图
 * 展示申请所需的所有材料，支持分类、筛选、上传
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Progress from 'react-native-progress';

import { COLORS } from '@/src/constants';

import MaterialItem from './MaterialItem';

// 模拟材料数据
const MOCK_MATERIALS = {
  required: [
    {
      id: 'm1',
      name: '护照',
      description: '有效期需>6个月',
      status: 'completed',
      uploadedFile: 'passport.pdf',
      uploadDate: '2024-10-15',
      dueDate: '2025-03-01',
    },
    {
      id: 'm2',
      name: 'I-20表格',
      description: '学校发放的录取文件',
      status: 'completed',
      uploadedFile: 'i20.pdf',
      uploadDate: '2024-10-18',
      dueDate: '2025-03-01',
    },
    {
      id: 'm3',
      name: 'DS-160确认页',
      description: '签证申请表确认页',
      status: 'pending',
      dueDate: '2025-03-01',
      hasReminder: true,
      reminderDate: '2025-02-22',
    },
    {
      id: 'm4',
      name: 'SEVIS费用收据',
      description: 'I-901 SEVIS费用支付证明',
      status: 'overdue',
      dueDate: '2024-10-20',
    },
    {
      id: 'm5',
      name: '签证照片',
      description: '51x51mm白底彩照',
      status: 'in_progress',
      dueDate: '2025-02-28',
    },
    {
      id: 'm6',
      name: '签证申请费收据',
      description: '支付签证申请费后的收据',
      status: 'pending',
      dueDate: '2025-03-01',
    },
    {
      id: 'm7',
      name: '财力证明',
      description: '银行存款证明',
      status: 'pending',
      dueDate: '2025-02-28',
    },
    {
      id: 'm8',
      name: '在读证明/毕业证',
      description: '中英文对照版本',
      status: 'pending',
      dueDate: '2025-02-28',
    },
  ],
  supporting: [
    {
      id: 'm9',
      name: '父母在职证明',
      description: '中英文对照',
      status: 'completed',
      uploadedFile: 'parent_employment.pdf',
      uploadDate: '2024-10-16',
    },
    {
      id: 'm10',
      name: '成绩单',
      description: '中英文成绩单及认证',
      status: 'completed',
      uploadedFile: 'transcript.pdf',
      uploadDate: '2024-10-17',
    },
    {
      id: 'm11',
      name: '托福/雅思成绩',
      description: '官方成绩单',
      status: 'completed',
      uploadedFile: 'toefl_score.pdf',
      uploadDate: '2024-10-10',
    },
    {
      id: 'm12',
      name: '获奖证书',
      description: '各类竞赛、奖学金证书',
      status: 'pending',
    },
    {
      id: 'm13',
      name: '研究计划',
      description: '研究生申请需要',
      status: 'pending',
    },
    {
      id: 'm14',
      name: '导师推荐信',
      description: '2-3封推荐信',
      status: 'pending',
    },
  ],
  optional: [
    {
      id: 'm15',
      name: '作品集',
      description: '艺术类专业需要',
      status: 'pending',
    },
    {
      id: 'm16',
      name: '实习证明',
      description: '相关实习经历证明',
      status: 'pending',
    },
    {
      id: 'm17',
      name: '论文发表证明',
      description: '学术论文发表记录',
      status: 'pending',
    },
  ],
};

export default function MaterialsView({ planId }) {
  const [expandedCategories, setExpandedCategories] = useState({
    required: true,
    supporting: true,
    optional: false,
  });

  // 计算统计数据
  const calculateStats = (materials) => {
    const completed = materials.filter((m) => m.status === 'completed').length;
    const total = materials.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const requiredStats = calculateStats(MOCK_MATERIALS.required);
  const supportingStats = calculateStats(MOCK_MATERIALS.supporting);
  const optionalStats = calculateStats(MOCK_MATERIALS.optional);

  const totalCompleted = requiredStats.completed + supportingStats.completed + optionalStats.completed;
  const totalMaterials = requiredStats.total + supportingStats.total + optionalStats.total;
  const totalProgress = totalMaterials > 0 ? (totalCompleted / totalMaterials) * 100 : 0;

  // 切换分类展开/收起
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // 导出清单
  const handleExport = () => {
    console.log('导出材料清单');
    // TODO: 实现导出PDF功能
  };

  // 分享清单
  const handleShare = () => {
    console.log('分享材料清单');
    // TODO: 实现分享功能
  };

  // 打印清单
  const handlePrint = () => {
    console.log('打印材料清单');
    // TODO: 实现打印功能
  };

  // 渲染分类头部
  const renderCategoryHeader = (title, stats, category, icon, color) => {
    const isExpanded = expandedCategories[category];

    return (
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => toggleCategory(category)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryHeaderLeft}>
          <Ionicons name={icon} size={20} color={color} />
          <Text style={styles.categoryTitle}>{title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {stats.completed}/{stats.total}
            </Text>
          </View>
        </View>

        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={COLORS.gray[400]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部统计 */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>整体进度</Text>
        
        <Progress.Bar
          progress={totalProgress / 100}
          width={null}
          height={8}
          color={COLORS.primary[600]}
          unfilledColor={COLORS.gray[200]}
          borderWidth={0}
          borderRadius={4}
          style={styles.progressBar}
        />

        <Text style={styles.statsText}>
          已准备 {totalCompleted}/{totalMaterials} 份材料
          {' '}
          ({Math.round(totalProgress)}%)
        </Text>
      </View>

      {/* 材料列表 */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 必需材料 */}
        <View style={styles.categorySection}>
          {renderCategoryHeader(
            '必需材料',
            requiredStats,
            'required',
            'star',
            COLORS.error[600]
          )}
          
          {expandedCategories.required && (
            <View style={styles.materialsContainer}>
              {MOCK_MATERIALS.required.map((material) => (
                <MaterialItem key={material.id} material={material} />
              ))}
            </View>
          )}
        </View>

        {/* 支持性材料 */}
        <View style={styles.categorySection}>
          {renderCategoryHeader(
            '支持性材料',
            supportingStats,
            'supporting',
            'document-text',
            COLORS.primary[600]
          )}
          
          {expandedCategories.supporting && (
            <View style={styles.materialsContainer}>
              {MOCK_MATERIALS.supporting.map((material) => (
                <MaterialItem key={material.id} material={material} />
              ))}
            </View>
          )}
        </View>

        {/* 可选材料 */}
        <View style={styles.categorySection}>
          {renderCategoryHeader(
            '可选材料',
            optionalStats,
            'optional',
            'add-circle-outline',
            COLORS.gray[500]
          )}
          
          {expandedCategories.optional && (
            <View style={styles.materialsContainer}>
              {MOCK_MATERIALS.optional.map((material) => (
                <MaterialItem key={material.id} material={material} />
              ))}
            </View>
          )}
        </View>

        {/* 底部留白 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} onPress={handleExport}>
          <Ionicons name="download-outline" size={20} color={COLORS.primary[600]} />
          <Text style={styles.bottomButtonText}>导出清单</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.bottomButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={COLORS.primary[600]} />
          <Text style={styles.bottomButtonText}>分享</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.bottomButton} onPress={handlePrint}>
          <Ionicons name="print-outline" size={20} color={COLORS.primary[600]} />
          <Text style={styles.bottomButtonText}>打印</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  statsContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  progressBar: {
    marginBottom: 12,
  },
  statsText: {
    fontSize: 14,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    marginTop: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.gray[200],
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginLeft: 8,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary[50],
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary[700],
  },
  materialsContainer: {
    backgroundColor: COLORS.white,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  bottomButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  bottomButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[600],
    marginLeft: 6,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.gray[200],
    marginVertical: 4,
  },
});

