import React from 'react';
import { Platform, Image as RNImage, ImageProps as RNImageProps, ImageSourcePropType } from 'react-native';
import { Image, ImageProps } from 'expo-image';

type CombinedImageProps = ImageProps & RNImageProps;

// This component wraps expo-image to handle platform-specific props
export default function PlatformImage(props: CombinedImageProps) {
  // On Android, use React Native's Image component for better compatibility with SDK53
  if (Platform.OS === 'android') {
    const { contentFit, source, style, placeholder, recyclingKey, contentPosition, transition, ...otherProps } = props;
    
    // Convert contentFit to resizeMode
    const resizeMode = 
      contentFit === 'cover' ? 'cover' : 
      contentFit === 'contain' ? 'contain' : 
      contentFit === 'fill' ? 'stretch' : 
      contentFit === 'none' ? 'center' : 'cover';
    
    // Convert source format if needed
    let processedSource: ImageSourcePropType = { uri: '' };
    
    if (typeof source === 'string') {
      processedSource = { uri: source };
    } else if (Array.isArray(source)) {
      processedSource = source[0] as ImageSourcePropType;
    } else {
      processedSource = source as ImageSourcePropType;
    }
    
    return (
      <RNImage 
        source={processedSource}
        style={style}
        resizeMode={resizeMode}
        {...otherProps}
      />
    );
  }
  
  // On web, we need to explicitly exclude props that cause warnings
  if (Platform.OS === 'web') {
    const {
      contentFit,
      contentPosition,
      transition,
      placeholder,
      recyclingKey,
      ...webSafeProps 
    } = props;
    
    // Re-add contentFit as style.objectFit for web
    const safeProps = {
      ...webSafeProps,
      style: [
        props.style,
        contentFit && { objectFit: contentFit === 'cover' ? 'cover' : 
                        contentFit === 'contain' ? 'contain' : 
                        contentFit === 'fill' ? 'fill' : 
                        contentFit === 'none' ? 'none' : 'cover' }
      ]
    };
    
    return <Image {...safeProps} />;
  }
  
  // On iOS, use expo-image as normal
  return <Image {...props} />;
}