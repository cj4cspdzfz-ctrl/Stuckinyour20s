export function $(selector) {
  return document.querySelector(selector);
}

export function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

export function saveLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadLS(key, defaultValue) {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

export function extractKeywords(text) {
  if (!text) return [];

  text = text.toLowerCase();
  const common = [
    "javascript", "react", "node", "python", "html", "css", "marketing",
    "sales", "customer service", "barista", "volunteer", "coordinator",
    "internship", "designer", "graphic", "data", "analysis", "teaching",
    "coach", "events", "hospitality", "engineering", "manager", "social media"
  ];

  const found = new Set();
  common.forEach(keyword => {
    if (text.includes(keyword)) found.add(keyword);
  });

  const tokens = text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 3);

  tokens.forEach(token => {
    const frequency = tokens.filter(t => t === token).length;
    if (frequency > 1) found.add(token);
  });

  return Array.from(found);
}
