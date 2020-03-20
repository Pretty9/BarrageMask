let video = document.querySelector('#main-video');
// video.setAttribute('crossOrigin', 'anonymous');

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let mCanvas = document.createElement('canvas');
let mCtx = mCanvas.getContext('2d');

[canvas.width, canvas.height] = [video.width, video.height];
[mCanvas.width, mCanvas.height] = [video.width, video.height];

let mask = document.querySelector('#mask-video');
// mask.setAttribute('crossOrigin', 'anonymous');

let playBtn = document.querySelector("#play");
playBtn.setAttribute('class', 'btn btn-info');

let play = false;
let task, alignTask;

let barrages = new Array();

let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop("0", "magenta");
gradient.addColorStop("0.5", "blue");
gradient.addColorStop("1.0", "red");
ctx.fillStyle = gradient;
ctx.font = "20px Verdana";


class Barrage {
    constructor(content, height, position) {
        this.position = position;
        this.content = content;
        this.height = height;
        this.cur = position;
    }
}

(function() {
    barrages.push(new Barrage('我是测试弹幕A', 100, 1000));
    barrages.push(new Barrage('我是测试弹幕B', 120, 1500));
    barrages.push(new Barrage('我是测试弹幕C', 160, 1200));
    barrages.push(new Barrage('我是测试弹幕D', 180, 1800));
    barrages.push(new Barrage('我是测试弹幕E', 200, 1600));
    barrages.push(new Barrage('我是测试弹幕F', 250, 2000));
    barrages.push(new Barrage('我是测试弹幕G', 280, 1300));
    barrages.push(new Barrage('我是测试弹幕H', 320, 1400));
    barrages.push(new Barrage('我是测试弹幕I', 380, 1800));
    barrages.push(new Barrage('我是测试弹幕J', 400, 1000));
    barrages.push(new Barrage('我是测试弹幕K', 420, 2000));
    barrages.push(new Barrage('我是测试弹幕L', 300, 2200));
    barrages.push(new Barrage('我是测试弹幕M', 140, 1700));
    barrages.push(new Barrage('我是测试弹幕N', 220, 1900));
    barrages.push(new Barrage('我是测试弹幕O', 310, 1100));
    barrages.push(new Barrage('我是测试弹幕P', 360, 900));
})();

function drawBarrage(ctx) {
    barrages.forEach((v) => {
        if(v.cur < 0) {
            v.cur = v.position;
        }
        v.cur = v.cur - 15;
        ctx.fillText(v.content, v.cur, v.height);
    });
}

function drawMask(ctx) {
    // ctx.drawImage(mask, 0, 0);
    mCtx.clearRect(0, 0, canvas.width, canvas.height);
    mCtx.drawImage(mask, 0, 0);

    let cData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let mData = mCtx.getImageData(0, 0, canvas.width, canvas.height);

    let pxCount = mData.data.length / 4;
    for(let i = 0; i < pxCount; i++) {
        if(mData.data[(i << 2) + 3] == 0) {
            cData.data[(i << 2) + 3] = 0;
        }
    }
    ctx.putImageData(cData, 0, 0);

}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBarrage(ctx);
    drawMask(ctx);
}

function startTask() {
    return setInterval(draw, 50);
}

function stopTask(task) {
    clearInterval(task);
}

function alignMask() {
    return setInterval(function() {
        let vTime = video.currentTime;
        let mTime = mask.currentTime - 0.2;
        if(Math.abs(vTime - mTime) > 0.1) {
            mask.currentTime = video.currentTime + 0.2;
        }
    }, 500);
}


video.addEventListener('play', function () {
    console.log('play');
    mask.play();
    task = startTask();
    alignTask = alignMask();

    playBtn.textContent = '暂停';
});

video.addEventListener('pause', function() {
    console.log('pause');
    mask.pause();
    stopTask(task);
    stopTask(alignTask);

    playBtn.textContent = '播放';
});


canvas.onclick = playBtn.onclick = function() {
    if(video.paused){
        video.play();
        mask.play();
    } else {
        video.pause();
        mask.pause();
    }
}

