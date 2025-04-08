import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Issue, IssueConnection, IssueSearchParams } from '../../types/issue';
import { searchIssues, getIssueByNumber, getIssueComments } from '../thunks';

interface IssuesState {
  issues: Issue[];
  selectedIssue: Issue | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  searchParams: IssueSearchParams;
  comments: {
    data: any[];
    loading: boolean;
    error: string | null;
    totalCount: number;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

const initialState: IssuesState = {
  issues: [],
  selectedIssue: null,
  loading: false,
  error: null,
  totalCount: 0,
  pageInfo: {
    hasNextPage: false,
    endCursor: null,
  },
  searchParams: {
    query: '',
    state: 'OPEN',
    first: 10,
    after: null,
  },
  comments: {
    data: [],
    loading: false,
    error: null,
    totalCount: 0,
    pageInfo: {
      hasNextPage: false,
      endCursor: null,
    },
  },
};

export const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchParams.query = action.payload;
    },
    setIssueState: (state, action: PayloadAction<'OPEN' | 'CLOSED' | 'ALL'>) => {
      state.searchParams.state = action.payload;
    },
    setSelectedIssue: (state, action: PayloadAction<Issue | null>) => {
      state.selectedIssue = action.payload;
    },
    clearIssues: (state) => {
      state.issues = [];
      state.pageInfo = {
        hasNextPage: false,
        endCursor: null,
      };
    },
    clearComments: (state) => {
      state.comments.data = [];
      state.comments.pageInfo = {
        hasNextPage: false,
        endCursor: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Handle searchIssues thunk
    builder
      .addCase(searchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchIssues.fulfilled, (state, action) => {
        state.loading = false;
        
        // If this is a new search (not pagination), replace the issues
        if (!state.searchParams.after) {
          state.issues = action.payload.issues;
        } else {
          // Otherwise append the new issues
          state.issues = [...state.issues, ...action.payload.issues];
        }
        
        state.totalCount = action.payload.totalCount;
        state.pageInfo = action.payload.pageInfo;
        
        // Update the after cursor for pagination
        state.searchParams.after = action.payload.pageInfo.endCursor;
      })
      .addCase(searchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle getIssueByNumber thunk
    builder
      .addCase(getIssueByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIssueByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedIssue = action.payload;
      })
      .addCase(getIssueByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle getIssueComments thunk
    builder
      .addCase(getIssueComments.pending, (state) => {
        state.comments.loading = true;
        state.comments.error = null;
      })
      .addCase(getIssueComments.fulfilled, (state, action) => {
        state.comments.loading = false;
        
        // If this is a new fetch (not pagination), replace the comments
        if (!action.meta.arg.after) {
          state.comments.data = action.payload.comments;
        } else {
          // Otherwise append the new comments
          state.comments.data = [...state.comments.data, ...action.payload.comments];
        }
        
        state.comments.totalCount = action.payload.totalCount;
        state.comments.pageInfo = action.payload.pageInfo;
      })
      .addCase(getIssueComments.rejected, (state, action) => {
        state.comments.loading = false;
        state.comments.error = action.payload as string;
      });
  },
});

export const { 
  setSearchQuery, 
  setIssueState, 
  setSelectedIssue, 
  clearIssues,
  clearComments 
} = issuesSlice.actions;

export default issuesSlice.reducer;
