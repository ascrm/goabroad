/**
 * 签证Tab组件 - 知乎风格
 * 显示签证分类的帖子
 */

import React from 'react';
import CategoryFeed from './CategoryFeed';

const VisaTab = () => {
  return (
    <CategoryFeed
      contentType="GUIDE"
      category="签证"
      sortBy="createdAt"
      direction="DESC"
      pageSize={20}
    />
  );
};

export default VisaTab;
