# KidSafe AI - Frontend Application

A production-ready React frontend for a kid-safe conversational AI chat application with parental controls.

## Features

### For Parents
- **Dashboard**: Overview of children's activity and quick access to main features
- **Child Management**: Create, view, and delete child accounts
- **Content Control**: Set allowlist/blocklist rules for topics and keywords
- **Chat History**: View and monitor all conversations with flagged content highlighted

### For Kids
- **Safe Chat Interface**: Simple, friendly chat UI with large fonts and encouraging design
- **Blocked Content Notifications**: Kid-friendly messages when content is restricted
- **Session Persistence**: Chat history preserved across sessions

### Security & Access Control
- Role-based authentication (Parent/Kid)
- Protected routes with automatic redirects
- JWT token management with auto-refresh
- Secure localStorage handling

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Redux Toolkit** with RTK Query for state management
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **React Hook Form** with Zod for form validation
- **Lucide React** for icons
- **date-fns** for date formatting

## Project Structure

```
src/
├── components/
│   ├── shared/          # Reusable UI components (Button, Input, Card, Modal, etc.)
│   ├── layout/          # Layout components (Header, Sidebar, Layout)
│   ├── auth/            # Authentication components (LoginForm, RegisterForm, ProtectedRoute)
│   ├── parent/          # Parent-specific components (Dashboard, ContentControl, etc.)
│   └── kid/             # Kid-specific components (ChatInterface, MessageList, etc.)
├── pages/
│   ├── auth/            # Authentication pages
│   ├── parent/          # Parent dashboard pages
│   └── kid/             # Kid chat page
├── store/
│   ├── slices/          # Redux slices for state management
│   └── api/             # RTK Query API definitions
├── services/            # API services and token management
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions (validators, formatters, constants)
└── styles/              # Global styles and Tailwind configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (FastAPI)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kidsgpt-fe
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.development
```

Edit `.env.development` with your configuration:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=KidSafe AI
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |
| `VITE_APP_NAME` | Application display name | `KidSafe AI` |

## API Integration

The frontend expects these backend endpoints:

### Authentication
- `POST /api/auth/parent/register` - Register parent account
- `POST /api/auth/parent/login` - Parent login
- `POST /api/auth/kid/login` - Kid login
- `POST /api/auth/refresh` - Refresh JWT token

### Parent Endpoints
- `POST /api/parent/children` - Create child account
- `GET /api/parent/children` - List all children
- `DELETE /api/parent/children/:id` - Delete child
- `GET /api/parent/content-rules` - Get content rules
- `PUT /api/parent/content-rules` - Update content rules
- `GET /api/parent/chat-history/:childId` - Get child's chat history
- `GET /api/parent/analytics/:childId` - Get child analytics

### Kid Endpoints
- `POST /api/kid/chat` - Send message and get AI response
- `GET /api/kid/chat-history` - Get own chat history

All protected endpoints require `Authorization: Bearer <token>` header.

## Key Features Implementation

### Authentication Flow
1. JWT tokens stored in localStorage
2. Automatic token validation on each request
3. Auto-redirect to login on 401 errors
4. Role-based routing (parents can't access kid routes and vice versa)

### State Management
- **authSlice**: User authentication state
- **childrenSlice**: Parent's children list
- **contentRulesSlice**: Content filtering rules
- **chatSlice**: Kid's current chat session
- **chatHistorySlice**: Historical chat data

### Chat Message Flow (Kid)
1. Kid types message
2. Message immediately added to UI (optimistic update)
3. Request sent to backend
4. If blocked: Show friendly notification with allowed topics
5. If success: Add AI response to chat
6. Auto-scroll to latest message

### Content Control (Parent)
1. Choose mode: Allowlist (only allow) or Blocklist (block specific)
2. Add/remove topics and keywords using chip-style input
3. Save changes to backend
4. Rules apply in real-time to child's chats

## Build and Deployment

### Production Build

```bash
npm run build
```

This creates optimized files in the `dist/` directory with:
- Code splitting for routes
- Minified JavaScript and CSS
- Source maps for debugging
- Tree-shaking for smaller bundle size

### Deployment Considerations

1. **Environment Variables**: Set production API URL
2. **HTTPS**: Ensure secure connection in production
3. **CORS**: Configure backend to accept frontend origin
4. **CDN**: Consider serving static assets from CDN
5. **Caching**: Set appropriate cache headers for static assets

### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Development Guidelines

### Code Style
- Use TypeScript strictly (avoid `any` types)
- Follow React best practices (functional components, hooks)
- Keep components small and focused
- Use Tailwind utility classes for styling

### State Management
- Use RTK Query for API calls (caching, automatic refetching)
- Use Redux slices for local state that needs to be shared
- Prefer component state for UI-only state

### Error Handling
- All API calls have error handling
- User-friendly error messages (no technical jargon)
- Kid-friendly language in kid interface

### Performance
- Lazy loading for routes
- Memoization where appropriate
- Auto-scroll optimization for chat

## Testing (Future Enhancement)

Recommended testing setup:
- **Jest** + **React Testing Library** for unit/integration tests
- **Cypress** for E2E testing
- **MSW** for API mocking

## Security Considerations

1. Never store sensitive data except JWT tokens
2. Validate all user inputs
3. Sanitize display of user content (prevent XSS)
4. Clear tokens on logout
5. Token expiration checking
6. Rate limiting on chat messages (prevent spam)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test thoroughly before submitting
4. Update documentation as needed

## License

This project is proprietary software.

## Support

For issues and feature requests, please contact the development team.
