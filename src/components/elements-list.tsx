import React, { FC, ReactElement } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet } from 'react-native';
import { Launch, Pad } from 'api/types';
import { EmptyState } from './empty-state';

const styles = StyleSheet.create({
  height: { height: '100%' },
});

interface Props {
  data?: (Launch | Pad)[];
  onEndReached: () => void;
  renderItem: (item: ListRenderItemInfo<Launch | Pad>) => ReactElement;
}

const PaginatedList: FC<Props> = ({ data, onEndReached, renderItem }) => {
  if (data === undefined) {
    return <EmptyState loading />;
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      onEndReached={onEndReached}
      style={styles.height}
    />
  );
};

export default PaginatedList;
