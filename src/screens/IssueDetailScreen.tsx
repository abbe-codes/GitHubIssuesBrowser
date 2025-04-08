import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getIssueByNumber, getIssueComments } from '../redux/thunks';
import { setSelectedIssue } from '../redux/slices/issuesSlice';
import T from '../utils/tailwind';
import Button from '../components/Button';
import { GitHubApiError, useGitHubApiError, formatDate } from '../utils/githubApi';
import ListItem from '../components/ListItem';

interface IssueDetailScreenProps {
  issueNumber: number;
  onBack: () => void;
}

const IssueDetailScreen: React.FC<IssueDetailScreenProps> = ({ 
  issueNumber,
  onBack
}) => {
  const dispatch = useAppDispatch();
  const { selectedIssue, loading, comments } = useAppSelector(state => state.issues);
  const { hasError, errorMessage } = useGitHubApiError();

  // Fetch issue details when component mounts
  React.useEffect(() => {
    dispatch(getIssueByNumber(issueNumber));
    
    // Fetch initial comments
    dispatch(getIssueComments({
      issueNumber,
      first: 10
    }));
    
    // Cleanup when unmounting
    return () => {
      dispatch(setSelectedIssue(null));
    };
  }, [issueNumber, dispatch]);

  // Handle loading more comments
  const handleLoadMoreComments = () => {
    if (comments.pageInfo.hasNextPage) {
      dispatch(getIssueComments({
        issueNumber,
        first: 10,
        after: comments.pageInfo.endCursor
      }));
    }
  };

  if (loading && !selectedIssue) {
    return (
      <View style={[T.flex1, T.itemsCenter, T.justifyCenter]}>
        <ActivityIndicator size="large" color="#0366d6" />
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={[T.p4]}>
        <Button title="Back to Issues" onPress={onBack} variant="outline" />
        <GitHubApiError message={errorMessage} />
      </View>
    );
  }

  if (!selectedIssue) {
    return (
      <View style={[T.p4]}>
        <Button title="Back to Issues" onPress={onBack} variant="outline" />
        <Text style={[T.textLg, T.textCenter, T.mT4]}>Issue not found</Text>
      </View>
    );
  }

  return (
    <View style={[T.flex1, T.bgWhite]}>
      {/* Header */}
      <View style={[T.p4, T.borderB, T.borderGrayLight]}>
        <Button title="Back to Issues" onPress={onBack} variant="outline" />
        
        <View style={[T.mT4]}>
          <View style={[T.flexRow, T.itemsCenter, T.mB2]}>
            <View style={[
              T.pY1, 
              T.pX2, 
              T.roundedFull, 
              selectedIssue.state === 'OPEN' ? T.bgSuccess : T.bgDanger
            ]}>
              <Text style={[T.textWhite, T.textXs, T.fontMedium]}>
                {selectedIssue.state}
              </Text>
            </View>
            <Text style={[T.textSm, T.textGray, T.mL2]}>
              #{selectedIssue.number}
            </Text>
          </View>
          
          <Text style={[T.text2Xl, T.fontBold, T.textDark]}>
            {selectedIssue.title}
          </Text>
          
          <Text style={[T.textSm, T.textGray, T.mT2]}>
            Opened by {selectedIssue.author.login} on {formatDate(selectedIssue.createdAt)}
          </Text>
        </View>
      </View>
      
      {/* Issue body */}
      <ScrollView style={[T.flex1]}>
        <View style={[T.p4, T.borderB, T.borderGrayLight]}>
          <Text style={[T.textBase, T.textDark]}>
            {selectedIssue.bodyText}
          </Text>
        </View>
        
        {/* Comments section */}
        <View style={[T.p4]}>
          <Text style={[T.textLg, T.fontBold, T.textDark, T.mB4]}>
            Comments ({comments.totalCount})
          </Text>
          
          {comments.loading && comments.data.length === 0 ? (
            <ActivityIndicator size="small" color="#0366d6" />
          ) : comments.data.length === 0 ? (
            <Text style={[T.textBase, T.textGray, T.textCenter]}>
              No comments on this issue
            </Text>
          ) : (
            <>
              {comments.data.map(comment => (
                <View key={comment.id} style={[T.p4, T.borderB, T.borderGrayLight, T.mB4]}>
                  <View style={[T.flexRow, T.itemsCenter, T.mB2]}>
                    <Text style={[T.fontBold, T.textDark]}>
                      {comment.author.login}
                    </Text>
                    <Text style={[T.textSm, T.textGray, T.mL2]}>
                      {formatDate(comment.createdAt)}
                    </Text>
                  </View>
                  <Text style={[T.textBase, T.textDark]}>
                    {comment.bodyText}
                  </Text>
                </View>
              ))}
              
              {/* Load more comments button */}
              {comments.pageInfo.hasNextPage && (
                <View style={[T.mT4, T.itemsCenter]}>
                  <Button
                    title={comments.loading ? "Loading more..." : "Load More Comments"}
                    onPress={handleLoadMoreComments}
                    disabled={comments.loading}
                    variant="outline"
                  />
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default IssueDetailScreen;
