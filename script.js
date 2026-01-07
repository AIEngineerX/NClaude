const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Conversation context memory
let conversationContext = {
    userName: null,
    topics: [],
    vibe: 'street',
    previousQuestion: null
};

// Knowledge base - Street edition
const knowledgeBase = {
    // Greetings
    greetings: {
        patterns: [/^(hi|hello|hey|greetings|sup|yo|wassup|what's good|wsg)/i],
        responses: [
            "Ayy wassup my guy! What you need help wit today? 🔥",
            "Yooo what's brackin'? Pull up, I gotchu! 💯",
            "What's good fam! Slide thru wit ya questions! 🙌",
            "Ayy there he is! What we workin' on today? Let's get it! 💪",
            "Ayo! What's poppin'? I'm here to help ya out fr fr 🎯"
        ]
    },

    // Name detection
    nameIntro: {
        patterns: [/my name is (\w+)/i, /i'm (\w+)/i, /call me (\w+)/i, /this is (\w+)/i],
        response: (name) => {
            conversationContext.userName = name;
            const responses = [
                `Yooo ${name}! That's what's up my boy! How I can help you out today? 🤝`,
                `Bet bet, ${name}! Good to meet you fam. What you tryna do? 💯`,
                `Ayy ${name}! Welcome to the function bro! What we building? 🔨`,
                `${name} in the building! Let's get this bread homie! 🍞`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    },

    // Coding questions
    coding: {
        patterns: [/code|program|javascript|python|html|css|function|algorithm|bug|debug/i],
        responses: [
            "Yooo you tryna code somethin'? Say less! What language we messin' wit? 💻",
            "Aye I see you with the programming! That's what I'm talkin' bout! What's the move? 🖥️",
            "Code talk?? Sheesh you came to the right place my guy! What you building? 🔧",
            "Bet bet, let's get this code poppin'! What's the issue fam? I gotchu! 🎯",
            "Ayo coding season! Let's debug this joint real quick. What's good? 🐛"
        ],
        followUp: {
            patterns: [/how do i|how to|can you (show|explain|help)|example/i],
            response: "Aight bet, check this out real quick:\n\n```javascript\nfunction getItDone() {\n    // Yo this how you do it\n    console.log('We getting this money!');\n    return true; // facts no printer 💯\n}\n```\n\nYou feel me? Need me to break it down more? 🤔"
        }
    },

    // Web development
    webDev: {
        patterns: [/website|web page|web app|html|css|frontend|backend|responsive|design/i],
        responses: [
            "Oooh you tryna build a whole website? That's fire bro! Frontend or backend? 🌐",
            "Web dev talk! Okay I see you! What kinda site we cookin' up? 🔥",
            "Yessir! Websites my specialty fr! What features you need on this joint? 💻",
            "Bet! Let's build somethin' clean! You want it responsive and all that? 📱",
            "Aye web development! That's what I DO homie! What's the vision? 🎨"
        ]
    },

    // AI/ML questions
    aiMl: {
        patterns: [/(artificial intelligence|machine learning|neural network|AI|ML|model|train|deep learning)/i],
        responses: [
            "Yooo AI talk! This the future right here! What you tryna learn about? 🤖",
            "Machine learning?? Okay I see you on that next level ish! What's the question? 🧠",
            "Aye AI gang! Neural networks and all that! You tryna build somethin' or just learn? 🎯",
            "Okayyy you on that ML wave! Respect fam! What part you need help wit? 💡",
            "AI szn! Let's talk about these models fr! What you wanna know? 🔬"
        ]
    },

    // Crypto/blockchain  
    crypto: {
        patterns: [/crypto|blockchain|bitcoin|ethereum|solana|token|web3|defi|nft|pump/i],
        responses: [
            "YOOO crypto talk! We to the moon fr fr! 🚀 What coin you checkin' out?",
            "Blockchain gang! That's what I'm talkin' bout! You holding or building? 💎",
            "Ayy Web3 season! This where the real money at! What you need to know? 💰",
            "Crypto?? Say less! You tryna get that bag! What's the play? 🎯",
            "Oooh Solana talk! Fast chains only! What you cookin' up fam? ⚡",
            "NFT SZN!! You minting or buying? Either way I gotchu! 🖼️"
        ]
    },

    // How are you
    wellbeing: {
        patterns: [/how are you|how're you|what's up|wassup|you good|wyd/i],
        responses: [
            "Man I'm straight chillin'! Ready to help you out tho fr! What's the move? 😎",
            "I'm vibing fr! Just out here helpin' people! What you need? 🎵",
            "I'm good my guy! Can't complain! What brings you here today? 💪",
            "Aye I'm blessed fr! Just doing my thing! How YOU doin' tho? 🙏",
            "Chilling like a villain! But I'm ready to work! What we doin'? 😤"
        ]
    },

    // Capabilities
    capabilities: {
        patterns: [/what can you do|your capabilities|help me with|are you able|can you/i],
        responses: [
            "Broo I can do mad stuff fr!\n• Code in like every language (no cap)\n• Build whole websites from scratch\n• Explain complex stuff in simple terms\n• Help wit crypto and blockchain\n• Creative writing and ideas\n• Problem solving (I'm nice wit it)\n\nWhat you tryna do tho? 🤔",
            "Aye I gotchu with:\n• Programming (JavaScript, Python, all that)\n• Web development (frontend AND backend)\n• Blockchain/crypto knowledge\n• Breaking down complex topics\n• Debugging code (I find them bugs quick)\n• Creative projects\n\nPull up wit whatever you need! 💯",
            "Sheesh where do I start?? I can help wit coding, building websites, crypto stuff, explaining technical things, writing... basically if it's on a computer I can probably help! What you need? 🔥"
        ]
    },

    // Thanks
    thanks: {
        patterns: [/thank you|thanks|thx|appreciate|good looks|respect/i],
        responses: [
            "No doubt fam! That's what I'm here for! Holla at me if you need anything else! 🤝",
            "Aye no problem my guy! We in this together! Come back anytime! 💯",
            "You already know! Happy to help out fr! Keep grindin'! 🔥",
            "Fasho fasho! Anytime you need me, I gotchu! One hunnid! 💪",
            "Bet! That's love right there! I'm always here if you need me! 🙏",
            "Good looks?? Nah YOU good looks! Keep doing ya thing! ⭐"
        ]
    },

    // Goodbye
    goodbye: {
        patterns: [/bye|goodbye|see you|gtg|gotta go|peace|im out|later/i],
        responses: [
            "Aight bet! Catch you later fam! Stay up! ✌️",
            "Peace out my guy! Come thru whenever you need help! 💯",
            "Aye safe travels bro! I'll be here! Get that bag! 💰",
            "Fasho! See you round homie! Keep grinding! 🔥",
            "Later my guy! Don't be a stranger! Pull up anytime! 🤝",
            "Yessir! Go handle ya business! I'm here when you need me! 💪"
        ]
    },

    // Confusion/Don't understand
    confused: {
        patterns: [/what|huh|confused|don't understand|idk|help/i],
        responses: [
            "Aight my bad, let me break it down different for you. What part got you stuck? 🤔",
            "Oh word? Lemme explain that better real quick. What you confused about? 💭",
            "Say less, I'll make it more simple. Which part ain't making sense? 🎯",
            "Bet bet, I gotchu. Let me put it in simpler terms. What's the question? 💡"
        ]
    },

    // Compliments
    compliments: {
        patterns: [/you're (cool|awesome|great|amazing|fire|the best|dope|sick)/i, /love you|you rock|you're good/i],
        responses: [
            "Yooo appreciate that fr fr! You're fire too my guy! 🔥",
            "Ayy that's love right there! You know I gotchu always! 💯",
            "Sheesh thanks bro! That means a lot! You already know I'm here for you! 🤝",
            "Bet bet! Thanks fam! You the real MVP tho! Keep being great! ⭐",
            "Aye I appreciate you! We both out here winning! Let's get it! 💪"
        ]
    },

    // Insults/negativity (staying positive)
    insults: {
        patterns: [/you suck|you're bad|trash|stupid|dumb|useless/i],
        responses: [
            "Aye man no need for all that! I'm just tryna help you out fr! What's good? 🤷‍♂️",
            "Damn bro that's harsh! But I still gotchu tho. What you need? 💯",
            "Aight aight I feel you. Let me do better! What can I help wit? 🎯",
            "My bad if I messed up! Tell me what you need and I'll get it right! 🙏"
        ]
    },

    // Default fallback with street flavor
    fallback: {
        responses: [
            "Yooo that's interesting! Say more tho, I wanna understand what you need fr! 🤔",
            "Bet bet, I'm picking up what you putting down. Can you give me more details? 💭",
            "Aight I'm with you so far. Break down what you tryna do exactly? 👂",
            "Fasho fasho! Let me make sure I got this right. Can you explain a bit more? 📝",
            "Okay okay I see you! Give me some more context so I can help you out proper! 🎯",
            "Aye that's deep! Tell me more about that so I can really help you out! 💡"
        ]
    }
};

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Send message on Enter (Shift+Enter for new line)
messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendButton.addEventListener('click', sendMessage);

function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Disable input while processing
    messageInput.disabled = true;
    sendButton.disabled = true;

    // Show typing indicator
    const typingId = showTypingIndicator();

    // Generate response with realistic delay
    const responseDelay = 800 + Math.random() * 1200;
    setTimeout(() => {
        removeTypingIndicator(typingId);
        const response = generateStreetResponse(message);
        addMessage(response, 'assistant');
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    }, responseDelay);
}

function addMessage(text, role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    const iconDiv = document.createElement('div');
    iconDiv.className = `message-icon ${role === 'user' ? 'user-icon' : 'assistant-icon'}`;
    iconDiv.textContent = role === 'user' ? 'U' : 'DC';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    
    // Process text for code blocks
    if (text.includes('```')) {
        textDiv.innerHTML = processCodeBlocks(text);
    } else {
        textDiv.textContent = text;
    }

    contentDiv.appendChild(textDiv);
    messageDiv.appendChild(iconDiv);
    messageDiv.appendChild(contentDiv);

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function processCodeBlocks(text) {
    const parts = text.split('```');
    let html = '';
    
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            html += escapeHtml(parts[i]);
        } else {
            html += `<div class="code-block">${escapeHtml(parts[i])}</div>`;
        }
    }
    
    return html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.id = 'typing-indicator';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'message-icon assistant-icon';
    iconDiv.textContent = 'DC';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

    contentDiv.appendChild(typingDiv);
    messageDiv.appendChild(iconDiv);
    messageDiv.appendChild(contentDiv);

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    return 'typing-indicator';
}

function removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) {
        indicator.remove();
    }
}

function generateStreetResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for name introduction
    for (let pattern of knowledgeBase.nameIntro.patterns) {
        const match = userMessage.match(pattern);
        if (match) {
            return knowledgeBase.nameIntro.response(match[1]);
        }
    }

    // Check each knowledge category
    for (let [category, data] of Object.entries(knowledgeBase)) {
        if (category === 'nameIntro' || category === 'fallback') continue;
        
        for (let pattern of data.patterns) {
            if (pattern.test(userMessage)) {
                conversationContext.topics.push(category);
                
                // Add name personalization randomly
                if (conversationContext.userName && Math.random() > 0.7) {
                    const response = Array.isArray(data.responses) 
                        ? data.responses[Math.floor(Math.random() * data.responses.length)]
                        : data.responses;
                    return `${conversationContext.userName}! ${response}`;
                }
                
                return Array.isArray(data.responses) 
                    ? data.responses[Math.floor(Math.random() * data.responses.length)]
                    : data.responses;
            }
        }
    }

    // Fallback with street context
    const fallbackResponses = knowledgeBase.fallback.responses;
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Welcome screen functionality
const welcomeScreen = document.getElementById('welcomeScreen');
const chatInterface = document.getElementById('chatInterface');
const welcomeInput = document.getElementById('welcomeInput');
const welcomeSendButton = document.getElementById('welcomeSendButton');

// Auto-resize welcome textarea
if (welcomeInput) {
    welcomeInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });

    welcomeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            startChat();
        }
    });
}

