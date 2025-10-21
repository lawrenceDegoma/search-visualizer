# 🔍 Search Result Visualizer

A full-stack web application that visualizes search results through interactive D3.js charts. Users can enter queries and see how documents rank based on relevance scores through dynamic bar charts.

## Features

- **Interactive Search Interface**: Clean, responsive search input with real-time feedback
- **Multiple Visualization Types**: 
  - **Bar Charts**: Traditional ranking visualization with animated bars
  - **Force-Directed Network Graph**: Interactive node-link diagram showing document relationships
- **Dynamic D3.js Visualizations**: Smooth animations and transitions between different views
- **Intelligent Document Relationships**: Network graph shows connections based on:
  - Shared categories and topics
  - Common keywords and themes  
  - Content similarity analysis
- **Category-Based Color Coding**: Documents grouped by technology domains (AI/ML, Web Dev, etc.)
- **Interactive Elements**: 
  - Hover tooltips with detailed document information
  - Draggable nodes in network view
  - Clickable visualization toggles
- **Enhanced Relevance Scoring**: Improved algorithm considering keywords, categories, and content
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Updates**: Instant visualization updates when switching between chart types

## Tech Stack

### Frontend
- **React 19** with functional components and hooks
- **D3.js 7** for data visualization and SVG manipulation
- **Axios** for HTTP requests
- **Vite** for fast development and building
- **CSS3** with modern flexbox layouts

### Backend
- **Node.js** with ES6 modules
- **Express.js** for REST API
- **CORS** enabled for cross-origin requests
- **JSON-based** mock data storage

## Project Structure

```
search-visualizer/
├── server/
│   ├── index.js          # Express server with search API
│   ├── data.json         # Mock document database
│   └── package.json      # Backend dependencies
├── src/
│   ├── App.jsx           # Main React component with D3 visualization
│   ├── App.css           # Styling and responsive design
│   ├── main.jsx          # React app entry point
│   └── index.css         # Global styles
├── package.json          # Frontend dependencies
└── vite.config.js        # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd search-visualizer
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

#### Option 1: Run both servers separately

1. **Start the backend server**
   ```bash
   npm run server
   ```
   Server will run on `http://localhost:3001`

2. **In a new terminal, start the frontend**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

#### Option 2: Run both servers concurrently
```bash
npm run dev:all
```

## API Reference

### Search Endpoint
- **URL**: `GET /search?q=<query>`
- **Parameters**: 
  - `q` (string): Search query
- **Response**: Array of documents with relevance scores
  ```json
  [
    {
      "title": "Document Title",
      "text": "Document content...",
      "score": 0.87
    }
  ]
  ```

## How It Works

### Relevance Scoring Algorithm
The backend implements a simple but effective relevance scoring system:

1. **Term Matching**: Splits query into individual terms (ignoring words < 3 characters)
2. **Occurrence Counting**: Counts how many times each term appears in document text/title
3. **Exact Match Bonus**: Provides additional scoring for exact term matches
4. **Score Normalization**: Normalizes final scores to 0-1 range
5. **Ranking**: Sorts results by score (highest first) and limits to top 10

### Visualization Features

#### Bar Chart View
- **Animated Bar Charts**: Smooth transitions when new searches are performed
- **Color Scaling**: Bars use a blue gradient based on relevance scores
- **Interactive Tooltips**: Hover over bars to see full document details
- **Responsive Scales**: Chart automatically adjusts to accommodate result count
- **Score Labels**: Precise relevance scores displayed on each bar

#### Network Graph View
- **Force-Directed Layout**: Physics-based positioning creates natural document clusters
- **Category Color Coding**: Each technology domain has a distinct color
- **Relationship Links**: Connections show shared keywords, categories, and content similarity
- **Interactive Nodes**: 
  - Drag nodes to explore relationships
  - Hover for detailed information
  - Size represents relevance score
- **Dynamic Legend**: Shows category colors and meanings
- **Collision Detection**: Prevents node overlap for better readability

## Development

### Adding New Documents
Edit `server/data.json` to add new documents to the search corpus:

```json
{
  "title": "Your Document Title",
  "text": "Your document content that will be searched..."
}
```

### Customizing the Scoring Algorithm
Modify the `getScore()` function in `server/index.js` to implement different relevance algorithms.

### Styling Changes
Update `src/App.css` for visual customizations. The app uses CSS custom properties for easy theming.

## Future Enhancements

- **Network Graph View**: Visualize relationships between documents
- **Advanced Filtering**: Score threshold sliders and category filters  
- **Semantic Search**: Integration with embedding-based similarity
- **Real-time Updates**: WebSocket connections for live search
- **Export Features**: Save visualizations as images or data
- **Search History**: Track and replay previous searches
- **Performance Analytics**: Search timing and result quality metrics

## Performance

- **Frontend**: Optimized D3.js rendering with efficient DOM updates
- **Backend**: In-memory search with sub-millisecond query times
- **Responsive**: Mobile-first design with CSS Grid and Flexbox

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
