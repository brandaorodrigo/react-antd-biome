import type { DefaultOptionType } from 'antd/es/select';
import Bucket, { BucketIcon, type BucketProps, bucketImage, type bucketImageProps } from './Bucket';
import InputCreditCard from './InputCreditCard';
import InputDate from './InputDate';
import InputPhone from './InputPhone';
import InputZipcode from './InputZipcode';
import locationsJson from './locations';
import Qrcode from './Qrcode';
import RangePicker, { type RangePickerProps } from './RangePicker';
import rule, { validate } from './rule';
import Select, { type SelectProps } from './Select';

const locations = locationsJson as DefaultOptionType[];

export {
    Bucket,
    BucketIcon,
    InputCreditCard,
    InputDate,
    InputPhone,
    InputZipcode,
    Qrcode,
    RangePicker,
    Select,
    bucketImage,
    locations,
    rule,
    type BucketProps,
    type RangePickerProps,
    type SelectProps,
    type bucketImageProps,
    validate,
};
