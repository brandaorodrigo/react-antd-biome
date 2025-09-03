import type { Rule } from 'antd/es/form';
import dayjs, { type Dayjs } from 'dayjs';

const mod11 = (clear: string, limit: number): number => {
    const value = String(clear).replace(/\D/g, '');
    let sum = 0;
    let mult = 2;
    for (let i = value.length - 1; i >= 0; i--) {
        sum += mult * +value[i];
        if (++mult > limit) {
            mult = 2;
        }
    }
    const dv = ((sum * 10) % 11) % 10;
    return dv;
};

class Validate {
    currency = (value: string, _ = 'BR'): boolean => {
        return /^((?=.*[1-9]|0)(?:\d{1,3}))((?=.*\d)(?:.\d{3})?)*((?=.*\d)(?:,\d\d){1}?){0,1}$/gm.test(
            value,
        );
    };

    date = (value: string | Dayjs, _ = 'BR'): boolean => {
        if (typeof value === 'object') {
            return dayjs(value).isValid();
        }
        if (value.length !== 10) {
            return false;
        }
        let fix = value;
        if (value.includes('/')) {
            const split = value.split('/');
            if (split.length !== 3) {
                return false;
            }
            fix = `${split[2]}-${split[1]}-${split[0]}`;
        }
        const format = dayjs(fix).format('YYYY-MM-DD');
        return fix === format;
    };

    day = (value: string, _ = 'BR'): boolean => {
        const [day, month] = value.split('/').map(Number);
        if (Number.isNaN(day) || Number.isNaN(month)) {
            return false;
        }
        if (month < 1 || month > 12) {
            return false;
        }
        const limit = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return day > 0 && day <= limit[month - 1];
    };

    document = (value: string, country = 'BR'): boolean => {
        if (country !== 'BR') {
            return true;
        }
        const number = value.replace(/\D+/g, '');
        if (number.length !== 11 || number.match(/(\d)\1{10}/)) {
            return false;
        }
        const slice = number.slice(0, 9);
        const dv1 = mod11(slice, 12);
        const dv2 = mod11(slice + dv1, 12);
        return slice + dv1 + dv2 === number;
    };

    email = (value: string, _ = 'BR'): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    fullname = (value: string, _ = 'BR'): boolean | string => {
        const split = value.trim().split(' ');
        if (split.length) {
            if (split.length === 1) {
                return 'Digite o nome completo';
            }
            if (split[0].length < 2 || split[split.length - 1].length < 2) {
                return 'Não use abreviações';
            }
            return true;
        }
        return false;
    };

    phone = (value: string, _ = 'BR'): boolean => {
        return value.replace(/\D/g, '').length > 7;
    };

    store = (value: string, country = 'BR'): boolean => {
        if (country !== 'BR') {
            return true;
        }
        const number = value.replace(/\D+/g, '');
        if (number.length !== 14 || number.match(/(\d)\1{13}/)) {
            return false;
        }
        const substring = number.substring(0, number.length - 2);
        const dv1 = mod11(substring, 9);
        const dv2 = mod11(substring + dv1, 9);
        return substring + dv1 + dv2 === number;
    };

    time = (value: string, _ = 'BR'): boolean => {
        if (value.length !== 5 || value.indexOf(':') !== 2) {
            return false;
        }
        const split = value.split(':');
        if (Number(split[0]) > 23 || Number(split[1]) > 59) {
            return false;
        }
        return true;
    };

    zipcode = (value: string, country = 'BR'): boolean => {
        if (country !== 'BR') {
            return true;
        }
        return value.length === 9;
    };
}

const validate = new Validate();

type ruleProps = (
    name:
        | 'currency'
        | 'date'
        | 'day'
        | 'document'
        | 'email'
        | 'fullname'
        | 'phone'
        | 'store'
        | 'time'
        | 'zipcode',
    country?: string,
    message?: string,
) => Rule;

const rule: ruleProps = (name, country = 'BR', message = '') => ({
    validator: (_, value) => {
        if (value !== undefined && String(value).trim() !== '' && String(value) !== 'null') {
            const check = validate[name](value, country);
            if (check === true) {
                return Promise.resolve();
            }
            if (!message && typeof check === 'string') {
                return Promise.reject(new Error(check));
            }
            return Promise.reject(new Error(message !== '' ? message : '${label} inválido'));
        }
        return Promise.resolve();
    },
});

export default rule;
export { validate };
