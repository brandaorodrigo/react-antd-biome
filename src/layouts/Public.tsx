import { Outlet } from 'react-router-dom';

const LayoutPublic: React.FC = () => {
    return (
        <div>
            Layout Public
            <Outlet />
        </div>
    );
};

export default LayoutPublic;
