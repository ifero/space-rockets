import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StarElement } from '../api/types';
import { StarContext } from './star-context';

type Props = {
  style?: StyleProp<ViewStyle>;
} & StarElement;

const StarButton: FC<Props> = ({ id, type, style }) => {
  const [isSelected, setIsSelected] = useState(false);

  const { addElement, removeElement, isElementStarred } =
    useContext(StarContext);

  useEffect(() => {
    setIsSelected(isElementStarred({ id, type }));
  }, [id, isElementStarred, type]);

  const onButtonPress = useCallback(() => {
    if (isSelected) {
      removeElement({ id, type });
    } else {
      addElement({ id, type });
    }

    setIsSelected(!isSelected);
  }, [addElement, id, isSelected, removeElement, type]);

  return (
    <Pressable onPress={onButtonPress} style={style}>
      <Icon name="star" color={isSelected ? 'red' : 'grey'} size={24} />
    </Pressable>
  );
};

export default StarButton;
