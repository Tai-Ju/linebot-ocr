const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
require('dotenv').config();

// 初始化 Secret Manager 客戶端
const secretManagerClient = new SecretManagerServiceClient();

// 獲取秘密的函數
async function getSecret(secretName) {
  try {
    const [version] = await secretManagerClient.accessSecretVersion({
      name: `projects/YOUR_PROJECT_ID/secrets/${secretName}/versions/latest`,
    });
    return version.payload.data.toString();
  } catch (error) {
    console.error(`獲取秘密 ${secretName} 時發生錯誤:`, error);
    throw error;
  }
}

// 初始化環境變數
let CHANNEL_ACCESS_TOKEN, CHANNEL_SECRET, VISION_API_KEY, SHEET_ID, SHEET_NAME;

// 在函數啟動時獲取所有秘密
async function initializeSecrets() {
  try {
    // 獲取 LINE Bot 相關的秘密
    CHANNEL_ACCESS_TOKEN = await getSecret('LINE_CHANNEL_ACCESS_TOKEN');
    CHANNEL_SECRET = await getSecret('LINE_CHANNEL_SECRET');
    
    // 獲取其他秘密
    VISION_API_KEY = await getSecret('VISION_API_KEY');
    SHEET_ID = await getSecret('SHEET_ID');
    SHEET_NAME = await getSecret('SHEET_NAME');

    // 驗證環境變數
    console.log('=== 環境變數檢查 ===');
    console.log('CHANNEL_ACCESS_TOKEN:', CHANNEL_ACCESS_TOKEN ? '已設定' : '未設定');
    console.log('CHANNEL_SECRET:', CHANNEL_SECRET ? '已設定' : '未設定');
    console.log('VISION_API_KEY:', VISION_API_KEY ? '已設定' : '未設定');
    console.log('SHEET_ID:', SHEET_ID ? '已設定' : '未設定');
    console.log('SHEET_NAME:', SHEET_NAME ? '已設定' : '未設定');
    console.log('==================');

    // 驗證 LINE Bot 密鑰
    if (!CHANNEL_ACCESS_TOKEN || !CHANNEL_SECRET) {
      throw new Error('LINE Bot 密鑰未正確設定');
    }
  } catch (error) {
    console.error('初始化秘密時發生錯誤:', error);
    throw error;
  }
}

// 在函數啟動時初始化
initializeSecrets().catch(console.error);

