/**
 * 规划生成中页面
 * 显示生成进度和动画
 */

import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/src/constants';

// 生成步骤
const GENERATION_STEPS = [
  { id: 1, label: '分析目标时间', duration: 1000 },
  { id: 2, label: '匹配申请流程', duration: 1500 },
  { id: 3, label: '生成时间线', duration: 2000 },
  { id: 4, label: '准备材料清单', duration: 1500 },
];

export default function GeneratingScreen() {
  const params = useLocalSearchParams();
  const planningData = params.data ? JSON.parse(params.data) : null;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [progress] = useState(new Animated.Value(0));
  const [estimatedTime, setEstimatedTime] = useState(6);

  useEffect(() => {
    // 模拟生成过程
    let stepIndex = 0;
    let totalTime = 0;

    const runSteps = () => {
      if (stepIndex < GENERATION_STEPS.length) {
        setCurrentStep(stepIndex);
        
        const step = GENERATION_STEPS[stepIndex];
        totalTime += step.duration;
        
        // 更新进度条
        Animated.timing(progress, {
          toValue: ((stepIndex + 1) / GENERATION_STEPS.length) * 100,
          duration: step.duration,
          useNativeDriver: false,
        }).start();

        // 更新预计剩余时间
        const remaining = GENERATION_STEPS.slice(stepIndex + 1).reduce((sum, s) => sum + s.duration, 0);
        setEstimatedTime(Math.ceil(remaining / 1000));

        setTimeout(() => {
          stepIndex++;
          runSteps();
        }, step.duration);
      } else {
        // 生成完成，跳转到成功页面
        setTimeout(() => {
          router.replace({
            pathname: '/planning/success',
            params: { data: params.data },
          });
        }, 500);
      }
    };

    runSteps();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* 顶部动画 */}
        <View style={styles.animationContainer}>
          <View style={styles.rocketContainer}>
            <Text style={styles.rocketEmoji}>🚀</Text>
          </View>
          <Text style={styles.title}>正在生成你的专属规划...</Text>
        </View>

        {/* 进度条 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((currentStep + 1) / GENERATION_STEPS.length * 100)}%
          </Text>
        </View>

        {/* 生成步骤列表 */}
        <View style={styles.stepsContainer}>
          {GENERATION_STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepIconContainer}>
                  {isCompleted && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success[500]} />
                  )}
                  {isCurrent && (
                    <View style={styles.loadingIcon}>
                      <Ionicons name="play-circle" size={24} color={COLORS.primary[600]} />
                    </View>
                  )}
                  {isPending && (
                    <View style={styles.pendingIcon}>
                      <Ionicons name="ellipse-outline" size={24} color={COLORS.gray[300]} />
                    </View>
                  )}
                </View>
                
                <Text
                  style={[
                    styles.stepLabel,
                    isCompleted && styles.stepLabelCompleted,
                    isCurrent && styles.stepLabelCurrent,
                    isPending && styles.stepLabelPending,
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* 预计剩余时间 */}
        {estimatedTime > 0 && (
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color={COLORS.gray[500]} />
            <Text style={styles.timeText}>
              预计还需 {estimatedTime} 秒...
            </Text>
          </View>
        )}

        {/* 提示信息 */}
        <View style={styles.tipContainer}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary[600]} />
          <Text style={styles.tipText}>
            我们正在根据你的信息生成个性化规划方案
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  rocketContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  rocketEmoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gray[900],
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray[100],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary[600],
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[600],
    textAlign: 'right',
  },
  stepsContainer: {
    marginBottom: 32,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIconContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 16,
  },
  loadingIcon: {
    // 可以添加动画效果
  },
  pendingIcon: {
    // 待完成状态
  },
  stepLabel: {
    flex: 1,
    fontSize: 16,
  },
  stepLabelCompleted: {
    color: COLORS.gray[600],
    textDecorationLine: 'line-through',
  },
  stepLabelCurrent: {
    color: COLORS.primary[600],
    fontWeight: '600',
  },
  stepLabelPending: {
    color: COLORS.gray[400],
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.gray[600],
    marginLeft: 6,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: `${COLORS.primary[600]}08`,
    borderRadius: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray[700],
    marginLeft: 12,
    lineHeight: 20,
  },
});

