import { Skeleton } from 'antd';

const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 14 }) => {
    return <Skeleton active loading={true} paragraph={{ rows, width: '100%' }} title={false} />;
};

export default TableSkeleton;
