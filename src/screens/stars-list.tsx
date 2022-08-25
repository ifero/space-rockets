import React, { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { ListRenderItemInfo, SafeAreaView } from 'react-native';
import { LayoutComponent, Navigation } from 'react-native-navigation';
import PaginatedList from '@components/elements-list';
import { PadListCell } from '@components/pad-list-cell';
import { StarContext } from '@components/star-context';
import { LaunchListCell } from '@components/launch-list-cell';
import { useLaunchesPaginated, usePadsPaginated } from 'api/use-space-x';
import { Launch, Pad } from 'api/types';
import { STARS_STACK } from 'navigation/navigation';
import { ComponentId } from 'navigation/types';
import { LaunchDetailLayout } from './launch-details';
import { PadDetailLayout } from './pad-details';

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
    return [];
  }, [elements, padsData, launchesData]);

  const onEndReached = useCallback(() => {
    padsSetSize(padsSize + 1);
    launchesSetSize(launchesSize + 1);
  }, [launchesSetSize, launchesSize, padsSetSize, padsSize]);

  useEffect(() => {
    const listener = {
      componentDidAppear: refreshList,
    };

    const unsubscribe = Navigation.events().registerComponentListener(
      listener,
      componentId
    );
    return () => {
      unsubscribe.remove();
    };
  }, [componentId, refreshList]);

  const renderItem = ({ item }: ListRenderItemInfo<Launch | Pad>) => {
    return isPad(item) ? (
      <PadListCell pad={item} onPress={goToPad} />
    ) : (
      <LaunchListCell launch={item} onPress={goToLaunch} />
    );
  };

  return (
    <SafeAreaView>
      <PaginatedList
        onEndReached={onEndReached}
        data={data}
        renderItem={renderItem}
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
