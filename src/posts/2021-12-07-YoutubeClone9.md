---
layout: post
title: Youtube Clone 9
date: Tue Dec  7 10:33:59 JST 2021
categories: Nodejs
tag:
toc: true
---

## 16 COMMENT SECTION

### 16.0 Introduction

### 16.1 Comment Models

```
// src/models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  createdAt: { type: Date, required: true, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
```

```
// src/init.js
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";
```

```
// User.js
  location: String,
  // add comments
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});
```

```
// Video.js
  meta: {
    views: { type: Number, default: 0, required: true },
  },
  // add comments
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
```

### 16.2 Comment Box

```
// src/client/js/commentSection.js
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");

const handleSubmit = (event) => {
  event.preventDefault();
  const text = textarea.value;
  const video = videoContainer.dataset.id;
};

form.addEventListener("submit", handleSubmit);
```

```
// webpack.config.js
const BASE_JS = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    recorder: BASE_JS + "recorder.js",
    commentSection: BASE_JS + "commentSection.js",
  },
```

```
// watch.pug
    ...
    div.video__data
        p.video__title=video.title
        small.video__owner Uploaded by
            a(href=`/users/${video.owner._id}`)=video.owner.name
        small.video__createdAt=new Date(video.createdAt).toLocaleDateString("ko-kr", {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
        if String(video.owner._id) === String(loggedInUser._id)
            a(href=`${video.id}/edit`) Edit Video &rarr;
            br
            a(href=`${video.id}/delete`) Delete Video &rarr;
    if loggedIn
        div.video__comments
            form.video__comment-form#commentForm
                textarea(cols="30", rows="10", placeholder="Write a nice commment...")
                button Add Comment


block scripts
    script(src="/static/js/videoPlayer.js")
    script(src="/static/js/commentSection.js")
```

```
// client/scss/screens/watch.scss
.video__data {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  .video__title {
    font-size: 26px;
    margin-bottom: 5px;
  }
  .video__createdAt {
    font-size: 12px;
  }
  .video__owner {
    margin-bottom: 5px;
    font-size: 14px;
    a {
      color: cornflowerblue;
      text-decoration: underline;
    }
  }
}
```

### 16.3 API Route part One

지금까지 작성한 코드를 보면 로그아웃 했을 때, 에러가 나온다. 이는 로그인 하지 않았을 때, textarea, button이 없기 때문에 생기는 문제점이다. 이를 해결하기 위해선 2가지 방법이 있다. 하나는 로그인 했을 경우에만 script를 불러오는 것이다.

다른 방법은 자바스크립트 코드를 수정하는 것이다. form이 존재하는 경우에만 이벤트가 실행되고, textarea를 가져오도록 만들었다.

```
// commentSection.js
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    ...
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}
```

```
// watch.pug
block scripts
    script(src="/static/js/videoPlayer.js")
    if loggedIn
        script(src="/static/js/commentSection.js")
```

이제 comment를 백엔드로 보내서 처리해줘야 한다. 아직 comment를 처리하는 router가 없긴하지만, 우선은 fetch로 기능을 만든 후에 라우터를 만들겠다. fetch로 url을 지정하는 것은 간단하고, post 방식을 사용해야 하는 점도 명확하다. 그런데 text를 어떻게 전달할지가 문제다. text를 전달하기 위해선 body에 text를 전달해줘야 한다. 이렇게 하면 req.body 안에 text가 전달된다.

```
// commentSection.js
const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
    ...
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        body: {
            text,
        },
    });
};
```

마지막으로 라우터와 컨트롤러를 만들어주면 된다. 우선 컨트롤러는 body와 params만 출력하게 만들어주자.

```
// apiRouter.js
import { registerView, createComment } from "../controllers/videoController";
...
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
```

```
// videoController.js
export const createComment = (req, res) => {
  console.log(req.params);
  console.log(req.body);
  return res.end();
};
```

문제는 req.body를 확인하면 text가 없다. 이 문제는 다음에 해결해보자.

### 16.4 API Route part Two

우선 한 가지 살펴볼 것이 있다. 지금까지 form으로 POST로 제출하면 req.body에 제출한 내용이 들어있었다. 이는 `app.use(express.urlencoded({ extended: true }));`를 설정했기 때문에 가능한 것이다. 이제 서버가 fetch로 오는 정보를 이해할 수 있도록 만들어줘야 한다. 우리가 fetch로 보내는 정보는 JSON이다. 문제는 JSON은 전달되는 과정에서 서버와 브라우저가 이를 string으로 인식해버린다. 예를 들어 `object = { text: "sdjflkasdf" }`가 있을 때, object가 전달되면 `object.toString()`이 실행되어서, `[object Object]`라는 결과가 나온다.

