// src/store/issuesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IssuesState, Issue, Comment, PageInfo, SearchParams } from '../types';

// Initial state for the issues slice
// This defines the starting point for our Redux store
const initialState: IssuesState = {
  issues: [],
  loading: false,
  error: null,
  pageInfo: null,
  searchParams: {
    searchTerm: '',
    state: '',
    searchIn: 'both',
  },
  selectedIssue: {
    issue: null,
    comments: [],
    commentsPageInfo: null,
    loading: false,
    error: null,
  },
};

// Create a Redux slice for issues
// This handles all the state updates related to issues
const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    // Set loading state when fetching issues
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state when an error occurs
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Update issues list with new data
    setIssues: (
      state,
      action: PayloadAction<{ issues: Issue[]; pageInfo: PageInfo }>
    ) => {
      state.issues = action.payload.issues;
      state.pageInfo = action.payload.pageInfo;
    },

    // Add more issues to the existing list (for pagination)
    addIssues: (
      state,
      action: PayloadAction<{ issues: Issue[]; pageInfo: PageInfo }>
    ) => {
      console.log('Adding issues to state:', action.payload.issues.length);
      state.issues = [...state.issues, ...action.payload.issues];
      state.pageInfo = action.payload.pageInfo;
      console.log('New state issues count:', state.issues.length);
    },

    // Update search parameters
    setSearchParams: (state, action: PayloadAction<SearchParams>) => {
      state.searchParams = action.payload;
    },

    // Set loading state for selected issue
    setSelectedIssueLoading: (state, action: PayloadAction<boolean>) => {
      state.selectedIssue.loading = action.payload;
    },

    // Set error state for selected issue
    setSelectedIssueError: (state, action: PayloadAction<string | null>) => {
      state.selectedIssue.error = action.payload;
    },

    // Update selected issue data
    setSelectedIssue: (
      state,
      action: PayloadAction<{
        issue: Issue;
        comments: Comment[];
        pageInfo: PageInfo;
      }>
    ) => {
      state.selectedIssue.issue = action.payload.issue;
      state.selectedIssue.comments = action.payload.comments;
      state.selectedIssue.commentsPageInfo = action.payload.pageInfo;
    },

    // Add more comments to the existing list (for pagination)
    addComments: (
      state,
      action: PayloadAction<{
        comments: Comment[];
        pageInfo: PageInfo;
      }>
    ) => {
      state.selectedIssue.comments = [
        ...state.selectedIssue.comments,
        ...action.payload.comments,
      ];
      state.selectedIssue.commentsPageInfo = action.payload.pageInfo;
    },

    // Clear selected issue data
    clearSelectedIssue: (state) => {
      state.selectedIssue = {
        issue: null,
        comments: [],
        commentsPageInfo: null,
        loading: false,
        error: null,
      };
    },
  },
});

// Export actions and reducer
export const {
  setLoading,
  setError,
  setIssues,
  addIssues,
  setSearchParams,
  setSelectedIssueLoading,
  setSelectedIssueError,
  setSelectedIssue,
  addComments,
  clearSelectedIssue,
} = issuesSlice.actions;

export default issuesSlice.reducer;
