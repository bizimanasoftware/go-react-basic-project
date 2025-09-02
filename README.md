# Go + React Basic Project

This is a full-stack **Go + React** monolithic project with Docker support.  
It includes:
- **Backend**: Go (Golang) server with routes for users, talents, gigs, and profiles.  
- **Frontend**: React app for UI.  
- **Docker**: Containerized setup for easy deployment.  

---

## 🚀 Features
- Go backend with RESTful routes  
- React frontend  
- Dockerized services  
- PostgreSQL database  
- Easy local development setup  

---

## 📂 Project Structure
├── backend/ # Go backend source code
│ ├── models/ # Database models (User, Talent, Gig, Profile)
│ ├── routes/ # API routes
│ ├── services/ # Business logic
│ └── main.go # Entry point
│
├── frontend/ # React frontend
│ ├── src/ # React components and pages
│ └── package.json # Frontend dependencies
│
├── docker-compose.yml # Docker setup for backend, frontend, db
├── Dockerfile # Dockerfile for backend
└── README.md # Project documentation


---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/bizimanasoftware/go-react-basic-project.git
cd go-react-basic-project
2. Start with Docker
docker-compose up --build
3. Access services

Frontend (React): http://localhost:3000

Backend (Go API): http://localhost:8080

Database (Postgres): localhost:5432

🧑‍💻 Development (without Docker)
Backend

cd backend
go run main.go
Frontend
cd frontend
npm install
npm start

API Endpoints
Users

POST /api/users/register → Register user

POST /api/users/login → Login user

Gigs

GET /api/gigs → Get all gigs

POST /api/gigs → Create gig

Profiles

GET /api/profiles/:id → Get profile

PUT /api/profiles/:id → Update profile

Deployment

You can deploy with:

Docker + VPS (DigitalOcean, AWS, etc.)

Heroku / Render / Railway

Vercel (Frontend) + Any Go host (Backend)

Author
