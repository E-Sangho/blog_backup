---
layout: post
title: [Youtube Clone] Routers
date: Tue Dec 14 15:22:14 JST 2021
categories: Node.js Router
tag:
toc: true
---

웹 페이지에서 url을 보면 각 페이지마다 url이 다르다.
이는 url마다 보여주는 페이지가 다르다는 것으로, 대부분의 사람에게 이는 당연한 사실일 것이다.
어떤 페이지는 동영상을 보여주기도 하고, 또 다른 페이지는 로그인에 쓰이기도 한며, 지도를 보여주거나 검색을 하는 등 다양하다.
이처럼 각 url마다 클라이언트의 요청에 응답하는 기능을 어떻게 만들 수 있는지 알아보자.

**라우팅(Routing)**은 애플리케이션의 endpoint(URI)로 클라이언트의 요청이 들어올 때, 이에 응답하는 방법을 정하는 것을 말한다.
라우팅은 Express의 app에서 사용할 수 있는데, HTTP method에 따라 다른 방법을 사용한다.
예를 들어서 GET 요청에는 app.get()을 사용하고, POST요청에는 app.post()를 사용한다.
우선은 대표적인 방식인 app.get()으로 어떻게 사용하는지 보이겠다.

`app.get(route, handler)`의 형태로 만들게 되는데, 여기서 route는 URI를 지정하고, handler는 path에 접속했을 때, 실행할 callback 함수를 적는다.
아래는 root("/")에 접속할 때, hello라는 callback 함수를 실행하는 코드다.

```
import express from "express"
const app = express();

const hello = (req, res) => {
    res.send("Hello);
};

app.get("/", hello);
```

우리가 GET 요청에 응답하는 app.get()을 사용했지만, 그 외에도 HTTP method에 응답하는 다른 방법들이 있다.
이들은 **Route methods**라고 하며 app과 같은 express의 인스턴스에 사용할 수 있다.
대표적인 것이 위에서 사용한 .get()이고 그 외에도, .post(), .all() 등이 있다.

위에서 route에 들어가는 것을 **Route paths**라고 한다.
Route path는 string이 주로 들어가며, regular expression을 사용해서 표현할 수도 있다.
위에서 우리는 route로 "/"를 사용했는데, 그 외에도 "/about", "ab\*cd" 같은 것도 들어갈 수 있다.

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
