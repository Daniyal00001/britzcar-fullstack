# Britzcar Full-Stack (Single App: Express serves Frontend + APIs)

## Setup (Local)
1. Install Node 18+
2. Go to `backend/` and create `.env` from `.env.example`:
```
MONGO_URI=YOUR_ATLAS_URI
PORT=5000
JWT_SECRET=change_this_secret
```
3. Install & run:
```
cd backend
npm install
npm start
```
4. Open `http://localhost:5000`

### Default Admin (seeded automatically)
- Email: `admin@example.com`
- Password: `Admin@123`

## Deploy
- Deploy `backend/` to Render/Railway/Heroku and set env vars from `.env.example`.
- Express serves the static frontend from `/public` and exposes APIs under `/api/*`.
