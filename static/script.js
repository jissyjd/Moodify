const video = document.getElementById("camera");
const startCamera = document.getElementById("startCamera");

startCamera.addEventListener("click", async () => {

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;

    } catch (error) {
        alert("Camera access denied or unavailable.");
        console.error(error);
    }

});