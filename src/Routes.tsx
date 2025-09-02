import type { RouteObject } from 'react-router-dom';
import LayoutPrivate from './layouts/Private';
import LayoutPublic from './layouts/Public';
import Errorx from './routes/Error';
import Private from './routes/Private';
import Public from './routes/Public';

const routes = {
    private: [] as RouteObject[],
    public: [] as RouteObject[],
};

routes.private = [
    {
        errorElement: <Errorx />,
        element: <LayoutPrivate />,
        children: [{ path: '*', element: <Private /> }],
    },
];

routes.public = [
    {
        errorElement: <Errorx />,
        element: <LayoutPublic />,
        children: [{ path: '*', element: <Public /> }],
    },
];

export default routes;
