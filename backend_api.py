from flask import Flask, request, send_file
from flask_cors import CORS
import torch
import torchaudio as ta
from chatterbox.tts_turbo import ChatterboxTurboTTS
import os
from io import BytesIO

app = Flask(__name__)
CORS(app)

# Initialize the model on startup
print("Loading Chatterbox TurboTTS model...")
device = "cuda" if torch.cuda.is_available() else "cpu"
model = ChatterboxTurboTTS.from_pretrained(device=device)
print(f"Model loaded on device: {device}")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return {'status': 'ok', 'device': device}, 200

@app.route('/generate', methods=['POST'])
def generate_voice():
    """
    Generate voice from audio sample and text
    
    Expected FormData:
    - audio: WAV file (voice sample)
    - text: string (text to convert)
    """
    try:
        # Check if audio file is present
        if 'audio' not in request.files:
            return {'error': 'No audio file provided'}, 400
        
        audio_file = request.files['audio']
        text_input = request.form.get('text', '')

        if not text_input.strip():
            return {'error': 'No text provided'}, 400

        if audio_file.filename == '':
            return {'error': 'No audio file selected'}, 400

        # Save uploaded audio to temporary location
        temp_audio_path = '/tmp/uploaded_audio.wav'
        audio_file.save(temp_audio_path)

        # Generate voice using the model
        print(f"Generating voice for text: {text_input}")
        generated_wav = model.generate(text_input, audio_prompt_path=temp_audio_path)

        # Convert to bytes for response
        output = BytesIO()
        ta.save(output, generated_wav, model.sr, format='wav')
        output.seek(0)

        # Clean up temporary file
        if os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

        return send_file(
            output,
            mimetype='audio/wav',
            as_attachment=True,
            download_name='generated_voice.wav'
        )

    except Exception as e:
        print(f"Error generating voice: {str(e)}")
        return {'error': f'Failed to generate voice: {str(e)}'}, 500

@app.route('/config', methods=['GET'])
def config():
    """Get server configuration"""
    return {
        'device': device,
        'model': 'ChatterboxTurboTTS',
        'max_text_length': 500,
        'audio_format': 'wav',
        'sample_duration': 10
    }, 200

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
