# SkinPal 

An intelligent skin analysis application that uses machine learning to detect skin types, provide personalized product recommendations, and help users maintain healthy skin through data-driven insights.

##  Features

-  AI-Powered Skin Analysis — Uses TensorFlow deep learning model to accurately analyze and classify skin types
-  Image Processing — Upload photos for real-time skin analysis
-  Personalized Recommendations — Get product suggestions tailored to your skin type
-  User Profiles — Track skin condition history and preferences
-  Secure Authentication — User registration and login with Supabase
-  Admin Dashboard — Manage users, products, and analytics


##  Tech Stack

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
- **MobileNetV2** — Deep learning model for skin type classification

##  Prerequisites

Before getting started, make sure you have:

- **Python 3.9+**
- **Node.js 16+** and npm
- **Git**
- **Supabase Account** (free tier available at https://supabase.com)
- Virtual environment manager (venv or conda)

##  Quick Start

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

##  Project Structure

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

