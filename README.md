# 💊 LineBot OCR — 藥物位置查詢系統

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![LINE Bot SDK](https://img.shields.io/badge/LINE%20Bot%20SDK-7.7-06c755.svg)](https://github.com/line/line-bot-sdk-nodejs)
[![GCP](https://img.shields.io/badge/GCP-Cloud%20Run-4285F4.svg)](https://cloud.google.com/run)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

## 🌐 功能展示

💊 **Live Demo**：[tai-ju.github.io/linebot-ocr](https://tai-ju.github.io/linebot-ocr/)

> 透過 LINE Bot 拍攝藥品照片，OCR 自動辨識藥品名稱，即時回傳存放位置與藥架編號，部署於 GCP Cloud Run。

---

## 📋 專案概述

本專案為馬偕紀念醫院藥劑部開發的 LINE Bot 應用，藥師只需在 LINE 中拍攝藥品標籤或藥盒，系統自動透過 OCR 辨識藥品名稱，並即時查詢該藥品的存放位置與藥架編號，大幅減少人工翻找的時間。

---

## ✨ 功能

- **📸 拍照查詢** — 傳送藥品圖片，自動辨識藥品名稱
- **🔍 OCR 辨識** — 提取圖片中的藥品名稱文字
- **📍 位置回傳** — 比對資料庫，回傳藥架區域、櫃號、層號
- **⚡ 即時回應** — 透過 LINE Messaging API 即時回傳查詢結果

---

## 🛠️ 技術棧

| 技術 | 說明 |
|------|------|
| **Node.js** | 後端執行環境 |
| **Express** | Web 框架，處理 Webhook 路由 |
| **@line/bot-sdk** | LINE Messaging API 整合 |
| **Google APIs** | OCR 圖片文字辨識 |
| **@google-cloud/secret-manager** | API 金鑰安全管理 |
| **axios** | HTTP 請求（下載圖片） |
| **GCP Cloud Run** | 無伺服器容器化部署 |
| **dotenv** | 本機環境變數管理 |

---

## 📁 專案結構

```
linebot-ocr/
├── linebot-ocr/
│   ├── index.js              # 主程式入口
│   ├── package.json          # 套件設定
│   └── package-lock.json     # 套件鎖定檔
├── index.html                # GitHub Pages 展示頁
└── README.md
```

---

## 🚀 本地開發

### 環境需求

- Node.js 18+
- GCP 帳號（Cloud Run、Secret Manager）
- LINE Developers 帳號

### 安裝步驟

```bash
# 1. Clone 專案
git clone https://github.com/Tai-Ju/linebot-ocr.git
cd linebot-ocr/linebot-ocr

# 2. 安裝套件
npm install

# 3. 設定環境變數
cp .env.example .env
# 填入以下變數：
# CHANNEL_SECRET=your_line_channel_secret
# CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
# GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json

# 4. 啟動伺服器
node index.js
```

### 本機測試（使用 ngrok）

```bash
# 另開終端機
ngrok http 3000

# 將 ngrok 產生的 HTTPS URL 設定到 LINE Webhook URL
# https://xxxxxxxx.ngrok.io/webhook
```

---

## ☁️ GCP Cloud Run 部署

```bash
# 1. 建置 Docker 映像
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/linebot-ocr

# 2. 部署至 Cloud Run
gcloud run deploy linebot-ocr \
  --image gcr.io/YOUR_PROJECT_ID/linebot-ocr \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated

# 3. 將 Cloud Run URL 設定至 LINE Webhook
# https://your-service-xxxx-de.a.run.app/webhook
```

---

## 🔧 LINE Bot 設定

1. 前往 [LINE Developers Console](https://developers.line.biz/)
2. 建立 Messaging API Channel
3. 取得 `Channel Secret` 與 `Channel Access Token`
4. 設定 Webhook URL 為 Cloud Run 服務網址
5. 啟用 **Use webhook**，停用 **Auto-reply messages**

---

## 🔄 運作流程

```
使用者拍照 → LINE App
    ↓
LINE Messaging API（Webhook 事件）
    ↓
Express Server（GCP Cloud Run）
    ↓
下載圖片（axios）
    ↓
OCR 辨識（Google APIs）
    ↓
比對藥品位置資料庫
    ↓
LINE Bot 回傳查詢結果
```

---

## 🔒 安全性

- API 金鑰透過 **GCP Secret Manager** 統一管理，不直接寫入程式碼
- 本機開發使用 `.env` 檔案（已加入 `.gitignore`）
- LINE Webhook 驗證 `X-Line-Signature` 確保訊息來源合法

---