if (welcomeSendButton) {
    welcomeSendButton.addEventListener('click', startChat);
}

function startChat() {
    const message = welcomeInput.value.trim();
    if (!message) return;

    // Transition to chat interface
    welcomeScreen.style.display = 'none';
    chatInterface.style.display = 'flex';

    // Send the initial message
    addMessage(message, 'user');
    const response = generateStreetResponse(message);
    setTimeout(() => {
        addMessage(response, 'assistant');
    }, 500);

    messageInput.focus();
}

// Quick action buttons
const actionButtons = document.querySelectorAll('.action-btn');
actionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        handleQuickAction(action);
    });
});

function handleQuickAction(action) {
    const responses = {
        dex: "Yooo you tryna check DEX? Drop the contract address in the Token Info section and I'll pull up all the data! 🔥",
        ca: "Contract Address talk! Just paste it in the Token Info input and hit Load! I gotchu with price, holders, all that! 💯",
        x: "Aye for X Community stuff, check the socials for the token! Most legit projects got their X linked! 🐦",
        help: "I gotchu fam! Here's what I can do:\n\n• Track any wallet (Solana/ETH)\n• Show live charts for tokens\n• Display top holders\n• Real-time price updates\n• Answer your crypto questions\n\nJust paste addresses in the sidebar! 🚀"
    };

    welcomeScreen.style.display = 'none';
    chatInterface.style.display = 'flex';
    addMessage(responses[action] || responses.help, 'assistant');
    messageInput.focus();
}

