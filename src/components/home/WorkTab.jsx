/**
 * 工作Tab组件 - 知乎风格
 * 显示工作分类的帖子
 */

import React from 'react';
import CategoryFeed from './CategoryFeed';

const WorkTab = () => {
  return (
    <CategoryFeed
      contentType="GUIDE"
      category="工作"
      sortBy="createdAt"
      direction="DESC"
      pageSize={20}
    />
  );
};

export default WorkTab;
