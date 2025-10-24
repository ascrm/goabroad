/**
 * 材料项组件
 * 展示单个材料的详细信息和操作
 */

import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { COLORS } from '@/src/constants';

import FileUploader from './FileUploader';
import MaterialDetail from './MaterialDetail';
import ReminderSetter from './ReminderSetter';

export default function MaterialItem({ material }) {
  const [expanded, setExpanded] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  // 获取状态图标和颜色
  const getStatusInfo = () => {
    switch (material.status) {
      case 'completed':
        return {
          icon: 'checkmark-circle',
          color: COLORS.success[600],
          text: '已完成',
        };
      case 'in_progress':
        return {
          icon: 'time',
          color: COLORS.primary[600],
          text: '进行中',
        };
      case 'overdue':
        return {
          icon: 'alert-circle',
          color: COLORS.error[600],
          text: '逾期',
        };
      default:
        return {
          icon: 'ellipse-outline',
          color: COLORS.gray[400],
          text: '未开始',
        };
    }
  };

  const statusInfo = getStatusInfo();

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd', { locale: zhCN });
    } catch (error) {
      return dateString;
    }
  };

  // 切换完成状态
  const toggleComplete = () => {
    console.log('切换完成状态:', material.id);
    // TODO: 调用 Redux action 更新状态
  };

  // 查看详情
  const viewDetail = () => {
    setShowDetail(true);
  };

  // 上传文件
  const uploadFile = () => {
    setShowUploader(true);
  };

  // 设置提醒
  const setReminder = () => {
    setShowReminder(true);
  };

  return (
    <>
      <View style={styles.container}>
        {/* 主要内容 */}
        <TouchableOpacity
          style={styles.mainContent}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          {/* 左侧：状态图标 */}
          <TouchableOpacity onPress={toggleComplete} style={styles.statusIcon}>
            <Ionicons
              name={statusInfo.icon}
              size={24}
              color={statusInfo.color}
            />
          </TouchableOpacity>

          {/* 中间：材料信息 */}
          <View style={styles.infoContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.materialName}>{material.name}</Text>
              {material.status === 'overdue' && (
                <View style={styles.overdueBadge}>
                  <Ionicons name="warning" size={12} color={COLORS.white} />
                  <Text style={styles.overdueBadgeText}>逾期</Text>
                </View>
              )}
            </View>

            <Text style={styles.description} numberOfLines={expanded ? undefined : 1}>
              {material.description}
            </Text>

            {/* 已上传文件信息 */}
            {material.uploadedFile && (
              <View style={styles.uploadInfo}>
                <Ionicons name="document" size={14} color={COLORS.primary[600]} />
                <Text style={styles.uploadInfoText}>
                  已上传：{material.uploadedFile}
                </Text>
              </View>
            )}

            {material.uploadDate && (
              <Text style={styles.uploadDate}>
                上传于：{formatDate(material.uploadDate)}
              </Text>
            )}

            {/* 提醒信息 */}
            {material.hasReminder && material.reminderDate && (
              <View style={styles.reminderInfo}>
                <Ionicons name="notifications" size={14} color={COLORS.warning[600]} />
                <Text style={styles.reminderInfoText}>
                  提醒：{formatDate(material.reminderDate)}
                </Text>
              </View>
            )}

            {/* 截止日期 */}
            {material.dueDate && material.status !== 'completed' && (
              <View style={styles.dueDateRow}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={material.status === 'overdue' ? COLORS.error[600] : COLORS.gray[500]}
                />
                <Text
                  style={[
                    styles.dueDate,
                    material.status === 'overdue' && styles.dueDateOverdue,
                  ]}
                >
                  {material.status === 'overdue' ? '逾期：' : '截止：'}
                  {formatDate(material.dueDate)}
                </Text>
              </View>
            )}
          </View>

          {/* 右侧：展开图标 */}
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={COLORS.gray[400]}
          />
        </TouchableOpacity>

        {/* 展开的操作按钮 */}
        {expanded && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={viewDetail}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.primary[600]} />
              <Text style={styles.actionButtonText}>查看要求</Text>
            </TouchableOpacity>

            {material.status !== 'completed' && (
              <>
                <TouchableOpacity style={styles.actionButton} onPress={uploadFile}>
                  <Ionicons name="cloud-upload-outline" size={18} color={COLORS.primary[600]} />
                  <Text style={styles.actionButtonText}>上传文件</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={setReminder}>
                  <Ionicons name="notifications-outline" size={18} color={COLORS.primary[600]} />
                  <Text style={styles.actionButtonText}>设置提醒</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>

      {/* Modal组件 */}
      <MaterialDetail
        visible={showDetail}
        material={material}
        onClose={() => setShowDetail(false)}
      />

      <FileUploader
        visible={showUploader}
        material={material}
        onClose={() => setShowUploader(false)}
      />

      <ReminderSetter
        visible={showReminder}
        material={material}
        onClose={() => setShowReminder(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  statusIcon: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  materialName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  overdueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error[600],
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  overdueBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 3,
  },
  description: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginBottom: 6,
  },
  uploadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  uploadInfoText: {
    fontSize: 13,
    color: COLORS.primary[700],
    marginLeft: 6,
    fontWeight: '500',
  },
  uploadDate: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  reminderInfoText: {
    fontSize: 13,
    color: COLORS.warning[700],
    marginLeft: 6,
    fontWeight: '500',
  },
  dueDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  dueDate: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginLeft: 4,
  },
  dueDateOverdue: {
    color: COLORS.error[600],
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 14,
    paddingLeft: 56, // 对齐左侧内容
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionButtonText: {
    fontSize: 13,
    color: COLORS.primary[600],
    marginLeft: 4,
    fontWeight: '500',
  },
});

