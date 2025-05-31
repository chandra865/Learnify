# 🎓 Learnify

> Learnify is a full-featured Learning Management System (LMS) platform for students and instructors. It supports course creation, video streaming, enrollment, progress tracking, and secure payments.

---

## Demo
**Website:** [https://learnify-ten-zeta.vercel.app](https://learnify-ten-zeta.vercel.app)

**Demo Video:** [Watch on YouTube](https://youtu.be/your-demo-video-id)

---

## Tech Stack

### Frontend:

- React
- Tailwind CSS

### Backend:

- Node.js
- Express.js
- MongoDB

### Authentication & Security:

- JWT Authentication
- Google OAuth 2.0
- Email OTP Verification

### Media & Video Streaming:

- AWS S3
- AWS Lambda
- AWS MediaConvert
- AWS CloudFront
- HLS with Adaptive Bitrate Streaming

### Payments:

- Razorpay (with coupon system, cart, and order tracking)

### Deployment
- Frontend on Vercel
- Backend on Render
---

## Features

### Instructor Features

- Create and manage courses with sections and lectures

- Upload and stream videos using HLS

- Monitor real-time earnings and student analytics

- Create discount coupons (auto-apply highest discount)

### Student Features

- Browse, search, and filter courses

- Enroll in courses and purchase via Razorpay

- Track lecture-wise progress

- Take quizzes (lecture-wise or full course)

- Earn auto-generated certificates on completion

- Leave reviews and ratings

### Core Functionalities

- Secure authentication with JWT and Google OAuth

- Email OTP verification and password reset

- Smart coupon system (auto-applies highest active coupon)

- course recommendations

- HLS with Adaptive Bitrate Streaming

- Review and rating system for courses

- Cart system and complete order history

- Real-time email notifications via Nodemailer

---

## Getting Started

### 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/chandra865/Learnify.git
   cd Learnify

   ```

2. Frontend setup:

   ```bash
   cd frontend
   npm install
   npm run dev

   ```

3. Backend setup:
   ```bash
   cd backend
   npm install
   npm start
   ```
4. Environment Variables:

   Check ".env.sample" file in both frontend and backend
