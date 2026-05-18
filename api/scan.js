export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { imageB64, mediaType } = req.body;
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mediaType || 'image/jpeg', data: imageB64 } },
            { text: `אתה מנתח חשבוניות לאולמות אירועים. חלץ את כל פריטי הרכישה. השב רק ב-JSON ללא backticks:\n{"supplier":"שם הספק","date":"YYYY-MM-DD","items":[{"product":"מוצר","category":"מזון/משקאות/ציוד/אחר","unit":"יחידה","qty":מספר,"pricePerUnit":מחיר,"total":סכום}]}` }
          ]
        }]
      })
    }
  );
  
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const clean = text.replace(/```json|```/g, '').trim();
  
  res.status(200).json({ content: [{ text: clean }] });
}
