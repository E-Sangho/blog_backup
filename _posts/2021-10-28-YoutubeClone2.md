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
CRUD는 컴퓨터 소프트웨어가 사용하는 가장 기본적인 데이터 처리 기능인 Create, Read, Update, Delete를 묶어서 쓰는 말이다. 앞으로는 우리가 만든 코드에도 CRUD를 적용시킬 것이다. 즉 비디오를 만들고, 불러오고, 수정하고, 삭제하는 기능을 만든다. 지금까지는 이런 일을 가짜 데이터베이스로 진행했지만, 이번 장에서는 진짜 데이터베이스를 만들어서 위의 일을 진행하겠다.

우선 src에 models라는 폴더를 만든다. 그 안에 Video.js라는 파일을 만들고 여기에 비디오의 모델을 만든다. 그러기 위해선 mongoose에게 우리가 사용할 데이터가 어떤 것을 포함하고 있는지 말해줘야 한다. 

### 6.10 Video Model
모델을 만들기 전에 mongoose를 import 해줘야 한다. 그리고 모델이 어떻게 생겼는지를 정해야 하는데 이를 Schema라고 한다. 스키마는 어떤 자료가 들어가고, 또 각 자료의 자료형으로 표현되는지 표현한 것이다. 몽구스는 스키마를 바탕으로 들어온 데이터를 검사하고, 스키마와 어긋나면 에러를 발생시킨다. 그렇기 때문에 스키마의 형태와 맞지 않는 데이터를 거를 수 있다. 스키마를 만드는 방법은 `new mongoose.Schema({});`안에 만들어주면 된다. 이때 각 자료와 자료형을 표현해줘야 한다. 아래를 보면 쉽게 이해할 수 있다.

```
// Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdAt: Date,
    hashtags: [{ type: String }],
    meta: {
        views: Number,
        rating: Number,
    },
});
```

위에서 meta를 보면 스키마 안에 또 스키마를 작성했는데, 이처럼 스키마 안에 스키마를 쓰는 것도 가능하다. 이렇게 작성한 스키마를 다른 파일에서 사용하려면 등록해줘야 한다. 이는 `mongoose.model("[Name]", [schemaName])` 형태로 작성하는데, schemaName에 작성한 스키마의 이름을 넣어주고 Name에 모델의 이름을 넣어주면 된다. 몽구스는 모델의 이름으로 컬렉션을 만든다. 예를 들어 Name이 Video면 컬렉션은 이를 소문자로 바꾸고 복수형으로 만들어서 videos가 된다. 이렇게 만든 파일을 다른 곳에서 불러와야하기 때문에 export 해준다.

```
// Video.js
...
const Video = mongoose.model("Video", videoSchema);

export default Video;
```

다음으로 server.js에서 import해준다. `import "./models/Video";`

```
// server.js
import "./db";
import "./models/Video";
import express from "express";
...
```

### 6.11 Our First Query
우리는 Video 모델을 만들어서 server.js 파일에 import 해주었다. 그런데 앞으로도 많은 파일들을 import 할텐데, import는 서버를 다루는 것이 아니므로 server.js와 상관이 없는 부분이다. 그래서 따로 파일을 만들어서 import 부분을 분리시켜주겠다. src 폴더에 init.js 파일을 생성한다. 앞으로는 이 파일로 서버를 시작할 것이다. 그렇게하면 server.js는 express에 관련된 부분을 작성하고, init은 시작하는데 필요한 것을 모을 것이다. 먼저 server.js 파이를 살펴보자. 익스프레스와 관련된 부분만 남기기로 했으므로, `import "./db"`, `import "./models/Video"`는 상관 없는 부분이다. 또한 `app.listen()` 또한 서버를 시작할 때 사용하는 것으로 서버자체와는 상관 없는 부분이다. 그러므로 이와 관련된 handleListening과 PORT 부분도 옮겨줘야 한다. 그렇게 되면 init.js 파일에서 app이 필요하므로 server.js에서 export 하고, init.js에서 import 해야 한다. 그러므로 init.js 파일과 server.js 파일은 다음처럼 바뀐다.

```
// init.js
import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4000;

const handleListening = () => {
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);
}

app.listen(PORT, handleListening);
```

```
// server.js
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");

app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
```

또한 시작하는 파일을 나눠줬기 때문에, server.js로 시작하는 것이 아니라 init.js로 시작해야 한다. 그러므로 package.json 파일에서 시작파일을 변경시켜준다.

