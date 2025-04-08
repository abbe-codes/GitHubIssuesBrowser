# GitHub Issues Browser

A React Native application for browsing issues from the React Native repository using GitHub's GraphQL API.

## Features

- Search for issues by text in title and body
- Filter issues by status (OPEN/CLOSED/ALL)
- View issue details and comments
- Pagination for both issues list and comments
- Error handling and offline detection
- TypeScript for type safety
- Redux for state management
- Apollo Client for GraphQL integration
- Tailwind CSS for styling

## Project Structure

```
src/
├── apollo/           # Apollo Client setup and GraphQL queries
├── components/       # Reusable UI components
├── redux/            # Redux store, slices, and thunks
│   ├── slices/       # Redux slices for state management
│   ├── hooks.ts      # Custom Redux hooks
│   ├── store.ts      # Redux store configuration
│   └── thunks.ts     # Async thunks for API calls
├── screens/          # Screen components
├── types/            # TypeScript interfaces
└── utils/            # Utility functions and hooks
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Add your GitHub personal access token:
   - Open `src/apollo/apolloClient.tsx`
   - Replace `YOUR_GITHUB_TOKEN` with your GitHub personal access token

4. Run the application:
   ```
   npx react-native run-android
   # or
   npx react-native run-ios
   ```

## Implementation Details

### State Management

The application uses Redux with Redux Toolkit for state management. The main slices are:

- `issuesSlice`: Manages issues data, search parameters, and pagination
- `uiSlice`: Manages UI state like loading and errors
- `networkSlice`: Manages network connectivity status

### API Integration

GitHub's GraphQL API is integrated using Apollo Client. The main queries are:

- `SEARCH_ISSUES`: Search for issues with pagination
- `GET_ISSUE`: Get a single issue by number
- `GET_ISSUE_COMMENTS`: Get comments for an issue with pagination

### Navigation

The application uses a simple state-based navigation system:

- `IssuesScreen`: Displays the search form and issues list
- `IssueDetailScreen`: Displays the details of a selected issue and its comments

### Error Handling

The application includes comprehensive error handling:

- `ErrorBoundary`: Catches and displays React component errors
- `NetworkStatus`: Detects and handles network connectivity issues
- Redux error states: Manages API errors and displays appropriate messages

### Styling

The application uses react-native-tailwindcss for styling, with a custom theme that matches GitHub's colors.

## Future Improvements

- Add unit tests for components and Redux logic
- Implement E2E testing with a framework like Detox
- Add authentication flow for user-specific actions
- Improve offline support with local caching
- Add dark mode support
