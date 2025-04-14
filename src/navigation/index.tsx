// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import IssuesScreen from '../screens/IssuesScreen';
import IssueDetailScreen from '../screens/IssueDetailScreen';

// Define the types for our navigation parameters
export type RootStackParamList = {
  Issues: undefined;
  IssueDetail: { issueNumber: number };
};

// Create a stack navigator
const Stack = createStackNavigator<RootStackParamList>();

// Main navigation component
// This sets up the navigation structure for our app
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Issues'>
        <Stack.Screen
          name='Issues'
          component={IssuesScreen}
          options={{ title: 'GitHub Issues' }}
        />
        <Stack.Screen
          name='IssueDetail'
          component={IssueDetailScreen}
          options={{ title: 'Issue Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