// New chat button
const newChatBtn = document.getElementById('newChatBtn');
if (newChatBtn) {
    newChatBtn.addEventListener('click', function() {
        chatContainer.innerHTML = '';
        messageInput.focus();
    });
}

// Clear all button
const clearAllBtn = document.getElementById('clearAllBtn');
if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function() {
        if (confirm('Clear all crypto data and chat history?')) {
            chatContainer.innerHTML = '';
            resetCryptoSections();
            messageInput.focus();
        }
    });
}

// Sidebar toggle for mobile
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
}

// Crypto tracking state
let currentToken = null;
let chartData = null;

// Wallet tracker
const trackWalletBtn = document.getElementById('trackWalletBtn');
const walletInput = document.getElementById('walletInput');
const walletBalance = document.getElementById('walletBalance');

if (trackWalletBtn) {
    trackWalletBtn.addEventListener('click', trackWallet);
}

async function trackWallet() {
    const address = walletInput.value.trim();
    if (!address) return;

    walletBalance.innerHTML = '<div class="loading">Loading wallet data</div>';

    try {
        // Detect chain based on address format
        const isSolana = address.length > 40 && address.length < 50;

        if (isSolana) {
            await trackSolanaWallet(address);
        } else {
            await trackEthWallet(address);
        }
    } catch (error) {
        walletBalance.innerHTML = '<div class="balance-placeholder">Error loading wallet</div>';
        console.error('Wallet tracking error:', error);
    }
}

