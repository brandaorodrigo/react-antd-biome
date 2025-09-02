import { Button, Table as TableOriginal } from 'antd';
import type {
    ColumnsType as ColumnsTypeOriginal,
    TableProps as TableOriginalProps,
} from 'antd/es/table';
import { LuDownload } from 'react-icons/lu';
import { xlsx } from '../utils';
import Empty from './Empty';
import Skeleton from './Skeleton';

type TableProps<T> = Omit<TableOriginalProps<T>, 'rowClassName'> & {
    disable?: { key: string; value: any };
    loading?: boolean;
    download?: string;
    rows?: number;
};

type ColumnsType<T> = ColumnsTypeOriginal<T> & {
    download?: (value: any, record: T, index: number) => string;
};

const Table = <T extends object>({
    columns,
    dataSource,
    disable = { key: 'visible', value: false },
    download,
    loading,
    rowKey = (record: any) => record?.id || Math.random() * 1000,
    rows = 14,
    ...props
}: TableProps<T>) => {
    const onDownload = () => {
        if (!dataSource?.length || !columns || !download) {
            return;
        }
        const common = (value: any) => value;
        const formatted = dataSource.map((record: any) => {
            const row: any = {};
            columns.forEach((column: any) => {
                const value = column?.dataIndex ? record[column.dataIndex] : record;
                const process = column.download || column.render || common;
                const processed = process(value, record);
                row[column.title] = typeof processed === 'string' ? processed : value;
            });
            return row;
        });
        xlsx(formatted, download);
    };

    if (loading && dataSource === undefined) {
        return <Skeleton rows={rows} />;
    }

    if (!loading && (!dataSource || dataSource.length === 0)) {
        return <Empty />;
    }

    return (
        <>
            <TableOriginal
                columns={columns}
                dataSource={dataSource}
                loading={{ indicator: <></>, spinning: !!loading }}
                rowClassName={(row: T, index) => {
                    const last = index + 1 === dataSource?.length ? 'last' : '';
                    const typed = row as Record<string, any>;
                    return typed?.[disable.key] === disable.value
                        ? `disabled ${last}`
                        : `enabled ${last}`;
                }}
                rowKey={rowKey}
                scroll={dataSource ? { x: 'auto' } : undefined}
                showSorterTooltip={false}
                {...props}
            />
            {!!dataSource?.length && !!columns && download && (
                <Button
                    icon={<LuDownload size={18} />}
                    onClick={onDownload}
                    style={{ marginTop: '10px' }}
                />
            )}
        </>
    );
};

export default Table;
export type { ColumnsType, TableProps };
