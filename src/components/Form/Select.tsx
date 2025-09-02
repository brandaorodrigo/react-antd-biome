import {
    Select as SelectOriginal,
    type SelectProps as SelectPropsOriginal,
    TreeSelect,
} from 'antd';
import { renderToString } from 'react-dom/server';
import Transfer from './Transfer';

const tag = (value: string): string => {
    if (!value) {
        return '';
    }
    const fix = value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    return fix.toLowerCase();
};

const filter = (value: any, option: any) => {
    const label = option?.label;
    const string = typeof label === 'object' ? renderToString(label) : String(label);
    const content = `${option?.title} ${string} ${option?.value} ${option?.description}`;
    return tag(content).indexOf(tag(value)) !== -1;
};

type SelectProps = Omit<SelectPropsOriginal, 'options'> & {
    options?: any;
    transfer?: boolean;
    tree?: boolean;
};

const Select: React.FC<SelectProps> = ({
    filterOption,
    allowClear,
    onChange,
    options,
    placeholder,
    transfer,
    showSearch,
    tree,
    value,
    ...props
}) => {
    if (transfer) {
        return (
            <Transfer
                filterOption={filter || filterOption}
                getPopupContainer={(node: any) => node}
                onChange={onChange as any}
                options={options as any}
                value={value}
                {...props}
            />
        );
    }

    if (tree) {
        return (
            <TreeSelect
                allowClear={allowClear}
                filterTreeNode={filter || filterOption}
                getPopupContainer={(node) => node}
                onChange={onChange as any}
                placeholder={placeholder || 'Selecione'}
                showSearch={showSearch}
                treeData={options as any}
                treeExpandAction='click'
                value={value}
            />
        );
    }

    return (
        <SelectOriginal
            allowClear={allowClear}
            filterOption={filter || filterOption}
            getPopupContainer={(node) => node}
            onChange={onChange as any}
            options={options as any}
            placeholder={placeholder || 'Selecione'}
            showSearch={showSearch}
            value={value}
            {...props}
        />
    );
};

export default Select;

export type { SelectProps };
