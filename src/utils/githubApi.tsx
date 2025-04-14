import React from 'react';
import { View, Text } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { searchIssues } from '../store/thunks';
import T from '../utils/tailwind';

// This is a utility hook to make the Apollo client available to our thunks
export const useApolloClientSetup = (client: any) => {
  React.useEffect(() => {
    // Make the Apollo client available globally for our thunks
    // In a production app, you would use a better dependency injection approach
    (window as any).__APOLLO_CLIENT__ = client;
  }, [client]);
};

// This is a utility hook to handle GitHub API errors
export const useGitHubApiError = () => {
  const error = useAppSelector(state => state.issues.error);
  const uiError = useAppSelector(state => state.ui.error);
  
  return {
    hasError: !!error || !!uiError,
    errorMessage: error || uiError || '',
  };
};

// This is a utility hook to handle GitHub API loading states
export const useGitHubApiLoading = () => {
  const issuesLoading = useAppSelector(state => state.issues.loading);
  const uiLoading = useAppSelector(state => state.ui.isLoading);
  
  return issuesLoading || uiLoading;
};

// This is a utility component to display GitHub API errors
export const GitHubApiError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <View style={[T.p4, T.mY2, T.bgDanger, T.roundedLg]}>
      <Text style={[T.textWhite, T.fontMedium]}>Error: {message}</Text>
    </View>
  );
};

// This is a utility function to format GitHub API dates
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
