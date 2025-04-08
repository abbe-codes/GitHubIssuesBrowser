export interface User {
  login: string;
  avatarUrl: string;
  url: string;
}

export interface Comment {
  id: string;
  author: User;
  bodyText: string;
  createdAt: string;
  url: string;
}

export interface Issue {
  id: string;
  number: number;
  title: string;
  bodyText: string;
  state: 'OPEN' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  url: string;
  author: User;
  comments: {
    totalCount: number;
    nodes: Comment[];
  };
}

export interface IssueConnection {
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  nodes: Issue[];
}

export interface IssueSearchParams {
  query: string;
  state: 'OPEN' | 'CLOSED' | 'ALL';
  first: number;
  after?: string | null;
}
