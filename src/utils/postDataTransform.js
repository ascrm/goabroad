/**
 * 帖子数据转换工具
 * 将后端 API 数据格式转换为前端组件所需格式
 */

/**
 * 将 API 返回的帖子数据转换为 ZhihuPostCard 组件所需格式
 * 
 * @param {Object} apiPost - API 返回的帖子数据
 * @returns {Object} ZhihuPostCard 组件所需的帖子数据
 */
export const transformPostForZhihuCard = (apiPost) => {
  if (!apiPost) return null;

  // 处理图片数据
  const images = apiPost.images || [];
  const cover = images.length > 0 ? images[0] : (apiPost.coverImage || null);
  
  return {
    id: String(apiPost.id), // ZhihuPostCard 使用字符串 ID
    author: {
      id: apiPost.author?.id ? String(apiPost.author.id) : 'unknown',
      name: apiPost.author?.nickname || apiPost.author?.username || '匿名用户',
      avatar: apiPost.author?.avatarUrl || `https://i.pravatar.cc/150?u=${apiPost.author?.id || 0}`,
      bio: apiPost.author?.bio || '',
      isFollowed: apiPost.author?.isFollowing || false,
    },
    title: apiPost.title || '',
    content: apiPost.contentPreview || apiPost.summary || '',
    cover: cover,
    images: images, // 图片数组
    tags: apiPost.tags || [],
    stats: {
      likes: apiPost.likeCount || 0,
      comments: apiPost.commentCount || 0,
      collects: apiPost.collectCount || 0,
      shares: 0, // API 暂无分享数据
      views: apiPost.viewCount || 0,
    },
    time: formatTime(apiPost.createdAt),
    liked: apiPost.isLiked || false,
    collected: apiPost.isCollected || false,
    // 保留原始数据，方便后续使用
    _originalData: apiPost,
  };
};

/**
 * 批量转换帖子数据
 * @param {Array} apiPosts - API 返回的帖子数组
 * @returns {Array} 转换后的帖子数组
 */
export const transformPostsForZhihuCard = (apiPosts) => {
  if (!Array.isArray(apiPosts)) return [];
  return apiPosts.map(transformPostForZhihuCard).filter(Boolean);
};

/**
 * 格式化时间显示
 * @param {string} dateString - ISO 格式的时间字符串
 * @returns {string} 格式化后的时间字符串
 */
const formatTime = (dateString) => {
  if (!dateString) return '刚刚';

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 1) {
      return '刚刚';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}周前`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}个月前`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years}年前`;
    }
  } catch (error) {
    console.error('时间格式化错误:', error);
    return '未知时间';
  }
};

export default {
  transformPostForZhihuCard,
  transformPostsForZhihuCard,
};

