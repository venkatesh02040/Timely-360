# Timely-360

## 📌 Project Overview
Timely-360 is a **web-based employee management system** designed to facilitate seamless attendance tracking, leave management, and holiday scheduling. The platform includes role-based access for **admins** and **employees**, ensuring a structured and organized workflow.

## 🌐 Live Demo
🔗 [Timely-360 Hosted Link](https://venkatesh02040.github.io/Timely-360/)

## 📂 Repository
🔗 [GitHub Repository](https://github.com/venkatesh02040/Timely-360)

## ✨ Features
- **Role-Based Access:** Admin and Employee roles with different permissions.
- **Attendance Tracking:** Employees can mark their daily attendance.
- **Leave Management:** Employees can request leaves; admins can approve/reject requests.
- **Holiday Management:** Admins can set and manage public holidays.
- **Reports & Analytics:** View attendance reports and leave records.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop (up to 1440px).

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** JSON Server (Mock Database)
- **Libraries & Tools:**
  - Bootstrap (for styling)
  - JavaScript DOM Manipulation
  - Fetch API (for data handling)

## 🚀 Installation & Setup
To run the project locally, follow these steps:

1. **Clone the repository**
   ```sh
   git clone https://github.com/venkatesh02040/Timely-360.git
   cd Timely-360
   ```

2. **Install JSON Server** (for mock database)
   ```sh
   npm install -g json-server
   ```

3. **Start the JSON Server**
   ```sh
   json-server --watch db.json --port 5000
   ```

4. **Open `index.html` in a browser** or use Live Server (VS Code Extension).

## 📌 Usage Guide
- **Admin:**
  - Manage employees, approve/reject leave requests.
  - Set official holidays and view attendance reports.
- **Employee:**
  - Mark daily attendance.
  - Submit leave requests and view approval status.

## 📌 Future Enhancements
- ✅ Add user authentication and login system.
- ✅ Integrate database for real-time data storage.
- ✅ Implement notification system for leave approvals.

## 📩 Contributions
Contributions are welcome! Feel free to fork the repo, make enhancements, and submit a pull request.
