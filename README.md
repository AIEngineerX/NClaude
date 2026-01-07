# NIgga Claude AI 🔥

A satirical AI chat interface inspired by Claude's design, but with a street-savvy personality. Dark Claude responds with slang, emojis, and attitude while maintaining the clean, minimal aesthetic of modern AI interfaces.

## Features

- 🎨 **Clean Dark UI** - Sleek interface matching Claude's design language
- 💬 **Pattern-Matching AI** - Context-aware responses based on keyword detection
- 🧠 **Memory System** - Remembers your name and conversation context
- 🔥 **Street Slang** - Satirical responses with urban vernacular
- ⚡ **Real-time Chat** - Instant responses with typing indicators
- 📱 **Responsive Design** - Works on desktop and mobile

## Demo

Just open `index.html` in your browser and start chatting!

## Topics Dark Claude Knows About

- 💻 **Coding & Programming** (JavaScript, Python, HTML/CSS)
- 🌐 **Web Development** (Frontend/Backend)
- 🤖 **AI & Machine Learning**
- 🪙 **Crypto & Blockchain** (Bitcoin, Ethereum, Solana, Web3)
- 🎯 **General Problem Solving**

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

3. Start chatting with Dark Claude!

## File Structure

```
dark-claude-ai/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # AI logic and chat functionality
└── README.md       # This file
```

## Customization

### Change the Personality

Edit the `knowledgeBase` object in `script.js` to add new response patterns or modify existing ones:

```javascript
greetings: {
    patterns: [/^(hi|hello|hey)/i],
    responses: [
        "Your custom greeting here!"
    ]
}
```

### Modify the Design

All styling is in `styles.css`. Key variables:
- Background: `#1a1a1a`
- Primary black: `#000`
- Text color: `#e8e8e8`
- Border color: `#2a2a2a`

### Add New Topics

Add new categories to the `knowledgeBase`:

```javascript
newTopic: {
    patterns: [/keyword|another keyword/i],
    responses: [
        "Response option 1",
        "Response option 2"
    ]
}
```

## How It Works

Dark Claude uses a simple pattern-matching system:

1. **User Input** - Takes your message
2. **Pattern Matching** - Checks against regex patterns in knowledge base
3. **Context Awareness** - Remembers your name and topics discussed
4. **Response Selection** - Picks a random response from matched category
5. **Display** - Shows response with typing animation

No actual AI model runs - it's all JavaScript pattern matching, making it lightning fast and zero-cost to run!

## Deploy

### GitHub Pages
1. Push to GitHub
2. Go to Settings > Pages
3. Select main branch
4. Your site will be live at `https://yourusername.github.io/dark-claude-ai`

### Netlify
1. Drag the folder to [netlify.com/drop](https://netlify.com/drop)
2. Done! Instant deploy.

### Vercel
```bash
npm i -g vercel
vercel
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## License

MIT License - feel free to use this however you want!

## Contributing

Pull requests welcome! Feel free to add:
- More response patterns
- New topics/categories
- UI improvements
- Bug fixes

## Credits

Design inspired by Anthropic's Claude interface. Built as a satirical project for fun and learning.

---

**Note:** This is a parody project and is not affiliated with Anthropic or Claude AI. It's purely for entertainment and educational purposes! 😎💯
