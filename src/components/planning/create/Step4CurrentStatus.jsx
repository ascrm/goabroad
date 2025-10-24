/**
 * 步骤4：填写当前状态
 * 根据选择的目标类型显示不同的表单
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '@/src/constants';

// 学历选项
const EDUCATION_LEVELS = [
  { label: '请选择当前学历', value: '' },
  { label: '初中在读', value: 'junior_high' },
  { label: '初中毕业', value: 'junior_high_grad' },
  { label: '高中在读', value: 'high_school' },
  { label: '高中毕业', value: 'high_school_grad' },
  { label: '本科在读', value: 'bachelor' },
  { label: '本科毕业', value: 'bachelor_grad' },
  { label: '硕士在读', value: 'master' },
  { label: '硕士毕业', value: 'master_grad' },
  { label: '博士在读', value: 'phd' },
  { label: '博士毕业', value: 'phd_grad' },
];

// 语言成绩状态
const LANGUAGE_STATUS = [
  { id: 'not_taken', label: '还没考', emoji: '📝' },
  { id: 'preparing', label: '正在备考', emoji: '📖' },
  { id: 'has_score', label: '已有成绩', emoji: '✅' },
];

export default function Step4CurrentStatus({ data, onNext, onBack }) {
  const goalType = data?.goalType || 'study';
  
  // 表单数据
  const [formData, setFormData] = useState(data?.currentStatus || {
    education: '',
    major: '',
    gpa: '',
    languageStatus: '',
    languageType: 'toefl', // toefl or ielts
    languageScore: '',
    hasAgent: '',
    workYears: '', // 工作相关
    industry: '',  // 工作相关
  });

  // 表单验证错误
  const [errors, setErrors] = useState({});
  
  // 学历选择器显示状态
  const [showEducationPicker, setShowEducationPicker] = useState(false);

  // 更新表单字段
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    
    if (goalType === 'study') {
      if (!formData.education) {
        newErrors.education = '请选择当前学历';
      }
      if (!formData.major || formData.major.trim() === '') {
        newErrors.major = '请输入专业';
      }
    }

    if (goalType === 'work') {
      if (!formData.workYears || formData.workYears.trim() === '') {
        newErrors.workYears = '请输入工作年限';
      }
      if (!formData.industry || formData.industry.trim() === '') {
        newErrors.industry = '请输入所在行业';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 下一步
  const handleNext = () => {
    if (!validateForm()) {
      return;
    }
    onNext({ currentStatus: formData });
  };

  // 获取学历标签
  const getEducationLabel = (value) => {
    const level = EDUCATION_LEVELS.find(l => l.value === value);
    return level ? level.label : '请选择当前学历';
  };

  // 渲染留学表单
  const renderStudyForm = () => (
    <>
      {/* 当前学历 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          当前学历 <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity
          style={[styles.selectButton, errors.education && styles.inputError]}
          onPress={() => setShowEducationPicker(true)}
        >
          <Text style={[styles.selectButtonText, !formData.education && styles.placeholderText]}>
            {getEducationLabel(formData.education)}
          </Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>
        {errors.education && <Text style={styles.errorText}>{errors.education}</Text>}
      </View>

      {/* 专业 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          专业 <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.major && styles.inputError]}
          placeholder="例如：计算机科学、商务管理..."
          value={formData.major}
          onChangeText={(value) => updateField('major', value)}
          placeholderTextColor={COLORS.gray[400]}
        />
        {errors.major && <Text style={styles.errorText}>{errors.major}</Text>}
      </View>

      {/* GPA / 成绩 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>GPA / 平均成绩</Text>
        <TextInput
          style={styles.input}
          placeholder="例如：3.5 / 85 分"
          value={formData.gpa}
          onChangeText={(value) => updateField('gpa', value)}
          placeholderTextColor={COLORS.gray[400]}
          keyboardType="numeric"
        />
        <Text style={styles.hint}>可选填，帮助我们提供更精准的建议</Text>
      </View>

      {/* 语言成绩状态 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>语言成绩状态</Text>
        <View style={styles.radioGroup}>
          {LANGUAGE_STATUS.map((status) => (
            <TouchableOpacity
              key={status.id}
              style={[
                styles.radioOption,
                formData.languageStatus === status.id && styles.radioOptionSelected,
              ]}
              onPress={() => updateField('languageStatus', status.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.radioEmoji}>{status.emoji}</Text>
              <Text
                style={[
                  styles.radioLabel,
                  formData.languageStatus === status.id && styles.radioLabelSelected,
                ]}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 已有成绩展开输入 */}
      {formData.languageStatus === 'has_score' && (
        <View style={styles.expandedContainer}>
          {/* 选择语言类型 */}
          <View style={styles.languageTypeContainer}>
            <TouchableOpacity
              style={[
                styles.languageTypeButton,
                formData.languageType === 'toefl' && styles.languageTypeButtonSelected,
              ]}
              onPress={() => updateField('languageType', 'toefl')}
            >
              <Text
                style={[
                  styles.languageTypeText,
                  formData.languageType === 'toefl' && styles.languageTypeTextSelected,
                ]}
              >
                托福 (TOEFL)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageTypeButton,
                formData.languageType === 'ielts' && styles.languageTypeButtonSelected,
              ]}
              onPress={() => updateField('languageType', 'ielts')}
            >
              <Text
                style={[
                  styles.languageTypeText,
                  formData.languageType === 'ielts' && styles.languageTypeTextSelected,
                ]}
              >
                雅思 (IELTS)
              </Text>
            </TouchableOpacity>
          </View>

          {/* 成绩输入 */}
          <TextInput
            style={styles.input}
            placeholder={
              formData.languageType === 'toefl'
                ? '托福总分（例如：100）'
                : '雅思总分（例如：7.0）'
            }
            value={formData.languageScore}
            onChangeText={(value) => updateField('languageScore', value)}
            placeholderTextColor={COLORS.gray[400]}
            keyboardType="numeric"
          />
        </View>
      )}

      {/* 是否有中介 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>是否已有留学中介？</Text>
        <View style={styles.booleanGroup}>
          <TouchableOpacity
            style={[
              styles.booleanOption,
              formData.hasAgent === 'yes' && styles.booleanOptionSelected,
            ]}
            onPress={() => updateField('hasAgent', 'yes')}
          >
            <Text
              style={[
                styles.booleanText,
                formData.hasAgent === 'yes' && styles.booleanTextSelected,
              ]}
            >
              是
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.booleanOption,
              formData.hasAgent === 'no' && styles.booleanOptionSelected,
            ]}
            onPress={() => updateField('hasAgent', 'no')}
          >
            <Text
              style={[
                styles.booleanText,
                formData.hasAgent === 'no' && styles.booleanTextSelected,
              ]}
            >
              否
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  // 渲染工作表单
  const renderWorkForm = () => (
    <>
      {/* 工作年限 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          工作年限 <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.workYears && styles.inputError]}
          placeholder="例如：3 年"
          value={formData.workYears}
          onChangeText={(value) => updateField('workYears', value)}
          placeholderTextColor={COLORS.gray[400]}
          keyboardType="numeric"
        />
        {errors.workYears && <Text style={styles.errorText}>{errors.workYears}</Text>}
      </View>

      {/* 所在行业 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          所在行业 <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.industry && styles.inputError]}
          placeholder="例如：互联网、金融、制造业..."
          value={formData.industry}
          onChangeText={(value) => updateField('industry', value)}
          placeholderTextColor={COLORS.gray[400]}
        />
        {errors.industry && <Text style={styles.errorText}>{errors.industry}</Text>}
      </View>

      {/* 专业技能 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>专业技能</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="简要描述你的专业技能和工作经验..."
          value={formData.skills}
          onChangeText={(value) => updateField('skills', value)}
          placeholderTextColor={COLORS.gray[400]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </>
  );

  // 渲染移民表单
  const renderImmigrationForm = () => (
    <>
      {/* 当前学历 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>当前学历</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowEducationPicker(true)}
        >
          <Text style={[styles.selectButtonText, !formData.education && styles.placeholderText]}>
            {getEducationLabel(formData.education)}
          </Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>
      </View>

      {/* 工作经验 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>工作经验</Text>
        <TextInput
          style={styles.input}
          placeholder="例如：5 年软件开发经验"
          value={formData.workExperience}
          onChangeText={(value) => updateField('workExperience', value)}
          placeholderTextColor={COLORS.gray[400]}
        />
      </View>

      {/* 资产情况 */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>资产情况（可选）</Text>
        <TextInput
          style={styles.input}
          placeholder="例如：存款、房产等"
          value={formData.assets}
          onChangeText={(value) => updateField('assets', value)}
          placeholderTextColor={COLORS.gray[400]}
        />
        <Text style={styles.hint}>信息仅用于规划参考，不会公开</Text>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {/* 顶部操作栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        
        <Text style={styles.stepText}>步骤 4/5</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 标题 */}
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>📝</Text>
          <Text style={styles.title}>填写你的当前状态</Text>
          <Text style={styles.subtitle}>帮助我们生成个性化规划</Text>
        </View>

        {/* 根据目标类型渲染不同表单 */}
        <View style={styles.formContainer}>
          {goalType === 'study' && renderStudyForm()}
          {goalType === 'work' && renderWorkForm()}
          {goalType === 'immigration' && renderImmigrationForm()}
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.backFooterButton}
          onPress={onBack}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.gray[600]} />
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>下一步</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 学历选择器 Modal */}
      <Modal
        visible={showEducationPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEducationPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>选择学历</Text>
              <TouchableOpacity onPress={() => setShowEducationPicker(false)}>
                <Ionicons name="close" size={24} color={COLORS.gray[900]} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalList}>
              {EDUCATION_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.modalItem,
                    formData.education === level.value && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    updateField('education', level.value);
                    setShowEducationPicker(false);
                  }}
                  disabled={!level.value}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      !level.value && styles.modalItemTextDisabled,
                      formData.education === level.value && styles.modalItemTextSelected,
                    ]}
                  >
                    {level.label}
                  </Text>
                  {formData.education === level.value && (
                    <Ionicons name="checkmark" size={24} color={COLORS.primary[600]} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[600],
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[600],
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  required: {
    color: COLORS.error[500],
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    fontSize: 16,
    color: COLORS.gray[900],
  },
  inputError: {
    borderColor: COLORS.error[500],
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  selectButtonText: {
    fontSize: 16,
    color: COLORS.gray[900],
  },
  placeholderText: {
    color: COLORS.gray[400],
  },
  hint: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginTop: 6,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.error[500],
    marginTop: 6,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radioOptionSelected: {
    backgroundColor: `${COLORS.primary[600]}08`,
    borderColor: COLORS.primary[600],
  },
  radioEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  radioLabelSelected: {
    color: COLORS.primary[600],
  },
  expandedContainer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
  },
  languageTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  languageTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
  },
  languageTypeButtonSelected: {
    backgroundColor: COLORS.primary[600],
    borderColor: COLORS.primary[600],
  },
  languageTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  languageTypeTextSelected: {
    color: '#FFFFFF',
  },
  booleanGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  booleanOption: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  booleanOptionSelected: {
    backgroundColor: `${COLORS.primary[600]}08`,
    borderColor: COLORS.primary[600],
  },
  booleanText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  booleanTextSelected: {
    color: COLORS.primary[600],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    backgroundColor: '#FFFFFF',
  },
  backFooterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[600],
    marginLeft: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[600],
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  modalItemSelected: {
    backgroundColor: `${COLORS.primary[600]}08`,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.gray[900],
  },
  modalItemTextDisabled: {
    color: COLORS.gray[400],
  },
  modalItemTextSelected: {
    color: COLORS.primary[600],
    fontWeight: '600',
  },
});