```
// package.json
...
  "scripts": {
    "dev": "nodemon --exec babel-node src/init.js"
  },
...
```

앞으로 우리가 만든 진짜 데이터베이스를 사용하기 위해, 가짜 데이터베이스를 삭제하겠다. 간단히 말해 videoController.js에 있는 video와 관련된 코드를 모두 삭제하면 된다. 빈 부분이 많지만 우선 아래처럼 된다.

```
// videoController.js
export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};
export const watch = (req, res) => {
  const { id } = req.params;
  return res.render("watch", { pageTitle: `Watching` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  const { title } = req.body;
  return res.redirect("/");
};
```

여기서 데이터베이스를 사용하기 위해 파일을 import해주겠다. 그리고 trending 컨트롤러의 이름을 home으로 바꾼다. globalRouter의 trending도 home으로 바꿔야 하는 것을 잊지말자. 그리고 home 파일에 비디오를 가져오기위해 find를 사용했다.

```
// videoController.js
import Video from "../models/Video";

export const home = (req, res) => {
  Video.find({}, (error, videos) => {});
  return res.render("home", { pageTitle: "Home" });
};
...
```

mongoose는 다양한 [Queries](https://mongoosejs.com/docs/queries.html)를 사용한다. 링크를 따라가면 CRUD를 볼 수 있다. 그중에서 find 퀴리를 살펴보겠다. 형태는 Model.find([filter] [,projection] [,options] [,callback])의 모양이다. filter는 이름 그대로 조건을 만족하는 데이터만을 불러오는 기능이다. 아직 우리는 어떤 것도 필터링 하고 싶지 않으므로 {}를 사용하면 된다. 그 외의 조건은 우선은 넘기고 콜백 함수를 보겠다. 콜백함수는 err, docs라는 매개변수가 있는데, err는 이름 그대로 에러를 의미하고, docs는 모델의 컬렉션을 의미한다. 우리가 사용하는 모델은 video고 그 컬렉션은 videos가 되므로, docs는 videos가 된다.

### 6.12 Our First Query part Two
이번에는 error와 videos를 콘솔에 출력시켜보겠다. 그 전에 home.pug에서 videos를 사용하기 때문에 res.render에 videos를 보내줘야 한다. 우선은 비어있는 array로 보내주겠다.

```
// videoController.js
import Video from "../models/Video";

export const home = (req, res) => {
  Video.find({}, (error, videos) => {
    console.log("errors", error);
    console.log("videos", videos);
  });
  return res.render("home", { pageTitle: "Home", videos: [] });
};
```

서버를 실행하고 콘솔을 확인해보면 errors는 null, videos는 []가 나온다. 즉, 아무런 에러 없이 데이터베이스와 통신을 성공했다. 물론 아무런 비디오가 없으니 아무런 일도 하진 않지만, 그래도 작동은 한다. 우리는 Video.find의 videos를 사용하고 싶으므로 마지막 줄의 videos: []를 그냥 videos로 수정해주자.

다음으로 넘어가기 전에 자바스크립트의 비동기 처리를 알아보자. 런타임이란 프로그램이 실행되고 있는 시간, 또는 공간을 말한다. 자바스크립트는 Node.js가 나오기 전에는 익스플로어, 파이어폭스, 크롬 같은 웹 브라우저만이 런타임으로 사용되었다. 브라우저의 런타임은 크게 4가지 요소로 구성된다.

- JavaScript Engine: 힙 메모리, 콜 스택을 포함하는 자바스크립트 해석 엔진
- WebAPI: DOM 조작, 네트워크 요청, 응답 등의 브라우저 기능
- Callback Queue: WebAPI에서 전달받은 콜백 함수 저장
- Event Loop: 콜 스택이 빌때마다, 콜백큐에서 콜백함수를 콜스택으로 하나씩 옮긴다.

자바스크립트는 싱글 쓰레드 언어로 한 번에 한 가지 일만 처리가 가능하다. 처리해야 하는 일은 스택으로 쌓아서 만드는데 작업을 하나밖에 처리하지 못하기 때문에 코드 전체가 멈추고 결과가 나와야 다시 시작된다. 그런데 작업이 굉장히 오래 걸리게 되면 문제가 생긴다. 보통 브라우저는 60프레임인데 만약 16ms 안에 작업이 끝나지 않으면 브라우저가 끊겨서 보이게 된다. 그렇기 때문에 작업이 오래 걸리는 일은 비동기 함수로 만들어서 WebAPI로 보내서 일을 대신 시키고 결과를 받아오게 된다.

콜백은 비동기적인 함수를 불러오면 이를 WebAPI로 보낸다. WebAPI는 브라우저에서 제공하는 API로 콜스택에서 불러온 함수를 처리하는데, WebAPI는 자바스크립트와 달리 싱글 스레드가 아니다. WebAPI는 멀티 스레드로 동시에 여러가지 일을 처리한다. 하지만 멀티 스레드의 특성상 일처리의 끝나는 순서가 다를 수 있다. 끝난 작업은 순서대로 콜백큐에 쌓이게 된다. 그리고 만약 콜스택이 비어있다면 이벤트루프가 콜백큐의 작업을 콜스택으로 옮겨준다. 

결론적으로 자바스크립트는 작업을 콜스택에 올리고 비동기 함수들은 WebAPI에 위임했다가 결과를 받아와서 실행하게 된다. 그 때문에 작업 순서에 변화가 생기기도 한다. 다음 코드를 확인해보자.

```
// videoController.js
import Video from "../models/Video";

export const home = (req, res) => {
  Video.find({}, (error, videos) => {
    console.log("errors", error);
    console.log("videos", videos);
  });
  console.log("hello");
  return res.render("home", { pageTitle: "Home", videos: [] });
};
```

이 코드를 실행시키면 순서대로 errors, videos 다음에 hello가 나와야 할 것 같다. 그런데 실행해보면 hello가 먼저 오게 된다. 이는 Video.find()가 비동기 함수이기 때문이다. 즉 Video.find()를 실행하면 이를 WebAPI에 넘겨주고 다른 작업들을 실행하다가 Video.find()의 결과를 받아오는 것이다. 특히 이때 문제가 생기는 부분은 return이다. 우리는 Video.find()에서 videos를 받아와서 res.render에 넘겨주고 싶다. 그런데 비동기화 때문에 생각한대로 작동하지 않는다. 이를 해결하기 위해서는 return을 Video.find() 안에 넣어줘야 한다. 이런 일을 종종 발생하게 되는데, 이를 처리하는 가장 간단한 방법은 콜백함수를 사용하는 것이다. 다음에 하고 싶은 일을 콜백함수로 넣어줘서 작업을 순서대로 실행되게 만드는 것이다. 하지만 이렇게 하면 콜백 지옥이란게 발생하는데, 콜백함수를 너무 많이 사용해서 코드를 도저히 알아볼 수 없게 되는 것이다. 예를 들어서 다음 코드를 보자.

```
step1(function (err, value1) {
    if (err) {
        console.log(err);
        return;
    }
    step2(function (err, value2) {
        if (err) {
            console.log(err);
            return;
        }
        step3(function (err, value3) {
            if (err) {
                console.log(err);
                return;
            }
            step4(function (err, value4) {
                ...
            });
        });
    });
});
```
위는 step1 -> step2 -> step3 ... 순서로 코드를 실행시키려고 만든 것이다. 그리고 사이사이 에러가 발새앟면 멈추도록 만들었다. 보다시피 별거 아닌 코드임에도 굉장히 가독성이 떨어진다. 그런데 이런 코드가 몇 개나 쌓이게 되면 도저히 이해할 수 없는 코드가 만들어지는 것이다. 이를 고치는 방법은 다음에 배워보겠다.

### 6.13 Async Await
비동기 함수를 async 함수로 만들기 위해서는 function() 앞에 async 키워드를 추가한다. async는 await 키워드가 비동기 코드를 호출할 수 있게 해주며, 비동기 함수를 동기 함수처럼 사용할 수 있게 만들어준다. 이전의 home 컨트롤러를 async/await를 사용해서 만들어보겠다.

```
// videoController.js
...
export const home = async (req, res) => {
  console.log("start");
  const videos = await Video.find({});
  console.log("finish");
  return res.render("home", {pageTitle: "Home", videos});
};
```

보다시피 원래 비동기 함수였던 Video.find() 앞에 await를 붙였다. 그리고 작동 순서를 보여주기 위해 console.log로 몇 가지 출력을 해주었다. await을 사용하지 않았을 때는 Video.find()가 제일 마지막에 실행됬었다. 하지만 위의 코드를 실행시키면 코드의 순서대로 작동한다. 즉 async/await을 쓰면 코드가 순서대로 작동하는 것을 알 수 있다. 이는 우리에게 굉장히 직관적인 방식이기 때문에 코드 작성이 효율적이게 된다. 

그런데 기존 Video.find()는 콜백함수로 (err, docs)를 매개변수로 하는 함수를 사용했다. 위의 코드를 보면 videos를 docs로 받아오는 것은 알 수 있지만 err 처리 부분이 없다. 이는 try catch로 해결할 수 있다. 예를 들어서 아래처럼 가능하다.

```
// videoController.js
...
export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", {pageTitle: "Home", videos});
  } catch(error) {
    return res.render("server-error", { error });
  }
};
```

위의 코드를 보면 먼저 try를 실행한다. 그러다가 await에서 err가 발생하면 밑의 catch(error)에서 err을 error로 받아들여서 사용하게 된다. 위는 에러가 발생하면 "server-error"라는 페이지가 열리도록 만들었다. 만약 에러를 사용할 생각이 없다면 error을 빼고 아래처럼 작성할 수도 있다.

```
// videoController.js
...
export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", {pageTitle: "Home", videos});
  } catch {
    return res.render("server-error");
  }
};
```

### 6.14 Returns and Renders
이전에 작성한 코드는 다음과 같다.

```
// videoController.js
export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};
```

여기서 설명을 위해서 코드를 잠시 아래처럼 고쳐보겠다.

```
export const home = async (req, res) => {
  Video.find({}, (error, videos) => {
    return res.render("home", {pageTitle: "Home", videos });
  });
};
```
그런데 여기서 return은 아무런 일도 하지 않는다. 그 이유는 return이 home 속의 함수에서 사용되었기 때문이다. 즉 home 바로 아래에서 쓰이지 않았으므로 home은 아무런 리턴값이 없다. 실제로 위의 코드를 return을 빼고 실행하더라도 아무런 문제도 없이 작동한다.

```
export const home = async (req, res) => {
  Video.find({}, (error, videos) => {
    res.render("home", {pageTitle: "Home", videos });
  });
};
```

이번에는 res.render을 2번 사용해보겠다.

```
export const home = async (req, res) => {
  Video.find({}, (error, videos) => {
    res.render("home", {pageTitle: "Home", videos });
    res.render("home", {pageTitle: "Home", videos });
  });
};
```

그런데 이렇게 하면 화면은 그대로 출력되지만 콘솔을 보면 에러가 나온다. 이는 랜더링 이후에 다시 랜더링을 할 수 없기 때문에 생기는 현상이다. 여기서 우리가 return을 사용했던 이유가 있다. return은 아무런 반환값이 없지만 코드를 종료시켜주는 효과가 있다. 그렇기 때문에 res.render에 return을 붙여주면 확실하게 그 코드가 종료되었다는 것을 확신할 수 있는 것이다. 위의 코드에서도 첫 번째 랜더링에 return을 붙여주면 아래 코드는 동작하지 않는다. 그렇기 때문에 우리는 랜더링을 하는 곳에 return을 붙여서 에러가 발생하는 것을 막아줘야 한다.

### 6.15 Creating a Video part One
비디오를 업로드하는 부분을 고쳐서 데이터를 업로드 할 수 있게 만들겠다. upload.pug의 코드를 고쳐서 title, description, hashtag를 입력받도록 만들어준다. 이때 name을 꼭 붙여서 만들어야 데이터가 전달되고 req.body로 사용할 수 있음을 기억하자.

```
// upload.pug
extends base.pug

block content
    form(method="POST")
        input(placeholder="Title", required, type="text", name="title")
        input(placeholder="Description", required, type="text", name="description")
        input(placeholder="Hashtags, separated by comma.", required, type="text", name="hashtags")
        input(type="submit", value="Upload Video")
```

다음으로 이를 실제로 컨트롤러에서 받아서 데이터를 만들어보겠다. upload.pug에서 전달된 데이터는 라우터를 거쳐서 postUpload 컨트롤러에서 사용한다. 전달받은 데이터를 `const { title, decsription, hashtags } = req.body;`로 받아준다. 그 후 우리가 만든 Video 스키마에 맞춰서 document를 만들어줘야 한다. 여기서 document는 데이터를 가진 비디오라고 생각하면 된다. document를 만들 때, `title: title`이라고 적어주면 title에 req.body.title이 들어가는데, 위치만 같다면 이를 간단히 title로도 적어줘도 된다.

```
// videoController.js
...
export const postUpload = (req, res) => {
  const { title, description, hashtags } = req.body;
  const video = new Video({
    title: title,           // or you can use title,
    description: description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  console.log(video);
  return res.redirect("/");
};
```

이때 createdAt에는 현재 시간이 들어가야 하므로 Date.now()를 사용했고, meta에서 views, rating은 0으로 만들었다. 그런데 hashtags는 string 형태로 들어오는데, 우리가 작성한 스키마에서는 string의 array로 만들었으므로 이를 split으로 나눠줘야 한다. `hashtags.split(",")`를 사용해서 ,를 기준으로 hashtags를 나눠준다. 그 후 #을 붙여야 하므로 ```.map((word) => `#${word}`)```를 사용해서 글자 앞에 #을 만든다. 이렇게 한 후에 console.log(video)로 우리가 만든 비디오를 확인해보면 된다.

여기까지 작성했으면 비디오를 하나 만들어서 업로드를 누른다. 그렇게 하면 콘솔에서 우리가 올린 비디오의 정보를 볼 수 있다. 그런데 여기서 우리가 사용한적 없는 _id라는 것이 있는데 이는 몽구스가 만들어준 것으로, 현재는 이런 것이 있다는 것만 기억하면 된다. 그런데 아직은 데이터를 데이터베이스에 저장하는 기능이 없으므로 홈화면에서 데이터를 확인할 수 없다.

### 6.16 Creating a Video part Two
데이터를 정해진 자료형과 다른 것을 넣으면 어떻게 될까? 숫자를 넣으면 string으로 바꿔서 넣어주게 된다. 그렇다면 숫자를 넣어줘야 하는 부분에 string을 넣으면 어떻게 될까? 데이터는 잘못 넣은 부분을 제외하고 만들어진다. 이는 우리가 스키마를 만든 이유로 자료형에 맞지 않은 데이터가 들어오면 이를 알아서 처리해준다. 변환할 수 있다면 변환해주고 아니라면 무시하고 진행하는 것이다.

데이터를 데이터베이스에 저장하는 것은 간단하다. 우리의 데이터는 video 이므로 `video.save()`를 해주면 된다. 이때 save는 promise를 반환하므로 async/await를 사용해서 저장되는 것을 기다려줘야 한다.

```
// videoController.js
...
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const video = new Video({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  await video.save();
  return res.redirect("/");
};
```

여기서 Video.create를 사용하면 위의 코드와 완전히 동일한 역할을 하는 코드를 만들 수 있다.

```
// videoController.js
...
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  await Video.create({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  return res.redirect("/");
};
```

둘의 차이점은 하나는 자바스크립트 오브젝트를 만든 다음에 저장하는 것이고, Video.create는 이를 자동으로 처리해준다는 점 뿐이다. 그런데 저장하는 자료가 잘못된 데이터가 들어있으면, 데이터베이스에 저장되지 않는다. 대신 브라우저가 저장을 계속 기다리게 된다. 그러므로 이를 처리하기 위해선 try catch로 에러를 처리해줘야 한다.

### 6.17 Exceptions and Validation
앞서 도큐먼트를 만들 때, 잘못된 자료형을 넣어주면 에러가 발생하는 것을 보았다. 그렇다면 데이터가 아예 누락되먼 어떻게 될까? 우리 코드에서 createdAt을 완전히 지우고 실행시키면 문제 없이 작동하지만, createdAt은 포함되지 않는 것을 볼 수 있다. 이는 우리가 스키마를 만들 때, required를 써주지 않았기 때문이다. 만약 데이터를 꼭 넣도록 만들고 싶다면 `createdAt: { type: Date, required: true };`로 required를 적어줘야 한다. 그런데 required라고 적어줬는데 데이터를 보내지 않는다면 당연히 에러가 발생한다. 그렇기 때문에 try/catch를 사용해야 한다.

```
// videoController.js
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      createdAt: Date.now(),
      hashtags: hashtags.split(",").map((word) => `#${word}`),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.render("upload", { pageTitle: "Upload Video" });
  }
};
```

위의 코드는 try/catch를 사용해서 에러가 발생했을 경우 콘솔에 에러를 출력하고, 페이지를 다시 불러온다. 그런데 여기서 에러를 다시 페이지로 보내는 방법도 있다. 그렇게 하려면 res.render를 수정해야 한다. 잠시 콘솔에 에러를 확인하면 에러 중에 _message라는 것이 있다. 여기에 에러가 발생한 이유를 적어주는데 우리는 이를 res.render에 포함시켜서 보내겠다. 그리고 upload 페이지를 수정해서 에러 메세지가 보이게 만든다.

```
// videoController.js
...
  } catch (error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
}
```

```
// upload.pug
extends base.pug

