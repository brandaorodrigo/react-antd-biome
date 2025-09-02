import 'antd/dist/reset.css';
import { ConfigProvider, Typography } from 'antd';
import ptBR from 'antd/es/locale/pt_BR';
import axios from 'axios';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { parseJSON } from './components/utils';
import routes from './Routes';

// storage -----------------------------------------------------------------------------------------

type setPartnerProps = {
    external_name: string;
    legacy: boolean;
    name: string;
    switch: boolean;
    unified: boolean;
    unique: boolean;
};

const setPartner = async (tenant: string): Promise<setPartnerProps> => {
    const { data } = await axios.get(`/partners/${tenant}`);

    const value = {
        external_name: data.id,
        legacy: !!data.migratedPartner,
        name: data.presentationName,
        switch: !!data?.userSwap,
        unified: !!data?.unifiedDatabase,
        unique: false,
    } as setPartnerProps;

    // unique

    try {
        const unique = await axios.get(`/planner-php/unique/${tenant}`);
        value.unique = unique.status === 204;
    } catch {
        value.unique = false;
    }

    window.localStorage.setItem('_partner', JSON.stringify(value));

    return value;
};

const removePartner = () => {
    window.localStorage.removeItem('_partner');
};

type setUserProps = {
    forceUpdatePassword: boolean;
    gameficationProgramId?: string;
    id: string;
    integrationId: string;
    integrationStoreId: string;
    name: string;
    php: string;
    picture: string | undefined;
    profile: 'administration' | 'management' | 'operation';
    roles: string[];
    token: string;
    unique: boolean;
    username: string;
};

const setUser = async (tenant: string, token: string, username: string): Promise<setUserProps> => {
    await setPartner(tenant);

    const { data } = await axios.post('/auth/token', { token });

    const roles = [] as string[];
    const profiles = [] as string[];

    for (const product of ['billing', 'cashback', 'planner', 'retail', 'unique']) {
        if (data?.productRoleNames?.[product]) {
            const role = data?.productRoleNames?.[product].toLowerCase();
            roles.push(`${product}_${role}`);
            profiles.push(role);
        }
    }

    for (const role of roles) {
        if (role === 'planner_supervisor') {
            roles.push('planner_manager');
        }
        if (role === 'retail_supervisor') {
            roles.push('retail_manager');
        }
    }

    // profile

    const administration = profiles.includes('administrator');
    const management = profiles.some((profile) => ['supervisor', 'manager'].includes(profile));
    const profile = administration ? 'administration' : management ? 'management' : 'operation';

    const config = { headers: { Authorization: `Bearer ${token}` } };

    // picture

    let picture: string | undefined;
    try {
        const response = await axios.get(`/auth/users/${data.userId}`, config);
        picture = response.data.profilePicture;
    } catch {
        //
    }

    // gameficationProgramId

    let gameficationProgramId: string | undefined;
    try {
        const response = await axios.get('/gamefication/program', config);
        gameficationProgramId = response?.data?.program?.id || undefined;
    } catch {
        //
    }

    // php

    const php = btoa(
        JSON.stringify({
            database: data?.currentPartnerExternalId,
            id_integration: encodeURIComponent(data?.integrationId),
            id_user: data?.userId,
            role: data?.productRoleNames?.planner?.toLowerCase() || 'none',
        }),
    );

    // unique

    let unique = false;
    try {
        const response = await axios.get(`/planner-php/unique/store/select?php=${php}`);
        unique = !!response?.data?.length;
    } catch {
        //
    }

    // integrationStoreId

    let integrationStoreId: string | undefined;
    if (roles.includes('planner_seller')) {
        try {
            const response = await axios.get(
                `/planner-php/auth/seller/${data?.integrationId}?php=${php}`,
            );
            integrationStoreId = response?.data?.integrationStoreId;
        } catch {
            //
        }
        if (!integrationStoreId) {
            throw new Error('SELLER_WITHOUT_STORE');
        }
    }

    const value = {
        forceUpdatePassword: !!data?.forceUpdatePassword,
        id: data?.userId,
        integrationId: data?.integrationId,
        name: data?.name,
        //
        gameficationProgramId,
        integrationStoreId,
        php,
        picture,
        profile,
        roles,
        token,
        unique,
        username,
    };

    window.localStorage.setItem('_user', JSON.stringify(value));

    if (profile === 'management') {
        window.localStorage.setItem('_original', token);
    }

    return value as setUserProps;
};

const removeUser = () => {
    window.localStorage.removeItem('_user');
    window.localStorage.removeItem('_original');
    window.localStorage.removeItem('_mobile');
};

const original = window.localStorage.getItem('_original');
const partnerItem = window.localStorage.getItem('_partner');
const partner = parseJSON(partnerItem, {}) as setPartnerProps;
const userItem = window.localStorage.getItem('_user');
const user = parseJSON(userItem, {}) as setUserProps;
const mobile = window.localStorage.getItem('_mobile');

export { mobile, original, partner, removePartner, removeUser, setPartner, setUser, user };

// axios -------------------------------------------------------------------------------------------

axios.defaults.baseURL = import.meta.env.VITE_API;

axios.defaults.headers.common.Authorization = `Bearer ${user?.token}`;

axios.interceptors.response.use(
    async (response) => {
        if (response.status === 202) {
            return axios(response.config);
        }
        if (response?.status === 200 && typeof response?.data !== 'object') {
            response.data = {};
        }
        return response;
    },
    async (error) => {
        const name = error?.response?.data?.name;
        const message = error?.response?.data?.error?.message;
        const code = error?.response?.data?.error?.code;
        throw name || message || code || 'UNKNOWN_ERROR';
    },
);

// =================================================================================================

const App: React.FC = () => {
    const router = user?.token ? routes.private : routes.public;

    return (
        <ConfigProvider
            csp={{
                nonce: '{{nonce}}',
            }}
            form={{
                requiredMark: 'optional',
                scrollToFirstError: true,
                validateMessages: {
                    // biome-ignore lint/suspicious/noTemplateCurlyInString: Vite
                    required: '${label} obrigatório',
                },
            }}
            locale={ptBR}
            renderEmpty={(component) => {
                if (component === 'Table') {
                    return (
                        <Typography.Title level={3} style={{ lineHeight: 5 }}>
                            Nada encontrado
                        </Typography.Title>
                    );
                }
                return 'Nada encontrado';
            }}
            theme={{ cssVar: true }}
        >
            <RouterProvider router={createBrowserRouter(router, { basename: '/' })} />
        </ConfigProvider>
    );
};

export default App;
