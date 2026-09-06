# Contact / Message Form — React Three Fiber + Node/Express/Nodemailer

A premium, dark-themed contact page with a subtle animated 3D background
(floating particles + geometric shapes, mouse parallax) and a glassmorphism
contact form. Submissions are sent by email via a small Express + Nodemailer
backend.

## Folder structure

```
contact-app/
├── backend/
│   ├── routes/
│   │   └── contact.js       # POST /api/contact — validation + sending
│   ├── mailer.js             # Nodemailer transporter + email template
│   ├── server.js              # Express app entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Scene3D.jsx        # R3F background scene
    │   │   └── ContactForm.jsx    # Glassmorphism form + states
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```
PORT=5000
EMAIL_USER=your-sending-address@gmail.com
EMAIL_PASS=your-16-char-app-password
RECEIVER_EMAIL=moonlit4637@gmail.com
CLIENT_ORIGIN=http://localhost:5173
```

**Getting a Gmail App Password** (required if `EMAIL_USER` is a Gmail
address, since Gmail blocks plain-password SMTP login):
1. Turn on 2-Step Verification on the sending Google account.
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password for "Mail" and paste the 16-character code into
   `EMAIL_PASS` (no spaces).

Run the backend:

```bash
npm run dev      # with nodemon, auto-restarts on changes
# or
npm start
```

The API will be live at `http://localhost:5000`. Health check:
`GET http://localhost:5000/api/health`.

## 2. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env` if your backend runs anywhere other than
`http://localhost:5000`:

```
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`.

## How it works

- The frontend never touches `EMAIL_USER` / `EMAIL_PASS` — those live only
  in `backend/.env` and are read server-side by Nodemailer.
- `ContactForm.jsx` does light client-side validation, then `POST`s
  `{ name, email, message }` as JSON to `${VITE_API_URL}/api/contact`.
- `routes/contact.js` re-validates on the server (never trust the client),
  then calls `sendContactEmail()` in `mailer.js`, which sends a formatted
  HTML email to `RECEIVER_EMAIL` with `replyTo` set to the visitor's email
  so you can hit "Reply" directly.
- On success the form shows an animated checkmark and "Message sent
  successfully" confirmation, then resets. On failure it shows an inline
  error and lets the visitor retry.
- A basic rate limiter (10 requests / 15 min / IP) sits in front of the
  `/api/contact` route to reduce spam and abuse.

## Production notes

- Build the frontend with `npm run build` (in `frontend/`) and serve the
  `dist/` folder from any static host (Vercel, Netlify, Nginx, etc.).
- Deploy `backend/` to any Node host (Render, Railway, Fly.io, a VPS, etc.)
  and set the same environment variables there — never commit `.env`.
- Update `CLIENT_ORIGIN` (backend) and `VITE_API_URL` (frontend) to your
  real deployed URLs.
- Consider swapping the Gmail SMTP transport for a transactional email
  provider (SendGrid, Postmark, Resend, SES) for better deliverability at
  scale — only `mailer.js` needs to change.
