# Notes Management System

A production-grade Full Stack Notes Management System built with modern technologies.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - App Router
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **TailwindCSS** - Styling
- **Shadcn/UI** - UI Components
- **React Hook Form** - Form Handling
- **Zod** - Schema Validation
- **TanStack Query** - State Management
- **Axios** - HTTP Client
- **Lucide React** - Icons

### Backend
- **Next.js Route Handlers** - API Routes
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM
- **Service Layer** - Business Logic
- **Repository Pattern** - Data Access

## 📋 Features

### Notes Management
- ✅ Create Note
- ✅ Read/View Notes (List & Single)
- ✅ Update Note
- ✅ Delete Note
- ✅ Search Notes (Full-text search)
- ✅ Pagination
- ✅ Responsive UI
- ✅ Dark Mode Support
- ✅ Loading States
- ✅ Error Handling

## 📁 Folder Structure

```
src/
├── app/
│   ├── api/
│   │   └── notes/
│   │       ├── route.ts           # GET, POST
│   │       ├── search/
│   │       │   └── route.ts       # GET search
│   │       └── [id]/
│   │           └── route.ts       # GET, PUT, DELETE
│   │
│   ├── notes/
│   │   ├── page.tsx               # List notes
│   │   ├── create/
│   │   │   └── page.tsx           # Create note
│   │   └── [id]/
│   │       ├── page.tsx           # View note
│   │       └── edit/
│   │           └── page.tsx       # Edit note
│   │
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                   # Home page
│   └── providers.tsx              # Context providers
│
├── components/
│   ├── notes/
│   │   ├── NoteCard.tsx
│   │   ├── NoteForm.tsx
│   │   ├── NoteList.tsx
│   │   ├── SearchBar.tsx
│   │   └── DeleteDialog.tsx
│   │
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── textarea.tsx
│       ├── form.tsx
│       ├── alert-dialog.tsx
│       └── skeleton.tsx
│
├── lib/
│   ├── mongodb.ts                 # MongoDB connection
│   ├── axios.ts                   # Axios client
│   └── utils.ts                   # Utility functions
│
├── models/
│   └── Note.ts                    # Mongoose schema
│
├── repositories/
│   └── note.repository.ts         # Data access layer
│
├── services/
│   └── note.service.ts            # Business logic
│
├── validators/
│   └── note.schema.ts             # Zod schemas
│
├── types/
│   └── note.types.ts              # TypeScript types
│
├── hooks/
│   └── useNotes.ts                # Custom hooks
│
└── constants/
    └── api.ts                     # API constants
```

## 🗄️ Database Schema

### Note Schema
```typescript
{
  _id: ObjectId;
  title: string;           // Required, min 3, max 200 chars
  content: string;         // Optional, max 5000 chars
  createdAt: Date;         // Timestamp
  updatedAt: Date;         // Timestamp
}
```

### Indexes
- Text index on `title` and `content` for full-text search
- Index on `createdAt` for sorting
- Index on `updatedAt` for sorting

## 🔌 API Endpoints

### Notes Management

#### Get All Notes (with Pagination)
```http
GET /api/notes?page=1&limit=10
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "data": {
    "data": [
      {
        "_id": "...",
        "title": "Note Title",
        "content": "Note content",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

#### Create Note
```http
POST /api/notes
Content-Type: application/json

{
  "title": "My Note",
  "content": "Note content"
}
```

**Request Body:**
- `title` (string, required, min: 3, max: 200)
- `content` (string, optional, max: 5000)

**Response:** Created note object

#### Get Single Note
```http
GET /api/notes/:id
```

**Response:** Note object

#### Update Note
```http
PUT /api/notes/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response:** Updated note object

#### Delete Note
```http
DELETE /api/notes/:id
```

**Response:** Success message

#### Search Notes
```http
GET /api/notes/search?q=meeting&page=1&limit=10
```

**Query Parameters:**
- `q` (string, required) - Search query
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 100)

