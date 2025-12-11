```markdown
# Galactic ML: NOVA-7

<div align="center">

![Version](https://img.shields.io/badge/version-2.4.1--STABLE-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

**An immersive, sci-fi themed educational platform that transforms Machine Learning concepts into gamified, interactive experiences.**

*"Your personal AI Officer for mastering ML, one mission at a time."*

</div>

## 🚀 Overview

Galactic ML: NOVA-7 is a cutting-edge Single Page Application (SPA) that reimagines Machine Learning education as an interstellar command interface. Assume the role of a Data Science Officer aboard a futuristic research vessel, guided by NOVA-7—an advanced AI powered by Google's Gemini API.

### ✨ Key Features

- **Immersive Sci-Fi Interface**: Command console aesthetic with dark themes, neon accents, and futuristic typography
- **Intelligent Study Guides**: Dynamic generation of comprehensive ML model breakdowns
- **Interactive Visualizations**: Real-time charts, hyperparameter simulators, and gamified quizzes
- **Adaptive Learning**: Content adjusts from "Cadet" (beginner) to "Overseer" (expert) levels
- **Mission-Based Progression**: Complete tactical assignments to earn XP and advance

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Modules](#-modules)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [License](#-license)

## ✨ Features

### 🎮 Interactive Modules

| Module | Description | Key Functions |
|--------|-------------|---------------|
| **Comms Uplink** | AI-powered chat interface | Typewriter responses, Markdown/LaTeX rendering, context management |
| **Intelligence Core** | Gemini API integration | Intent detection, structured JSON generation, error handling |
| **Mission Control** | Dynamic dashboard | Active mission updates, quick actions, system status monitoring |
| **Tactical Visualization** | Comprehensive study guides | 5-tab breakdown of ML models with interactive elements |
| **Report Generation** | PDF export system | Styled mission reports with proper math rendering |

### 📊 Study Guide Components

1. **Core Mechanics**: Model definition, mathematical foundations with KaTeX
2. **Tactical Analysis**: Radar charts (6 axes), pros/cons, rival models
3. **Engine Room**: Code skeletons, hyperparameter simulator with live charts
4. **Field Operations**: Real-world use cases, pitfalls, ethical considerations
5. **Officer Training**: Interactive quizzes, XP tracking, interview questions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Google Gemini API key
- Modern browser with JavaScript enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/galactic-ml-nova7.git
cd galactic-ml-nova7

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Gemini API key

# Start development server
npm start
```

### Environment Variables

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_GEMINI_MODEL=gemini-2.5-flash
```

## 🛠 Tech Stack

### Core Framework
- **React 19** with TypeScript for type-safe development
- **Tailwind CSS** with custom "Space" configuration
- **React Router** for SPA navigation

### AI & Intelligence
- **Google Gemini API** (@google/genai) for AI-powered responses
- **Intent detection** for query classification
- **Structured JSON generation** for consistent data output

### Visualization & UI
- **Recharts** for radar and line charts
- **KaTeX** for mathematical equation rendering
- **Lucide React** for consistent iconography
- **html2pdf.js** for PDF generation

### Development Tools
- ESLint & Prettier for code quality
- Jest & React Testing Library
- GitHub Actions for CI/CD

## 🏗 Architecture

```
src/
├── components/          # Reusable UI components
│   ├── chat/           # Comms Uplink interface
│   ├── dashboard/      # Mission Control panels
│   ├── visualization/  # Study Guide renderers
│   └── shared/         # Common components
├── hooks/              # Custom React hooks
├── services/           # External API integrations
├── types/              # TypeScript definitions
├── utils/              # Helper functions
├── styles/             # Tailwind configuration
└── assets/             # Static files
```

### Key Design Patterns

- **Container/Presenter Pattern** for separation of concerns
- **Custom Hooks** for state and effect management
- **Context API** for theme and user level management
- **Component Composition** for flexible UI building

## 📦 Modules

### 1. Comms Uplink (FR-01 to FR-05)
The primary chat interface featuring:
- Real-time message streaming with typewriter effect
- Markdown and LaTeX mathematics support
- Context management (last 10 messages)
- NOVA-7 persona adherence with sci-fi metaphors

### 2. Intelligence Core (FR-06 to FR-08)
AI integration layer with:
- Automatic intent detection (study vs conversation)
- Structured JSON schema enforcement
- Graceful error handling with in-universe alerts

### 3. Mission Control (FR-09 to FR-11)
Dynamic dashboard providing:
- Periodic mission updates (every 30 seconds)
- Quick-action mission cards
- Real-time system status indicators

### 4. Tactical Visualization (FR-12 to FR-25)
Five-tab study guide system:
- **Core Mechanics**: Definitions, math, analogies
- **Tactical Analysis**: Radar charts, pros/cons
- **Engine Room**: Code, hyperparameter simulator
- **Field Operations**: Use cases, ethics
- **Officer Training**: Quizzes, XP tracking

### 5. Report Generation (FR-26 to FR-27)
PDF export functionality:
- Custom styling with orange/black theme
- Proper math and markdown rendering
- Mission report formatting

## ⚙️ Configuration

### User Levels
The system adapts content based on user level:
- **Cadet**: Beginner-friendly explanations
- **Lieutenant**: Intermediate depth
- **Commander**: Advanced concepts
- **Overseer**: Expert-level details

### Styling System
- Primary colors: Space-900 (#030712) with Slate-200 text
- Accent colors: Cyan (primary), Green, Red, Amber
- Typography: Orbitron (headers), JetBrains Mono (code)
- Effects: Glassmorphism, glow effects, subtle animations

## 🧪 Development

### Available Scripts

```bash
# Development
npm start            # Start development server
npm run build        # Create production build
npm test            # Run test suite
npm run lint        # Lint codebase
npm run format      # Format code with Prettier

# Quality
npm run type-check  # TypeScript validation
npm run audit       # Security audit
```

### Testing Strategy
- Unit tests for utility functions
- Component tests with React Testing Library
- Integration tests for API interactions
- Visual regression testing for UI components

## 🌐 Deployment

### Production Build

```bash
npm run build
```

The build process creates optimized, minified files in the `build/` directory suitable for static hosting.

### Hosting Options

1. **Vercel** (Recommended for React SPAs)
2. **Netlify** (Easy static deployment)
3. **AWS S3 + CloudFront** (Enterprise scaling)
4. **GitHub Pages** (Simple, free option)

### Environment Configuration

```bash
# Production environment
REACT_APP_GEMINI_API_KEY=${SECRET_KEY}
REACT_APP_GEMINI_MODEL=gemini-2.5-flash
REACT_APP_API_BASE_URL=https://api.example.com
NODE_ENV=production
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🆘 Support

- **Documentation**: [Full Docs](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/galactic-ml-nova7/issues)
- **Discussions**: [Community Forum](https://github.com/your-org/galactic-ml-nova7/discussions)

---

<div align="center">

**"Embark on your machine learning journey with galactic-scale guidance."**

*Built with 🚀 by the Galactic ML Development Team*

</div>
```
