import React, { useCallback, VFC } from 'react';
import { ListRenderItemInfo, SafeAreaView } from 'react-native';
import { LayoutComponent, Navigation } from 'react-native-navigation';
import { LaunchListCell } from '@components/launch-list-cell';
import PaginatedList from 'components/elements-list';
import { Launch, Pad } from '../api/types';
import { useLaunchesPaginated } from '../api/use-space-x';
import { LAUNCHES_STACK } from '../navigation/navigation';
import { LaunchDetailLayout } from './launch-details';

const PAGE_SIZE = 10;

const LaunchesList: VFC = () => {
  const { data, size, setSize } = useLaunchesPaginated({
    limit: PAGE_SIZE,
    order: 'desc',
    sort: 'launch_date_utc',
  });

  const goToLaunch = (launch: Launch) => {
    Navigation.push(
      LAUNCHES_STACK,
      LaunchDetailLayout({ flightNumber: launch.flight_number })
    );
  };

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Launch | Pad>) => (
      <LaunchListCell launch={item as Launch} onPress={goToLaunch} />
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

export const LaunchesListLayoutName = 'LaunchesList';

export const LaunchesListLayout = (): LayoutComponent => ({
  name: LaunchesListLayoutName,
  options: {
    topBar: {
      title: {
        text: 'Launches',
      },
      largeTitle: {
        visible: true,
      },
    },
  },
});

export default LaunchesList;
