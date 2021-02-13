
export function startRecording() {
    var volumeWrapper ={
        volume: 0,
        rollingAverage: 0
    }
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({
                audio: true
            },
            function (stream) {
                let audioContext = new AudioContext();
                let analyser = audioContext.createAnalyser();
                let microphone = audioContext.createMediaStreamSource(stream);
                let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

                analyser.smoothingTimeConstant = 0.8;
                analyser.fftSize = 1024;

                microphone.connect(analyser);
                analyser.connect(javascriptNode);
                javascriptNode.connect(audioContext.destination);

                javascriptNode.onaudioprocess = function () {
                    var array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    var values = 0;

                    var length = array.length;
                    for (var i = 0; i < length; i++) {
                        values += (array[i]);
                    }

                    var average = values / length;

                    volumeWrapper.volume = Math.round(average);
                    volumeWrapper.rollingAverage = volumeWrapper.rollingAverage *9/10 + 1/10 * volumeWrapper.volume;

                } // end fn stream
            },
            function (err) {
                console.log("The following error occured: " + err.name)
            });
    } else {
        console.log("getUserMedia not supported");
    }
    return volumeWrapper;
}