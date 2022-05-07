---
layout: post
title: [Youtube Clone] Introduction To Express
date: 2021-12-14 10:22:23
categories: Node.js, Express
tag:
toc: true
---

## 1. Start Server

이제 Express로 서버를 시작해보자.
서버를 시작하려면 아래 3가지를 알아야 한다.

-   express()
-   PORT
-   callback

설명을 시작하기 전에 앞으로 코드 파일은 src 폴더에 작성하겠다.
우선 index.js 파일의 이름을 server.js로 바꾼 다음에 src 폴더로 파일을 옮긴다.
그런데 파일의 위치와 이름을 바꿨으므로 package.json의 scripts 명령을 수정해줘야 한다.
그러므로 `"dev": "nodemon --exec babel-node src/server.js"`로 코드를 고쳐준다.

### 1.1 express()

이제 server.js 파일에 코드를 작성해보겠다.
우리는 express를 사용할 것이므로, `import express from "express";`로 패키지를 불러온다.
이때 express는 node_modules에 있지만 위치를 적지 않아도 Node.js가 알아서 node_modules 아래에서 패키지를 찾는다.
다음으로 express를 사용하기 위해서 `const app = express();`를 적어준다.
여기서 이름이 꼭 app일 필요는 없지만 편의를 위해 그렇게 적어준다.
이렇게 app 이라는 이름의 애플리케이션에 생긴 것이다.
이제 해야할 일은 애플리케이션이 우리의 요청(request)을 듣도록(listen) 만드는 것이다.

### 1.2 app.listen()

여기서 잠깐 서버가 무엇인지 알아보자.
서버는 단어 그대로 제공자를 의미하며, 클라이언트의 요청에 따라 서비스를 제공하는 컴퓨터 장치를 말한다.
예를 들어 서버에 구글에 가고 싶다는 요청(request)을 보낸다면, 서버는 이를 듣고(listen) 요청에 맞는 응답(respond)을 보낸다.
앞서 우리는 애플리케이션을 만들었고, 이제 서버가 요청을 기다리도록 만들어야 한다.
이 때 사용하는 것이 `app.listen(port [,host] [,backlog] [,callback])`이다.
app.liste()은 애플리케이션에 몇 번 포트와 연결될지 정한다.
보통은 높은 숫자의 port가 비어 있으므로 `app.listen(4000, handleListening);`이라고 쓴다.
이렇게 하면 서버가 실행됐을 때, 4000번 포트에 연결되고, handleListening이라는 함수가 실행된다.

다음으로 넘어가기 전에 잠시 콜백 함수를 설명하겠다.
콜백 함수를 다른 함수의 인자로써 이용되는 함수, 이벤트로 호출되는 함수다.
다시 말해 콜백 함수는 함수를 등록하고, 어떤 이벤트가 발생했을 때 실행하는 함수를 말한다.
위에서 handleListening은 app.listen의 인자로 사용되고, listen이 일어났을 때 호출되는 함수이므로 callback 함수인 것이다.

아직 handleListening이라는 함수가 없으므로 코드로 하나 만들어 준다.
`const handleListening = () => console.log("Server listening on port 4000")` 이렇게 하면 서버가 실행됐을 때, 콘솔에 글자가 나오게 된다.
callback 함수를 꼭 이렇게 지정할 필요 없이 `app.listen(4000, () => console.log("Server listening on port 4000"));`로 적어줘도 된다.

이번에는 이렇게 만든 서버에 들어가보겠다.
크롬에서 localhost:4000에 들어가면 Cannot GET / 오류가 나오지만, 이전과는 달리 무엇인가 생긴 것을 확인할 수 있다.
이전에 어떤 화면이 나오는지 확인하려면 서버를 종료하고 다시 들어가보면 된다.
참고로 서버를 종료하려면 Ctrl + c를 눌러주면 된다.
그러면 콘솔을 다시 사용할 수 있게 된다.
서버를 종료한 후에 다시 localhost:4000에 들어가면 이 서버는 존재하지 않는다는 오류가 나오게 된다.
즉, 이전과 달라진 것을 확인할 수 있고, 앞서 서버를 열었다는 것을 알 수 있다.

포트 번호 같은 상수는 따로 지정하는 것이 의미적으로 편하다.
그러므로 `const PORT = 4000;`으로 하고 코드를 `app.listen(PORT, handleListening);`으로 고쳐준다.
handleListening도 좀 더 의미를 가지도록 `` const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`); ``로 고쳐준다.

지금까지 작성한 코드는 다음과 같다.

```
// server.js
import express from "express";

const PORT = 4000;

