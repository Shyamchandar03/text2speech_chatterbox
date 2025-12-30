import torchaudio as ta
import torch
from chatterbox.tts_turbo import ChatterboxTurboTTS

# Load the Turbo model
model = ChatterboxTurboTTS.from_pretrained(device="cpu")

# Generate with Paralinguistic Tags
text = "Hi there, Prasath how is your health"

# Generate audio (requires a reference clip for voice cloning)
wav = model.generate(text, audio_prompt_path="./Shyam.wav")

ta.save("test-turbo.wav", wav, model.sr)