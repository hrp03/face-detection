const videoElement = document.getElementById("video");

// create video event

videoElement.addEventListener("play", detectFace);

// Load face api

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
]).then(startVideo);

function startVideo() {

    navigator.getUserMedia(
        // constraint
        {
            video: true,
            audio: false
        },
        // success
        function(stream) {
            videoElement.srcObject = stream;
        },

        //error
        function(error) {

            if (error) {
                alert("This app need permission to access video");
            }

        }
    )
}

function detectFace() {

    const canvasSize = { width: videoElement.width, height: videoElement.height };
    const canvas = faceapi.createCanvasFromMedia(videoElement);
    const context = canvas.getContext("2d");

    document.body.appendChild(canvas);

    faceapi.matchDimensions(canvas, canvasSize);

    setInterval(async function() {

        const detections = await faceapi.detectAllFaces(
            videoElement,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions();

        const resizeResult = faceapi.resizeResults(detections, canvasSize);
        context.clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resizeResult);
        faceapi.draw.drawFaceLandmarks(canvas, resizeResult);
        faceapi.draw.drawFaceExpressions(canvas, resizeResult);


    }, 100);
}

function drawFace() {

}