/**
 * Screen 页面容器组件
 * SafeAreaView + KeyboardAvoidingView 处理
 */

import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

const Screen = ({
  children,
  scrollable = true,
  safeArea = true,
  keyboardAware = true,
  backgroundColor = '#F5F5F5',
  contentContainerStyle,
  style,
  ...rest
}) => {
  const Container = safeArea ? SafeAreaView : View;
  const Content = scrollable ? ScrollView : View;

  const screenContent = (
    <Container style={[styles.container, { backgroundColor }, style]}>
      <Content
        style={scrollable ? undefined : styles.content}
        contentContainerStyle={
          scrollable ? [styles.scrollContent, contentContainerStyle] : undefined
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...rest}
      >
        {children}
      </Content>
    </Container>
  );

  if (keyboardAware) {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {screenContent}
      </KeyboardAvoidingView>
    );
  }

  return screenContent;
};

Screen.propTypes = {
  children: PropTypes.node.isRequired,
  scrollable: PropTypes.bool,
  safeArea: PropTypes.bool,
  keyboardAware: PropTypes.bool,
  backgroundColor: PropTypes.string,
  contentContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default Screen;

