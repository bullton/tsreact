import React, { useState } from "react";
import logo from "../../assets/images/logo.svg";
import styles from "./MainLayout.module.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
// import styles from "./MainLayout.module.css";
// import { Header, Footer } from "../../componments";

import {
    DesktopOutlined,
    FileOutlined,
    HomeOutlined,
    CreditCardOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Row, Col, Typography, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}
const items: MenuItem[] = [
    // getItem('Option 1', '1', <PieChartOutlined />),
    // getItem('Option 2', '2', <DesktopOutlined />),
    getItem('房产数据', 'sub1', <HomeOutlined />, [
        getItem('杭州二手房交易数据', '3'),
        getItem('杭州新房交易数据', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('信用卡数据', 'sub2', <CreditCardOutlined />, [
        getItem('中信MCC积分查询', '6'),
        getItem('信用卡管理', '8')
    ]),
    // getItem('Files', '9', <FileOutlined />),
];

interface PropsTypes {
    children: React.ReactNode;
}

export const MainLayout: React.FC<PropsTypes> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const [collapsed, setCollapsed] = useState<boolean>(false);
    // const [menuCollapsed, setMenuCollapsed] = useState<boolean>(false);
    // const [, setCollapsed] = useState<boolean>(false);

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        switch(e.key) {
            case '3': navigate("/");break;
            case '6': navigate("/mcc");break;
            default: navigate("/");
        }
      };

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value: boolean) => setCollapsed(value)}>
                    <div style={{ height: 64, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }}>
                        <span onClick={() => navigate("/")}>
                            <img src={logo} alt="logo" className={styles["App-logo"]} />
                            <Typography.Title level={3} className={styles.title}>
                                牛数据
                            </Typography.Title>
                        </span>
                    </div>
                    <Menu theme="dark" defaultSelectedKeys={['6']} defaultOpenKeys={['sub2']} mode="inline" items={items} onClick={onClick}/>
                </Sider>
                <Layout className="site-layout">
                    <Header style={{ padding: 0, background: 'rgba(255, 255, 255, 0.2)' }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>User</Breadcrumb.Item>
                            <Breadcrumb.Item>Bill</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ padding: 24, minHeight: 360, background: 'rgba(255, 255, 255, 0.2)' }}>
                            {children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <a href="http://bullton.eicp.net:49154" target="_blank" rel="noopener noreferrer">Jenkins</a>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <a href="http://bullton.eicp.net:5000" target="_blank" rel="noopener noreferrer">群晖首页</a>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <a href="http://bullton.eicp.net:5080/photo" target="_blank" rel="noopener noreferrer">相册</a>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <a href="http://bullton.eicp.net:49154" target="_blank" rel="noopener noreferrer">Jenkins</a>
                            </Col>
                        </Row>
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
};
