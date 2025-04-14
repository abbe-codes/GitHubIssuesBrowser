// src/components/ErrorView.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

// Props type definition
interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

// ErrorView component for displaying error messages
// This provides a consistent way to show errors with an optional retry button
const ErrorView = ({ message, onRetry }: ErrorViewProps) => {
  return (
    <View style={tw`p-4 items-center justify-center`}>
      {/* Error icon or image could be added here */}

      {/* Error message */}
      <Text style={tw`text-red-500 text-center mb-4`}>{message}</Text>

      {/* Retry button (if onRetry is provided) */}
      {onRetry && (
        <TouchableOpacity
          style={tw`bg-blue-500 px-4 py-2 rounded-md`}
          onPress={onRetry}
        >
          <Text style={tw`text-white font-bold`}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ErrorView;