**Response:** Paginated search results

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
cd WebApp
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Configure MongoDB**
Edit `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/notes-management
MONGODB_DB_NAME=notes_management
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NODE_ENV=development
```

**For MongoDB Atlas:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes_management
```

5. **Start MongoDB** (if running locally)
```bash
mongod
```

6. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🏗️ Architecture

### Repository Pattern
- Handles all database operations
- Abstracts MongoDB/Mongoose details
- Converts Mongoose documents to DTO objects

### Service Layer
- Contains business logic
- Validates input using Zod
- Handles errors gracefully
- Returns domain objects

### Route Handlers
- Receives HTTP requests
- Calls service methods
- Returns standardized responses
- Handles HTTP errors

### Custom Hooks
- `useNotes()` - Fetch all notes
- `useNote(id)` - Fetch single note
- `useCreateNote()` - Create note mutation
- `useUpdateNote(id)` - Update note mutation
- `useDeleteNote(id)` - Delete note mutation
- `useSearchNotes(query)` - Search notes

## 🎨 UI Components

### Base Components
- **Button** - Variants: default, destructive, outline, secondary, ghost, link
- **Input** - Text input field
- **Textarea** - Multi-line text input
- **Card** - Container component
- **Form** - React Hook Form integration
- **AlertDialog** - Confirmation dialogs
- **Skeleton** - Loading placeholder

### Feature Components
- **NoteCard** - Note preview card
- **NoteForm** - Create/edit form
- **NoteList** - Notes grid with pagination
- **SearchBar** - Debounced search input
- **DeleteDialog** - Delete confirmation

## 🔐 Error Handling

### Error Types
1. **Validation Errors** (400)
   - Zod validation failures
   - Invalid input data

2. **Not Found Errors** (404)
   - Note doesn't exist
   - Invalid note ID

3. **Server Errors** (500)
   - Database connection issues
   - Unexpected exceptions

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## 📊 Performance Optimizations

- **Query Caching** - TanStack Query caches responses
- **Debouncing** - Search input debounced to 300ms
- **Pagination** - Limits returned data
- **Indexes** - MongoDB text and sort indexes
- **Code Splitting** - Next.js automatic code splitting
- **Server Components** - Used where possible
- **Lazy Loading** - Dynamic imports for heavy components

## 🌙 Dark Mode

The application supports dark mode out of the box using `next-themes`. Toggle is available in the theme provider.

CSS Variables:
- `--background`
- `--foreground`
- `--primary`
- `--secondary`
- `--destructive`
- `--muted`
- `--accent`
- `--border`
- `--input`
- `--ring`

## 🚀 Deployment

### Build Production Bundle
```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

**Environment Variables:**
```
MONGODB_URI=...
MONGODB_DB_NAME=notes_management
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com
NODE_ENV=production
```

### Deploy to Other Platforms

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Using PM2
```bash
npm run build
pm2 start npm --name "notes-app" -- start
```

## 🧪 Testing Checklist

- [ ] Create note with valid data
- [ ] Create note with invalid data (validation)
- [ ] View all notes with pagination
- [ ] Search notes by title
- [ ] Search notes by content
- [ ] View single note
- [ ] Update note
- [ ] Delete note with confirmation
- [ ] Test responsive design on mobile
- [ ] Test dark mode toggle
- [ ] Test error states
- [ ] Test loading states

## 📝 Code Quality

- **TypeScript** - No `any` types
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Zod** - Runtime validation
- **Service Layer** - Separation of concerns
- **Repository Pattern** - Data abstraction

## 🤝 Contributing

1. Create a feature branch
2. Follow code style guidelines
3. Write meaningful commit messages
4. Submit a pull request

## 📄 License

MIT

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` is correct
- Verify network access (for Atlas)
- Check firewall settings

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Hot Reload Not Working
- Restart dev server
- Check file permissions
- Verify `src/` folder exists

## 📞 Support

For issues and feature requests, please check the documentation or create an issue.

---

**Built with ❤️ using Next.js, React, and TypeScript**
