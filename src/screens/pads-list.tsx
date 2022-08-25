import React, { useCallback, VFC } from 'react';
import { ListRenderItemInfo, SafeAreaView } from 'react-native';
import { LayoutComponent, Navigation } from 'react-native-navigation';
import { PadListCell } from '@components/pad-list-cell';
import PaginatedList from 'components/elements-list';
import { Launch, Pad } from '../api/types';
import { PADS_STACK } from '../navigation/navigation';
import { usePadsPaginated } from '../api/use-space-x';
import { PadDetailLayout } from './pad-details';

const PAGE_SIZE = 10;

const PadsList: VFC = () => {
  const { data, size, setSize } = usePadsPaginated({
    limit: PAGE_SIZE,
  });

  const goToPad = (pad: Pad) => {
    Navigation.push(PADS_STACK, PadDetailLayout({ siteId: pad.site_id }));
  };

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Launch | Pad>) => (
      <PadListCell pad={item as Pad} onPress={goToPad} />
    ),
    []
  );

  const onEndReached = useCallback(() => setSize(size + 1), [setSize, size]);

  return (
    <SafeAreaView>
      <PaginatedList
        data={data?.flat() ?? []}
        renderItem={renderItem}
        onEndReached={onEndReached}
      />
    </SafeAreaView>
  );
};

export const PadsListLayoutName = 'PadsList';

export const PadsListLayout = (): LayoutComponent => ({
  name: PadsListLayoutName,
  options: {
    topBar: {
      title: {
        text: 'Pads',
      },
      largeTitle: {
        visible: true,
      },
    },
  },
});

export default PadsList;
