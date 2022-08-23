import { formatDateTime } from '../format-date';

describe('Given a format-date utils', () => {
  describe('when the util should return a formatted date time', () => {
    describe('when the timestamp is from california', () => {
      it('should show the correct formatted date', () => {
        const californiaTimestamp = '2020-11-21T09:17:00-07:00';

        const formattedDate = formatDateTime(californiaTimestamp);

        expect(formattedDate).toBe('November 21, 2020, 9:17 AM UTC-7');
      });
    });

    describe('when the timestamp is from london', () => {
      it('should show the correct formatted date', () => {
        const californiaTimestamp = '2020-11-21T09:17:00+00:00';

        const formattedDate = formatDateTime(californiaTimestamp);

        expect(formattedDate).toBe('November 21, 2020, 9:17 AM UTC');
      });
    });
  });
});
