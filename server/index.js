import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS for frontend requests
app.use(cors());

// Load mock data
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));

// Calculate relevance score based on query terms
function getScore(query, doc) {
  if (!query || !doc) return 0;
  
  const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
  const textLower = (doc.text + ' ' + doc.title).toLowerCase();
  const keywords = doc.keywords || [];
  
  let score = 0;
  
  queryTerms.forEach(term => {
    // Count occurrences in text and title
    const textMatches = (textLower.match(new RegExp(term, 'g')) || []).length;
    score += textMatches * 0.1;
    
    // Bonus for exact matches in text
    if (textLower.includes(term)) {
      score += 0.2;
    }
    
    // Higher bonus for keyword matches
    const keywordMatch = keywords.some(keyword => 
      keyword.toLowerCase().includes(term) || term.includes(keyword.toLowerCase())
    );
    if (keywordMatch) {
      score += 0.4;
    }
    
    // Title matches get higher weight
    if (doc.title.toLowerCase().includes(term)) {
      score += 0.3;
    }
  });
  
  // Normalize score to 0-1 range
  return Math.min(score, 1);
}

// Search endpoint
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  
  if (!query.trim()) {
    return res.json([]);
  }
  
  const results = data
    .map(doc => ({
      ...doc,
      score: getScore(query, doc)
    }))
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10); // Limit to top 10 results
  
  console.log(`Search for "${query}" returned ${results.length} results`);
  res.json(results);
});

// Get all data endpoint
app.get('/data', (req, res) => {
  // Return all data with neutral scores for display purposes
  const allDataWithScores = data.map((doc, index) => ({
    ...doc,
    score: 1.0 - (index * 0.05) // Assign decreasing scores for display
  }));
  
  console.log(`Serving all ${allDataWithScores.length} documents`);
  res.json(allDataWithScores);
});

app.listen(PORT, () => {
  console.log(`🚀 Search server running on http://localhost:${PORT}`);
});