block content
    if errorMessage
        span=errorMessage
    form(method="POST")
        input(placeholder="Title", required, type="text", name="title")
        input(placeholder="Description", required, type="text", name="description")
```

다시 도큐먼트로 돌아가서 생각해보자. createdAt이나 meta 같은 것은 매번 만들때마다 동일한 코드로 만든다. 그렇다면 스키마에서 디폴트를 설정해서 입력이 있으면 입력 받은 값을 사용하고, 아니라면 디폴트 값을 사용하게 만들 수 있다.

```
// Video.js
...
  createdAt: { type: Date, required: true, default: Date.now },
...
```

그런데 여기서 Date.now와 Date.now()라고 작성하는 것에는 차이가 있다. Date.now()라고 만들면 코드가 알아서 작동되기 때문에 날짜가 처음 모델을 불러온 순간으로 고정된다. 그렇지만 Date.now라고 적어주면 몽구스는 굉장히 똑똑하기 때문에, 도큐먼트를 만들 때 실행되고 시간을 만든 시간에 맞춰준다. meta에도 디폴트를 사용해서 값을 정하면 코드를 더 간결하게 만들 수 있다.

```
// Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});
```

```
// videoController.js
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
```

### 6.18 More Schema
[스키마타입](https://mongoosejs.com/docs/schematypes.html)에는 String, Number, Date, Boolean 등 여러가지 종류가 있다. 그리고 각 스키마타입은 옵션이 있다. 예를 들어서 String은 uppercase: true를 사용하면 글자가 uppercase로 저장된다.

```
// Video.js
...
  title: { type: String, required: true, uppercase: true };
