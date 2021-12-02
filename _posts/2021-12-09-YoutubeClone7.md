---
layout: post
title: Youtube Clone 7
date: Thu Dec  2 13:38:18 JST 2021
categories: Nodsjs
tag:
toc: true
---
## 11 VIDEO PLAYER

### 11.0 Player Setup
지금까지 우리는 브라우저에서 기본 제공하는 비디오 플레이어를 사용했다. 나쁘진 않지만, 다른 스타일을 적용할 수가 없다. 그러므로 직접 비디오 플레이어를 만들어서 스타일을 적용시키겠다.

잠시 Webpack 코드를 기억해보자. 우리가 만든 main.js의 코드는 현재 base.pug에서 불러오고 있다. 그러므로 모든 페이지에서 자바스크립트 코드를 가져다 쓰고 있다. 그런데 비디오 플레이어 코드를 만든다면, 모든 페이지에서 불러오게 된다. 하지만 비디오 플레이어 코드는 비디오가 동작하는 곳에서만 필요한 코드이므로 이는 낭비다. 그러므로 다른 자바스크립트 파일을 만들어서 필요한 페이지에만 로드해야 한다.

지금 webpack.config.js 파일을 보면 하나의 entry 뿐이지만 이는 바꿀 수 있다. 그전에 src/client/js/videoPlayer.js 파일을 만든다. 그리고 이 파일을 webpack.config.js에서 불러와야 한다. webpack.config.js 파일에서 코드를 아래처럼 수정한다.

```
// webpack.config.js

module.exports = {
    entry: {
        main: "./src/client/js/main.js",
        // add videoPlayer here
        videoPlayer: "./src/client/js/videoPlayer.js",
    },
    ...
}
```

하지만 이렇게만 수정하면 output에서 filename을 하나로 지정해줬기 때문에, 파일이 합쳐지게 된다. 그러므로 생성되는 파일을 이름으로 나눠야 하는데, filename에 옵션을 주는 것으로 이를 고칠 수 있다. Webpack에서 `[name]`을 적어주면 entry에 있는 파일 이름을 가져가서 만들어준다. 그러므로 코드는 아래처럼 작성하면 된다.

```
// webpack.config.js

module.exports = {
    ...
    output: {
        filename: "js/[name].js",
        ...
    }
}
```

이제 비디오 플레이어가 필요한 파일에서 불러와줘야 한다. 그런데 base.pug를 보면 별도로 자바스크립트 코드를 넣을 블록을 만들어주지 않았다. 그러므로 제일 마지막 줄에 `block scripts`로 블록을 하나 만들어 준다.

```
// base.pug
...
    block scripts
```

그리고 watch.pug에 가서 자바스크립트 파일을 넣어준다.

```
// watch.pug

block scripts
    script(src="/assets/js/videoPlayer.js")
```

그리고 코드를 만들기 전에 watch.pug의 다른 코드들은 주석처리해주겠다.

```
// watch.pug
block content
    video(src="/" + video.fileUrl, controls)
    //
        div 
            p=video.description
            small=video.createdAt 
            small Uploaded by 
                a(href=`/users/${video.owner._id}`)=video.owner.name 
        if String(video.owner._id) === String(loggedInUser._id)
            a(href=`${video.id}/edit`) Edit Video &rarr;
            br
            a(href=`${video.id}/delete`) Delete Video &rarr;
    script(src="/assets/js/videoPlayer.js")
```

이제 자바스크립트 코드를 만들 준비가 다 되었다.

### 11.1 Play Pause
우선 필요할 것 같은 버튼과 기능을 모두 만들어준다.

```
// watch.pug
block content
    video(src="/" + video.fileUrl, controls)
    div
        button#play Play
        button#mute Mute
        div
            span#currentTime 00:00
            span  / 
            span#totalTime 00:00
        input(type="range", step="0.1", value=0.5, min="0", max = "1")#volume
```

그런데 css 때문에 input이 지나치게 크게 나온다. 그래서 forms.scss도 조금 수정해줘야 한다.

```
// form.scss
input:not(input[type="range"]) {
    ...
}
```

이제 비디오 플레이어에 쓰일 버튼을 만들어보자. 비디오나 버튼은 getElementById()로 간단히 가져올 수 있다. 다음으로 이들을 다룰 함수를 만드는 것이다. 우선은 Play 버튼을 누르면 비디오가 재생되고 꺼지게 하려고 한다. 이때, 필요한 것이 어떻게 미디어를 다룰지다. [HTMLMediaElement](https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement)를 보면 .paused로 미디어의 일시 정지 여부를 알 수 있다고 나와 있다. 그러므로 video.paused의 결과에 따라 비디오를 재생시키거나 멈추면 된다. 비디오를 재생시키거나 정지시키려면 video.play(), video.pause()를 사용하면 된다.

```
// videoPlayer.js
const video = document.getElementById("video")
const playBtn = document.getElementById("play")
const muteBtn = document.getElementById("mute")
const time = document.getElementById("time")
const volume = document.getElementById("volume")

const handlePlayClick = (e) => {
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

play.addEventListener("click", handlePlayClick);
```

