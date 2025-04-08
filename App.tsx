import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { store } from './src/redux/store';
import IssuesScreen from './src/screens/IssuesScreen';
import IssueDetailScreen from './src/screens/IssueDetailScreen';
import T from './src/utils/tailwind';
import { client } from './src/apollo/apolloClient';
import { useApolloClientSetup } from './src/utils/githubApi';
import ErrorBoundary from './src/components/ErrorBoundary';
import NetworkStatus from './src/components/NetworkStatus';
import { setNetworkStatus } from './src/redux/slices/networkSlice';
import { setError } from './src/redux/slices/uiSlice';

function AppContent(): React.JSX.Element {
  const [selectedIssueNumber, setSelectedIssueNumber] = useState<number | null>(null);
  const [error, setLocalError] = useState<Error | null>(null);
  
  // Make Apollo client available for thunks
  useApolloClientSetup(client);

  // Check network connectivity
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('https://api.github.com', { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });
        store.dispatch(setNetworkStatus(response.ok));
      } catch (error) {
        store.dispatch(setNetworkStatus(false));
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary 
      error={error} 
      resetError={() => {
        setLocalError(null);
        store.dispatch(setError(null));
      }}
    >
      <NetworkStatus>
        <SafeAreaView style={[T.flex1, T.bgWhite]}>
          {selectedIssueNumber ? (
            <IssueDetailScreen 
              issueNumber={selectedIssueNumber} 
              onBack={() => setSelectedIssueNumber(null)} 
            />
          ) : (
            <IssuesScreen 
              onSelectIssue={(issueNumber) => setSelectedIssueNumber(issueNumber)} 
            />
          )}
        </SafeAreaView>
      </NetworkStatus>
    </ErrorBoundary>
  );
}

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <AppContent />
      </ApolloProvider>
    </Provider>
  );
}

export default App;
