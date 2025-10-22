/**
 * FormTextArea 多行文本输入组件
 * 支持自动高度和字数统计
 */

import React from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import Input from '../ui/Input';

const FormTextArea = ({
  control,
  name,
  rules,
  defaultValue = '',
  numberOfLines = 4,
  maxLength,
  ...inputProps
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={!!error}
          errorMessage={error?.message}
          multiline
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          {...inputProps}
        />
      )}
    />
  );
};

FormTextArea.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.object,
  defaultValue: PropTypes.string,
  numberOfLines: PropTypes.number,
  maxLength: PropTypes.number,
};

export default FormTextArea;

