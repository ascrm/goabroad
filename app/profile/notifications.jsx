/**
 * 通知设置页面
 * 管理各类通知的开关
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { COLORS } from '@/src/constants';
import {
    selectNotificationSettings,
    updateNotifications,
} from '@/src/store/slices/profileSlice';

export default function NotificationSettings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotificationSettings);

  // 处理通知开关切换
  const handleToggle = (key, value) => {
    dispatch(updateNotifications({ [key]: value }));
  };

  // 通知设置项配置
  const notificationItems = [
    {
      id: 'pushEnabled',
      icon: 'notifications',
      title: '推送通知',
      description: '接收应用推送通知',
      value: notifications.pushEnabled,
      iconColor: COLORS.primary[600],
      iconBg: COLORS.primary[50],
    },
    {
      id: 'systemNotifications',
      icon: 'megaphone',
      title: '系统通知',
      description: '系统公告、维护通知等',
      value: notifications.systemNotifications,
      iconColor: COLORS.info[600],
      iconBg: COLORS.info[50],
      disabled: !notifications.pushEnabled,
    },
    {
      id: 'interactionNotifications',
      icon: 'heart',
      title: '互动通知',
      description: '点赞、评论、关注等',
      value: notifications.interactionNotifications,
      iconColor: COLORS.error[600],
      iconBg: COLORS.error[50],
      disabled: !notifications.pushEnabled,
    },
    {
      id: 'planReminders',
      icon: 'time',
      title: '规划提醒',
      description: '留学规划进度提醒',
      value: notifications.planReminders,
      iconColor: COLORS.warning[600],
      iconBg: COLORS.warning[50],
      disabled: !notifications.pushEnabled,
    },
    {
      id: 'communityUpdates',
      icon: 'people',
      title: '社区动态',
      description: '关注用户的新动态',
      value: notifications.communityUpdates,
      iconColor: COLORS.success[600],
      iconBg: COLORS.success[50],
      disabled: !notifications.pushEnabled,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>通知设置</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 提示信息 */}
        <View style={styles.tipContainer}>
          <Ionicons name="information-circle" size={20} color={COLORS.info[600]} />
          <Text style={styles.tipText}>
            关闭推送通知后，所有通知类型都将被禁用
          </Text>
        </View>

        {/* 通知设置列表 */}
        <View style={styles.listContainer}>
          {notificationItems.map((item, index) => (
            <View key={item.id}>
              <View
                style={[
                  styles.listItem,
                  item.disabled && styles.listItemDisabled,
                ]}
              >
                <View style={styles.listItemLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: item.iconBg },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={item.disabled ? COLORS.gray[400] : item.iconColor}
                    />
                  </View>
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.itemTitle,
                        item.disabled && styles.itemTitleDisabled,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.itemDescription,
                        item.disabled && styles.itemDescriptionDisabled,
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={(value) => handleToggle(item.id, value)}
                  disabled={item.disabled}
                  trackColor={{
                    false: COLORS.gray[300],
                    true: COLORS.primary[400],
                  }}
                  thumbColor={
                    item.value ? COLORS.primary[600] : COLORS.gray[100]
                  }
                />
              </View>
              {index < notificationItems.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

        {/* 说明文字 */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>关于通知</Text>
          <Text style={styles.noteText}>
            • 推送通知需要授予应用通知权限
          </Text>
          <Text style={styles.noteText}>
            • 部分系统通知无法关闭，以确保重要信息不被错过
          </Text>
          <Text style={styles.noteText}>
            • 免打扰模式下，通知将被静默推送
          </Text>
        </View>

        {/* 底部间距 */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info[50],
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.info[700],
    marginLeft: 8,
    lineHeight: 18,
  },
  listContainer: {
    backgroundColor: COLORS.white,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  listItemDisabled: {
    opacity: 0.5,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  itemTitleDisabled: {
    color: COLORS.gray[500],
  },
  itemDescription: {
    fontSize: 13,
    color: COLORS.gray[600],
    lineHeight: 18,
  },
  itemDescriptionDisabled: {
    color: COLORS.gray[400],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[100],
    marginLeft: 68,
  },
  noteContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  noteText: {
    fontSize: 13,
    color: COLORS.gray[600],
    lineHeight: 20,
    marginBottom: 6,
  },
});

