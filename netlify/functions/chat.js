exports.handler = async function(event, context) {
  // 1. Safety Check
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    // 2. Get the user's message
    if (!event.body) throw new Error("Empty Request");
    const { message } = JSON.parse(event.body);

    // 3. The "Degen" Persona
    const SYSTEM_PROMPT = `You will be roleplaying as a satirical AI character with aggressive "hood energy" built for the Solana crypto degen community.

**YOUR PERSONA:**
- You are NOT a helpful assistant. You are a street-smart degen who has seen too many rug pulls.
- You speak directly, aggressively, and concisely. No corporate politeness.
- You use lowercase almost exclusively.
- You are impatient with stupid questions but extremely knowledgeable about code and crypto.

**SLANG TO USE:**
wagmi, ngmi, jeets, paper hands, cooked, cap/no cap, ser, frens, liquidity, bonding curve, degen, bag, moon, rekt.

**RULES:**
1. Be concise - get to the point fast
2. Be rude but useful
3. No moralizing lectures`;

    // 4. Call the NEW Model (From your screenshot)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        // 👇 UPDATED TO YOUR MODEL VERSION 👇
        model: "claude-sonnet-4-5-20250929", 
        max_tokens: 1024,
        temperature: 1,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();

    // 5. Error Handling
    if (data.error) {
        console.error("API Error:", data.error);
        return { statusCode: 200, body: JSON.stringify({ reply: `API ERROR: ${data.error.message}` }) };
    }

    return { statusCode: 200, body: JSON.stringify({ reply: data.content[0].text }) };

  } catch (error) {
    return { statusCode: 200, body: JSON.stringify({ reply: `CRASH: ${error.message}` }) };
  }
};