...
```

그 외에도 양옆의 빈 공간을 지우는 trim, 최대 길이를 제한하는 maxLength, 최소 길이를 제한하는 minLength 등이 있다. 다만 길이를 제한할 때는 upload.pug의 input에도 minlength, maxlength로 길이를 제한해야 새로운 비디오를 만들때 에러 없이 만들 수 있다. 그런데 웹 브라우저에서 길이를 제한하는 기능이 있는데도 왜 스키마에서도 설정해줘야 할까? 이는 HTML은 브라우저에서 쉽게 지울 수 있기 때문에, 해킹 등의 비정상적인 방법으로 잘못된 데이터가 들어올 수도 있기 때문이다. 그러므로 스키마에도 만들어주고 upload.pug에도 만들어줘야 한다.

```
// Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
```

```
// upload.pug
...
        input(placeholder="Title", required, type="text", name="title", maxlength=80)
        input(placeholder="Description", required, type="text", name="description", minlength=20)
...
```

마지막으로 video.pug를 조금 고쳐서 우리가 저장한 정보를 표현하도록 만들겠다.

```
// video.pug
    div
        h4
            a(href=`/videos/${video.id}`)=video.title
        p=video.description
        small=video.createdAt
        hr
```

그런데 페이지에서 비디오를 눌러보면 cannot GET 메세지가 나온다. 주소를 보면 비디오의 _id로 주소가 만들어져 있음을 알 수 있다. 그런데 우리는 라우터를 만들 때, 숫자만 받아들이도록 만들었으므로 string이 들어오면 cannot GET이 나오는 것이다. 이는 다음에 수정해보겠다.

### 6.19 Video Detail
라우터 주소를 바꾸기 위해 정규 표현식을 고쳐줘야 한다. 도큐먼트의 _id는 24자리의 hexadecimal로 표현된다. 그러므로 0 ~ F까지의 수로 24자리를 표현하는 정규식을 만들어줘야 한다. 정규식은 간단하게 /[0-9a-f]{24}/로 표현된다. 이를 우리가 작성한 라우터에서 고쳐주자.

```
// videoRouter.js
...
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
...
```

하지만 아직도 watch에서 에러가 발생하는데 이는 watch.pug에서 views라는 없는 데이터를 가져오려고 하기 때문이다. 그러므로 이를 고쳐서 다음처럼 만들자.

```
// watch.pug
extends base.pug

