# Vanguard Safety Companion

![Vanguard Safety Companion Banner](./coverpic.png)

Vanguard is a professional, aesthetic, and interactive late-night journey safety companion application. Designed with modern web practices, it offers a visually stunning glassmorphism interface and robust features to simulate personal security workflows for high-risk transits.

## Core Features

- **Live Route Tracking (Simulation)**: Dynamically map and monitor your simulated journey from a customizable origin to your destination, complete with dynamic live timestamping.
- **Priority Safety Network**: Maintain a trusted list of contacts dynamically integrated into the application state, coupled directly to response unit dispatch overviews.
- **Emergency SOS Protocol**: One-click distress signal triggering intense visual state modifications across the application and an offline-ready acoustic siren powered by the **Web Audio API**.
- **Personalized Access**: A seamless routing simulation from a Sign-In splash directly into a personalized, contextualized user dashboard.

## Aesthetic & Design

The application completely avoids frontend frameworks like Tailwind in favor of meticulous, custom *Vanilla CSS*. 
- **Color Palette**: Pristine White (surfaces), Warning Yellow (accents), and Olive Green (safe active states).
- **Glassmorphism**: Soft blurred backdrops (via `backdrop-filter`) and ambient drop shadows.
- **Typography**: Crisp tracking using the modern "Outfit" typeface.
- **Accessibility**: Modals integrate proper ARIA standards, custom focus ring styling, and native `Escape` key integrations for robust usability.

## Technologies

- **Frontend Core**: React 18
- **Build System**: Vite
- **Styling**: Vanilla CSS (Variables, Animation Keyframes, Responsive Media Queries)
- **Tooling**: Node >=20.19.0, Vitest (infrastructure ready)

## Getting Started

To run Vanguard locally on your machine:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Interact**: 
   Open `http://localhost:5173/` in your browser. Click **Get Started**, define a custom username, input your route nodes natively into the dashboard, and engage tracking!

## License
This project is licensed under the MIT License.
