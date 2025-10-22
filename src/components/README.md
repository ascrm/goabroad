# GoAbroad 组件库

完整的 React Native 组件库，包含 UI 组件、表单组件和布局组件。

## 📦 安装依赖

所有依赖已在 `package.json` 中配置：

```bash
npm install
```

## 🎨 UI 组件

### Button 按钮

支持多种变体、尺寸和状态的按钮组件。

```jsx
import { Button } from '@/components';
import { Ionicons } from '@expo/vector-icons';

// 基础用法
<Button onPress={() => console.log('clicked')}>
  点击我
</Button>

// 不同变体
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="text">文本按钮</Button>

// 不同尺寸
<Button size="sm">小按钮</Button>
<Button size="md">中按钮</Button>
<Button size="lg">大按钮</Button>

// 带图标
<Button
  icon={<Ionicons name="add" size={20} color="#FFFFFF" />}
  iconPosition="left"
>
  添加
</Button>

// 状态
<Button disabled>禁用</Button>
<Button loading>加载中</Button>
<Button fullWidth>全宽按钮</Button>
```

### Input 输入框

支持多种类型、前后缀图标、清除按钮和错误提示。

```jsx
import { Input } from '@/components';
import { Ionicons } from '@expo/vector-icons';

// 基础用法
<Input
  value={value}
  onChangeText={setValue}
  placeholder="请输入内容"
/>

// 不同类型
<Input type="text" label="用户名" />
<Input type="password" label="密码" />
<Input type="email" label="邮箱" />
<Input type="phone" label="手机号" />
<Input type="number" label="数字" />

// 前后缀图标
<Input
  prefixIcon={<Ionicons name="search" size={20} color="#999" />}
  placeholder="搜索..."
/>

<Input
  suffixIcon={<Ionicons name="eye" size={20} color="#999" />}
/>

// 可清除
<Input clearable onClear={() => setValue('')} />

// 错误状态
<Input
  error
  errorMessage="请输入有效的邮箱地址"
/>

// 多行文本
<Input
  multiline
  numberOfLines={4}
  maxLength={200}
/>
```

### Card 卡片

白色背景、阴影和圆角的卡片容器。

```jsx
import { Card } from '@/components';

// 基础用法
<Card>
  <Text>卡片内容</Text>
</Card>

// 带标题
<Card title="卡片标题">
  <Text>卡片内容</Text>
</Card>

// 带标题和副标题
<Card
  title="卡片标题"
  subtitle="副标题"
>
  <Text>卡片内容</Text>
</Card>

// 右侧操作
<Card
  title="卡片标题"
  headerRight={
    <Button variant="text" size="sm">更多</Button>
  }
>
  <Text>卡片内容</Text>
</Card>

// 底部操作
<Card
  title="卡片标题"
  footer={
    <Button fullWidth>操作</Button>
  }
>
  <Text>卡片内容</Text>
</Card>
```

### Badge 徽章

```jsx
import { Badge } from '@/components';

// 不同颜色
<Badge color="primary">主要</Badge>
<Badge color="success">成功</Badge>
<Badge color="warning">警告</Badge>
<Badge color="error">错误</Badge>
<Badge color="info">信息</Badge>

// 不同尺寸
<Badge size="sm">小</Badge>
<Badge size="md">中</Badge>
<Badge size="lg">大</Badge>

// 不同形状
<Badge shape="rounded">圆角</Badge>
<Badge shape="pill">药丸</Badge>

// 圆点徽章
<Badge dot color="error" />
```

### Avatar 头像

```jsx
import { Avatar } from '@/components';

// 图片头像
<Avatar source="https://example.com/avatar.jpg" />
<Avatar source={require('./avatar.png')} />

// 文字头像
<Avatar name="张三" />
<Avatar name="John Doe" />

// 图标头像
<Avatar icon={<Ionicons name="person" size={24} color="#FFF" />} />

// 不同尺寸
<Avatar size="xs" name="张三" />
<Avatar size="sm" name="张三" />
<Avatar size="md" name="张三" />
<Avatar size="lg" name="张三" />
<Avatar size="xl" name="张三" />

// 在线状态
<Avatar name="张三" online />
<Avatar name="李四" online={false} />
```

### Loading 加载

```jsx
import { Loading, Spinner, Skeleton, PageLoading, OverlayLoading } from '@/components';

// Spinner 旋转器
<Spinner size="small" />
<Spinner size="medium" />
<Spinner size="large" color="#FF0000" />

// 骨架屏
<Skeleton width={100} height={20} />
<Skeleton width="100%" height={40} borderRadius={8} />

// 卡片骨架
<SkeletonCard />

// 列表项骨架
<SkeletonListItem />

// 页面级加载
<PageLoading message="加载中..." />

// 覆盖层加载
<OverlayLoading visible={loading} message="处理中..." />
```

### Toast 提示

```jsx
import { Toast } from '@/components';

<Toast
  visible={showToast}
  type="success"
  message="操作成功"
  duration={3000}
  position="top"
  onHide={() => setShowToast(false)}
/>
```

## 📝 表单组件

所有表单组件都集成了 `react-hook-form`。

### 基础用法

```jsx
import { useForm } from 'react-hook-form';
import { FormInput, FormSelect, FormDatePicker } from '@/components';

const MyForm = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: '',
      email: '',
      country: '',
      birthday: new Date(),
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <View>
      <FormInput
        control={control}
        name="username"
        label="用户名"
        rules={{ required: '请输入用户名' }}
      />

      <FormInput
        control={control}
        name="email"
        type="email"
        label="邮箱"
        rules={{
          required: '请输入邮箱',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: '邮箱格式不正确',
          },
        }}
      />

      <FormSelect
        control={control}
        name="country"
        label="国家"
        options={[
          { label: '美国', value: 'US' },
          { label: '英国', value: 'UK' },
          { label: '加拿大', value: 'CA' },
        ]}
      />

      <FormDatePicker
        control={control}
        name="birthday"
        label="生日"
        mode="date"
      />

      <Button onPress={handleSubmit(onSubmit)}>提交</Button>
    </View>
  );
};
```

