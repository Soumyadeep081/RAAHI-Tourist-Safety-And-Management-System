# 🗺️ Raahi – Smart Tourist Safety & Incident Monitoring System

<p align="center">
  <img src="https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Leaflet-Maps-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
  <img src="https://img.shields.io/badge/JWT-Secure-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />
</p>

---

## 🌟 Overview

**Raahi** (meaning *Traveler* in Hindi) is a premium, real-time safety and distress monitoring platform designed specifically for tourists. It provides instant SOS signaling, live tracking with diagnostics controls, safety geofences, community incident reports, and automated alert dispatching to emergency contacts.

Built with a **modern glassmorphism UI** that supports responsive dark and light modes, Raahi integrates directly with OpenStreetMap via **Leaflet JS** to render high-contrast dark maps, safety boundaries, and nearby safety services dynamically.

---

## 🚀 Key Features

### 🚨 SOS Distress System
* **One-Tap Signal**: Instantly trigger an active SOS alert with your live coordinates.
* **📦 Progress Tracker**: Track the emergency resolution pipeline (Triggered ➡️ Dispatch Notified ➡️ Responders Dispatched ➡️ Arrived on Scene ➡️ Resolved) on a detailed Flipkart/Amazon style stepper panel.
* **Auto Email Dispatch**: Automatically emails details (coordinates, message, and a live tracking link) to all registered trusted emergency contacts on alert creation.

### 🛰️ Live Location & Diagnostics
* **watchPosition Tracking**: High-accuracy interval-based GPS tracking.
* **Pings Control**: Persistent toggle switch to start/pause automatic server location synchronization pings.
* **Offline Resilience**: Automatically queues failed location updates locally and syncs them once connection returns.

### 🛡️ Geofencing & Safety Zones
* **Custom Safety Boundaries**: Define geofences with custom radii.
* **Proximity Triggers**: Receives alerts on entry/approach of geofences. Page loads handle initial states silently to prevent unnecessary alarm spam.

### 🏛️ Interactive Safety Map
* **OSM Integration**: Dynamically load real safety assets (hospitals, police stations, fire stations, and government offices) around the tourist.
* **Polygon Center Resolution**: Upgraded Overpass queries to parse area ways and relations (`nwr` + `out center;`) for pinpoint marker precision.
* **Polished Dark Mode**: Features custom canvas theme gradients, inline popup styles utilizing theme variable tokens, and dark map filters.

---

## 📂 Project Structure

```
raahi/
├── schema.sql                    # MySQL database schema
├── backend/
│   ├── build.gradle              # Gradle build file
│   └── src/main/
│       ├── java/com/raahi/
│       │   ├── config/           # JWT, security filters, CORS configuration
│       │   ├── entity/           # JPA entities (User, Alert, Incident, Geofence, EmergencyContact)
│       │   ├── repository/       # JpaRepository interfaces
│       │   ├── service/          # Business logic (SOS, Email alerts, GIS processing)
│       │   └── controller/       # RestController endpoints
│       └── resources/
│           └── application.properties
└── frontend/
    ├── index.html                # Login / Register entry point
    ├── dashboard.html            # Main dashboard view
    ├── html/
    │   └── alert-tracking.html   # Dedicated SOS status & map tracking page
    ├── css/style.css             # Glassmorphism design system & styling
    └── js/
        ├── config.js             # API settings, global theme loader & notifications
        ├── location.js           # GPS watchPosition & pings management
        ├── sos.js                # SOS dispatch & timeline tracking triggers
        └── offline.js            # LocalStorage queue & network auto-sync
```

---

## ⚡ Quick Start

### 1. Database Setup

Create the MySQL schema and user:
```sql
CREATE DATABASE raahi_db;
CREATE USER 'raahi'@'localhost' IDENTIFIED BY 'raahi_pass';
GRANT ALL PRIVILEGES ON raahi_db.* TO 'raahi'@'localhost';
FLUSH PRIVILEGES;
```
Spring Boot automatically handles schema tables creation via Hibernate JPA.

### 2. Run the Backend

Run the Spring Boot application using Gradle:
```bash
cd backend
# Windows
.\gradlew.bat bootRun
# Linux/macOS
./gradlew bootRun
```
The REST API server runs on **http://localhost:8080**.

### 3. Launch the Frontend

For optimal reload and routing, serve `frontend` on port **5500**:
```bash
cd frontend
npx live-server --port=5500
```
Open **http://127.0.0.1:5500** in your browser.

---

## 🔑 REST API Reference

All requests must contain a `Bearer <JWT_TOKEN>` Authorization header except auth endpoints.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new traveler |
| **POST** | `/api/auth/login` | Retrieve JWT credentials |
| **POST** | `/api/alerts/sos` | Trigger a new active SOS |
| **PUT** | `/api/alerts/{id}/resolve` | Mark distress alert resolved |
| **GET** | `/api/alerts/my` | Retrieve my historical alerts |
| **GET** | `/api/alerts/nearby` | Query active alerts within proximity |
| **POST** | `/api/locations` | Update current GPS location |
| **POST** | `/api/locations/batch` | Synchronize offline location logs |
| **POST** | `/api/contacts` | Add a new emergency contact |
| **GET** | `/api/contacts` | Fetch registered contacts |
| **POST** | `/api/incidents` | Report a community safety issue |

---

> [!TIP]
> Make sure to configure your SMTP settings in `application.properties` to fully test the emergency contact notification emails!
