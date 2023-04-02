import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.svg";
import styles from "./MainLayout.module.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
// import styles from "./MainLayout.module.css";
// import { Header, Footer } from "../../componments";
import { useSelector } from "../../redux/hooks";
import { CountState } from "../../redux/count/slice";

import {
    HomeOutlined,
    CreditCardOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Row, Col, Typography } from 'antd';
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
    getItem('房产数据', '房产数据', <HomeOutlined />, [
        getItem('杭州二手房交易数据', '3'),
        getItem('杭州二手房交易数据(住商)', '9'),
        getItem('杭州新房交易数据(住商)', '10'),
        getItem('深圳二手房交易数据', '4'),
        getItem('城市挂牌量', '11'),
        getItem('小区信息', '12'),
        getItem('二手房交易城市对比', '0'),
    ]),
    getItem('信用卡数据', '信用卡', <CreditCardOutlined />, [
        getItem('中信MCC积分查询', '6'),
        getItem('信用卡管理', '8')
    ]),
    // getItem('Files', '9', <FileOutlined />),
];

const menuMap: any = {
    house: { key: '房产数据', label: '房产数据' },
    hz2s: { key: '3', label: '杭州二手房交易数据' },
    hz2szs: { key: '9', label: '杭州二手房交易数据(住商)' },
    hznew: { key: '10', label: '杭州新房交易数据(住商)' },
    citylistings: { key: '11', label: '城市挂牌量' },
    estates: { key: '12', label: '小区信息' },
    sz2s: { key: '4', label: '深圳二手房交易数据' },
    bank: { key: '信用卡', label: '信用卡数据' },
    mcc: { key: '6', label: 'MCC查询' },
    '/': { key: '0', label: '首页' }
}

interface PropsTypes {
    children: React.ReactNode;
}

export const MainLayout: React.FC<PropsTypes> = ({ children }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const path = pathname.split('/').filter((item) => item);
    if (!path.length) {
        path.push('/');
    }
    const params = useParams();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    // const [count, setCount] = useState<number>(0);
    // const [menuCollapsed, setMenuCollapsed] = useState<boolean>(false);
    // const [, setCollapsed] = useState<boolean>(false);
    // const [breadcrumbItems, setBreadcrumbItems] = useState<string[]>([menuMap[path[0]]['label'], menuMap[path[1]]['label']]);
    const count = useSelector((state) => state.count.count);

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        switch (e.key) {
            case '3': navigate("/house/hz2s"); break;
            case '4': navigate("/house/sz2s"); break;
            case '6': navigate("/bank/mcc"); break;
            case '9': navigate("/house/hz2szs"); break;
            case '10': navigate("/house/hznew"); break;
            case '11': navigate("/house/citylistings"); break;
            case '12': navigate("/house/estates"); break;
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
                    <Menu theme="dark" defaultSelectedKeys={[path[1] ? menuMap[path[1]]['key'] : menuMap[path[0]]['key']]} defaultOpenKeys={[menuMap[path[0]]['key']]} mode="inline" items={items} onClick={onClick} />
                </Sider>
                <Layout className="site-layout">
                    <Header style={{ padding: 0, background: 'rgba(255, 255, 255, 0.2)' }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }} items={path.map((item) => ({ title: menuMap[item]['label'] }))} />
                        <div style={{ padding: 24, background: 'rgba(255, 255, 255, 0.2)' }}>
                            {children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        <Row>
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
                                <a href="http://bullton.eicp.net:49154" target="_blank" rel="noopener noreferrer">{count}</a>
                            </Col>
                        </Row>
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
};
