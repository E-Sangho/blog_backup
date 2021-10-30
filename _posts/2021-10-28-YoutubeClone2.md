---
layout: post
title: Youtube Clone2
date: Thu Oct 28 22:33:35 JST 2021
categories: Clone NodeJS
tag: Clone NodeJS
toc: true
---

## 6 MongoDB and Mongoose

### 6.0 Array Database part One
이번에는 비디오에 id를 추가한 다음 그 id로 링크를 만들어보겠다. 먼저 videoController.js에 id를 포함한 videos를 만들고 모든 페이지에서 사용 가능하게 밖에서 선언하겠다.

```
// videoController.js
let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 3,
  },
];
```

그리고 mixin에서 title을 링크로 바꿔주겠다. 그렇게 하려면 ```a(href=`videos/${video.id}`)=video.title```로 바꿔주야 한다. 이때 백틱을 사용해야 하는 것을 잊지말자. 그 외에 mixin 이름이나 객체의 이름은 video로 바꿔줬다. 그렇게 하면 video.pug 파일은 아래처럼 된다.

```
// video.pug
mixin video(video)
    div
        h4
            a(href=`/videos/${video.id}`)=video.title
        ul
            li #{video.rating}/5.
            li #{video.comments} comments.
            li Posted #{video.createdAt}.
            li #{video.views} views.
```

그에 맞춰서 home.pug에도 mixin의 이름을 바꿔준다.

```
// home.pug
block content
    h2 Welcome here you will see the trending videos
    each video in videos
        +video(video)
    else
        li Sorry nothing found.
```

우리가 비디오에 id를 넣어주었고 그 링크를 클릭하면 /videos/${video.id}로 가게 만들었다. 그렇다면 우리가 수정해야할 것은 저 링크를 눌렀을 때 가게 되는 see 컨트롤러다. 하고 싶은 일은 현재 링크의 id에 맞춰서 비디오가 나오는 것이다. 하지만 아직 비디오가 없으니 video.title이 나오는 것으로 만들도록 하자.

먼저 현재 id를 받아와야 한다. videoRouter에서 변수를 id로 정했기 때문에 res.params에 있는 id를 받아와야 한다. id를 받아오는 방법은 2가지가 있다. 하나는 `const id = req.params.id;`이고 다른 하나는 `const { id } = req.params;`다. 두번째 것은 ES6부터 지원되는 것이니 사용환경에 따라 작동하지 않을 수도 있다. 우리는 ES6를 쓴다고 생각하고 후자를 사용하겠다.

id를 받아왔으면 이를 가지고 videos에서 객체를 찾아와야 한다. videos의 id가 1부터 시작했다고 생각하면 `const video = videos[id-1]`로 video를 받아올 수 있다. 마지막으로 이렇게 받아온 것을 랜더링으로 보내주면 된다. ```res.render("watch", { pageTitle: `Watching ${video.title}` })``` 라고 적어주면 pageTitle을 출력해준다. 코드를 정리하면 아래와 같다.

```
// videoControllser.js
...
export const see = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}` , video });
};
...
```

### 6.1 Array Database part Two
see라는 컨트롤러는 이름이 맞지 않아서 전부 watch로 바꿔줬다. 이번에는 watch.pug 파일을 바꿔보겠다. 여기서 우리는 비디오를 본 횟수를 출력하고, 그 비디오를 수정하는 링크를 걸어놓겠다. 먼저 시청 횟수를 만들어보자. 간단히 video.views를 쓰면 되지만 문제는 단위다. 단수라면 view 복수라면 views를 써야 하는데, 이를 위해서 삼항연산자를 사용했다.

```
// watch.pug
...
block content
    h3 #{video.views} #{video.views === 1 ? : "view" : "views"}
