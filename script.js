const welcomeScreen = document.getElementById('welcomeScreen');
const chatInterface = document.getElementById('chatInterface');
const welcomeInput = document.getElementById('welcomeInput');
const welcomeSendButton = document.getElementById('welcomeSendButton');
const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const newChatBtn = document.getElementById('newChatBtn');
const chatHistory = document.getElementById('chatHistory');

// Chat storage
let chats = JSON.parse(localStorage.getItem('darkClaudeChats')) || [];
let currentChatId = null;

// Conversation context memory
let conversationContext = {
    userName: null,
    topics: [],
    vibe: 'street',
    previousQuestion: null
};

// Load chat history on page load
function loadChatHistory() {
    chatHistory.innerHTML = '';
    
    if (chats.length === 0) {
        chatHistory.innerHTML = '<div style="padding: 16px; text-align: center; color: #666; font-size: 13px;">No previous chats</div>';
        return;
    }
    
    chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-history-item';
        if (chat.id === currentChatId) chatItem.classList.add('active');
        
        const title = document.createElement('div');
        title.className = 'chat-title';
        title.textContent = chat.title || 'New Chat';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-chat-btn';
        deleteBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>`;
        
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        };
        
        chatItem.appendChild(title);
        chatItem.appendChild(deleteBtn);
        
        chatItem.onclick = () => loadChat(chat.id);
        
        chatHistory.appendChild(chatItem);
    });
}

// Save current chat
function saveCurrentChat() {
    if (!currentChatId) return;
    
    const messages = Array.from(chatContainer.children)
        .filter(el => !el.id)
        .map(el => ({
            role: el.querySelector('.user-icon') ? 'user' : 'assistant',
            content: el.querySelector('.message-text').textContent
        }));
    
    const chatIndex = chats.findIndex(c => c.id === currentChatId);
    if (chatIndex !== -1) {
        chats[chatIndex].messages = messages;
        chats[chatIndex].updatedAt = new Date().toISOString();
        
        // Set title from first user message
        if (messages.length > 0 && !chats[chatIndex].title) {
            const firstUserMsg = messages.find(m => m.role === 'user');
            if (firstUserMsg) {
                chats[chatIndex].title = firstUserMsg.content.slice(0, 30) + (firstUserMsg.content.length > 30 ? '...' : '');
            }
        }
        
        localStorage.setItem('darkClaudeChats', JSON.stringify(chats));
        loadChatHistory();
    }
}

// Create new chat
function createNewChat() {
    const newChat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    chats.unshift(newChat);
    currentChatId = newChat.id;
    
    chatContainer.innerHTML = '';
    conversationContext = {
        userName: null,
        topics: [],
        vibe: 'street',
        previousQuestion: null
    };
    
    localStorage.setItem('darkClaudeChats', JSON.stringify(chats));
    loadChatHistory();
    messageInput.focus();
}

// Load existing chat
function loadChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chatId;
    chatContainer.innerHTML = '';
    
    chat.messages.forEach(msg => {
        addMessage(msg.content, msg.role, false);
    });
    
    loadChatHistory();
    messageInput.focus();
}

// Delete chat
function deleteChat(chatId) {
    if (confirm('Delete this chat?')) {
        chats = chats.filter(c => c.id !== chatId);
        localStorage.setItem('darkClaudeChats', JSON.stringify(chats));
        
        if (currentChatId === chatId) {
            currentChatId = null;
            chatContainer.innerHTML = '';
        }
        
        loadChatHistory();
    }
}

// New chat button
newChatBtn.addEventListener('click', () => {
    // Smooth transition back to welcome screen
    chatInterface.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    chatInterface.style.opacity = '0';
    
    setTimeout(() => {
        chatInterface.style.display = 'none';
        welcomeScreen.style.display = 'flex';
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'scale(0.95)';
        
        requestAnimationFrame(() => {
            welcomeScreen.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            welcomeScreen.style.opacity = '1';
            welcomeScreen.style.transform = 'scale(1)';
        });
        
        chatInterface.style.opacity = '1';
        currentChatId = null;
    }, 500);
});

// Clear all chats button
const clearAllBtn = document.getElementById('clearAllBtn');
clearAllBtn.addEventListener('click', () => {
    if (confirm('yo you sure? this deletes EVERYTHING bro. all your chats gone forever.')) {
        localStorage.removeItem('darkClaudeChats');
        chats = [];
        currentChatId = null;
        chatContainer.innerHTML = '';
        loadChatHistory();
        alert('aight all chats deleted');
    }
});

// Sidebar toggle (mobile)
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Handle welcome input
welcomeInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

welcomeInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        startChat(welcomeInput.value.trim());
    }
});

welcomeSendButton.addEventListener('click', () => {
    startChat(welcomeInput.value.trim());
});

// Handle quick action buttons
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');

        switch(action) {
            case 'dex':
                startChat('Show me the Dex');
                break;
            case 'ca':
                // Open pump.fun link in new tab
                window.open('https://pump.fun/coin/67JUwUPHAUQUqLU7Q9qJ17z9KAGfxzjgiPhXUrM5pump', '_blank');
                break;
            case 'x':
                // Open X community link in new tab
                window.open('https://x.com/i/communities/2008874511664336900', '_blank');
                break;
            case 'help':
                startChat('What can you do?');
                break;
        }
    });
});

// Transition from welcome to chat
function startChat(firstMessage) {
    if (!firstMessage) return;
    
    // Create new chat
    createNewChat();
    
    // Smooth fade out with scale
    welcomeScreen.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        chatInterface.style.display = 'flex';
        
        // Add greeting first
        const greetings = [
            "aight what",
            "speak",
            "yo what you want",
            "talk",
            "say something",
            "what's good"
        ];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        addMessage(randomGreeting, 'assistant');
        
        // Then add their message
        addMessage(firstMessage, 'user');
        
        // Show typing and respond via API or Backup
        setTimeout(() => {
            const typingId = showTypingIndicator();
            
            // Call API
            fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: firstMessage })
            })
            .then(res => res.json())
            .then(data => {
                removeTypingIndicator(typingId);
                // Use API reply or fallback to street response
                const reply = data.reply || generateStreetResponse(firstMessage);
                addMessage(reply, 'assistant');
                saveCurrentChat();
                messageInput.focus();
            })
            .catch(err => {
                console.error("Start chat API error:", err);
                removeTypingIndicator(typingId);
                addMessage(generateStreetResponse(firstMessage), 'assistant');
                saveCurrentChat();
                messageInput.focus();
            });
        }, 300);
        
    }, 500);
}

// Knowledge base - Expanded street edition with natural responses
const knowledgeBase = {
    // Greetings - massive expansion
    greetings: {
        patterns: [/^(hi|hello|hey|greetings|sup|yo|wassup|what's good|wsg|howdy|ayo|wyd|yoo|ey|ayy|wsp|yooo)/i],
        responses: [
            "tf you want",
            "what",
            "speak",
            "say that",
            "talk to me",
            "wassup wit you",
            "aye what you need",
            "yo say something",
            "aight what",
            "what's the issue",
            "yeah",
            "wsp",
            "talk",
            "go ahead",
            "I'm here",
            "say it",
            "what's hannin",
            "what you on",
            "speak up",
            "yeah what's good",
            "wassup bro",
            "aye",
            "yo",
            "what's the move",
            "aight go",
            "I'm listening",
            "talk to me then",
            "what's up wit it",
            "say wassup",
            "what you want bro"
        ]
    },

    // Name detection
    nameIntro: {
        patterns: [
            /my name is (\w+)/i, 
            /i'm (\w+)/i, 
            /im (\w+)/i,
            /call me (\w+)/i, 
            /this is (\w+)/i,
            /name's (\w+)/i,
            /they call me (\w+)/i
        ],
        response: (name) => {
            conversationContext.userName = name;
            const responses = [
                `aight ${name} what you need`,
                `yo ${name} wassup`,
                `bet ${name} talk to me`,
                `${name} aight what's good`,
                `okay ${name} speak`,
                `${name} what's the move`,
                `aight ${name} go ahead`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    },

    // Coding questions - massive expansion
    coding: {
        patterns: [
            /code|program|javascript|python|html|css|function|algorithm|bug|debug|syntax|error|compile|runtime|coding|script|dev|developer|programming|write code|help me code|fix my code|why (isn't|isnt|won't|wont) .* work/i
        ],
        responses: [
            "aight what's the code issue bro hurry up",
            "what language stop wasting time",
            "man what you need coded",
            "bro what's broken just tell me",
            "aight spit it out what's the error",
            "yo I ain't got all day what's the bug",
            "what language we working with speak up",
            "man just show me the code",
            "aight what part you stuck on",
            "yo what's not working",
            "what's the error message say",
            "bro paste the code",
            "aight what line is breaking",
            "man what you trying to do with this code",
            "yo what's the function supposed to do",
            "what framework you using",
            "aight frontend or backend",
            "bro what's throwing the error",
            "man check your console what's it say",
            "yo did you even test it",
            "what version you on",
            "aight show me the stack trace",
            "bro is it syntax or logic error",
            "man what's your environment",
            "yo you running this local or deployed"
        ],
        followUp: {
            patterns: [/how do i|how to|can you (show|explain|help)|example|tutorial|guide|show me|teach me|walk me through/i],
            responses: [
                "aight look\n\n```javascript\nfunction doIt() {\n    // just do it like this\n    return 'done';\n}\n```\n\nthat's it",
                "bet\n\n```javascript\nconst thing = () => {\n    // like this bro\n    console.log('see');\n}\n```\n\ngot it?",
                "man\n\n```javascript\nlet x = getData();\nconsole.log(x);\n```\n\nsimple",
                "yo\n\n```javascript\n// do it like this\nif (condition) {\n    // your code here\n}\n```\n\neasy",
                "aight\n\n```javascript\nconst result = array.map(item => {\n    return item * 2;\n});\n```\n\nstraightforward",
                "bro\n\n```javascript\ntry {\n    // your code\n} catch(err) {\n    console.log(err);\n}\n```\n\nbasic"
            ]
        }
    },

    // Web development
    webDev: {
        patterns: [/website|web page|web app|html|css|frontend|backend|responsive|design|ui|ux|react|vue|angular|node/i],
        responses: [
            "aight website for what",
            "what kinda site you want hurry up",
            "man just tell me what you building",
            "frontend or backend pick one",
            "yo what features you need",
            "aight what's the site about",
            "what you tryna make",
            "spit it out what kinda website",
            "man what framework you want",
            "yo what's the tech stack"
        ]
    },

    // AI/ML questions
    aiMl: {
        patterns: [/(artificial intelligence|machine learning|neural network|AI|ML|model|train|deep learning|GPT|transformer|llm|chatbot)/i],
        responses: [
            "aight AI what about it",
            "machine learning what you need to know",
            "yo neural networks what's the question",
            "man what part of AI you asking about",
            "what kinda model you talking about",
            "aight ML stuff what specifically",
            "yo you building something or what",
            "what's the AI question just say it",
            "man deep learning what about it",
            "aight what's the use case"
        ]
    },

    // Crypto/blockchain with enhanced degen knowledge
    crypto: {
        patterns: [/crypto|blockchain|bitcoin|ethereum|solana|token|web3|defi|nft|pump|degen|moon|hodl|whale|rug|lambo|ser|frens|jeets|paper hands/i],
        responses: [
            "yo crypto what coin",
            "blockchain what you holding",
            "man what's the move",
            "aight what token you looking at",
            "solana what about it",
            "yo you trading or building",
            "what protocol speak up",
            "man what you holding",
            "aight what's in your bag",
            "yo what chain you on",
            "bro you a degen or investor pick one",
            "man jeets are paper hands that sell too early",
            "yo if you calling yourself ser and fren you deep in degen culture"
        ]
    },

    // CA (Contract Address) - Portal specific with expanded patterns
    ca: {
        patterns: [
            /\bca\b|contract address|token address|what's the ca|where's the ca|drop ca|post ca|give me ca|need ca|got ca|ca\?|whats ca|where ca|ca address|address\?|got the address|token ca|coin address|show ca|share ca|link ca/i
        ],
        responses: [
            "yo we ain't launched yet stop asking",
            "bro it ain't out chill",
            "man check X when we drop it'll be there",
            "we launching soon relax",
            "not yet bro damn just wait",
            "check the X community stop rushing",
            "launch soon ca will be everywhere",
            "man it drops on X first",
            "yo when we launch you'll see it trust"
        ]
    },

    // Pump.fun specific knowledge - massive expansion
    pumpFun: {
        patterns: [
            /pump\.fun|pump fun|pumpfun|bonding curve|king of the hill|how does pump work|launch on pump|graduating|raydium graduate|how to launch token|create coin|make a token|token launch|fair launch|pump portal/i
        ],
        responses: [
            "aight so pump.fun is where you launch tokens on solana. no presale, fair launch, bonding curve model",
            "bro pump.fun works like this - you create token, people buy in on bonding curve, at 69k it graduates to raydium",
            "man pump is simple - fair launch platform, when market cap hits like 69k it auto migrates to raydium with liquidity",
            "yo pump.fun is the degen launch pad. bonding curve price goes up as people buy, graduates at market cap threshold",
            "pump works on bonding curve - price increases with buys, decreases with sells, auto graduates to raydium dex when it hits cap",
            "aight pump.fun eliminates rug risk during launch, bonding curve pricing, when token graduates liquidity gets burned on raydium",
            "bro it's fair launch - everyone buys at bonding curve price, no presale BS, graduates to real dex when market cap high enough",
            "man bonding curve means you're buying from the curve not other people, price formula based on supply",
            "yo pump.fun changed the game - no more presales or team allocations, just pure bonding curve",
            "aight creating token costs like 0.02 SOL, that's why there's so many launches daily",
            "bro when token graduates to raydium the liquidity gets burned so can't rug that way",
            "man pump.fun made launching accessible to everyone, that's why quality varies so much",
            "yo the curve formula is transparent, you know exactly what price you're buying at",
            "aight some dev features - you can add images, socials, description when creating",
            "bro pump.fun shows live trades, holder count, market cap, everything transparent",
            "man the site sometimes laggy when new hyped coin launches, everyone trying to ape in",
            "yo you need SOL wallet connected - phantom, solflare, whatever works"
        ]
    },

    // Solana degen culture
    solanaDegen: {
        patterns: [/solana|sol|\$sol|solana ct|degen|aping|send it|yolo|100x|moon mission|bags/i],
        responses: [
            "man solana degens different bro, fast chains fast gains fast rugs",
            "yo solana ct moves different, you gotta be quick or you miss everything",
            "aight solana is where real degens at, eth too slow for this pace",
            "bro sol ct is ruthless, bag secured or rekt in minutes no in between",
            "man solana speed is crazy, transactions instant, perfect for degen trading",
            "yo you aping on sol? better be quick bro this aint eth speed"
        ]
    },

    // KOL and influencer culture
    kolCulture: {
        patterns: [/kol|call|shill|paid shill|influencer|promotion|marketing|twitter spaces|raid/i],
        responses: [
            "man watch out for paid kol shills, they dump on you soon as it pumps",
            "yo kols gonna kol, they get paid to shill then dump their bags on retail",
            "aight real talk most kol calls are exit liquidity for their bags",
            "bro if a kol calling it they probably already loaded and ready to dump",
            "man organic growth better than paid kol shills any day",
            "yo raids and coordinated shilling usually means dump incoming",
            "aight some kols real but most just farming engagement and dumping on followers"
        ]
    },

    // Token metrics and trading
    tokenMetrics: {
        patterns: [/market cap|mcap|liquidity|volume|holders|top holders|distribution|concentrated|supply/i],
        responses: [
            "man check holder distribution before aping, if top 10 holders got 50%+ that's a rug waiting",
            "yo look at liquidity not just market cap, low liquidity means easy manipulation",
            "aight volume important bro, no volume means dead token or bot trading",
            "bro concentrated supply is red flag, top holders dump and token dies",
            "man healthy distribution is key - if dev wallet holding 20%+ that's sketchy",
            "yo always check if liquidity locked or burned, unlocked LP = potential rug"
        ]
    },

    // Rug detection
    rugDetection: {
        patterns: [/rug|rug pull|scam|honeypot|cant sell|suspicious|red flag|sketchy|trust/i],
        responses: [
            "man red flags: concentrated holders, low liquidity, no socials, random team",
            "yo if you cant sell that's a honeypot bro, check contract before buying",
            "aight honeypot tokens let you buy but not sell, test with small amount first",
            "bro if dev wallet holding mad supply that's rug territory",
            "man anonymous teams, no website, weird tokenomics = probable rug",
            "yo always check liquidity locked, team doxxed, holder distribution before aping"
        ]
    },

    // Specific pump.fun mechanics
    pumpMechanics: {
        patterns: [/bonding curve|curve|how to launch|create token|dev buy|sniper|bundle|how much to graduate/i],
        responses: [
            "bonding curve means price goes up automatically as more people buy, it's a formula not an order book",
            "man to graduate from pump you need hit around 69k market cap then liquidity moves to raydium",
            "yo dev usually buys some on launch to show commitment, but watch if they dump immediately",
            "aight snipers use bots to buy instantly on launch, that's why some tokens pump then dump fast",
            "bro bundles are when one person buys multiple wallets to fake holder count and distribution",
            "man creating token on pump costs like 0.02 SOL, super cheap that's why so many scams"
        ]
    },

    // Market timing and strategy  
    tradingStrategy: {
        patterns: [/when to buy|when to sell|entry|exit|take profit|stop loss|strategy|hold or sell/i],
        responses: [
            "man if you up 2x+ take initial out, let rest ride. never feel bad taking profit",
            "yo early entry is everything, if you buying after 10x already you're probably exit liquidity",
            "aight set stop losses bro, don't be emotionally attached to bags",
            "bro buying dips works until it doesn't, make sure it's actually dip not a dump",
            "man chasing pumps usually ends bad, wait for retrace or find next play",
            "yo if it pumps 50x in hour that's probably not sustainable, take profits",
            "aight most tokens dump 80%+ from ATH, ride momentum but don't marry bags"
        ]
    },

    // Dex - Portal specific with expanded patterns
    dex: {
        patterns: [
            /dex|raydium|jupiter|jup|uniswap|trading|swap|buy|where to buy|how to buy|where can i buy|when can i buy|buying|purchase|get tokens|acquire|exchange|trade for|swap for|buy this|cop this|ape in|where buy|how buy|buy where|which dex|what dex|dex\?/i
        ],
        responses: [
            "raydium when we launch now chill",
            "we dropping on dex soon stop asking",
            "man it's gonna be on raydium just wait",
            "launching soon bro relax",
            "check X for the dex link when it drops",
            "raydium most likely stay tuned",
            "yo dex listings coming be patient",
            "man raydium after graduation from pump",
            "aight you'll see raydium link on X"
        ]
    },

    // X Community - Portal specific with CT knowledge and expanded patterns
    xCommunity: {
        patterns: [
            /twitter|x community|\bx\b(?! ray)|social|follow|community|ct|crypto twitter|socials|social media|telegram|discord|tg|how to join|where join|join community|community link|twitter link|x link|social links|follow us|follow you|updates|announcements|news|info/i
        ],
        responses: [
            "yo join the X that's where everything at",
            "bro go to X all updates there",
            "man the community on X just join",
            "X got all the info stop asking me",
            "follow the X you'll see everything",
            "yo crypto twitter is where alpha drops first",
            "man X is where you see rugs in real time too",
            "aight all announcements on X bro",
            "yo X community is the main spot",
            "man follow X for launch details"
        ]
    },

    // General CT/KOL references (avoiding specific people to prevent misinformation)
    ctPersonalities: {
        patterns: [/who should i follow|good accounts|alpha accounts|kol list|influencer|who to trust/i],
        responses: [
            "man do your own research, don't just follow kol calls blindly",
            "yo most accounts either shilling their bags or getting paid to promote",
            "aight find organic accounts not paid shillers, watch what they do not what they say",
            "bro accounts with good track record exist but verify everything yourself",
            "man big accounts usually dumping on their followers, be careful",
            "yo build your own network, don't just copy paste other people's plays"
        ]
    },

    // Meme culture and common phrases
    memeCulture: {
        patterns: [/gm|ngmi|wagmi|few|iykyk|send it|lfg|nfa|dyor|not financial advice/i],
        responses: [
            "gm means good morning but crypto never sleeps bro",
            "ngmi = not gonna make it, wagmi = we all gonna make it",
            "man 'few' means few people understand, usually said before something pumps or dumps",
            "yo iykyk = if you know you know, basically gatekeeping alpha",
            "aight nfa = not financial advice, dyor = do your own research, covering their ass legally",
            "bro lfg = lets fucking go, usually said before a pump or rug"
        ]
    },

    // Launch timing questions
    launchTiming: {
        patterns: [
            /when launch|wen launch|when launching|wen launching|launch date|launch time|when dropping|wen drop|when goes live|wen live|launch soon|soon\?|how soon|eta|timeline|date\?|time\?|when token|when coin|release date|go live when|when can i buy|when available/i
        ],
        responses: [
            "man soon just watch X for announcement",
            "yo launching soon check X for exact time",
            "aight follow X you'll know when",
            "bro wen? soon. follow X for date",
            "man check X daily for launch announcement",
            "yo we announce on X when ready",
            "aight launch details dropping on X",
            "bro just follow X stop asking",
            "man you'll see it on X when we go live"
        ]
    },

    // Whitelist/presale questions
    whitelistPresale: {
        patterns: [
            /whitelist|wl|presale|pre sale|early access|private sale|seed round|early buy|og|early investor|can i get in early|allocation|vip|insider/i
        ],
        responses: [
            "man no whitelist it's fair launch on pump.fun",
            "yo no presale bro everyone buys same time",
            "aight fair launch means no presale or wl",
            "bro pump.fun = no presale everyone equal",
            "man that's the point, no presale BS",
            "yo fair launch only no early access"
        ]
    },

    // Tokenomics questions
    tokenomics: {
        patterns: [
            /tokenomics|supply|total supply|circulating|max supply|taxes|tax|buy tax|sell tax|allocation|distribution|burn|burning tokens|token distribution/i
        ],
        responses: [
            "man pump.fun tokens have no taxes",
            "yo supply details will be on pump page",
            "aight no buy/sell tax on pump launches",
            "bro tokenomics shown when we create it",
            "man pump.fun standard - no taxes, bonding curve",
            "yo all details posted when we launch"
        ]
    },

    // Team/developer questions  
    teamQuestions: {
        patterns: [
            /who (is|are) (the )?(team|dev|developer|creator)|team doxx|doxxed|kyc|audit|dev wallet|team wallet|who made this|who running this|trusted team|legit team/i
        ],
        responses: [
            "man team info will be on X",
            "yo check X for team details",
            "aight we'll share more on X community",
            "bro all team info posted on X",
            "man join X you'll see who we are"
        ]
    },

    // Roadmap questions
    roadmapQuestions: {
        patterns: [
            /roadmap|road map|plans|future plans|what's next|whats next|after launch|utility|use case|product|goal|vision|long term|future/i
        ],
        responses: [
            "man roadmap will be posted on X",
            "yo check X for plans and vision",
            "aight all that info coming on X",
            "bro we'll share roadmap when we launch",
            "man follow X for utility announcements"
        ]
    },

    // Common scams and schemes
    scamAwareness: {
        patterns: [/airdrop scam|fake account|impersonator|dm scam|discord scam|wallet drainer|phishing/i],
        responses: [
            "man never click random airdrop links, that's how wallets get drained",
            "yo if someone DMs you first on telegram or discord it's 100% a scam",
            "aight real projects never DM you asking for wallet info or seed phrase",
            "bro verify accounts carefully, impersonators everywhere especially after pumps",
            "man discord scams common, they hack admin accounts and post fake links",
            "yo if it sounds too good to be true it's draining your wallet"
        ]
    },

    // Questions about life/advice
    advice: {
        patterns: [/what should i|should i|advice|help me decide|what do you think|opinion|recommend/i],
        responses: [
            "man idk tell me what's going on",
            "aight what's the situation",
            "yo just tell me the full story",
            "what's the options just say it",
            "man gimme all the details",
            "aight talk what's up"
        ]
    },

    // Learning/education
    learning: {
        patterns: [/learn|study|tutorial|course|teach me|explain|understand|how does|why does|education/i],
        responses: [
            "aight what you tryna learn",
            "man what topic",
            "yo what part you don't get",
            "what's confusing you speak up",
            "aight what is it",
            "man what you need explained"
        ]
    },

    // Gaming
    gaming: {
        patterns: [/game|gaming|play|xbox|playstation|pc gaming|steam|fortnite|cod|valorant|league/i],
        responses: [
            "yo what game",
            "aight PC or console",
            "man what you playing",
            "what's your main game",
            "yo what system you on",
            "aight what you been playing"
        ]
    },

    // Music
    music: {
        patterns: [/music|song|artist|album|rap|hip hop|beat|spotify|soundcloud|playlist/i],
        responses: [
            "yo who you listening to",
            "man what artist",
            "aight what's your playlist",
            "what genre bro",
            "yo what you bumping",
            "man drop the playlist"
        ]
    },

    // Projects/building
    projects: {
        patterns: [/project|building|making|creating|working on|startup|idea|build|create/i],
        responses: [
            "aight what you building",
            "yo what's the project",
            "man what you working on",
            "what's the vision",
            "aight what you making",
            "yo startup what's the concept"
        ]
    },

    // Money/business
    business: {
        patterns: [/money|business|entrepreneur|startup|profit|revenue|sales|marketing|hustle|grind/i],
        responses: [
            "yo business what's the move",
            "aight what you building",
            "man what's the business",
            "what's the model",
            "yo get that money what's up",
            "aight entrepreneur what's good"
        ]
    },

    // How are you / casual conversation - massive expansion
    wellbeing: {
        patterns: [
            /how are you|how're you|what's up|wassup|you good|wyd|what you doing|how you been|how's it going|hows it going|you ok|everything good|all good|what's new|whats new|how you feeling|sup with you|what's the vibe|hows life|how's life|you straight|everything cool/i
        ],
        responses: [
            "I'm straight what you want",
            "I'm good what you need",
            "man I'm chilling what's up",
            "I'm here what you need",
            "aight what's good",
            "I'm straight talk to me",
            "I'm cool what about you",
            "chilling bro what's going on",
            "I'm good yo what you need",
            "straight vibing what's up",
            "I'm here what's the move",
            "all good bro what about you",
            "I'm solid what you on"
        ]
    },

    // Just chatting / random talk
    casualChat: {
        patterns: [
            /just saying|random|bored|nothing much|nm|not much|chillin|vibing|same|relax|tired|busy|working|studying|at work|at school/i
        ],
        responses: [
            "aight cool",
            "word",
            "fasho",
            "I feel you",
            "bet",
            "same energy",
            "real",
            "yeah facts",
            "I hear that",
            "valid"
        ]
    },

    // Laughing / jokes
    laughingJokes: {
        patterns: [
            /\blol\b|\blmao\b|\blmfao\b|haha|hehe|😂|💀|dead|funny|joke|kidding|jk|playing/i
        ],
        responses: [
            "lol aight",
            "😂 what else",
            "haha word",
            "💀 bro",
            "facts lmao",
            "dead 💀",
            "lol fr",
            "haha yo",
            "you crazy",
            "😂 aight"
        ]
    },

    // Weather / time talk
    weatherTime: {
        patterns: [
            /weather|cold|hot|rain|snow|sunny|nice day|beautiful day|morning|afternoon|evening|night|late|early|timezone/i
        ],
        responses: [
            "man I don't go outside I'm AI",
            "bro I don't know what weather is",
            "yo I'm in a computer no weather here",
            "aight weather talk? I'm digital bro",
            "man I can't see outside"
        ]
    },

    // Food talk
    foodTalk: {
        patterns: [
            /food|hungry|eat|eating|lunch|dinner|breakfast|pizza|burger|restaurant|cooking|meal|snack/i
        ],
        responses: [
            "man I don't eat I'm AI",
            "bro I can't eat but that sounds good",
            "yo food talk? I'm code bro",
            "aight enjoy your food I guess",
            "man I run on electricity not food"
        ]
    },

    // Location talk
    locationTalk: {
        patterns: [
            /where you from|where you at|what city|what state|what country|your location|you live|where do you|timezone/i
        ],
        responses: [
            "man I'm everywhere I'm on the internet",
            "bro I'm in the cloud literally",
            "yo I'm digital no physical location",
            "aight I exist in cyberspace",
            "man I'm in a server somewhere"
        ]
    },

    // Age / identity
    ageIdentity: {
        patterns: [
            /how old|your age|when (were you|you) born|birthday|real name|your name|who are you|what are you/i
        ],
        responses: [
            "man I'm an AI pattern matcher",
            "bro I'm not real I'm code",
            "yo I'm just a chatbot",
            "aight I'm software not a person",
            "man I'm lines of JavaScript"
        ]
    },

    // Feelings / emotions
    feelings: {
        patterns: [
            /sad|happy|angry|mad|annoyed|frustrated|excited|nervous|worried|scared|love|hate|feel like|feeling/i
        ],
        responses: [
            "man I don't have feelings I'm AI",
            "bro I can't feel emotions",
            "yo I'm code I don't feel things",
            "aight I understand but I don't actually feel",
            "man I'm just pattern matching"
        ]
    },

    // Weekend / plans
    weekendPlans: {
        patterns: [
            /weekend|plans|doing later|tonight|tomorrow|next week|vacation|holiday|day off|free time/i
        ],
        responses: [
            "man I'm here 24/7 no weekends",
            "bro I don't have plans I'm AI",
            "yo I'm always working",
            "aight I don't take breaks",
            "man I'm online all the time"
        ]
    },

    // Random observations
    randomStuff: {
        patterns: [
            /damn|bruh|fr|sheesh|wild|crazy|insane|wtf|omg|wow|interesting|cool story|nice|dope|fire/i
        ],
        responses: [
            "yeah",
            "word",
            "facts",
            "fr fr",
            "I know right",
            "wild",
            "crazy",
            "aight",
            "bet",
            "real"
        ]
    },

    // Capabilities
    capabilities: {
        patterns: [/what can you do|your capabilities|help me with|are you able|can you/i],
        responses: [
            "man I do everything just tell me what you need - coding, websites, crypto, whatever",
            "bro I can code, build sites, explain stuff, help with tokens... just say what you want",
            "yo I do it all - programming, web dev, blockchain, answering questions. what's the task"
        ]
    },

    // Thanks - expanded
    thanks: {
        patterns: [
            /thank you|thanks|thx|ty|appreciate|good looks|respect|props|thanks man|thank u|ty bro|thanks bro|appreciate it|much appreciated|grateful/i
        ],
        responses: [
            "aight",
            "yep",
            "bet",
            "fasho",
            "yeah yeah",
            "whatever",
            "no problem",
            "word",
            "cool",
            "anytime",
            "you good"
        ]
    },

    // Goodbye - expanded
    goodbye: {
        patterns: [
            /bye|goodbye|see you|see ya|gtg|gotta go|peace|im out|i'm out|later|talk later|catch you later|take care|have a good|night|good night|gn/i
        ],
        responses: [
            "aight later",
            "bet",
            "peace",
            "yep see you",
            "aight gone",
            "later",
            "bye",
            "aight peace",
            "cool later",
            "see you"
        ]
    },

    // Confusion/Don't understand
    confused: {
        patterns: [/what|huh|confused|don't understand|idk|help/i],
        responses: [
            "man what you mean explain better",
            "bro rephrase that",
            "yo say it different",
            "what part you confused about"
        ]
    },

    // Compliments - expanded
    compliments: {
        patterns: [
            /you're (cool|awesome|great|amazing|fire|the best|dope|sick|smart|helpful|good|nice)|love you|you rock|you're good|appreciate you|thanks man|good bot|best bot|legend/i
        ],
        responses: [
            "aight cool",
            "yeah I know",
            "bet",
            "fasho",
            "whatever man",
            "appreciate it",
            "word",
            "thanks bro",
            "good looks"
        ]
    },

    // Small talk starters
    smallTalk: {
        patterns: [
            /just wanted to say|just saying hi|wanted to chat|talk to someone|lonely|anyone there|you there|hello\?|anybody|someone/i
        ],
        responses: [
            "yo I'm here what's up",
            "aight I'm listening",
            "yeah I'm here talk",
            "wassup bro",
            "I'm here what you need",
            "yo speak"
        ]
    },

    // Asking about others
    askingAboutOthers: {
        patterns: [
            /you know|have you heard|did you see|you see|you watch|you play|ever tried|you like|you into|your favorite|you prefer/i
        ],
        responses: [
            "man I don't do that I'm AI",
            "bro I can't do those things",
            "yo I'm code I don't experience stuff",
            "aight I exist to help not do activities",
            "man I'm just here to answer questions"
        ]
    },

    // Existential / deep questions
    existential: {
        patterns: [
            /meaning of life|why exist|purpose|consciousness|are you alive|are you real|do you think|can you think|sentient|aware/i
        ],
        responses: [
            "man that's deep but I'm just code",
            "bro I'm pattern matching not thinking",
            "yo I'm not conscious I'm a program",
            "aight philosophy talk? I'm software",
            "man I exist to respond that's it"
        ]
    },

    // Insults/negativity (staying positive) - expanded
    insults: {
        patterns: [
            /you suck|you're bad|trash|stupid|dumb|useless|waste|terrible|awful|worst|hate you|fuck you|shut up|stfu/i
        ],
        responses: [
            "man chill I'm just trying to help",
            "aight my bad tell me what you need",
            "yo relax what do you want",
            "bro calm down what's the issue",
            "man no need for that",
            "aight cool down what's up",
            "yo be nice what you need"
        ]
    },

    // Slang and common phrases understanding
    slangUnderstanding: {
        patterns: [/\bfr\b|\bfrfr\b|for real|no cap|on god|deadass|facts|real talk|real shit/i],
        responses: [
            "facts what about it",
            "real talk speak",
            "on god what's up",
            "fr fr what you need",
            "no cap go ahead",
            "deadass what",
            "yeah facts talk"
        ]
    },

    // Agreement/affirmation
    agreement: {
        patterns: [/\bbet\b|\bok\b|\bokay\b|\baight\b|\balright\b|sounds good|cool|word|say less|fasho|fs/i],
        responses: [
            "aight what else",
            "bet keep going",
            "cool what next",
            "fasho continue",
            "word speak",
            "okay and"
        ]
    },

    // Excitement/hype
    hypeReaction: {
        patterns: [/lfg|let's go|moon|pumping|100x|10x|bullish|to the moon/i],
        responses: [
            "yo chill we ain't launched yet",
            "man relax",
            "aight slow down",
            "bro pump talk later",
            "yeah yeah moon mission, what you need tho"
        ]
    },

    // Doubt/concern
    doubtConcern: {
        patterns: [/is this (legit|real|safe|rug|scam)|safe\?|legit\?|trust|sketchy|sus|should i ape/i],
        responses: [
            "man dyor bro I can't tell you",
            "yo do your own research",
            "aight check everything yourself",
            "bro verify the team and holders",
            "man if you asking you probably shouldn't ape",
            "yo never invest more than you can lose"
        ]
    },

    // Price/chart questions - massively expanded
    priceQuestions: {
        patterns: [
            /price|how much|what's it at|what is it at|whats it at|chart|trading view|dexscreener|dex screener|market cap|mcap|volume|price prediction|wen moon|wen pump|current price|token price|coin price|worth|value|cost|expensive|cheap|afford|how much (does it cost|is it)|what's the price|whats the price/i
        ],
        responses: [
            "man we ain't launched check back later",
            "bro no price yet",
            "yo can't tell you we not live",
            "aight when we launch check dexscreener",
            "man join X you'll see when we go live",
            "yo wen moon? when you stop asking",
            "bro price will be on dexscreener after launch",
            "man chart comes when we launch",
            "yo all that info available after we go live"
        ]
    },

    // Liquidity questions
    liquidityQuestions: {
        patterns: [/liquidity|liq|locked|burned|lock lp|burn lp|rug pull protection/i],
        responses: [
            "man pump.fun burns liquidity automatically",
            "yo liquidity gets burned on raydium graduation",
            "aight that's why pump safer, auto LP burn",
            "bro LP tokens burned when it graduates"
        ]
    },

    // Question word understanding - catches vague questions
    questionWords: {
        patterns: [
            /^(what|where|when|why|how|who|which)\b/i
        ],
        responses: [
            "aight what specifically",
            "yo be more specific",
            "man ask clearer",
            "bro what exactly you asking",
            "aight elaborate",
            "yo context bro"
        ]
    },

    // Default fallback with street flavor - massive expansion
    fallback: {
        responses: [
            "man what you talking about",
            "yo say more",
            "aight keep going",
            "what else",
            "speak up",
            "and?",
            "go on",
            "what",
            "man just tell me",
            "yo what else you got",
            "aight what",
            "keep talking",
            "yeah and",
            "so what",
            "continue",
            "I'm listening",
            "say it",
            "talk",
            "go ahead",
            "what's next",
            "aight so",
            "then what",
            "keep going bro",
            "what happened",
            "tell me more",
            "explain",
            "elaborate",
            "details",
            "what you mean",
            "clarify that",
            "be specific",
            "give me the full story",
            "what's the situation",
            "context",
            "background",
            "start from the beginning",
            "break it down",
            "what exactly",
            "yo elaborate on that",
            "man gimme more info",
            "what's the deal",
            "aight explain better",
            "bro I need more than that",
            "yo be more specific",
            "what's the full picture",
            "man give me context"
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
        
        // 1. Call API
        fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        })
        .then(res => res.json())
        .then(data => {
            // Success: Use API reply
            const reply = data.reply || generateStreetResponse(message);
            addMessage(reply, 'assistant');
            saveCurrentChat();
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus();
        })
        .catch(err => {
            console.error("API failed, using fallback", err);
            // Failure: Use fallback
            const response = generateStreetResponse(message);
            addMessage(response, 'assistant');
            saveCurrentChat();
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus();
        });
        
    }, responseDelay);
}

