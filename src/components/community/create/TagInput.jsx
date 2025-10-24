/**
 * 标签输入组件
 * 用于添加和管理帖子标签
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { COLORS } from '@/src/constants';

// 热门标签推荐
const HOT_TAGS = [
  '留学申请',
  '签证',
  '语言考试',
  '选校',
  '文书',
  '面试',
  '奖学金',
  '实习',
  '租房',
  '生活',
  '工作',
  '移民',
  '经验分享',
  '求助',
  '攻略',
];

export default function TagInput({ tags = [], onTagsChange, maxTags = 5 }) {
  const [inputText, setInputText] = useState('');
  const [showHotTags, setShowHotTags] = useState(true);

  // 添加标签
  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    
    if (!trimmedTag) return;
    
    if (tags.length >= maxTags) {
      alert(`最多只能添加${maxTags}个标签`);
      return;
    }
    
    if (tags.includes(trimmedTag)) {
      alert('标签已存在');
      return;
    }
    
    if (trimmedTag.length > 20) {
      alert('标签长度不能超过20个字符');
      return;
    }
    
    onTagsChange([...tags, trimmedTag]);
    setInputText('');
  };

  // 删除标签
  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  // 从热门标签添加
  const addHotTag = (tag) => {
    if (tags.includes(tag)) {
      alert('标签已存在');
      return;
    }
    
    if (tags.length >= maxTags) {
      alert(`最多只能添加${maxTags}个标签`);
      return;
    }
    
    onTagsChange([...tags, tag]);
  };

  // 获取可用的热门标签（排除已添加的）
  const getAvailableHotTags = () => {
    return HOT_TAGS.filter((tag) => !tags.includes(tag));
  };

  return (
    <View style={styles.container}>
      {/* 标题 */}
      <View style={styles.titleRow}>
        <View style={styles.titleLeft}>
          <Ionicons name="pricetag-outline" size={20} color={COLORS.primary[600]} />
          <Text style={styles.title}>添加标签</Text>
          <Text style={styles.tagCount}>
            ({tags.length}/{maxTags})
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowHotTags(!showHotTags)}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleText}>
            {showHotTags ? '收起' : '展开'}推荐
          </Text>
        </TouchableOpacity>
      </View>

      {/* 输入框 */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="输入标签后按回车添加..."
          placeholderTextColor={COLORS.gray[400]}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => addTag(inputText)}
          returnKeyType="done"
          maxLength={20}
        />
        {inputText.length > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addTag(inputText)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={COLORS.primary[600]} />
          </TouchableOpacity>
        )}
      </View>

      {/* 已添加的标签 */}
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity
                onPress={() => removeTag(tag)}
                style={styles.tagRemove}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={14} color={COLORS.primary[600]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* 热门标签推荐 */}
      {showHotTags && getAvailableHotTags().length > 0 && (
        <View style={styles.hotTagsContainer}>
          <Text style={styles.hotTagsTitle}>热门标签</Text>
          <View style={styles.hotTagsWrapper}>
            {getAvailableHotTags().slice(0, 12).map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.hotTag}
                onPress={() => addHotTag(tag)}
                activeOpacity={0.7}
                disabled={tags.length >= maxTags}
              >
                <Text
                  style={[
                    styles.hotTagText,
                    tags.length >= maxTags && styles.hotTagTextDisabled,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray[900],
    marginLeft: 8,
  },
  tagCount: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginLeft: 4,
  },
  toggleText: {
    fontSize: 13,
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.gray[900],
    paddingVertical: 10,
  },
  addButton: {
    padding: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    backgroundColor: COLORS.primary[50],
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  tagRemove: {
    marginLeft: 4,
    padding: 2,
  },
  hotTagsContainer: {
    marginTop: 8,
  },
  hotTagsTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray[600],
    marginBottom: 8,
  },
  hotTagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hotTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.gray[100],
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  hotTagText: {
    fontSize: 13,
    color: COLORS.gray[700],
  },
  hotTagTextDisabled: {
    color: COLORS.gray[400],
  },
});