// Cache for sheet data
let sheetDataCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cloud Functions entry point
exports.lineBot = async (req, res) => {
  console.log('=== 收到請求 ===');
  console.log('請求方法:', req.method);
  console.log('請求路徑:', req.path);
  console.log('請求標頭:', JSON.stringify(req.headers, null, 2));
  console.log('請求內容:', JSON.stringify(req.body, null, 2));
  console.log('================');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send('');
    return;
  }

  // Handle LINE webhook (both root path and /webhook)
  if ((req.path === '/' || req.path === '/webhook') && req.method === 'POST') {
    try {
      console.log('=== 收到 Webhook 請求 ===');
      console.log('請求內容:', JSON.stringify(req.body, null, 2));
      
      const events = req.body.events;
      if (!events || !Array.isArray(events)) {
        console.error('錯誤：無效的事件格式');
        res.status(400).send('Bad Request');
        return;
      }

      for (const event of events) {
        console.log('處理事件:', JSON.stringify(event, null, 2));
        try {
          await handleEvent(event);
        } catch (error) {
          console.error('處理事件時發生錯誤:', error);
        }
      }
      
      res.status(200).send('OK');
      return;
    } catch (error) {
      console.error('Webhook 錯誤:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
  }

  // Handle root path GET request
  if (req.path === '/' && req.method === 'GET') {
    console.log('根路徑被訪問');
    res.status(200).send('LINE Bot is running');
    return;
  }

  // Handle 404 for all other routes
  console.error('錯誤：找不到路徑:', req.path);
  res.status(404).send('Not Found');
};

function extractKeywordsFromOCR(text) {
  console.log('開始從 OCR 結果提取關鍵字');
  const keywords = [];
  
  // 提取商品名（通常是第一個大寫字母開頭的單字）
  const brandNameMatch = text.match(/^[A-Z][a-zA-Z]+/);
  if (brandNameMatch) {
    keywords.push(brandNameMatch[0]);
    console.log('找到商品名:', brandNameMatch[0]);
  }
  
  // 提取數字代碼（通常是藥品代碼）
  const codeMatch = text.match(/\b\d{5,}\b/);
  if (codeMatch) {
    keywords.push(codeMatch[0]);
    console.log('找到藥品代碼:', codeMatch[0]);
  }
  
  // 提取英文藥品名稱（通常是大寫字母開頭的單字）
  const nameMatch = text.match(/\b[A-Z][a-zA-Z]+\b/g);
  if (nameMatch) {
    keywords.push(...nameMatch);
    console.log('找到藥品名稱:', nameMatch);
  }
  
  // 提取製造商名稱（通常是包含"藥廠"或"藥品"的中文）
  const manufacturerMatch = text.match(/[\u4e00-\u9fa5]+藥(廠|品)/);
  if (manufacturerMatch) {
    keywords.push(manufacturerMatch[0]);
    console.log('找到製造商:', manufacturerMatch[0]);
  }
  
  console.log('提取的關鍵字:', keywords);
  return keywords;
}

async function handleEvent(event) {
  if (event.type !== 'message') return null;

  let messageText = '';

  if (event.message.type === 'image') {
    try {
      console.log('處理圖片訊息');
      const imageBuffer = await downloadImage(event.message.id);
      messageText = await detectTextFromImage(imageBuffer);
      console.log('OCR 結果:', messageText);
      
      // 從 OCR 結果提取關鍵字
      const keywords = extractKeywordsFromOCR(messageText);
      
      // 使用所有關鍵字進行搜尋
      let matchedRow = null;
      for (const keyword of keywords) {
        const sheetData = await getSheetData();
        matchedRow = findMatchingRow(sheetData, keyword);
        if (matchedRow) {
          console.log('使用關鍵字找到匹配:', keyword);
          break;
        }
      }
      
      if (!matchedRow) {
        console.log('找不到符合的資料');
        await sendReply(event.replyToken, {
          type: 'text',
          text: '❗找不到符合的藥品資訊，請確認藥品名稱或代碼是否正確'
        });
        return;
      }

      console.log('找到符合的資料:', matchedRow);
      const messages = generateResponseMessages(matchedRow, messageText);
      console.log('回覆訊息:', messages);
      await sendReply(event.replyToken, messages);
    } catch (err) {
      console.error('OCR 失敗:', err);
      await sendReply(event.replyToken, {
        type: 'text',
        text: '❗無法辨識圖片，請再試一次或提供清晰照片'
      });
      return;
    }
  } else if (event.message.type === 'text') {
    console.log('處理文字訊息');
    messageText = event.message.text.trim().toLowerCase();
    console.log('訊息內容:', messageText);
  } else {
    console.log('不支援的訊息類型:', event.message.type);
    await sendReply(event.replyToken, {
      type: 'text',
      text: '⚠️ 僅支援文字與圖片查詢'
    });
    return;
  }

  const keyword = messageText.replace(/採購|預包|庫存|位置/g, '').trim();
  console.log('關鍵字:', keyword);
  
  if (messageText === 'menu' || messageText === '選單') {
    console.log('顯示選單');
    return sendMenuMessage(event.replyToken);
  }

  try {
    console.log('查詢資料');
    const sheetData = await getSheetData();
    const matchedRow = findMatchingRow(sheetData, keyword);
    
    if (!matchedRow) {
      console.log('找不到符合的資料');
      await sendReply(event.replyToken, {
        type: 'text',
        text: '❗找不到符合的藥品資訊，請確認藥品名稱或代碼是否正確'
      });
      return;
    }

    console.log('找到符合的資料:', matchedRow);
    const messages = generateResponseMessages(matchedRow, messageText);
    console.log('回覆訊息:', messages);
    await sendReply(event.replyToken, messages);
  } catch (error) {
    console.error('處理請求時發生錯誤:', error);
    await sendReply(event.replyToken, {
      type: 'text',
      text: '❌ 處理請求時發生錯誤，請稍後再試'
    });
  }
}

async function sendMenuMessage(replyToken) {
  const menuText =
    '📋 功能說明：\n' +
    '本LINE Bot 可查詢藥品資訊，包含以下功能：\n\n' +
    '🔍 藥品位置：查詢 B1UD 位置與庫存位置\n' +
    '🛒 採購方式：查詢藥品的採購方式\n' +
    '📦 預包資訊：查詢是否預包（木櫃/鐵架）\n' +
    '📍 庫存狀態：查詢是否有庫存與儲位\n\n' +
    '📌 請輸入藥品名稱或代碼 + 關鍵字\n\n' +
    '📎 查詢範例：\n' +
    '• 30925 位置\n' +
    '• SABS 採購\n' +
    '• 30925 預包\n' +
    '• SABS 庫存';

  await sendReply(replyToken, {
    type: 'text',
    text: menuText
  });
}

async function sendReply(replyToken, messages) {
  try {
    const payload = {
      replyToken: replyToken,
      messages: Array.isArray(messages) ? messages : [messages]
    };

    console.log('發送回覆:', JSON.stringify(payload, null, 2));
    console.log('使用 Channel Access Token:', CHANNEL_ACCESS_TOKEN);
    
    const response = await axios.post('https://api.line.me/v2/bot/message/reply', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
      }
    });
    
    console.log('回覆成功:', response.status);
  } catch (error) {
    console.error('回覆失敗:', error.response ? error.response.data : error.message);
    throw error;
  }
}

