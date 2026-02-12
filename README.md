# tsreact

一个全栈项目，包含 TypeScript React 前端和 Express.js 后端 API 服务。

## 项目结构

```
tsreact/
├── backend/          # Express.js 后端服务
│   ├── routes/        # API 路由
│   ├── script/       # 数据爬虫脚本
│   ├── models/       # 数据模型
│   └── views/        # Handlebars 模板
└── frontend/         # React + TypeScript 前端
    └── src/          # 源代码
```

## 技术栈

### Backend
- Express.js
- Handlebars (HBS)
- MongoDB (Mongoose)
- Cheerio (网页爬虫)
- Axios (HTTP 客户端)

### Frontend
- React 18
- TypeScript
- Ant Design 5.x
- Redux Toolkit
- React Router v6
- Mapbox GL JS

## 快速开始

### Backend

```bash
cd backend
npm install
npm start
```

后端服务运行在 `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm start
```

前端服务运行在 `http://localhost:3000`

## 主要功能

- 数据爬取和处理
- API 接口服务
- 数据可视化
- 地图展示

## License

MIT
