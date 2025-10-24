/**
 * 规划创建流程主页面
 * 5步引导创建留学/工作/移民规划
 */

import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import StepIndicator from 'react-native-step-indicator';

// 导入步骤组件
import Step1SelectCountry from '@/src/components/planning/create/Step1SelectCountry';
import Step2SelectGoal from '@/src/components/planning/create/Step2SelectGoal';
import Step3SelectDetail from '@/src/components/planning/create/Step3SelectDetail';
import Step4CurrentStatus from '@/src/components/planning/create/Step4CurrentStatus';
import Step5TargetTime from '@/src/components/planning/create/Step5TargetTime';

const TOTAL_STEPS = 5;

export default function PlanningCreate() {
  // 当前步骤 (0-4)
  const [currentStep, setCurrentStep] = useState(0);
  
  // 保存各步骤的数据
  const [formData, setFormData] = useState({
    country: null,       // 步骤1: 选择的国家
    goalType: null,      // 步骤2: 目标类型 (study/work/immigration)
    detailType: null,    // 步骤3: 细分类型
    currentStatus: null, // 步骤4: 当前状态
    targetTime: null,    // 步骤5: 目标时间
  });

  // 更新某一步的数据
  const updateStepData = (step, data) => {
    setFormData(prev => ({
      ...prev,
      ...data,
    }));
  };

  // 下一步
  const handleNext = (stepData) => {
    updateStepData(currentStep, stepData);
    
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // 上一步
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      // 第一步时返回上一页
      router.back();
    }
  };

  // 取消创建
  const handleCancel = () => {
    router.back();
  };

  // 渲染当前步骤的组件
  const renderStep = () => {
    const commonProps = {
      data: formData,
      onNext: handleNext,
      onBack: handleBack,
      onCancel: handleCancel,
    };

    switch (currentStep) {
      case 0:
        return <Step1SelectCountry {...commonProps} />;
      case 1:
        return <Step2SelectGoal {...commonProps} />;
      case 2:
        return <Step3SelectDetail {...commonProps} />;
      case 3:
        return <Step4CurrentStatus {...commonProps} />;
      case 4:
        return <Step5TargetTime {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 步骤指示器 */}
      <View style={styles.indicatorContainer}>
        <StepIndicator
          customStyles={indicatorStyles}
          currentPosition={currentStep}
          stepCount={TOTAL_STEPS}
          labels={['国家', '目标', '细分', '状态', '时间']}
        />
      </View>

      {/* 步骤内容 */}
      <View style={styles.content}>
        {renderStep()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  indicatorContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  content: {
    flex: 1,
  },
});

// 步骤指示器样式
const indicatorStyles = {
  stepIndicatorSize: 32,
  currentStepIndicatorSize: 38,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#2563EB',
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: '#2563EB',
  stepStrokeUnFinishedColor: '#D1D5DB',
  separatorFinishedColor: '#2563EB',
  separatorUnFinishedColor: '#D1D5DB',
  stepIndicatorFinishedColor: '#2563EB',
  stepIndicatorUnFinishedColor: '#FFFFFF',
  stepIndicatorCurrentColor: '#FFFFFF',
  stepIndicatorLabelFontSize: 14,
  currentStepIndicatorLabelFontSize: 14,
  stepIndicatorLabelCurrentColor: '#2563EB',
  stepIndicatorLabelFinishedColor: '#FFFFFF',
  stepIndicatorLabelUnFinishedColor: '#9CA3AF',
  labelColor: '#6B7280',
  labelSize: 12,
  currentStepLabelColor: '#2563EB',
  labelAlign: 'flex-start',
  labelFontFamily: 'System',
};