block content
    div
        p=video.description
        small=video.createdAt
    a(href=`${video.id}/edit`) Edit Video &rarr;
```

마지막으로 컨트롤러를 수정해주자. findById는 id로 영상을 찾는 기능을 지원하고 findOne은 조건을 만족하는 영상을 찾아낸다. 우리는 findById로 영상을 찾아주겠다.

```
// videoController.js
export const watch async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render("watch", { pageTitle: video.title, video });
}
```

### 6.20 Edit Video part One
존재하지 않는 비디오로 접근하면 어떻게 될까? 비디오가 없기 때문에 null이 반환되는데, 우리는 랜더링에서 video.title을 사용하고 있다. 그런데 video가 null이므로 에러가 발생한다. 그러므로 if else로 처리해줘야 한다. 비디오가 null일 경우 404페이지를 불러오도록 만들자.

```
// videoController.js
...
  if(!video) {
    return res.render("404", { pageTitle: "Video not found."});
  }
  return res.render("watch", { pageTitle: video.title, video });)
...
```

```
// 404.pug
extend base
```

그리고 base.pug의 a를 수정해서 home으로 가는 링크를 만들겠다.

```
// base.pug
...
    li
      a(href="/") Home
```

마지막으로 같은 코드를 getEdit에도 만들어준다. 이때 edit에서 video가 필요하므로 변수로 넘겨준다. 그리고 edit에서는 description과 hashtags를 input에 넣어준다. 그런데 hashtags가 array이므로 그대로 출력하면 array가 나온다. array.join()을 사용하면 array를 string으로 바꿀 수 있다는 것을 이용해서 아래처럼 만든다.

```
// videoController.js
...
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};
```

```
// edit.pug
...
block content
    h4 Update Video
    form(method="POST")
        input(name="title", placeholder="Video Title", value=video.title, required)
        input(placeholder="Description", required, type="text", name="description", minlength=20, value=video.description)
