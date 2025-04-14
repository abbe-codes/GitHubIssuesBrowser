// src/types/index.ts

// Define the structure of an issue from the GitHub API
export interface Issue {
  id: string;
  number: number;
  title: string;
  bodyText: string;
  state: 'OPEN' | 'CLOSED';
  createdAt: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  comments: {
    totalCount: number;
  };
}

// Define the structure of a comment from the GitHub API
export interface Comment {
  id: string;
  author: {
    login: string;
    avatarUrl: string;
  };
  bodyText: string;
  createdAt: string;
}

// Define the structure of pagination information
export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

// Define the structure of search parameters
export interface SearchParams {
  searchTerm: string;
  state: 'OPEN' | 'CLOSED' | '';
  searchIn: 'title' | 'body' | 'both';
}

// Define the structure of the Redux state for issues
export interface IssuesState {
  issues: Issue[];
  loading: boolean;
  error: string | null;
  pageInfo: PageInfo | null;
  searchParams: SearchParams;
  selectedIssue: {
    issue: Issue | null;
    comments: Comment[];
    commentsPageInfo: PageInfo | null;
    loading: boolean;
    error: string | null;
  };
}
