import React, { useState, useRef } from 'react';
import './Recorder.css';

function Recorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const chunksRef = useRef([]);

  const RECORDING_DURATION = 10; // 10 seconds

  const startRecording = async () => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup audio context for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setRecordedAudio(blob);
        onRecordingComplete(blob);

        // Stop all audio streams
        streamRef.current.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      visualize();

      // Auto-stop after 10 seconds
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev + 1 >= RECORDING_DURATION) {
            clearInterval(timerIntervalRef.current);
            mediaRecorder.stop();
            setIsRecording(false);
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            return RECORDING_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    setRecordingTime(0);
    onRecordingComplete(null);
  };

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame(visualize);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(102, 126, 234)';

    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }

    animationFrameRef.current = requestAnimationFrame(visualize);
  };

  const playRecordedAudio = () => {
    if (recordedAudio) {
      const url = URL.createObjectURL(recordedAudio);
      const audio = new Audio(url);
      audio.play();
    }
  };

  const downloadRecording = () => {
    if (recordedAudio) {
      const url = URL.createObjectURL(recordedAudio);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'voice_sample.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="recorder">
      {/* Canvas for waveform visualization */}
      {isRecording && (
        <canvas ref={canvasRef} className="waveform-canvas"></canvas>
      )}

      {/* Recording Status */}
      {isRecording && (
        <div className="recording-status">
          <div className="recording-indicator"></div>
          <span className="recording-text">Recording...</span>
          <span className="recording-time">
            {String(recordingTime).padStart(2, '0')}:{String(
              RECORDING_DURATION - recordingTime
            ).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="button-group">
        {!isRecording ? (
          <button
            className="btn btn-primary"
            onClick={startRecording}
            disabled={recordedAudio !== null}
          >
            Record Voice Sample
          </button>
        ) : (
          <button className="btn btn-danger" onClick={stopRecording}>
            Stop Recording
          </button>
        )}
      </div>

      {/* Recorded Audio Preview */}
      {recordedAudio && (
        <div className="recorded-preview">
          <div className="preview-info">
            <p className="preview-label">Voice sample recorded (10s)</p>
          </div>
          <div className="preview-controls">
            <button className="btn btn-secondary" onClick={playRecordedAudio}>
              Play
            </button>
            <button className="btn btn-secondary" onClick={downloadRecording}>
              Download
            </button>
            <button className="btn btn-warning" onClick={resetRecording}>
              Re-record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recorder;
