# Dark Claude AI 🔥

A satirical AI chat interface with aggressive hood energy. Built for crypto degens on Solana.

## Features

- 🎨 **Smooth Dark UI** - Premium glassmorphism design
- 💬 **Pattern-Matching AI** - Understands pump.fun, Solana CT culture, degen slang
- 🧠 **Local Storage** - Your chats saved in YOUR browser only
- 🔥 **Hood Energy** - Aggressive, direct, no-nonsense responses
- ⚡ **Portal Buttons** - Quick links to CA, Dex, X Community
- 📱 **Responsive** - Works on desktop and mobile

## Privacy & Data Storage

**IMPORTANT: This uses LOCAL STORAGE (browser-based storage)**

### Current Setup (Single User):
- All chats stored in YOUR browser's localStorage
- Data NEVER leaves your computer
- Each person sees ONLY their own chats
- No server, no database, completely private

### If You Deploy This Online:
**Everyone will have SEPARATE chats** because:
- localStorage is per-browser, per-device
- User A's chats on their computer ≠ User B's chats on their computer
- It's like each person having their own private notepad

### To Make Chats Shared (Public):
You would need to add:
1. **Backend server** (Node.js, Python, etc.)
2. **Database** (MongoDB, PostgreSQL, Firebase)
3. **API endpoints** to save/load chats
4. **Authentication** (optional, to identify users)

Without these, everyone has their own private chat history.

## Quick Start

1. Clone this repository
```bash
git clone https://github.com/yourusername/dark-claude-ai.git
cd dark-claude-ai
```

2. Open `index.html` in your browser
```bash
# On Mac
open index.html

# On Linux  
xdg-open index.html

# On Windows
start index.html
```

3. Start chatting!

## Features Breakdown

### Portal Buttons
- **Dex** - Info about DEX listings (Raydium/Jupiter)
- **CA** - Contract Address inquiries (redirects to X)
- **X Community** - Twitter/X community link
- **Help** - General capabilities

### Chat Management
- **New Chat** - Returns to welcome screen
- **Chat History** - Sidebar shows all your conversations
- **Delete Chat** - Hover over chat, click X to delete
- **Auto-Save** - Every message automatically saved

### Knowledge Base
Understands and responds to:
- Pump.fun mechanics (bonding curves, graduation, launching)
- Solana degen culture (CT, aping, rugs, moon missions)
- KOL behavior (shilling, exit liquidity, paid calls)
- Token metrics (market cap, liquidity, holder distribution)
- Rug detection (red flags, honeypots, scams)
- Trading strategy (entries, exits, profit taking)
- Crypto slang (gm, ngmi, wagmi, ser, frens, jeets)
- Scam awareness (airdrops, phishing, wallet drainers)

## Customization

### Change Responses
Edit `script.js` - find the `knowledgeBase` object:

```javascript
greetings: {
    patterns: [/pattern here/i],
    responses: [
        "your response here",
        "another response"
    ]
}
```

### Change Colors
Edit `styles.css`:
- Background: `#1a1a1a`
- Black accents: `#000`
- Text: `#e8e8e8`

### Add New Topics
Add to `knowledgeBase` in `script.js`:

```javascript
newTopic: {
    patterns: [/keyword|another/i],
    responses: [
        "response 1",
        "response 2"
    ]
}
```

## Deploy Online

### GitHub Pages (Free)
1. Push to GitHub
2. Settings > Pages
3. Select main branch
4. Live at `https://yourusername.github.io/dark-claude-ai`

### Netlify (Free)
```bash
# Drag folder to netlify.com/drop
# Or use CLI:
npm i -g netlify-cli
netlify deploy
```

### Vercel (Free)
```bash
npm i -g vercel
vercel
```

## Clear All Data

To delete all saved chats:
1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Refresh page

Or use the "Clear All Chats" button (if you add it).

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)  
- ✅ Safari (latest)
- ✅ Mobile browsers

## Technical Stack

- Pure HTML/CSS/JavaScript (no frameworks)
- localStorage API for chat persistence
- Pattern matching for "AI" responses
- No external dependencies

## License

MIT License - use however you want!

## Credits

Inspired by Claude's design. Built for the Solana degen community. Not affiliated with Anthropic.

---

**Disclaimer:** This is a satirical project. Pattern-matching responses, not real AI. Do your own research (DYOR) on any crypto projects. 💯
