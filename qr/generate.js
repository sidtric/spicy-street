const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const TOTAL_TABLES = parseInt(process.argv[2]) || 10;
const OUTPUT_DIR = path.join(__dirname, 'qr-codes');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

async function generateQRs() {
  for (let table = 1; table <= TOTAL_TABLES; table++) {
    const url = `${BASE_URL}/?table=${table}`;
    const filePath = path.join(OUTPUT_DIR, `table-${table}.png`);
    await QRCode.toFile(filePath, url, {
      color: { dark: '#e85d04', light: '#ffffff' },
      width: 300,
      margin: 2,
    });
    console.log(`Table ${table}: ${url} → ${filePath}`);
  }
  console.log(`\n✅ Generated ${TOTAL_TABLES} QR codes in ${OUTPUT_DIR}`);
}

generateQRs().catch(console.error);
