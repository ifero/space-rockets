import React from 'react';
import { Navigation } from 'react-native-navigation';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import AsyncStorageMock from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import PadDetails from '../pad-details';
import * as hooks from '../../api/use-space-x';
import { StarContextWrapper } from '../../util/test-helper';

AsyncStorageMock.getItem = jest
  .fn()
  .mockResolvedValue(JSON.stringify([{ id: 'site_name', type: 'pad' }]));

jest.spyOn(hooks, 'usePad').mockReturnValue({
  data: {
    name: 'pad_name',
    id: 6,
    status: 'active',
    location: {
      name: 'Vandenberg Air Force Base',
      region: 'California',
      latitude: 34.632093,
      longitude: -120.610829,
    },
    vehicles_launched: ['Falcon 9'],
    attempted_launches: 12,
    successful_launches: 12,
    wikipedia:
      'https://en.wikipedia.org/wiki/Vandenberg_AFB_Space_Launch_Complex_4',
    details:
      'SpaceX primary west coast launch pad for polar orbits and sun synchronous orbits, primarily used for Iridium. Also intended to be capable of launching Falcon Heavy.',
    site_id: 'vafb_slc_4e',
    site_name_long: 'Vandenberg Air Force Base Space Launch Complex 4E',
  },
  isValidating: false,
  mutate: jest.fn(),
});

jest.spyOn(Navigation, 'mergeOptions').mockImplementation(jest.fn);

export default AsyncStorageMock;

describe('given a PadDetails component', () => {
  describe('when the pad details are fetched correctly', () => {
    describe('customer can star the pad', () => {
      describe('when pad is not starred yet', () => {
        beforeEach(() => {
          const { getByTestId } = render(
            <PadDetails componentId="id" siteId="site_name" />,
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
                  id: 'site_name',
                  type: 'pad',
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
