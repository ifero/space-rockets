import React, { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, SafeAreaView } from 'react-native';
import { LayoutComponent, Navigation } from 'react-native-navigation';
import { EmptyState } from '../components/empty-state';
import { PadListCell } from '../components/pad-list-cell';
import { Launch, Pad } from '../api/types';
import {
  LAUNCHES_STACK,
  PADS_STACK,
  STARS_STACK,
} from '../navigation/navigation';
import { useLaunchesPaginated, usePadsPaginated } from '../api/use-space-x';
import { LaunchDetailLayout } from './launch-details';
import { PadDetailLayout } from './pad-details';
import { StarContext } from '../components/star-context';
import { LaunchListCell } from '../components/launch-list-cell';
import { ComponentId } from '../navigation/types';

const PAGE_SIZE = 10;

function isPad(element: Pad | Launch): element is Pad {
  return (element as Pad).site_id !== undefined;
}

const StarsList: FC<ComponentId> = ({ componentId }) => {
  const {
    data: padsData,
    size: padsSize,
    setSize: padsSetSize,
  } = usePadsPaginated({
    limit: PAGE_SIZE,
  });

  const {
    data: launchesData,
    size: launchesSize,
    setSize: launchesSetSize,
  } = useLaunchesPaginated({
    limit: PAGE_SIZE,
    order: 'desc',
    sort: 'launch_date_utc',
  });

  const { elements, refreshList } = useContext(StarContext);

  const goToPad = (pad: Pad) => {
    Navigation.push(STARS_STACK, PadDetailLayout({ siteId: pad.site_id }));
  };

  const goToLaunch = (launch: Launch) => {
    Navigation.push(
      STARS_STACK,
      LaunchDetailLayout({ flightNumber: launch.flight_number })
    );
  };

  const data = useMemo(() => {
    if (elements && padsData && launchesData) {
      const padsDataFlat = padsData.flat() ?? [];
      const launchDataFlat = launchesData.flat() ?? [];

      return elements.reduce<Array<Pad | Launch>>((prev, current) => {
        if (current.type === 'launch') {
          const launch = launchDataFlat.find(
            element => element.flight_number === Number(current.id)
          );
          launch && prev.push(launch);
        }
        if (current.type === 'pad') {
          const pad = padsDataFlat.find(
            element => element.site_id === current.id
          );
          pad && prev.push(pad);
        }
        return prev;
      }, []);
    }
  }, [elements, padsData, launchesData]);

  const onEndReached = useCallback(() => {
    padsSetSize(padsSize + 1);
    launchesSetSize(launchesSize + 1);
  }, [launchesSetSize, launchesSize, padsSetSize, padsSize]);

  useEffect(() => {
    const listener = {
      componentDidAppear: refreshList,
    };
    // Register the listener to all events related to our component
    const unsubscribe = Navigation.events().registerComponentListener(
      listener,
      componentId
    );
    return () => {
      // Make sure to unregister the listener during cleanup
      unsubscribe.remove();
    };
  }, [componentId, refreshList]);

  if (padsData === undefined && launchesData === undefined) {
    return <EmptyState loading />;
  }

  const renderItem = ({ item }: ListRenderItemInfo<Launch | Pad>) => {
    return isPad(item) ? (
      <PadListCell pad={item} onPress={goToPad} />
    ) : (
      <LaunchListCell launch={item} onPress={goToLaunch} />
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        data={data?.flat() ?? []}
        renderItem={renderItem}
        onEndReached={onEndReached}
        style={{ height: '100%' }}
      />
    </SafeAreaView>
  );
};

export const StarsListLayoutName = 'StarsList';

export const StarsListLayout = (): LayoutComponent => ({
  name: StarsListLayoutName,
  options: {
    topBar: {
      title: {
        text: 'Starred',
      },
      largeTitle: {
        visible: true,
      },
    },
  },
});

export default StarsList;
