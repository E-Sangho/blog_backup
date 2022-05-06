---
layout: post
title: [Youtube Clone] Routers
date: Tue Dec 14 15:22:14 JST 2021
categories: Node.js Router
tag:
toc: true
---

## 1. 소개

웹 사이트는 여러 개의 페이지로 구성된다.
예를 들어서 유튜브의 경우 홈, 탐색, 구독, 동영상 시청 등의 페이지가 존재한다.
아래는 몇 몇 유튜브 페이지의 URL이다.

-   홈: https://www.youtube.com
-   탐색: https://www.youtube.com/feed/explore
-   구독: https://www.youtube.com/feed/subscriptions
-   보관함: https://www.youtube.com/feed/library

그런데 위의 URL은 언제나 동일하다.
다시 말해서 같은 URL은 같은 페이지와 기능을 제공한다는 것이다.
이는 클라이언트가 URL과 HTTP method를 보내주면, 서버에서 거기에 맞는 페이지를 보여주기 때문에 가능한 것이다.
Express도 이와 같은 기능을 제공하는데, 이를 라우팅(Routing)이라고 한다.
이번에는 라우팅이 무엇이고 또 어떻게 위의 기능을 만드는지 알아보겠다.

## 2. Routing

**라우팅(Routing)**은 애플리케이션의 endpoint(URI)로 클라이언트의 요청이 들어올 때, 이에 응답하는 방법을 정하는 것을 말한다.
여기서 URI는 URL과 조금 차이가 있지만, 지금은 동일하게 생각해도 된다.
라우팅은 만드는 행동을 명사화 한 것으로 실제로 만드는 대상은 **라우트(Route)**라고 한다.
라우트는 `app.METHOD(PATH, HANDLER)`의 형태로 만든다.
각각의 의미는 아래와 같다.

-   app: express의 instance
-   METHOD: HTTP request method
-   PATH: 서버에서의 경로
-   HANDLER: 경로가 맞을 경우 실행하는 콜백 함수

라우트는 METHOD와 PATH가 일치하는 요청이 들어오면 HANDLER를 실행시킨다.
예를 들어 유튜브의 탐색 창에 접속했다고 하자.
그러면 PATH는 /feed/explore가 된다.
왜냐하면 /는 root를 의미하고 유튜브에서 /는 "https://www.youtube.com"이므로, /feed/explore가 가르키는 것이 "https://www.youtube.com/feed/explore"이기 때문이다.
다음으로 METHOD는 단순한 접속이므로 GET이 된다.
유튜브 서버에서는 METHOD가 GET이고, PATH가 /feed/explore인 라우트가 있는지 확인한다.
만약 존재한다면 해당 라우트의 HANDLER를 실행시킨다.

이제 각각을 실제 코드로 확인해보자.
app은 앞서 우리가 만든 express의 instance, 다시 말해 `const app = express()`를 의미한다.
그리고 METHOD는 HTTP request인 GET, POST, PUT, DELETE 등을 사용할 수 있는데 소문자로 적어야 한다.
그리고 PATH는 말 그대로 경로를 적어주면 된다.
만약 홈에 가는 라우트를 만드려고 하면, `app.get("/", HANDLER)`로 적어주면 된다.
여기서 HANDLER에는 실행시킬 콜백함수를 적는다.
아래는 이를 바탕으로 만든 예시다.

```
import express from "express"
const app = express();


app.get("/", function (req, res) => {
    res.send("GET request at /");
});
```

## 3. Route methods

우리가 GET 요청에 응답하는 app.get()을 사용했지만, 그 외에도 HTTP method에 응답하는 다른 방법들이 있다.
이들은 **Route methods**라고 하며 app과 같은 express의 인스턴스에 사용할 수 있다.
대표적인 것이 위에서 사용한 .get()이고 그 외에도, .post(), .all() 등이 있다.

```
app.get("/", function (req, res) {
    res.send("GET");
});

app.post("/", function (req, res) {
    res.send("POST");
});

app.put("/", function (req, res) {
    res.send("PUT");
});

app.delete("/", function (req, res) {
    res.send("DELETE");
});
```

## 4. Route paths

라우트의 PATH에 들어가는 주소를 **Route paths**라고 한다.
Route path는 string이 주로 들어가며, regular expression을 사용해서 표현할 수도 있다.
위에서 우리는 route로 "/"를 사용했는데, 그 외에도 "/feed" 같은 문자열도 가능하며, "ab\*cd"처럼 regular expression을 사용할 수도 있다.

