/**
 * 社区页面
 * 参考Twitter/X的社交媒体风格设计
 */

import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { CommunityNavigationBar, PostCard } from '@/src/components/community';
import { COLORS } from '@/src/constants';
import { useDrawer } from './_layout';

// 模拟帖子数据
const MOCK_POSTS = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: '留学小助手',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      verified: true,
      description: '留学规划师 | 已帮助500+学生',
    },
    content: '🎓 2024年英国留学申请时间线来了！\n\n想要申请2024年秋季入学的同学们，现在就要开始准备啦！建议大家提前一年开始规划，准备语言成绩、文书材料等。\n\n具体时间线：\n9-12月：准备申请材料\n1-3月：递交申请\n4-6月：等待offer\n7-8月：办理签证\n\n有问题欢迎私信咨询～',
    images: [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2',
    ],
    createdAt: '2024-01-15T10:30:00Z',
    commentCount: 156,
    shareCount: 89,
    likeCount: 1234,
    viewCount: 8567,
    bookmarkCount: 456,
    liked: false,
    bookmarked: false,
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: '在英国的小王',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      verified: false,
      description: 'UCL在读 | 分享留学生活',
    },
    content: '伦敦的秋天真的太美了🍂 今天去海德公园散步，满地金黄色的落叶，随手一拍都是大片！推荐大家来伦敦一定要去海德公园走走，尤其是秋天。',
    images: [
      'https://picsum.photos/600/400?random=3',
    ],
    createdAt: '2024-01-15T08:20:00Z',
    commentCount: 45,
    shareCount: 23,
    likeCount: 567,
    viewCount: 3421,
    bookmarkCount: 234,
    liked: true,
    bookmarked: false,
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Emily Zhang',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      verified: true,
      description: '前亚马逊 | 职业规划导师',
    },
    content: '收到很多同学问简历怎么写，今天分享几个要点：\n\n1. 用数据说话，量化你的成果\n2. 突出与岗位匹配的技能\n3. 使用行动动词开头\n4. 控制在一页纸以内\n5. 仔细检查语法和拼写\n\n简历是你的第一印象，一定要认真对待！需要改简历的可以找我～',
    images: [],
    createdAt: '2024-01-14T16:45:00Z',
    commentCount: 234,
    shareCount: 456,
    likeCount: 2890,
    viewCount: 15678,
    bookmarkCount: 890,
    liked: false,
    bookmarked: true,
  },
  {
    id: '4',
    author: {
      id: 'user4',
      name: '澳洲留学君',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      verified: true,
      description: '墨尔本大学 | 留学分享',
    },
    content: '分享一下墨尔本的美食地图！🍕🍜\n\n来澳洲这么久，终于把墨尔本的好吃的都吃遍了。今天整理了一份详细的美食攻略，包含中餐、西餐、咖啡店等，图片是我最喜欢的几家店。\n\n留学不仅要学习，也要好好享受生活呀～',
    images: [
      'https://picsum.photos/400/300?random=4',
      'https://picsum.photos/400/300?random=5',
      'https://picsum.photos/400/300?random=6',
      'https://picsum.photos/400/300?random=7',
    ],
    createdAt: '2024-01-14T14:20:00Z',
    commentCount: 89,
    shareCount: 67,
    likeCount: 890,
    viewCount: 4567,
    bookmarkCount: 345,
    liked: true,
    bookmarked: false,
  },
  {
    id: '5',
    author: {
      id: 'user5',
      name: '签证小专家',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      verified: true,
      description: '签证顾问 | 成功率98%',
    },
    content: '⚠️ 重要提醒：最近美国签证预约变难了！\n\n据最新消息，美国多个使馆的签证预约已经排到了3个月后。建议大家：\n\n• 尽早预约面签时间\n• 准备好所有材料\n• 注意check时间\n• 关注使馆最新通知\n\n有签证问题随时咨询～',
    images: [],
    createdAt: '2024-01-14T11:30:00Z',
    commentCount: 178,
    shareCount: 234,
    likeCount: 1567,
    viewCount: 9876,
    bookmarkCount: 678,
    liked: false,
    bookmarked: true,
  },
  {
    id: '6',
    author: {
      id: 'user6',
      name: 'Toronto生活指南',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      verified: false,
      description: '多伦多大学 | 生活博主',
    },
    content: '多伦多下雪啦！❄️⛄️\n\n这是来加拿大的第一个冬天，看到漫天飞舞的雪花真的好激动！虽然很冷，但是雪景真的太美了。提醒大家记得穿暖和，羽绒服、手套、围巾都要备好！',
    images: [
      'https://picsum.photos/600/500?random=8',
    ],
    createdAt: '2024-01-13T20:15:00Z',
    commentCount: 67,
    shareCount: 34,
    likeCount: 456,
    viewCount: 2345,
    bookmarkCount: 123,
    liked: false,
    bookmarked: false,
  },
];

export default function Community() {
  const { openDrawer } = useDrawer();
  
  // 状态管理
  const [activeTab, setActiveTab] = useState('recommend');
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(MOCK_POSTS);

  // 下拉刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // 模拟刷新数据
    setTimeout(() => {
      setRefreshing(false);
      // 可以在这里重新加载数据
    }, 1500);
  }, []);

  // 处理帖子点击
  const handlePostPress = useCallback((post) => {
    console.log('点击帖子:', post.id);
    // TODO: 导航到帖子详情页
  }, []);

  // 渲染帖子卡片
  const renderPost = useCallback(({ item }) => (
    <PostCard 
      post={item} 
      onPress={() => handlePostPress(item)}
    />
  ), [handlePostPress]);

  // 列表分隔符
  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <CommunityNavigationBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDrawer={openDrawer}
      />

      {/* 内容信息流 */}
      <FlatList
        data={activeTab === 'recommend' ? posts : []}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary[600]}
            colors={[COLORS.primary[600]]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  listContent: {
    backgroundColor: '#FFFFFF',
  },
  separator: {
    height: 0,
  },
});
