// src/components/CommentItem.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { Comment } from '../types';
import tw from 'twrnc';

// Props type definition
interface CommentItemProps {
  comment: Comment;
}

// CommentItem component for displaying a single comment
// This renders each comment with its author and content
const CommentItem = ({ comment }: CommentItemProps) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <View style={tw`p-4 border-b border-gray-200 bg-white`}>
      {/* Comment header with author info */}
      <View style={tw`flex-row items-center mb-2`}>
        {/* Author avatar */}
        <Image
          source={{ uri: comment.author.avatarUrl }}
          style={tw`w-8 h-8 rounded-full mr-2`}
        />

        <View>
          {/* Author name */}
          <Text style={tw`font-bold`}>{comment.author.login}</Text>

          {/* Comment date */}
          <Text style={tw`text-gray-500 text-xs`}>
            {formatDate(comment.createdAt)}
          </Text>
        </View>
      </View>

      {/* Comment body */}
      <Text style={tw`text-gray-800`}>{comment.bodyText}</Text>
    </View>
  );
};

export default CommentItem;
