import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { SEARCH_ISSUES, GET_ISSUE, GET_ISSUE_COMMENTS } from '../apollo/queries';
import { IssueSearchParams } from '../types/issue';

// Helper function to build the GitHub search query string
const buildSearchQuery = (params: IssueSearchParams): string => {
  const { query, state } = params;
  
  // Base query to search in the React Native repository
  let searchQuery = 'repo:facebook/react-native';
  
  // Add state filter if not ALL
  if (state !== 'ALL') {
    searchQuery += ` state:${state}`;
  }
  
  // Add text search if provided
  if (query) {
    searchQuery += ` ${query} in:title,body`;
  }
  
  return searchQuery;
};

// Async thunk to search for issues
export const searchIssues = createAsyncThunk(
  'issues/searchIssues',
  async (params: IssueSearchParams, { getState, rejectWithValue }) => {
    try {
      // Get the Apollo client from the window object
      // In a real app, you would inject this properly
      const client = (window as any).__APOLLO_CLIENT__ as ApolloClient<NormalizedCacheObject>;
      
      const searchQuery = buildSearchQuery(params);
      
      const { data } = await client.query({
        query: SEARCH_ISSUES,
        variables: {
          query: searchQuery,
          first: params.first,
          after: params.after || null,
        },
      });
      
      return {
        issues: data.search.nodes,
        totalCount: data.search.issueCount,
        pageInfo: data.search.pageInfo,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk to get a single issue by number
export const getIssueByNumber = createAsyncThunk(
  'issues/getIssueByNumber',
  async (issueNumber: number, { getState, rejectWithValue }) => {
    try {
      // Get the Apollo client from the window object
      const client = (window as any).__APOLLO_CLIENT__ as ApolloClient<NormalizedCacheObject>;
      
      const { data } = await client.query({
        query: GET_ISSUE,
        variables: {
          owner: 'facebook',
          name: 'react-native',
          number: issueNumber,
        },
      });
      
      return data.repository.issue;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Async thunk to get issue comments with pagination
export const getIssueComments = createAsyncThunk(
  'issues/getIssueComments',
  async (
    { issueNumber, first, after }: { issueNumber: number; first: number; after?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      // Get the Apollo client from the window object
      const client = (window as any).__APOLLO_CLIENT__ as ApolloClient<NormalizedCacheObject>;
      
      const { data } = await client.query({
        query: GET_ISSUE_COMMENTS,
        variables: {
          owner: 'facebook',
          name: 'react-native',
          number: issueNumber,
          first,
          after: after || null,
        },
      });
      
      return {
        comments: data.repository.issue.comments.nodes,
        pageInfo: data.repository.issue.comments.pageInfo,
        totalCount: data.repository.issue.comments.totalCount,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
