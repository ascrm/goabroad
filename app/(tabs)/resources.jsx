import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ResourcesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>这是资源页面</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 24,
    fontWeight: '700',
  },
});


