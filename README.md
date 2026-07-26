# Forex Alert Backend

Production-ready Node.js/Express backend for Forex Alert App with real-time price monitoring, alert management, and cloud notifications.

## Features
- Real-time forex price monitoring
- Custom alert management (above, below, crosses)
- Cloud push notifications (Firebase Cloud Messaging)
- Watchlist management
- Device-based identification
- Background alert monitoring
- Subscription management
- Clean architecture with SOLID principles

## Tech Stack
- Node.js with Express
- Firebase Firestore (Database)
- Firebase Cloud Messaging (Push Notifications)
- Firebase Authentication
- Forex Data Provider (Alpha Vantage / Finnhub API)
- Bull Queue (Background jobs)
- Jest (Testing)

## Getting Started

### Prerequisites
- Node.js v16+
- npm or yarn
- Firebase project
- Forex data provider API key

### Installation

```bash
git clone https://github.com/zungu147/forex-alert-backend.git
cd forex-alert-backend
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```
NODE_ENV=development
PORT=3000

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_DATABASE_URL=your-database-url

# Forex Data Provider
FOREX_PROVIDER=alpha_vantage
ALPHA_VANTAGE_API_KEY=your-api-key
FINNHUB_API_KEY=your-api-key

# Redis (for Bull Queue)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# FCM
FCM_SERVER_KEY=your-fcm-server-key
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm run start
```

## Architecture

Clean Architecture with SOLID principles:

```
src/
├── controllers/      # HTTP request handlers
├── services/         # Business logic
├── repositories/     # Data access layer
├── models/          # Data models and types
├── middlewares/     # Express middlewares
├── utils/           # Helper functions
├── config/          # Configuration files
├── jobs/            # Background jobs
└── tests/           # Unit and integration tests
```

## Testing

```bash
npm run test
npm run test:watch
npm run test:coverage
```

## Documentation

- [API Documentation](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## License

MIT
