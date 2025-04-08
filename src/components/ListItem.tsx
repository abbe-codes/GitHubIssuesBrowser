import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import T from '../utils/tailwind';

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  status?: 'OPEN' | 'CLOSED';
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  onPress,
  rightComponent,
  leftComponent,
  status,
}) => {
  const statusColor = status === 'OPEN' ? T.bgSuccess : T.bgDanger;
  const statusText = status === 'OPEN' ? 'Open' : 'Closed';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[T.pY3, T.pX4, T.borderB, T.borderGrayLight, T.flexRow, T.itemsCenter]}
    >
      {leftComponent && <View style={[T.mR3]}>{leftComponent}</View>}
      <View style={[T.flex1]}>
        <Text style={[T.textDark, T.fontMedium, T.textBase]}>{title}</Text>
        {subtitle && <Text style={[T.textGray, T.textSm, T.mT1]}>{subtitle}</Text>}
      </View>
      {status && (
        <View style={[T.mL2, T.pY1, T.pX2, T.roundedFull, statusColor]}>
          <Text style={[T.textWhite, T.textXs, T.fontMedium]}>{statusText}</Text>
        </View>
      )}
      {rightComponent && <View style={[T.mL2]}>{rightComponent}</View>}
    </TouchableOpacity>
  );
};

export default ListItem;
