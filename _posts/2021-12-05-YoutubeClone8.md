---
layout: post
title: Youtube Clone 8
date: Sun Dec  5 23:10:13 JST 2021
categories: Nodsjs
tag:
toc: true
---
## 12 VIEWS API

### 12.0 Register View Controller
영상 조회수를 기록하는 것을 만들어보겠다. 영상을 시청할 때마다 백엔드에 요청을 보내고, 해당 id의 조회수를 올려준다. 그 전에 우리가 만들 새로운 views를 이해해야 한다. 현재 우리 코드를 보면 서버에서 views로 페이지를 랜더링해주고 있다. 그런데 대부분의 페이지는 이런식으로 작동하지 않는다. 요즘 백엔드는 템플릿은 랜더링하지 않는다. 백앤드는 인증, DB를 담당하고, 프론트엔드는 React 등으로 만든다. 현재 우리 Nodejs는 페이지까지 랜더링하고 있는데 이를 바꿔보려고 한다. 그래서 템플릿을 랜더링하지 않는 views를 만들텐데 이를 api views라고 한다.

지금까지 우리가 아는 지식으로 조회수를 올려주는 기능을 만드려고 해보자. routers에 새로운 apiRouter.js 파일을 만든다. 그리고 그 안에 새로운 라우터를 만들고 server.js에서 특정 주소로 들어가면 그 라우터를 쓸 수 있게 해준다. 다음으로 해당 라우터에서 사용할 컨트롤러를 만든다. 컨트롤러는 비디오의 id로 영상을 찾아서 비디오가 없다면 오류를 보내고, 있다면 조회수를 +1 한 다음 저장하는 기능을 할 것이다. 여기까지의 과정을 코드로 만들면 아래처럼 된다.

```
// server.js
import apiRouter from "./routers/apiRouter";
...
app.use("/api", apiRouter);
```

```
// apiRouter.js
import express from "express";
import { registerView } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);

export default apiRouter;
```

```
// videoController.js
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.status(200);
};
```

여기까지는 전혀 어렵지 않다. 문제는 이를 어떻게 작동시킬지다. 앞서 말했듯이 우리는 페이지를 랜더링하지 않고 조회수를 올려주고 싶다. 우리가 아는 방식으로 POST를 사용하려면 form을 만들어서 제출해줘야 한다. 하지만 이 방식을 사용하면 url이 이동해야 하는 문제점이 있다. 다시 말해 지금까지 우리가 사용한 방법으로는 url을 이동하지 않고 사용할 수 없다.

url을 바꾸지 않고 사용하는 경우는 굉장히 많다. 우리가 댓글을 달 때나 영상을 시청할 때, url은 변하지 않는다. 이처럼 url이 변하지 않고 작동하는 것을 interactivity라고 한다. 다음에는 클라이언트에서 어떻게 url을 변경시키지 않고 이런 일이 가능한지 알아보자.

### 12.1 Register View Event
videoPlayer.js에 url을 변경시키지 않고 작동하도록 코드를 만드려고 한다. 우리는 비디오가 끝날 때, 조회수를 올려주기 위해서 "ended" 이벤트를 사용해서 handleEnded()를 만드려고 한다. 이는 fetch를 사용하면 할 수 있지만, 그 전에 영상의 _id가 필요하다. _id는 간단히 html에 `span=video._id` 같은 형태로 만들 수도 있지만, 이 경우 페이지에 _id가 직접적으로 보이게 된다. 다행히도 화면에 보이지 않게 추가 정보를 담을 수 있는 방법이 있는데, data attribute를 사용하는 것이다. data attribute은 사용법이 굉장히 간단한데, **data-**로 시작하는 속성으로 어떤 것이든 넣어도 된다. 예를 들어 `data-columns="3"`은 columns="3"이라는 정보를 넣어준 것이다. 우리의 경우 _id를 보내주고 싶으므로 watch.pug를 아래처럼 고치자.

```
// watch.pug
block content
    div#videoContainer(data-id=video._id)
        ...
```