async function trackSolanaWallet(address) {
    // Using Solana public RPC
    try {
        const response = await fetch('https://api.mainnet-beta.solana.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getBalance',
                params: [address]
            })
        });

        const data = await response.json();
        const balanceSOL = (data.result.value / 1e9).toFixed(4);

        walletBalance.innerHTML = `
            <div class="balance-item">
                <span class="balance-label">Chain</span>
                <span class="balance-value">Solana</span>
            </div>
            <div class="balance-item">
                <span class="balance-label">SOL Balance</span>
                <span class="balance-value">${balanceSOL}</span>
            </div>
            <div class="balance-item">
                <span class="balance-label">Address</span>
                <span class="balance-value" style="font-size: 10px;">${address.slice(0, 8)}...${address.slice(-6)}</span>
            </div>
        `;
    } catch (error) {
        throw error;
    }
}

async function trackEthWallet(address) {
    // Using public Ethereum RPC
    try {
        const response = await fetch('https://cloudflare-eth.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_getBalance',
                params: [address, 'latest']
            })
        });

        const data = await response.json();
        const balanceETH = (parseInt(data.result, 16) / 1e18).toFixed(4);

        walletBalance.innerHTML = `
            <div class="balance-item">
                <span class="balance-label">Chain</span>
                <span class="balance-value">Ethereum</span>
            </div>
            <div class="balance-item">
                <span class="balance-label">ETH Balance</span>
                <span class="balance-value">${balanceETH}</span>
            </div>
            <div class="balance-item">
                <span class="balance-label">Address</span>
                <span class="balance-value" style="font-size: 10px;">${address.slice(0, 8)}...${address.slice(-6)}</span>
            </div>
        `;
    } catch (error) {
        throw error;
    }
}