function findMatchingRow(sheetData, keyword) {
  console.log('開始搜尋關鍵字:', keyword);
  const searchTerm = keyword.toLowerCase();
  
  return sheetData.find(row => {
    // 檢查藥品代碼（第一列）
    if (row[0] && row[0].toString().toLowerCase().includes(searchTerm)) {
      console.log('找到藥品代碼匹配:', row[0]);
      return true;
    }
    
    // 檢查藥品名稱（第四列）
    if (row[3]) {
      const fullName = row[3].toString().toLowerCase();
      
      // 檢查完整名稱
      if (fullName.includes(searchTerm)) {
        console.log('找到完整名稱匹配:', row[3]);
        return true;
      }
      
      // 檢查部分匹配（每個單字）
      const searchWords = searchTerm.split(/\s+/);
      const nameWords = fullName.split(/\s+/);
      
      // 如果任何搜尋單字出現在名稱中
      if (searchWords.some(word => nameWords.some(nameWord => nameWord.includes(word)))) {
        console.log('找到部分匹配:', row[3]);
        return true;
      }
    }
    
    return false;
  });
}

function generateResponseMessages(matchedRow, messageText) {
  const getValue = (val) => (val && val.toString().trim() !== '' ? val : 'NA');
  const messages = [];
  let reply = '';

  if (messageText.includes('採購')) {
    reply = `🔸 品名：${getValue(matchedRow[3])}\n🛒 採購方式：${getValue(matchedRow[4])}`;
  } else if (messageText.includes('預包')) {
    reply = `🔸 品名：${getValue(matchedRow[3])}\n🧊 木櫃預包：${getValue(matchedRow[6])}\n🧊 鐵架預包：${getValue(matchedRow[7])}`;
  } else if (messageText.includes('庫存')) {
    reply = `🔸 品名：${getValue(matchedRow[3])}\n📦 庫存狀態：${getValue(matchedRow[5])}\n📍 庫存位置：${getValue(matchedRow[2])}`;
  } else {
    reply = `🔸 Mcode：${getValue(matchedRow[0])}\n📍 B1UD位置：${getValue(matchedRow[1])}\n📦 庫存位置：${getValue(matchedRow[2])}\n🔸 品名：${getValue(matchedRow[3])}`;
  }

  messages.push({ type: 'text', text: reply });

  const imageUrl = getValue(matchedRow[8]);
  if (imageUrl !== 'NA' && imageUrl.startsWith('http')) {
    messages.push({
      type: 'image',
      originalContentUrl: imageUrl,
      previewImageUrl: imageUrl
    });
  }

  return messages;
}

async function getSheetData() {
  const now = Date.now();
  if (sheetDataCache && (now - lastCacheUpdate) < CACHE_DURATION) {
    return sheetDataCache;
  }

  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: SHEET_NAME
  });
  
  sheetDataCache = res.data.values;
  lastCacheUpdate = now;
  return sheetDataCache;
}

async function downloadImage(messageId) {
  console.log('開始下載圖片，messageId:', messageId);
  try {
    const res = await axios.get(`https://api-data.line.me/v2/bot/message/${messageId}/content`, {
      responseType: 'arraybuffer',
      headers: { Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}` },
    });
    console.log('圖片下載成功，大小:', res.data.length, 'bytes');
    if (res.data.length > 10 * 1024 * 1024) {
      throw new Error('圖片大小超過 10MB 限制');
    }
    return Buffer.from(res.data, 'binary');
  } catch (error) {
    console.error('圖片下載失敗:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function detectTextFromImage(imageBuffer) {
  console.log('開始進行 OCR 辨識，圖片大小:', imageBuffer.length, 'bytes');
  try {
    const base64Image = imageBuffer.toString('base64');
    console.log('Base64 圖片長度:', base64Image.length);
    
    const visionRes = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
      {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: 'TEXT_DETECTION' }]
          }
        ]
      }
    );
    
    console.log('OCR API 回應狀態:', visionRes.status);
    console.log('OCR 辨識結果:', visionRes.data);
    
    if (!visionRes.data.responses || !visionRes.data.responses[0]) {
      throw new Error('OCR API 回應格式錯誤');
    }
    
    const text = visionRes.data.responses[0].fullTextAnnotation?.text || '';
    console.log('辨識到的文字:', text);
    return text;
  } catch (error) {
    console.error('OCR 辨識失敗:', error.response ? error.response.data : error.message);
    throw error;
  }
} 
