// __tests__/IssueItem.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import IssueItem from '../src/components/IssueItem';

// Mock issue data
const mockIssue = {
  id: '1',
  number: 123,
  title: 'Test Issue',
  bodyText: 'This is a test issue',
  state: 'OPEN' as const,
  createdAt: '2023-01-01T00:00:00Z',
  author: {
    login: 'testuser',
    avatarUrl: 'https://example.com/avatar.png',
  },
  comments: {
    totalCount: 5,
  },
};

// Mock onPress function
const mockOnPress = jest.fn();

describe('IssueItem', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <IssueItem issue={mockIssue} onPress={mockOnPress} />
    );

    // Check if issue title is rendered
    expect(getByText(`#${mockIssue.number} ${mockIssue.title}`)).toBeTruthy();

    // Check if author name is rendered
    expect(getByText(mockIssue.author.login)).toBeTruthy();

    // Check if comment count is rendered
    expect(getByText(`${mockIssue.comments.totalCount} comments`)).toBeTruthy();

    // Check if state is rendered
    expect(getByText(mockIssue.state)).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <IssueItem issue={mockIssue} onPress={mockOnPress} />
    );

    // Find the issue title and press it
    const issueTitle = getByText(`#${mockIssue.number} ${mockIssue.title}`);
    fireEvent.press(issueTitle);

    // Check if onPress was called
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
