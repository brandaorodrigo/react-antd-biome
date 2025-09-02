import { Typography } from 'antd';
import { MdOutlineManageSearch } from 'react-icons/md';

const TableEmpty: React.FC = () => {
    return (
        <div
            style={{
                alignItems: 'center',
                display: 'flex',
                height: '80px',
                justifyContent: 'center',
            }}
        >
            <Typography.Title level={3}>
                <MdOutlineManageSearch
                    size={32}
                    style={{ margin: '-7px 6px 0 0', float: 'left' }}
                />
                Nada encontrado
            </Typography.Title>
        </div>
    );
};

export default TableEmpty;
