# My Spot App

A location-based map application built with Ionic React for exploring and bookmarking favorite places with Firebase authentication.

**Live Demo**: [https://myspotr0334.netlify.app/](https://myspotr0334.netlify.app/)

---

## Quick Start

### Prerequisites

- Node.js (v16+)
- npm
- Git
- Code editor (VS Code recommended)

### Installation Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd groupworkapp-second-login
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file from the template:
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

4. **Add Firebase credentials**

Open `.env` and replace with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Where to get credentials:**
- Ask your team lead, OR
- Go to [Firebase Console](https://console.firebase.google.com/) > Project Settings > Your apps

5. **Run the app**
```bash
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## Project Structure

```
src/
├── components/
│   └── MapController.tsx       # Map navigation logic
├── pages/
│   ├── Login.tsx              # Login with Firebase auth
│   ├── SignUp.tsx             # User registration
│   └── MapPage.tsx            # Main map interface
├── types/
│   └── Spot.ts                # TypeScript interfaces
├── utils/
│   └── storage.ts             # LocalStorage utilities
├── firebaseConfig.ts          # Firebase setup (uses .env)
└── App.tsx                    # Main app with routing
```

---

## Features

**Authentication**
- Email/password login via Firebase
- User registration with validation
- Password reset functionality
- "Remember me" option

**Form Validation**
- Uses Yup library for validation
- Email format checking
- Password strength requirements (6+ characters, must contain letters)
- Password confirmation matching
- User-friendly error messages

**Security**
- Firebase credentials stored in `.env` file (not in code)
- Client-side rate limiting (1 minute cooldown between signups)
- Input validation before submission

**Map Features**
- Interactive Leaflet map with OpenStreetMap
- Tap to add custom markers with emojis
- Color-coded categories (Cafe, Park, Restaurant, Secret Spot, Other)
- Swipe-to-delete spots
- Click spot to fly to location
- LocalStorage persistence

---

## Development

### Common Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new package
npm install package-name
```

### Environment Variables Guide

**Important Rules:**
- Variables MUST start with `VITE_` prefix
- No quotes around values
- No spaces around `=` sign
- Restart dev server after changing `.env`

**Correct format:**
```env
VITE_FIREBASE_API_KEY=AIzaSyAbc123
```

**Wrong formats:**
```env
VITE_FIREBASE_API_KEY = "AIzaSyAbc123"  # Has spaces and quotes
FIREBASE_API_KEY=AIzaSyAbc123           # Missing VITE_ prefix
```

---

## Troubleshooting

### npm install fails
```bash
npm install --legacy-peer-deps
```

### Environment variables not loading
1. Check file is named `.env` (not `.env.txt`)
2. Verify `VITE_` prefix on all variables
3. Restart dev server

### Changes not showing in browser
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Restart dev server

### Firebase authentication errors
1. Check credentials in `.env` are correct
2. Enable Email/Password in Firebase Console:
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider

---

## Tech Stack

- **Ionic React** 8.x - Cross-platform UI framework
- **React** 18.x - UI library
- **TypeScript** 5.x - Type safety
- **Vite** 4.x - Build tool
- **Firebase** - Authentication
- **Yup** - Form validation
- **Leaflet** 1.9.x - Interactive maps
- **React-Leaflet** 4.x - React wrapper for Leaflet

---

## Resources

**Documentation**
- [Ionic React](https://ionicframework.com/docs/react)
- [Firebase Auth](https://firebase.google.com/docs/auth/web/start)
- [Yup](https://github.com/jquense/yup)
- [Leaflet](https://leafletjs.com/reference.html)
- [React Leaflet](https://react-leaflet.js.org/)

**Learning**
- [React Tutorial](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [JavaScript ES6+](https://javascript.info/)

---

## License

This is a learning project for coursework. Repository will be archived 15 days after submission deadline.

---

*Last updated: October 2025*