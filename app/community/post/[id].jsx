/**
 * 帖子详情页
 * 显示帖子完整内容和评论列表
 */

import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import CommentInput from '@/src/components/community/CommentInput';
import CommentList from '@/src/components/community/CommentList';
import PostDetail from '@/src/components/community/PostDetail';
import { COLORS } from '@/src/constants';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { addComment, setCurrentPost } from '@/src/store/slices/communitySlice';

// Mock 帖子数据
const generateMockPost = (id) => {
  return {
    id,
    type: 'normal',
    title: '美国F1签证面签攻略（2024最新版）',
    content: `## 前言

大家好！我是刚拿到F1签证的小王，经历了漫长的准备和紧张的面签，现在终于拿到了签证。在这里分享一下我的经验，希望能帮助到准备申请的同学们。

## 准备材料

面签需要准备的材料很多，建议提前1-2周开始准备：

### 必备材料
1. **护照**：有效期至少6个月
2. **DS-160确认页**：在线填写并打印
3. **I-20表格**：学校寄来的原件
4. **SEVIS费用收据**：提前在线支付
5. **签证预约确认页**

### 辅助材料
- 成绩单和学位证明
- 语言成绩单（托福/雅思）
- 资金证明（银行存款证明）
- 家庭关系证明
- 父母在职收入证明

## 面签流程

1. **安检**：提前30分钟到达，手机不能带入
2. **递交材料**：排队等候，递交护照和DS-160
3. **采集指纹**：十指指纹录入
4. **面谈**：与签证官对话，5-10分钟

## 常见问题

**Q: 为什么选择这所学校？**
A: 如实回答，突出专业优势和职业规划

**Q: 毕业后有什么打算？**
A: 强调会回国发展，不要表现出移民倾向

**Q: 谁支付你的学费？**
A: 说明资金来源，展示充足的经济能力

## 注意事项

⚠️ **关键提示**：
- 回答问题要简洁明了，不要啰嗦
- 保持自信，眼神交流
- 英语不好也没关系，可以用中文
- 如果材料不够可以补交，不要紧张

## 结语

只要材料准备充分，如实回答问题，通过率还是很高的。祝大家都能顺利拿到签证！🎉

如果有任何问题欢迎在评论区提问，我会尽量回答～`,
    author: {
      id: 1,
      name: '留学小王',
      avatar: 'https://i.pravatar.cc/150?img=1',
      isFollowing: false,
    },
    tags: ['美国留学', 'F1签证', '面签攻略'],
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3',
      'https://picsum.photos/800/600?random=4',
    ],
    likeCount: 1234,
    commentCount: 89,
    favoriteCount: 567,
    isLiked: false,
    isFavorited: false,
    isHighlighted: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

export default function PostDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id, focus } = useLocalSearchParams();
  const [replyTo, setReplyTo] = useState(null);
  const commentInputRef = useRef(null);

  const post = useAppSelector((state) => state.community.currentPost);

  // 加载帖子数据
  useEffect(() => {
    // TODO: 调用真实 API
    const mockPost = generateMockPost(id);
    dispatch(setCurrentPost(mockPost));
  }, [id, dispatch]);

  // 如果 URL 带有 focus=comment，自动聚焦输入框
  useEffect(() => {
    if (focus === 'comment') {
      // TODO: 聚焦评论输入框
      console.log('Focus on comment input');
    }
  }, [focus]);

  // 返回按钮
  const handleBack = () => {
    router.back();
  };

  // 分享按钮
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.title}\n查看更多：GoAbroad社区`,
        title: post.title,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  // 更多操作（举报、删除等）
  const handleMore = () => {
    Alert.alert(
      '更多操作',
      '',
      [
        { text: '举报', onPress: () => console.log('Report') },
        { text: '屏蔽作者', onPress: () => console.log('Block') },
        { text: '取消', style: 'cancel' },
      ]
    );
  };

  // 回复评论
  const handleReply = (replyInfo) => {
    setReplyTo(replyInfo);
  };

  // 取消回复
  const handleCancelReply = () => {
    setReplyTo(null);
  };

  // 提交评论
  const handleSubmitComment = (text, replyInfo) => {
    // TODO: 调用真实 API
    const newComment = {
      id: `comment-${Date.now()}`,
      user: {
        id: 'current-user',
        name: '当前用户',
        avatar: 'https://i.pravatar.cc/150?img=99',
      },
      content: text,
      likeCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      replyTo: replyInfo ? {
        id: replyInfo.userId,
        name: replyInfo.userName,
      } : null,
      replies: [],
    };

    dispatch(addComment(newComment));
    setReplyTo(null);
  };

  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      {/* 头部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-redo-outline" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleMore}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 评论列表（帖子内容作为 header） */}
      <CommentList
        postId={post.id}
        authorId={post.author.id}
        onReply={handleReply}
        ListHeaderComponent={<PostDetail post={post} onShare={handleShare} />}
      />

      {/* 底部评论输入框 */}
      <CommentInput
        ref={commentInputRef}
        replyTo={replyTo}
        onSubmit={handleSubmitComment}
        onCancel={handleCancelReply}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

