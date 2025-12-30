# Chatterbox Voice Cloning - Frontend

A modern, minimal React frontend for voice cloning with ChatterboxTurboTTS.

## Features

✨ **Voice Sample Recording**
- Record exactly 10 seconds of audio from microphone
- Real-time waveform visualization
- Audio playback preview
- Re-record option

📝 **Text Input**
- Multiline text area
- Character counter (500 char limit)
- Progress bar

🎤 **Voice Generation**
- Send audio + text to backend
- Loading animation
- Success/error messages

🔊 **Audio Player**
- Play/pause controls
- Timeline scrubber
- Download WAV file

## Setup

### Prerequisites
- Node.js 16+ installed
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## Backend Integration

The frontend expects a backend API at `http://localhost:5000` with the following endpoint:

### `POST /generate`

**Request:**
```
FormData:
- audio: WAV file (Blob)
- text: string (text to convert)
```

**Response:**
- WAV audio blob

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Recorder.jsx      # Voice recording component
│   │   ├── TextInput.jsx     # Text input with counter
│   │   ├── AudioPlayer.jsx   # Generated audio player
│   │   ├── Loader.jsx        # Loading animation
│   │   └── [component].css   # Component styles
│   ├── App.jsx               # Main app component
│   ├── App.css               # App styles
│   └── index.js              # React root
├── package.json
└── README.md
```

## Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` directory.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

**Microphone not working?**
- Check browser microphone permissions
- Ensure HTTPS is used in production (required for getUserMedia)

**Audio not downloading?**
- Verify browser allows file downloads
- Check browser console for errors

**Connection to backend failing?**
- Ensure backend is running on port 5000
- Check for CORS issues
- Verify the API endpoint matches

## Tech Stack

- React 18
- Web Audio API
- Fetch API
- CSS3

## License

MIT
