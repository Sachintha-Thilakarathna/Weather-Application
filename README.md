# Weather Application

A full-stack weather analytics dashboard. The backend fetches live weather for 11 cities, scores each with a custom **Comfort Index** (0–100) and ranks them; the frontend shows them in a searchable, sortable dashboard behind a login with email-based multi-factor authentication.

---

## Technologies Used

**Frontend** (`client/`)
- [Next.js 16](https://nextjs.org/) (App Router, JavaScript)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) (Geist font family)

**Backend** (`server/`)
- [NestJS 11](https://nestjs.com/) (JavaScript, via Babel)
- [@nestjs/axios](https://docs.nestjs.com/techniques/http-module) — HTTP client for OpenWeatherMap
- [@nestjs/jwt](https://docs.nestjs.com/security/authentication) — JWT signing/verification
- [@nestjs/cache-manager](https://docs.nestjs.com/techniques/caching) — server-side response caching
- [@nestjs/config](https://docs.nestjs.com/techniques/configuration) — environment config
- [Nodemailer](https://nodemailer.com/) — sends MFA verification codes by email
- [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest) — unit/e2e tests

**External services**
- [OpenWeatherMap API](https://openweathermap.org/api) — live weather data
- SMTP provider of your choice (Gmail, SendGrid, Mailtrap, etc.) — MFA emails; optional locally (see below)

**Infra**
- Docker + `docker-compose.yml` for both services
- GitHub Actions CI/CD (`.github/workflows/ci-cd.yml`) — lints/builds the client and tests the server on every push

---

## Project Structure

```
Weather-Application/
├── server/            NestJS backend
│   └── src/
│       ├── auth/      login, MFA (OTP email), JWT guard
│       ├── cities.json
│       ├── app.service.js   weather fetch, caching, Comfort Index
│       └── app.controller.js
├── client/            Next.js frontend
│   ├── app/
│   │   ├── login/     two-step credentials + OTP form
│   │   └── page.js    dashboard (protected by the JWT cookie)
│   └── components/    CityCard, CityGrid, Navigation, ThemeToggle, etc.
├── docker-compose.yml
└── .env.example
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later (matches the Dockerfiles)
- npm
- A free [OpenWeatherMap API key](https://home.openweathermap.org/users/sign_up)
- SMTP credentials for MFA emails (optional locally — codes print to the server console if omitted)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Sachintha-Thilakarathna/Weather-Application.git
cd Weather-Application
```

### 2. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

This pulls in everything already pinned in each `package.json`, notably:

**server**
```
@nestjs/axios  @nestjs/cache-manager  @nestjs/common  @nestjs/config
@nestjs/core   @nestjs/jwt            @nestjs/platform-express
axios  cache-manager  nodemailer  reflect-metadata  rxjs
```

**client**
```
next  react  react-dom
tailwindcss  @tailwindcss/postcss
```

### 3. Configure environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env
```

```bash
# .env
CLIENT_PORT=3000
SERVER_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://server:3001/api/cities


# Not in .env.example yet, but required — app.service.js reads this:
OWM_API_KEY=your_openweathermap_api_key
```

> **Note:** `OWM_API_KEY` is read by `server/src/app.service.js` but isn't currently in `.env.example` — add it, or weather fetches will fail.
>
> If `SMTP_HOST` is left blank, `mail.service.js` logs the OTP code to the server console instead of emailing it, so the full login flow is testable without real SMTP credentials.
>
> `NEXT_PUBLIC_API_BASE_URL` is used by the Docker Compose setup (points at the `server` container by service name); for local `npm run dev` outside Docker, `app/page.js` falls back to `http://localhost:3001/api/cities` if it's unset.

### 4. Run the application

**Option A — locally, two terminals:**

```bash
# Terminal 1 — backend
cd server
npm run start:dev      # http://localhost:3001

# Terminal 2 — frontend
cd client
npm run dev             # http://localhost:3000
```

**Option B — Docker Compose:**

```bash
docker compose up --build
```

Visit `http://localhost:3000`, which redirects to `/login`. Sign in with a whitelisted account, enter the MFA code (from your inbox or the server console), and you'll land on the dashboard.

**Test credentials** (from `server/src/auth/auth.service.js`):
```
Email: thilakarathnasachintha@gmail.com
Password: Pass#fidenz
```

---

## Running Tests

```bash
cd server
npm run test        # unit tests
npm run test:e2e     # end-to-end tests
npm run test:cov     # coverage report
```

```bash
cd client
npm run lint
```

---

## Notes & Known Limitations

- Weather responses are cached server-side for 5 minutes (`CacheModule.register({ ttl: 300000 })`) to reduce OpenWeatherMap API calls.
- Login is a two-step flow: password check first, then a 6-digit code emailed to the user (MFA), before a JWT is issued.
- The JWT is stateless — `/api/auth/logout` clears the cookie client-side rather than invalidating the token server-side. A stolen token remains valid until it naturally expires (1 hour).
- `@auth0/nextjs-auth0` is listed in `client/package.json` but isn't wired into the current login flow, which uses the custom JWT/MFA system instead — remove the dependency if it's not going to be used, to avoid confusion.
- City IDs in `server/src/cities.json` are OpenWeatherMap city IDs, which are occasionally deprecated; if a request 404s, look up a current ID by name (`?q={city name}&appid={key}`) and swap it in.
