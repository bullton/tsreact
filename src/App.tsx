import React from "react";
// import logo from "./logo.svg";
import logo from './assets/images/logo.svg';
import styles from "./App.module.css";
import { Layout, Typography, Input, Menu, Button, Dropdown } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import type { MenuProps } from 'antd';

const items: MenuProps['items'] = [
  {
    label: '中文',
    key: '1',
  },
  {
    label: 'English',
    key: '2'
  }
];

function App() {
  return (
    <div className={styles.App}>
      {/* top-header */}
      <div className={styles["top-header"]}>
        <div className={styles.inner} >
          <Typography.Text className={styles.text}>让旅游更幸福</Typography.Text>
          <Dropdown.Button
            className={styles.drop}
            style={{ marginLeft: 15 }}
            icon={<GlobalOutlined />}
            menu={{items}}
          >
            Language
          </Dropdown.Button>
          <Button.Group className={styles["button-group"]}>
            <Button>注册</Button>
            <Button>登陆</Button>
          </Button.Group>
        </div>
      </div>
      <div className={styles["app-header"]}>
        <Layout.Header className={styles["main-header"]}>
          <img src={logo} alt="logo" className={styles["App-logo"]} />
          <Typography.Title level={3} className={styles.title}>
            慕课旅游网
          </Typography.Title>
          <Input.Search
            placeholder="请输入旅游目的地、主题、或关键字"
            className={styles["search-input"]}
          />
        </Layout.Header>
        <Menu
          mode={"horizontal"}
          className={styles["main-menu"]}
          items={[
            { key: "1", label: "旅游首页" },
            { key: "2", label: "周末游" },
            { key: "3", label: "跟团游" },
            { key: "4", label: "自由行" },
            { key: "5", label: "私家团" },
            { key: "6", label: "邮轮" },
            { key: "7", label: "酒店+景点" },
            { key: "8", label: "当地玩乐" },
            { key: "9", label: "主题游" },
            { key: "10", label: "定制游" },
            { key: "11", label: "游学" },
            { key: "12", label: "签证" },
            { key: "13", label: "企业游" },
            { key: "14", label: "高端游" },
            { key: "15", label: "爱玩户外" },
            { key: "16", label: "保险" },
          ]}
        />
      </div>
      <Layout.Footer>
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          版权所有 @ React 旅游网
        </Typography.Title>
      </Layout.Footer>
    </div>
  );
}

export default App;


// import React from 'react';
// import { LaptopOutlined, NotificationOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
// import type { MenuProps } from 'antd';
// import { Breadcrumb, Layout, Menu, theme, Dropdown, Button, Row, Col } from 'antd';
// import styles from "./App.module.css";
// import logo from './assets/images/logo.svg';

// const { Header, Content, Sider } = Layout;

// const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
//   key,
//   label: `nav ${key}`,
// }));

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

// const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
//   (icon, index) => {
//     const key:string = String(index + 1);

//     return {
//       key: `sub${key}`,
//       icon: React.createElement(icon),
//       label: `subnav ${key}`,

//       children: new Array(4).fill(null).map((_, j) => {
//         const subKey = index * 4 + j + 1;
//         return {
//           key: subKey,
//           label: `option${subKey}`,
//         };
//       }),
//     };
//   },
// );

// const App: React.FC = () => {
//   const {
//     token: { colorBgContainer },
//   } = theme.useToken();

//   return (
//     <Layout>
//       <Header className="header">
      
//         <div className="logo" />
//         <Row>
//           <Col span={18} push={6}>
//             col-18 col-push-6
//           </Col>
//           <Col span={6} pull={18}>
//             col-6 col-pull-18
//           </Col>
//         </Row>
//         <img src={logo} alt="logo" className={styles["App-logo"]} />
//         <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
//         <Dropdown.Button
//             style={{ marginLeft: 15 }}
//             icon={<GlobalOutlined />}
//             menu={{items}}
//             arrow
//           >
//             Language
//         </Dropdown.Button>
//         <Button.Group className={styles["button-group"]}>
//           <Button>注册</Button>
//           <Button>登陆</Button>
//         </Button.Group>
//       </Header>
//       <Layout>
//         <Sider width={200} style={{ background: colorBgContainer }}>
//           <Menu
//             mode="inline"
//             defaultSelectedKeys={['1']}
//             defaultOpenKeys={['sub1']}
//             style={{ height: '100%', borderRight: 0 }}
//             items={items2}
//           />
//         </Sider>
//         <Layout style={{ padding: '0 24px 24px' }}>
//           <Breadcrumb style={{ margin: '16px 0' }}>
//             <Breadcrumb.Item>Home</Breadcrumb.Item>
//             <Breadcrumb.Item>List</Breadcrumb.Item>
//             <Breadcrumb.Item>App</Breadcrumb.Item>
//           </Breadcrumb>
//           <Content
//             style={{
//               padding: 24,
//               margin: 0,
//               minHeight: 280,
//               background: colorBgContainer,
//             }}
//           >
//             Content
//           </Content>
//         </Layout>
//       </Layout>
//     </Layout>
//   );
// };

// export default App;