```

다음으로 비디오를 수정하는 링크를 만들기 전에, 상대경로와 절대경로의 차이를 알아야 한다. 현재 위치는 localhost:4000/videos/3라고 하자. 여기서 href="/edit"을 사용하면 localhost:4000/edit으로 가게 된다. href="edit"을 사용하면 localhost:4000/videos/edit으로 간다. 그 이유는 /를 사용하면 홈화면을 기준으로 출발해서 /edit으로 가게 되고, /를 사용하지 않으면 현재 위치의 마지막 칸을 edit으로 바꿔주기 때문이다. 그런데 우리가 원하는 것은 절대경로가 아니라 상대경로이므로 /를 사용하지 않는다. 대신에 우리는 마지막 url이 바뀌는 것도 고려해야 한다. video.id를 같이 사용해야 우리가 원하는대로 url을 쓸 수 있다. 그러므로 ```a(href=`${video.id}/edit`) Edit Video &rarr;```으로 적어야 한다.

```
// watch.pug
...
block content
    h3 #{video.views} #{video.views === 1 ? : "view" : "views"}
    a(href=`${video.id}/edit`) Edit Video &rarr; 
```

### 6.2 Edit Video Part One
우리는 videos/:id/edit에 가는 링크를 만들었다. 저 라우터에서 작동하는 컨트롤러는 edit이므로 edit을 만들어주자. 기본적인 구조는 watch와 동일하다.

```
// videoController.js
...
export const Edit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
...
```

그런데 라우터나 컨트롤러를 예시를 위해 만든 것이 많아서 필요 없는 것들을 지웠따. globalRouter.js에서는 /search 라우터를 지웠고, videoRouter.js에서는 /upload 라우터를 지워줬다. 그에 맞춰 import를 수정하고 각 컨트롤러에서 필요없는 것들을 지웠다. 다시 우리가 하던 일로 돌아가서 우리는 edit을 만들었다. 그러므로 edit.pug를 수정해줘야 한다. 이번에 배울 것은 GET과 POST의 차이다. 우선 아래처럼 코드를 만든다.

```
// edit.pug
extends base.pug

block content
    h4 Change Title of video
    form(method="POST")
        input(name="title", placeholder="Video Title", value=video.title, required)
        input(value="Save",type="submit")
