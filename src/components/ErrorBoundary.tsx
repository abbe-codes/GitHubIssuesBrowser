import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import T from '../utils/tailwind';
import Button from './Button';

interface ErrorHandlingProps {
  error: Error | null;
  resetError: () => void;
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorHandlingProps, { hasError: boolean }> {
  state: { hasError: boolean; };
  props: any;
  constructor(props: ErrorHandlingProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError || this.props.error) {
      return (
        <View style={[T.flex1, T.p4, T.itemsCenter, T.justifyCenter]}>
          <View style={[T.bgDanger, T.p4, T.roundedLg, T.w3_4]}>
            <Text style={[T.textWhite, T.textLg, T.fontBold, T.mB2]}>
              Something went wrong
            </Text>
            <Text style={[T.textWhite, T.mB4]}>
              {this.props.error ? this.props.error.message : 'An unexpected error occurred'}
            </Text>
            <Button
              title="Try Again"
              onPress={() => {
                this.setState({ hasError: false });
                this.props.resetError();
              }}
              variant="outline"
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
  setState(arg0: { hasError: boolean; }) {
    throw new Error('Method not implemented.');
  }
}

export default ErrorBoundary;