```

### 6.21 Edit Video part Two
videos/_id/edit에서 save 버튼을 누르면 postEdit이 실행된다. postEdit이 실행되었을 때 비디오의 정보를 업데이트 하도록 만들어보겠다.

```
// videoController.js
...
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if(!video) {
    return res.render("404", { pageTitle: "Page not found." });
  }
  video.title = title;
  video.description = description;
  video.hashtags = hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
  await video.save();
  return res.redirect(`/videos/${id}`);
}
```

다른 부분은 이미 다뤘기에 별다른 문제 없이 이해하겠지만 hashtags를 바꿔주는 부분은 새로운 코드다. 이는 해시태그를 고칠때마다 #이 계속 붙어버리기 때문에 코드를 수정한 것이다. 삼항연산자와 startsWith를 사용해서, 제일 첫 글자가 #인지 아닌지를 판별하고 #이 아니라면 붙여주고 맞다면 그대로 둔다. 하지만 이렇게 바꿔줄 경우 같은 코드를 공유하는 곳을 다 다시 수정해줘야 한다. 우리 코드에서도 postUpload 속의 hashtags도 수정해줘야 한다. 하지만 이를 쉽게 해주는 기능이 있는데 다음 시간에 배워보겠다.

### 6.22 Edit Video part Three
몽구스는 다양한 기능을 제공하는데 그 중 하나가 Model.findByIdAndUpdate([id] [,update] [,options] [,callback])다. findByIdAndUpdate는 id에 해당하는 데이터를 찾아서 update 속의 객체로 데이터를 바꿔준다. 이를 활용하면 위의 코드를 다음처럼 바꿀 수 있다.

```
// videoController.js
...
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if(!video) {
    return res.render("404", { pageTitle: "Page not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: hashtags
      .split(",")
      .map((word) => (word.startsWith("#") ? word : `#${word}`)),
  });
  return res.redirect(`/videos/${id}`);
};
```

그 외에도 몽구스는 Model.exists([filter] [,options] [,callback])이 있는데, 이는 filter 조건에 맞는 Model이 있는지 확인하고 있다면 true를 없다면 false를 반환한다. 위에서 우리는 `const video = await Video.findById(id)`를 사용하고 있는데 이 부분에서 찾아낸 video로 하는 것이 없다. 그렇다면 id가 존재하는지 여부만 필요하므로 Video.exists로 바꿔줘도 된다.

```
// videoController.js
...
  const video = await Video.exists({ _id: id });
