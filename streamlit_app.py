from pathlib import Path

import streamlit as st


ROOT = Path(__file__).parent
AUDIO_DIR = ROOT / "static" / "audio"
STYLE_PATH = ROOT / "static" / "style.css"

MOOD_SONGS = {
    "Happy": ("😊 HAPPYYYY", "happy.mp3"),
    "Sad": ("🌧️ SAAADDDDD", "sad.mp3"),
    "Angry": ("🔥 ANGRYYYYY", "angry.mp3"),
    "Romantic": ("❤️ ROMANTIC", "romantic.mp3"),
    "Tired": ("😴 TIREDDDDD", "tired.mp3"),
}

st.set_page_config(page_title="Moodify", page_icon="🎵", layout="centered")

base_css = STYLE_PATH.read_text(encoding="utf-8")
streamlit_css = """
.stApp { background: linear-gradient(135deg, #171044, #3b176d, #5b21b6, #24105c); color: white; }
[data-testid="stHeader"] { background: transparent; }
[data-testid="stToolbar"] { display: none; }
.block-container { max-width: 900px; padding-top: 3rem; }
.stButton > button { min-width: 150px; min-height: 50px; border: 1px solid rgba(255,255,255,.24); border-radius: 20px; background: rgba(255,255,255,.15); color: white; font-weight: bold; }
.stButton > button:hover { color: white; border-color: rgba(255,255,255,.5); background: rgba(255,255,255,.28); }
"""
st.markdown(f"<style>{base_css}{streamlit_css}</style>", unsafe_allow_html=True)

st.markdown(
    """
    <div class="container">
        <h1>🎵 MOODIFY 🎵</h1>
        <p class="subtitle">Perfect song for your perfect mood 😂</p>
        <h2>📷 Camera</h2>
    </div>
    """,
    unsafe_allow_html=True,
)

camera_image = st.camera_input("Capture your mood")

if camera_image:
    st.image(camera_image, caption="Camera capture", use_container_width=True)
    mood = st.selectbox("Detected mood", list(MOOD_SONGS))

    if st.button("Detect Mood", type="primary"):
        title, filename = MOOD_SONGS[mood]
        audio_path = AUDIO_DIR / filename
        st.markdown(
            f'<section class="result is-visible"><div class="popup-icon">🤪</div>'
            f'<h2>MOODIFY DECIDED!</h2><p>Detected mood:</p><p>{mood}</p></section>',
            unsafe_allow_html=True,
        )
        st.markdown(
            f'<section class="song"><h2>🎶 Song for your mood</h2>'
            f'<p>{title}</p><p>🎧 Playing the song for your detected mood</p></section>',
            unsafe_allow_html=True,
        )
        if audio_path.exists():
            st.audio(audio_path.read_bytes(), format="audio/mpeg", autoplay=True)
        else:
            st.error(f"Missing audio file: {audio_path}")
else:
    st.info("Allow camera access and capture a photo to continue.")