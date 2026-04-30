# ⚡ CodeReview AI

An AI-powered code review tool built with **Next.js 14** and **Claude AI**. Paste any code and get instant feedback on bugs, security issues, performance, and best practices.

## 🚀 Features

- 🐛 **Bug Detection** — Logic errors, null pointers, edge cases
- 🔒 **Security Scan** — SQL injection, XSS, hardcoded secrets
- ⚡ **Performance Issues** — Inefficiencies and bottlenecks
- ✨ **Best Practices** — Clean code & improvement suggestions
- 📊 **Quality Score** — 0–100 rating with visual ring indicator
- 💡 **Suggested Fixes** — Expandable cards with code snippets
- 🌐 **14+ Languages** — JS, TS, Python, Java, Go, Rust, and more

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Claude AI API** (claude-opus-4-5)

## ⚙️ Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
```bash
cp .env.local.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
```

Get your API key from [console.anthropic.com](https://console.anthropic.com)

### 3. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-code-reviewer/
├── app/
│   ├── api/review/route.ts   # Claude AI API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx
│   └── page.tsx              # Main UI
├── components/
│   ├── IssueCard.tsx         # Expandable issue card
│   └── ScoreRing.tsx         # Animated score ring
├── lib/
│   └── types.ts              # TypeScript types & config
└── .env.local.example
```

## 🔧 How It Works

1. User pastes code and selects language
2. Frontend calls `/api/review` endpoint
3. Next.js server sends code to Claude API with structured prompt
4. Claude returns JSON with score, issues, positives, and tips
5. UI renders results with expandable issue cards

## 📸 Resume Description

> Built a full-stack AI code review tool using Next.js 14 and Claude AI API. The app analyzes code for bugs, security vulnerabilities, and performance issues, returning structured feedback with severity ratings and suggested fixes. Implemented streaming API integration, TypeScript types, and a responsive dark-mode UI with animated score visualization.
