import React from 'react';
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import { useAppSelector } from '../redux/hooks';
import T from '../utils/tailwind';
import SearchForm from '../components/SearchForm';
import IssuesList from '../components/IssuesList';
import { useGitHubApiLoading } from '../utils/githubApi';

interface IssuesScreenProps {
  onSelectIssue: (issueNumber: number) => void;
}

const IssuesScreen: React.FC<IssuesScreenProps> = ({ onSelectIssue }) => {
  const isLoading = useGitHubApiLoading();
  const { totalCount } = useAppSelector(state => state.issues);

  return (
    <SafeAreaView style={[T.flex1, T.bgWhite]}>
      <View style={[T.p4, T.borderB, T.borderGrayLight]}>
        <Text style={[T.text2Xl, T.fontBold, T.textDark]}>GitHub Issues Browser</Text>
        <Text style={[T.textBase, T.textGray]}>React Native Repository</Text>
      </View>
      
      <ScrollView style={[T.flex1]}>
        <View style={[T.p4]}>
          <SearchForm />
          
          {isLoading && totalCount === 0 ? (
            <View style={[T.p4, T.itemsCenter, T.justifyCenter]}>
              <Text style={[T.textLg, T.textGray]}>Loading issues...</Text>
            </View>
          ) : (
            <IssuesList onSelectIssue={onSelectIssue} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IssuesScreen;
