Uint8Array.prototype.average = function () {
    return this.reduce((a,b) => a+b, 0) / this.length;
}

export function startRecording() {
    const volumeWrapper = {
        volume: 0
    };
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({
                audio: true
            },
            function (stream) {
                const audioContext = new AudioContext()
                await audioContext.audioWorklet.addModule('https://codepen.io/forgived/pen/PoZQzWP.js')
                let microphone = audioContext.createMediaStreamSource(stream)
        
                const node = new AudioWorkletNode(audioContext, 'vumeter')
                node.port.onmessage  = event => {
                    let _volume = 0
                    let _sensibility = 5
                    if (event.data.volume)
                        _volume = event.data.volume;
                    volumeWrapper.volume = ((_volume * 100) / _sensibility)
                }
                microphone.connect(node).connect(audioContext.destination)
            },
            function (err) {
                console.log("The following error occured: " + err.name)
            });
    } else {
        console.log("getUserMedia not supported");
    }
    return volumeWrapper;
}
