// src/App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client';
import { Provider as ReduxProvider } from 'react-redux';
import apolloClient from './api/apollo';
import store from './store';
import Navigation from './navigation';

// Main App component
// This is the entry point of our application
const App = () => {
  return (
    // Provide Apollo Client for GraphQL
    <ApolloProvider client={apolloClient}>
      {/* Provide Redux store for state management */}
      <ReduxProvider store={store}>
        {/* Provide safe area insets */}
        <SafeAreaProvider>
          {/* Navigation structure */}
          <Navigation />
        </SafeAreaProvider>
      </ReduxProvider>
    </ApolloProvider>
  );
};

export default App;
