// src/screens/IssuesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { SEARCH_ISSUES } from '../api/queries';
import {
  setIssues,
  addIssues,
  setLoading,
  setError,
} from '../store/issuesSlice';
import { RootState } from '../store';
import { Issue } from '../types';
import SearchBar from '../components/SearchBar';
import IssueItem from '../components/IssueItem';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import tw from 'twrnc';

// Props type definition
type IssuesScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Issues'>;
};

// IssuesScreen component for displaying the list of issues
// This is the main screen of the app
const IssuesScreen = ({ navigation }: IssuesScreenProps) => {
  const dispatch = useDispatch();
  const { issues, loading, error, pageInfo, searchParams } = useSelector(
    (state: RootState) => state.issues
  );

  // Local state for pagination loading
  const [loadingMore, setLoadingMore] = useState(false);

  // Build the search query string based on search parameters
  const buildSearchQuery = () => {
    let query = 'repo:facebook/react-native';

    // Add state filter if selected
    if (searchParams.state) {
      query += ` state:${searchParams.state}`;
    }

    // Add search term with appropriate scope
    if (searchParams.searchTerm) {
      if (searchParams.searchIn === 'title') {
        query += ` in:title ${searchParams.searchTerm}`;
      } else if (searchParams.searchIn === 'body') {
        query += ` in:body ${searchParams.searchTerm}`;
      } else {
        // Both title and body
        query += ` ${searchParams.searchTerm}`;
      }
    }

    return query;
  };

  // Execute the GraphQL query
  const {
    loading: queryLoading,
    error: queryError,
    data,
    fetchMore,
  } = useQuery(SEARCH_ISSUES, {
    variables: {
      query: buildSearchQuery(),
      first: 10,
      after: null,
    },
    notifyOnNetworkStatusChange: true,
    // Skip initial query if search term is empty
    skip: false,
  });

  // Update Redux state when query data changes
  useEffect(() => {
    if (queryLoading && !loadingMore) {
      dispatch(setLoading(true));
    } else if (!queryLoading) {
      dispatch(setLoading(false));
      setLoadingMore(false);

      if (queryError) {
        dispatch(setError(queryError.message));
      } else if (data) {
        // Map the GraphQL response to our Issue type
        const fetchedIssues = data.search.edges.map(
          (edge: any) => edge.node as Issue
        );

        dispatch(
          setIssues({
            issues: fetchedIssues,
            pageInfo: data.search.pageInfo,
          })
        );
      }
    }
  }, [queryLoading, queryError, data, dispatch, loadingMore]);

  // Handle loading more issues (pagination)
  const handleLoadMore = () => {
    // Add console logs to debug
    console.log('Load more triggered');
    console.log('pageInfo:', pageInfo);
    console.log('loadingMore:', loadingMore);

    if (pageInfo?.hasNextPage && !loadingMore) {
      console.log('Starting to load more with cursor:', pageInfo.endCursor);
      setLoadingMore(true);

      fetchMore({
        variables: {
          query: buildSearchQuery(),
          first: 10,
          after: pageInfo.endCursor,
        },
      })
        .then((result) => {
          console.log('Fetch more result:', result);

          // Check if we have valid data
          if (result.data && result.data.search && result.data.search.edges) {
            // Map the new issues
            const newIssues = result.data.search.edges.map(
              (edge: any) => edge.node as Issue
            );

            console.log('New issues count:', newIssues.length);

            // Add the new issues to the existing list
            dispatch(
              addIssues({
                issues: newIssues,
                pageInfo: result.data.search.pageInfo,
              })
            );
          } else {
            console.log('Invalid data structure in fetchMore result');
            dispatch(
              setError('Failed to load more issues: Invalid data structure')
            );
          }

          setLoadingMore(false);
        })
        .catch((error) => {
          console.error('Error loading more:', error);
          setLoadingMore(false);
          dispatch(setError(error.message));
        });
    } else {
      console.log(
        'Not loading more: hasNextPage =',
        pageInfo?.hasNextPage,
        'loadingMore =',
        loadingMore
      );
    }
  };

  // Navigate to issue detail screen
  const handleIssuePress = (issueNumber: number) => {
    navigation.navigate('IssueDetail', { issueNumber });
  };

  // Render loading state
  if (loading && !loadingMore) {
    return <LoadingView message='Loading issues...' />;
  }

  // Render error state
  if (error && !loading) {
    return (
      <ErrorView
        message={`Error loading issues: ${error}`}
        onRetry={() => {
          dispatch(setError(null));
          // Refetch the query
          data?.refetch();
        }}
      />
    );
  }

  // Render the list of issues
  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Search bar */}
      <SearchBar />

      {/* Issues list */}
      <FlatList
        data={issues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IssueItem
            issue={item}
            onPress={() => handleIssuePress(item.number)}
          />
        )}
        // Pull to refresh
        refreshing={loading && !loadingMore}
        onRefresh={() => {
          dispatch(setLoading(true));
          data?.refetch();
        }}
        // Infinite scroll
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        // Footer with loading indicator for pagination
        ListFooterComponent={() =>
          loadingMore ? (
            <View style={tw`py-4 items-center`}>
              <ActivityIndicator size='small' color='#4299e1' />
              <Text style={tw`mt-2 text-gray-500`}>Loading more issues...</Text>
            </View>
          ) : null
        }
        // Empty state
        ListEmptyComponent={() =>
          !loading ? (
            <View style={tw`p-4 items-center justify-center`}>
              <Text style={tw`text-gray-500`}>
                No issues found. Try adjusting your search.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default IssuesScreen;