```
// commentSection.js
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    body: { text }  // "[object Object]"
  });
```

그렇다면 body에서 { text }가 아니라 text를 보내면 어떻게 될까? 브라우저는 이해할 수 있지만, 아쉽게도 서버는 이해하지 못한다. 서버에서 이해하기 위해서는 `app.use(express.text());`를 적어주면 된다. 그리고 다시 내용을 보면 내용이 전달된 것을 볼 수 있다.

```
// server.js
app.use(express.txt());
```

```
// commentSection.js
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    body: text  // "This is typed on text"
  });
```

하지만 아직도 문제가 있다. 우리는 text 하나의 정보밖에 보내지 못하고 있다. 경우에 따라 여러 정보를 보내야 하는 경우가 있다. 이 경우 object를 보내야 하는데, 우리는 object가 전달되지 않음을 알고 있다. 그래서 JSON.stringify()를 사용한다. JSON.stringify()는 전달된 object를 string으로 바꿔서 전달해준다. 그렇게 하면 우리는 object를 보내준 것이 아니라, 단지 긴 string을 전달하므로 서버도 이해할 수 있게 된다.

```
// commentSection.js
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    body: JSON.stringify({ text: "This is text", rating: "5" }),
  });
```

그렇다면 이렇게 전달한 내용을 객체로 사용할 수 있을까? createComment에서 `console.log(req.body.text, req.body.rating);`로 확인해보면, 아쉽게도 undefined로 나온다. 당연히도 이는 string이지 객체가 아니기 때문에 정상적으로 작동하지 않는다. 이는 `app.use(express.text())`를 수정해줘야 한다. 물론 text만을 받아오면 이로도 충분하지만, 우리는 모든 string을 json으로 바꿔주는 기능이 필요하다. 다행히도 express에는 `app.use(express.json())`으로 string을 모두 json으로 바꿀 수 있다.

어떤 일이 일어나는지는 굉장히 간단하다. JSON.stringify()로 string이 된 것을 다시, JSON.parse()로 나눠주는 것이다.

```
JSON.stringify({ text: "This is text", rating: "5" })
// "{ text: "This is text", rating: "5" }"
JSON.parse("{ text: "This is text", rating: "5" }")
// { text: "This is text", rating: "5" }
```

여기다가 추가로 express에게 보내는 것이 text가 아니라 json이라는 것을 알려줘야 한다. 그래서 fetch로 돌아가서 header에 `"Content-type": "applicaion/json"`을 추가해야 한다.

```
// commentSection.js
fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
```

마지막으로 text가 비어있으면 아무것도 보내주지 않게 하자.

```
// commentSection.js
if (text === "") {
    return;
}
fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
```

### 16.5 Commenting

```
// commentSection.js
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
};
```

```
// videoController.js
export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  return res.sendStatus(201);
};
```

### 16.6 Rendering Comments

```
// videoController.js
export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.sendStatus(201);
};
```

```
// watch.pug
    if loggedIn
        div.video__add-comments
            form.video__comment-form#commentForm
                textarea(cols="30", rows="10", placeholder="Write a nice commment...")
                button Add Comment
    div.video__comments
        ul
            each comment in video.comments.reverse()
                li.video__comment
                    i.fas.fa-comment
                    span  #{comment.text}
```

```
// watch.scss
.video__comments {
  display: flex;
  flex-direction: column;
  max-width: 320px;
  width: 100%;
  margin: 0 auto;
  margin-top: 20px;
  .video__comment {
    padding: 10px;
    border-radius: 9999px;
    background-color: white;
    color: black;
    margin-bottom: 10px;
  }
}
```

실시간으로 댓글이 추가되는 것처럼 보여주려면 async/await, window.location.reload()를 사용할 수 있다. 여기서 async/await을 사용한 이유는 fetch가 실행되는 순서를 조절하기 위함이었다. 만약 async/await을 사용하지 않았더라면 프로미스를 반환하기 때문에 순서를 보장할 수 없고, window.location.reload()가 먼저 실행될 수도 있다. 그래서 fetch가 정상적으로 작동할 시간을 보장하기 위해서 async/await을 사용했다.

