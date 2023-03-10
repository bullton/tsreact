// import React from "react";
// // import logo from "./logo.svg";
// import logo from './assets/images/logo.svg';
// import styles from "./App.module.css";
// import { Layout, Typography, Input, Menu, Button, Dropdown, Table } from "antd";
// import { GlobalOutlined } from "@ant-design/icons";
// import type { MenuProps } from 'antd';
// import type { TableProps } from 'antd';
// import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface';
// import DataType from "./componments/housing";

// const items: MenuProps['items'] = [
//   {
//     label: '中文',
//     key: '1',
//   },
//   {
//     label: 'English',
//     key: '2'
//   }
// ];

// function App() {
//   return (
//     <div className={styles.App}>
//       {/* top-header */}
//       <div className={styles["top-header"]}>
//         <div className={styles.inner} >
//           <Typography.Text className={styles.text}>Big data</Typography.Text>
//           <Dropdown.Button
//             className={styles.drop}
//             style={{ marginLeft: 15 }}
//             icon={<GlobalOutlined />}
//             menu={{items}}
//           >
//             Language
//           </Dropdown.Button>
//           <Button.Group className={styles["button-group"]}>
//             <Button>注册</Button>
//             <Button>登陆</Button>
//           </Button.Group>
//         </div>
//       </div>
//       <div className={styles["app-header"]}>
//         <Layout.Header className={styles["main-header"]}>
//           <img src={logo} alt="logo" className={styles["App-logo"]} />
//           <Typography.Title level={3} className={styles.title}>
//             牛数据
//           </Typography.Title>
//           <Input.Search
//             placeholder="请输入旅游目的地、主题、或关键字"
//             className={styles["search-input"]}
//           />
//         </Layout.Header>
//         <Menu
//           mode={"horizontal"}
//           className={styles["main-menu"]}
//           items={[
//             { key: "1", label: "杭州二手房交易数据" },
//             { key: "2", label: "周末游" },
//             { key: "3", label: "跟团游" },
//             { key: "4", label: "自由行" },
//             { key: "5", label: "私家团" },
//             { key: "6", label: "邮轮" },
//             { key: "7", label: "酒店+景点" },
//             { key: "8", label: "当地玩乐" },
//             { key: "9", label: "主题游" },
//             { key: "10", label: "定制游" },
//             { key: "11", label: "游学" },
//             { key: "12", label: "签证" },
//             { key: "13", label: "企业游" },
//             { key: "14", label: "高端游" },
//             { key: "15", label: "爱玩户外" },
//             { key: "16", label: "保险" },
//           ]}
//         />
//       </div>
//       <Layout.Content>
//         <DataType />
//       </Layout.Content>
//       <Layout.Footer>
//         <Typography.Title level={3} style={{ textAlign: "center" }}>
//           版权所有 @ Neil
//         </Typography.Title>
//       </Layout.Footer>
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import {Housing} from "./componments";

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
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <Housing />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>版权所有 @ Neil</Footer>
      </Layout>
    </Layout>
  );
};

export default App;