const app = express();

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
```

## 2. HTTP GET

HTTP(HyperText Transfer Protocol)는 문서를 전송하기 위한 규약이다.
HTTP는 프로토콜의 일종으로, 이때 프로토콜은 컴퓨터에서 데이터의 교환 방식을 정하는 규약을 의미한다.
다시말해 HTTP는 서버와 클라이언트 사이에서 어떻게 정보를 교환할지 정해놓은 약속이다.
보통은 클라이언트인 브라우저에서 보내는 메세지를 요청(Request)라고 부르고, 그에 대답하는 서버의 메세지는 응답(Respond)라고 한다.
우리가 사용하는 웹 브라우저의 주소를 보면 http://를 볼 수 있다.
이 http://가 바로 프로토콜을 사용해서 정보를 교환한다는 표시로, 인터넷 주소(URL)로 정보를 조회할 수 있다.
HTTP가 보내는 요청은 다양한 것이 있지만 이번에는 GET만 알아볼 것이다.
GET은 데이터를 가져올 때 사용하는 것으로 정해진 주소로부터 정보를 받아오는 것이다.
서버를 실행하고 localhost:4000에 들어가보자.
그러면 Cannot GET / 라는 메세지만 확인할 수 있다.
먼저 /는 root를, 다시 말해 첫 페이지를 의미한다.
다음으로 GET은 HTTP method이므로 GET /는 HTTP로 첫 페이지를 불러오는 명령이다.
그런데 우리는 첫 페이지를 만들어주지 않았으므로 오류가 나게 된다.

앞으로 작성할 코드는 모두 `const app = express();` 다음에 와야 한다.
왜냐하면 app으로 만들어주고 listen으로 요청을 기다리는데, 그 사이에 기능을 넣어줘야 하기 때문이다.
서버를 실행하면 GET으로 /를 요청하고 있으므로 이에 응답해야 한다.
하지만 그 전에 콘솔로 출력해보겠다.
코드를 작성하기 전에 틀을 한 번 알아보자.
우리가 작성할 코드는 `app.get(path, callback)` 형태다.
이 코드의 의미는 app이 path에 get 요청을 보냈을 때, callback이 실행된다는 의미다.
우리는 /로 갔을 때, callback이 실행되도록 하고 싶다.
그러므로 `app.get("/", () => console.log("Get Home"));`을 적어준다.
이 코드의 뜻은 app에서 get으로 /에 가려고 하면 콘솔에 문장이 출력되게 하는 것이다.
주의할 것은 callback에 단순히 console.log로 적어주면 안 된다.
callback 함수를 적어줘야 하므로 꼭 () => console.log 형태가 되도록 해야 한다.
이 방식이 불편하면 따로 함수를 만들어서 다뤄줘도 된다.

여기까지 작성하고 서버를 새로고침 하면 브라우저가 불러오기에서 멈춘 것을 볼 수 있다.
콘솔을 확인하면 Get Home이 출력된 것을 확인할 수 있다.
즉, 브라우저는 get request를 보내고 있는데 서버는 app.get으로 어떻게 응답해야하는지 알게 되었으므로 응답한다.
그런데 우리는 콘솔에 출력만 할 뿐, 브라우저에는 아무런 응답을 하고있지 않다.
그렇기 때문에 브라우저는 응답이 돌아올때까지 기다리고 있고 불러오기 단계에 머물러 있게 된다.

```
// server.js
import express from "express";

const PORT = 4000;

const app = express();

const handleHome = () => console.log("Somebody is trying to go home");

app.get("/", handleHome);

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
```

## 3. Responses

이번에는 브라우저에 응답하는 방법을 배워보겠다.
지금은 브라우저가 응답을 계속 기다리고 있기 때문에 강제로 꺼줘야 한다.
Ctrl + c로 서버를 종료하고 다시 브라우저로 돌아가면 localhost refused to conntect라는 에러가 뜬다.
그전에 잠시 자바스크립트를 복습해보겠다.
자바스크립트에서 `button.addEventListener("click", handleClick);`과 같은 코드가 있고 여기서 콜백 함수 `const handleClick = (event) => {...}` 형태가 되는 것을 기억할 것이다.
여기서 보듯이 handleClick이 콜백 함수로 쓰일때, event를 변수로 쓰이지만 addEventListener에는 적혀있지 않다.
이는 브라우저가 자동으로 처리해주기 때문이다.

이와 동일한 일이 express에서도 일어난다.
Express의 함수는 req, res를 인수로 사용한다.
req는 요청을, res는 응답을 의미한다.
이름이 꼭 req, res로 사용해야 하는 것은 아니지만, 굳이 다른 이름을 사용할 필요는 없으므로 저대로 쓴다.
app.get이 일어나면 handleHome에 req, res 두 인수가 전달이 된다.
우선은 req가 무엇인지 알기 위해 console.log로 출력시켜보자.
그러므로 코드는 아래처럼 될 것이다.

```
// server.js
...
const handleHome = (req, res) => {
    console.log(req);
};

