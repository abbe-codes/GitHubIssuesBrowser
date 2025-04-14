// src/components/IssueItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Issue } from '../types';
import tw from 'twrnc';

// Props type definition
interface IssueItemProps {
  issue: Issue;
  onPress: () => void;
}

// IssueItem component for displaying a single issue in the list
const IssueItem = ({ issue, onPress }: IssueItemProps) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={tw`p-4 border-b border-gray-200 bg-white`}
      onPress={onPress}
    >
      <View style={tw`flex-row justify-between items-start`}>
        {/* Issue title and number */}
        <View style={tw`flex-1 mr-2`}>
          <Text style={tw`font-bold text-lg`}>
            #{issue.number} {issue.title || 'Untitled Issue'}
          </Text>

          {/* Issue metadata */}
          <View style={tw`flex-row items-center mt-1`}>
            {/* Author avatar */}
            {issue.author ? (
              <Image
                source={{ uri: issue.author.avatarUrl }}
                style={tw`w-5 h-5 rounded-full mr-2`}
              />
            ) : (
              <View style={tw`w-5 h-5 bg-gray-300 rounded-full mr-2`} />
            )}

            {/* Author name */}
            <Text style={tw`text-gray-600 mr-2`}>
              {issue.author ? issue.author.login : 'Unknown user'}
            </Text>

            {/* Creation date */}
            <Text style={tw`text-gray-600`}>
              {issue.createdAt ? formatDate(issue.createdAt) : 'Unknown date'}
            </Text>
          </View>

          {/* Comment count */}
          <Text style={tw`text-gray-500 mt-1`}>
            {issue.comments
              ? `${issue.comments.totalCount} comments`
              : '0 comments'}
          </Text>
        </View>

        {/* Issue state badge */}
        <View
          style={tw`${
            issue.state === 'OPEN' ? 'bg-green-100' : 'bg-red-100'
          } px-2 py-1 rounded-md`}
        >
          <Text
            style={tw`${
              issue.state === 'OPEN' ? 'text-green-800' : 'text-red-800'
            } font-medium`}
          >
            {issue.state || 'UNKNOWN'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default IssueItem;