그런데 버튼을 누르면 버튼 안의 글자도 바뀌어야 한다. if, else에 각각 `playBtn.innerText = "Pause"`, `playBtn.innerText = "Play"`를 적어줘도 괜찮지만 따로 다루는 함수를 addEventListener로 추가해줘도 괜찮다.

```
// videoPlayer.js
const video = document.getElementById("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");

const handlePlayClick = (e) => {
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
};

const handlePause = () => (playBtn.innerText = "Play");

const handlePlay = () => (playBtn.innerText = "Paused);

playBtn.addEventListener("click", handlePlayClick);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
```

### 11.2 Mute and Unmute
음소거 버튼을 만들어주려고 하는데, 이 경우 음량을 나타내는 input의 값도 같이 조정해줘야 한다. 앞서 살펴본 페이지를 보면 .muted로 음소거 여부를 정할 수 있다고 나온다. 특이한 점은 앞서 play, pause 처럼 함수로 만들지 않았다는 점인데, 그 이유는 모르겠다. 어쨌거나, .muted를 true, false로 음소거 하도록 함수를 만들어서 추가했다. 

```
// videoPlayer.js
const handleMute = (e) => {
    if(video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    } else {
        video.muted = true;
        muteBtn.innerText = "Unmute";
    }
};
...
muteBtn.addEventListener("click", handleMute);
```

그런데 코드에 겹치는 부분이 너무 많다. 위를 삼항 연산자로 간단하게 바꿀 수 있다.

```
// videoPlayer.js
const handleMute = (e) => {
    if(video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? : "Unmute" : "Mute";
};
```

마찬가지로 play, pause 시에 innerText가 바뀌는 것을 아래처럼 코드를 줄일 수 있다.

```
// videoPlayer.js
const handlePlayClick = (e) => {
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Paused" : "Play";
};

const handleMute = (e) => {
    if(video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? : "Unmute" : "Mute";
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
```

이제 muteBtn과 음량을 연결시켜주면 된다.

```
// videoPlayer.js
const handleMute = (e) => {
    if(video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? : "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : 0.5;
};
```

이렇게 하고 Mute 버튼을 누르면 볼륨도 같이 조정된다. 하지만 아직 해야 할 일이 2가지가 있다. 우선 음소거 해제 시에 원래 음량으로 돌아가야 하고, 또 볼륨을 드래그하면 자동으로 음소거가 해제 되어야 한다.

### 11.3 Volume
우리가 만든 볼륨은 장식일 뿐 아무런 일도 하지 않는다. 볼륨을 바꾸면 video에 연결된 볼륨을 바꿔주기 위해 함수를 만들어준다. 그리고 event를 출력해 무엇이 나오는지 확인해보자.

```
// videoPlayer.js
const handleVolumeChange = (event) => {
    console.log(event);
}

volumeRange.addEventListener("change", handleVolumeChange);
```

그런데 볼륨을 확인해보면 버튼을 움직일 때 반응하는 것이 아니라, 버튼을 놓을 때 반응한다. 동영상 플레이어는 음량 조절이 실시간으로 진행되어야 하므로 이는 우리가 원하던 일이 아니다. 

[range](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range)를 확인해보면 events가 change 외에도 input이 있다. 함수의 이벤트를 input으로 바꾼 다음에 볼륨 조절을 해보면 우리가 원하던 기능이 input임을 확인할 수 있다.

```
// videoPlayer.js
volumeRange.addEventListener("input", handleVolumeChange);
```

event를 확인해보면 볼륨이 event.target.value로 나온다. 이제 이 값으로 video의 볼륨을 조절하도록 함수를 수정해주자.

```
// videoPlayer.js
const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    video.volume = value;
}
```

이제 컨트롤러를 움직이면 mute 상태가 해제되도록 코드를 추가한다.

```
// videoPlayer.js
const handleVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    if(video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    video.volume = value;
}
```

그런데 페이지에 처음 들어왔을 때, 볼륨 버튼과 비디오 볼륨이 연결되지 않은 상태다. 볼륨 버튼의 기본값은 0.5이므로 처음 페이지에 들어왔을 때, 볼륨을 0.5로 바꿔줘야 한다. 또한 음소거 상태를 해제했을 때, 원래 볼륨으로 돌아가게 만들어줘야 한다. 그러므로 볼륨을 하나의 변수로 만들어서 바뀔 때마다 업데이트 해주도록 한다.

```
// videoPlayer.js
let volumeValue = 0.5;
video.volume = volumeValue

const handleMuteClick = (e) => {
    ...
    volumeRange.value = video.muted ? 0 " volumeValue;
};

const handleVolumeChange = (event) => {
    ...
    volumeValue = value;
    video.volume = value;
}
```

### 11.4 Duration and Current Time
[HTMLMediaElement](https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement)를 확인하면 loadedmetadata가 있다. 이름 그대로 비디오의 메타 데이터가 로드 될 때, 실행되는 이벤트다. 이를 사용해 시간이 바뀔때, 업데이트 하는 함수를 만들 수 있다.

```
// videoPlayer.js

const handleLoadedMetadata (e) => {
    
};

video.addEventListener("loadedmetadata", handleLoadedMetadata);
```