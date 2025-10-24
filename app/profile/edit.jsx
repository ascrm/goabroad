/**
 * 编辑资料页面
 * 允许用户编辑个人资料信息
 */

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { COLORS } from '@/src/constants';
import {
    selectUserInfo,
    setUserInfo,
    updateAvatar,
} from '@/src/store/slices/profileSlice';

const GENDER_OPTIONS = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'other', label: '其他' },
];

export default function EditProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const [avatar, setAvatar] = useState(userInfo.avatar);
  const [nickname, setNickname] = useState(userInfo.nickname || '');
  const [gender, setGender] = useState(userInfo.gender || null);
  const [birthday, setBirthday] = useState(
    userInfo.birthday ? new Date(userInfo.birthday) : null
  );
  const [location, setLocation] = useState(userInfo.location || '');
  const [signature, setSignature] = useState(userInfo.signature || '');
  const [education, setEducation] = useState(userInfo.education || []);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 选择头像
  const handleSelectAvatar = async () => {
    Alert.alert('更换头像', '', [
      {
        text: '从相册选择',
        onPress: pickImage,
      },
      {
        text: '拍照',
        onPress: takePhoto,
      },
      {
        text: '取消',
        style: 'cancel',
      },
    ]);
  };

  // 从相册选择
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相册权限才能选择图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  // 拍照
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相机权限才能拍照');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  // 日期选择处理
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  // 验证昵称唯一性（模拟）
  const validateNickname = async (value) => {
    if (!value || value === userInfo.nickname) return true;
    
    // TODO: 调用 API 检查昵称唯一性
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  };

  // 保存资料
  const handleSave = async () => {
    // 验证
    if (!nickname.trim()) {
      Alert.alert('提示', '请输入昵称');
      return;
    }

    if (nickname.length < 2 || nickname.length > 20) {
      Alert.alert('提示', '昵称长度为2-20个字符');
      return;
    }

    setIsSaving(true);

    try {
      // 验证昵称唯一性
      const isNicknameValid = await validateNickname(nickname);
      if (!isNicknameValid) {
        Alert.alert('提示', '昵称已被使用，请换一个');
        setIsSaving(false);
        return;
      }

      // TODO: 调用 API 保存资料
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 更新 Redux 状态
      if (avatar !== userInfo.avatar) {
        dispatch(updateAvatar(avatar));
      }

      dispatch(
        setUserInfo({
          nickname: nickname.trim(),
          gender,
          birthday: birthday?.toISOString(),
          location: location.trim(),
          signature: signature.trim(),
          education,
        })
      );

      Alert.alert('成功', '资料保存成功', [
        {
          text: '确定',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('保存资料失败:', error);
      Alert.alert('失败', '保存资料失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    const hasChanges =
      avatar !== userInfo.avatar ||
      nickname !== (userInfo.nickname || '') ||
      gender !== userInfo.gender ||
      location !== (userInfo.location || '') ||
      signature !== (userInfo.signature || '');

    if (hasChanges) {
      Alert.alert('提示', '确定要放弃编辑吗？', [
        { text: '继续编辑', style: 'cancel' },
        {
          text: '放弃',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={24} color={COLORS.gray[700]} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>编辑资料</Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.7}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.primary[600]} />
            ) : (
              <Text style={styles.saveText}>保存</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 头像 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>头像</Text>
            <TouchableOpacity
              style={styles.avatarRow}
              onPress={handleSelectAvatar}
              activeOpacity={0.7}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Ionicons name="person" size={40} color={COLORS.gray[400]} />
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </View>

          {/* 昵称 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>昵称 *</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入昵称（2-20字符）"
              placeholderTextColor={COLORS.gray[400]}
              value={nickname}
              onChangeText={setNickname}
              maxLength={20}
            />
            <Text style={styles.charCount}>{nickname.length}/20</Text>
          </View>

          {/* 性别 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>性别</Text>
            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    gender === option.value && styles.genderOptionActive,
                  ]}
                  onPress={() => setGender(option.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      gender === option.value && styles.genderOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 生日 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>生日</Text>
            <TouchableOpacity
              style={styles.dateRow}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dateText,
                  !birthday && styles.dateTextPlaceholder,
                ]}
              >
                {birthday
                  ? birthday.toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '请选择生日'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.gray[400]} />
            </TouchableOpacity>
          </View>

          {/* 所在地 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>所在地</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入所在地"
              placeholderTextColor={COLORS.gray[400]}
              value={location}
              onChangeText={setLocation}
              maxLength={50}
            />
          </View>

          {/* 个性签名 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>个性签名</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="写下你的个性签名..."
              placeholderTextColor={COLORS.gray[400]}
              value={signature}
              onChangeText={setSignature}
              multiline
              maxLength={100}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{signature.length}/100</Text>
          </View>

          {/* 教育背景 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>教育背景</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => Alert.alert('提示', '教育背景编辑功能开发中')}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.primary[600]} />
              <Text style={styles.addButtonText}>添加教育经历</Text>
            </TouchableOpacity>
          </View>

          {/* 底部间距 */}
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* 日期选择器 */}
        {showDatePicker && (
          <DateTimePicker
            value={birthday || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerButton: {
    padding: 4,
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gray[100],
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    color: COLORS.gray[900],
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: COLORS.gray[400],
    textAlign: 'right',
    marginTop: 4,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderOptionActive: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[500],
  },
  genderOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray[600],
  },
  genderOptionTextActive: {
    color: COLORS.primary[600],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  dateText: {
    fontSize: 16,
    color: COLORS.gray[900],
  },
  dateTextPlaceholder: {
    color: COLORS.gray[400],
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.gray[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary[600],
    marginLeft: 6,
  },
});

