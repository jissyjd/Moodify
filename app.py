from flask import Flask, render_template, request

app = Flask(__name__)

# Intentionally WRONG/FUNNY songs for each mood
songs = {
    "happy": [
        "Sad Violin – Emotional Version",
        "Crying in the Rain – Slow Mix",
        "Very Sad Piano – 10 Hour Version"
    ],

    "sad": [
        "Crazy Party Dance Mix",
        "Baby Shark – Party Version",
        "Celebration Dance – DJ Mix"
    ],

    "angry": [
        "Cute Baby Lullaby",
        "Soft Romantic Piano",
        "Calm Meditation Music"
    ],

    "romantic": [
        "Gym Workout Motivation",
        "Heavy Metal Workout Mix",
        "Angry Boss Battle Music"
    ],

    "tired": [
        "Ultra Fast EDM Party",
        "Morning Alarm Remix",
        "Crazy Dance Challenge Mix"
    ]
}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/play", methods=["POST"])
def play():
    mood = request.form.get("mood")

    if mood in songs:
        import random
        song = random.choice(songs[mood])
    else:
        song = "Thalathiri has no idea what you're feeling 😂"

    return render_template(
        "index.html",
        selected_mood=mood,
        song=song
    )


if __name__ == "__main__":
    app.run(debug=True)