# Unity Bridge Platform

A comprehensive web platform connecting NGOs, volunteers, and donors to drive social impact through collaborative projects and donations.

## 🚀 Overview

Unity Bridge Platform is a full-featured React application built with modern web technologies that facilitates collaboration between:
- **NGOs** - Launch and manage projects
- **Donors** - Discover projects and contribute financially
- **Volunteers** - Find opportunities and participate in initiatives
- **Admins** - Oversee platform activity and verify users/projects

## 🎯 Key Features

### Authentication & User Management
- Firebase authentication with Google Sign-in support
- Role-based access control (Admin, NGO, Donor, Volunteer)
- User profile management and settings
- JWT-based private routes and protected endpoints

### NGO Dashboard
- Project creation and management
- Donor relationship tracking
- Collaboration discovery board
- Real-time project status updates
- Application management

### Donor Portal
- Project discovery and filtering
- Donation checkout with payment integration
- Impact tracking and donation history
- Personalized recommendations
- Dashboard with statistics

### Admin Dashboard
- User verification system
- Project verification and approval
- All projects monitoring
- Volunteer and donor management
- Platform analytics

### Project Management
- Create and update projects
- Detailed project information pages
- Project discovery portal
- Real-time impact statistics
- Project categorization

## 💻 Tech Stack

### Frontend Framework
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **DaisyUI** - Component library

### State Management & Data Fetching
- **Redux Toolkit** - Global state management
- **TanStack React Query** - Server state management
- **Axios** - HTTP client for API calls

### UI Components & Animation
- **Ant Design** - Enterprise UI components
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **React Icons** - Icon sets
- **React Hot Toast** - Toast notifications

### Backend Integration
- **Firebase** - Authentication, real-time database
- **Axios** - API client with interceptors

### Form & Validation
- **React Hook Form** - Form state management

### Development Tools
- **ESLint** - Code linting
- **Babel** - JavaScript transpiler

## 📁 Project Structure

```
src/
├── Authentication/          # Auth components & Firebase config
├── components/              # Reusable UI components
├── Hooks/                   # Custom React hooks
├── LayOut/                  # Layout components for different roles
│   ├── AdminLayOut/
│   ├── DonorLayOut/
│   ├── NGOLayout/
│   └── Volunteer&DonorLayOut/
├── Pages/                   # Page components by feature
│   ├── Admin/               # Admin dashboard pages
│   ├── Donor/               # Donor portal pages
│   ├── NGO/                 # NGO dashboard pages
│   ├── Volunteer/           # Volunteer pages
│   ├── Project/             # Project-related pages
│   └── HomePage/            # Landing page
├── Provider/                # Context & Redux providers
├── Router/                  # Route definitions & protection
├── Redux-Toolkit/           # Redux store & slices
└── ShareComponents/         # Shared components (NavBar, etc.)
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Unity-Bridge-Platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
- Create a `Firebase.jsx` file in `src/Authentication/Firebase/`
- Add your Firebase configuration:
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🔐 Authentication & Authorization

The platform uses a role-based access control system:

- **Public Routes** - Home, About, Contact pages accessible to all
- **Protected Routes** - Require authentication
- **Private Routes** - Role-specific pages (Admin, Donor, NGO, Volunteer)
- **Admin Routes** - Admin-only functionality

Routes are protected using:
- `PrivateRoute` - For authenticated users
- `AdminRoute` - For admin users
- `AgentRoute` - For specific roles
- `ProtectRoute` - Custom protection logic

## 🌐 API Integration

The application uses Axios for API calls with:
- Public API client (`usePublicAxios`)
- Private API client with JWT authentication (`usePrivateAxios`)
- Automatic token refresh
- Request/response interceptors

## 📊 State Management

- **Redux Store** - Global app state (user info, authentication)
- **React Query** - Server state (projects, donations, user data)
- **Local State** - Component-level state with React hooks

## 🎨 Styling

The project uses:
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Pre-built components
- **Custom CSS** - Additional styling in component files

## 🚢 Deployment

The project is configured for deployment on Vercel. Configuration is set in `vercel.json`.

### Deploy to Vercel
```bash
vercel deploy
```

## 📝 Environment Variables

Create a `.env.local` file in the root directory with necessary environment variables (Firebase config, API endpoints, etc.)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions, issues, or suggestions, please open an issue in the repository or contact the development team.

## 🔗 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
