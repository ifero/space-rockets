import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { StarElement } from '../api/types';

const STAR_KEY = '@pleo/stars';

interface ContextContent {
  elements: StarElement[];
  addElement: (element: StarElement) => void;
  removeElement: (element: StarElement) => void;
  isElementStarred: (element: StarElement) => boolean;
  refreshList: () => void;
}

export const StarContext = createContext<ContextContent>({
  elements: [],
  addElement: () => {},
  removeElement: () => {},
  isElementStarred: () => false,
  refreshList: () => {},
});

const StarContextProvider: FC = ({ children }) => {
  const [listOfStarred, setListOfStarred] = useState<StarElement[]>([]);

  const getListOfItems = useCallback(async () => {
    const elements = (await AsyncStorage.getItem(STAR_KEY)) || '[]';
    setListOfStarred(JSON.parse(elements));
  }, []);

  const addElement = useCallback(
    async ({ id, type }) => {
      const newList = [...listOfStarred, { id, type }];
      await AsyncStorage.setItem(STAR_KEY, JSON.stringify(newList));
      setListOfStarred(newList);
    },
    [listOfStarred]
  );

  const removeElement = useCallback(
    async ({ id, type }) => {
      const newList = listOfStarred.filter(
        star => star.id !== id && star.type !== type
      );
      await AsyncStorage.setItem(STAR_KEY, JSON.stringify(newList));
      setListOfStarred(newList);
    },
    [listOfStarred]
  );

  const isElementStarred = useCallback(
    ({ id, type }) =>
      Boolean(listOfStarred.find(star => star.id === id && star.type === type)),
    [listOfStarred]
  );

  const refreshList = useCallback(() => {
    getListOfItems();
  }, [getListOfItems]);

  useEffect(() => {
    getListOfItems();
  }, [getListOfItems]);

  return (
    <StarContext.Provider
      value={{
        elements: listOfStarred,
        addElement,
        removeElement,
        isElementStarred,
        refreshList,
      }}>
      {children}
    </StarContext.Provider>
  );
};

export default StarContextProvider;