## 5. Router

주소를 보면 도, 시, 도로명으로 각 위치를 구분하고 있다.
건물을 구분하기 위한 용도라면, 꼭 주소를 사용하지 않고 랜덤한 숫자를 사용해도 될 것이다.
하지만 그렇게 하지 않는 이유는 주소가 길을 찾는 역할도 겸하기 때문이다.
그래서 모르는 곳에 가더라도, 표지판을 보고서 어느 정도는 길을 찾아갈 수 있게 된다.

URL을 흔히 웹 주소라고 한다.
이는 URL이 현실의 주소와 비슷한 점이 많기 때문이다.
예를 들어서 유튜브에서 비디오를 시청하는 곳을 보면 "https://www.youtube.com/watch"까지는 동일하고 그 뒤가 조금 다르다는 것을 알 수 있다.
이는 마치 아파트처럼 대부분의 주소는 동일하지만, 세부 주소만 다른 형태다.
아파트도 위치와 안의 구조는 동일하지만, 안의 배치만 다른 형태다.
동영상을 재생할 때도, 영상만 다를 뿐 그외의 내용물의 배치는 동일한 형태다.
그 외에도 /feed/explore, /feed/subscriptions, /feed/library를 보면 /feed가 반복된다.
이는 위의 페이지들이 /feed라는 같은 키워드로 묶여있기 때문이다.

웹 주소가 이런 형태를 띄는 이유는 해당 주소로 기능을 찾기 때문이다.
예를 들어서 비디오를 편집하거나 지우는 기능이 있다면, /videos/edit, /videos/delete와 같은 주소에 있기를 기대하지, 아무런 문자열에나 있기를 원하지는 않는다.
왜냐하면 해당 기능들이 비디오라는 카테고리에서 할 수 있는 일이기 때문이다.
이처럼 주소를 만들 때는 유사하거나, 같은 소속의 기능은 주소를 공유하도록 만들게 된다.
그렇기 때문에 위의 /feed처럼 공통되는 주소를 만들 필요가 있다.

공통된 주소, 또는 주소의 갈림길을 만들기 위해 사용하는 것이 **라우터(Router)**다.
라우터는 `express.Router()`로 만들 수 있는데, 라우터는 이전의 app과 비슷한 역할을 한다.
`app.METHOD(PATH, HANDLER)`로 경로와 요청이 맞으면 HANDLER를 실행했던 것처럼, `router.METHOD(PATH, HANDLER)`로 사용가능하다.
예를 들어서 아래처럼 사용할 수 있다.

```
import express from "express"
const router = express.Router();

router.get("/", function (req, res) {
    res.send("This is router");
});
```

여기서 볼 수 있듯이 라우터는 app과 동일한 기능을 한다.
한 가지 차이점이 있다면, 라우터는 미들웨어처럼 작동한다는 것이다.
그래서 app.use()의 인자로 사용 가능할 뿐만 아니라, 다른 라우터의 router.use()에도 사용 가능하다.
아래의 예시를 보자.

```
import express from "express"
const app = express();
const router = express.Router();

router.get("/", function (req, res) {
    res.send("Here is /video");
});

router.get("/edit", function (req, res) {
    res.send("Here is /video/edit");
});

app.use("/video", router);
```

위의 코드는 /video에 접속하면 "Here is /video"가 출력되고, /video/edit에 접속하면 "Here is /video/edit"이 출력된다.
그런데 우리 코드를 보면 /video/edit은 어디에도 작성하지 않았다.
그럼에도 /video/edit에 접속할 수 있는 것은 라우터가 미들웨어처럼 쓰이기 때문이다.
/video/edit에 접속하면 app.use("/video", router)이 실행된다.
여기서 라우터는 미들웨어처럼 작동하므로 이전의 정보를 가지고 간다.
이전의 정보 중에는 현재 위치가 /video라는 것도 포함하고 있는데, 이 때문에 /의 해석 방법이 바뀐다.
알다시피 /는 루트 디렉토리를 의미하는데, 라우터가 받은 정보로는 현재 위치는 /video가 된다.
그렇기 때문에 라우터에게 /는 /video가 되고, /edit은 /video/edit이 된다.
이런 특성을 사용해서 app.use()와 라우터를 같이 사용하면 공통되는 주소를 기점으로 나누는 것이 가능하다.

