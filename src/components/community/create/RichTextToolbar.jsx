/**
 * 富文本工具栏组件
 * 提供格式化按钮：标题、加粗、斜体、引用、列表等
 */

import { COLORS } from '@/src/constants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RichTextToolbar({ 
  editorRef,
}) {
  // 工具栏配置
  const tools = [
    // 第一行：标题和基本格式
    [
      { icon: 'text', label: 'H1', onPress: () => editorRef.current?.setHeading(1) },
      { icon: 'text', label: 'H2', onPress: () => editorRef.current?.setHeading(2) },
      { icon: 'text-outline', label: 'H3', onPress: () => editorRef.current?.setHeading(3) },
      { icon: 'create', label: '加粗', onPress: () => editorRef.current?.setBold() },
      { icon: 'code-slash', label: '斜体', onPress: () => editorRef.current?.setItalic() },
      { icon: 'remove-outline', label: '删除线', onPress: () => editorRef.current?.setStrikeThrough() },
    ],
    // 第二行：列表和其他格式
    [
      { icon: 'chatbox', label: '引用', onPress: () => editorRef.current?.setBlockquote() },
      { icon: 'list', label: '无序列表', onPress: () => editorRef.current?.insertBulletsList() },
      { icon: 'list-outline', label: '有序列表', onPress: () => editorRef.current?.insertOrderedList() },
      { icon: 'remove', label: '分割线', onPress: () => editorRef.current?.insertHorizontalRule() },
      { icon: 'code', label: '代码', onPress: () => editorRef.current?.insertCode() },
      { icon: 'arrow-undo', label: '撤销', onPress: () => editorRef.current?.undo() },
    ],
  ];

  return (
    <View style={styles.container}>
      {/* 工具按钮区域 - 两行布局 */}
      <View style={styles.toolsContainer}>
        {tools.map((row, rowIndex) => (
          <ScrollView
            key={rowIndex}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolRow}
          >
            {row.map((tool, index) => (
              <TouchableOpacity
                key={index}
                style={styles.toolButton}
                onPress={tool.onPress}
              >
                <View style={styles.toolIconContainer}>
                  <Ionicons name={tool.icon} size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.toolLabel}>{tool.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
  },
  toolsContainer: {
    gap: 8,
  },
  toolRow: {
    paddingHorizontal: 12,
    gap: 8,
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  toolIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  toolLabel: {
    fontSize: 11,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
});

