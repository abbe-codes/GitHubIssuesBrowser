import { gql } from '@apollo/client';

// Fragment for issue fields to reuse in queries
export const ISSUE_FRAGMENT = gql`
  fragment IssueFields on Issue {
    id
    number
    title
    bodyText
    state
    createdAt
    updatedAt
    url
    author {
      login
      avatarUrl
      url
    }
    comments(first: 10) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        author {
          login
          avatarUrl
          url
        }
        bodyText
        createdAt
        url
      }
    }
  }
`;

// Query to search for issues in the React Native repository
export const SEARCH_ISSUES = gql`
  query SearchIssues($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: ISSUE, first: $first, after: $after) {
      issueCount
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ...IssueFields
      }
    }
  }
  ${ISSUE_FRAGMENT}
`;

// Query to get a single issue by number
export const GET_ISSUE = gql`
  query GetIssue($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
      issue(number: $number) {
        ...IssueFields
      }
    }
  }
  ${ISSUE_FRAGMENT}
`;

// Query to get issue comments with pagination
export const GET_ISSUE_COMMENTS = gql`
  query GetIssueComments($owner: String!, $name: String!, $number: Int!, $first: Int!, $after: String) {
    repository(owner: $owner, name: $name) {
      issue(number: $number) {
        id
        comments(first: $first, after: $after) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            author {
              login
              avatarUrl
              url
            }
            bodyText
            createdAt
            url
          }
        }
      }
    }
  }
`;