```
// commentSection.js
const handleSubmit = async (event) => {
    ...
    await fetch(`/api/videos/${videoId}/comment`, {
        ...
    });
    window.location.reload();
};
```

그런데 댓글이 생길때마다 새로고침을 해주는 것을 별로 좋은 생각은 아니다. 매번 비디오, 사용자, 댓글 정보를 받아야 하기 때문이다. 그래서 생각할 수 있는 것이 새로고침 하는 대신에, 방근 만든 댓글이 추가된 것처럼 보이게 만드는 것이다.

### 16.7 Realtime Comments

우리가 fetch를 실행시키긴 했지만 종료되었을 때, 성공여부는 확인할 수 없었다. fetch의 프로미스를 반환 받아서 콘솔에 출력해보자.

```
// commentSection.js
const handleSubmit = async (event) => {
    ...
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        ...
    });
    console.log(response);
    textarea.value = '';
};
```

출력결과를 확인해보면 response에 status가 있는 것을 볼 수 있다. 여기서 status가 201이라면 댓글이 추가되었다. 그리고 새로 생긴 댓글을 화면에 추가하는 코드를 만들면 새로고침 없이도 댓글이 새로 생성된 효과를 보일 수 있다. 이를 위해 status가 201일 경우에 새로 함수가 실행되도록 형태를 만든다.

```
// commentSection.js

const addComment = (text) => {
    // write code here
};

const handleSubmint = async (event) => {
    ...
    const { status } = await fetch(`/api/videos/${videoId}/comment`, {
        ...
    });
    ...
    if (status === 201) {
        addComment(text);
    }
};
```

이제 addComment에서 새로 element를 만들어서 추가해주면 된다. 이때, 최종적으로 완성한 것은 Element.prepend()로 제일 앞에 오도록 덧붙인다.

```
// commentSection.js
const addComment = (text) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  videoComments.prepend(newComment);
};
```

### 16.8 Comment ids

댓글을 작성한 사람이라면 댓글을 삭제하는 기능 추가하기.

fetch로 접근한 url에서 res.json()으로 반환한 값을 사용하는법

response.json() -> body의 내용이 parsing 되어서 쓸 수 있게 된다.

### 16.9 Recap and Challenge

method: "DELETE"로 보낸 것을 route.delete()로 사용 가능

## 17 DEPLOYMENT

### 17.0 Building the Backend

백엔드를 실제로 배포하는 법을 알아보자. 우리는 Heroku로 배포할 예정인데, 그전에 해야할 일이 아직 많다. 먼저 어떤 Node.js 환경에서도 서버가 구동가능하게 수정해줘야 하고, mongoose로 대체한 DB도 만들어줘야 한다. 그리고 이미지나 비디오를 컴퓨터에 저장하고 있는데, 이를 아마존에 올려줘야 한다. 마지막으로 Production 방법으로 빌드해서 코드를 압축해줘야 한다.

각 단계가 많으므로 지금은 처음부터 시작하겠다. 지금 우리 코드는 Babel이 번역해서 구동해주고 있다. 그런데 Babel은 서비스가 아니라 개발 단계에서만 사용되는 목적으로 만들어졌다. 왜냐하면 Babel을 사용해서 매 번 코드를 번역하면 구동 속도가 느려지기 때문이다. 그래서 Babel CLI로 코드를 수정해줘야 한다.