```

form은 정보를 제출하기 위한 것들을 포함하는 태그다. form은 action과 method라는 속성이 있다. action은 폼이 제출될 때 데이터를 전달받는 URL의 주소로, 주소가 없으면 현재 url로 제출된다. method는 HTTP method를 의미하며 POST와 GET이 있다. GET은 데이터를 변경하지 않는 경우에 사용하고, POST는 데이터베이스가 변경될 경우 사용해야 한다. 이를 알기 위해 먼저 GET으로 보내보자. form(action="/save-changes")로 하고 input에 이름을 넣어주자. input에 이름을 넣어주는 이유는 GET 때문이다. GET은 action에서 지정한 url로 가고 ?를 붙인다. 그리고 ? 뒤에 input에서 받은 값을 넣어주는데 이름이 있어야 그 값이 표시된다.

```
// edit.pug
...
    form(action="/save-changes")
        input(name="title, placeholder="Video Title", value=video.title, required)
...
```

그런데 보다시피 우리가 데이터를 보내면 그 데이터가 url에 그대로 노출되기 된다. 이렇게 되면 보안에 문제가 생기기 때문에, 데이터를 보낼때는 POST로 보내서 데이터가 유출되지 않게 해야 한다. POST를 써야 하는 이유를 알았으므로 코드는 다시 원래대로 바꿔준다.

우리는 웹 페이지에 새로운 데이터를 보내고 싶으므로 POST를 사용했다. 그런데 라우터를 보면 GET만을 받을 뿐 아직 POST는 받지 못한다. 그러므로 videoRouter.js에 POST를 받도록 만들어줘야 한다. 그런데 이렇게 되면 edit페이지에 2개의 컨트롤러가 들어가야 한다. 그래서 기존의 edit으로 만든 컨트롤러의 이름을 수정해서 getEdit으로 만들고 우리가 만들 새로운 컨트롤러는 postEdit으로 만들겠다. 이때 import에 있는 컨트롤러의 이름도 바꿔줘야 하는 것을 기억하자.

```
// videoRouter.js
...
videoRouter.get("/:id(\\d+)/edit, getEdit);
videoRouter.post("/:id(\\d+)/edit, postEdit);
...
```

```
// videoController.js
...
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {};
```

코드를 수정한 후에 다시 /videos/1/edit에서 정보를 보내주면, 페이지가 응답하는 것을 확인할 수 있다. 하지만 아직 우리는 postEdit으로 아무것도 하지 않으므로 로딩만 계속될 것이다.

### 6.3 Edit Video Part Two
우리는 같은 url에 post와 get을 사용하고 있는데, 이를 간단하게 한 줄로 줄일 수 있다. 아래의 두 코드는 동일한 일을 한다.
```
videoRouter.get("/:id(\\d+)/edit, getEdit);
videoRouter.post("/:id(\\d+)/edit, postEdit);
```

```
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
```

다음으로 postEdit 컨트롤러를 수정해보겠다. 컨트롤러가 실행되면 /videos/:id로 돌아가게 하려고 한다. 이때 사용가능한 것이 res.redirect()로, 안에 경로를 적어주면 그 위치로 가게 된다. id가 필요하므로 req.params에서 받아오고 res.redirect로 그 id에 해당하는 비디오로 돌려보내겠다. 그 후 req.body에서 title을 받아와서 비디오의 타이틀을 수정한다.

```
// videoController.js
...
export const postEdit = (req, res) => {
    const { id } = req.params;
    return res.redirect(`/videos/${id}`);
};
```

그런데 우리는 POST된 데이터를 어떻게 받아오는지 모른다. POST된 정보는 req.body에 들어있다. 우리는 title을 받아와서 이름을 바꿔주는 일을 하고 싶다. 그러므로 코드는 다음처럼 될 것이다.

```
// videoController.js
...
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    videos[id - 1].title = title;
    return res.redirect(`/videos/${id}`);
};
```

하지만 서버를 열어서 새로운 제목을 저장해봐도 제목이 바뀌지 않는다. 그 이유는 express가 form을 어떻게 다루는지 모르기 때문이다. 즉 데이터를 보내주더라도 서버에서 해석 가능한 형태가 아니기에 사용할 수 없다. 그래서 사용하는 것이 bodyParser로 데이터를 가공(parsing)해서 서버에서 이해할 수 있게 바꿔준다. express의 bodyParser는 express.urlencoded다. bodyParser가 라우터가 실행되기 전에 먼저 실행되어야 아무런 이상없이 작동하므로 server.js에서 라우터 앞에 코드를 만들어 준다.

```
// server.js
...
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
```

### 6.4 Recap

### 6.5 More Practice Part One

### 6.6 More Practice Part Two

### 6.7 Introduction to MongoDB
[MongoDB](https://docs.mongodb.com/manual/)는 NoSQL DBMS의 일종으로, 크로스 플랫폼 도큐먼트 지향 데이터베이스 시스템이다. 정의만 봐도 모르는 단어가 너무 많이 나와서 하나하나 설명이 필요하다. 먼저 NoSQL은 Not only SQL의 약자로 SQL만을 사용하지 않는 DBMS(DataBase Management System)을 말한다. 여기서 SQL(Structed Query Languare)는 데이터베이스에서 사용하는 자료 처리용 언어로 에스큐엘, 시퀄이라고 읽는다. SQL로 데이터를 다룰 수 있지만, MongoDB는 NoSQL이므로 SQL도 사용하고 추가로 다른 데이터베이스를 사용한다. 복잡하지만 간단히 말해 MongoDB는 JSON 형태로 데이터를 저장한다고 생각하면 된다.

MongoDB를 설치하려면 홈페이지에서 Resources -> Server -> Installation에 들어간다. 이것저것 있지만 우리가 사용할 것은 무료버전인 Community Edition이다. 각자 OS에 따라 설치법이 다르지만, 맥에서는 `xcode-select --install` `brew tap mongodb/brew` `brew install mongodb-community@5.0`를 순서대로 실행해주면 된다. MongoDB 버전에 따라 다를 수도 있으니 홈페이지에서 확인하고 설치하자.

마지막으로 MongoDB를 실행하려면 `brew services start mongodb-community@5.0`를 입력해주고 종료하려면 `brew services stop mongodb-community@5.0`를 입력하면 된다.

### 6.8 Connecting to Mongo
[mongoose](https://mongoosejs.com/)는 Node.js와 MongoDB를 연결시켜주는 일을 한다. mongoose를 사용하면 자바스크립트로 MongoDB를 사용할 수 있으므로 여러 언어를 사용하지 않아도 된다. 우선 설치한 MongoDB가 제대로 작동하는지 확인해보자. 터미널을 열어서 `mongod`를 입력하자. 그러면 여러 줄이 나오게 된다. 에러메세지만 나오지 않는다면 문제 없다. 확인되었다면 mongo라고 입력한다. 그러면 MongoDB shell이 열리게 되는데, 여기다 명령어를 입력하면 MongoDB를 다룰 수 있다. help, show dbs 같은 명령어를 입력할 수 있으면 확인이 끝났으므로 exit으로 나와준다. 마지막으로 `npm i mongoose`로 mongoose를 설치한다.

이번에는 데이터베이스를 만들어보겠다. server.js 옆에 db.js 파일을 하나 만든다. 우리는 컴퓨터에 실행되고 있는 mongo database에 연결시켜줄 것이다. 우선 mongoose를 import한다. `import mongoose from "mongoose";` 그 후 url과 mongoose를 연결시킨다. 연결시키는 명령은 `mongoose.connect("url")`로 해주면 된다. 여기서 url을 확인하려면 터미널에서 `mongo`를 입력한 후에 두번째 줄에 connecting to:에서 확인할 수 있다. 나 같은 경우는 mongodb://127.0.0.1:27017/ 였다. 여기다가 데이터베이스를 만들려면 /뒤에 데이터베이스 이름을 적어주면 된다. 데이터베이스 이름으로 wetube를 사용하고 싶으므로, `mongoose.connect("mongodb://127.0.0.1:27017/wetube")`를 입력한다. 이렇게 하면 
mongoose는 wetube라는 데이터베이스로 연결시켜준다.

그런에 아직 이 파일을 서버에서 사용하고 있지 않으므로 연결시켜줘야 한다. `import "./db";`를 server.js 파일 제일 위에 적어주면 된다. 그런데 이렇게 하고 로그를 보면 에러가 나온다. 정확히는 경고가 나오는데 { useNewUrlParser: true }를 사용해야 한다는 문장과 { useUnifiedTopology: true }를 사용해야 한다는 문장이 나온다. 이 두 문장을 넣어주면 db.js 파일은 다음처럼 된다.

```
// db.js
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

마지막으로 연결 성공 여부를 출력해주는 문장을 만들어주겠다. 여기서 on과 once의 차이는 on은 여러 번 사용할 수 있고, once는 한 번만 실행된다는 것이다.

```
// db.js
...
const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);
```

### 6.9 CRUD Introduction

### 6.10 Video Model

### 6.11 Our First Query

### 6.12 Our First Query part Two

### 6.13 Async Await

### 6.14 Returns and Renders

### 6.15 Creating a Video part One

### 6.16 Creating a Video part Two

### 6.17 Exceptions and Validation

### 6.18 More Schema

### 6.19 Video Detail

### 6.20 Edit Video part One

### 6.21 Edit Video part Two

### 6.22 Edit Video part Three

### 6.23 Middlewares

### 6.24 Statics

### 6.25 Delete Video

### 6.26 Search part One

### 6.27 Search part Two

### 6.28 Colclusions