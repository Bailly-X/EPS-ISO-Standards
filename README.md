# EPS-ISO-Standards – Browser Extension

This is a browser plugin developed as part of the EPS project to promote plain language using interactive mini-games and reminders.

## 🚀 How to Run the Plugin

Follow these steps to set up and test the plugin locally:

### 1. Install Dependencies

Open your terminal (CMD or PowerShell), then run:

```bash
npm install
npm run build
```
This will generate a dist/ folder containing the compiled extension.

⚠️ If you make changes to the source code, you will need to run npm run build again to update the plugin.

3. Load the Extension in Google Chrome
Open Chrome and go to chrome://extensions

Enable Developer Mode (top right corner)

Click Load unpacked

Select the dist/ folder that was created after building the project

✅ You should now see and use the plugin in your browser!

🧪 Development Notes
This project uses Vite for fast bundling and development

Firebase is used for user authentication