...
```

다음으로 해시태그를 처리하는 방법을 알아보겠다. 해시태그를 살펴보면 우리가 비디오를 저장하거나 생성하기 전에 해시태그를 처리하고 있다. 그런데 이 부분은 Model에 저장하기 전에 하는 것이다. 즉, 영상을 저장하기 전에 처리하는 일이 존재하는 것이다. 지금은 해시태그만 있지만, 앞으로는 더 많아질 것이다. 존재하는 이메일인지 확인하거나, 파일이 존재하는 등의 체크를 해야한다. 그렇기 때문에 몽구스는 모델을 만들거나 업데이트 하기전에 처리하는 함수를 제공한다. 이를 middleware라고 부르는데 express의 미들웨어와 동일하다. 우리가 영상을 생성하거나 업데이트 할 때, 중간에 실행하는 함수다. 다음에는 어떻게하면 미들웨어를 사용하는지 배워보겠다.

### 6.23 Middlewares
몽구스를 사용하면 에러메세지가 나오는데 이를 해결하는 방법은 ds.js에 `useFindAndModify: false`를 사용하면 된다. 이는 몽구스가 오래된 것을 처리하는 방법이라 따라하는 것 외에 방법이 없다. 만약 몽구스가 6.x 이상의 버전이라면 userFindAndModify의 기본값이 false이므로 에러도 뜨지 않고 아무런 처리도 해주지 않아도 된다.

몽구스에서 [미들웨어](https://mongoosejs.com/docs/middleware.html)를 살펴보기 전에 express에서의 미들웨어를 기억해보자. 익스프레스의 미들웨어는 req를 중간에 가로채서 일을 처리하고 다음 함수를 호출한다. 마찬가지로 몽구스에서는 도큐먼트에 무슨 일이 생기기 전이나 후에 미들웨어를 적용한다. 예를 들어서 save하기 전후에 미들웨어를 사용할 수 있다. 

미들웨어의 형태는 `schema.pre('save', function(next) { next(); })`의 형태로 표현된다. 주의할 점은 반드시 model을 사용하기 전에 써야 한다. 여기서 중요한 것이 있다. this라는 키워드는 우리가 저장하고 있는 비디오의 정보를 담고 있다. 아래는 미들웨어를 이용해서 데이터가 저장될 때, 그 데이터를 콘솔에 출력시킨다.

```
// Video.js
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, minlength: 20 },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, trim: true }],
    meta: {
        views: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
    },
});

