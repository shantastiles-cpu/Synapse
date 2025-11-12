# SeatSync by Synapse – Real-Time Study Spot Availability System

SeatSync is a cross-platform campus map that shows **live availability of study spaces** using IoT sensors, a cloud API, and a Flutter front-end.  
This project was built for Texas A&M University as a way to help students quickly find open seating across campus.

<img width="1005" height="815" alt="image" src="https://github.com/user-attachments/assets/586080a7-35c8-4ffe-a99b-4d6ef8d1b741" />
---

## 📖 Overview

SeatSync combines hardware, software, and UI design into one seamless system:

- **ESP32 sensor modules** detect seat usage (motion / presence).
- **Node.js backend (hosted on Render or ngrok)** receives sensor data.
- **SQL database** stores real-time and historical occupancy readings.
- **Flutter Web application** displays an interactive campus map with live availability.

Students can:
- See which study areas are currently open or occupied.
- Tap locations to view detailed room status.
- View floor plans (e.g., Zachry Engineering Education Complex).
- Use accessibility features like enlarged text and clear color indicators.

---

## System Architecture


### Hardware (ESP32)
- Sends periodic or event-based updates (`motionDetected`)
- Hits backend via `POST /api/sensor`
- Each device is registered using:
  - `POST /api/sensor/register`

### Backend (Node.js + SQL)
Endpoints include:
- `GET /api/sensor/latest` → latest reading for each registered sensor
- `POST /api/sensor` → ESP32 submits readings
- `POST /api/sensor/register` → add new sensor to the system  
Supports multiple devices and scalable infrastructure.

### Frontend (Flutter Web)
- Interactive TAMU campus map
- Spots positioned using normalized coordinates (0–1)
- Auto-polls backend for live updates
- Supports:
  - Mock mode (debugging)
  - HTTP polling
  - WebSocket mode (optional)
  - Backend stream mode (real sensor data)

---

## 📍 Key Features

###  Real-Time Occupancy
- Map markers turn **green** (open) or **red** (occupied)
- White border improves contrast and visibility

### Interactive Campus Map
- West/East campus toggle
- Zoom, drag, pan with `InteractiveViewer`
- Tap locations to see room details

### Zachry Floor Plans
- Multi-level floor plan viewer
- Tap the Zach marker → “View Floor Plans”

### Calibration Mode
- Tap anywhere on the map
- App outputs normalized coordinates for new study spots
- Helps teams quickly add new seats without guesswork

### Onboarding Tutorial
- Automatic pop-up the first time the page loads
- Help icon in AppBar to re-open anytime
- Guides users through:
  - campus side switching  
  - tapping markers  
  - viewing floor plans  
  - backend connection  
  - calibration mode  

### Accessibility Friendly
- Global text scaling via `TextScaler`
- High-contrast dots with white borders
- Large touch targets

<img width="2390" height="1357" alt="image" src="https://github.com/user-attachments/assets/a7c3802f-5ffb-4862-89b6-5e751c6bb0f5" />

---

## Tech Stack

| Component | Technology |
|----------|------------|
| Frontend | Flutter Web (Material 3) |
| Backend  | Node.js (Express) |
| Database | SQL (PostgreSQL or MySQL depending on deployment) |
| Hardware | ESP32 with motion sensor |
| Hosting  | Render.com / ngrok during development |
| Version Control | GitHub |

---
