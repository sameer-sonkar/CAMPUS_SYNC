# 🎓 CampusSync: The Ultimate Student Productivity Hub

![CampusSync Banner](https://via.placeholder.com/1200x400/0A0A0A/FFD700?text=CampusSync+-+Elevate+Your+Academic+Journey)

**CampusSync** is a premium, data-driven web application designed to help university students manage their academic life, track their productivity, and stay ahead of the curve. Built on the modern MERN stack, it combines beautiful, animated UI design with complex database aggregations to provide a holistic view of a student's performance.

---

## ✨ Key Features

### 📊 Dynamic Dashboard & Analytics
Get a real-time overview of your academic standing. The dashboard seamlessly pulls data from your database to display your **Average Attendance**, **Current GPA**, and **LeetCode Streak**. Visualize your productivity with beautifully animated Weekly Task Velocity and Focus Distribution charts.

### 🏆 Campus Leaderboard
A highly optimized, aggregation-driven leaderboard that ranks students campus-wide. It calculates a dynamic **Productivity Score** based on focus hours logged, tasks completed, and DSA problems solved. Features a stunning animated top-3 podium UI.

### 📅 Smart Planner & Kanban Board
Manage your assignments with a seamless Kanban board. Use our **Smart Scheduling Algorithm** to automatically find the perfect time to study by cross-referencing your personal timetable and working hours to suggest free time blocks.

### 💻 Algorithms Hub
Link your LeetCode, Codeforces, CodeChef, and AtCoder accounts. Track your daily problem-solving progress and maintain your competitive programming streaks all in one place.

### ⏱️ Focus Timer
A built-in Pomodoro-style focus timer. Your state is seamlessly preserved using LocalStorage, so you can navigate across the app without losing your session. Completed sessions are automatically logged to your database for analytics.

### 📚 Additional Modules
- **Timetable Management:** Keep track of your daily classes.
- **Grade Tracking:** Monitor your past semesters and predict your CPI.
- **My Documents:** A personal hub to securely store and manage your academic files.
- **Library Tracker:** Never miss a due date for borrowed library books.

---

## 🛠️ Tech Stack

**Frontend:**
- [Next.js](https://nextjs.org/) (React Framework with App Router)
- [Styled-Components](https://styled-components.com/) (CSS-in-JS for premium, scoped styling)
- [Framer Motion](https://www.framer.com/motion/) (For smooth, staggered micro-animations)
- [Recharts](https://recharts.org/) (Data visualization)
- [Lucide React](https://lucide.dev/) (Beautiful iconography)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) (RESTful API Architecture)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) (NoSQL Database & ODM)
- JSON Web Tokens (JWT) for secure authentication.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Campus-Sync-MERN.git
   cd Campus-Sync-MERN
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add your variables:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/campus_sync
   JWT_SECRET=your_super_secret_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env.local` file in the `frontend` directory if you have any frontend-specific variables.
   
   Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. **Open the App**
   Open [http://localhost:3001](http://localhost:3001) (or whichever port Next.js is running on) in your browser.

---

## 🧠 Database Architecture Highlights
This project was designed with complex NoSQL data modeling in mind:
- **Aggregation Pipelines:** Extensive use of `$match`, `$lookup`, `$group`, and `$project` for the Campus Leaderboard and Analytics engines.
- **Reference vs. Embedding:** Carefully optimized schema design separating `ActivityLogs` and `PlannerTasks` from the core `Student` model to ensure scalability.
- **Type Casting:** Strict validation and `ObjectId` casting for robust API queries.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/Campus-Sync-MERN/issues).

## 📄 License
This project is licensed under the MIT License.
