/**
 * 留学Tab组件 - 知乎风格
 * 显示留学分类的帖子
 */

import React from 'react';
import CategoryFeed from './CategoryFeed';

const StudyTab = () => {
  return (
    <CategoryFeed
      contentType="GUIDE"
      category="留学"
      sortBy="createdAt"
      direction="DESC"
      pageSize={20}
    />
  );
};

export default StudyTab;
