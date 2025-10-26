/**
 * 编辑资料页面 - 极简现代风格
 * 全新设计，注重内容和用户体验
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
import * as userApi from '@/src/services/api/modules/userApi';
import {
  selectUserInfo,
  setUserInfo,
  updateAvatar,
} from '@/src/store/slices/profileSlice';

export default function EditProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  // 状态
  const [avatar, setAvatar] = useState(userInfo.avatar);
  const [nickname, setNickname] = useState(userInfo.nickname || '');
  const [gender, setGender] = useState(userInfo.gender || null);
  const [birthday, setBirthday] = useState(
    userInfo.birthday ? new Date(userInfo.birthday) : null
  );
  const [location, setLocation] = useState(userInfo.location || '');
  const [signature, setSignature] = useState(userInfo.signature || '');
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // 选择头像
  const handleSelectAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '需要相册权限');
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

  // 日期选择
  const handleDateChange = (event, selectedDate) => {
    // Android 上用户点击确定或取消时才关闭
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (event.type === 'set' && selectedDate) {
      setBirthday(selectedDate);
      // iOS 上需要手动关闭
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    } else if (event.type === 'dismissed') {
      // 用户取消选择
      setShowDatePicker(false);
    }
  };

  // 保存
  const handleSave = async () => {
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
      // 1. 如果头像有变化，先上传头像
      let avatarUrl = avatar;
      if (avatar !== userInfo.avatar && avatar && !avatar.startsWith('http')) {
        try {
          const fileName = avatar.split('/').pop();
          const fileType = fileName.split('.').pop();
          const avatarFile = {
            uri: avatar,
            name: fileName,
            type: `image/${fileType}`,
          };
          
          const avatarResponse = await userApi.uploadAvatar(avatarFile);
          avatarUrl = avatarResponse.data?.avatar || avatar;
        } catch (error) {
          console.warn('头像上传失败，使用本地路径', error);
        }
      }

      // 2. 更新用户资料
      const profileData = {
        nickname: nickname.trim(),
        bio: signature.trim(), // API 使用 bio 字段
        gender: gender?.toUpperCase(), // API 可能需要大写
        birthday: birthday?.toISOString().split('T')[0], // 格式: YYYY-MM-DD
        location: location.trim(),
      };

      // 调用 API 更新资料
      const response = await userApi.updateUserProfile(profileData);

      // 3. 更新本地 Redux 状态
      if (avatarUrl !== userInfo.avatar) {
        dispatch(updateAvatar(avatarUrl));
      }

      dispatch(
        setUserInfo({
          nickname: nickname.trim(),
          gender,
          birthday: birthday?.toISOString(),
          location: location.trim(),
          signature: signature.trim(),
        })
      );

      Alert.alert('成功', '保存成功', [
        { text: '确定', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('保存失败:', error);
      const errorMessage = error.response?.data?.message || error.message || '保存失败，请重试';
      Alert.alert('失败', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* 极简导航栏 */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={28} color={COLORS.gray[900]} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            style={styles.saveBtn}
            hitSlop={12}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={COLORS.primary[600]} />
            ) : (
              <Text style={styles.saveText}>完成</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 头像 - 极简设计 */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              onPress={handleSelectAvatar}
              activeOpacity={0.8}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarEmpty]}>
                  <Ionicons name="person" size={48} color={COLORS.gray[300]} />
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSelectAvatar}
              style={styles.changeAvatarBtn}
            >
              <Text style={styles.changeAvatarText}>更换头像</Text>
            </TouchableOpacity>
          </View>

          {/* 表单区域 - 极简输入 */}
          <View style={styles.form}>
            
            {/* 昵称 */}
            <View style={styles.field}>
              <Text style={styles.label}>昵称</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'nickname' && styles.inputFocused,
                ]}
                placeholder="输入你的昵称"
                placeholderTextColor={COLORS.gray[400]}
                value={nickname}
                onChangeText={setNickname}
                maxLength={20}
                onFocus={() => setFocusedField('nickname')}
                onBlur={() => setFocusedField(null)}
              />
              {nickname.length > 0 && (
                <Text style={styles.counter}>{nickname.length}/20</Text>
              )}
            </View>

            {/* 性别 */}
            <View style={styles.field}>
              <Text style={styles.label}>性别</Text>
              <View style={styles.genderRow}>
                {[
                  { value: 'male', label: '男' },
                  { value: 'female', label: '女' },
                  { value: 'other', label: '其他' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.genderBtn,
                      gender === item.value && styles.genderBtnActive,
                    ]}
                    onPress={() => setGender(item.value)}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === item.value && styles.genderTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 生日 */}
            <View style={styles.field}>
              <Text style={styles.label}>生日</Text>
              <TouchableOpacity
                style={[
                  styles.input,
                  styles.dateInput,
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={[
                    styles.dateText,
                    !birthday && styles.datePlaceholder,
                  ]}
                >
                  {birthday
                    ? `${birthday.getFullYear()}/${String(birthday.getMonth() + 1).padStart(2, '0')}/${String(birthday.getDate()).padStart(2, '0')}`
                    : '选择生日'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 所在地 */}
            <View style={styles.field}>
              <Text style={styles.label}>所在地</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'location' && styles.inputFocused,
                ]}
                placeholder="你在哪里"
                placeholderTextColor={COLORS.gray[400]}
                value={location}
                onChangeText={setLocation}
                maxLength={50}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* 个性签名 */}
            <View style={styles.field}>
              <Text style={styles.label}>个性签名</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textarea,
                  focusedField === 'signature' && styles.inputFocused,
                ]}
                placeholder="写点什么..."
                placeholderTextColor={COLORS.gray[400]}
                value={signature}
                onChangeText={setSignature}
                multiline
                maxLength={100}
                textAlignVertical="top"
                onFocus={() => setFocusedField('signature')}
                onBlur={() => setFocusedField(null)}
              />
              {signature.length > 0 && (
                <Text style={styles.counter}>{signature.length}/100</Text>
              )}
            </View>

          </View>
        </ScrollView>

        {/* 日期选择器 */}
        {showDatePicker && (
          <DateTimePicker
            value={birthday || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            locale="zh-CN"
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  
  // 导航栏
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  saveBtn: {
    paddingHorizontal: 4,
  },
  saveText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  
  // 滚动区域
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // 头像区域
  avatarSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.gray[50],
  },
  avatarEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    borderStyle: 'dashed',
  },
  changeAvatarBtn: {
    marginTop: 16,
  },
  changeAvatarText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.primary[600],
  },
  
  // 表单
  form: {
    paddingHorizontal: 24,
  },
  field: {
    marginBottom: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray[500],
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 17,
    color: COLORS.gray[900],
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  inputFocused: {
    borderBottomColor: COLORS.primary[600],
  },
  counter: {
    fontSize: 13,
    color: COLORS.gray[400],
    textAlign: 'right',
    marginTop: 4,
  },
  
  // 性别选择
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray[200],
  },
  genderBtnActive: {
    borderBottomColor: COLORS.primary[600],
  },
  genderText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray[500],
  },
  genderTextActive: {
    color: COLORS.primary[600],
    fontWeight: '600',
  },
  
  // 日期选择
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 17,
    color: COLORS.gray[900],
  },
  datePlaceholder: {
    color: COLORS.gray[400],
  },
  
  // 多行文本
  textarea: {
    minHeight: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
});

