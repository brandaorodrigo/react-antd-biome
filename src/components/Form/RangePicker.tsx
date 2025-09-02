import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';
import type { RangePickerProps as RangePickerPropsOriginal } from 'antd/es/date-picker';
import type { Dayjs } from 'dayjs';

type RangePickerProps = RangePickerPropsOriginal & { days?: number };

const RangePicker: React.FC<RangePickerProps> = ({ days, disabledDate, ...props }) => {
    const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();

    const disabledDateInternal: DatePickerProps['disabledDate'] = (current, { from, type }) => {
        if (!days) {
            return false;
        }
        if (from) {
            const minDate = from.add(days * -1, 'days');
            const maxDate = from.add(days, 'days');
            switch (type) {
                case 'year': {
                    return current.year() < minDate.year() || current.year() > maxDate.year();
                }
                case 'month': {
                    return (
                        getYearMonth(current) < getYearMonth(minDate) ||
                        getYearMonth(current) > getYearMonth(maxDate)
                    );
                }
                default: {
                    return Math.abs(current.diff(from, 'days')) >= days;
                }
            }
        }
        return false;
    };

    return (
        <DatePicker.RangePicker disabledDate={disabledDate || disabledDateInternal} {...props} />
    );
};

export default RangePicker;

export type { RangePickerProps };