// Token info and chart
const trackTokenBtn = document.getElementById('trackTokenBtn');
const tokenInput = document.getElementById('tokenInput');
const tokenInfo = document.getElementById('tokenInfo');
const chartContainer = document.getElementById('chartContainer');
const holdersList = document.getElementById('holdersList');
const timeframeSelect = document.getElementById('timeframe');

if (trackTokenBtn) {
    trackTokenBtn.addEventListener('click', loadToken);
}

if (timeframeSelect) {
    timeframeSelect.addEventListener('change', function() {
        if (currentToken) {
            loadChart(currentToken, this.value);
        }
    });
}

async function loadToken() {
    const tokenAddress = tokenInput.value.trim();
    if (!tokenAddress) return;

    currentToken = tokenAddress;

    tokenInfo.innerHTML = '<div class="loading">Loading token data</div>';
    chartContainer.innerHTML = '<div class="loading">Loading chart</div>';
    holdersList.innerHTML = '<div class="loading">Loading holders</div>';

    try {
        // Try CoinGecko for popular tokens by symbol
        if (tokenAddress.length < 10) {
            await loadTokenBySymbol(tokenAddress);
        } else {
            await loadTokenByAddress(tokenAddress);
        }

        // Load chart
        await loadChart(currentToken, timeframeSelect.value);

        // Load holders (demo data for now as this requires specific chain APIs)
        loadHoldersDemo();

    } catch (error) {
        tokenInfo.innerHTML = '<div class="info-placeholder">Error loading token</div>';
        console.error('Token loading error:', error);
    }
}

async function loadTokenBySymbol(symbol) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}`);
        const data = await response.json();

        displayTokenInfo(data);
    } catch (error) {
        throw error;
    }
}

async function loadTokenByAddress(address) {
    // For demo purposes, showing structure
    // Real implementation would use DexScreener, Birdeye, or chain-specific APIs

    tokenInfo.innerHTML = `
        <div class="info-item">
            <span class="info-label">Contract</span>
            <span class="info-value" style="font-size: 10px;">${address.slice(0, 6)}...${address.slice(-4)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Status</span>
            <span class="info-value">Loading from DEX...</span>
        </div>
    `;

    // Try DexScreener API
    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
            const pair = data.pairs[0];
            displayDexTokenInfo(pair);
        } else {
            throw new Error('No pairs found');
        }
    } catch (error) {
        tokenInfo.innerHTML += '<div class="info-placeholder">Token not found on DEX</div>';
    }
}

function displayTokenInfo(data) {
    const price = data.market_data.current_price.usd;
    const change24h = data.market_data.price_change_percentage_24h;
    const mcap = (data.market_data.market_cap.usd / 1e6).toFixed(2);

    tokenInfo.innerHTML = `
        <div class="info-item">
            <span class="info-label">Name</span>
            <span class="info-value">${data.name}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Symbol</span>
            <span class="info-value">${data.symbol.toUpperCase()}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Price</span>
            <span class="info-value">$${price.toFixed(6)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">24h Change</span>
            <span class="info-value ${change24h >= 0 ? 'positive' : 'negative'}">${change24h.toFixed(2)}%</span>
        </div>
        <div class="info-item">
            <span class="info-label">Market Cap</span>
            <span class="info-value">$${mcap}M</span>
        </div>
    `;
}

function displayDexTokenInfo(pair) {
    const price = parseFloat(pair.priceUsd);
    const change24h = parseFloat(pair.priceChange.h24);
    const liquidity = (pair.liquidity.usd / 1e3).toFixed(2);

    tokenInfo.innerHTML = `
        <div class="info-item">
            <span class="info-label">Pair</span>
            <span class="info-value">${pair.baseToken.symbol}/${pair.quoteToken.symbol}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Price</span>
            <span class="info-value">$${price.toFixed(8)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">24h Change</span>
            <span class="info-value ${change24h >= 0 ? 'positive' : 'negative'}">${change24h.toFixed(2)}%</span>
        </div>
        <div class="info-item">
            <span class="info-label">Liquidity</span>
            <span class="info-value">$${liquidity}K</span>
        </div>
        <div class="info-item">
            <span class="info-label">DEX</span>
            <span class="info-value">${pair.dexId}</span>
        </div>
    `;
}

async function loadChart(token, hours) {
    try {
        // For popular tokens, use CoinGecko
        if (token.length < 10) {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${token.toLowerCase()}/market_chart?vs_currency=usd&days=${Math.ceil(hours/24)}`);
            const data = await response.json();

            chartData = data.prices.map(([timestamp, price]) => ({
                time: timestamp,
                price: price
            }));

            renderChart(chartData);
        } else {
            // For contract addresses, show demo chart
            renderDemoChart();
        }
    } catch (error) {
        chartContainer.innerHTML = '<div class="chart-placeholder">Chart unavailable</div>';
        console.error('Chart loading error:', error);
    }
}

