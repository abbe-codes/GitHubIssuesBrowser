import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setSearchQuery, setIssueState, clearIssues } from '../redux/slices/issuesSlice';
import { searchIssues } from '../redux/thunks';
import T from '../utils/tailwind';
import Button from './Button';

const SearchForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchParams, loading } = useAppSelector(state => state.issues);
  const [localQuery, setLocalQuery] = useState(searchParams.query);

  const handleSearch = () => {
    // Update the search query in Redux
    dispatch(setSearchQuery(localQuery));
    
    // Clear existing issues before new search
    dispatch(clearIssues());
    
    // Perform the search with current parameters
    dispatch(searchIssues({
      ...searchParams,
      query: localQuery,
      after: null, // Reset pagination for new search
    }));
  };

  const handleStateChange = (state: 'OPEN' | 'CLOSED' | 'ALL') => {
    // Update the issue state filter in Redux
    dispatch(setIssueState(state));
    
    // Clear existing issues before new search
    dispatch(clearIssues());
    
    // Perform the search with updated state
    dispatch(searchIssues({
      ...searchParams,
      state,
      after: null, // Reset pagination for new search
    }));
  };

  return (
    <View style={[T.p4, T.bgLight, T.roundedLg, T.mB4]}>
      <Text style={[T.textLg, T.fontBold, T.mB2]}>Search React Native Issues</Text>
      
      {/* Search input */}
      <View style={[T.mB4]}>
        <Text style={[T.textGray, T.fontMedium, T.mB1]}>Search in title and body</Text>
        <TextInput
          style={[T.pY2, T.pX3, T.roundedMd, T.bgWhite, T.borderGrayLight, T.border]}
          placeholder="Enter search terms..."
          value={localQuery}
          onChangeText={setLocalQuery}
          onSubmitEditing={handleSearch}
        />
      </View>
      
      {/* Status filter buttons */}
      <View style={[T.mB4]}>
        <Text style={[T.textGray, T.fontMedium, T.mB1]}>Filter by status</Text>
        <View style={[T.flexRow, T.justifyStart, T.spaceX2]}>
          <TouchableOpacity
            style={[
              T.pY2, 
              T.pX4, 
              T.roundedMd,
              searchParams.state === 'OPEN' ? T.bgSuccess : T.bgGrayLight,
            ]}
            onPress={() => handleStateChange('OPEN')}
          >
            <Text 
              style={[
                searchParams.state === 'OPEN' ? T.textWhite : T.textGray,
                T.fontMedium,
              ]}
            >
              Open
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              T.pY2, 
              T.pX4, 
              T.roundedMd,
              searchParams.state === 'CLOSED' ? T.bgDanger : T.bgGrayLight,
            ]}
            onPress={() => handleStateChange('CLOSED')}
          >
            <Text 
              style={[
                searchParams.state === 'CLOSED' ? T.textWhite : T.textGray,
                T.fontMedium,
              ]}
            >
              Closed
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              T.pY2, 
              T.pX4, 
              T.roundedMd,
              searchParams.state === 'ALL' ? T.bgPrimary : T.bgGrayLight,
            ]}
            onPress={() => handleStateChange('ALL')}
          >
            <Text 
              style={[
                searchParams.state === 'ALL' ? T.textWhite : T.textGray,
                T.fontMedium,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search button */}
      <Button
        title={loading ? "Searching..." : "Search Issues"}
        onPress={handleSearch}
        disabled={loading}
        variant="primary"
      />
    </View>
  );
};

export default SearchForm;
