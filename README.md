# Prescripto – Doctor Appointment Booking (MERN)

Three apps in one repository:

| Folder | What it is | Port |
|---|---|---|
| `backend/` | Node + Express + MongoDB API | 4000 |
| `frontend/` | Patient website (React + Vite + Tailwind) | 5173 |
| `admin/` | Admin + Doctor panel (React + Vite + Tailwind) | 5174 |

## 1. First-time setup

```bash
# backend
cd backend
cp .env.example .env        # then fill in the values (see below)
npm install
npm run dev

# patient website (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev

# admin panel (new terminal)
cd admin
cp .env.example .env
npm install
npm run dev
```

On Windows Command Prompt use `copy .env.example .env` instead of `cp`.

`backend/.env` needs:
- `MONGODB_URI` – connection string from MongoDB Atlas
- `JWT_SECRET` – any long random text
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` – the login you will use on the admin panel
- `CLOUDINARY_*` – keys from a free Cloudinary account (for photos)

Never commit `.env` files. Share keys privately.

## 2. How to check everything is connected

1. Start the backend. The terminal should say `MongoDB connected` and `Server started on port 4000`.
2. Open http://localhost:4000 – it should show "Prescripto API is working".
3. Open http://localhost:5174, log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. You should see the Admin Dashboard page.
4. Open http://localhost:5173 – the Home page should show "Doctors loaded: 0" (it will say more after doctors are added).

## 3. What is already done

**Backend (complete except payments):**
- MongoDB connection, models (User, Doctor, Appointment)
- JWT auth for patient, doctor, admin
- Image upload (Multer + Cloudinary)
- All APIs listed below, including double-booking protection

**Frontend / Admin:**
- Vite + React + Tailwind setup, routes, toast messages
- Context files that already call the backend (`AppContext`, `AdminContext`, `DoctorContext`)
- Admin/doctor login page working
- All other pages are `Placeholder` screens to be replaced

## 4. What is left to build (the frontend work)

Replace `Placeholder` with real pages, following the tutorial video.

**frontend/** (patient website) – add `src/components/` and `src/pages/`:
- Navbar, Footer, Header banner, Speciality menu, Top Doctors, Banner
- Pages: Home, Doctors (filter by speciality), Login/Signup, About, Contact, MyProfile, MyAppointments, Appointment (7-day slot picker + book)
- Add Navbar/Footer in `App.jsx` (see TODO comments)

**admin/** – add Navbar, Sidebar and pages:
- Admin: Dashboard, All Appointments, Add Doctor, Doctors List
- Doctor: Dashboard, Appointments, Profile
- Add Navbar/Sidebar in `App.jsx` (see TODO comments)

**Later:** online payments (Razorpay / Stripe) in `userController.js`, then deployment.

## 5. API reference

All responses look like `{ success: true/false, message, ... }`.
Send tokens in headers: patient → `token`, doctor → `dtoken`, admin → `atoken`.

### Admin (`/api/admin`, header `atoken` except login)
| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/login` | `{ email, password }` | `token` |
| POST | `/add-doctor` | form-data: `image`, `name`, `email`, `password`, `speciality`, `degree`, `experience`, `about`, `fees`, `address` (JSON string `{"line1","line2"}`) | message |
| GET | `/all-doctors` | – | `doctors[]` |
| POST | `/change-availability` | `{ docId }` | message |
| GET | `/appointments` | – | `appointments[]` |
| POST | `/cancel-appointment` | `{ appointmentId }` | message |
| GET | `/dashboard` | – | `dashData { doctors, appointments, patients, latestAppointments }` |

### Doctor (`/api/doctor`)
| Method | Path | Auth | Body | Returns |
|---|---|---|---|---|
| GET | `/list` | none | – | `doctors[]` |
| POST | `/login` | none | `{ email, password }` | `token` |
| GET | `/appointments` | dtoken | – | `appointments[]` |
| POST | `/complete-appointment` | dtoken | `{ appointmentId }` | message |
| POST | `/cancel-appointment` | dtoken | `{ appointmentId }` | message |
| GET | `/dashboard` | dtoken | – | `dashData { earnings, appointments, patients, latestAppointments }` |
| GET | `/profile` | dtoken | – | `profileData` |
| POST | `/update-profile` | dtoken | `{ fees, address, available }` | message |

### Patient (`/api/user`, header `token` except register/login)
| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/register` | `{ name, email, password }` (password min 8) | `token` |
| POST | `/login` | `{ email, password }` | `token` |
| GET | `/get-profile` | – | `userData` |
| POST | `/update-profile` | form-data: `name`, `phone`, `address` (JSON string), `dob`, `gender`, optional `image` | message |
| POST | `/book-appointment` | `{ docId, slotDate, slotTime }` | message |
| GET | `/appointments` | – | `appointments[]` |
| POST | `/cancel-appointment` | `{ appointmentId }` | message |

**Slot format:** `slotDate` = `"day_month_year"` e.g. `"24_10_2026"`; `slotTime` = `"10:30 AM"`.
Booked slots are stored on the doctor as `slots_booked: { "24_10_2026": ["10:30 AM"] }`.
The Appointment page should hide slots that are already in `slots_booked`.

## 6. Git workflow

- `main` always works. Work on a branch: `git checkout -b feature/short-name`
- `git add . && git commit -m "message" && git push -u origin feature/short-name`
- Open a Pull Request on GitHub, the other person reviews and merges.
- Always `git pull` before starting new work.
