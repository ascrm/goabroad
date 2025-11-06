/**
 * 其他Tab组件 - 知乎风格
 * 显示其他分类的帖子
 */

import React from 'react';
import CategoryFeed from './CategoryFeed';

const OtherTab = () => {
  return (
    <CategoryFeed
      contentType="GUIDE"
      sortBy="createdAt"
      direction="DESC"
      pageSize={20}
    />
  );
};

export default OtherTab;