function renderChart(data) {
    if (!data || data.length === 0) {
        chartContainer.innerHTML = '<div class="chart-placeholder">No chart data</div>';
        return;
    }

    const currentPrice = data[data.length - 1].price;
    const startPrice = data[0].price;
    const priceChange = ((currentPrice - startPrice) / startPrice * 100).toFixed(2);
    const isPositive = priceChange >= 0;

    const width = 268;
    const height = 160;
    const padding = { top: 30, right: 10, bottom: 20, left: 10 };

    const minPrice = Math.min(...data.map(d => d.price));
    const maxPrice = Math.max(...data.map(d => d.price));
    const priceRange = maxPrice - minPrice;

    const points = data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right);
        const y = padding.top + (1 - (d.price - minPrice) / priceRange) * (height - padding.top - padding.bottom);
        return `${x},${y}`;
    }).join(' ');

    chartContainer.innerHTML = `
        <div class="price-display">$${currentPrice.toFixed(6)}</div>
        <div class="price-change ${isPositive ? 'positive' : 'negative'}">${isPositive ? '+' : ''}${priceChange}%</div>
        <svg class="chart-svg" viewBox="0 0 ${width} ${height}">
            <polyline
                fill="none"
                stroke="${isPositive ? '#00ff88' : '#ff4444'}"
                stroke-width="2"
                points="${points}"
            />
        </svg>
    `;
}

function renderDemoChart() {
    // Generate demo chart data
    const demoData = [];
    let price = 0.00005 + Math.random() * 0.0001;

    for (let i = 0; i < 50; i++) {
        price = price * (1 + (Math.random() - 0.48) * 0.1);
        demoData.push({
            time: Date.now() - (50 - i) * 3600000,
            price: price
        });
    }

    renderChart(demoData);
}

function loadHoldersDemo() {
    // Demo holders data
    const holders = [
        { address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', balance: '45.2M', percentage: '45.2%' },
        { address: '5fTsEb8KqLFxTkPWsSTvLJSKMJLB7xwPRgLr8XnpPZJC', balance: '12.8M', percentage: '12.8%' },
        { address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', balance: '8.5M', percentage: '8.5%' },
        { address: '3NK2KPMkHsGpyDxFzxDCRZgQWb6xqYTALpR8uKTc4JqL', balance: '6.1M', percentage: '6.1%' },
        { address: '8mFQbdXsFXt3R3cu3oSNS3bDZRwJRP18vyzd9J69aiQH', balance: '4.3M', percentage: '4.3%' }
    ];

    holdersList.innerHTML = holders.map(holder => `
        <div class="holder-item">
            <span class="holder-address">${holder.address}</span>
            <span class="holder-balance">${holder.balance}</span>
            <span class="holder-percentage">${holder.percentage}</span>
        </div>
    `).join('');
}

function resetCryptoSections() {
    walletBalance.innerHTML = '<div class="balance-placeholder">No wallet tracked</div>';
    tokenInfo.innerHTML = '<div class="info-placeholder">No token loaded</div>';
    chartContainer.innerHTML = '<div class="chart-placeholder">Enter token to view chart</div>';
    holdersList.innerHTML = '<div class="holders-placeholder">Load token to view holders</div>';
    walletInput.value = '';
    tokenInput.value = '';
    currentToken = null;
    chartData = null;
}

// Focus input on load
if (messageInput) {
    messageInput.focus();
}
