// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchParams } from '../store/issuesSlice';
import { RootState } from '../store';
import tw from 'twrnc';

// SearchBar component for filtering issues
// This allows users to search for issues by text and state
const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchParams } = useSelector((state: RootState) => state.issues);

  // Local state for form inputs
  const [localSearchTerm, setLocalSearchTerm] = useState(
    searchParams.searchTerm
  );
  const [localState, setLocalState] = useState<'OPEN' | 'CLOSED' | ''>(
    searchParams.state
  );
  const [localSearchIn, setLocalSearchIn] = useState<'title' | 'body' | 'both'>(
    searchParams.searchIn
  );

  // Handle search submission
  const handleSearch = () => {
    dispatch(
      setSearchParams({
        searchTerm: localSearchTerm,
        state: localState,
        searchIn: localSearchIn,
      })
    );
  };

  return (
    <View style={tw`p-4 bg-gray-100`}>
      {/* Search input field */}
      <TextInput
        style={tw`border border-gray-300 rounded-md p-2 mb-2 bg-white`}
        placeholder='Search issues...'
        value={localSearchTerm}
        onChangeText={setLocalSearchTerm}
        onSubmitEditing={handleSearch}
      />

      {/* State filter buttons */}
      <View style={tw`flex-row mb-2`}>
        <Text style={tw`mr-2 self-center`}>Status:</Text>
        <TouchableOpacity
          style={tw`${
            localState === '' ? 'bg-blue-500' : 'bg-gray-300'
          } px-3 py-1 rounded-md mr-2`}
          onPress={() => setLocalState('')}
        >
          <Text style={tw`${localState === '' ? 'text-white' : 'text-black'}`}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`${
            localState === 'OPEN' ? 'bg-blue-500' : 'bg-gray-300'
          } px-3 py-1 rounded-md mr-2`}
          onPress={() => setLocalState('OPEN')}
        >
          <Text
            style={tw`${localState === 'OPEN' ? 'text-white' : 'text-black'}`}
          >
            Open
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`${
            localState === 'CLOSED' ? 'bg-blue-500' : 'bg-gray-300'
          } px-3 py-1 rounded-md`}
          onPress={() => setLocalState('CLOSED')}
        >
          <Text
            style={tw`${localState === 'CLOSED' ? 'text-white' : 'text-black'}`}
          >
            Closed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search location filter buttons */}
      <View style={tw`flex-row mb-4`}>
        <Text style={tw`mr-2 self-center`}>Search in:</Text>
        <TouchableOpacity
          style={tw`${
            localSearchIn === 'title' ? 'bg-blue-500' : 'bg-gray-300'
          } px-3 py-1 rounded-md mr-2`}
          onPress={() => setLocalSearchIn('title')}
        >
          <Text
            style={tw`${
              localSearchIn === 'title' ? 'text-white' : 'text-black'
            }`}
          >
            Title
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`${
            localSearchIn === 'body' ? 'bg-blue-500' : 'bg-gray-300'
          } px-3 py-1 rounded-md mr-2`}
          onPress={() => setLocalSearchIn('body')}
        >
          <Text
            style={tw`${
              localSearchIn === 'body' ? 'text-white' : 'text-black'
            }`}
          >
            Body
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`${
            localSearchIn === 'both' ? 'bg-blue-500' : 'bg-gray-300'
          } px-3 py-1 rounded-md`}
          onPress={() => setLocalSearchIn('both')}
        >
          <Text
            style={tw`${
              localSearchIn === 'both' ? 'text-white' : 'text-black'
            }`}
          >
            Both
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search button */}
      <TouchableOpacity
        style={tw`bg-blue-500 p-2 rounded-md`}
        onPress={handleSearch}
      >
        <Text style={tw`text-white text-center font-bold`}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