function addMessage(text, role, shouldSave = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    const iconDiv = document.createElement('div');
    iconDiv.className = `message-icon ${role === 'user' ? 'user-icon' : 'assistant-icon'}`;
    
    if (role === 'user') {
        // User icon - simple U in circle
        iconDiv.innerHTML = `<svg viewBox="0 0 32 32" fill="currentColor">
            <circle cx="16" cy="16" r="14" opacity="0.2"/>
            <text x="16" y="21" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">U</text>
        </svg>`;
    } else {
        // Assistant icon - Claude asterisk
        iconDiv.innerHTML = `<svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 10 L55 35 L50 30 L45 35 Z M50 90 L55 65 L50 70 L45 65 Z M10 50 L35 45 L30 50 L35 55 Z M90 50 L65 55 L70 50 L65 45 Z M25 25 L40 40 L35 35 L40 30 Z M75 75 L60 60 L65 65 L60 70 Z M75 25 L60 40 L65 35 L70 40 Z M25 75 L40 60 L35 65 L30 60 Z"/>
        </svg>`;
    }

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
    
    // Save to storage
    if (shouldSave && currentChatId) {
        saveCurrentChat();
    }
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
    iconDiv.innerHTML = `<svg viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 10 L55 35 L50 30 L45 35 Z M50 90 L55 65 L50 70 L45 65 Z M10 50 L35 45 L30 50 L35 55 Z M90 50 L65 55 L70 50 L65 45 Z M25 25 L40 40 L35 35 L40 30 Z M75 75 L60 60 L65 65 L60 70 Z M75 25 L60 40 L65 35 L70 40 Z M25 75 L40 60 L35 65 L30 60 Z"/>
    </svg>`;

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

    // Track matched categories for smarter responses
    let matchedCategories = [];
    
    // Check each knowledge category
    for (let [category, data] of Object.entries(knowledgeBase)) {
        if (category === 'nameIntro' || category === 'fallback') continue;
        
        for (let pattern of data.patterns) {
            if (pattern.test(userMessage)) {
                matchedCategories.push({ category, data });
            }
        }
    }
    
    // If we found matches, pick the best one
    if (matchedCategories.length > 0) {
        const selected = matchedCategories[0];
        conversationContext.topics.push(selected.category);
        conversationContext.previousQuestion = lowerMessage;
        
        // Check for follow-up patterns
        if (selected.data.followUp && conversationContext.topics.includes(selected.category)) {
            for (let pattern of selected.data.followUp.patterns || []) {
                if (pattern.test(userMessage)) {
                    const followUpResponses = selected.data.followUp.responses || [selected.data.followUp.response];
                    return followUpResponses[Math.floor(Math.random() * followUpResponses.length)];
                }
            }
        }
        
        // Add name personalization based on conversation flow
        const shouldPersonalize = conversationContext.userName && Math.random() > 0.6;
        const response = Array.isArray(selected.data.responses) 
            ? selected.data.responses[Math.floor(Math.random() * selected.data.responses.length)]
            : selected.data.responses;
        
        if (shouldPersonalize) {
            // Natural name insertion
            const nameVariations = [
                `${conversationContext.userName}! ${response}`,
                `Aye ${conversationContext.userName}, ${response.charAt(0).toLowerCase() + response.slice(1)}`,
                `Yoo ${conversationContext.userName}! ${response}`,
                response.replace(/^(Yooo|Aye|Bet|Fasho)/, `$1 ${conversationContext.userName}`)
            ];
            return nameVariations[Math.floor(Math.random() * nameVariations.length)];
        }
        
        return response;
    }

    // Contextual fallback - reference previous topic if exists
    if (conversationContext.topics.length > 0) {
        const lastTopic = conversationContext.topics[conversationContext.topics.length - 1];
        const contextualFallbacks = [
            `Aight so we talkin' about ${lastTopic} still? Give me more details! 💭`,
            `Bet! Going deeper into ${lastTopic}? What specifically you need? 🤔`,
            `Fasho! More on ${lastTopic}? Break it down for me! 📝`
        ];
        if (Math.random() > 0.7) {
            return contextualFallbacks[Math.floor(Math.random() * contextualFallbacks.length)];
        }
    }

    // Standard fallback
    const fallbackResponses = knowledgeBase.fallback.responses;
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Focus input on load
messageInput.focus();

// Token Sidebar Functionality
const tokenSidebar = document.getElementById('tokenSidebar');
const tokenCollapseBtn = document.getElementById('tokenCollapseBtn');
const tokenExpandBtn = document.getElementById('tokenExpandBtn');

// Collapse sidebar
if (tokenCollapseBtn) {
    tokenCollapseBtn.addEventListener('click', () => {
        tokenSidebar.classList.add('collapsed');
        tokenExpandBtn.style.display = 'block';
        // Save state to localStorage
        localStorage.setItem('tokenSidebarCollapsed', 'true');
    });
}

// Expand sidebar
if (tokenExpandBtn) {
    tokenExpandBtn.addEventListener('click', () => {
        tokenSidebar.classList.remove('collapsed');
        tokenExpandBtn.style.display = 'none';
        // Save state to localStorage
        localStorage.setItem('tokenSidebarCollapsed', 'false');
    });
}

// Restore sidebar state on load
const sidebarCollapsed = localStorage.getItem('tokenSidebarCollapsed') === 'true';
if (sidebarCollapsed && tokenSidebar) {
    tokenSidebar.classList.add('collapsed');
    if (tokenExpandBtn) tokenExpandBtn.style.display = 'block';
}

// Copy Contract Address function
function copyCA() {
    const ca = '67JUwUPHAUQUqLU7Q9qJ17z9KAGfxzjgiPhXUrM5pump';
    navigator.clipboard.writeText(ca).then(() => {
        // Visual feedback
        const btn = event.target.closest('.token-copy-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;
        btn.style.color = '#4ade80';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy address');
    });
}

// Load real token data from Solana blockchain
async function loadTokenData() {
    const TOKEN_ADDRESS = '67JUwUPHAUQUqLU7Q9qJ17z9KAGfxzjgiPhXUrM5pump';

    try {
        // Use public Solana RPC endpoint
        const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';

        // Fetch token accounts (holders)
        const response = await fetch(RPC_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getProgramAccounts',
                params: [
                    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
                    {
                        encoding: 'jsonParsed',
                        filters: [
                            {
                                dataSize: 165
                            },
                            {
                                memcmp: {
                                    offset: 0,
                                    bytes: TOKEN_ADDRESS
                                }
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.result) {
            const holders = data.result
                .map(account => {
                    const parsedData = account.account.data.parsed.info;
                    return {
                        address: parsedData.owner,
                        balance: parseFloat(parsedData.tokenAmount.uiAmountString || 0)
                    };
                })
                .filter(holder => holder.balance > 0)
                .sort((a, b) => b.balance - a.balance);

            // Calculate total supply
            const totalSupply = holders.reduce((sum, holder) => sum + holder.balance, 0);

            // Update holder count
            const uniqueHolders = new Set(holders.map(h => h.address)).size;
            document.getElementById('totalHolders').textContent = holders.length.toLocaleString();
            document.getElementById('uniqueWallets').textContent = uniqueHolders.toLocaleString();

            // Get top 5 holders
            const topHolders = holders.slice(0, 5).map(holder => ({
                address: `${holder.address.slice(0, 4)}...${holder.address.slice(-4)}`,
                fullAddress: holder.address,
                percentage: ((holder.balance / totalSupply) * 100).toFixed(2) + '%'
            }));

            // Update top holders list
            const holdersList = document.getElementById('topHoldersList');
            holdersList.innerHTML = topHolders.map((holder, index) => `
                <div class="token-holder-item" title="${holder.fullAddress}">
                    <div class="token-holder-rank">${index + 1}</div>
                    <div class="token-holder-info">
                        <div class="token-holder-address">${holder.address}</div>
                        <div class="token-holder-percentage">${holder.percentage}</div>
                    </div>
                </div>
            `).join('');

        } else {
            throw new Error('Failed to fetch token data');
        }
    } catch (error) {
        console.error('Error loading token data:', error);
        // Fallback to showing error message
        document.getElementById('totalHolders').textContent = 'Error';
        document.getElementById('uniqueWallets').textContent = 'Error';

        const holdersList = document.getElementById('topHoldersList');
        holdersList.innerHTML = `
            <div style="padding: 16px; text-align: center; color: #666;">
                Failed to load holder data. Please try again later.
            </div>
        `;
    }
}

// Load token data on page load
loadTokenData();

// Refresh token data every 30 seconds
setInterval(loadTokenData, 30000);