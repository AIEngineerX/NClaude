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
const headerCaBtn = document.getElementById('headerCaBtn');

// --- CONFIGURATION ---
const CA_ADDRESS = "67JUwUPHAUQUqLU7Q9qJ17z9KAGfxzjgiPhXUrM5pump";
const X_LINK = "https://x.com/NiggaClaudeSol";

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

// --- NEW: Header CA Button Logic ---
if (headerCaBtn) {
    headerCaBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(CA_ADDRESS).then(() => {
            // Visual feedback
            const originalContent = headerCaBtn.innerHTML;
            headerCaBtn.innerHTML = `
                <span style="color: #4ade80; font-weight: bold;">Copied!</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; color: #4ade80;">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            setTimeout(() => {
                headerCaBtn.innerHTML = originalContent;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });
}

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
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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
    conversationContext = { userName: null, topics: [], vibe: 'street', previousQuestion: null };
    
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

// New chat button logic
newChatBtn.addEventListener('click', () => {
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

// Handle quick action buttons (Welcome Screen)
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        
        switch(action) {
            case 'dex':
                startChat('Show me the Dex');
                break;
            case 'ca':
                // Transition to chat if on welcome screen
                if (welcomeScreen.style.display !== 'none') {
                    startChat('Yo drop the CA');
                } else {
                    addMessage('Yo drop the CA', 'user');
                    // We'll let the AI handle this response via the "ca" knowledge base
                    const typingId = showTypingIndicator();
                    setTimeout(() => {
                        removeTypingIndicator(typingId);
                        const response = `Aight bet. Don't fumble the bag:\n\n${CA_ADDRESS}`;
                        addMessage(response, 'assistant');
                        saveCurrentChat();
                    }, 600);
                }
                break;
            case 'x':
                window.open(X_LINK, '_blank');
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
    
    createNewChat();
    
    welcomeScreen.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        chatInterface.style.display = 'flex';
        
        const greetings = ["aight what", "speak", "yo what you want", "talk", "say something", "what's good"];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        addMessage(randomGreeting, 'assistant');
        
        addMessage(firstMessage, 'user');

        setTimeout(() => {
            const typingId = showTypingIndicator();
            
            fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: firstMessage })
            })
            .then(res => res.json())
            .then(data => {
                removeTypingIndicator(typingId);
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

// Knowledge base
const knowledgeBase = {
    ca: {
        patterns: [/\bca\b|contract address|token address|what's the ca|where's the ca|drop ca|post ca|give me ca/i],
        responses: [
            `Aight bet. Don't fumble the bag:\n\n${CA_ADDRESS}`,
            `Man here take it and ape in:\n\n${CA_ADDRESS}`,
            `Stop asking and just buy. Here:\n\n${CA_ADDRESS}`,
            `Don't get rugged by fakes. Real CA:\n\n${CA_ADDRESS}`
        ]
    },
    greetings: {
        patterns: [/^(hi|hello|hey|greetings|sup|yo|wassup|what's good|wsg|howdy|ayo|wyd|yoo|ey|ayy|wsp|yooo)/i],
        responses: ["tf you want", "what", "speak", "say that", "talk to me", "wassup wit you", "aye what you need", "yo say something", "aight what", "yeah", "wsp"]
    },
    nameIntro: {
        patterns: [/my name is (\w+)/i, /i'm (\w+)/i, /im (\w+)/i, /call me (\w+)/i],
        response: (name) => {
            conversationContext.userName = name;
            return `aight ${name} what you need`;
        }
    },
    crypto: {
        patterns: [/crypto|blockchain|bitcoin|ethereum|solana|token|web3|defi|nft|pump|degen|moon/i],
        responses: ["yo crypto what coin", "blockchain what you holding", "man what's the move", "solana what about it", "bro you a degen or investor pick one"]
    },
    pumpFun: {
        patterns: [/pump\.fun|pump fun|bonding curve|launch on pump/i],
        responses: ["aight so pump.fun is where you launch tokens on solana. fair launch, bonding curve model", "pump works on bonding curve - price increases with buys, auto graduates to raydium when it hits cap", "yo pump.fun eliminated rug risk during launch, bonding curve pricing is transparent"]
    },
    dex: {
        patterns: [/dex|raydium|jupiter|uniswap|trading|swap|buy|where to buy/i],
        responses: ["click the Dex button on the main screen bro", "we on Raydium just hit the button", "man use the Dex button I put there for a reason"]
    },
    xCommunity: {
        patterns: [/twitter|x community|\bx\b|social|follow|community/i],
        responses: ["hit the X button on the home screen", "check the community link I put on the main page", "man just click the X button"]
    },
    fallback: {
        responses: ["man what you talking about", "yo say more", "aight keep going", "what else", "speak up", "and?", "go on", "what", "man just tell me"]
    }
};

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 200) + 'px';
});

// Send message on Enter
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

    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';

    messageInput.disabled = true;
    sendButton.disabled = true;

    const typingId = showTypingIndicator();

    const responseDelay = 800 + Math.random() * 1200;
    setTimeout(() => {
        removeTypingIndicator(typingId);
        
        fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        })
        .then(res => res.json())
        .then(data => {
            const reply = data.reply || generateStreetResponse(message);
            addMessage(reply, 'assistant');
            saveCurrentChat();
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus();
        })
        .catch(err => {
            console.error("API failed, using fallback", err);
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
        iconDiv.innerHTML = `<svg viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="14" opacity="0.2"/><text x="16" y="21" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">U</text></svg>`;
    } else {
        iconDiv.innerHTML = `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 10 L55 35 L50 30 L45 35 Z M50 90 L55 65 L50 70 L45 65 Z M10 50 L35 45 L30 50 L35 55 Z M90 50 L65 55 L70 50 L65 45 Z M25 25 L40 40 L35 35 L40 30 Z M75 75 L60 60 L65 65 L60 70 Z M75 25 L60 40 L65 35 L70 40 Z M25 75 L40 60 L35 65 L30 60 Z"/></svg>`;
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    
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
    iconDiv.innerHTML = `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 10 L55 35 L50 30 L45 35 Z M50 90 L55 65 L50 70 L45 65 Z M10 50 L35 45 L30 50 L35 55 Z M90 50 L65 55 L70 50 L65 45 Z M25 25 L40 40 L35 35 L40 30 Z M75 75 L60 60 L65 65 L60 70 Z M75 25 L60 40 L65 35 L70 40 Z M25 75 L40 60 L35 65 L30 60 Z"/></svg>`;
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
    if (indicator) indicator.remove();
}

function generateStreetResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    for (let pattern of knowledgeBase.nameIntro.patterns) {
        const match = userMessage.match(pattern);
        if (match) return knowledgeBase.nameIntro.response(match[1]);
    }

    let matchedCategories = [];
    for (let [category, data] of Object.entries(knowledgeBase)) {
        if (category === 'nameIntro' || category === 'fallback') continue;
        for (let pattern of data.patterns) {
            if (pattern.test(userMessage)) matchedCategories.push({ category, data });
        }
    }
    
    if (matchedCategories.length > 0) {
        const selected = matchedCategories[0];
        conversationContext.topics.push(selected.category);
        const response = Array.isArray(selected.data.responses) 
            ? selected.data.responses[Math.floor(Math.random() * selected.data.responses.length)]
            : selected.data.responses;
        return response;
    }

    const fallbackResponses = knowledgeBase.fallback.responses;
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Token Sidebar Functionality
const tokenSidebar = document.getElementById('tokenSidebar');
const tokenCollapseBtn = document.getElementById('tokenCollapseBtn');
const tokenExpandBtn = document.getElementById('tokenExpandBtn');

// Collapse sidebar
if (tokenCollapseBtn) {
    tokenCollapseBtn.addEventListener('click', () => {
        tokenSidebar.classList.add('collapsed');
        tokenExpandBtn.style.display = 'block';
        localStorage.setItem('tokenSidebarCollapsed', 'true');
    });
}

// Expand sidebar
if (tokenExpandBtn) {
    tokenExpandBtn.addEventListener('click', () => {
        tokenSidebar.classList.remove('collapsed');
        tokenExpandBtn.style.display = 'none';
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
    const ca = CA_ADDRESS;
    navigator.clipboard.writeText(ca).then(() => {
        const btn = event.target.closest('.token-copy-btn');
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            btn.style.color = '#4ade80';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.color = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Load real token data from Solana blockchain
async function loadTokenData() {
    const TOKEN_ADDRESS = CA_ADDRESS;
    try {
        const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
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
                            { dataSize: 165 },
                            { memcmp: { offset: 0, bytes: TOKEN_ADDRESS } }
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

            const totalSupply = holders.reduce((sum, holder) => sum + holder.balance, 0);
            const uniqueHolders = new Set(holders.map(h => h.address)).size;
            
            const totalHoldersEl = document.getElementById('totalHolders');
            if (totalHoldersEl) totalHoldersEl.textContent = holders.length.toLocaleString();
            
            const uniqueWalletsEl = document.getElementById('uniqueWallets');
            if (uniqueWalletsEl) uniqueWalletsEl.textContent = uniqueHolders.toLocaleString();

            const topHolders = holders.slice(0, 5).map(holder => ({
                address: `${holder.address.slice(0, 4)}...${holder.address.slice(-4)}`,
                fullAddress: holder.address,
                percentage: ((holder.balance / totalSupply) * 100).toFixed(2) + '%'
            }));

            const holdersList = document.getElementById('topHoldersList');
            if (holdersList) {
                holdersList.innerHTML = topHolders.map((holder, index) => `
                    <div class="token-holder-item" title="${holder.fullAddress}">
                        <div class="token-holder-rank">${index + 1}</div>
                        <div class="token-holder-info">
                            <div class="token-holder-address">${holder.address}</div>
                            <div class="token-holder-percentage">${holder.percentage}</div>
                        </div>
                    </div>
                `).join('');
            }

        }
    } catch (error) {
        console.error('Error loading token data:', error);
    }
}

// Load token data on page load
loadTokenData();
setInterval(loadTokenData, 30000);

messageInput.focus();
