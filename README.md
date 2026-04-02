# 🚀 POD — Modular Learning Management System

POD is a modern Learning Management System (LMS) inspired by the concept of _pods_ in Kubernetes — small, self-contained, and scalable units. Instead of traditional bulky courses, POD focuses on **modular learning units ("Pods")** that make education more flexible, structured, and efficient.

---

## 🧠 Concept

In Kubernetes, a _Pod_ is the smallest deployable unit.
In POD LMS, a **Pod is the smallest unit of learning**.

Each Pod can include:

- 📺 Video content
- 📝 Notes
- ❓ Quiz/assessment
- 💬 Discussions

This allows learners to consume content in **bite-sized, focused chunks** instead of long, overwhelming courses.

---

## ✨ Features (MVP)

### 🔐 Authentication

- User signup & login
- Email verification
- Secure session handling
- Password reset (planned)

### 👤 User Roles (Planned)

- Student
- Instructor
- Admin

### 📚 Learning System

- Pod-based learning units
- Course → composed of multiple Pods
- Progress tracking (planned)

### 📩 Email System

- Verification emails
- Resend verification flow

---

## 🏗️ Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Next.js Server Actions / API Routes
- **Auth:** Better Auth
- **Database:** Prisma + PostgreSQL
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Forms:** React Hook Form

---

## 📁 Project Structure

```
src/
│
├── app/                  # Next.js App Router pages
├── features/
│   └── auth/             # Authentication module
│       ├── components/
│       ├── actions/
│       └── schemas/
│
├── lib/
│   ├── auth/             # Auth configuration (Better Auth)
│   └── db/               # Prisma client setup
│
└── components/ui/        # Reusable UI components
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/pod-lms.git
cd pod-lms
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env` file:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
EMAIL_SERVER=
EMAIL_FROM=
```

---

### 4️⃣ Setup database

```bash
npx prisma generate
npx prisma migrate dev
```

---

### 5️⃣ Run the development server

```bash
npm run dev
```

App will be running at:

```
http://localhost:3000
```

---

## 🔐 Authentication Flow

1. User signs up
2. Verification email is sent
3. User verifies email
4. Account becomes active
5. User can log in and access dashboard

---

## 🛣️ Roadmap

- [ ] Password reset flow
- [ ] Role-based access control (RBAC)
- [ ] Course & Pod creation (Instructor)
- [ ] Student dashboard
- [ ] Progress tracking
- [ ] Payments / subscriptions
- [ ] Community discussions

---

## 💡 Vision

POD aims to redefine online learning by making it:

- Modular
- Scalable
- Developer-inspired
- Focused on real learning, not just content dumping

---

## 🤝 Contributing

Contributions are welcome!
Feel free to open issues or submit pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ by you
(Replace with your name / GitHub profile)

---
