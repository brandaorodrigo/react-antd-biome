import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);

        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,
            children: Array.from({ length: 4 }).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    },
);

const LayoutPrivate: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className='demo-logo' />
                <Menu
                    defaultSelectedKeys={['2']}
                    items={items1}
                    mode='horizontal'
                    style={{ flex: 1, minWidth: 0 }}
                    theme='dark'
                />
            </Header>
            <div style={{ padding: '0 48px' }}>
                <Breadcrumb
                    items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
                    style={{ margin: '16px 0' }}
                />
                <Layout
                    style={{
                        padding: '24px 0',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Sider style={{ background: colorBgContainer }} width={200}>
                        <Menu
                            defaultOpenKeys={['sub1']}
                            defaultSelectedKeys={['1']}
                            items={items2}
                            mode='inline'
                            style={{ height: '100%' }}
                        />
                    </Sider>
                    <Content style={{ padding: '0 24px', minHeight: 280 }}>
                        <Outlet />
                    </Content>
                </Layout>
            </div>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default LayoutPrivate;
