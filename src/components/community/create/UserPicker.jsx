/**
 * 用户选择器组件（Modal形式）
 * 用于@提及用户
 * 基于 create.jsx 中的 UserPickerModal 实现
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { COLORS } from '@/src/constants';

// Mock 用户数据（实际应该从 API 获取）
const MOCK_USERS = [
  { id: 1, username: 'user1', nickname: '张同学', avatar: null },
  { id: 2, username: 'user2', nickname: '李同学', avatar: null },
  { id: 3, username: 'user3', nickname: '王同学', avatar: null },
  { id: 4, username: 'user4', nickname: '刘同学', avatar: null },
  { id: 5, username: 'user5', nickname: '陈同学', avatar: null },
];

export default function UserPicker({ 
  visible = false, 
  onClose = () => {}, 
  onSelectUser = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mockUsers] = useState(MOCK_USERS);

  // 过滤用户
  const filteredUsers = mockUsers.filter(user =>
    user.nickname.includes(searchQuery) || user.username.includes(searchQuery)
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.userPickerSheet} onStartShouldSetResponder={() => true}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>@提及用户</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={24} color={COLORS.gray[700]} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.gray[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="搜索用户昵称或用户名"
              placeholderTextColor={COLORS.gray[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView style={styles.userList}>
            {filteredUsers.map(user => (
              <TouchableOpacity
                key={user.id}
                style={styles.userItem}
                onPress={() => onSelectUser(user)}
              >
                <View style={styles.userAvatar}>
                  <Ionicons name="person-circle" size={40} color={COLORS.gray[400]} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.nickname}</Text>
                  <Text style={styles.userHandle}>@{user.username}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {filteredUsers.length === 0 && (
              <Text style={styles.emptyText}>未找到用户</Text>
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  userPickerSheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    maxHeight: '70%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 15,
    color: COLORS.gray[900],
  },
  userList: {
    maxHeight: 300,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[900],
  },
  userHandle: {
    fontSize: 13,
    color: COLORS.gray[500],
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.gray[500],
    paddingVertical: 40,
  },
});