[@babel/cli](https://www.npmjs.com/package/@babel/cli)를 보면 `npm install --save-dev @babel/cli`로 설치할 수 있다. [사용법](https://babeljs.io/docs/en/babel-cli)은 이곳을 참고하자. `npm babel file`의 형태로 파일이나 폴더를 번역해주는데 여기서 -d로 저장 위치를 정할 수 있다. 우리는 src 폴더를 번역해서 build 폴더에 저장하도록 script 명령어를 만들어줬다.

```
// package.json
  "scripts": {
    "build:server": "babel src -d build",
    "dev:server": "nodemon",
    "dev:assets": "webpack"
  },
```

그리고 `npm run build:server`로 script를 실행시키면 build 폴더에 번역된 파일이 생성된다. 이 파일들은 깃허브에 올려줄 필요가 없으므로 .gitignore에 추가해준다.

```
// .gitignore
/build
```

빌드된 파일을 확인해보면 views 폴더가 없다. 그리고 client 폴더도 번역되었는데 우리는 백엔드를 babel로 바꾸는 것이므로, 프론트엔드인 client는 번역되면 안 된다.

빌드된 파일을 실행하려면 build/init.js를 실행시키면 된다. 이를 위해 script를 하나 더 만들어준다.

```
// package.json
  "scripts": {
    "start": "node build/init.js",
    "build:server": "babel src -d build",
    "dev:server": "nodemon",
    "dev:assets": "webpack"
  },
```

여기서 start는 기본 명령어라서 `npm run start`가 아니라 `npm start`로 작동한다. 그런데 `npm start`로 실행하면 작동되지 않는데, 대신 'regeneratorRuntime is not defined' 에러가 나온다. 이는 이전에 async/await을 프론트엔드에서 사용하려고 했을 때, 나온 에러로 다음에는 이를 고쳐보도록 하자.

### 17.1 Building the Backend part Two

이전에 'regeneratorRuntime is not defined' 에러가 나온 것은 client에서 async/await을 사용했기 때문이다. 그리고 이를 import "regenerator-runtime"으로 해결해줬었다.

init.js 제일 위에 `import "regenerator-runtime";`을 적어주자. 그리고 `npm run build:server`로 새로 빌드한 다음 `npm start`로 새로 시작해주자. 그러면 서버가 이전처럼 작동한다. 그런데 build 폴더를 보면 views 폴더가 없는데도 정상적으로 작동한다. 이는 views의 위치가 process를 기준으로 지정되어 있어서 폴더 위치가 그대로여도 알아서 찾아주기 때문이다.

다음에는 assets 폴더를 빌딩해보겠다.

### 17.2 Building the Frontend

백엔드를 빌드했으므로 이제 프론트엔드를 빌드해야 한다. 그러기 위해선 2가지를 수정해야 한다. webpack.config.js에서 mode와 watch를 지워준다. 대신에 이 옵션은 스크립트에서 지정해주도록 하겠다. webpack에 --mode, --watch로 mode와 watch를 지정할 수 있다. 그리고 build를 `"build": "npm run build:server && npm run build:assets",`로 하나로 묶어주겠다.

```
// package.json
  "scripts": {
    "start": "node build/init.js",
    "build": "npm run build:server && npm run build:assets",
    "build:server": "babel src -d build",
    "build:assets": "webpack --mode=production",
    "dev:server": "nodemon",
    "dev:assets": "webpack --mode=development -w"
  },
```

```
// webpack.config.js
module.exports = {
    entry: {
        main: "./src/client/js/main.js",
        videoPlayer: "./src/client/js/videoPlayer.js",
    },
    // delete mode and watch
    // mode: 'development',
    // watch: true,
```

지금까지 작업한 내용을 Heroku에 올려보겠다. 물론 정상적으로 작동하지 않겠지만, 어떤 에러가 발생할지 알고 싶다.

### 17.3 Deploying to Heroku

우선 Heroku에 들어가서 회원가입을 해주자. 그리고 create new app을 누르자. 여기서 App name, region을 설정하고 Create app 버튼을 누른다. 이렇게 하면 앱이 만들어진다.

Heroku에 배포하는 방법은 2가지로 Heroku Git을 사용하거나 Github 자체를 사용하는 방법이 있다. 우선은 Heroku Git으로 배포해보겠다. Heroku Git으로 배포하기 위해 Heroku CLI를 설치해야 한다. 사이트의 링크에서 OS에 따라 설치해주면 된다. 설치가 되었는지 확인하려면 `heroku login`을 콘솔에서 실행한다. 아무키나 누르고, 불러와지는 페이지에서 확인을 하면 된다.

다음으로 프로젝트 파일이 있는 폴더로 cd로 이동한다. 그리고 만약 `git init`을 하지 않았다면 해줘야한다. 왜냐하면 Heroku Git은 깃허브 레파지토리로 실행되는데, 아무 내용도 없으면 실행할 수 없기 때문이다. 그리고 `heroku git:remote -a appname`으로 실행할 수 있는데 appname은 앞서 지정한 이름에 따라 다르므로 자신의 것을 사용하자.

이제 Heroku 레파지토리를 하나 얻게 된다. 여기로 git add/commit/push가 가능하다. 만약 깃허브에 레파지토리가 있다면 `heroku git:remote -a repositoryName`으로 연결해주는 것만으로도 충분하다. 우리는 깃허브 레파지토리에 파일을 올렸으므로 `heroku git: remote -a repositoryName`을 사용하자.

`git push heroku master`을 입력하면 우리 코드를 배포할 수 있다. 그 전에 새 콘솔에 `heroku logs --tail`로 로그를 볼 수 있도록 만들자. 그리고 커맨드 창에 push를 해주면 알아서 파일을 읽어서 필요한 것을 설치하기 시작한다. 그런데 Heroku는 commit 하지 않으면 코드를 볼 수 없어서 에러가 발생한다. 왜 에러가 발생하는 것일까?

heroku는 기본적으로 npm build, npm start를 실행한다. 만약 이전의 코드를 commit을 하지 않으면 build라는 스크립트가 없어서 에러가 발생하게 된다. 그러므로 `git commit -m "some message"`로 커밋해주고 `git push origin master && git push heroku master`로 깃허브 레파지토리에 올리고, Heroku도 실행해주겠다.

그런데 로그를 보면 Assertion failed: You must provide either mongoUrl|clientPromise|client라는 에러가 나오고 Error: Cannot init client. 라는 것도 나와 있다.

heroku가 보는 파일은 모두 github의 파일이다. 그런데 db.js를 보면 process.env.DB_URL을 사용하고 있다. 문제는 우리가 .gitignore로 .env를 올려주지 않기 때문에 발생한다. 하지만 우리는 .env 파일을 업로드하면 안 된다. 대신에 process.env.DB_URL를 사용하는 다른 방법이 있다.

현재 우리는 Heroku로 배포하는데 성공했지만, 아직 DB가 없다. 이를 해결하기 위해 mongoDB Atlas 계정이 필요하므로 회원가입 해주자.

### 17.4 MongoDB Atlas

mongoDB Atlas에 가입했다면, New Project로 새로 프로젝트를 만들어준다. 그리고 Create Project를 누르고, 모두 free로 선택한다. 지역을 선택하고, 계속 진행한다. 중간에 비밀번호와 url이 나오는데, url에 비밀번호를 넣어줘야 하므로 비밀번호를 꼭 다른 곳에 저장해두자. 그리고 Heroku 사이트로 이동해서 settings로 들어가서 Reveal Config Vars를 누른다. 여기서 KEY VALUE를 추가할 수 있는 공간이 있는데, 여기다가 DB_URL을 KEY로 하고, Atlas의 url을 value로 넣어준다. 이렇게하면 .env를 사용하지 않고 Heroku로 변수를 설정할 수 있다.

다음으로 server.js에 COOKIE_SECRET을 설정하지 않았으므로 이 역시 Config Vars에 추가해줘야 한다. COOKIE_SECRET은 랜덤한 값이므로 아무것이나 적어주면 된다.

하지만 Heroku가 서버와 연결에 실패했다는 에러가 나온다.

### 17.5 Environment Variables

우리는 PORT로 4000을 쓰고 있다. 그런데 Heroku가 설정해준 PORT로 연결해야 하므로 에러가 발생한다. 그래서 init.js에서 `const PORT = process.env.PORT || 4000`;로 설정해야 한다. 이렇게하면 Heroku를 사용할 때와 컴퓨터에서 사용할 때, 모두 정상적으로 작동한다. 다시 git commit, git push heroku master 으로 레파지토리를 업로드해야 한다. 이후 Heroku가 다시 시작된다.

새로 PORT가 열리면, Heroku 페이지로 돌아가서 새로고침 해주면 브라우저 상에 우리가 만든 페이지가 보이게 된다. 깃허브로 로그인 하려면 역시 .env 파일이 없으므로 GH_CLIENT를 설정해줘야 한다. 아까 Cofig Vars로 돌아가서 추가해주고, GH_SECRET도 추가해야한다. 모든 것을 추가했으므로 이제 Hide Config Vars로 가려주면 된다.

### 17.6 Github and AWS S3 part One

그런데 깃허브로 로그인 하려고 하면 우리가 localhost:4000으로 돌아가도록 만들었기 때문에 정상적으로 작동하지 않는다. Github setting로 이동해서 Authorization callback URL에 Heroku에서 사용하는 URL을 지정해줘야 한다. 매번 이렇게하면 번거롭기 때문에 2개를 만들어서 하나는 테스트용, 다른 하나는 배포용으로 만드는 것을 추천한다.

이제 Atlas로 이동해서 users를 보면 깃허브로 로그인한 정보가 보이게 된다.

이제 Github로 배포하는 방법을 알ㅇ아보자. Heroku 사이트에서 Connect to Github 아이콘을 누른다. 그리고 레파지토리를 이름으로 검색해서 연결하면 준비는 끝났다. 여기서는 깃허브 레파지토리에 `git push origin master`를 할 때마다 바로 배포하게 된다. 다시 말해 이제 `git push heroku master`을 해줄 필요가 없다. 물론 git push origin master을 할 때마다 배포가 되기 때문에 브랜치가 배포 가능한 상태여야만 한다.

이제 프로필을 수정해서 이미지를 바꿔보자. 그런데 `git push heroku master`을 사용해서 앱을 재배포 하면 이전 이미지가 모두 삭제된다. 이는 매번 새로 배포할 때마다 완전히 새로운 앱을 만들기 때문에 발생한다.

### 17.7 AWS S3 part Two

이제 서버를 파일 저장소로 사용하는 것을 그만두겠다. 왜냐하면 서버를 업데이트 했을 뿐인데 저장된 이미지와 비디오가 모두 삭제되기 때문이다. 그래서 파일을 저장하기 위해 AWS를 사용하겠다. AWS Service - Storage - S3로 이동한다. 그리고 Create bucket을 누른다. bucket name은 유일해야 하므로 적당한 이름을 선택하자. 우리는 block all public access만 누르고 bucket을 만든다.

다음으로 API Key를 만들어야 한다. IAM으로 이동해서 Users, Add users를 누른다. user named을 입력하고 programmatic access를 체크하자. 다음으로 권한을 줄 수 있는데, 관리자 권한(AdministratorAccess)는 절대 사용하면 안 된다. 만약 이 권한을 주면 이 Key를 알아내는 순간 계정의 모든 권한을 얻게 된다. 대신에 AmazonS3FullAccess를 선택한다.

tag는 필요없고 review로 원하는대로 설정되었는지 확인하고 Create User를 누른다. 그러면 Access key ID와 Secret access key를 보여주는데, Secret access key는 이 페이지에서 단 한 번 밖에 안 보여준다. 그러므로 저 둘을 복사해서 .env에 추가해주는 것이 좋다. 이제 heroku의 설정으로 가서 저 두 변수를 추가해준다. AWS_ID, AWS_SECRET를 추가해주면 준비는 끝났다.

이제 Multer S3라는 패키지를 사용해야 한다. 이 패키지를 사용하려면 aws-sdk라는 패키지도 필요하므로 `npm i aws-sdk multer-s3`로 패키지를 설치하고 middlewares.js로 이동해서 아래처럼 수정해준다.

```
// middlewares.js
import aws from "aws-sdk";
import multerS3 from "multerS3";

const se = new aws.S3({
    credentials: {
        accessKeyId: process.end.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    }
})

const multerUploader = multerS3({
    s3: s3,
    bucket: "bucketname",
});

...
export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
        fileSize: 3000000,
    }
    storage: multerUploader,
});

export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: {
        fileSize: 10000000,
    },
    storage: multerUploader,
})
```

이제 이미지를 업로드하면 파일이 AWS에 올라가게 된다. 그런데 avatarUrl이 사라지는 버그가 생겼다.

### 17.8 AWS S3 part Three

AWS의 bucket에서 permission에 들어가서 마지막 2개만 체크해준다. 그리고 아래처럼 수정한다.

```
// middlewares.js
const multerUploader = multerS3({
    s3: s3,
    bucket: "bucketname",
    acl: "public-read",
});
```

```
// userController.js
export const postEdit = async (req, res) => {
    console.log(file);
    const updateUser = await User.findByIdAndupdate(
        _id,
        {
            avatarUrl: file ? file.path : avatarUrl,
            ...
        }
    )
    ...
};
```

이제 이미지를 업로드하고 출력되는 것을 확인해보자. 보면 파일 위치가 location으로 나오는 것을 볼 수 있다. 그러므로 위의 file.path는 file.location으로 수정해줘야 한다.

```
// userController.js
export const postEdit = async (req, res) => {
    console.log(file);
    const updateUser = await User.findByIdAndupdate(
        _id,
        {
            avatarUrl: file ? file.location: avatarUrl,
            ...
        }
    )
    ...
};
```

동일한 일을 비디오에도 해줘야 한다.

```
// videoController.js
const postUpload = ... {
    const newVideo = ... ({
        fileUrl: video[0].location,
        thumbUrl: thumb[0].location,
    })
}
```

그 외에 퍼그에 링크도 수정해주면 된다.

### 17.9 Production Environment

### 17.10 Conclusions

dMWeJicrSaGcWN4
mongodb+srv://istrangeho:<password>@cluster0.ei42c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
