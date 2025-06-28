# 🌍 CrisisCompass
 
**AI-Powered Disaster Response Coordination System**
 
CrisisCompass is an intelligent disaster management platform that empowers agencies to respond swiftly and collaboratively to crises like earthquakes. It combines machine learning, smart resource planning, and centralized communication to transform disaster response from chaotic to coordinated.
 
> 🏆 Built for the [Pixel Palettes Hackathon](https://www.ieeerasmuj.com/pixelpalettes/) by IEEE RAS MUJ.
 
---
 
## 🚨 Problem Statement
 
**Disaster Response Coordination**  
 
During disasters, coordinating rescue efforts, resource allocation, and communication becomes chaotic. Your task is to create an AI-powered disaster response system that optimizes rescue operations, coordinates between agencies, and ensures efficient resource distribution based on real-time needs assessment.
 
---
 
## 🧠 Our Solution: CrisisCompass
 
### ✅ 1. Real-Time Severity Prediction (AI + ML)
 
- We trained a **RandomForestClassifier** on historical earthquake data (1995–2023)
- Achieved **92% accuracy** in predicting disaster severity
- **Next.js** sends earthquake parameters (e.g. magnitude, depth, mmi) to the **Flask backend**
- **Flask** runs the ML model and sends back the predicted severity
- This helps prioritize high-risk zones and deploy resources efficiently
 
### 🛠️ 2. Smart Resource Allocation Algorithm
 
Our custom algorithm ensures:
- Resources are **intelligently divided across departments**, even if one department can fulfill the entire need
- This avoids over-reliance and keeps **backups ready** for future events
- Promotes a **balanced load** and better long-term readiness
 
### 💬 3. Centralized Multi-Agency Communication
 
One of the biggest hurdles during disaster response is siloed communication between departments. CrisisCompass solves this by:
 
- Creating a **centralized chat channel** for each disaster
- All departments involved in a response can communicate in one place
- Ensures **real-time, persistent** communication — all messages are stored in **MongoDB**
 
---
 
## 🧱 Tech Stack
 
### Frontend & UI
- **Next.js** (React Framework)
- **Tailwind CSS** for styling
- **TypeScript** for type safety
 
### Backend
- **Flask (Python)**: Handles ML model and core logic
- **Next.js API routes**: Handles certain client interactions and routes
- **MongoDB**: Stores disaster events, chat messages, resource data, and department info
 
### Machine Learning
- **RandomForestClassifier** via Scikit-learn
- Trained on real-world earthquake data (1995–2023)
 
---
 
## 👥 Credits
Special thanks to the amazing team behind CrisisCompass:
 
💡 [HB Singh Chaudhary](https://github.com/M4YH3M-DEV/) — Ideation & Concept, Project Moderation
 
👨‍💻 [BIGBEASTISHANK (Pranjal)](https://bigbeastishank.com/) — Full-stack Development & ML Integration
 
🎨 [Devguru Pandey](http://github.com/DevguruPandey) — Presentation & Visual Design
 
✍️ [Aarav](https://github.com/ShootingFlame) — Content Formation & Structuring
 
---
 
> CrisisCompass — Making every second count in disaster response.
