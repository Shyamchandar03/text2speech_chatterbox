# Chatterbox Voice Cloning - Full Stack Setup Guide

## 📋 Project Overview

This is a full-stack voice cloning application built with:
- **Backend**: Flask API + ChatterboxTurboTTS
- **Frontend**: React + Web Audio API
- **Audio Processing**: PyTorch + torchaudio

## 🚀 Quick Start

### 1. Backend Setup

#### Prerequisites
- Python 3.8+
- CUDA 11.8+ (optional, for GPU acceleration)

#### Installation

```bash
# Navigate to project root
cd text2speech_chatterbox

# Create a virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install required packages
pip install flask flask-cors torch torchaudio chatterbox-tts-turbo
```

#### Running the Backend

```bash
# Make sure virtual environment is activated
python backend_api.py
```

You should see:
```
Loading Chatterbox TurboTTS model...
Model loaded on device: cuda (or cpu)
 * Running on http://0.0.0.0:5000
```

### 2. Frontend Setup

#### Prerequisites
- Node.js 16+ 
- npm or yarn

#### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will automatically open at `http://localhost:3000`

## 🔗 API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok", "device": "cuda/cpu" }
```

### Configuration
```
GET /config
Response: {
  "device": "cuda/cpu",
  "model": "ChatterboxTurboTTS",
  "max_text_length": 500,
  "audio_format": "wav",
  "sample_duration": 10
}
```

### Generate Voice
```
POST /generate
FormData:
  - audio: WAV file (required)
  - text: string (required, max 500 chars)

Response: WAV audio file
```

## 📁 Project Structure

```
text2speech_chatterbox/
├── app.py                    # Original demo script
├── backend_api.py            # Flask API server
├── Shyam.wav                 # Reference voice sample
├── venv/                     # Python virtual environment
├── frontend/                 # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Recorder.jsx
│   │   │   ├── TextInput.jsx
│   │   │   ├── AudioPlayer.jsx
│   │   │   └── Loader.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   └── README.md
└── SETUP.md                  # This file
```

## 🎯 Usage Workflow

1. **Start Backend**
   ```bash
   python backend_api.py
   ```

2. **Start Frontend** (in another terminal)
   ```bash
   cd frontend
   npm start
   ```

3. **In the Browser**
   - Click "Record Voice Sample" 
   - Allow microphone access
   - Record your voice (10 seconds)
   - Enter text to convert
   - Click "Generate Voice"
   - Play or download the result

## ⚙️ Configuration

### Backend Configuration

Edit `backend_api.py` to customize:

```python
# Change port
app.run(debug=True, port=5000)

# Device selection
device = "cuda" if torch.cuda.is_available() else "cpu"
```

### Frontend Configuration

Edit `frontend/src/App.jsx` to change API endpoint:

```javascript
const response = await fetch('http://localhost:5000/generate', {
  method: 'POST',
  body: formData,
});
```

## 🐛 Troubleshooting

### Issue: "Torch not compiled with CUDA enabled"
**Solution**: The app will automatically fall back to CPU. Install CPU-only PyTorch if needed:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

### Issue: Microphone permission denied
**Solution**: 
- Check browser settings for microphone permissions
- Use HTTPS in production (required by Web Audio API)
- Enable camera/microphone in browser settings

### Issue: CORS error connecting frontend to backend
**Solution**:
- Ensure backend is running on port 5000
- Check that Flask-CORS is installed
- Verify API endpoint URL in App.jsx

### Issue: "Model not found" error
**Solution**:
```bash
# Reinstall chatterbox package
pip install --upgrade chatterbox-tts-turbo
```

### Issue: Out of memory on GPU
**Solution**:
```python
# Edit backend_api.py to use CPU
device = "cpu"  # Force CPU usage
```

## 📦 Dependencies

### Backend
- flask==2.3.0+
- flask-cors==4.0.0+
- torch==2.0.0+
- torchaudio==2.0.0+
- chatterbox-tts-turbo (latest)

### Frontend
- react==18.2.0+
- react-dom==18.2.0+

## 🔐 Security Notes

1. **In Production**:
   - Set `FLASK_ENV=production`
   - Disable `debug=True`
   - Use proper CORS configuration
   - Implement rate limiting
   - Add authentication if needed

2. **File Uploads**:
   - Validate file type before processing
   - Set max file size limits
   - Clean up temporary files

## 📊 Performance Tips

1. **GPU Optimization**:
   - Use CUDA-enabled PyTorch for 10x+ speedup
   - Ensure GPU has enough memory
   - Batch multiple requests if possible

2. **Memory Management**:
   - Close unused browser tabs
   - Clear cache periodically
   - Monitor GPU/RAM usage

3. **Network Optimization**:
   - Use compression for larger audio files
   - Consider CDN for static assets
   - Implement request timeout

## 🚀 Deployment

### Deploy Backend to Cloud

**Heroku Example**:
```bash
# Create Procfile
echo "web: python backend_api.py" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

**Docker Example**:
```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "backend_api.py"]
```

### Deploy Frontend to Cloud

**Vercel**:
```bash
cd frontend
npm install -g vercel
vercel
```

**Netlify**:
```bash
cd frontend
npm run build
netlify deploy --prod --dir=build
```

## 📝 API Testing

### Using cURL

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test voice generation
curl -X POST http://localhost:5000/generate \
  -F "audio=@Shyam.wav" \
  -F "text=Hello world" \
  --output result.wav
```

### Using Python

```python
import requests

response = requests.post(
    'http://localhost:5000/generate',
    files={'audio': open('Shyam.wav', 'rb')},
    data={'text': 'Hello world'}
)

with open('result.wav', 'wb') as f:
    f.write(response.content)
```

## 📞 Support

For issues with:
- **ChatterboxTurboTTS**: See [documentation](https://github.com/chatterbox/docs)
- **PyTorch**: See [PyTorch docs](https://pytorch.org/docs)
- **React**: See [React docs](https://react.dev)

## 📄 License

This project uses ChatterboxTurboTTS. Refer to their licensing terms.

---

**Last Updated**: December 2025
