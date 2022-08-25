import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Layout, Navigation } from 'react-native-navigation';
import { InfoRow } from '@components/info-rox';
import { LaunchListCell } from '@components/launch-list-cell';
import { EmptyState } from '@components/empty-state';
import StarButton from '@components/star-button';
import { color, randomColor } from '../util/colors';
import { Launch } from '../api/types';
import { PADS_STACK } from '../navigation/navigation';
import { usePad, useRecentLaunches } from '../api/use-space-x';
import { LaunchDetailLayout } from './launch-details';
import { styles } from './pad-details.styles';
import { ComponentId } from '../navigation/types';

interface Props {
  siteId: string;
}

const innerStyles = StyleSheet.create({
  marginRight: { marginRight: 8 },
  marginTop: { marginTop: 24 },
  height100: { height: 100 },
  height50: { height: 50 },
});

const PadDetails: FC<Props & ComponentId> = ({ siteId, componentId }) => {
  const { data: pad } = usePad(siteId, {});
  const { data: launches } = useRecentLaunches(pad?.site_id);

  const [gradientColors] = useState([randomColor(), randomColor()]);

  useEffect(() => {
    if (pad?.name) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          title: {
            text: pad.name,
          },
        },
      });
    }
  }, [componentId, pad?.name]);

  if (!pad) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  const statusColor =
    pad.status === 'active'
      ? color.green700
      : pad.status === 'under construction'
      ? color.yellow700
      : color.red700;

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentInset={{ bottom: 24 }}>
        <LinearGradient colors={gradientColors} style={styles.gradient}>
          <View style={styles.imageOverlay}>
            <Text style={styles.missionNameText}>{pad.site_name_long}</Text>
            <View style={styles.subtitleContainer}>
              <Text
                style={[
                  styles.badge,
                  { backgroundColor: color.purple500 },
                  innerStyles.marginRight,
                ]}>
                {`${pad.attempted_launches}/${pad.successful_launches} SUCCESSFUL`}
              </Text>
              <Text
                style={[
                  styles.badge,
                  {
                    backgroundColor: statusColor,
                  },
                ]}>
                {pad.status.toUpperCase()}
              </Text>
              <StarButton id={siteId} type="pad" style={styles.starButton} />
            </View>
          </View>
        </LinearGradient>

        <Text style={styles.description}>{pad.details}</Text>

        <View style={styles.infoBox}>
          <InfoRow
            iconName="pin-outline"
            iconText="Location"
            title={pad.location.name}
            subtitle={pad.location.region}
          />
          <InfoRow
            iconName="navigation-variant-outline"
            iconText="Vehicles"
            title={pad.vehicles_launched.join(', ')}
            subtitle={' '}
            style={innerStyles.marginTop}
          />
        </View>

        <RecentLaunches launches={launches} />
      </ScrollView>
    </View>
  );
};

const RecentLaunches: FC<{ launches?: Launch[] }> = ({ launches }) => {
  const goToLaunch = (launch: Launch) => {
    Navigation.push(
      PADS_STACK,
      LaunchDetailLayout({ flightNumber: launch.flight_number })
    );
  };

  return (
    <>
      <Text style={styles.recentLaunches}>{'Recent launches'}</Text>
      {launches === undefined ? (
        <EmptyState loading style={innerStyles.height100} />
      ) : !launches.length ? (
        <EmptyState text="No recent launches..." style={innerStyles.height50} />
      ) : (
        launches.map(launch => {
          return (
            <LaunchListCell
              launch={launch}
              onPress={goToLaunch}
              key={launch.flight_number}
            />
          );
        })
      )}
    </>
  );
};

export const PadDetailLayoutName = 'PadDetail';

export const PadDetailLayout = (props: Props): Layout<Props> => ({
  component: {
    name: PadDetailLayoutName,
    passProps: props,
    options: {
      topBar: {
        visible: Platform.select({ android: false }),
      },
    },
  },
});

export default PadDetails;