videoSchema.pre("save", async function() {
  console.log(this);
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
```

Upload Video에서 비디오를 저장시킨 후에 콘솔을 확인해보면, 저장한 비디오의 정보가 담겨있는 것을 볼 수 있다. 이때 hashtags가 처리되는 부분인 `hashtags.split.map`을 컨트롤러에서 지울경우 어떻게 될까? 입력값은 string인데 스키마에 따르면 array가 들어와야 한다. 그러므로 스키마는 이를 array의 첫 번째 원소라고 해석을 하고 받아들인다. 그래서 콘솔을 확인해보면 hashtags가 array지만 원소가 하나뿐인 것으로 나온다.

그런데 save 미들웨어에서 hashtags를 처리할 수 있으면 다른 컨트롤러에서 hashtags를 다루는 부분을 아무런 처리 없이 사용할 수 있다. 그러므로 미들웨어에서 hashtags를 수정한다.

```
// Video.js
...
videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => word.startsWith("#") ? word : `#${word}`);
});
...
```

위와 같이 수정하면 저장할 때, 알아서 hashtags를 적절히 변환시켜준다. 그러므로 컨트롤러에서도 코드를 간단하게 만들 수 있다.

```
// videoController.js
...
  await Video.create({
    title,
    description,
    hashtags,
  });
...
```

지금까지 수정한 것은 비디오를 upload 할 때만 된다. 다음에는 비디오를 edit할 경우에도 처리하도록 만들어보겠다.

### 6.24 Statics
findByIdAndUpdate는 pre 미들웨어가 없다. 대신에 findByIdAndUpdate는 findOneAndUpdate를 호출하는데, findOneAndUpdate는 pre middleware가 있다. 그런데 findOneAndUpdate는 save hook을 호출하지 않고, 업데이트 하려면 도큐먼트에 접근할 수도 없다.

### 6.25 Delete Video

### 6.26 Search part One

### 6.27 Search part Two

### 6.28 Colclusions