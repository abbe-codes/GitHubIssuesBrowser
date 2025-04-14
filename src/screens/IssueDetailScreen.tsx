// src/screens/IssueDetailScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ISSUE } from '../api/queries';
import {
  setSelectedIssue,
  setSelectedIssueLoading,
  setSelectedIssueError,
  addComments,
  clearSelectedIssue,
} from '../store/issuesSlice';
import { RootState } from '../store';
import { Comment } from '../types';
import CommentItem from '../components/CommentItem';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import tw from 'twrnc';

// Props type definition
type IssueDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'IssueDetail'>;
  navigation: StackNavigationProp<RootStackParamList, 'IssueDetail'>;
};

// IssueDetailScreen component for displaying a single issue and its comments
// This screen shows the details of an issue and allows viewing comments
const IssueDetailScreen = ({ route, navigation }: IssueDetailScreenProps) => {
  const { issueNumber } = route.params;
  const dispatch = useDispatch();
  const { selectedIssue } = useSelector((state: RootState) => state.issues);
  const { issue, comments, commentsPageInfo, loading, error } = selectedIssue;

  // Local state for pagination loading
  const [loadingMoreComments, setLoadingMoreComments] = React.useState(false);

  // Execute the GraphQL query to get issue details
  const {
    loading: queryLoading,
    error: queryError,
    data,
    fetchMore,
  } = useQuery(GET_ISSUE, {
    variables: {
      owner: 'facebook',
      name: 'react-native',
      number: issueNumber,
      first: 10,
      after: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  // Update Redux state when query data changes
  useEffect(() => {
    if (queryLoading && !loadingMoreComments) {
      dispatch(setSelectedIssueLoading(true));
    } else if (!queryLoading) {
      dispatch(setSelectedIssueLoading(false));
      setLoadingMoreComments(false);

      if (queryError) {
        dispatch(setSelectedIssueError(queryError.message));
      } else if (data && data.repository && data.repository.issue) {
        const issueData = data.repository.issue;

        // Set the issue title in the navigation header
        navigation.setOptions({
          title: `#${issueNumber}: ${issueData.title.substring(0, 20)}${
            issueData.title.length > 20 ? '...' : ''
          }`,
        });

        // Map the comments from the GraphQL response
        const commentsData = issueData.comments.nodes.map(
          (node: any) => node as Comment
        );

        // Update the Redux state with the issue and comments
        dispatch(
          setSelectedIssue({
            issue: {
              id: issueData.id,
              number: issueData.number,
              title: issueData.title,
              bodyText: issueData.bodyText,
              state: issueData.state,
              createdAt: issueData.createdAt,
              author: issueData.author,
              comments: {
                totalCount: issueData.comments.totalCount,
              },
            },
            comments: commentsData,
            pageInfo: issueData.comments.pageInfo,
          })
        );
      }
    }
  }, [
    queryLoading,
    queryError,
    data,
    dispatch,
    navigation,
    issueNumber,
    loadingMoreComments,
  ]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSelectedIssue());
    };
  }, [dispatch]);

  // Handle loading more comments (pagination)
  const handleLoadMoreComments = () => {
    if (commentsPageInfo?.hasNextPage && !loadingMoreComments) {
      setLoadingMoreComments(true);

      fetchMore({
        variables: {
          after: commentsPageInfo.endCursor,
        },
      })
        .then((result) => {
          // Map the new comments
          const newComments = result.data.repository.issue.comments.nodes.map(
            (node: any) => node as Comment
          );

          // Add the new comments to the existing list
          dispatch(
            addComments({
              comments: newComments,
              pageInfo: result.data.repository.issue.comments.pageInfo,
            })
          );

          setLoadingMoreComments(false);
        })
        .catch((error) => {
          setLoadingMoreComments(false);
          dispatch(setSelectedIssueError(error.message));
        });
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Render loading state
  if (loading && !loadingMoreComments) {
    return <LoadingView message='Loading issue details...' />;
  }

  // Render error state
  if (error && !loading) {
    return (
      <ErrorView
        message={`Error loading issue: ${error}`}
        onRetry={() => {
          dispatch(setSelectedIssueError(null));
          // Refetch the query
          data?.refetch();
        }}
      />
    );
  }

  // Render the issue details and comments
  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {issue && (
        <>
          {/* Issue details */}
          <ScrollView style={tw`p-4 bg-white mb-2`}>
            {/* Issue title */}
            <Text style={tw`text-xl font-bold mb-2`}>
              #{issue.number} {issue.title}
            </Text>

            {/* Issue metadata */}
            <View style={tw`flex-row items-center mb-2`}>
              <Text style={tw`text-gray-600 mr-2`}>
                By {issue.author.login}
              </Text>
              <Text style={tw`text-gray-600`}>
                on {formatDate(issue.createdAt)}
              </Text>
            </View>

            {/* Issue state */}
            <View
              style={tw`${
                issue.state === 'OPEN' ? 'bg-green-100' : 'bg-red-100'
              } self-start px-2 py-1 rounded-md mb-4`}
            >
              <Text
                style={tw`${
                  issue.state === 'OPEN' ? 'text-green-800' : 'text-red-800'
                } font-medium`}
              >
                {issue.state}
              </Text>
            </View>

            {/* Issue body */}
            <Text style={tw`text-gray-800 mb-4`}>{issue.bodyText}</Text>
          </ScrollView>

          {/* Comments section */}
          <View style={tw`flex-1`}>
            {/* Comments header */}
            <View
              style={tw`px-4 py-2 bg-gray-200 flex-row justify-between items-center`}
            >
              <Text style={tw`font-bold`}>
                Comments ({issue.comments.totalCount})
              </Text>
            </View>

            {/* Comments list */}
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <CommentItem comment={item} />}
              // Infinite scroll
              onEndReached={handleLoadMoreComments}
              onEndReachedThreshold={0.5}
              // Footer with loading indicator for pagination
              ListFooterComponent={() =>
                loadingMoreComments ? (
                  <View style={tw`py-4 items-center`}>
                    <ActivityIndicator size='small' color='#4299e1' />
                  </View>
                ) : null
              }
              // Empty state
              ListEmptyComponent={() =>
                !loading ? (
                  <View style={tw`p-4 items-center justify-center`}>
                    <Text style={tw`text-gray-500`}>
                      No comments on this issue.
                    </Text>
                  </View>
                ) : null
              }
            />
          </View>
        </>
      )}
    </View>
  );
};

export default IssueDetailScreen;
