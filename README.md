# 🎓 Student Task Manager (MERN Stack)

A production-ready, full-stack **Student Task & Assignment Management System** designed for modern academic workflows. Students can register, log in, organize academic tasks by subjects, track deadlines and priorities, monitor progress across intuitive status pipelines, and visualize their productivity via an interactive dashboard.

---

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based authentication with bcrypt-hashed passwords and persistent auth context.
- **📊 Real-time Dashboard**: Overview statistics (Total, Pending, In Progress, Completed, High Priority) and upcoming deadline tracking.
- **📝 Comprehensive Task Management**: Full CRUD operations for academic tasks with title, description, subject, priority (Low, Medium, High), status (Pending, In Progress, Completed), and deadline dates.
- **📚 Subject Management**: Organize tasks by subjects/courses (e.g., Data Structures, DBMS, Operating Systems, Computer Networks).
- **🔍 Advanced Search & Filtering**: Multi-condition search by keywords, filter by status, priority, and subject, plus dynamic sorting by deadline.
- **👤 Profile Management**: View account information, registration date, and update student details.
- **📱 Modern & Responsive UI**: Clean, glassmorphic student dashboard crafted with modern CSS, Bootstrap 5 utilities, and React Icons.
- **🛡️ Production Security**: CORS handling, HTTP-only best practices, sanitized inputs, and centralized error handling.
- **☁️ Deployment Ready**: Configured for AWS EC2 Ubuntu deployment with Nginx reverse proxy and PM2 process management.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM, Axios, Bootstrap 5, Modern CSS, React Icons |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, CORS, Morgan, `dotenv` |
| **Database** | MongoDB Atlas / Local MongoDB |
| **Dev & Deployment** | AWS EC2 (Ubuntu), Nginx, PM2, Git, Nodemon |

---

## 📁 Project Structure

```text
student-task-manager/
│
├── client/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── AddTask.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── subjectController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── Subject.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── subjectRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/student_task_manager?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_student_task_manager_2025
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Local Installation & Setup

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd student-task-manager
```

### 2. Backend Setup
```bash
cd server
npm install
# Configure your .env file with MONGO_URI and JWT_SECRET
npm run dev
```
The backend server runs on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The React frontend application runs on `http://localhost:5173`.

---

## 🔌 API Documentation

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new student | No |
| `POST` | `/api/auth/login` | Authenticate user & get token | No |
| `GET` | `/api/auth/profile` | Get current student profile | Yes |
| `PUT` | `/api/auth/profile` | Update profile information | Yes |

### Task Routes (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all user tasks (with search/filter query params) | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `GET` | `/api/tasks/:id` | Get details of a single task | Yes |
| `PUT` | `/api/tasks/:id` | Update task details or status | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |

### Subject Routes (`/api/subjects`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/subjects` | List student's subjects | Yes |
| `POST` | `/api/subjects` | Create a new subject | Yes |
| `PUT` | `/api/subjects/:id` | Rename subject | Yes |
| `DELETE` | `/api/subjects/:id` | Delete subject | Yes |

---

## 🌐 AWS EC2 Deployment Guide (Ubuntu + Nginx + PM2)

### Step 1: Launch EC2 Instance
1. Choose **Ubuntu Server 24.04 / 22.04 LTS**.
2. Configure Security Group:
   - Allow **SSH (Port 22)**
   - Allow **HTTP (Port 80)**
   - Allow **HTTPS (Port 443)**
   - (Optional for debugging) Custom TCP Port 5000

### Step 2: Connect & Update
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
sudo apt update && sudo apt upgrade -y
```

### Step 3: Install Node.js, Git, Nginx, and PM2
```bash
# Install Node.js (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# Install PM2 globally
sudo npm install -g pm2
```

### Step 4: Clone Repository & Setup Backend
```bash
git clone <your-github-repo-url>
cd student-task-manager/server
npm install --production

# Create and configure .env
nano .env
# Paste MONGO_URI, JWT_SECRET, PORT=5000

# Start backend with PM2
pm2 start server.js --name student-task-manager
pm2 startup
pm2 save
```

### Step 5: Build React Frontend
```bash
cd ../client
# Set production API URL in .env
echo "VITE_API_URL=/api" > .env
npm install
npm run build

# Move build to web root
sudo mkdir -p /var/www/student-task-manager
sudo cp -r dist/* /var/www/student-task-manager/
```

### Step 6: Configure Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/student-task-manager
```
Paste configuration:
```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    # Serve React Frontend
    location / {
        root /var/www/student-task-manager;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API Requests to Express Backend
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable site and test configuration:
```bash
sudo ln -s /etc/nginx/sites-available/student-task-manager /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 SSL/HTTPS Configuration (Certbot)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔮 Future Enhancements
- 🔔 Email & Push notifications for impending deadlines
- 📎 Assignment file attachments (PDF/Images) with AWS S3
- 👥 Peer study groups and collaborative assignment tracking
- 📈 Pomodoro timer integration inside task detail view
