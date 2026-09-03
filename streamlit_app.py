from pathlib import Path

import streamlit as st


ROOT = Path(__file__).parent
AUDIO_DIR = ROOT / "static" / "audio"

MOOD_SONGS = {
    "Happy": ("😊 Arabic Kuthu - Beast", "happy.mp3"),
    "Sad": ("🌧️ Kanave Unai - Kannum Kannum Kollaiyadithaal", "sad.mp3"),
    "Angry": ("🔥 Aaluma Doluma - Vedalam", "angry.mp3"),
    "Romantic": ("❤️ Munbe Vaa - Sillunu Oru Kadhal", "romantic.mp3"),
    "Tired": ("😴 Vaseegara - Minnale", "tired.mp3"),
}

st.set_page_config(page_title="Moodify", page_icon="🎵", layout="centered")

st.title("🎵 MOODIFY 🎵")
st.caption("Capture your face and choose the mood that best matches your expression.")

camera_image = st.camera_input("📷 Camera")

if camera_image:
    st.image(camera_image, caption="Camera capture", use_container_width=True)
    mood = st.selectbox("Detected mood", list(MOOD_SONGS))

    if st.button("🎶 Play mood song", type="primary"):
        title, filename = MOOD_SONGS[mood]
        audio_path = AUDIO_DIR / filename
        st.success(f"Detected mood: {mood}")
        st.subheader(title)

        if audio_path.exists():
            st.audio(audio_path.read_bytes(), format="audio/mpeg", autoplay=True)
        else:
            st.error(f"Missing audio file: {audio_path}")
else:
    st.info("Allow camera access and capture a photo to continue.")