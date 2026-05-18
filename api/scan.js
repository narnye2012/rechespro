export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { imageB64, mediaType } = req.body;
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: imageB64 } },
          { type: 'text', text: `אתה מנתח חשבוניות לאולמות אירועים. חלץ את כל פריטי הרכישה. השב רק ב-JSON ללא backticks:\n{"supplier":"שם הספק","date":"YYYY-MM-DD","items":[{"product":"מוצר","category":"מזון/משקאות/ציוד/אחר","unit":"יחידה","qty":מספר,"pricePerUnit":מחיר,"total":סכום}]}` }
        ]
      }]
    })
  });
  
  const data = await response.json();
  res.status(200).json(data);
}