## 6. import & export

지금까지는 주소가 굉장히 간단했다.
그런데 우리는 굉장히 많은 주소를 작성해야 한다.
/login, /video, /profile 등이 있을 것이고, 또 그 안에 /video/edit, /video/upload, /video/delete로 나뉘게 된다.
하지만 이들을 모두 한 파일에 작성하게 된다면 코드가 번잡해진다.
그렇기 때문에 라우터별로 코드를 나누게 된다.
여기서 분리된 각각의 파일을 모듈(Module)이라고 하는데, 하나의 클래스나 여러 개의 함수로 구성되어 있다.
아래는 라우터 파일을 따로 만들어서 나눈 것이다.

```
import express from "express";

const app = express();

app.use("/video", router);
```

```
// videoRouter.js
import express from "express"
const router = express.Router();

router.get("/", function (req, res) {
    res.send("Here is /video");
});

router.get("/edit", function (req, res) {
    res.send("Here is /video/edit");
});
```

이제 파일을 나눴으니 다시 합쳐주는 과정이 필요하다.
파일을 나누고 합칠 때 사용하는 키워드는 **export**와 **import**다.

-   export: 변수나 함수 앞에 붙이면 그 변수나 함수를 외부에서 접근 가능하게 된다.
-   import: 외부 모듈의 기능을 가져올 수 있다.

예를 들어서 다음과 같은 코드가 있다고 하자.
이 코드는 export로 helloWorld, sayHi 함수를 내보낸다.
보다시피 export를 사용해서 여러 개를 내보낼 수 있다.

```
// Hello.js
export function HelloWorld() {
    console.log("Hello World!");
}

export function sayHi(user) {
    console.log(`Hello ${user}`);
}
```

이를 사용하기 위해선 다른 파일에서 import로 불러와야 한다.
불러오는 방식은 `import {name1, name2, ... , name5} from "PATH"`의 형태로 불러온다.
주의할 것은 불러올때 같은 이름을 사용해야 한다는 것이다.

```
// main.js
import {HelloWorld, sayHi} from "Hello.js";

HelloWorld();
sayHi("Jack");
```

그런데 export 하는 함수가 하나 뿐이라거나 기본으로 내보낼 것을 정하고 싶을 수 있다.
이때 사용하는 것이 export default다.
사용법은 기존과 크게 다르지 않은데, 그저 export 대신에 export default를 써주는 것이다.
대신에 이를 import 하는 파일에선 조금 차이가 생긴다.
import를 할 때 {}를 사용할 필요가 없고, 이름을 바꿀 수 있다.
하지만 불필요한 혼란을 일으키므로 이름을 그대로 사용하는 것이 좋다.

```
// Hello.js
export default function HelloWorld() {
    console.log("Hello World!");
}

// main.js
import anotherName from "Hello.js";

anotherName();
```

둘을 섞어서 사용할 수도 있는데, 이 경우 export default를 import할 때는 {}를 사용하지 않고, export를 불러올 때는 {}를 사용해줘야 한다.

이제 다시 처음의 예시로 돌아가서 나눠준 라우터 파일을 다시 합쳐주는 코드를 만들었다.

```
import express from "express";
import router from "./videoRouter";

const app = express();

app.use("/video", router);
```

```
// videoRouter.js
import express from "express"
const router = express.Router();

router.get("/", function (req, res) {
    res.send("Here is /video");
});

router.get("/edit", function (req, res) {
    res.send("Here is /video/edit");
});

export default router;
```

## 6. Making Routers

지금까지 알아본 내용을 바탕으로 실제 코드를 만들어보겠다.

## 7. Route parameters

## 8. Route handlers

**Route parameters**는 url에서 변수가 되길 바라는 부분을 지정하는 방법이다.
변수로 만들고 싶은 주소 앞에 :를 붙이면 변수로 만든다.
이때, 변수로 만든 것은 req.params 안에 객체 형태로 만들어지게 된다.
예를 들어서 아래의 경우 :userId와 :bookId를 변수로 만든 것이다.

```
app.get("/users/:userId/books/:bookId", function (req, res) {
    res.send(req.params)
})
```

-   Route path: /users/:userId/books/:bookId
-   Request URL: http://localhost:4000/users/1/books2
-   req.params: {"userId": "1", "bookId": "2"}
