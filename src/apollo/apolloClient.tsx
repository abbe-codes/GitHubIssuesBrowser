import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create an HTTP link to the GitHub GraphQL API
const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

// Add authentication to the request headers
const authLink = setContext((_, { headers }) => {
  // Note: In a real app, you would store this token securely
  // For this challenge, we'll use a constant token
  // You would need to replace this with a valid GitHub token
  const token = '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';
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create the Apollo Client
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

interface ApolloProviderWrapperProps {
  children: React.ReactNode;
}

// Create a wrapper component for Apollo Provider
const ApolloProviderWrapper: React.FC<ApolloProviderWrapperProps> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
};

export default ApolloProviderWrapper;
