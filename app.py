from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/result")
def result():
    songs = {
        "happy": ("😊 HAPPYYYYY", "/static/audio/happy.mp3"),
        "sad": ("🌧️ SADDDDD", "/static/audio/sad.mp3"),
        "angry": ("🔥 ANGRYYYY", "/static/audio/angry.mp3"),
        "romantic": ("❤️ ROMANTIC", "/static/audio/romantic.mp3"),
        "tired": ("😴 TIREDDDD", "/static/audio/tired.mp3")
    }
    mood = request.args.get("mood", "unknown")
    title, audio = songs.get(mood, ("Mood not detected", ""))
    return render_template("result.html", mood=mood, song=title, audio=audio)


if __name__ == "__main__":
    app.run(debug=True)