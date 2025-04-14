// src/api/queries.ts
import { gql } from '@apollo/client';

// Query to search for issues in the React Native repository
// Parameters:
// - query: The search query string
// - first: Number of items to fetch (pagination)
// - after: Cursor for pagination
export const SEARCH_ISSUES = gql`
  query SearchIssues($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: ISSUE, first: $first, after: $after) {
      issueCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ... on Issue {
            id
            number
            title
            bodyText
            state
            createdAt
            author {
              login
              avatarUrl
            }
            comments {
              totalCount
            }
          }
        }
      }
    }
  }
`;

// Query to get a single issue with its comments
// Parameters:
// - owner: Repository owner (facebook)
// - name: Repository name (react-native)
// - number: Issue number
// - first: Number of comments to fetch
// - after: Cursor for comment pagination
export const GET_ISSUE = gql`
  query GetIssue(
    $owner: String!
    $name: String!
    $number: Int!
    $first: Int!
    $after: String
  ) {
    repository(owner: $owner, name: $name) {
      issue(number: $number) {
        id
        number
        title
        bodyText
        state
        createdAt
        author {
          login
          avatarUrl
        }
        comments(first: $first, after: $after) {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            id
            author {
              login
              avatarUrl
            }
            bodyText
            createdAt
          }
        }
      }
    }
  }
`;
