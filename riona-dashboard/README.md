# Riona Dashboard

A modern, responsive web dashboard for managing the Riona AI Agent backend. Built with Next.js 15, Tailwind CSS, and shadcn/ui components.

## Features

- 🎨 **Modern UI**: Clean, responsive design with dark/light mode toggle
- 📱 **Mobile-First**: Fully responsive with collapsible sidebar
- 🔄 **Real-time Logs**: Server-Sent Events (SSE) streaming with filtering
- 🤖 **Character Management**: Create and manage AI personalities
- 📊 **Analytics Dashboard**: Stats and activity monitoring
- ⚡ **Instagram Actions**: Automated posting, liking, and commenting
- ⚙️ **Settings Management**: Configure backend and credentials
- 🔒 **Secure**: JWT authentication and masked sensitive data

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript (no TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Components**: Custom shadcn/ui inspired components

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit NEXT_PUBLIC_RIONA_API to point to your backend
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Dashboard**
   ```
   http://localhost:3099
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_RIONA_API` | Backend API URL | `http://localhost:3099` |

## Project Structure

```
├── app/                     # Next.js App Router pages
│   ├── dashboard/           # Main dashboard
│   ├── characters/          # Character management
│   ├── actions/            # Instagram actions
│   ├── logs/               # Real-time logs
│   ├── settings/           # Configuration
│   └── api/proxy/          # Optional CORS proxy
├── components/             # Reusable UI components
│   ├── Sidebar.jsx         # Navigation sidebar
│   ├── Topbar.jsx         # Top navigation bar
│   ├── StatCard.jsx       # Dashboard statistics
│   ├── CharacterCard.jsx  # Character display
│   ├── CharacterForm.jsx  # Character creation/editing
│   ├── ActionCard.jsx     # Action form wrapper
│   ├── LogViewer.jsx      # Real-time log display
│   └── SettingsForm.jsx   # Settings configuration
├── lib/                   # Utility functions
│   ├── rionaApi.js        # Backend API adapter
│   ├── sse.js             # Server-Sent Events helper
│   └── utils.js           # Common utilities
└── public/               # Static assets
```

## API Integration

The dashboard communicates with the Riona AI Agent backend through a comprehensive API adapter (`lib/rionaApi.js`). It automatically maps to existing backend endpoints:

### Supported Endpoints
- `POST /api/login` - Instagram authentication
- `POST /api/interact` - Interact with posts
- `POST /api/dm` - Send direct messages
- `POST /api/scrape-followers` - Scrape follower lists
- `GET /api/status` - Backend health check
- `DELETE /api/clear-cookies` - Clear session cookies

### Mock Data Fallbacks
When backend endpoints are unavailable, the dashboard gracefully falls back to mock data for demonstration purposes.

## Pages Overview

### 📊 Dashboard (`/dashboard`)
- Connection status and health monitoring
- Activity statistics and trends
- Weekly action charts
- Quick action shortcuts

### 👥 Characters (`/characters`)
- List all AI personalities
- Create new characters with bio, topics, and style
- Set active character for operations
- Delete unused characters

### ⚡ Actions (`/actions`)
- **Instagram Login**: Authenticate account
- **Post to Instagram**: Upload images with captions
- **Auto Like**: Like posts by hashtag with rate limiting
- **Auto Comment**: AI-generated comments on hashtag posts

### 📝 Logs (`/logs`)
- Real-time log streaming via SSE
- Filter by log level (info/warn/error)
- Search functionality
- Export logs (copy/download)
- Auto-scroll toggle

### ⚙️ Settings (`/settings`)
- Backend connection configuration
- Instagram credentials (secure input)
- Google AI API key management
- Optional proxy settings
- Connection testing

## Responsive Design

- **Desktop**: Full sidebar with all navigation
- **Tablet**: Collapsible sidebar with icons
- **Mobile**: Hidden sidebar with hamburger menu
- **Cards**: Responsive grid layouts adapt to screen size

## Development

### Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features
1. Create components in `components/`
2. Add pages in `app/[page]/page.jsx`
3. Update API adapter in `lib/rionaApi.js`
4. Add routes to sidebar navigation

### Styling Guidelines
- Use Tailwind CSS classes
- Follow dark/light mode patterns
- Maintain consistent spacing (p-4, p-6)
- Use semantic color tokens (primary, accent, muted)

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically

### Docker
```bash
# Build image
docker build -t riona-dashboard .

# Run container
docker run -p 3099:3099 riona-dashboard
```

### Manual Deployment
```bash
npm run build
npm run start
```

## Backend Integration

This dashboard is designed to work with the Riona AI Agent backend. Ensure your backend:

1. **Enables CORS** for dashboard origin
2. **Implements required endpoints** listed in API section
3. **Supports SSE** for log streaming (`/api/logs/stream`)
4. **Uses JWT authentication** with HTTP-only cookies

If your backend uses different endpoint patterns, modify `lib/rionaApi.js` or use the proxy route at `/api/proxy`.

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes following code style
4. Test responsiveness across devices
5. Submit pull request

## License

MIT License - see LICENSE file for details

---

**Note**: This dashboard requires the Riona AI Agent backend to be running for full functionality. When the backend is unavailable, the dashboard operates in demo mode with mock data.