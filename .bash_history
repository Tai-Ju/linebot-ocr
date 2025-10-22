nano index.js
const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');
const line = require('@line/bot-sdk');
require('dotenv').config();
const app = express();
app.use(express.json());
const config = {
};
const client = new line.Client(config);
const SHEET_ID = process.env.SHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;
const VISION_API_KEY = process.env.VISION_API_KEY;
app.post('/webhook', async (req, res) => {
});
async function handleEvent(event) {
}
async function downloadImage(messageId) {
}
async function detectTextFromImage(imageBuffer) {
}
async function getSheetData() {
}
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
});
const axios = require('axios');
nano index.js
nano package.json
nano .env.yaml
clear
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1   --gen1
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1   --no-gen2
gcloud functions delete linebotOCR --region=asia-east1
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1   --no-gen2
nano index.js
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1   --no-gen2
nano index.js
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1   --no-gen2
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1   --source=.   --no-gen2
nano index.js
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1   --source=.   --no-gen2
ls
nano .env.yaml
node index.js
npm init -y
npm install express axios @line/bot-sdk googleapis dotenv
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1   --source=.   --no-gen2
head -n 10 index.js
tail -n 10 index.js
pwd
ls -l
nano .env.yaml
ls -l
cat .env.yaml
nano .env.yaml
ls -l
nano .env.yaml
ls -1
nano .env.yaml
ls -al
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1   --source=.   --no-gen2
tail -n 5 index.js
cat index.js | grep module.exports
cat index.js
ls -al
mkdir linebot-ocr
cd linebot-ocr
mv ~/index.js ~/package.json ~/package-lock.json ~/.env.yaml ./
cp -r ~/node_modules ./
ls -al
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1   --source=.   --no-gen2
grep 'module.exports' index.js
node -v
npm init -y
npm install
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file=.env.yaml   --region=asia-east1   --source=.   --no-gen2
gcloud functions describe linebotOCR --region=asia-east1
curl https://asia-east1-xxx.cloudfunctions.net/linebotOCR
nano index.js
// 測試用最簡單 index.js
const express = require('express');
const app = express();
app.get('/', (req, res) => {
});
module.exports = app;
clear
nano index.js
gcloud functions deploy linebotOCR   --entry-point=app   --runtime=nodejs18   --trigger-http   --allow-unauthenticated   --region=asia-east1   --source=.   --no-gen2
nano nano index.j
nano index.js
npm install
la-1
ls -1
ls -2
ls
cat .env.yaml
ls -a
node -v
gcloud functions deploy lineBot   --runtime nodejs18   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 256MB   --timeout 60s
gcloud builds log cecb812b-94a5-4b81-96b0-cdd174de9aef
cat .env.yaml
gcloud config list
# 設定區域（例如：asia-east1 或 us-central1）
gcloud config set compute/region asia-east1
# 設定時區
gcloud config set compute/zone asia-east1-a
gcloud services list --enabled
gcloud config set compute/region asia-east1
gcloud functions deploy lineBot   --runtime nodejs20   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 256MB   --timeout 60s   --region asia-east1
gcloud functions logs read lineBot --region asia-east1
nano index.js
gcloud functions deploy lineBot   --runtime nodejs20   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 512MB   --timeout 120s   --region asia-east1   --entry-point lineBot
nano index.js
gcloud functions deploy lineBot   --runtime nodejs20   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 512MB   --timeout 120s   --region asia-east1   --entry-point lineBot
nano index.js
gcloud functions deploy lineBot   --runtime nodejs20   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 512MB   --timeout 120s   --region asia-east1   --entry-point lineBot
gcloud functions logs read lineBot --region asia-east1
nano index.js
gcloud functions deploy lineBot   --runtime nodejs20   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 512MB   --timeout 120s   --region asia-east1   --entry-point lineBot
gcloud functions logs read lineBot --region asia-east1
nano index.js
gcloud functions deploy lineBot   --runtime nodejs20   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 512MB   --timeout 120s   --region asia-east1   --entry-point lineBot
nano index.js
gcloud functions deploy lineBot   --runtime nodejs20   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 512MB   --timeout 120s   --region asia-east1   --entry-point lineBot
gcloud functions logs read lineBot --region asia-east1
nano index.js
gcloud functions deploy lineBot   --runtime nodejs20   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 512MB   --timeout 120s   --region asia-east1   --entry-point lineBot
gcloud functions logs read lineBot --region asia-east1 --limit=10
nano .env.yaml
nano index.js
nano .env.yaml
nano index.ja
nano index.js
gcloud functions deploy lineBot   --runtime nodejs20   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 512MB   --timeout 120s   --region asia-east1   --entry-point lineBot
nano index.js
gcloud functions deploy lineBot   --runtime nodejs20   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 512MB   --timeout 120s   --region asia-east1   --entry-point lineBot
nano .env.yaml
nano index.js
gcloud functions deploy lineBot   --runtime nodejs20   --trigger-http   --allow-unauthenticated   --env-vars-file .env.yaml   --memory 512MB   --timeout 120s   --region asia-east1   --entry-point lineBot
gcloud functions logs read lineBot --region asia-east1 --stream
gcloud functions logs read lineBot --region asia-east1 --limit=100
nano index.js
gcloud functions deploy lineBot --runtime nodejs20 --trigger-http --allow-unauthenticated --memory 512MB --timeout 120s --region asia-east1 --entry-point lineBot
gcloud functions logs read lineBot --region asia-east1 --limit=50
nano index.js
gcloud functions deploy lineBot --runtime nodejs20 --trigger-http --allow-unauthenticated --memory 512MB --timeout 120s --region asia-east1 --entry-point lineBot
cd ~           # 回到主目錄
ls -al         # 查看所有檔案（包含隱藏檔）
cd linebot-ocr
ls -al
cat index.js
cd ~           # 回到主目錄
ls -al         # 查看所有檔案（包含隱藏檔）
nano  package.json
cat package.json
cat index.js
cd linebot-ocr
ls -al
📁 linebot-ocr/
cd linebot-ocr
ls -al
cat .env.yaml        # 看環境變數格式是否正確
cat index.js         # 快速查看主程式是否正常或有錯誤訊息
nano index.js
cat index.js
clear
nano index.js
ls -la
find . -name "*.py" -type f
cat README-cloudshell.txt
history | grep -E "(python|flask|line|bot)"
gcloud functions list
cd linebot-ocr/
ls -la
gcloud functions logs read lineBot --region=asia-east1 --limit=20
ls -la
zip -r my-project.zip
pwd
ls -la
cd linebot-oor
cd linebot-ocr
ls -la
find . -name "*.py" -type f
ls *.yaml *.txt *.json 2>/dev/null || echo "沒找到設定檔"
cat index.js | head -20
cat package.json
echo "Environment variables file exists: .env.yaml"
pwd
zip -r ../linebot-ocr-project.zip . -x "node_modules/*"
ls -lh ../linebot-ocr-project.zip
history
find . -name "*.py"
cat ~/linebot-ocr/index.js
ls-la
ls -la
