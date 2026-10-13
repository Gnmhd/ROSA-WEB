const express = require('express');
const app = express();
const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const P = require('pino');
const QRCode = require('qrcode');
const fs = require('fs-extra');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessions = {}; // { id: { qr, code, sessionId, status } }

const HOME_HTML = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ROSA-MD</title>
<style>
body{margin:0;min-height:100vh;background:#050505;display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif}
.card{background:#121212;border:1px solid #2a2a2a;border-radius:24px;padding:32px 24px;width:90%;max-width:360px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.8)}
h1{color:#d4af37;letter-spacing:2px;margin:0;font-size:32px;font-weight:900}
.sub{color:#888;letter-spacing:4px;margin:12px 0 28px;font-size:13px}
.btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:16px;border-radius:14px;border:0;margin:12px 0;font-weight:800;font-size:14px;cursor:pointer;text-decoration:none;transition:0.2s}
.btn-gold{background:linear-gradient(135deg,#d4af37,#f5d76e);color:#000}
.btn-dark{background:#1e1e1e;color:#d4af37;border:1px solid #333}
.btn:hover{transform:scale(1.02)}
.footer{color:#d4af37;margin-top:28px;font-weight:800;letter-spacing:3px;font-size:14px}
.qrbox{background:white;padding:12px;border-radius:12px;display:inline-block;margin:15px 0}
</style></
