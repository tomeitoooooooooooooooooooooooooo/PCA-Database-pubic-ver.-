const { GoogleSpreadsheet } = require('google-spreadsheet');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const KEYFILEPATH = path.join(__dirname, process.env.SPREADSHEET_KEYFILE);

async function getDoc(spreadsheetId) {
  const creds = JSON.parse(fs.readFileSync(KEYFILEPATH, 'utf8'));
  const doc = new GoogleSpreadsheet(spreadsheetId);

  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key.replace(/\\n/g, '\n'),
  });

  await doc.loadInfo();
  return doc;
}

async function appendLog(spreadsheetId, sheetName, log) {
  try {
    const doc = await getDoc(spreadsheetId);
    let sheet = doc.sheetsByTitle[sheetName];
    if (!sheet) {
      sheet = await doc.addSheet({ title: sheetName, headerValues: [
        'timestamp','name','citizenId','crimes','licensePlate','fineAmount','deadline','registeredBy'
      ]});
    }

    const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

    await sheet.addRow({
      timestamp: now,
      name: log.name,
      citizenId: log.citizenId,
      crimes: log.crimes,
      licensePlate: log.licensePlate,
      fineAmount: log.fineAmount,
      deadline: log.deadline,
      registeredBy: log.registeredBy,
    });

    console.log('✅ ログを追加しました');
  } catch (error) {
    console.error('❌ スプレッドシート書き込みエラー:', error);
  }
}

module.exports = { appendLog, getDoc };