app.get("/", handleHome);
...
```

이렇게 하면 아직 브라우저에 응답을 보내지 않아서 브라우저는 계속 동작한다.
그리고 콘솔을 확인하면 이것저것 출력되는 것을 알 수 있다.
그 중에서도 url, method나 사용자의 os등 다양한 정보가 있는 것을 볼 수 있다.
req 대신에 res를 출력 시켜도 비슷한 것들이 나온다.
다음으로 응답을 전달해보겠다.
응답은 handleHome에다가 `return res.end();`를 적어줘서 가능하다.
이렇게 하고 페이지를 새로고침하면 브라우저는 빈화면으로 나온다.
아무것도 나오진 않지만, 브라우저가 응답을 계속 기다리진 않는다.
응답을 보내는 다른 방법으로 send가 있는데, `return res.send("This is end message");` 처럼 사용한다.
이렇게 하고 페이지를 새로고침하면 페이지에 글자가 나오는 것을 볼 수 있다.

```
// server.js
...
const handleHome = (req, res) => {
    return res.send("This is end message"); // or return res.end();
};

app.get("/", handleHome);
...
```

페이지를 하나 더 만들어서 똑같이 적용해보겠다.
이번에는 /login 페이지를 만들어서 handleLogin을 사용할 것이다.
그러면 코드는 아래처럼 적어주면 된다.

```
// server.js
...
const handleHome = (req, res) => {
    return res.send("This is end message"); // or return res.end();
};

const handleLogin = (req, res) => {
    return res.send("This is Login Page");
};

