/**
 * 生活Tab组件 - 知乎风格
 * 显示生活分类的帖子
 */

import React from 'react';
import CategoryFeed from './CategoryFeed';

const LifeTab = () => {
  return (
    <CategoryFeed
      contentType="TREND"
      category="生活"
      sortBy="createdAt"
      direction="DESC"
      pageSize={20}
    />
  );
};

export default LifeTab;
