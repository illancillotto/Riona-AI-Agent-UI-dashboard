# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build and Run
- `npm start` - Compile TypeScript and run the server (includes postbuild step to copy character JSON files)
- `npm run postbuild` - Copy character JSON files from src to build directory
- `tsc` - Compile TypeScript to JavaScript (outputs to ./build directory)

### Training Commands
- `npm run train:link` - Train the AI model with website content
- `npm run train:audio` - Train the AI model with audio files
- `npm run train:youtube` - Train the AI model with YouTube video transcripts

### Development
- Server runs on port 3099 (or PORT environment variable)
- TypeScript source in `src/`, compiled output in `build/`
- MongoDB required for data persistence

## Architecture Overview

### Core Application Structure
- **Express.js backend** with TypeScript
- **MongoDB** for data persistence using Mongoose ODM
- **Google Generative AI (Gemini 2.0)** for AI-powered content generation
- **JWT authentication** with cookie-based sessions
- **Puppeteer/Playwright** for browser automation
- **Winston logging** with daily rotating files

### Key Directories
- `src/Agent/` - AI agent core functionality and character management
  - `characters/` - JSON character configurations that define agent personalities
  - `schema/` - AI response schemas and MongoDB models
  - `training/` - Scripts for training AI with various data sources
- `src/client/` - Social media platform integrations (Instagram, Twitter, GitHub)
- `src/routes/` - Express API endpoints
- `src/config/` - Database connection and logging configuration
- `src/utils/` - Utility functions and error handling

### Authentication System
- JWT tokens stored as httpOnly cookies
- Session-based authentication with express-session
- Middleware protection for sensitive API routes
- Instagram credentials management with cookie persistence

### AI Agent System
- Character-based AI personalities loaded from JSON configurations
- Structured JSON responses using Google Generative AI schemas
- Error handling with API key rotation fallback
- Automatic character selection (picks first available)

### Social Media Integration
- **Instagram**: Automated posting, commenting, DM sending, follower scraping
- **Twitter/X**: Framework exists but commented out (planned feature)
- **GitHub**: Framework exists but commented out (planned feature)

### Training System
Multiple training sources supported:
- YouTube video transcripts
- Audio file processing
- Website content scraping
- Document parsing (PDF, DOC, DOCX, TXT)

### API Architecture
REST endpoints under `/api` prefix:
- Authentication: login, logout, auth check
- Instagram operations: interact, send DMs, scrape followers
- System: status checks, cookie management

## Environment Variables Required
```env
# Instagram credentials
IGusername=your_instagram_username
IGpassword=your_instagram_password

# Twitter credentials (future use)
Xusername=your_twitter_username
Xpassword=your_twitter_password

# Database
MONGODB_URI=mongodb://localhost:27017/instagram-ai-agent

# Session security
SESSION_SECRET=your_secret_key

# Server
PORT=3099
NODE_ENV=production|development
```

## Development Notes
- Character JSON files must be copied to build directory via postbuild script
- Database connection handled automatically on app startup
- Error handling includes process-level handlers for unhandled rejections
- Static frontend served from `frontend/dist` directory
- API key rotation system for Gemini AI requests
- Logging configured with Winston (info/error levels)
- Helmet security middleware enabled with custom CSP

## MongoDB Setup
Requires MongoDB instance running on localhost:27017 or custom MONGODB_URI. Docker setup available:
```bash
docker run -d -p 27017:27017 --name instagram-ai-mongodb mongodb/mongodb-community-server:latest
```

## Key Dependencies
- `@google/generative-ai` - AI content generation
- `instagram-private-api` - Instagram automation
- `puppeteer`/`playwright` - Browser automation
- `mongoose` - MongoDB ODM
- `express` - Web framework
- `winston` - Logging
- `jsonwebtoken` - Authentication