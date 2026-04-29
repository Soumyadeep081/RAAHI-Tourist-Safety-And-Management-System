# Raahi – Smart Tourist Safety Monitoring System

A complete real-time safety platform for tourists featuring SOS alerts, live location tracking, emergency contacts, and incident reporting.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Spring Boot 3.2.5 (Java 17) |
| Database | MySQL 8+ |
| Build | Gradle 8.7 (Groovy DSL) |
| Auth | JWT (jjwt 0.12) |

## Project Structure

```
raahi/
├── schema.sql                    # MySQL database schema
├── backend/
│   ├── build.gradle              # Gradle build file
│   ├── settings.gradle
│   ├── gradle/wrapper/           # Gradle wrapper
│   └── src/main/
│       ├── java/com/raahi/
│       │   ├── RaahiApplication.java
│       │   ├── config/           # Security, JWT, CORS, Exception handling
│       │   ├── entity/           # JPA entities (5 tables)
│       │   ├── repository/       # Spring Data JPA repositories
│       │   ├── service/          # Business logic layer
│       │   ├── controller/       # REST API controllers
│       │   └── dto/              # Data transfer objects
│       └── resources/
│           └── application.properties
└── frontend/
    ├── index.html                # Login / Register page
    ├── dashboard.html            # Main dashboard
    ├── css/style.css             # Design system
    └── js/
        ├── config.js             # API config & utilities
        ├── auth.js               # Authentication logic
        ├── dashboard.js          # Dashboard controller
        ├── location.js           # GPS tracking
        ├── sos.js                # SOS alert system
        └── offline.js            # Offline queue & sync
```

## Quick Start

### 1. Database Setup

```sql
CREATE DATABASE raahi_db;
CREATE USER 'raahi'@'localhost' IDENTIFIED BY 'raahi_pass';
GRANT ALL PRIVILEGES ON raahi_db.* TO 'raahi'@'localhost';
FLUSH PRIVILEGES;
```

Then optionally run `schema.sql` – Spring Boot will auto-create tables via JPA.

### 2. Backend

```bash
cd backend

# On Windows:
gradlew.bat bootRun

# On Mac/Linux:
./gradlew bootRun
```

The server starts on **http://localhost:8080**.

### 3. Frontend

Open `frontend/index.html` in your browser, or use a live server:

```bash
cd frontend
npx live-server --port=5500
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/locations` | Update location | Yes |
| POST | `/api/locations/batch` | Batch sync locations | Yes |
| GET | `/api/locations` | Get location history | Yes |
| POST | `/api/alerts/sos` | Send SOS | Yes |
| GET | `/api/alerts/my` | My alerts | Yes |
| GET | `/api/alerts/nearby` | Nearby active alerts | Yes |
| PUT | `/api/alerts/{id}/resolve` | Resolve alert | Yes |
| POST | `/api/contacts` | Add emergency contact | Yes |
| GET | `/api/contacts` | List contacts | Yes |
| DELETE | `/api/contacts/{id}` | Remove contact | Yes |
| POST | `/api/incidents` | Report incident | Yes |
| GET | `/api/incidents/my` | My incidents | Yes |
| GET | `/api/incidents/nearby` | Nearby incidents | Yes |

## Features

- **JWT Authentication** – Secure register/login flow with BCrypt passwords
- **SOS Alert System** – One-tap distress signal with GPS coordinates
- **Live Location Tracking** – Interval-based (10s) GPS updates with watchPosition
- **Emergency Contacts** – CRUD for trusted contacts
- **Incident Reporting** – Community safety reports with categories
- **Nearby Alerts** – Haversine-based proximity query
- **Offline Support** – LocalStorage queue with auto-sync on reconnect
- **Responsive UI** – Mobile-first dark theme with glassmorphism design
