import {
    Col,
    Row,
    Skeleton,
    Transfer as TransferOriginal,
    type TransferProps as TransferOriginalProps,
} from 'antd';
import { useEffect, useState } from 'react';

type TransferProps = {
    filterOption?: any;
    height?: string;
    onChange?: (value: any) => void;
    loading?: boolean;
    options: {
        label: React.ReactNode;
        value: string | number;
        [from: string]: React.ReactNode;
    }[];
    rows?: number;
    value?: React.Key[] | undefined;
};

type TransferStateProps = TransferOriginalProps<any>['targetKeys'] | any;

const Transfer: React.FC<TransferProps> = ({
    filterOption,
    height = '430px',
    loading,
    onChange,
    options,
    rows = 9,
    value,
    ...props
}) => {
    const [targetKeys, setTargetKeys] = useState<TransferStateProps>([]);

    useEffect(() => {
        if (value) {
            setTargetKeys(value);
        }
    }, [value]);

    const getCustomHeader = (listTitle: string, listCount: number) => (
        <Row gutter={[8, 8]}>
            <Col>
                <span>{listCount}</span>
            </Col>
            <Col>
                <span>{listTitle}</span>
            </Col>
        </Row>
    );

    return (
        <Col style={{ height: height }}>
            {loading && (
                <Skeleton active loading={true} paragraph={{ rows, width: '100%' }} title={false} />
            )}
            <TransferOriginal
                className='Transfer'
                dataSource={options}
                filterOption={filterOption}
                listStyle={{ height }}
                onChange={(keys) => {
                    setTargetKeys(keys);
                    if (onChange) {
                        onChange(keys);
                    }
                }}
                render={(item) => (
                    <>
                        {item.label}
                        {item.description && (
                            <>
                                <br />
                                <small>{item.description}</small>
                            </>
                        )}
                    </>
                )}
                rowKey={(record: any) => record.value}
                showSearch
                showSelectAll={false}
                style={{ opacity: loading ? 0 : 1 }}
                targetKeys={targetKeys}
                titles={[
                    getCustomHeader(
                        options.length > 1 ? 'Disponíveis' : 'Disponível',
                        options.length,
                    ),
                    getCustomHeader(
                        targetKeys.length > 1 ? 'Selecionados' : 'Selecionado',
                        targetKeys.length,
                    ),
                ]}
                {...props}
            />
        </Col>
    );
};

export default Transfer;
