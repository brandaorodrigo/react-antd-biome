import {
    BarChartOutlined,
    BellOutlined,
    DashboardOutlined,
    LogoutOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Layout, Menu, type MenuProps, Space } from 'antd';
import type React from 'react';
import { Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
    // Menu principal superior
    const mainMenuItems: MenuProps['items'] = [
        {
            key: '1',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '2',
            icon: <UserOutlined />,
            label: 'Clientes',
            children: [
                {
                    key: '2-1',
                    label: 'Todos os Clientes',
                },
                {
                    key: '2-2',
                    label: 'Novo Cliente',
                },
                {
                    key: '2-3',
                    label: 'Leads',
                },
            ],
        },
        {
            key: '3',
            icon: <ShoppingCartOutlined />,
            label: 'Vendas',
            children: [
                {
                    key: '3-1',
                    label: 'Oportunidades',
                },
                {
                    key: '3-2',
                    label: 'Propostas',
                },
                {
                    key: '3-3',
                    label: 'Contratos',
                },
            ],
        },
        {
            key: '4',
            icon: <TeamOutlined />,
            label: 'Equipe',
            children: [
                {
                    key: '4-1',
                    label: 'Usuários',
                },
                {
                    key: '4-2',
                    label: 'Permissões',
                },
            ],
        },
        {
            key: '5',
            icon: <BarChartOutlined />,
            label: 'Relatórios',
        },
        {
            key: '6',
            icon: <SettingOutlined />,
            label: 'Configurações',
        },
    ];

    // Menu do usuário
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Meu Perfil',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Configurações',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Sair',
            danger: true,
        },
    ];

    return (
        <Layout>
            {/* Header */}
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div
                    style={{
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginRight: '32px',
                    }}
                >
                    Sistema CRM
                </div>

                <Menu
                    defaultSelectedKeys={['1']}
                    items={mainMenuItems}
                    mode='horizontal'
                    style={{ flex: 1, minWidth: 0 }}
                    theme='dark'
                />

                <Space size='middle' style={{ marginLeft: 'auto' }}>
                    <BellOutlined style={{ color: '#fff', fontSize: '18px', cursor: 'pointer' }} />

                    <Dropdown arrow menu={{ items: userMenuItems }} placement='bottomRight'>
                        <Space style={{ cursor: 'pointer', color: '#fff' }}>
                            <Avatar icon={<UserOutlined />} size='small' />
                            <span>João Silva</span>
                        </Space>
                    </Dropdown>
                </Space>
            </Header>

            {/* Content */}
            <Content style={{ padding: '50px' }}>
                <Outlet />
            </Content>

            {/* Footer */}
            <Footer style={{ textAlign: 'center' }}>
                Sistema CRM ©2025 - Desenvolvido com Ant Design
            </Footer>
        </Layout>
    );
};

export default App;
