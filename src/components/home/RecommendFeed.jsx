/**
 * 为你推荐组件 - 知乎风格信息流
 * 显示推荐的社区内容（综合各种类型的帖子）
 */

import React from 'react';
import CategoryFeed from './CategoryFeed';

/**
 * 推荐Feed - 显示混合内容
 * 策略：优先展示攻略(GUIDE)类型的内容，按热度排序
 */
const RecommendFeed = () => {
  return (
    <CategoryFeed
      contentType="GUIDE"
      sortBy="viewCount"
      direction="DESC"
      pageSize={20}
    />
  );
};

export default RecommendFeed;

