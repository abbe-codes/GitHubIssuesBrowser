import React from 'react';
import { View, Text, TextInput } from 'react-native';
import T from '../utils/tailwind';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
}) => {
  return (
    <View style={[T.mB4]}>
      {label && (
        <Text style={[T.textGray, T.fontMedium, T.mB1]}>{label}</Text>
      )}
      <TextInput
        style={[
          T.pY2,
          T.pX3,
          T.roundedMd,
          T.bgLight,
          T.borderGrayLight,
          T.border,
          error ? T.borderDanger : null,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {error && (
        <Text style={[T.textDanger, T.textSm, T.mT1]}>{error}</Text>
      )}
    </View>
  );
};

export default Input;