app.get("/", handleHome);
app.get("/login", handleLogin);
...
```

localhost:4000/login에 들어가보면 This is Login Page가 출력된다.

## 4. Express API

[Express](https://expressjs.com/ko/)에 들어가면 익스프레스에 관한 설명을 볼 수 있다.
오른쪽 위의 항목을 보면 알겠지만 익스프레스는 그렇게 크지 않고, 복잡하지도 않다.
시작하기와 안내서의 내용도 굉장히 유용하기 때문에 막히는 부분이 생기면 읽어볼 것을 추천한다.
하지만 이번에 다룰 것은 API다.
오른쪽 위의 API 참조를 누르면 express(), Application, Request, Response, Router로 5가지가 존재한다.
몇몇을 확인해보면 지금까지 우리가 썼던 기능들을 볼 수 있다.
예를 들어 Application을 열어보면 app.get(), app.listen()이 있고, Response에는 res.end(), res.send() 등이 있다. 우리는 이미 이 API의 기능을 알고 있다.
페이지 시작하거나, 콜백 함수가 있는 정해진 path에 요청을 보내거나, 응답을 받거나 끝내는 등의 일을 한다.
그렇다면 API는 무엇이길래 이런 기능들을 할까?

API(Application Programming Interface)를 설명하기 전에 Interface를 설명하겠다.
인터페이스는 서로 다른 두 시스템 사이에 정보를 주고받는 경계면이다.
경계면이란 장소/방법/방법 등을 포괄하는 말로 간단히 말해 인터페이스는 정보를 주고 받는 방법이라고 할 수 있다.
예를 들어 사람은 키보드나 마우스를 통해 컴퓨터에 데이터를 전송한다.
이처럼 사람과 기계의 소통을 위한 방법을 UI(User Interface)라고 한다.

API도 인터페이스의 일종으로 프로그램 간에 데이터를 주고 받는 방법을 의미한다.
예를 들어 C에서 문장을 출력한다고 해보자. printf API를 사용하지 않는다면 직접 컴퓨터의 메모리에 문자열을 만들어 출력하도록 운영체제에 명령을 보내야 한다.
하지만 API를 사용하면 프로그래머가 작성한 코드를 API가 컴퓨터에 정보를 전달해주기 때문에 간단하게 print문으로 출력할 수 있게 된다.

이처럼 API를 사용하면 프로그램 간에 데이터를 주고 받을 수 있는데, 많은 회사들이 API를 제공한다.
예를 들어 날씨 API는 지역별 날씨를 제공하고, 알라딘 API는 책 정보를 제공하는 등 회사의 API를 사용하면 특정 데이터를 굉장히 쉽게 사용할 수 있다.
이 API가 동작하는 방식은 서버에 데이터를 제공해달라는 요청을 하면, 서버는 해당하는 정보를 보내주는 방식으로 작동한다.
그 과정에서 데이터를 주고 받는 양식, 인증 방식, 호출 제한 등을 두기도 하지만, 핵심은 요청에 맞는 데이터를 보내준다는 것이다.
그 중에서도 유명한 것이 RESTful API인데 웹을 기반으로 하는 데이터 통신 방법으로, 출력값을 받는 다른 API와 달리 데이터를 JSON이나 XML로 받아서 사용한다.

여기까지 설명을 보면 API는 프로그램 사이의 데이터 요청과 그에 응답하는 방법이란 것을 알 수 있다.
Express의 API는 익스프레스로 특정 정보를 요청했을 때, 그에 어떻게 응답하는 방법을 만들어 놓은 것이다.
앞으로 우리는 백엔드를 만들고 거기에 요청을 하면 응답을 받는 일을 할 것이다.
그리고 API는 이런 데이터 교환을 하게 해주는 기능으로 알고 있으면 된다.

## 5. Controllers

네트워크에서 라우터는 최적의 경로로 데이터를 전송시키는 장치로, 서로 다른 네트워크 간의 중계 역할을 한다.
그리고 라우팅은 이 최적의 경로를 선택하는 과정이다.
이 개념은 익스프레스에도 비슷하게 구현된다.
익스프레스에서 라우팅은 URI와 HTTP 요청 메소드에 어플리케이션이 응답하는 방법을 결정하는 것을 말한다.
그리고 이 역할을 수행하는 오브젝트를 라우터라고 한다.
라우터 구조는 `app.METHOD(PATH, HANDLER)` 형태로 각각의 의미는 아래와 같다.

-   app은 express의 인스턴스
-   METHOD는 HTTP Request Method
-   PATH는 서버의 경로
-   HANDLER는 라우터가 맞을 때, 실행되는 함수

예를 들어 `app.get('/', homehandler)`는 홈(/)에 GET 요청이 오면 homehandler 함수가 실행된다.
이때, homehandler 같은 함수를 Controllers라고 하는데, 사용자의 요청에 따른 응답을 하는 함수다.
이 함수는 다음처럼 사용한다.

```
const homehandler = (req, res) => {
    return res.end();
}
```

컨트롤러를 보면 req와 res가 있는 것을 볼 수 있다.
next도 있지만 이는 middleware에서 다룬다.
req는 요청한 사람의 ip, 방법 등 요청에 관한 것을 다루고, res는 그에 대한 응답을 다룬다.
res.end()라고 적어주면 응답으로 종료시키고, res.send()를 사용하면 메세지를 전달할 수 있다.

## 6. Middlewares

지금까지 app.get() 등에서 사용된 함수는 controller라고 하는데, controller는 req, res 뿐만 아니라 next라는 인자를 가지고 있다.
지금까지는 요청과 응답 사이에 다른 일을 할 필요가 없었으므로 next를 사용하지 않았다.
이는 컨트롤러가 하는 일이 간단했기 때문이다.
그런데 컨트롤러가 하는 일이 많아진다면 이들을 분리하는 것이 더 유리할 것이다.
그렇다면 분리된 컨트롤러를 어떻게 실행해야 할까?
이는 app.get()이 여러 개의 callback 함수를 사용할 수 있다는 특성을 쓰면 된다.
예를 들어서 `app.get("/", first, second, third)`라고 적는다면, first, second, third가 순서대로 실행되게 된다.

여기서 중간에 쓰이는 컨트롤러를 Middleware라고 한다.
Middleware는 이름 그대로 Middle Software로, 요청과 응답 사이에 실행되는 함수다.
쉽게 말해서 요청-응답 사이에서 실행되는 거쳐가는 함수다.
앞서 req, res 외에도 next가 있다고 말했었다.
next는 다음 미들웨어로 현재 요청을 넘겨주는 일을 한다.
아래 코드를 보자.

```
// server.js
...
const gossipMiddleware = (req, res, next) => {
    console.log("I'm in the middle!");
    next();
};

const handleHome = (req, res) => {
    return res.end();
};

