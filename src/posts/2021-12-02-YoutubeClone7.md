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
        input(type="range", step="0.1", value=0.5, min="0", max = "1")#volume
        div
            span#currentTime 00:00
            span  / 
            span#totalTime 00:00
        div
            input(type="range", step="1", value=0, min="0")#timeline
        div
            button#fullscreen Enter Full Screen
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
    muteBtn.innerText = video.muted ? : "Mute" : "Unmute";
    volumeRange.value = video.muted ? 0.5 : 0;
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
[HTMLMediaElement](https://developer.mozilla.org/ko/docs/Web/API/HTMLMediaElement)를 확인하면 loadedmetadata가 있다. 이름 그대로 비디오의 메타 데이터가 로드 될 때, 실행되는 이벤트다. addEventListener과 함께 사용하면 메타 데이터가 불러와질 때마다 함수가 작동되도록 할 수 있다. 다음으로 .duration은 미디어의 전체 길이를 초 단위로 double 값으로 반환한다. 이 둘을 같이 사용하면 페이지가 불러와질 때, 다시 말해 메타 데이터가 호출될 때, 미디어의 길이를 불러오게 된다. 코드로 작성하면 아래처럼 된다.

```
// videoPlayer.js

const handleLoadedMetadata = (e) => {
    totalTime.innerText = video.duration;
};
...
video.addEventListener("loadedmetadata", handleLoadedMetadata);
```

그런데 앞서 말했듯이 .duration 속성은 double로 값을 반환한다. 그러므로 floor를 사용해서 초 단위로 만들어준다.

```
// videoPlayer.js

const handleLoadedMetadata = (e) => {
    totalTime.innerText = Math.floor(video.duration);
};
...
video.addEventListener("loadedmetadata", handleLoadedMetadata);
```

다음으로 재생 시간을 만들어보자. 재생 시간은 비디오가 1초 재생될 때마다 업데이트 되어야 한다. 그리고 다른 시간을 눌렀을 때도 재생 시간이 바뀌어야 한다. 이벤트를 보면 timeupdate가 있는데, .currentTime 속성이 바뀔 때마다 실행된다. 여기서 .currentTime 속성은 현재 재생 시점을 double로 표현한 값으로, 앞의 .duration과 달리 재생 시점을 변경하는데도 사용할 수 있다. handleTimeUpdate 함수를 timeupdate 이벤트로 만들어주자.

```
// videoPlayer.js

const handleLoadedMetadata = (e) => {
    totalTime.innerText = Math.floor(video.duration);
};

const handleTimeUpdate = (e) => {
    currentTime.innerText = Math.floor(video.currentTime);
};
...
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
```

### 11.5 Time Formatting
우리가 만든 비디오 시간은 단순히 숫자일 뿐, 시간을 표현하는 형태가 아니다. 그러므로 숫자를 시간을 표시하도록 형태를 바꿔줘야 한다. 예를 들어서 25를 00:00:25로 바꿔줘야 한다.

우선 간단한 방법을 알아보자. Date()는 함수로 사용하면 현재 시간을 나타내고, new Date()로 사용하면 객체의 인스턴스를 만든다. 둘의 차이는 Date는 변수를 무시하고 무조건 현재 시간을 만든다면, new Date()는 변수를 받아서 1970년도부터 세는 시간을 만들어 준다. 둘의 차이를 확인하려면 아래 코드를 실행시켜보자.

```
console.log(Date());
console.log(Date(2));
console.log(new Date());
console.log(new Date(2));
```

new Date()가 현재 시간을 출력하기 때문에 결국 Date() = new Date().toISOstring()이다. 그런데 만약 여기다가 우리 비디오의 시간을 넣어주게 되면 시간의 형태로 출력되게 된다. 예를 들어서 `new Date(25 * 1000).toISOstring()`은 '1970-01-01T00:00:25.000Z'을 결과값으로 내놓는다. 이는 string이므로 substr로 우리가 필요한 부분만 사용할 수 있다. 그러므로 `new Date(time * 1000).toISOstring().substr(11, 8)`을 쓰면 '00:00:25'의 형태의 시간을 얻을 수 있다. 이를 이용해 코드를 작성하면 아래와 같다.

```
// videoPlayer.js
const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOstring().substr(11, 8);

const handleLoadedMetadata = (e) => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
};

const handleTimeUpdate = (e) => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
};
...
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
```

이는 굉장히 간단한 형태지만 24시간을 넘어가면 표현하지 못하는 문제가 생긴다. 이 경우는 입력받은 시간으로, hours, minutes, seconds를 구한 다음에 숫자가 10보다 작은지 아닌지 구해서 일일이 합쳐줘야 한다.

```
const secondsToTime = (seconds) => {
    let remainedSeconds = Math.floor(seconds);
    let hh = Math.floor(remainedSeconds / 3600);
    remainedSeconds %= 3600;

    let mm = Math.floor(remainedSeconds / 60);
    remainedSeconds %= 60;

    let ss = remainedSeconds;

    if(hh < 10) hh = "0" + hh;
    if(mm < 10) mm = "0" + mm;
    if(ss < 10) ss = "0" + ss;

    const result = hh + ":" + mm + ":" + ss;
    return result;
}
```

하지만 대부분 비디오 시간이 24시간을 넘어갈 일이 없으므로 위의 간단한 방법을 사용해도 큰 문제는 없다.

### 11.6 Timeline
다음으로 바를 움직이면 재생 시간을 바꿔주는 기능을 만들겠다. 앞서 만들었던 #timeline을 기억해보면 step="1", value=0, min="0"으로 설정했다. 여기서 max를 설정하지 않은 이유는 비디오의 길이를 모르기 때문이다. 그래서 우선은 비디오의 길이를 줘야 하는데, 이는 비디오가 불러와질 때 결정 되어야 한다. 그러므로 handelLoadedMetadata에 코드를 추가하면 된다.

```
// videoPlayer.js

const timeline = document.getElementById("timeline");
...
const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};
```

비디오의 현재 재생 시간이 바뀌면 바의 위치를 바꿔주려고 한다. 이 역시 앞서 했던 timeupdate 이벤트로 가능하다. 그래서 handleTimeUpdate에 바뀐 시간에 따라 바의 위치를 바꿔주는 코드를 추가한다.

```
// videoPlayer.js
const handleTimeUpdate = () => {
    ...
    timeline.value = Math.floor(video.currentTime);
};
```

이제 바를 움직이면 현재 재생 시간도 바뀌도록 만들어줘야 한다. 앞서 볼륨바를 만들 때, input 이벤트로 바가 움직일 때마다 음량이 바뀌도록 만들었다. 똑같은 일을 timeline에 해주면 된다.

```
// videoPlayer.js
const handleTinelineChange = (event) => {
    const {
        target: { value }
    } = event;
    video.currentTime = value;
};

timeline.addEventListener("input", handleTimelineChange);
```

이렇게 우리가 직접 비디오 컨트롤러를 만들었다. 이제는 watch.pug의 비디오에 컨트롤러가 필요 없으므로 지워주자.

```
// watch.pug
block content
    video(src="/" + video.fileUrl)
```

### 11.7 Fullscreen
풀스크린을 만드는 버튼을 만들어보자. 풀스크린을 적용하는 법은 간단하다. element.requestFullscreen()을 사용하면 된다.

```
// videoPlayer.js
const fullScreenBtn = document.getElementById("fullscreen");

const handleFullscreen = () => {
    video.requestFullscreen();
};

fullScreenBtn.addEventListener("click", handleFullscreen);
```

그런데 이렇게하면 문제가 생긴다. 비디오만 풀 스크린이 되고 우리가 만든 버튼은 나오지 않는다. 그러므로 pug 파일을 수정해줘야 한다. 지금까지 만든 비디오와 버튼을 모두 #videoContainer에 넣어준다.

```
// watch.pug
extends base

block content
    div#videoContainer
        video(src="/" + video.fileUrl)
        div
            button#play Play
            button#mute Mute
            input(type="range",step="0.1", value=0.5, min="0", max="1")#volume
            div
                span#currenTime 00:00
                span  / 
                span#totalTime 00:00
            div
                input(type="range",step="1", value="0", min="0")#timeline
            div
                button#fullScreen Enter Full Screen
    //-
        div
            p=video.description
            small=video.createdAt
        div
            small Uploaded by 
                a(href=`/users/${video.owner._id}`)=video.owner.name
        if String(video.owner._id) === String(loggedInUser._id)
            a(href=`${video.id}/edit`) Edit Video &rarr;
            br
            a(href=`${video.id}/delete`) Delete Video &rarr;
block scripts
    script(src="/static/js/videoPlayer.js") 
```

이렇게하면 videoContainer를 풀스크린으로 만들면 모든 것이 같이 보인다. 물론 아무런 스타일이 없어서, 빈 공간이 생기긴 하지만 나중에 바꿔주면 된다.

```
// videoPlayer.js
const fullScreenBtn = document.getElementById("fullscreen");
const videoContainer = document.getElementById("videoContainer")

const handleFullscreen = () => {
    videoContainer.requestFullscreen();
};

fullScreenBtn.addEventListener("click", handleFullscreen);
```

이제 풀스크린을 나가는 버튼만 만들어주면 된다. 버튼을 눌렀을 때, 글자를 바꿔주고 버튼을 누르면 풀스크린이 끝나게 해줘야 한다. 그러러면 풀스크린인지 아닌지 확인하는 과정이 필요하다. document.fullscreenElement를 사용하면 풀스크린이 없을 경우 null을 반환하고 있다면 해당 html을 반환한다. 이를 이용해서 만들면 된다.

```
// videoPlayer.js
const fullScreenBtn = document.getElementById("fullscreen");
const videoContainer = document.getElementById("videoContainer")

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        fullScreenBtn.innerText = "Enter Fullscreen"
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit Fullscreen"
    }
};

fullScreenBtn.addEventListener("click", handleFullscreen);
```

하지만 esc키를 눌러서 나갈 경우는 아직 해결되지 않았다.

이를 해결하기 위해선 자바스크립트에서 키 입력을 받는 법을 알아야 한다. 키 입력을 받는 이벤트는 keypress, keydown, keyup인데 이중 keydown과 keyup은 키를 눌렀을 때 반응 할 것인지, 아니면 key를 누르고 들었을 때 반응할 것인지에 따라 갈린다. 그리고 keypress와 keydown은 키를 눌렀을 때 반응한다. 그런데 keypresse와 keydown은 비슷해 보이는 둘은 차이가 있다. 우선 keydown은 어떤 키든지 눌러지면 반응하게 된다. 예를 들어 a키를 눌렀을 때, 반응하게 하고 싶다고 하자. 그런데 keydown은 이를 A로 인식하고 받아들인다 정확히는 아스키 코드인 65로 인식한다. 반면 keypress는 a와 A를 다르게 인식해서 a를 97 그리고 A를 65로 인식한다. 하지만 keypress는 문제점이 있는데 글자로 표현되지 않는 키 입력은 읽지 않는다. 예를 들어서 ctrl, alt, esc, shift 등은 keypress에서 인식할 수 없다. keydown은 어떤 키든지 간에 아스키코드로 인식하기 때문에 키 입력을 사용할 때 무조건 keydown을 사용하면 된다.

### 11.8 Controls Events part One
마우스가 움직이면 컨트롤러가 보이도록 만들어주고 싶다. mousemove 이벤트를 사용하면 마우스의 움직일 경우 함수를 실행시킬 수 있다. 그리고 컨트롤러를 자바스크립트에서 사용하기 위해서 #videoControls를 지정해줬다. 이제 마우스가 움직이면 videoControls에 showing class가 추가되도록 만들겠다. 나중에 css에서 showing에 따라 보이도록 만들어주면 되기 때문이다.

```
//watch.pug
block content
    div#videoContainer
        ...
        div#videoControls
            ...
```

```
// videoPlayer.js
const videoControls = document.getElementById("videoControls");

const handleMouseMove = () => {
    videoControls.classList.add("showing");
};

const video.addEventListener("mousemove", handleMouseMove);
```

이번에는 마우스가 비디오 밖으로 나갈 경우, showing 클래스가 없어지도록 만들어준다.

```
// videoPlayer.js
const videoControls = document.getElementById("videoControls");

const handleMouseMove = () => {
    videoControls.classList.add("showing");
};

const handleMouseLeave = () => {
    videoControls.classList.remove("showing");
};

const video.addEventListener("mousemove", handleMouseMove);
const video.addEventListener("mouseleave", handelMouseLeave);
```

그런데 마우스가 나가더라도 바로 컨트롤러가 없어지지 않는 경우가 있다. 이를 구현하기 위해선 setTimeout()을 사용한다.

```
// videoPlayer.js
const handleMouseLeave = () => {
    setTimeout(() => {
        videoControls.classList.remove("showing");
    }, 3000);
};
```

그런데 마우스가 밖으로 나갔다가 다시 들어올 경우, 컨트롤러가 유지되지 않고 3초 후에 사라지게 된다. 이는 setTimeout이 무조건 3초후에 실행되기 때문에 생기는 문제로, 컨트롤러가 다시 들어오면 timeout이 취소되도록 만들어줘야 한다. clearTimeout()을 사용하면 timeout이 작동하지 않도록 만들 수 있는데, 대상을 지정해줘야 한다. 예를 들어서 아래처럼 하면 id로 대상을 지정할 수 있다.

```
// videoPlayer.js
const handleMouseLeave = () => {
    const id = setTimeout(() => {
        videoControls.classList.remove("showing");
    }, 3000);
    clearTimeout(id);
};
```

문제는 이 clearTimeout이 handleMouseLeave가 아니라 handleMouseMove에서 실행되어야 한다는 것이다. 그런데 id는 handleMouseLeave 안에서 선언되면 밖에서 사용할 수 없으므로, 밖에서 global로 선언해줘야 한다. 그리고 그 id로 handleMouseMove 안에 clearTimeout()을 사용한다.

```
// videoPlayer.js
let controlsTimeout = null;

const handleMouseMove = () => {
    if(controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    videoControls.classList.add("showing");
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(() => {
        videoControls.classList.remove("showing");
    }, 3000);
};
```

### 11.9 Controls Events part Two
마우스가 움직이면 컨트롤러가 보이게 만들어줬다. 그런데 마우스를 멈출 경우 시간이 조금 지나면 컨트롤러가 보이지 않도록 만들어야 한다. 아쉽게도 마우스가 정지함을 인식하는 이벤트는 없다. 그래서 setTimeout과 clearTimeout을 사용해야 한다. handleMouseMove에서 마우스가 움직이면 setTimeout과 clearTimeout이 실행되게 해준다. 그러다가 마우스가 멈추면 setTimeout이 실행되면 된다. 아래 코드에서 showing 클래스를 지우는 코드가 반복되어서 따로 hideControls 함수로 만들어서 작성했다.

```
// videoPlayer.js
let controlsMovementTime = null;

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if(controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    videoControls.classList.add("showing");
    if(controlsMovementTime) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTime = null;
    }
    controlsMovementTime = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};
```

### 11.10 Recap

### 11.11 Style Recap
우리가 바꿔줘야 할 것은 텍스트로 된 것을 아이콘으로 바꿔주는 일이다. watch.pug에서 각각에 fontawesome으로 아이콘으로 바꿔준다. 그리고 videoPlayer.js에서 querySelector("i")로 해당 아이콘을 선택해준 다음, 텍스트를 바꾸는 대신에 아이콘을 바꿔줘야 한다. 이는 .classList를 바꿔주는 것으로 가능하다.

그리고 현재 비디오 컨트롤러에 마우스를 오래 올려 놓으면 컨트롤러가 사라지는 버그가 있다. 이는 비디오에 마우스를 올리고 있을 경우에만 handleMouseMove, handleMouseLeave가 실행되기 때문에 생기는 문제점으로, video가 아니라 videoContainer에 이벤트를 주면 간단히 해결된다.

그리고 이에 맞춰서 css를 업데이트 해줬다.

아직 완성 못 한 것이 2가지 있다. 우선은 비디오를 누르면 비디오가 재생되고 멈추는 기능이 없다. 이는 video.addEventListener("click")으로 간단히 구현할 수 있다.

다음으로 키를 누르면 비디오가 컨트롤되는 기능이 없다. 이는 [Keyboard Event](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)에서 찾을 수 있다. document.addEventListener('keydown', callback)으로 만들 수 있으니 확인해보자. 키가 여러개일 경우 switch로 해결할 수 있다.

```
// videoPlayer.js
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currenTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
```

```
// client/scss/components/video-player.scss
#videoContainer {
  width: 100%;
  position: relative;
  video {
    width: 100%;
  }
  .videoControls {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    &.showing {
      opacity: 1;
    }
    align-items: center;
    border-radius: 10px;
    position: absolute;
    bottom: 10px;
    width: 95%;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 4fr 1fr auto;
    gap: 10px;
    justify-content: space-between;
    background-color: #0f1117;
    padding: 10px;
    left: 0;
    box-sizing: border-box;
    .videoControls__play {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .videoControls__playBtn {
        margin: 0px 15px;
      }
      .videoControls__time {
        font-size: 12px;
      }
    }
    .videoControls__volume {
      display: flex;
      align-items: center;
      span {
        margin-left: 10px;
        i {
          font-size: 20px;
        }
      }
    }
  }
}
```

```
style.scss
// Components

@import "./components/header.scss";
@import "./components/footer.scss";
@import "./components/video.scss";
@import "./components/shared.scss";
@import "./components/forms.scss";
@import "./components/social-login.scss";
@import "./components/video-player.scss";
```

```
// watch.pug
extends base

block content
    div#videoContainer
        video(src="/" + video.fileUrl)
        div#videoControls.videoControls
            div.videoControls__play
                span#play.videoControls__playBtn
                    i.fas.fa-play
                div.videoControls__time
                    span#currenTime 00:00
                    span  / 
                    span#totalTime 00:00
            input(type="range",step="1", value="0", min="0")#timeline.videoControls__timeline
            div.videoControls__volume
                input(type="range",step="0.1", value=0.5, min="0", max="1")#volume
                span#mute
                    i.fas.fa-volume-up
            div
                span#fullScreen
                    i.fas.fa-expand
    //-
        div
            p=video.description
            small=video.createdAt
        div
            small Uploaded by 
                a(href=`/users/${video.owner._id}`)=video.owner.name
        if String(video.owner._id) === String(loggedInUser._id)
            a(href=`${video.id}/edit`) Edit Video &rarr;
            br
            a(href=`${video.id}/delete`) Delete Video &rarr;
block scripts
    script(src="/static/js/videoPlayer.js") 
```