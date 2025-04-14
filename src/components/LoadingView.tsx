// src/components/LoadingView.tsx
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import tw from 'twrnc';

// Props type definition
interface LoadingViewProps {
  message?: string;
}

// LoadingView component for displaying loading indicators
// This provides a consistent way to show loading states
const LoadingView = ({ message = 'Loading...' }: LoadingViewProps) => {
  return (
    <View style={tw`p-4 items-center justify-center`}>
      {/* Loading spinner */}
      <ActivityIndicator size='large' color='#4299e1' />

      {/* Loading message */}
      <Text style={tw`mt-2 text-gray-600`}>{message}</Text>
    </View>
  );
};

export default LoadingView;
