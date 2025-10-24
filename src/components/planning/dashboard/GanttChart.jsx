/**
 * 甘特图组件
 * 使用 Victory Native 展示时间线甘特图
 */

import { Ionicons } from '@expo/vector-icons';
import { format, parse } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/src/constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_PADDING = 20;
const LABEL_WIDTH = 100;
const CHART_WIDTH = SCREEN_WIDTH - CHART_PADDING * 2 - LABEL_WIDTH;
const MONTH_WIDTH = 60; // 每个月的宽度

export default function GanttChart({ stages }) {
  const scrollViewRef = useRef(null);
  const [selectedStage, setSelectedStage] = useState(null);

  // 解析日期字符串
  const parseDate = (dateStr) => {
    try {
      return parse(dateStr, 'yyyy-MM', new Date());
    } catch (error) {
      return new Date();
    }
  };

  // 获取所有日期范围
  const getDateRange = () => {
    if (!stages || stages.length === 0) return { start: new Date(), end: new Date(), months: [] };

    const dates = stages.flatMap((stage) => [
      parseDate(stage.startDate),
      parseDate(stage.endDate),
    ]);

    const start = new Date(Math.min(...dates));
    const end = new Date(Math.max(...dates));

    // 生成月份列表
    const months = [];
    const current = new Date(start);
    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return { start, end, months };
  };

  const { start, end, months } = getDateRange();

  // 计算阶段在图表中的位置和宽度
  const calculateStagePosition = (stage) => {
    const stageStart = parseDate(stage.startDate);
    const stageEnd = parseDate(stage.endDate);

    // 计算距离起始月份的月数
    const startMonths =
      (stageStart.getFullYear() - start.getFullYear()) * 12 +
      (stageStart.getMonth() - start.getMonth());
    const duration =
      (stageEnd.getFullYear() - stageStart.getFullYear()) * 12 +
      (stageEnd.getMonth() - stageStart.getMonth()) + 1;

    return {
      left: startMonths * MONTH_WIDTH,
      width: duration * MONTH_WIDTH - 4, // 减去间隙
    };
  };

  // 获取当前月份的位置
  const getCurrentMonthPosition = () => {
    const now = new Date();
    const monthsFromStart =
      (now.getFullYear() - start.getFullYear()) * 12 +
      (now.getMonth() - start.getMonth());
    return monthsFromStart * MONTH_WIDTH;
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return COLORS.success[600];
      case 'in_progress':
        return COLORS.primary[600];
      case 'overdue':
        return COLORS.error[600];
      default:
        return COLORS.gray[300];
    }
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={20} color={COLORS.gray[900]} />
        <Text style={styles.title}>时间规划甘特图</Text>
      </View>

      {/* 月份标题 */}
      <View style={styles.chartContainer}>
        <View style={styles.labelColumn}>
          <Text style={styles.labelHeader}>阶段</Text>
        </View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.monthsScrollView}
        >
          <View style={styles.monthsContainer}>
            {months.map((month, index) => (
              <View key={index} style={styles.monthCell}>
                <Text style={styles.monthText}>
                  {format(month, 'yyyy', { locale: zhCN })}
                </Text>
                <Text style={styles.monthText}>
                  {format(month, 'MM月', { locale: zhCN })}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 阶段和条形图 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.stagesContainer}
      >
        <View style={styles.stagesWrapper}>
          {stages && stages.map((stage, index) => {
            const position = calculateStagePosition(stage);
            const isSelected = selectedStage === stage.id;

            return (
              <View key={stage.id} style={styles.stageRow}>
                {/* 阶段名称 */}
                <View style={[styles.labelColumn, styles.stageLabel]}>
                  <Text style={styles.stageLabelText} numberOfLines={2}>
                    {stage.title}
                  </Text>
                </View>

                {/* 时间线区域 */}
                <View style={styles.timelineArea}>
                  {/* 背景网格线 */}
                  {months.map((_, monthIndex) => (
                    <View
                      key={monthIndex}
                      style={[
                        styles.gridLine,
                        { left: monthIndex * MONTH_WIDTH },
                      ]}
                    />
                  ))}

                  {/* 阶段条 */}
                  <TouchableOpacity
                    style={[
                      styles.stageBar,
                      {
                        left: position.left,
                        width: position.width,
                        backgroundColor: getStatusColor(stage.status),
                      },
                      isSelected && styles.stageBarSelected,
                    ]}
                    onPress={() => setSelectedStage(isSelected ? null : stage.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.stageBarText} numberOfLines={1}>
                      {stage.progress}%
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {/* 当前月份标记线 */}
          <View
            style={[
              styles.currentMonthLine,
              { left: LABEL_WIDTH + getCurrentMonthPosition() },
            ]}
          >
            <View style={styles.currentMonthMarker} />
          </View>
        </View>
      </ScrollView>

      {/* 图例 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.success[600] }]} />
          <Text style={styles.legendText}>已完成</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary[600] }]} />
          <Text style={styles.legendText}>进行中</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.gray[300] }]} />
          <Text style={styles.legendText}>未开始</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.error[600] }]} />
          <Text style={styles.legendText}>逾期</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginLeft: 8,
  },
  chartContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  labelColumn: {
    width: LABEL_WIDTH,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  labelHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gray[700],
  },
  monthsScrollView: {
    flex: 1,
  },
  monthsContainer: {
    flexDirection: 'row',
  },
  monthCell: {
    width: MONTH_WIDTH,
    paddingVertical: 8,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.gray[100],
  },
  monthText: {
    fontSize: 11,
    color: COLORS.gray[600],
    fontWeight: '600',
  },
  stagesContainer: {
    maxHeight: 400,
  },
  stagesWrapper: {
    position: 'relative',
  },
  stageRow: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  stageLabel: {
    backgroundColor: COLORS.gray[50],
    borderRightWidth: 1,
    borderRightColor: COLORS.gray[200],
  },
  stageLabelText: {
    fontSize: 12,
    color: COLORS.gray[800],
    fontWeight: '500',
  },
  timelineArea: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: MONTH_WIDTH,
    borderRightWidth: 1,
    borderRightColor: COLORS.gray[100],
  },
  stageBar: {
    position: 'absolute',
    top: 15,
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  stageBarSelected: {
    borderWidth: 2,
    borderColor: COLORS.gray[900],
  },
  stageBarText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
  },
  currentMonthLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.error[600],
    zIndex: 10,
  },
  currentMonthMarker: {
    position: 'absolute',
    top: 0,
    left: -4,
    width: 10,
    height: 10,
    backgroundColor: COLORS.error[600],
    borderRadius: 5,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
});

