/**
 * 材料详情弹窗
 * 显示材料的详细要求、格式说明、注意事项等
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '@/src/constants';

// 材料详细信息（模拟数据）
const MATERIAL_DETAILS = {
  default: {
    requirements: [
      '请确保材料真实有效',
      '所有材料需提供中英文版本',
      '扫描件需清晰可读',
    ],
    format: '支持 PDF、JPG、PNG 格式，单个文件不超过10MB',
    examples: [],
    notes: [
      '提交前请仔细核对信息',
      '如有疑问请咨询相关机构',
    ],
  },
  m1: { // 护照
    requirements: [
      '护照有效期需超过6个月',
      '信息页需清晰完整',
      '如有旧护照，建议一并扫描',
    ],
    format: 'PDF或高清照片，文件大小不超过10MB',
    examples: [
      '包含照片页',
      '包含签字页',
      '所有签证记录页（如有）',
    ],
    notes: [
      '请确保照片清晰，四角完整',
      '避免反光和阴影',
      '如护照即将过期，建议先更新',
    ],
  },
  m3: { // DS-160
    requirements: [
      '完整填写所有必填项',
      '上传符合规格的照片',
      '仔细核对个人信息',
    ],
    format: 'PDF格式的确认页',
    examples: [
      '包含条形码的确认页',
      '包含AA开头的申请号',
    ],
    notes: [
      '填写时请如实回答所有问题',
      '保存确认号以便后续使用',
      '建议打印两份备用',
    ],
  },
};

export default function MaterialDetail({ visible, material, onClose }) {
  if (!material) return null;

  const details = MATERIAL_DETAILS[material.id] || MATERIAL_DETAILS.default;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 头部 */}
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Ionicons name="information-circle" size={24} color={COLORS.primary[600]} />
              <Text style={styles.title}>{material.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.gray[600]} />
            </TouchableOpacity>
          </View>

          {/* 内容 */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* 材料描述 */}
            {material.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📋 材料说明</Text>
                <Text style={styles.descriptionText}>{material.description}</Text>
              </View>
            )}

            {/* 详细要求 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✅ 详细要求</Text>
              {details.requirements.map((req, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.listText}>{req}</Text>
                </View>
              ))}
            </View>

            {/* 格式要求 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📄 格式要求</Text>
              <Text style={styles.normalText}>{details.format}</Text>
            </View>

            {/* 示例说明 */}
            {details.examples.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📸 示例说明</Text>
                {details.examples.map((example, index) => (
                  <View key={index} style={styles.listItem}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success[600]} />
                    <Text style={[styles.listText, { marginLeft: 8 }]}>{example}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 注意事项 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚠️ 注意事项</Text>
              {details.notes.map((note, index) => (
                <View key={index} style={styles.noteItem}>
                  <Ionicons name="alert-circle-outline" size={16} color={COLORS.warning[600]} />
                  <Text style={[styles.listText, { marginLeft: 8 }]}>{note}</Text>
                </View>
              ))}
            </View>

            {/* 底部留白 */}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* 底部按钮 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onClose}
            >
              <Text style={styles.primaryButtonText}>知道了</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: COLORS.gray[700],
    lineHeight: 22,
  },
  normalText: {
    fontSize: 14,
    color: COLORS.gray[600],
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary[600],
    marginTop: 7,
    marginRight: 10,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray[700],
    lineHeight: 20,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    backgroundColor: COLORS.warning[50],
    padding: 12,
    borderRadius: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  primaryButton: {
    backgroundColor: COLORS.primary[600],
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
});

