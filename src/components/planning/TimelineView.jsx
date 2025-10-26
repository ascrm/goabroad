/**
 * 时间线视图组件
 * 甘特图风格展示进度
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants';

const TimelineView = ({ plans, onPlanPress }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // 生成月份选择器
  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月',
  ];

  // 获取类型配置
  const getTypeConfig = (type) => {
    const configs = {
      study: {
        icon: 'school',
        color: COLORS.primary[600],
        bgColor: COLORS.primary[50],
        label: '留学',
      },
      work: {
        icon: 'briefcase',
        color: COLORS.success[600],
        bgColor: COLORS.success[50],
        label: '工作',
      },
      immigration: {
        icon: 'airplane',
        color: COLORS.warning[600],
        bgColor: COLORS.warning[50],
        label: '移民',
      },
    };
    return configs[type] || configs.study;
  };

  // 计算任务在时间轴上的位置
  const calculateTaskPosition = (task, startDate, endDate) => {
    const taskStart = new Date(task.startDate || startDate);
    const taskEnd = new Date(task.endDate || task.deadline || endDate);
    const rangeStart = new Date(selectedYear, selectedMonth, 1);
    const rangeEnd = new Date(selectedYear, selectedMonth + 1, 0);

    // 计算天数
    const totalDays = (rangeEnd - rangeStart) / (1000 * 60 * 60 * 24);
    const taskStartDay = Math.max(0, (taskStart - rangeStart) / (1000 * 60 * 60 * 24));
    const taskEndDay = Math.min(totalDays, (taskEnd - rangeStart) / (1000 * 60 * 60 * 24));

    if (taskEndDay < 0 || taskStartDay > totalDays) {
      return null; // 任务不在当前月份
    }

    return {
      left: `${(taskStartDay / totalDays) * 100}%`,
      width: `${((taskEndDay - taskStartDay) / totalDays) * 100}%`,
    };
  };

  // 生成日期刻度
  const generateDateScale = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const scales = [];
    for (let i = 1; i <= daysInMonth; i += 5) {
      scales.push(i);
    }
    return scales;
  };

  const dateScales = generateDateScale();

  return (
    <View style={styles.container}>
      {/* 月份选择器 */}
      <View style={styles.monthSelector}>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={() => {
            if (selectedMonth === 0) {
              setSelectedMonth(11);
              setSelectedYear(selectedYear - 1);
            } else {
              setSelectedMonth(selectedMonth - 1);
            }
          }}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.gray[700]} />
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {selectedYear}年 {months[selectedMonth]}
        </Text>

        <TouchableOpacity
          style={styles.monthButton}
          onPress={() => {
            if (selectedMonth === 11) {
              setSelectedMonth(0);
              setSelectedYear(selectedYear + 1);
            } else {
              setSelectedMonth(selectedMonth + 1);
            }
          }}
        >
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray[700]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 日期刻度 */}
        <View style={styles.dateScaleContainer}>
          <View style={styles.planLabelSpace} />
          <View style={styles.dateScale}>
            {dateScales.map((day) => (
              <View
                key={day}
                style={[
                  styles.dateScaleItem,
                  { left: `${((day - 1) / new Date(selectedYear, selectedMonth + 1, 0).getDate()) * 100}%` },
                ]}
              >
                <Text style={styles.dateScaleText}>{day}</Text>
                <View style={styles.dateScaleLine} />
              </View>
            ))}
          </View>
        </View>

        {/* 规划时间线 */}
        {plans.map((plan) => {
          const typeConfig = getTypeConfig(plan.type);
          const planTasks = plan.tasks || [];

          return (
            <View key={plan.id} style={styles.planRow}>
              {/* 规划信息 */}
              <TouchableOpacity
                style={styles.planLabel}
                onPress={() => onPlanPress(plan.id)}
              >
                <View style={[styles.planIcon, { backgroundColor: typeConfig.bgColor }]}>
                  <Ionicons name={typeConfig.icon} size={20} color={typeConfig.color} />
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planName} numberOfLines={1}>
                    {plan.name}
                  </Text>
                  <View style={styles.planProgress}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${plan.progress}%`,
                            backgroundColor: typeConfig.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{plan.progress}%</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* 任务时间轴 */}
              <View style={styles.timeline}>
                {/* 今天标记线 */}
                {(() => {
                  const today = new Date();
                  if (
                    today.getMonth() === selectedMonth &&
                    today.getFullYear() === selectedYear
                  ) {
                    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
                    const todayPosition = (today.getDate() / daysInMonth) * 100;
                    return (
                      <View
                        style={[
                          styles.todayLine,
                          { left: `${todayPosition}%` },
                        ]}
                      >
                        <View style={styles.todayDot} />
                      </View>
                    );
                  }
                  return null;
                })()}

                {/* 任务条 */}
                {planTasks.map((task) => {
                  const position = calculateTaskPosition(
                    task,
                    plan.createdAt,
                    plan.targetDate
                  );
                  if (!position) return null;

                  return (
                    <View
                      key={task.id}
                      style={[
                        styles.taskBar,
                        {
                          left: position.left,
                          width: position.width,
                          backgroundColor: task.completed
                            ? COLORS.success[100]
                            : typeConfig.bgColor,
                          borderColor: task.completed
                            ? COLORS.success[600]
                            : typeConfig.color,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.taskBarText,
                          {
                            color: task.completed
                              ? COLORS.success[700]
                              : typeConfig.color,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {task.title}
                      </Text>
                      {task.completed && (
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color={COLORS.success[600]}
                        />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* 图例 */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>图例</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary[600] }]} />
              <Text style={styles.legendText}>留学</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.success[600] }]} />
              <Text style={styles.legendText}>工作</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.warning[600] }]} />
              <Text style={styles.legendText}>移民</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.todayLineLegend} />
              <Text style={styles.legendText}>今天</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPlaceholder} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  monthButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  scrollView: {
    flex: 1,
  },
  dateScaleContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: COLORS.gray[50],
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  planLabelSpace: {
    width: 140,
  },
  dateScale: {
    flex: 1,
    height: 40,
    position: 'relative',
  },
  dateScaleItem: {
    position: 'absolute',
    alignItems: 'center',
  },
  dateScaleText: {
    fontSize: 11,
    color: COLORS.gray[600],
    fontWeight: '500',
    marginBottom: 4,
  },
  dateScaleLine: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.gray[300],
  },
  planRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  planLabel: {
    width: 140,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    gap: 8,
  },
  planIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  planProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.gray[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  timeline: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: 8,
    minHeight: 50,
    justifyContent: 'center',
  },
  todayLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.error[400],
    zIndex: 10,
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error[600],
    position: 'absolute',
    top: -3,
    left: -3,
  },
  taskBar: {
    position: 'absolute',
    height: 32,
    borderRadius: 6,
    borderWidth: 2,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 4,
  },
  taskBarText: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  legend: {
    padding: 16,
    backgroundColor: COLORS.gray[50],
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  todayLineLegend: {
    width: 12,
    height: 2,
    backgroundColor: COLORS.error[400],
  },
  legendText: {
    fontSize: 12,
    color: COLORS.gray[700],
  },
  bottomPlaceholder: {
    height: 20,
  },
});

export default TimelineView;

