import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { searchIssues } from '../redux/thunks';
import { GitHubApiError, useGitHubApiError, useGitHubApiLoading, formatDate } from '../utils/githubApi';
import T from '../utils/tailwind';
import ListItem from './ListItem';
import Button from './Button';

interface IssuesListProps {
  onSelectIssue: (issueNumber: number) => void;
}

const IssuesList: React.FC<IssuesListProps> = ({ onSelectIssue }) => {
  const dispatch = useAppDispatch();
  const { issues, totalCount, pageInfo, searchParams, loading } = useAppSelector(state => state.issues);
  const { hasError, errorMessage } = useGitHubApiError();
  
  // Initial search when component mounts
  useEffect(() => {
    if (issues.length === 0) {
      dispatch(searchIssues(searchParams));
    }
  }, []);

  // Handle loading more issues (pagination)
  const handleLoadMore = () => {
    if (pageInfo.hasNextPage && !loading) {
      dispatch(searchIssues({
        ...searchParams,
        after: pageInfo.endCursor,
      }));
    }
  };

  // Render empty state
  if (issues.length === 0 && !loading && !hasError) {
    return (
      <View style={[T.p4, T.itemsCenter, T.justifyCenter, T.mY4]}>
        <Text style={[T.textLg, T.textGray, T.textCenter]}>
          No issues found. Try adjusting your search criteria.
        </Text>
      </View>
    );
  }

  return (
    <View style={[T.flex1]}>
      {/* Results count */}
      <View style={[T.p4, T.borderB, T.borderGrayLight]}>
        <Text style={[T.textBase, T.textGray]}>
          Found {totalCount} {totalCount === 1 ? 'issue' : 'issues'}
        </Text>
      </View>

      {/* Error message */}
      {hasError && <GitHubApiError message={errorMessage} />}

      {/* Issues list */}
      <FlatList
        data={issues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            title={item.title}
            subtitle={`#${item.number} opened on ${formatDate(item.createdAt)} by ${item.author.login}`}
            status={item.state}
            onPress={() => onSelectIssue(item.number)}
          />
        )}
        ListFooterComponent={() => (
          <View style={[T.p4, T.itemsCenter]}>
            {loading ? (
              <ActivityIndicator size="large" color="#0366d6" />
            ) : pageInfo.hasNextPage ? (
              <Button
                title="Load More"
                onPress={handleLoadMore}
                variant="outline"
              />
            ) : issues.length > 0 ? (
              <Text style={[T.textGray, T.textCenter]}>
                No more issues to load
              </Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

export default IssuesList;
