import type { RouteObject } from 'react-router-dom';
import LayoutError from './layouts/Error';
import LayoutPrivate from './layouts/Private';
import LayoutPublic from './layouts/Public';
import Private from './routes/Private';
import Public from './routes/Public';

const routes = {
    private: [] as RouteObject[],
    public: [] as RouteObject[],
};

routes.private = [
    {
        errorElement: <LayoutError />,
        element: <LayoutPrivate />,
        children: [{ path: '*', element: <Private /> }],
    },
];

routes.public = [
    {
        errorElement: <LayoutError />,
        element: <LayoutPublic />,
        children: [{ path: '*', element: <Public /> }],
    },
];

export default routes;