그리고 이를 자바스크립트에서 읽는 법은 굉장히 간단한데, .dataset을 사용하면 된다. dataset은 data- 뒤에 붙은 정보를 가져온다. 아래 예시는 data-로 보낸 정보들을 어떻게 사용하는지 보여준다. [링크](https://developer.mozilla.org/ko/docs/Learn/HTML/Howto/Use_data_attributes)

```
<article
  id="electriccars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
...
</article>

var article = document.getElementById('electriccars');

article.dataset.columns // "3"
article.dataset.indexNumber // "12314"
article.dataset.parent // "cars"
```

우리는 data-id로 넣었으므로, videoContainer.dataset.id에 비디오의 id가 들어 있다. 이제 id를 가져올 수 있으므로 다음으로 해당 id로 요청을 보낼 수 있게 되었다.

이제 알아볼 것은 `fetch(url [,options])`다. fetch는 자바스크립트에서 페이지 새로 고침 없이 서버에 요청을 보내고 정보를 받아올 수 있다. url에는 요청을 보낼 주소를 적고, options는 method, body, header 등 굉장히 많은 옵션이 있다. 이때 options를 지정하지 않으면 `method: "GET"`으로 작동하는데, 우리는 "POST"가 필요하므로 이 부분만 바꿔주면 된다. fetch는 promise를 반환하므로 순서가 중요하면 async/await을 사용해야 한다. 

```
// videoPlayer.js
const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};
...
video.addEventListener("ended", handleEnded);
```
### 12.2 Conclusions
앞서 비디오의 id를 가져오고 fetch로 페이지를 랜더링하지 않고 정보를 업데이트 해줬다. 제대로 작동하는지 확인하기 위해서 브라우저로 돌아가서 inspect -> Network를 확인하자. 동영상이 끝날 때, 여기에 view라는 요청이 생길 것이다. 문제는 status가 pending에서 멈춰있는데, 이는 우리가 return res.status()를 사용했기 때문이다. res.status()는 res에 status를 추가하는 코드일뿐, status를 보내주는 코드가 아니다. 지금까지는 res.status().render() 형태로 사용했고, render이 알아서 status를 보내줬지만, 우리는 지금 res.status()만 사용하고 있다. 그래서 status가 보내지지 않고, vidw가 pending에서 멈추는 것이다. 이를 해결하기 위해선 status 대신에 sendStatus()를 사용하면 된다.

마지막으로 한 가지만 더 알아보자. 우리는 비디오 조회수에 ended를 사용했는데, 유튜브는 timeupdate를 사용하는 것을 더 선호한다. 왜냐하면 사용자가 얼마나 오래 봤는지, 그리고 사용자가 어떤 정보를 보내는지 수집하기 때문이다.

## 13 VIDEO RECORDER

### 13.0 Recorder Setup
비디오 녹화 기능을 만들어보겠다. 파일을 새로 만들어서 recorder.js에 코드를 작성할텐데, 그 전에 webpack.config.js 파일에서 파일을 불러와야 한다. 코드를 아래처럼 수정해주자.

```
// webpack.config.js
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "./src/client/js/videoPlayer.js",
    // add recorder here
    recorder: "./src/client/js/recorder.js",
  },
```

그리고 pug에서 파일을 읽어오도록 코드를 수정하고, 코드를 실행시킬 버튼을 하나 추가해준다.

```
// upload.pug
block content
    div
        button#startBtn Start Recording
    ...

block scripts
    script(src="/static/js/recorder.js") 
```

이렇게하면 기본적인 준비는 끝났다. [MediaDevices.getUserMedia()](https://developer.mozilla.org/ko/docs/Web/API/MediaDevices/getUserMedia)를 보면 어떻게 비디오를 녹화할 수 있는지 나온다. `navigator.mediaDeivces.getUserMedia(constraints)` 구조로 작성할 수 있는데, 여기서 constraits는 영상 어떻게 녹화할지 지정하는 기능이다. `{ audio: true, video: true}`로 녹음, 녹화가 가능하게 지정할 수 있고, `{ video: { width: 1280, height: 720 }}`으로 녹화하려는 영상의 사이즈를 지정하는 일도 가능하다. 하지만 지금 우리는 단순히 녹화만 필요하므로 `{ audio: true, video: true}`만을 사용하겠다.

그런데 MediaDevices.getUserMedia는 프로미스를 반환하는 비동기함수다. 그러므로 async/await을 사용해서 작성해줘야 한다. 반환하는 프로미스는 stream으로 받아서 콘솔에 출력해주도록 코드를 만들었다.

```
// recorder.js
const startBtn = document.getElementById("startBtn");

const handleStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  console.log(stream);
};

startBtn.addEventListener("click", handleStart);
```

그런데 이렇게 작성하고 출력해보면 에러가 나오게 된다. 그 이유는 프론트엔드에서는 async/await을 사용할 수 없기 때문이다. [regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime)을 `npm i regenerator-runtime`로 설치한다. 이제 이 패키지를 import해야 하는데, 선택지는 2개가 있다. 하나는 recorder.js의 제일 위에 import 해주는 것이고, 다른 하나는 main.js에서 import하고 base.pug에서 main.js를 import하는 것이다. 전자는 필요한 파일에서 import하는 것이고, 후자는 모든 파일에서 import하는 것이니 원하는대로 만들어주면 된다. 여기서는 후자로 만들어줬다.

```
// main.js
import "regenerator-runtime";
```

```
// base.pug
script(src="/static/js/main.js") 
    block scripts
```

### 13.1 Video Preview
stream으로 받아온 것을 보여줄 element를 만들어주겠다. upload.pug에서 아래처럼 만든다.

```
// upload.pug
block content
    div
        // add preview
        video#preview
        button#startBtn Start Recording
```

그리고 recorder.js에서 srcObject를 추가해주고, 재생해준다.

```
// recorder.js
const video = document.getElementById("preview");

const handleStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
      ...
  });
  video.srcObject = stream;
  video.play();
};
```

이렇게하면 화면을 미리볼 수 있는 창이 만들어진다.

### 13.2 Recording Video
이번에는 stream을 녹화해보겠다. [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)를 보면 어떻게 녹화할 수 있는지 나와있다. `new MediaRecorder(stream [, options])`로 MediaRecorder 객체를 만들 수 있는데, stream에는 녹화하고 싶은 대상이 들어간다. options에는 초당 비트 같은 내용이 들어가는데, 우리의 경우 간단한 녹화 기능만 필요하므로 사용하지 않겠다.

`new MediaRecorder()`로 객체를 만들었으면, `MediaRecorder.start()`, `MediaRecorder.stop()`으로 녹화를 시작하고 중단할 수 있다. 그런데 우리는 지금 버튼을 누르면 stream이 handler 안에서 생성되고 있다. 이 경우 stream을 함수 밖에서 사용할 수 없으므로 녹화를 시작하거나 멈추는데 어려움이 있다. 그러므로 stream을 전역 변수로 선언한 다음에 가져와서 사용해야 한다. 그리고 handleStart는 버튼을 눌러서 stream을 만들 이유가 없으므로 자바스크립트가 불러와질 때, 실행되도록 바꾸고 이름도 init으로 바꿔주겠다.

```
// recorder.js
let stream;

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        ...
    })
    ...
};

init();
```

그리고 기존의 이벤트 리스너를 고쳐서 녹화 시작과 끝을 작동시키겠다. 만약 버튼을 두 개를 사용한다면 이벤트를 두 개 만들어서 사용하면 되지만, 보통 녹화 시작과 녹화 종료 버튼은 같은 버튼을 사용하되, 현재 상태에 따라 동작 기능만 달라진다. 이를 구현하려면 addEventListener과 removeEventListener를 사용해야 한다.

먼저 녹화 시작 버튼을 누르면 버튼에 적힌 글자를 바꿔주고, removeEventListener로 현재 이벤트를 지워준다. 그리고 addEventListener로 녹화 정지 이벤트를 만들어준다. 지금은 간단히 setTimeoust으로 녹화를 종료시키도록 만들겠다.

```
// recorder.js

const handelStart = () => {
    startBtn.innerText = 'Stop Recording';
    startBtn.removeEventListener('click', handleStart);
    startBtn.addEventListener('click', handleStop);
    const recorder = new MediaRecorder(stream);
    recorder.start();
    setTimeout(() => {
        recorder.stop();
    }, 10000);
};

const handleStop = () => {
    startBtn.innerText = 'Start Recording';
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleStart);
};
```

이때, 녹화가 recorder.stop()으로 녹화가 종료되면, dataavailable 이벤트가 작동된다. 여기서 dataavailable은 녹화한 비디오를 담고 있는데, MediaRecorder.ondataavailable에서 data 속성으로 녹화한 영상을 다룰 수 있게 된다. 코드 순서대로 정리하자면 recorder.ondataavailable로 나중에 녹화가 종료되면 할 일을 만든다. 그리고 recorder.stop()이 실행되면 영상이 dataavailable로 넘어가고 recorder.ondataavailable에서 만든 코드가 실행된다. 지금은 어떤 데이터가 들어있는지 확인하기 위해 console.log로 내용들을 출력시키도록 만들었다.

```
// recorder.js
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    console.log("recording done");  // #3
    console.log(e);                 // #4
    console.log(e.data);            // #5
  };
  console.log(recorder);    // #1
  recorder.start();
  console.log(recorder);    // #2
  setTimeout(() => {
    recorder.stop();
  }, 10000);
};
```

녹화를 시작하면 먼저 #1에서 recorder이 출력되는데, state: "inactive"로 나온다. 그리고 #2에서 state: "recording"으로 바뀐다. 10초가 지나서 녹화가 끝나면 #3으로 녹화가 종료되었다는 문구가 나오고, #4에서 BlobEvent를 출력한다. BlobEvent의 내용 중 data: Blob의 내용이 #5에서 출력되고 코드가 종료된다.

### 13.3 Recording Video part Two
이제 setTimeout()이 아니라 버튼으로 recorder.stop()을 실행시키려고 한다. 그런데 recorder이 함수 안에서 선언되어 있으므로 다른 함수에서 사용할 수 없다. 그래서 recorder를 global로 선언했다. 그리고 필요없는 console.log()들을 지워줬다.

```
// recorder.js
const handleStop = () => {
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleStart);
  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    
  };
  recorder.start();
};
```

이제 ondataavailable 안에 코드를 작성하기만 하면 된다. 녹화를 다 한 다음에 영상을 다운로드 하는 기능을 추가하려고 한다. 이때, 사용하는 것이 [URL.createObjectURL](https://developer.mozilla.org/ko/docs/Web/API/URL/createObjectURL)이다. URL.createObjectURL은 주어진 객체를 가리키는 URL을 만드는데, 이 주소는 실제로 존재하는 것이 아니라 브라우저의 메모리 위에 있는 것이다. 그러므로 createObjectURL을 많이 사용하면 메모리가 부족해지게 된다. 그래서 굉장히 많은 영상을 쓴다면, `URL.revokeObjectURL()`로 메모리를 해제해줘야 한다. 물론 불러온 웹페이지가 종료되면 메모리는 해제되지만, 최적화와 안전성을 위해 URL을 해제해도 될 때 해주는 것이 좋다. 우리는 그리 길지 않은 영상이므로 그대로 사용하겠다.

```
// recorder.js
const handleStart = () => {
    ...
    recorder.ondataavailable = (event) => {
        const videoFile = URL.createObjectURL(event.data);
    };
    ...
};
```

그리고 video의 src에 videoFile을 지정해야 한다. 그런데 이전에 우리는 video.srcObject로 이미 비디오를 지정했었다. 둘의 차이점은 srcObject는 미디어 객체를 지정하고 src는 url을 지정한다는 것이다. 쉽게 말해 src는 영상의 주소를 넣어줘야 하고, srcObject는 MediaStream, Blob 등의 미디어 객체를 넣어줘야 한다는 점이다. 여담으로 오래된 브라우저의 경우 srcObject를 사용할 수 없어서, MediaStream, Blob 등을 URL.createObjectURL()로 변환한 다음 src에 넣어줘야 했다. 그런데 최근에는 srcObject 자체에 바로 넣을 수 있다.

어쨌거나 우리는 srcObject를 초기화 시키고, src에 videoFile을 넣어주면 된다. 이때, 영상을 보기 편하도록 video.loop = true를 추가해서 계속 재생되도록 만들었다.

```
// recorder.js
const handleStart = () => {
    ...
      recorder.ondataavailable = (event) => {
    const videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
    ...
};
```



### 13.4 Downloading the File
다음으로 handleStop()에서 영상을 멈췄을 때, 다운로드할 수 있도록 바꿔보겠다. 그런데 videoFile을 다른 함수에서 사용하기 위해 global로 선언해준다.

```
// recorder.js
let videofile;

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
    ...
    videoFile = URL.createObjectURL(event.data);
    ...
```

이제 우리는 handleDownload를 만들어서 videoFile을 다운 받으면 된다. 이제 우리가 만든 영상을 다운 받는 방법을 알아보자. <a>는 다른 url로 연결할 수 있는 링크를 만든다. 그런데 여기다가 download 속성을 주면, url로 이동하는 대신에 해당 url의 파일을 저장하는 창을 연다. 그리고 download에 값을 정하면 이를 다운로드할 때, 사용하는 이름으로 쓰게 된다.

다운로드 기능을 만드는 순서는 createElement로 <a>를 만든다. 그리고 <a>에 href, download 속성을 주고, document.body.appendChild(a)로 a를 body에 만들어준다. 그리고 a.click()으로 버튼을 누른 효과가 나타나게 한다.

```
// recorder.js
const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
```

### 13.5 Recap


## 14 WEBASSEMBLY VIDEO TRANSCODE

### 14.0 Introduction
영상을 녹화하고 다눙로드해서 webm 파일로 다운로드하는 기능까지는 구현했다. 문제는 영상을 보면 움직이지도 않고, 시간도 없다. 그래서 FFmpeg를 사용해서 mp4로 변환하는 방법과, 썸네일을 만드는 방법을 알아보겠다.

FFmpeg는 인코딩과 디코딩에서 거의 표준으로 사용되는 오픈 소스 프로젝트로, 우리가 아는 대부분의 비디오 관련 프로그램이 사용하고 있다. FFmpeg를 사용하려면 콘솔에서 ffmpeg로 사용할 수 있다. 이를 사용하면 유튜브 처럼 하나의 영상을 인코딩해서 여러 화질로 만들고, 사용자들이 화질을 선택할 수 있다. 문제는 비용이 너무 많이 든다는 점이다. 예를 들어 100개의 1GB 용량의 비디오를 인코딩하려면 이를 위한 메모리와, 연산 능력은 우리가 부담하기에 너무 비싸다. 

이 문제를 해결할 방법이 WebAssembly다. 웹어셈블리는 프론트엔드에서 굉장히 빠른 코드를 실행시킨다. 물론 웹어셈블리를 직접 만들지는 않고, 대부분은 c, c++, RUST로 만들게 된다. 우리의 경우 웹어셈블리를 직접 만드는 것이 아니라 다른 사람이 만든 것을 이용한다.

우리가 할 것은 [ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)을 사용하는 것이다. `npm install @ffmpeg/ffmpeg @ffmpeg/core`로 ffmpeg.wasm을 설치해주자.

### 14.1 Transcode Video

### 14.2 Download Transcoded Video

### 14.3 Thumbnail

### 14.4 Recap

### 14.5 Thumbnail Upload part One

### 14.6 Thumbnail Upload part Two

## 15 FLASH MEDDAGES

### 15.0 Installation
express-flash

### 15.1 Sending Messages
