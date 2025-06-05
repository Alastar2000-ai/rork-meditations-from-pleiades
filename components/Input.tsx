import React from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  Text, 
  TouchableOpacity,
  TextInputProps,
  ViewStyle
} from 'react-native';
import colors from '@/constants/colors';
import theme from '@/constants/theme';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  isPassword = false,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const passwordIcon = showPassword ? (
    <TouchableOpacity onPress={togglePasswordVisibility}>
      <EyeOff size={20} color={colors.text.muted} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={togglePasswordVisibility}>
      <Eye size={20} color={colors.text.muted} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPassword) && styles.inputWithRightIcon,
          ]}
          placeholderTextColor={colors.text.muted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword ? <View style={styles.rightIcon}>{passwordIcon}</View> :
          rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>
        }
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    color: colors.text.secondary,
    fontSize: theme.fontSize.s,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.light,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  focusedInput: {
    borderColor: colors.primary,
  },
  errorInput: {
    borderColor: colors.ui.error,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: theme.fontSize.m,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  leftIcon: {
    paddingLeft: theme.spacing.m,
  },
  rightIcon: {
    paddingRight: theme.spacing.m,
  },
  errorText: {
    color: colors.ui.error,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
});