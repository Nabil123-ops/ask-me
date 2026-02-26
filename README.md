# Ask Me · Premium AI Assistant

> A world-class AI chat application built with **Vite + React 18**, powered by the Anthropic API.

![Ask Me](https://img.shields.io/badge/Ask%20Me-Premium%20AI-0ea5e9?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNiIgZmlsbD0iIzBlYTVlOSIvPjxwYXRoIGQ9Ik05IDljMC0xLjY1IDEuMzUtMyAzLTNzMyAxLjM1IDMgM2MwIDEuMjktMSAxLjk1LTEuNzUgMi41OC0uNjMuNS0uODcuODctLjg3IDEuNTIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS4zIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjE3LjUiIHI9IjEiIGZpbGw9IndoaXRlIi8+PC9zdmc+)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite)

---

## ✨ Features

- **🤖 3 AI Models** — Octopus 4.2 (APEX) · Spider 5.0 (CORE) · Butterfly 3.1 (SWIFT)
- **🔌 16 Connectors** — Web Search, GitHub, Canva, Weather, Google Chrome, Docs, Sheets, Notion, Slack, Calendar, Image Gen, Code Runner, Maps, Spotify, File Analysis, Voice Input
- **🎙️ Real Voice Input** — Web Speech API integration
- **🐙 GitHub Integration** — Connect with Personal Access Token
- **💎 Premium UI** — Sky Blue + Beige + Gray · Playfair Display + Lato fonts
- **📝 Markdown Rendering** — Code blocks, headings, lists, blockquotes
- **🔄 Regenerate** — Retry any response
- **👍👎 Feedback** — Like/dislike responses
- **🗂️ Chat History** — Search, rename, delete · grouped by date
- **📎 File Attachments** — Attach files to messages
- **⚡ Response Styles** — Default · Concise · Detailed · Formal · Creative · Bullets
- **🚨 Error Boundary** — Graceful error handling with recovery UI

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
# → Opens at http://localhost:3000

# 3. Build for production
npm run build

# 4. Preview production build
npm preview
```

---

## 📁 Project Structure

```
ask-me/
├── index.html          # Entry HTML with SEO meta, fonts, critical CSS
├── vite.config.js      # Vite config with chunk splitting & optimization
├── package.json        # Dependencies & scripts
├── .gitignore          # Git ignore rules
└── src/
    ├── main.jsx        # React 18 createRoot entry point
    ├── App.jsx         # Root component with ErrorBoundary + Suspense
    └── AskMe.jsx       # Full application (models, chat, connectors, UI)
```

---

## 🔑 API Key

Ask Me uses the **Anthropic API**. The app calls `https://api.anthropic.com/v1/messages` directly from the browser (requires CORS to be enabled on your deployment, or use a backend proxy for production).

For production, set up a backend proxy and pass your API key securely via environment variables:

```bash
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
```

---

## 🏗️ Build Output

```
dist/
├── index.html
└── assets/
    ├── react-[hash].js      # React vendor chunk (cached separately)
    ├── index-[hash].js      # App bundle
    └── index-[hash].css     # Styles (if extracted)
```

---

## 🛠️ Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3 | UI framework |
| Vite | 5.4 | Build tool & dev server |
| @vitejs/plugin-react | 4.3 | React Fast Refresh |
| Anthropic API | v1 | AI responses |
| Web Speech API | native | Voice input |
| Google Fonts | hosted | Playfair Display + Lato |

---

## 📄 License

MIT © Ask Me
