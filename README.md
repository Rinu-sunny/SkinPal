# SkinPal 🧴

An intelligent skin analysis application that uses machine learning to detect skin types, provide personalized product recommendations, and help users maintain healthy skin through data-driven insights.

## ✨ Features

- **🤖 AI-Powered Skin Analysis** — Uses TensorFlow deep learning model to accurately analyze and classify skin types
- **📸 Image Processing** — Upload photos for real-time skin analysis
- **💊 Personalized Recommendations** — Get product suggestions tailored to your skin type
- **👤 User Profiles** — Track skin condition history and preferences
- **🛒 Product Database** — Browse curated skincare products
- **🔐 Secure Authentication** — User registration and login with Supabase
- **📊 Admin Dashboard** — Manage users, products, and analytics
- **📱 Responsive UI** — Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **React 18** — UI library
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Styling
- **Supabase JS** — Authentication

### Backend
- **Python 3.9+** — Programming language
- **Flask** — Web framework
- **TensorFlow** — Machine learning framework
- **OpenCV** — Image processing
- **Supabase** — Backend-as-a-Service

### ML Model
- **TensorFlow** — Deep learning model for skin type classification

## 📋 Prerequisites

Before getting started, make sure you have:

- **Python 3.9+**
- **Node.js 16+** and npm
- **Git**
- **Supabase Account** (free tier available at https://supabase.com)
- Virtual environment manager (venv or conda)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Rinu-sunny/SkinPal.git
cd SkinPal
```

### 2. Set Up Environment Variables

Copy the example file and fill in your Supabase credentials:

```bash
cp SkinPal-backend/.env.example SkinPal-backend/.env
```

Edit `SkinPal-backend/.env`:

```env
FLASK_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SECRET_KEY=your-secret-key
DATABASE_URL=your_database_url
```

### 3. Backend Setup

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
cd SkinPal-backend
pip install -r requirements.txt

# Run the backend server
python app.py
```

The backend will start at `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal and run:

```bash
cd SkinPal-frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`

## 📁 Project Structure

```
SkinPal/
├── README.md                      # Project documentation
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
│
├── model/                         # ML Model
│   ├── run_model.py              # Model execution script
│   └── skin_type_model_v2.h5     # Trained TensorFlow model
│
├── SkinPal-backend/              # Flask Backend
│   ├── app.py                    # Main application
│   ├── config.py                 # Configuration
│   ├── requirements.txt           # Python dependencies
│   ├── .env                      # Environment variables (ignored in git)
│   │
│   ├── routes/                   # API endpoints
│   │   ├── auth.py               # Authentication
│   │   ├── profile.py            # User profiles
│   │   ├── analysis.py           # Skin analysis
│   │   ├── products.py           # Product management
│   │   └── admin.py              # Admin functions
│   │
│   ├── models/                   # ML model integration
│   │   └── predict.py            # Prediction logic
│   │
│   └── utils/                    # Utility functions
│       ├── db.py                 # Database queries
│       ├── images.py             # Image processing
│       └── recommendations.py    # Recommendation engine
│
└── SkinPal-frontend/             # React Frontend
    ├── package.json              # Node dependencies
    ├── vite.config.js            # Vite configuration
    ├── tailwind.config.js         # Tailwind CSS config
    ├── postcss.config.js          # PostCSS config
    ├── index.html                 # HTML entry point
    │
    ├── src/
    │   ├── main.jsx               # React entry point
    │   ├── App.jsx                # Root component
    │   ├── api.js                 # API client
    │   ├── session.js             # Session management
    │   ├── supabaseClient.js      # Supabase client
    │   ├── styles.css             # Global styles
    │   │
    │   ├── components/            # Reusable components
    │   │   └── Nav.jsx            # Navigation bar
    │   │
    │   └── pages/                 # Page components
    │       ├── Auth.jsx           # Login/Register
    │       ├── Dashboard.jsx      # Main dashboard
    │       ├── Profile.jsx        # User profile
    │       ├── Capture.jsx        # Image capture
    │       ├── Results.jsx        # Analysis results
    │       ├── Recommendations.jsx # Product recommendations
    │       ├── History.jsx        # Analysis history
    │       ├── AdminDashboard.jsx # Admin panel
    │       ├── AdminLogin.jsx     # Admin login
    │       ├── ForgotPassword.jsx # Password recovery
    │       └── ResetPassword.jsx  # Password reset
    │
    ├── assets/                    # Static assets
    └── public/                    # Public files
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password

### User Profile
- `GET /api/profile` — Get user profile
- `PUT /api/profile` — Update user profile
- `GET /api/profile/history` — Get analysis history

### Skin Analysis
- `POST /api/analysis` — Analyze skin from image
- `GET /api/analysis/<id>` — Get analysis results
- `DELETE /api/analysis/<id>` — Delete analysis

### Products
- `GET /api/products` — List all products
- `GET /api/products/<id>` — Get product details
- `POST /api/recommendations` — Get personalized recommendations

### Admin
- `GET /api/users` — Get all users (admin only)
- `GET /api/analytics` — Get analytics data (admin only)
- `POST /api/products` — Add product (admin only)
- `PUT /api/products/<id>` — Update product (admin only)

## 📦 Building for Production

### Frontend Build
```bash
cd SkinPal-frontend
npm run build
# Output: dist/ folder
```

### Backend Deployment
```bash
cd SkinPal-backend
pip install gunicorn
gunicorn app:app --bind 0.0.0.0:8080
```

## 🐳 Docker Deployment

Build and run with Docker:

```bash
docker-compose up -d
```

This will start:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤗 Support

Need help?

- 🐛 Report bugs on [GitHub Issues](https://github.com/Rinu-sunny/SkinPal/issues)
- 💬 Ask questions on [GitHub Discussions](https://github.com/Rinu-sunny/SkinPal/discussions)

## 🎨 Design

**Colors used:**
- Light Blue: `#DDEFFA`
- Beige: `#E8D8C3`
- Primary Text: `#2E2E2E`
- Deep Accent: `#240808`

---

**Made with ❤️ by the SkinPal Team**

**Happy skin analyzing! 🧴✨**
