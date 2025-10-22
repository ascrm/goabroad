/**
 * FormInput 表单输入框
 * 集成 react-hook-form 的 Controller
 */

import React from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import Input from '../ui/Input';

const FormInput = ({
  control,
  name,
  rules,
  defaultValue = '',
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
          {...inputProps}
        />
      )}
    />
  );
};

FormInput.propTypes = {
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  rules: PropTypes.object,
  defaultValue: PropTypes.string,
};

export default FormInput;

