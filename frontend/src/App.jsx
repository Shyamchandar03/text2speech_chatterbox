import React, { useState } from 'react';
import Recorder from './components/Recorder';
import TextInput from './components/TextInput';
import AudioPlayer from './components/AudioPlayer';
import Loader from './components/Loader';
import './App.css';

function App() {
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleGenerateVoice = async () => {
    if (!recordedAudio) {
      setError('Please record a voice sample first');
      return;
    }

    if (!textInput.trim()) {
      setError('Please enter text to convert');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('audio', recordedAudio, 'voice_sample.wav');
      formData.append('text', textInput);

      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const blob = await response.blob();
      setGeneratedAudio(blob);
      setSuccess('Voice generated successfully!');
    } catch (err) {
      setError(err.message || 'An error occurred while generating voice');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1 className="title">Voice Cloning</h1>
          <p className="subtitle">Clone any voice in seconds</p>
        </div>

        {/* Main Content */}
        <div className="content-grid">
          {/* Left Section - Input */}
          <div className="section">
            {/* Voice Recorder */}
            <div className="card">
              <h2 className="card-title">Voice Sample</h2>
              <Recorder onRecordingComplete={setRecordedAudio} />
            </div>

            {/* Text Input */}
            <div className="card">
              <h2 className="card-title">Text Input</h2>
              <TextInput value={textInput} onChange={setTextInput} />
            </div>

            {/* Generate Button */}
            <button
              className="generate-button"
              onClick={handleGenerateVoice}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Voice'}
            </button>
          </div>

          {/* Right Section - Output */}
          <div className="section">
            {/* Messages */}
            {error && <div className="message error-message">{error}</div>}
            {success && <div className="message success-message">{success}</div>}

            {/* Loader */}
            {loading && <Loader />}

            {/* Audio Player */}
            {generatedAudio && !loading && (
              <div className="card">
                <h2 className="card-title">Generated Voice</h2>
                <AudioPlayer audioBlob={generatedAudio} />
              </div>
            )}

            {/* Placeholder */}
            {!generatedAudio && !loading && (
              <div className="placeholder-card">
                <p>Your generated voice will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
