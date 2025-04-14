// src/api/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GITHUB_TOKEN } from '@env';

// Create an HTTP link to the GitHub GraphQL API
// This establishes the connection to GitHub's GraphQL endpoint
const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

// Set up authentication with GitHub token
// This adds the authorization header to every request
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : '',
    },
  };
});

// Create the Apollo Client instance
// Combines the auth link and HTTP link, and sets up the cache
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
