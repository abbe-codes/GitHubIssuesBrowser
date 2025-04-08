import React, { useState, useEffect } from 'react';
import { View, Text, NetInfo } from 'react-native';
import T from '../utils/tailwind';
import Button from './Button';

interface NetworkStatusProps {
  children: React.ReactNode;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  // Check network connectivity when component mounts
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // This is a simplified approach for demonstration
        // In a real app, you would use NetInfo or a similar library
        const response = await fetch('https://api.github.com', { 
          method: 'HEAD',
          // Short timeout to quickly detect connection issues
          signal: AbortSignal.timeout(5000)
        });
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      }
    };

    // Check connection initially and set up interval
    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isConnected) {
    return (
      <View style={[T.p4, T.mY2, T.bgWarning, T.roundedLg]}>
        <Text style={[T.textWhite, T.fontMedium, T.mB2]}>
          Network connection unavailable
        </Text>
        <Text style={[T.textWhite, T.mB4]}>
          Please check your internet connection and try again.
        </Text>
        <Button
          title="Retry Connection"
          onPress={async () => {
            try {
              const response = await fetch('https://api.github.com', { 
                method: 'HEAD',
                signal: AbortSignal.timeout(5000)
              });
              setIsConnected(response.ok);
            } catch (error) {
              setIsConnected(false);
            }
          }}
          variant="outline"
        />
      </View>
    );
  }

  return <>{children}</>;
};

export default NetworkStatus;
