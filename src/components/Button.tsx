import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import T from '../utils/tailwind';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
}) => {
  // Base styles
  const baseStyles = [T.roundedLg, T.flexRow, T.itemsCenter, T.justifyCenter];
  
  // Size styles
  const sizeStyles = {
    sm: [T.pY1, T.pX2, T.textSm],
    md: [T.pY2, T.pX4, T.textBase],
    lg: [T.pY3, T.pX6, T.textLg],
  };
  
  // Variant styles
  const variantStyles = {
    primary: [T.bgPrimary, T.textWhite],
    secondary: [T.bgSecondary, T.textWhite],
    success: [T.bgSuccess, T.textWhite],
    danger: [T.bgDanger, T.textWhite],
    outline: [T.borderPrimary, T.border, T.textPrimary],
  };
  
  // Disabled styles
  const disabledStyles = disabled ? [T.opacity50] : [];
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...disabledStyles,
      ]}
    >
      <Text
        style={[
          variant === 'outline' ? T.textPrimary : T.textWhite,
          size === 'sm' ? T.textSm : size === 'lg' ? T.textLg : T.textBase,
          T.fontMedium,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
