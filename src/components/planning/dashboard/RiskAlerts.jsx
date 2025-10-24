/**
 * 风险提示组件
 * 展示逾期任务和即将到期的任务
 */

import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/src/constants';

export default function RiskAlerts({ risks }) {
  if (!risks || risks.length === 0) return null;

  // 格式化日期
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MM月dd日', { locale: zhCN });
    } catch (error) {
      return dateString;
    }
  };

  // 获取风险类型信息
  const getRiskTypeInfo = (type) => {
    switch (type) {
      case 'overdue':
        return {
          icon: 'alert-circle',
          color: COLORS.error[600],
          bgColor: COLORS.error[50],
          borderColor: COLORS.error[200],
        };
      case 'urgent':
        return {
          icon: 'time',
          color: COLORS.warning[600],
          bgColor: COLORS.warning[50],
          borderColor: COLORS.warning[200],
        };
      default:
        return {
          icon: 'information-circle',
          color: COLORS.primary[600],
          bgColor: COLORS.primary[50],
          borderColor: COLORS.primary[200],
        };
    }
  };

  // 处理风险点击
  const handleRiskPress = (risk) => {
    console.log('处理风险:', risk);
    // TODO: 跳转到相应的任务或材料
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.header}>
        <Ionicons name="warning-outline" size={20} color={COLORS.error[600]} />
        <Text style={styles.title}>风险提示</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{risks.length}</Text>
        </View>
      </View>

      {/* 风险列表 */}
      <View style={styles.risksList}>
        {risks.map((risk) => {
          const typeInfo = getRiskTypeInfo(risk.type);

          return (
            <TouchableOpacity
              key={risk.id}
              style={[
                styles.riskItem,
                {
                  backgroundColor: typeInfo.bgColor,
                  borderColor: typeInfo.borderColor,
                },
              ]}
              onPress={() => handleRiskPress(risk)}
              activeOpacity={0.7}
            >
              <View style={styles.riskIconContainer}>
                <Ionicons
                  name={typeInfo.icon}
                  size={24}
                  color={typeInfo.color}
                />
              </View>

              <View style={styles.riskContent}>
                <Text style={styles.riskTitle}>{risk.title}</Text>
                <Text style={styles.riskDescription}>{risk.description}</Text>
                <View style={styles.riskMeta}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={COLORS.gray[600]}
                  />
                  <Text style={styles.riskDate}>
                    截止：{formatDate(risk.dueDate)}
                  </Text>
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.gray[400]}
              />
            </TouchableOpacity>
          );
        })}
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
    flex: 1,
  },
  badge: {
    backgroundColor: COLORS.error[600],
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  risksList: {
    padding: 16,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  riskIconContainer: {
    marginRight: 12,
  },
  riskContent: {
    flex: 1,
  },
  riskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  riskDescription: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginBottom: 6,
  },
  riskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskDate: {
    fontSize: 12,
    color: COLORS.gray[600],
    marginLeft: 4,
  },
});

