import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import theme from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left'
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'text':
        return styles.textButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return styles.primaryText;
      case 'outline':
        return styles.outlineText;
      case 'text':
        return styles.textButtonText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={variant === 'outline' ? colors.primary : 'white'} />;
    }

    const textComponent = (
      <Text
        style={[
          getTextStyle(),
          getTextSizeStyle(),
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    );

    if (!icon) return textComponent;

    return (
      <>
        {iconPosition === 'left' && icon}
        {textComponent}
        {iconPosition === 'right' && icon}
      </>
    );
  };

  const buttonContent = (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );

  if (variant === 'primary' && !disabled) {
    return (
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, getSizeStyle(), style]}
        borderRadius={theme.borderRadius.m}
      >
        <TouchableOpacity
          style={[styles.gradientButton]}
          onPress={onPress}
          disabled={loading}
          activeOpacity={0.8}
        >
          {renderContent()}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return buttonContent;
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.s,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  smallButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
  },
  mediumButton: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  largeButton: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
  },
  primaryText: {
    color: 'white',
    fontWeight: '600',
  },
  outlineText: {
    color: colors.primary,
    fontWeight: '600',
  },
  textButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  smallText: {
    fontSize: theme.fontSize.s,
  },
  mediumText: {
    fontSize: theme.fontSize.m,
  },
  largeText: {
    fontSize: theme.fontSize.l,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    borderColor: '#CCCCCC',
  },
  disabledText: {
    color: '#888888',
  },
});