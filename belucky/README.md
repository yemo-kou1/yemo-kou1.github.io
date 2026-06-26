# beLucky · 综合运势 App

一个集黄历、星座运势、塔罗占卜于一体的综合运势工具。

## 功能

- **黄历查询** — 农历日期、干支、宜忌、冲煞、财神方位、十二值日、二十八宿等
- **星座运势** — 12星座每日运势（综合/爱情/事业/财运/健康）、幸运数字/颜色
- **塔罗占卜** — 单牌占卜 / 三牌阵（过去/现在/未来），78张牌完整释义
- **用户信息** — 保存出生日期，无需重复输入，自动计算星座和生肖

## 技术栈

- **后端**: FastAPI + aiosqlite
- **前端**: 原生 HTML/CSS/JS
- **黄历数据**: cnlunar
- **数据存储**: SQLite

## 快速开始

### 1. 创建虚拟环境

```bash
python -m venv venv
```

### 2. 安装依赖

```bash
# Windows
venv\Scripts\activate
pip install -r requirements.txt

# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
```

### 3. 启动

```bash
# Windows
start.bat

# 或手动启动
uvicorn app:app --host 0.0.0.0 --port 9000 --reload
```

### 4. 访问

打开浏览器访问: http://localhost:9000

## 项目结构

```
beLucky/
├── app.py              # 主应用 (FastAPI)
├── requirements.txt    # 依赖
├── start.bat           # Windows 启动脚本
├── database.db         # SQLite 数据库 (自动生成)
├── data/
│   ├── tarot.json      # 塔罗牌数据 (78张)
│   └── horoscope.json  # 星座数据 (12星座)
├── static/
│   ├── css/
│   │   └── style.css   # 样式
│   └── js/
│       └── app.js      # 前端逻辑
└── templates/
    └── index.html      # 主页面
```

## API

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/almanac` | GET | 黄历信息 |
| `/api/zodiac` | GET | 星座信息 |
| `/api/horoscope` | GET | 每日运势 |
| `/api/tarot` | POST | 塔罗占卜 |
| `/user/save` | POST | 保存用户信息 |
| `/user/delete` | POST | 删除用户信息 |

## 免责声明

本应用仅供娱乐参考，请勿迷信。
