import React, { FC } from 'react';
import StarContextProvider from '../components/star-context';

export const StarContextWrapper: FC = ({ children }) => (
  <StarContextProvider>{children}</StarContextProvider>
);