### 验证规则辅助函数

```jsx
import { validationRules } from '@/components';

<FormInput
  control={control}
  name="email"
  rules={{
    ...validationRules.required(),
    ...validationRules.email(),
  }}
/>

<FormInput
  control={control}
  name="password"
  type="password"
  rules={{
    ...validationRules.required(),
    ...validationRules.password(),
    ...validationRules.minLength(8),
  }}
/>
```

## 🏗️ 布局组件

### Screen 页面容器

```jsx
import { Screen } from '@/components';

// 可滚动页面
<Screen>
  <Text>页面内容</Text>
</Screen>

// 不可滚动
<Screen scrollable={false}>
  <Text>固定内容</Text>
</Screen>

// 自定义背景色
<Screen backgroundColor="#FFFFFF">
  <Text>内容</Text>
</Screen>

// 禁用键盘避让
<Screen keyboardAware={false}>
  <Text>内容</Text>
</Screen>
```

### Header 页面头部

```jsx
import { Header } from '@/components';
import { Ionicons } from '@expo/vector-icons';

// 基础用法
<Header title="页面标题" />

// 带返回按钮
<Header title="页面标题" showBack />

// 带副标题
<Header
  title="主标题"
  subtitle="副标题"
  showBack
/>

// 右侧操作
<Header
  title="页面标题"
  showBack
  rightActions={
    <>
      <TouchableOpacity>
        <Ionicons name="search" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
      </TouchableOpacity>
    </>
  }
/>

// 搜索模式
<Header
  searchMode
  searchValue={searchText}
  onSearchChange={setSearchText}
  searchPlaceholder="搜索内容..."
/>
```

### TabBar 底部标签栏

```jsx
import { TabBar } from '@/components';

// 在根布局中使用
<View style={{ flex: 1 }}>
  {/* 页面内容 */}
  <TabBar />
</View>
```

### Section 区块

```jsx
import { Section } from '@/components';

// 基础用法
<Section title="区块标题">
  <Text>区块内容</Text>
</Section>

// 带副标题
<Section
  title="区块标题"
  subtitle="副标题说明"
>
  <Text>内容</Text>
</Section>

// 右侧操作
<Section
  title="推荐国家"
  actionText="查看更多"
  onActionPress={() => console.log('more')}
>
  <Text>内容</Text>
</Section>

// 无内边距
<Section title="列表" noPadding>
  <FlatList data={data} renderItem={renderItem} />
</Section>
```

### List 列表

```jsx
import { List } from '@/components';

const MyList = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 加载数据
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    setLoading(true);
    // 加载更多
    setLoading(false);
  };

  return (
    <List
      data={data}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      keyExtractor={(item) => item.id}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      onLoadMore={handleLoadMore}
      loading={loading}
      hasMore={true}
      emptyTitle="暂无数据"
      emptyDescription="当前没有任何内容"
    />
  );
};
```

### Modal 模态框

```jsx
import { Modal, Button } from '@/components';

// 底部弹出
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="选择"
>
  <Text>模态框内容</Text>
</Modal>

// 居中弹窗
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  type="center"
  title="提示"
  footer={
    <Button onPress={() => setVisible(false)}>确定</Button>
  }
>
  <Text>确认要执行此操作吗？</Text>
</Modal>

// 全屏模态
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  type="fullscreen"
  title="详情"
>
  <ScrollView>
    <Text>完整内容</Text>
  </ScrollView>
</Modal>

// 自定义高度
<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  height={400}
>
  <Text>内容</Text>
</Modal>
```

## 🎯 完整示例

结合多个组件创建完整页面：

```jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Screen,
  Header,
  Section,
  Card,
  Button,
  FormInput,
  FormSelect,
  validationRules,
} from '@/components';

const ProfileEditScreen = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: '',
      country: '',
    },
  });

  const onSubmit = (data) => {
    console.log('提交数据:', data);
  };

  return (
    <Screen>
      <Header title="编辑资料" showBack />

      <Section title="基本信息">
        <Card>
          <FormInput
            control={control}
            name="name"
            label="姓名"
            placeholder="请输入姓名"
            rules={validationRules.required()}
          />

          <FormInput
            control={control}
            name="email"
            type="email"
            label="邮箱"
            placeholder="请输入邮箱"
            rules={{
              ...validationRules.required(),
              ...validationRules.email(),
            }}
          />

          <FormSelect
            control={control}
            name="country"
            label="目标国家"
            placeholder="请选择国家"
            options={[
              { label: '美国', value: 'US' },
              { label: '英国', value: 'UK' },
              { label: '加拿大', value: 'CA' },
            ]}
            searchable
          />
        </Card>
      </Section>

      <View style={{ padding: 16 }}>
        <Button
          fullWidth
          onPress={handleSubmit(onSubmit)}
        >
          保存
        </Button>
      </View>
    </Screen>
  );
};

export default ProfileEditScreen;
```

## 🎨 主题定制

所有组件使用统一的颜色系统：

- **Primary**: `#0066FF` - 主色调
- **Success**: `#00C853` - 成功
- **Warning**: `#FF9800` - 警告
- **Error**: `#FF4444` - 错误
- **Info**: `#00B8D4` - 信息

如需定制，可以在各组件的 `StyleSheet` 中修改。

## 📚 更多

查看各组件源码以了解更多属性和用法。

