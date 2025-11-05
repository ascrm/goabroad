我来帮你检查项目中未被引用的文件和无用文件。让我系统地分析一下。

[44 tools called]

根据我对整个项目的系统检查，我发现了以下**未被引用或无用的文件**：

## 📋 检查结果总结

### ❌ 完全未被使用的文件

1. **`src/components/home/UnifiedFeed.jsx`**
   - 在 `src/components/home/index.js` 中导出
   - 但在整个项目中没有任何地方实际引用
   - 状态：可以删除

2. **`src/components/home/QuickToolsGrid.jsx`** 和 **`src/components/home/QuickTools.jsx`**
   - 在 `src/components/home/index.js` 中导出
   - 但在整个项目中没有任何地方实际引用（除了 README.md 文档）
   - 状态：可以删除

3. **`src/components/home/DailyCheckIn.jsx`**
   - 在 `src/components/home/index.js` 中导出
   - 但在整个项目中没有任何地方实际引用
   - 状态：可以删除

4. **`src/components/home/EmptyPlanCard.jsx`**
   - 在 `src/components/home/index.js` 中导出
   - 但在整个项目中没有任何地方实际引用
   - 状态：可以删除

5. **`src/components/home/InterestTags.jsx`**
   - 在 `src/components/home/index.js` 中导出
   - 但在整个项目中没有任何地方实际引用
   - 状态：可以删除

6. **`src/components/country/AdvancedFilters.jsx`**
   - 在 `src/components/country/index.js` 中导出
   - 但在整个项目中没有任何地方实际引用
   - 状态：可以删除

7. **`src/components/country/CompareMode.jsx`**
   - 在 `src/components/country/index.js` 中导出
   - 但在整个项目中没有任何地方实际引用
   - 状态：可以删除

8. **`src/components/country/CompareResult.jsx`**
   - 在 `src/components/country/index.js` 中导出
   - 但在整个项目中没有任何地方实际引用
   - 状态：可以删除

9. **`src/components/country/MapView.jsx`**
   - 在 `src/components/country/index.js` 中导出
   - 但在整个项目中没有任何地方实际引用
   - 状态：可以删除

10. **`src/components/planning/CalendarView.jsx`**
    - 在 `src/components/planning/index.js` 中导出
    - 在 `app/planning/[id].jsx` 中没有被实际使用
    - 状态：可以删除

11. **`src/components/planning/KanbanView.jsx`**
    - 在 `src/components/planning/index.js` 中导出
    - 在 `app/planning/[id].jsx` 中没有被实际使用
    - 状态：可以删除

12. **`src/components/planning/ViewSwitcher.jsx`**
    - 在 `src/components/planning/index.js` 中导出
    - 在整个项目中没有任何地方实际引用
    - 状态：可以删除

13. **`src/components/profile/UserHeader.jsx`**
    - 创建了但没有在任何地方被引用
    - 状态：可以删除

14. **`src/examples/UserApiExample.jsx`**
    - 示例文件，没有在项目中被引用
    - 状态：可以删除（或保留作为文档）

15. **`src/utils/mockProfileData.js`**
    - Mock数据文件，没有在项目中被引用
    - 状态：可以删除

16. **`app/community/answer/question-list.jsx`**
    - 从git status看是新增的未追踪文件
    - 但只在 `CreatePostModal` 中被引用了一次，需要确认是否真正使用
    - 状态：可能需要集成到导航中，或删除

### ⚠️ 未在index.js中导出但被使用的组件

以下组件没有在 `src/components/community/index.js` 中导出，但在项目中被直接引用：

1. **Community组件** (未导出但被使用):
   - `PostDetail.jsx` - 在 `app/community/post/[id].jsx` 中使用
   - `CommentList.jsx` - 在 `PostDetail.jsx` 中使用
   - `CommentInput.jsx` - 在 `PostDetail.jsx` 中使用
   - `CommentItem.jsx` - 在 `CommentList.jsx` 中使用
   - `FeedList.jsx` - 在多个地方使用
   - `ImageViewer.jsx` - 在 `PostDetail.jsx` 中使用
   - `VideoCard.jsx` - 在 `app/profile/edit.jsx` 等地方使用
   - `TopicTag.jsx` - 在多个地方使用
   - `TrendingTopics.jsx` - 在多个地方使用
   - `UserProfile.jsx` - 在 `app/profile/user/[id].jsx` 中使用
   - `CategorySelector.jsx` - 在多个地方使用
   - `EmojiPicker.jsx` - 在 `app/community/post/create.jsx` 中使用

   **建议**：这些组件应该被添加到 `src/components/community/index.js` 中统一导出

### ✅ 正常使用的组件

以下组件正在正常使用中：
- `HomeNavigationBar` - 在首页使用
- `RecommendFeed` - 在首页使用
- `LatestGuides` - 在首页使用
- `CommunityNavigationBar` - 在社区页使用
- `PostCard` - 在社区页使用
- `CountryCard`, `CountryFilters` - 在国家列表页使用
- 搜索组件 - 在搜索页使用
- 规划组件 - 在规划详情页使用
- Layout组件 - 在tabs布局中使用

### 🗑️ 已删除但Git中标记为删除的文件

从git status看，以下文件已被删除（正确操作）：
- `app/(main)/_layout.jsx`
- `app/(main)/home.jsx`
- `src/components/layout/TopNavigationBar.jsx`
- `app/community/README.md`

## 💡 清理建议

**立即可以删除的文件（16个）：**
```bash
# Home组件
src/components/home/UnifiedFeed.jsx
src/components/home/QuickToolsGrid.jsx
src/components/home/QuickTools.jsx
src/components/home/DailyCheckIn.jsx
src/components/home/EmptyPlanCard.jsx
src/components/home/InterestTags.jsx

# Country组件
src/components/country/AdvancedFilters.jsx
src/components/country/CompareMode.jsx
src/components/country/CompareResult.jsx
src/components/country/MapView.jsx

# Planning组件
src/components/planning/CalendarView.jsx
src/components/planning/KanbanView.jsx
src/components/planning/ViewSwitcher.jsx

# Profile组件
src/components/profile/UserHeader.jsx

# Utils和Examples
src/utils/mockProfileData.js
src/examples/UserApiExample.jsx
```

**需要更新的导出文件：**
- `src/components/home/index.js` - 移除未使用组件的导出
- `src/components/country/index.js` - 移除未使用组件的导出
- `src/components/planning/index.js` - 移除未使用组件的导出
- `src/components/community/index.js` - 添加实际使用的组件导出

删除这些文件可以减少项目体积，提高维护性。建议在删除前确认这些组件确实不会在未来使用。