# 🚀 Salesforce PowerTools – Chrome Extension

Supercharge your Salesforce experience directly in the browser!  
This Chrome Extension helps admins, developers, and power users interact with Salesforce faster, smarter, and more efficiently.

![screenshot](https://user-images.githubusercontent.com/your-screenshot.png) <!-- optional preview -->

---

## ✨ Features

✅ **Quick Record Copying**  
Copy Salesforce Record IDs or URLs in one click from any page.

✅ **AI-Generated Call Logs**  
Generate professional call summaries using OpenAI — and log them instantly into Salesforce.

✅ **Field API Name Toggler**  
Toggle between labels and API names for any form field on the page.

✅ **Auto-Fill Forms**  
Save and apply custom field templates to reduce data entry time.

✅ **Lead Analytics Dashboard**  
Visualize lead creation trends directly inside your extension.

✅ **Custom Object Fetcher**  
Pull and preview data from any custom Salesforce object.

✅ **Localization (Multi-language)**  
Extension supports multiple languages — easily switch in the settings.

✅ **Secure Key Storage with Encryption**  
API keys and Salesforce tokens are encrypted and stored securely using browser crypto and sync storage.

✅ **Extension Sync with Salesforce**  
Store your preferences and logs in Salesforce as custom objects — all via REST API.

---

## 🧠 How It Works

This extension uses:
- `chrome.identity` to authenticate with Salesforce via OAuth2
- `chrome.scripting` to inject helpers into Salesforce pages
- `chrome.storage.sync` to store encrypted tokens and preferences
- OpenAI API to generate smart summaries and notes

---

## 📦 Installation

1. Clone or download this repo.
2. Open **Chrome > Extensions > Developer Mode**.
3. Click **“Load unpacked”** and select this folder.
4. Click the 🧩 Extension icon on any Salesforce tab.

---

## ⚙️ Setup

### 🔑 Add OpenAI API Key

- Go to **Settings** inside the extension
- Paste your OpenAI key (GPT-3.5 or GPT-4)
- Your key is encrypted in `chrome.storage.sync`

### 🔐 Connect to Salesforce

- Click **"Login to Salesforce"** inside the popup
- Authenticate with your Salesforce account
- Done — the token is securely stored

---

## 🔒 Security

- OAuth2 token and API keys are encrypted using browser crypto (`crypto.subtle`)
- Sensitive data is never sent to third-party servers
- Fully client-side — your Salesforce session stays safe

---

## 📁 Folder Structure

/icons → Extension icons
/popup.html → UI interface
/popup.js → Main logic (modularized)
/dashboard.html → Analytics dashboard
/manifest.json → Chrome extension manifest
/storage.js → Encrypted storage helpers
/crypto.js → AES-GCM encryption utilities
/locales/ → Multi-language support


---

## 🌍 Supported Languages

- English 🇺🇸
- Spanish 🇪🇸 (coming soon)
- Tagalog 🇵🇭 (coming soon)

---

## 🤝 Contributing

We welcome contributions!
- Add features
- Improve localization
- File bug reports

Fork, commit, and open a PR.

---

## 📜 License

MIT License © 2025  
Built with ❤️ by [Mark Anthony Morales]

