# Mini CRM Platform

A full-stack **MERN CRM application**.                                                           
The platform enables **customer segmentation, campaign management, dashboards, and AI-powered insights**.

🌍 **Live Demo** → [Mini CRM on Render](https://crm-frontend-yxq8.onrender.com)

---

## 🚀 Features

-   🔐 **Authentication**: Google OAuth 2.0 + JWT-based login
-   📥 **Data APIs**: Manage customers, orders & campaigns via secure REST APIs
-   🎯 **Campaign Management**:
    -   Create campaigns with filters (spend, visits, inactivity)
    -   AI-generated message suggestions
    -   AI-powered campaign summarization
    -   Campaign history with delivery stats
-   📊 **Dashboard**:
    -   KPIs (Orders, Revenue, Avg Order Value, Top Customer)
    -   Orders-over-time chart (Recharts)
    -   Top customers table
-   🎨 **UI/UX**: Responsive design with sidebar + navbar

---

## 🛠️ Tech Stack

-   **Frontend**: React.js + Vite, TailwindCSS, React Router, Recharts, lucide-react
-   **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Google OAuth 2.0
-   **AI**: OpenAI API (Message Suggestions & Summarization)

---

## ⚙️ Setup

```bash
# 1. Clone repo
git clone [https://github.com/your-username/mini-crm.git](https://github.com/your-username/mini-crm.git)
cd mini-crm

# 2. Backend setup
cd backend
npm install
# Add .env file with MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, OPENAI_API_KEY
npm run dev

# 3. Frontend setup
cd frontend
npm install
npm run dev
```
## Architecture
Frontend (React + Vite + Tailwind) → REST APIs,AI (OpenAI API) → Backend (Node.js + Express) → MongoDB
                                            
                                               

## AI Features

Message Suggestions → 2–3 campaign message variants based on objective
Summarization → Converts delivery stats into natural language

## ⚖️ Known Limitations

Basic authentication flow (Google OAuth + localStorage)
AI features depend on OpenAI API (rate limits apply)
Simplified filters for audience targeting
Vendor delivery API simulated (90% success rate)


