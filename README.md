# DentSupply 🦷

DentSupply is a premium B2B quick-commerce Progressive Web App (PWA) designed specifically for dental professionals. It provides a seamless, lightning-fast experience for purchasing dental implants, prosthetics, and surgical instruments.

## 🚀 Vision

Empowering dental clinics with a high-performance procurement platform that combines industrial precision with modern e-commerce convenience.

## ✨ Core Features

- **⚡ Quick Commerce:** Optimized for mobile-first speed and one-handed operation.
- **📦 Smart Inventory:** Intelligent grouping of base products and their scientific variants (Diameter, Length, Material).
- **🌐 PWA Ready:** Installable on iOS and Android with offline-first capabilities.
- **🛡️ B2B Secure:** Advanced authentication with roles and professional verification (GST/License).
- **🎨 Premium UI:** Crafted with Next.js 14, Tailwind CSS v4, and Shadcn UI components.

## 🏗️ Technology Stack

### Backend
- **FastAPI:** High-performance Python framework.
- **SQLAlchemy:** Modern SQL toolkit and ORM.
- **Alembic:** Database migrations.
- **Pydantic:** Robust data validation.

### Frontend
- **Next.js 14:** React framework for production.
- **Tailwind CSS v4:** Utility-first styling with modern performance.
- **Shadcn UI:** High-quality UI components.
- **PWA:** Manifest and service worker integration.

## 🛠️ Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/dentsupply.git
   cd dentsupply
   ```

2. **Setup Backend:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r backend/requirements.txt
   ```

3. **Setup Frontend:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

I've provided a convenience script to start both services concurrently:

```bash
./run.sh
```

- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Frontend App:** [http://localhost:3000](http://localhost:3000)

## 📄 License

Proprietary. All rights reserved.
