/**
 * 消息页面
 * 显示系统通知、互动消息、私信等
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Avatar, EmptyState } from '@/src/components/ui';
import { COLORS } from '@/src/constants';

// 消息类型标签页
const MESSAGE_TABS = [
  { id: 'all', label: '全部' },
  { id: 'interaction', label: '互动' },
  { id: 'system', label: '系统' },
  { id: 'private', label: '私信' },
];

// 模拟消息数据
const MOCK_MESSAGES = [
  {
    id: '1',
    type: 'interaction',
    user: {
      id: 'u1',
      name: '张小明',
      avatarUrl: null,
    },
    content: '赞了你的帖子《美国F1签证面签经验分享》',
    time: '2分钟前',
    isRead: false,
    actionType: 'like',
  },
  {
    id: '2',
    type: 'interaction',
    user: {
      id: 'u2',
      name: 'Sarah Wang',
      avatarUrl: null,
    },
    content: '评论了你的帖子：这个材料清单太有用了，感谢分享！',
    time: '15分钟前',
    isRead: false,
    actionType: 'comment',
  },
  {
    id: '3',
    type: 'system',
    content: '你的留学规划"美国硕士申请"还有3个待办事项未完成',
    time: '1小时前',
    isRead: true,
    actionType: 'reminder',
  },
  {
    id: '4',
    type: 'private',
    user: {
      id: 'u3',
      name: 'Lisa Chen',
      avatarUrl: null,
    },
    content: '你好，请问关于工作签证的问题可以咨询你吗？',
    time: '3小时前',
    isRead: true,
    actionType: 'message',
  },
  {
    id: '5',
    type: 'system',
    content: '系统维护通知：今晚22:00-23:00进行系统升级',
    time: '昨天',
    isRead: true,
    actionType: 'announcement',
  },
];

export default function MessagesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  // 刷新消息列表
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // 根据标签过滤消息
  const filteredMessages = React.useMemo(() => {
    if (activeTab === 'all') {
      return messages;
    }
    return messages.filter((msg) => msg.type === activeTab);
  }, [activeTab, messages]);

  // 标记消息为已读
  const markAsRead = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  // 处理消息点击
  const handleMessagePress = (message) => {
    markAsRead(message.id);
    
    // 根据消息类型跳转到不同页面
    switch (message.actionType) {
      case 'like':
      case 'comment':
        // 跳转到帖子详情
        console.log('跳转到帖子详情');
        // router.push(`/community/post/${message.postId}`);
        break;
      case 'message':
        // 跳转到私信聊天
        console.log('跳转到私信聊天');
        // router.push(`/messages/chat/${message.user.id}`);
        break;
      case 'reminder':
        // 跳转到规划
        console.log('跳转到规划');
        // router.push('/profile/my-plans');
        break;
      case 'announcement':
        // 显示公告详情
        console.log('显示公告详情');
        break;
      default:
        break;
    }
  };

  // 渲染消息项
  const renderMessageItem = ({ item }) => {
    const getIcon = () => {
      switch (item.actionType) {
        case 'like':
          return { name: 'heart', color: COLORS.error[500] };
        case 'comment':
          return { name: 'chatbubble', color: COLORS.primary[600] };
        case 'message':
          return { name: 'mail', color: COLORS.primary[600] };
        case 'reminder':
          return { name: 'notifications', color: COLORS.warning[500] };
        case 'announcement':
          return { name: 'megaphone', color: COLORS.success[500] };
        default:
          return { name: 'information-circle', color: COLORS.gray[500] };
      }
    };

    const icon = getIcon();

    return (
      <TouchableOpacity
        style={[styles.messageItem, !item.isRead && styles.messageItemUnread]}
        onPress={() => handleMessagePress(item)}
        activeOpacity={0.7}
      >
        {/* 左侧头像或图标 */}
        <View style={styles.messageLeft}>
          {item.user ? (
            <View style={styles.avatarContainer}>
              <Avatar
                source={item.user.avatarUrl}
                name={item.user.name}
                size="md"
              />
              <View style={[styles.actionBadge, { backgroundColor: icon.color }]}>
                <Ionicons name={icon.name} size={12} color={COLORS.white} />
              </View>
            </View>
          ) : (
            <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
              <Ionicons name={icon.name} size={24} color={icon.color} />
            </View>
          )}
        </View>

        {/* 中间内容 */}
        <View style={styles.messageContent}>
          {item.user && (
            <Text style={styles.userName}>{item.user.name}</Text>
          )}
          <Text
            style={[styles.messageText, !item.user && styles.messageTextBold]}
            numberOfLines={2}
          >
            {item.content}
          </Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>

        {/* 右侧未读标识 */}
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab 切换 */}
      <View style={styles.tabBar}>
        {MESSAGE_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* 消息列表 */}
      <FlatList
        data={filteredMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary[600]]}
            tintColor={COLORS.primary[600]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="暂无消息"
            description="你还没有收到任何消息"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
  // Tab栏样式
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    // 激活状态
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[500],
  },
  tabTextActive: {
    color: COLORS.primary[600],
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: COLORS.primary[600],
    borderRadius: 1,
  },

  // 列表样式
  listContent: {
    flexGrow: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  messageItemUnread: {
    backgroundColor: COLORS.primary[50],
  },

  // 左侧头像/图标
  messageLeft: {
    marginRight: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  actionBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 中间内容
  messageContent: {
    flex: 1,
    marginRight: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.gray[700],
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTextBold: {
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.gray[400],
  },

  // 未读标识
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[600],
  },
});

