# 💪 Addiction Free - Recovery Companion App

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/javascript-100%25-yellow.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

**A beautiful, privacy-focused web application to support your recovery journey**

[Live Demo](#-demo) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [About](#-about)
- [Demo](#-demo)
- [Key Features](#-features)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Data Privacy](#-data-privacy)
- [Browser Support](#-browser-support)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 About

**Addiction Free** is a comprehensive recovery companion designed to help individuals overcome any type of addiction through consistent tracking, goal-setting, and positive reinforcement. Built with privacy as a core principle, all data remains securely stored on your device.

### Why Addiction Free?

- 🔒 **100% Private** - Your data never leaves your device
- 🎯 **Evidence-Based** - Built on proven recovery principles
- 👥 **Multi-User Support** - Support multiple family members or recovery journeys
- 🎨 **Beautiful UI** - Clean, modern interface that motivates
- 📱 **Fully Responsive** - Works seamlessly on all devices
- ⚡ **No Dependencies** - Pure vanilla JavaScript, no frameworks required

---

## 🎬 Demo

### Live Demo
👉 **[Try it here](YOUR_GITHUB_PAGES_URL)** *(Deploy to GitHub Pages and add link)*

### Quick Preview

```bash
# Clone and open
git clone https://github.com/YOUR_USERNAME/addiction-free.git
cd addiction-free
open index.html
```

### Video Demo
*[Add GIF or video demonstration of the app here]*

---

## ✨ Features

### 👤 Multi-User Profile System
- **Individual Journeys** - Create separate profiles for different users or addiction types
- **Quick Switching** - Seamlessly switch between profiles from the header dropdown
- **Isolated Data** - Each profile maintains completely independent tracking data
- **Profile Management** - Intuitive interface for creating and managing profiles

### 📊 Comprehensive Dashboard
| Feature | Description |
|---------|-------------|
| **Days Sober Counter** | Real-time tracking of addiction-free days |
| **Streak Tracking** | Monitor consecutive check-in days |
| **Craving Analytics** | Daily craving count with trend analysis |
| **Progress Visualization** | Beautiful progress bars for milestone tracking |
| **Activity Feed** | Recent check-ins and craving logs at a glance |

### ✅ Daily Check-In System
Track multiple wellness dimensions:
- 😊 **Mood Tracking** - 5-point scale (Great → Difficult)
- 🧠 **Craving Assessment** - Binary yes/no tracking
- ⚡ **Energy Levels** - 1-10 scale rating
- 🙏 **Gratitude Journal** - Daily gratitude prompts
- 📝 **Reflection Notes** - Free-form journaling

### 🎯 Intelligent Craving Log
- **Intensity Measurement** - Rate cravings from 1-10
- **Trigger Identification** - Categorize triggers:
  - Stress
  - Boredom
  - Social situations
  - Emotional states
  - Habitual patterns
  - Environmental factors
- **Coping Strategy Tracking** - Document what worked
- **Pattern Recognition** - Identify your personal triggers over time

### 🏆 Goals & Achievements System
- **Custom Goal Setting** - Create personalized recovery goals
- **Visual Progress Tracking** - Real-time progress bars
- **Automatic Milestones** - Unlock achievements at:
  - 1, 3, 7, 14, 30 days
  - 60, 90, 180, 365 days
- **Badge System** - Collect achievement badges for motivation

### 💪 Motivation Center
- **Daily Inspirational Quotes** - Rotating motivational messages
- **Achievement Gallery** - Showcase your earned badges
- **Coping Strategy Library** - Quick reference guides:
  - Deep Breathing Exercises
  - Physical Activity Prompts
  - Hydration Reminders
  - Social Support Outreach
  - Mindfulness Techniques
  - Journaling Prompts

---

## 📸 Screenshots

*Add screenshots of your app here*

<div align="center">

| Dashboard | Check-In | Craving Log |
|-----------|----------|-------------|
| *Screenshot 1* | *Screenshot 2* | *Screenshot 3* |

</div>

---

## 🚀 Installation

### Option 1: Direct Download
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/addiction-free.git

# Navigate to directory
cd addiction-free

# Open in browser
open index.html
# or
start index.html  # Windows
```

### Option 2: GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Select main branch as source
4. Access at `https://YOUR_USERNAME.github.io/addiction-free`

### Option 3: Local Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then visit http://localhost:8000
```

---

## 📘 Usage Guide

### Getting Started

#### 1️⃣ Create Your First Profile
```
1. Open the app in your browser
2. Navigate to "Profiles" tab
3. Enter a profile name (e.g., "John's Journey")
4. Click "Create Profile"
5. Profile is automatically selected
```

#### 2️⃣ Complete Your First Check-In
```
1. Go to "Check-in" tab
2. Select your current mood
3. Indicate if you had cravings today
4. Rate your energy level
5. Write something you're grateful for
6. Add optional daily notes
7. Click "Submit Check-in"
```

#### 3️⃣ Log Cravings (When They Occur)
```
1. Navigate to "Cravings" tab
2. Rate craving intensity (1-10)
3. Select the trigger type
4. Document coping strategies used
5. Click "Log Craving"
```

#### 4️⃣ Set Recovery Goals
```
1. Go to "Goals" tab
2. Click "Add New Goal"
3. Enter goal description (e.g., "30 days sober")
4. Set target days
5. Track progress automatically
```

#### 5️⃣ Managing Multiple Profiles
```
- Switch profiles: Use dropdown in header
- Create new profile: Profiles tab → "Create Profile"
- Delete profile: Profiles tab → "Delete" button
- Each profile tracks independently
```

---

## 🛠 Technology Stack

### Core Technologies
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - Zero dependencies, pure ES6+

### Key Features
- **LocalStorage API** - Client-side data persistence
- **Responsive Design** - Mobile-first approach
- **CSS Grid & Flexbox** - Modern layout systems
- **CSS Custom Properties** - Dynamic theming
- **ES6+ Features** - Modern JavaScript patterns

### Design Patterns
- **Module Pattern** - Organized code structure
- **Event Delegation** - Efficient event handling
- **Data Encapsulation** - Profile-based data isolation
- **State Management** - Centralized data handling

---

## 🏗 Architecture

```
addiction-free/
├── index.html          # Main application file
├── styles.css          # Styling (if separated)
├── app.js              # Application logic (if separated)
├── README.md           # Documentation
└── assets/             # Images and resources
    ├── icons/
    └── screenshots/
```

### Data Structure
```javascript
{
  "currentProfile": "john_doe",
  "profiles": {
    "john_doe": {
      "name": "John Doe",
      "startDate": "2024-01-01",
      "checkins": [...],
      "cravings": [...],
      "goals": [...],
      "achievements": [...]
    }
  }
}
```

---

## 🔒 Data Privacy

### Privacy First Approach

✅ **What We DO:**
- Store all data locally in browser LocalStorage
- Keep data completely private on your device
- Require no account, email, or personal information
- Work completely offline

❌ **What We DON'T:**
- Never send data to external servers
- Never track user behavior
- Never use cookies or analytics
- Never require internet connection

### Data Export & Backup

```javascript
// Manual backup (from browser console)
localStorage.getItem('addictionFreeData')

// To restore: paste the backup data
localStorage.setItem('addictionFreeData', YOUR_BACKUP_DATA)
```

⚠️ **Important Notes:**
- Data is browser-specific (not synced across devices)
- Clearing browser data will delete your progress
- Consider periodic manual backups for important data

---

## 🌐 Browser Support

| Browser | Supported Versions |
|---------|-------------------|
| Chrome | ✅ Latest 2 versions |
| Firefox | ✅ Latest 2 versions |
| Safari | ✅ Latest 2 versions |
| Edge | ✅ Latest 2 versions |
| Opera | ✅ Latest 2 versions |

### Requirements
- LocalStorage support (enabled by default in all modern browsers)
- JavaScript enabled
- Modern CSS support (Grid, Flexbox, Custom Properties)

---

## 🗺 Roadmap

### Version 1.1 (Planned)
- [ ] Dark mode toggle
- [ ] Data export/import functionality
- [ ] Custom achievement badges
- [ ] Weekly/monthly statistics

### Version 1.2 (Future)
- [ ] Charts and graphs for trend analysis
- [ ] Customizable coping strategies
- [ ] Reminder notifications
- [ ] Theme customization

### Version 2.0 (Vision)
- [ ] Optional cloud backup
- [ ] Mobile app (React Native)
- [ ] Support group features
- [ ] Progress sharing (optional)

**Have ideas?** Open an issue with the `enhancement` label!

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Write clean, commented code
- Follow existing code style
- Test across multiple browsers
- Update documentation for new features
- Keep the app dependency-free

### Bug Reports
Found a bug? Please open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Browser and version
- Screenshots if applicable

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

```
MIT License - feel free to use this project for personal or commercial purposes
```

---

## 💖 Acknowledgments

- Inspired by recovery programs worldwide
- Built for anyone on their journey to freedom
- Special thanks to the recovery community

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/addiction-free/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/addiction-free/discussions)
- **Email**: your.email@example.com

---

<div align="center">

### ⭐ If this project helped you, please give it a star!

**Made with ❤️ for recovery**

[⬆ Back to Top](#-addiction-free---recovery-companion-app)

</div>