app.get("/", gossipMiddleware, handleHome);
...
```

브라우저에서 /에 접속하면 요청이 보내진다.
이를 app.get()에서 받아들여서 gossipMiddleware를 실행시킨다.
gossipMiddleware()는 콘솔에 *I'm in the middle!*을 출력한다.
그리고 next()로 다음 함수를 호출한다.
app.get()을 보면 다음 함수는 handleHome이므로, handleHome이 실행된다.
이때, handleHome은 마지막이란 뜻에서 finalware가 된다.
finalware에서는 (req, res)만 있고 next가 없다.
이는 관습적으로 마지막 함수라는 것을 표현하기 위해서다.

여기서 중요한 것은 다음 함수를 호출하기 위해 **next()**를 사용하고 있다는 것이다.
만약 next()를 사용하지 않는다면 권한이 다음 함수로 넘어가지 않아서 코드가 중간에 멈추게 된다.
또한 `return res.send()` 등의 응답을 하는 함수를 사용하면, 현재 요청-응답 사이클이 종료되어서 다음 함수가 실행되지 않게 된다.
이를 잘 활용하면 다음 함수를 실행시키지 않고 종료시키는 것도 가능하지만, 잘못 쓸 경우에는 원하는대로 함수가 실행되지 않는다.

middleware는 다양한 방법으로 사용할 수 있는데, 이번에는 요청하는 페이지의 url을 반환하는 함수를 생각해보겠다.

```
// server.js
...
const gossipMiddleware = (req, res, next) => {
    console.log(`Someone is going to: ${req.url}`);
    next();
};

const handleHome = (req, res) => {
    return res.end();
};

app.get("/", gossipMiddleware, handleHome);
...
```

위의 함수는 사용자가 가려는 페이지의 url을 반환한다.
그런데 접속하는 페이지마다 url을 출력하고 싶은 경우, 위의 코드를 모든 url에 맞춰서 적어줘야 한다.
이 경우 middleware 함수를 모든 url에 적용해야 하는데, 이때 쓸 수 있는 것이 app.use()다.

## 7. app.use()

`app.use()`는 global middleware를 만들게 해준다.
다시 말해 어떤 url에서도 실행되는 middleware다.
주의할 것은 하나뿐이다. app.use가 app.get보다 먼저 와야한다.
만약 순서가 반대로 되면 app.get이 일어날때, app.use가 적용되지 않으므로 middleware가 실행되지 않게 된다.
app.use의 사용법은 간단하다.
그저 사용하고 싶은 middleware의 이름을 적어주면 된다.

```
// server.js
...
const gossipMiddleware = (req, res, next) => {
    console.log(`Someone is going to: ${req.url}`);
    next();
};

const handleHome = (req, res, next) => {
    return res.end();
};

app.use(gossipMiddleware);
app.get("/", handleHome);
...
```

미들웨어는 다른 방법으로도 사용 가능하다. if-else문을 사용해서 특정 url에서만 실행되고 다른 url에서는 next가 실행되도록 할 수도 있다.

```
const privateMiddleware = (req, res, next) => {
    if(req.url === "/private") {
        return res.send("<h1>Not Allowed</h1>);
    }
    console.log("Allowed, you may continue.");
    next();
};
```

## 8. Morgan

모건(Morgan)은 logging에 도움을 주는 미들웨어로, 여기서 로깅이란 어떤 일이 있었는지 기록하는 것을 말한다.
우선 모건을 설치하려면 `npm i morgan`을 입력한다.
모건을 사용하기 위해서 `import morgan from "morgan";`로 패키지를 불러온다.
그 후 `const logger = morgan("dev");`로 인스턴스를 만든다.
마지막으로 `app.user(logger)`로 미들웨어를 적용한다.

이렇게 작성하고 페이지를 새로고침하면 콘솔에 HTTP request, 주소, 응답 속도 등이 나온다.
모건은 함수에 따라 더 많은 정보를 보여줄 수도 있는데 이를 조절하는 것은 morgan함수로 5개의 값을 사용하며 리스트는 다음과 같다.

-   combined
-   common
-   dev
-   short
-   tiny

각각 얼마나 많은 정보를 보여주는지가 다르지만 우리는 dev를 사용한다. 지금까지 작성한 코드는 아래에 정리했다.

```
import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

const home = (req, res) => {
  return res.send("hello");
};
const login = (req, res) => {
  return res.send("login");
};

app.use(logger);
app.get("/", home);
app.get("/login", login);

const handleListening = () =>
  console.log(`Server listenting on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
```

## etc. tree

폴더가 조금씩 복잡해지면 그 구조를 출력하고 싶을 때가 있다.
이는 디렉터리 구조를 출력하는 방법을 찾아보면 되는데, 맥에서는 tree를 사용하면 된다.
다른 운영체제도 각자 디렉토리 출력법이 있으므로 필요하면 찾아보자.
맥에서는 터미널을 연 후 `brew install tree`로 tree를 설치해준다.
그 후 원하는 폴더에 들어가서 tree만 입력하면 폴더의 구조를 출력해준다.
세세한 사항은 `tree --help`로 확인해보자.
