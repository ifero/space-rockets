import React from 'react';
import { Navigation } from 'react-native-navigation';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import AsyncStorageMock from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import LaunchDetails from '../launch-details';
import * as hooks from '../../api/use-space-x';
import { StarContextWrapper } from '../../util/test-helper';

AsyncStorageMock.getItem = jest
  .fn()
  .mockResolvedValue([{ id: 1, type: 'launch' }]);

jest.spyOn(hooks, 'useLaunch').mockReturnValue({
  data: {
    mission_patch_small: 'https://images2.imgbox.com/12/7c/NiniYxoh_o.png',
    flight_number: 65,
    mission_name: 'Telstar 19V',
    launch_date_utc: '2018-07-22T05:50:00.000Z',
    launch_date_local: '2018-07-22T01:50:00-04:00',
    rocket: {
      rocket_name: 'Falcon 9',
      rocket_type: 'FT',
      first_stage: {
        cores: [
          {
            core_serial: 'B1047',
            land_success: true,
          },
        ],
      },
      second_stage: {
        block: 5,
        payloads: [
          {
            payload_type: 'Satellite',
          },
        ],
      },
    },
    launch_site: {
      site_id: 'ccafs_slc_40',
      site_name: 'CCAFS SLC 40',
      site_name_long:
        'Cape Canaveral Air Force Station Space Launch Complex 40',
    },
    launch_success: true,
    links: {
      mission_patch_small: 'https://images2.imgbox.com/12/7c/NiniYxoh_o.png',
      youtube_id: 'xybp6zLaGx4',
      flickr_images: [
        'https://farm1.staticflickr.com/856/28684550147_49802752b3_o.jpg',
        'https://farm1.staticflickr.com/927/28684552447_956a9744f1_o.jpg',
        'https://farm2.staticflickr.com/1828/29700007298_8ac5891d2c_o.jpg',
        'https://farm1.staticflickr.com/914/29700004918_31ed7b73ef_o.jpg',
        'https://farm1.staticflickr.com/844/29700002748_3047e50a0a_o.jpg',
        'https://farm2.staticflickr.com/1786/29700000688_2514cd3cbb_o.jpg',
      ],
    },
  },
  isValidating: false,
  mutate: jest.fn(),
});

jest.spyOn(Navigation, 'mergeOptions').mockImplementation(jest.fn);

export default AsyncStorageMock;

describe('given a LaunchDetails component', () => {
  describe('when the launch details are fetched correctly', () => {
    describe('customer can star the launch', () => {
      describe('when launch is not starred yet', () => {
        beforeEach(() => {
          const { getByTestId } = render(
            <LaunchDetails componentId="id" flightNumber={65} />,
            {
              wrapper: StarContextWrapper,
            }
          );

          expect(getByTestId('StarIcon')).toHaveStyle({ color: 'grey' });

          fireEvent.press(getByTestId('StarButton'));
        });
        it('should set the value in the async storage', async () => {
          await waitFor(() => {
            expect(AsyncStorageMock.setItem).toHaveBeenCalledWith(
              '@pleo/stars',
              JSON.stringify([
                {
                  id: '65',
                  type: 'launch',
                },
              ])
            );
          });
        });

        it('should set new icon color', async () => {
          await waitFor(() => {
            expect(screen.getByTestId('StarIcon')).toHaveStyle({
              color: 'red',
            });
          });
        });
      });
    });
  });
});
