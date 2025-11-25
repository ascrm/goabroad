import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Input = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  prefixIcon,
  suffixIcon,
  error = false,
  errorMessage = '',
  type = 'text',
  clearable = false,
  containerStyle,
  inputStyle,
  ...rest
}) => {
  const secureTextEntry = type === 'password';
  const showClear = clearable && Boolean(value?.length);

  const handleClear = () => {
    onChangeText?.('');
    if (typeof rest.onClear === 'function') {
      rest.onClear();
    }
  };

  return (
    <View style={containerStyle}>
      <View style={[styles.wrapper, error && styles.wrapperError]}>
        {prefixIcon ? <View style={styles.icon}>{prefixIcon}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          style={[styles.input, inputStyle]}
          {...rest}
        />
        {showClear ? (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        ) : null}
        {suffixIcon ? <View style={styles.icon}>{suffixIcon}</View> : null}
      </View>
      {error && !!errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  wrapperError: {
    borderColor: '#F87171',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 12,
  },
  icon: {
    marginHorizontal: 4,
  },
  clearButton: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  clearText: {
    fontSize: 18,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 6,
    marginLeft: 4,
  },
});

export default Input;


