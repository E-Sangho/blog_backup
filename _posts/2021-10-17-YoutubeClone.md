---
layout: post
title: Youtube Clone
date: Sun Oct 17 17:52:23 JST 2021
categories: Clone NodeJS
tag: Clone NodeJs
toc: true
---
## 0 What is this post?
이 포스트는 노마드코더라는 사이트의 유튜브 클론코딩을 정리한 포스트다. 처음 배울때는 무엇을 시작해야 할지 모르기 때문에 클론코딩은 효과적인 수단이라 생각한다. 하지만 그 다음으로 스스로 만들어보지 않으면 아무런 쓸모가 없을 것이다. 이 포스트는 영상에서 배운 내용을 전체적으로 정리하고 기록하려고 한다. 그 후에는 배운 것을 응용해서 새로운 것을 만드는 포스트를 작성할 예정이다.

이 수업에서 필요한 것은 기초적인 HTML, CSS, JS 지식이다. 잘 알지 못하더라도 어느 정도 이해만 하고 있다면 별다른 문제 없이 들을 수 있다. 수업에서 다루는 내용들은 아래와 같다.

- 프론트엔드: HTML5, CSS3, Pug
- 백엔드: NodeJS, MongoDB, Express

## 1 Introduction

### 1.3 What is NodeJS
>NodeJS is a JavaScript runtime built on Chrome's V8 JavaScript engine.
NodeJS는 간단히 말하자면, 브라우저 밖에서도 JavaScript를 사용할 수 있게 해준다. 기존의 JavaScript는 브라우저 상에서만 실행되기 때문에, 브라우저 외에선 사용할 수 없었다. 이때, 브라우저 상에서 V8 엔진을 사용하는데, 자바스크립트 언어를 기계 코드로 바꿔주는 역할을 한다. NodeJS는 이를 가져와서 브라우저 외의 공간에서도 자바스크립트를 사용할 수 있게 만들었다.

>NodeJS uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.
I/O는 input/output을 말하는데, 입력과 출력에 시간이 걸리기 때문에 다른 작업을 막을 수 있다. 예를 들어서 두 사용자에게 정보를 받아와서 출력하는 경우를 생각해보자. Blocking I/O는 앞선 사람의 정보가 출력되기 전에는 두번째 사람의 요청이 시작되지 않는다. 그래서 첫번째 사람의 정보 처리가 다 끝나기 전에는 두번째 작업을 시작하지 않고 시간의 낭비가 생긴다. 이를 새로운 스레드에 할당해서 처리하는 방법도 생각할 수 있을 것이다. 그렇지만 자바스크립트는 싱글 스레드 형태로 실행되므로(실제로 싱글 스레드는 아니지만 이벤트 처리법이 싱글이다) 멀티 스레드로 처리하는 것은 어렵다. 반면에 Non-blocking I/O 모델은 이전 사용자의 정보를 요청하고 기다리는 것이 아니라 다음 사용자의 정보도 요청한다. NodeJS 라이브러리의 API는 모두 비동기식(non-blocking)이다. 다시 말해, NodeJS 기반 서버는 API가 실행됐을 때, 데이터를 반환을 기다리지 않고 다음 API를 실행한다.

NodeJS의 핵심은 브라우저 외의 공간에서도 사용가능해졌고, 이를 서버를 만들 때 사용할 수 있다는 것이다. 이전에는 프론트엔드는 자바스크립트로 만들고 백엔드는 Java, Ruby 등으로 만들어야 했는데, 한가지 언어로 웹을 다룰 수 있게 된 것이다.

### What is NPM
npm(Node Package Manager)은 NodeJS의 패키지를 관리하는 도구다. NodeJS만 있으면 별다른 설치 없이 사용할 수 있으며, npm으로 필요한 패키지를 쉽게 찾고 설치할 수 있다. npm의 대용으로 페이스북의 yarn이 있다. 본래는 성능차가 났었지만 최근에는 npm도 발전해서 비슷한 성능이라 원하는대로 고르면 된다.

## 2 SET UP

### 2.0 Your First NodeJS Project
폴더를 하나 만든 다음 `git init`을 실행해준다. 그 후 깃허브에 레파지토리를 만들어서 백업할 준비를 해준다.

`npm init`은 NodeJS를 시작하기 위한 명령어로 **package.json** 파일을 만들어 준다. 입력해주면 패키지 이름, 버전, 설명을 쓰는 곳이 나오는데 나중에 수정 가능하므로 원하는대로 적어주면 된다. 그 후 나오는 entry point, test command, keyword 등은 우선은 엔터로 넘어가준다. 그러면 package.json 파일에 지금까지 입력한 내용이 json 파일로 저장된 것을 알 수 있다. 이후에 바꾸고 싶은 내용이 있다면 이 파일을 수정해주면 된다.

package.json 파일을 보면 main에 **index.js**라고 적혀 있는 것을 알 수 있다. index.js 파일이 없기 때문에 하나 만들어 준다. 내용은 아무거나 상관 없지만 기본적인 내용인 `console.log("Hello World!");`를 입력해준다.

### 2.1 Installing Express

#### scripts
이번에는 index.js 파일을 실행하는 방법을 배워보겠다. 첫번째 방법은 `node index.js`를 입력하는 것이다. 이는 노드를 사용하는 방법이지만 앞으로는 노드로 코드를 실행하지 않을 것이다. 대신에 package.json으로 실행하게 된다. package.json을 보면 main이 있다. main은 내가 만들고 배포한 package를 다른 사람들이 설치하면 main을 사용한다는 의미로 지금 우리에게 필요한 내용은 아니니 지워준다. 이번에 바꿔줄 것은 **scripts**다. scripts는 실행하고 싶은 것을 의미한다. 앞서 `node index.js`를 입력했던 것을 package가 대신 입력하도록 만들 수 있다. 우선 아래처럼 scrips를 추가해주자.

```
// package.json
...
"scripts": {
    "start": "node index.js"
},
...
```

이 코드를 실행하는 방법은 `npm run start`라고 입력하는 것이다. 그러면 index.js가 실행되서 콘솔에 *Hello World!*가 나오는 것을 볼 수 있다. scripts에는 다른 실행 명령어도 만들어 줄 수 있다. 예를 들어 `"another": "node index.js"`라고 써줬으면 `npm run another`로 scripts의 다른 명령을 실행시킬 수 있다. 대신 실행하려는 파일 위치가 package.json과 다른 위치에 있다면 정확히 위치를 지정해 줘야 한다.

#### npm i express
`npm install`또는 `npm i`를 사용하면 원하는 패키지를 다운받을 수 있다. Express를 설치하기 위해 `npm i express`를 입력해야 하는데, 그 전에 package.json과 index.js 창을 반드시 끄고 진행하자. 실행하면 package-lock 파일과 node_modules 폴더가 생긴 것을 볼 수 있다. node_modules에는 npm으로 설치한 모든 패키지가 저장된다. node_modules를 열어보면 express 폴더가 있다. express 폴더를 열어보면 package.json이 있는데, **dependencies**라는 항목이 있다. 여기에는 express가 실행되기 위해 필요한 패키지와 버전을 적어놓은 곳이다. npm은 패키지를 설치할 때 그 패키지만 설치하는 것이 아니라 dependencis의 패키지를 모두 다운 받는다. 그리고 각 패키지를 실행하는데 필요한 패키지가 있다면 또 dependencies의 패키지를 받아준다. 이렇게 패키지가 꼬리를 물고 이어지기 때문에 직접 설치하려면 어려울 수 있다. 그렇지만 npm이 이 모든 과정을 대신해주기 때문에 우리는 원하는 패키지만 받으면 아무런 문제 없이 사용할 수 있다.

이번에는 package.json 파일을 열어보자. 그러면 dependencies가 생기고, express가 있는 것을 확인할 수 있다. 즉, npm으로 설치해주면 package.json에 자동적으로 depemdencies를 만들어서 관리해주므로 우리가 별다른 관리를 할 필요는 없다.

### 2.2 Understanding Dependencies
우선은 파일에서 node_modules와 package-lock.json 파일을 지워주자. express를 지웠기 때문에 다시 설치해줘야 한다. 그런데 이번에는 `npm i express`로 실행할 필요가 없다. 우리가 할 일은 `npm i`만 해주면 된다. 그렇게 하면 자동적으로 이전의 파일이 모두 설치된다. 그 이유는 npm이 package.json 파일의 dependencies를 보고 필요한 패키지가 없다면 자동적으로 설치해주기 때문이다. 우리는 이전에 package.json에 dependencies를 추가했으므로 express가 적혀있고, npm i 만으로 모든 필요한 것을 설치할 수 있다.

이 기능이 가장 유용한 것은 파일을 공유할 때다. node_moduels는 굉장히 많은 패키지가 들어있기 때문에 용량이 크다. 그래서 이 모든 것을 동시에 전송해주는 것은 비효율적이다. 그런데 package.json만 있다면 어떤 패키지가 필요한지 알 수 있다. 그러므로 node_modules를 제외하고 공유해도 npm i를 사용하면 동일한 환경에서 사용할 수 있다. 앞으로 node_modules 폴더를 github에 저장할 필요가 없으므로 .gitignore 파일로 제외해주자.
```
// .gitignore
/node_modules
```
다른 환경에서 파일을 받고 npm으로 패키지를 설치해줄 때, 반드시 package.json 파일을 저장하고 해야 한다. npm i가 package.json 파일을 수정하기 때문에 저장하지 않으면 제대로 작동하지 않을 수 있다. 번거롭지 않으려면 모든 파일을 저장하고 끈 후에 npm i로 패키지를 설치하도록 하자.

### 2.3 The Tower of Babel

#### Babel
[Babel](https://babeljs.io/)은 자바스크립트 컨파일러다. NodeJS는 자바스크립트로 작동한다. 그런데 아직 NodeJS가 이해하지 못하는 자바스크립트가 있다. 선택지는 2개다. 첫번째는, NodeJS에서 작동하는 자바스크립트만 사용하는 것이고, 다른 하나는 Babel을 사용하는 것이다. Babel은 NodeJS가 이해하지 못하는 최신 자바스크립트를 이전의 자바스크립트로 바꿔준다. 그래서 NodeJS가 자바스크립트를 이해할 수 있는지 확인하지 않아도, 알아서 코드를 이해하도록 바꿔주기 때문에 코드를 쉽게 만들 수 있다.

#### devDependencies
[바벨 웹페이지](https://babeljs.io/setup#installation)의 설명을 따라가며 진행하겠다.
우선은 NodeJS용 Babel을 설치해준다. `npm i --save-dev @babel/core`를 입력한다. 그후 package.json을 열어보면 **devDependencies**가 생긴 것을 알 수 있다. 그런데 devDependencies를 그냥 dependencies로 옮겨도 동일하게 파일이 설치된다. 그렇다면 둘의 차이점은 무엇일까? devDependencies는 developer Dependencies다. 즉, 개발자를 위한 dependencies다. dependencies는 코드가 실행되기 위해 필요한 필수적인 패키지다. 다시말해 프로젝트에게 필요한 패키지다. 반면 devDependencies는 개발자가 코드를 만들때 필요한 패키지로 개발자의 편의를 위해 만들어진 패키지다. 그래서 devDependencies에 있는 것들은 프로젝트에 어떤 기능을 주거나 하지 않고 코드 작성을 용이하게만 하는 패키지다. 그래서 Babel은 devDependencies에 있다.

그렇다면 어떻게 devDependencies에 저장할 수 있을까? 다시 설치 방법으로 돌아가보면 --save-dev라고 쓴 것을 알 수 있다. 이 부분이 없으면 모든 모듈이 dependencies에 만들어진다. 그러므로 devDependencies에 설치해야 하는 것은 --save-dev를 붙여서 설치해준다.

#### Babel Presets
이번에는 babel.config.json 파일을 만들어주자. 그리고 다음 코드를 적어준다.
```
// babel.config.json
{
  "presets": ["@babel/preset-env"]
}
```
그리고 `npm install @babel/preset-env --save-dev`를 실행한다. 이는 바벨의 presets를 지정하는 과정이다. 우리는 최신 자바스크립트를 번역하는데 사용하지만, React나 TypeScript를 번역하는데도 사용할 수 있다. 어떤 방식으로 번역할지 json 파일의 presets로 지정할 수 있다. [프리셋](https://babeljs.io/docs/en/presets/)에서 어떤 프리셋이 있는지 볼 수 있지만, 우리는 자바스크립트 번역에만 쓸 것이므로 깊게 알 필요는 없다.

### 2.4 Nodemon
바벨을 사용하는 방법은 아래 코드의 code 부분에 바꾸고 싶은 코드를 넣어주면 된다.
```
require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"],
});
```
그렇지만 이를 직접 하고 싶지는 않다. 자바스크립트로 직접 해주는 대신에 package.json에서 바벨로 컴파일하는 scrits를 만들겠다. 이를 위해 Nodemon을 사용할 것이다. 바벨 페이지에서 Nodemon을 선택하면 설치 명령을 알 수 있다. `npm install @babel/core @babel/node --save-dev`로 설치한 후에 devDependencies를 확인하면 패키지가 설치된 것을 확인할 수 있다.

이번에는 scripts를 수정한다.
```
// package.json
...
"scripts": {
    "dev": "babel-node index.js"
},
...
```
이전에는 babel-node가 아니라 그냥 node가 적혀 있었다. 우리는 @babel/node를 설치했기 때문에 babel-node라는 명령어를 쓸 수 있다. 이렇게 하면 index.js 파일을 자동으로 바벨로 번역해서 NodeJS로 실행해준다. scripts의 명령 이름이 dev로 바뀌었으므로 실행 방법도 `npm run dev`로 바뀐다. 이제부터 바벨로 최신 자바스크립트를 사용할 수 있다. 예를 들어서 `const express = require("express")` 대신에 `import express from "express"`를 대신 사용할 수 있다.

하지만 파일이 수정될때마다 일일이 파일을 새로 시작하고 싶지 않다. 이때 사용하는 것이 Nodemon이다. Nodemon은 파일이 수정되면 알아서 재시작해주므로 매번 npm run dev를 입력할 필요가 없다. 우선 `npm i nodemon --save-dev`으로 Nodemon을 설치해준다. 이제 package.json 파일의 scripts를 수정해준다.
```
// package.json
...
"scripts": {
    "dev": "nodemon --exec babel-node index.js"
},
...
```
이번에 npm run dev로 실행하면 코드가 끝나지 않는 것을 알 수 있다. 이 때, index.js 파일을 수정해서 console에 이것저것 출력하게 만들어보자. 그러면 수정된 파일을 인식해서 자동으로 파일을 새로 시작해 주는 것을 알 수 있다.

정리하면 처음에 우리는 `node index.js`로 파일을 실행시켰다. 이는 노드로 index.js 파일을 실행 시킨 것을 의미한다. 하지만 노드는 최신 자바스크립트를 이해하지 못할 때가 있다. 그렇기 때문에 바벨을 사용해서 최신 자바스크립트를 사용할 수 있게 했다. 그래서 `babel-node index.js`로 실행했다. 마지막으로 우리는 파일이 수정되면 자동으로 재실행되도록 하려고 노드몬을 설치했다. 최종적으로 코드는 `nodemon --exec babel-node index.js`가 되었다. 그래서 콘솔이 종료되지 않고 파일이 변할때마다 매번 명령어를 새로 시작해주게 되었다.

## Introduction To Express

### 3.0 Your First Server
파일이 굉장히 많기 때문에 코드를 포함하고 있는 파일은 앞으로 src 폴더에 저장한다. 우선 자바스크립트 파일의 이름을 바꿔준다. index.js 대신에 server.js를 사용한다. 그 이유는 앞으로 이 파일에 서버와 관련된 코드를 작성할 예정이기 때문이다. 그 후 scr 폴더에 server.js 파일을 옮겨준다. 그런데 우리는 파일의 이름을 바꾸고 옮겼기 때문에 package.json의 scripts 명령에서 파일을 찾을 수 없게 된다. 그러므로 `"dev": "nodemon --exec babel-node src/server.js"`로 코드를 코쳐준다.

다음으로 server.js 파일을 고쳐보겠다. 우선 코드에 `import express from "express";`를 작성한다. 이때 express는 node_modules에 있지만 위치를 적지 않아도 NodeJs가 알아서 node_modules 아래에서 패키지를 찾는다. express를 사용하기 위해서는 `const app = express();`를 적어준다. 이름이 꼭 app일 필요는 없지만 편의를 위해 그렇게 적어준다. 이렇게 하면 어플리케이션에 생긴 것이다. 이제 해야할 일은 어플리케이션이 우리의 요청(request)을 듣도록(listen) 만드는 것이다.

여기서 잠깐 서버가 무엇인지 알아보자. 서버는 항상 커져있는 컴퓨터와 같다. 예를 들어 그 컴퓨터에 구글에 가고 싶다는 request를 보낸다면, 서버는 이를 듣고(listen) 그에 맞는 응답을 보낸다. 앞서 우리는 어플리케이션을 만들었다. 그리고 서버가 요청을 기다리도록 만들어야 한다. 이 때 사용하는 것이 `app.listen();`이다. listen은 callback이다. callback은 button.addEventListener("click", handleClick) 같은 것이다. 버튼을 누르게 되면 handleClick이 실행된다. 그런데 서버를 listen 할 때, 몇 번 포트를 listen 하도록 만들지 정해야 한다. 보통은 높은 숫자의 port가 비어 있으므로 `app.listen(4000, handleListening);`이라고 쓴다. 이렇게 하면 서버가 실행됐을 때, handleListening이라는 함수가 실행된다.

다음으로 넘어가기 전에 잠시 콜백 함수를 설명하겠다. 콜백 함수를 다른 함수의 인자로써 이용되는 함수, 이벤트로 호출되는 함수다. 다시 말해 콜백 함수는 함수를 등록하고, 어떤 이벤트가 발생했을 때 실행하는 함수를 말한다. 위에서 handleListening은 app.listen의 인자로 사용되고, listen이 일어났을 때 호출되는 함수이므로 callback 함수인 것이다.

아직 handleListening이라는 함수가 없으므로 코드로 하나 만들어 준다. `const handleListening = () => console.log("Server listening on port 4000")` 이렇게 하면 서버가 실행됐을 때, 콘솔에 글자가 나오게 된다. callback 함수를 꼭 이렇게 지정할 필요 없이 `app.listen(4000, () => console.log("Server listening on port 4000"));`로 적어줘도 된다.

이번에는 이렇게 만든 서버에 들어가보겠다. 크롬에서 localhost:4000에 들어가면 Cannot GET / 오류가 나오지만, 이전과는 달리 무엇인가 생긴 것을 확인할 수 있다. 이전에 어떤 화면이 나오는지 확인하려면 서버를 종료하고 다시 들어가보면 된다. 참고로 서버를 종료하려면 Ctrl + c를 눌러주면 된다. 그러면 콘솔을 다시 사용할 수 있게 된다. 서버를 종료한 후에 다시 localhost:4000에 들어가면 이 서버는 존재하지 않는다는 오류가 나오게 된다. 즉, 이전과 달라진 것을 확인할 수 있고, 앞서 서버를 열었다는 것을 알 수 있다.

포트 번호 같은 상수는 따로 지정하는 것이 의미적으로 편하다. 그러므로 `const PORT = 4000;`으로 하고 코드를 `app.listen(PORT, handleListening);`으로 고쳐준다. handleListening도 좀 더 의미를 가지도록 ```const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);```로 고쳐준다.

지금까지 작성한 코드는 다음과 같다.
```
// server.js
import express from "express";

const PORT = 4000;

const app = express();

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
```

### 3.1 HTTP GET
HTTP(HyperText Transfer Protocol)는 문서를 전송하기 위한 규약이다. HTTP는 프로토콜의 일종으로, 이때 프로토콜은 컴퓨터에서 데이터의 교환 방식을 정하는 규약을 의미한다. 다시말해 HTTP는 서버와 클라이언트 사이에서 어떻게 정보를 교환할지 정해놓은 약속이다. 보통은 클라이언트인 브라우저에서 보내는 메세지를 요청(Request)라고 부르고, 그에 대답하는 서버의 메세지는 응답(Respond)라고 한다. 우리가 사용하는 웹 브라우저의 주소를 보면 http://를 볼 수 있다. 이 http://가 바로 프로토콜을 사용해서 정보를 교환한다는 표시로, 인터넷 주소(URL)로 정보를 조회할 수 있다. HTTP가 보내는 요청은 다양한 것이 있지만 이번에는 GET만 알아볼 것이다. GET은 데이터를 가져올 때 사용하는 것으로 정해진 주소로부터 정보를 받아오는 것이다. 서버를 실행하고 localhost:4000에 들어가보자. 그러면 Cannot GET / 라는 메세지만 확인할 수 있다. 먼저 /는 root를, 다시 말해 첫 페이지를 의미한다. 다음으로 GET은 HTTP method이므로 GET /는 HTTP로 첫 페이지를 불러오는 명령이다. 그런데 우리는 첫 페이지를 만들어주지 않았으므로 오류가 나게 된다.

### 3.2 GET Requests part Two
앞으로 작성할 코드는 모두 `const app = express();` 다음에 와야 한다. 왜냐하면 app으로 만들어주고 listen으로 요청을 기다리는데, 그 사이에 기능을 넣어줘야 하기 때문이다. 서버를 실행하면 GET으로 /를 요청하고 있으므로 이에 응답해야 한다. 하지만 그 전에 콘솔로 출력해보겠다. 코드를 작성하기 전에 틀을 한 번 알아보자. 우리가 작성할 코드는 `app.get(address, callback)` 형태다. 이 코드의 의미난 app이 address에 get 요청을 보냈을 때, callback이 실행된다는 의미다. 우리는 /로 갔을 때, callback이 실행되도록 하고 싶다. 그러므로 `app.get("/", () => console.log("Get Home"));`을 적어준다. 이 코드의 뜻은 app에서 get으로 /에 가려고 하면 콘솔에 문장이 출력되게 하는 것이다. 주의할 것은 callback에 단순히 console.log로 적어주면 안 된다. callback 함수를 적어줘야 하므로 꼭 () => console.log 형태가 되도록 해야 한다. 이 방식이 불편하면 따로 함수를 만들어서 다뤄줘도 된다.

여기까지 작성하고 서버를 새로고침 하면 브라우저가 불러오기에서 멈춘 것을 볼 수 있다. 콘솔을 확인하면 Get Home이 출력된 것을 확인할 수 있다. 즉, 브라우저는 get request를 보내고 있는데 서버는 app.get으로 어떻게 응답해야하는지 알게 되었으므로 응답한다. 그런데 우리는 콘솔에 출력만 할 뿐, 아무런 응답을 하고있지 않다. 그렇기 때문에 브라우저는 응답이 돌아올때까지 기다리고 있고 불러오기 단계에 머물러 있게 된다. 

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

### 3.3 Responses
브라우저가 응답을 계속 기다리고 있기 때문에 강제로 꺼줘야 한다. Ctrl + c로 서버를 종료하고 다시 브라우저로 돌아가면 localhost refused to conntect라는 에러가 뜬다. 이번에는 브라우저에 응답하는 방법을 배워보겠다. 그전에 잠시 자바스크립트를 복습해보겠다. 자바스크립트에서 `button.addEventListener("click", handleClick);`과 같은 코드가 있고 여기서 콜백 함수 `const handleClick = (event) => {...}` 형태가 되는 것을 기억할 것이다. 여기서 보듯이 handleClick이 콜백 함수로 쓰일때, event를 변수로 쓰이지만 addEventListener에는 적혀있지 않다. 이는 브라우저가 자동으로 처리해주기 때문이다.

이와 동일한 일이 express에서도 일어난다. 익스프레스의 함수는 req, res를 인수로 사용한다. req는 요청을, res는 응답을 의미한다. 이름이 꼭 req, res로 사용해야 하는 것은 아니지만, 굳이 다른 이름을 사용할 필요는 없으므로 저대로 쓴다. app.get이 일어나면 handleHome에 req, res 두 인수가 전달이 된다. 우선은 req가 무엇인지 알기 위해 console.log로 출력시켜보자. 그러므로 코드는 아래처럼 될 것이다.

```
// server.js
...
const handleHome = (req, res) => {
    console.log(req);
};

app.get("/", handleHome);
...
```

이렇게 하면 아직 브라우저에 응답을 보내지 않아서 브라우저는 계속 동작한다. 그리고 콘솔을 확인하면 이것저것 출력되는 것을 알 수 있다. 그 중에서도 url, method나 사용자의 os등 다양한 정보가 있는 것을 볼 수 있다. req 대신에 res를 출력 시켜도 비슷한 것들이 나온다. 다음으로 응답을 전달해보겠다. 응답은 handleHome에다가 `return res.end();`를 적어줘서 가능하다. 이렇게 하고 페이지를 새로고침하면 브라우저는 빈화면으로 나온다. 아무것도 나오진 않지만, 브라우저가 응답을 계속 기다리진 않는다. 응답을 보내는 다른 방법으로 send가 있는데, `return res.send("This is end message");` 처럼 사용한다. 이렇게 하고 페이지를 새로고침하면 페이지에 글자가 나오는 것을 볼 수 있다.

```
// server.js
...
const handleHome = (req, res) => {
    return res.send("This is end message"); // or return res.end();
};

app.get("/", handleHome);
...
```

페이지를 하나 더 만들어서 똑같이 적용해보겠다. 이번에는 /login 페이지를 만들어서 handleLogin을 사용할 것이다. 그러면 코드는 아래처럼 적어주면 된다.

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

### 3.4 Recap
[Express](https://expressjs.com/ko/)에 들어가면 익스프레스에 관한 설명을 볼 수 있다. 오른쪽 위의 항목을 보면 알겠지만 익스프레스는 그렇게 크지 않고, 복잡하지도 않다. 시작하기와 안내서의 내용도 굉장히 유용하기 때문에 막히는 부분이 생기면 읽어볼 것을 추천한다. 하지만 이번에 다룰 것은 API다. 오른쪽 위의 API 참조를 누르면 express(), Application, Request, Response, Router로 5가지가 존재한다. 몇몇을 확인해보면 지금까지 우리가 썼던 기능들을 볼 수 있다. 예를 들어 Application을 열어보면 app.get(), app.listen()이 있고, Response에는 res.end(), res.send() 등이 있다. 우리는 이미 이 API의 기능을 알고 있다. 페이지 시작하거나, 콜백 함수가 있는 정해진 path에 요청을 보내거나, 응답을 받거나 끝내는 등의 일을 한다. 그렇다면 API는 무엇이길래 이런 기능들을 할까?

API(Application Programming Interface)를 설명하기 전에 Interface를 설명하겠다. 인터페이스는 서로 다른 두 시스템 사이에 정보를 주고받는 경계면이다. 경계면이란 장소/방법/방법 등을 포괄하는 말로 간단히 말해 인터페이스는 정보를 주고 받는 방법이라고 할 수 있다. 예를 들어 사람은 키보드나 마우스를 통해 컴퓨터에 데이터를 전송한다. 이처럼 사람과 기계의 소통을 위한 방법을 UI(User Interface)라고 한다.

API도 인터페이스의 일종으로 프로그램 간에 데이터를 주고 받는 방법을 의미한다. 예를 들어 C에서 문장을 출력한다고 해보자. printf API를 사용하지 않는다면 직접 컴퓨터의 메모리에 문자열을 만들어 출력하도록 운영체제에 명령을 보내야 한다. 하지만 API를 사용하면 프로그래머가 작성한 코드를 API가 컴퓨터에 정보를 전달해주기 때문에 간단하게 print문으로 출력할 수 있게 된다.

이처럼 API를 사용하면 프로그램 간에 데이터를 주고 받을 수 있는데, 많은 회사들이 API를 제공한다. 예를 들어 날씨 API는 지역별 날씨를 제공하고, 알라딘 API는 책 정보를 제공하는 등 회사의 API를 사용하면 특정 데이터를 굉장히 쉽게 사용할 수 있다. 이 API가 동작하는 방식은 서버에 데이터를 제공해달라는 요청을 하면, 서버는 해당하는 정보를 보내주는 방식으로 작동한다. 그 과정에서 데이터를 주고 받는 양식, 인증 방식, 호출 제한 등을 두기도 하지만, 핵심은 요청에 맞는 데이터를 보내준다는 것이다. 그 중에서도 유명한 것이 RESTful API인데 웹을 기반으로 하는 데이터 통신 방법으로, 출력값을 받는 다른 API와 달리 데이터를 JSON이나 XML로 받아서 사용한다.

여기까지 설명을 보면 API는 프로그램 사이의 데이터 요청과 그에 응답하는 방법이란 것을 알 수 있다. Express의 API는 익스프레스로 특정 정보를 요청했을 때, 그에 어떻게 응답하는 방법을 만들어 놓은 것이다. 앞으로 우리는 백엔드를 만들고 거기에 요청을 하면 응답을 받는 일을 할 것이다. 그리고 API는 이런 데이터 교환을 하게 해주는 기능으로 알고 있으면 된다.

#### tree
여담으로 폴더가 조금씩 복잡해지면 그 구조를 출력하고 싶을 때가 있다. 이는 디렉터리 구조를 출력하는 방법을 찾아보면 되는데, 맥에서는 tree를 사용하면 된다. 다른 운영체제도 각자 디렉토리 출력법이 있으므로 필요하면 찾아보자. 맥에서는 터미널을 연 후 `brew install tree`로 tree를 설치해준다. 그 후 원하는 폴더에 들어가서 tree만 입력하면 폴더의 구조를 출력해준다. 세세한 사항은 `tree --help`로 확인해보자.

### 3.5 MiddleWares Part One
Middleware는 이름 그대로 Middle Software이다. 미들웨어는 요청과 응답 사이에 있다. 지금까지 handler라고 했던 것은 사실 controller인데 controller은 req, res 뿐만 아니라 next라는 인자를 가지고 있다. next는 다음 함수를 호출해준다.

```
// server.js
...
const gossipMiddleware = (req, res, next) => {
    console.log("I'm in the middle!");
    next();
};

const handleHome = (req, res, next) => {
    return res.end();
};

app.get("/", gossipMiddleware, handleHome);
...
```

위의 코드는 브라우저는 /에 가려고 한다. 그러면 gossipMiddleware가 실행된다. 그리고 next()가 실행되고 다음 함수인 handleHomedㅣ 실행된다. 이때, handleHome은 finalware가 된다. 이때, middleware에서 return res.send() 같은 종료 시키는 문구가 next보다 먼저 올 경우 다음 함수는 실행되지 않는다. 이는 당연한 것이 먼저 반환해버리면 next가 실행될 기회가 없기 때문이다. middleware는 다양한 방법으로 사용할 수 있는데, 이번에는 요청하는 페이지의 url을 반환하는 함수를 생각해보겠다.

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

app.get("/", gossipMiddleware, handleHome);
...
```

위의 함수는 사용자가 가려는 페이지의 url을 반환하겠지만, 지금은 /에만 적용되어 있으므로 무쓸모하다. 이를 다음 강의에서 고쳐보겠다.

### 3.6 MiddleWares Part Two
이번에 배워볼 것은 `app.use()`다. app.use는 global middleware를 만들게 해준다. 다시 말해 어떤 url에서도 실행되는 middleware다. 주의할 것은 하나뿐이다. app.use가 app.get보다 먼저 와야한다. 만약 순서가 반대로 되면 app.get이 일어날때, app.user가 적용되지 않으므로 middleware가 실행되지 않게 된다. app.use의 사용법은 간단하다. 그저 사용하고 싶은 middleware의 이름을 적어주면 된다.

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

app.user(gossipMiddleware);
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

### 3.7 Setup Recap
간단하게 지금까지 배운 것을 package.json 파일부터 정리해보겠다. 우리가 package.json에서 바꾼 것은 scripts, dependencies, Devdependencies다. 먼저 scripts는 복잡한 명령어를 실행하는 별명을 만들어준다. 우리는 dev라는 scripts를 만들었다. 서버를 실행하려면 매번 `nodemon --exec babel-node index.js`를 입력해야 한다. 하지만 이 명령어는 굉장히 길어서 굉장히 번거롭다. 그래서 scripts로 이를 대체하는 간단한 명령어를 만들 수 있다. 이를 위해 우리는 dev라는 명령어를 만들었다. `"dev": "nodemon --exec babel-node index.js"`를 사용하면 우리는 `npm run dev`만으로 저 복잡한 명령어를 대체할 수 있다.

다음으로 dependencies는 프로젝트를 실행하기 위한 패키지 모음이다. 이곳에는 필요한 패키지와 그 버전이 적혀있기 때문에 다른 컴퓨터에서 작업할 때 package.json만 있으면 `npm i`로 필요한 패키지를 다운 받을 수 있다. Devdependencies는 개발자를 위한 패키지로, 우리는 Nodemon으로 파일이 수정될 때마다 재실행시켜주고, Babel로 최신 자바스크립트를 NodeJS에 맞게 번역시킨다. dependencies와 Devdependencies 모두 node_modules에 저장된다. 요약하면 dependencies는 프로젝트를 실행하기 위한 필수적인 패키지고, Devdependencies는 개발자를 도와주는 패키지다.

### 3.8 Servers Recap
서버는 요청을 기다리고 있는 컴퓨터로, 요청을 보내면 그에 맞는 응답을 보낸다. 우리는 서버를 만들기 위해 express를 사용한다. express를 사용하는 방법은 `import express from "express"`로 가능하다. 이때 express는 node_modules 폴더에 있지만, npm이 알아서 저 폴더에서 찾아주기 때문에 그냥 express라고만 써도 된다. express에서 어플리케이션을 만드는 방법은 굉장히 간단하다. 그저 `const app = express()`라고만 적어주면 된다. 이렇게 만들어진 서버는 listening 중일 때에만 요청을 받고 응답을 한다. 이를 하는 방법은 `app.listen(PORT, handleListening);`으로 가능하다. 이때, listen일 때 실행되는 함수가 handleListening이다. PORT는 지금 사용하는 포트의 숫자를 말하는데, 대부분 `const PORT = 4000;`으로 사용한다. 이는 관습적인 숫자일 뿐 다른 숫자를 사용해도 된다. 그런데 어떤 포트는 사용중일 수도 있어서 작동하지 않을 수도 있다. 숫자가 높은 포트는 비어있을 가능성이 높으므로 다른 포트를 사용한다면 숫자가 높은 것 중에 하나를 고르면 된다.

### 3.9 Controllers Recap

네트워크에서 라우터는 최적의 경로로 데이터를 전송시키는 장치로, 서로 다른 네트워크 간의 중계 역할을 한다. 그리고 라우팅은 이 최적의 경로를 선택하는 과정이다. 이 개념은 익스프레스에도 비슷하게 구현된다. 익스프레스에서 라우팅은 URI와 HTTP 요청 메소드에 어플리케이션이 응답하는 방법을 결정하는 것을 말한다. 그리고 이 역할을 수행하는 오브젝트를 라우터라고 한다. 라우터를 구조는 다음과 같다. `app.METHOD(PATH, HANDLER)` 여기서,

- app은 express의 인스턴스
- METHOD는 HTTP Request Method
- PATH는 서버의 경로
- HANDLER는 라우터가 맞을 때, 실행되는 함수

예를 들어 `app.get('/', homehandler)`는 홈(/)에 GET 요청이 오면 homehandler 함수가 실행된다. 이때, homehandler 같은 함수를 Controllers라고 하는데, 사용자의 요청에 따른 응답을 하는 함수다. 이 함수는 다음처럼 사용한다.

```
const homehandler = (req, res) => {
    return res.end();
}
```

컨트롤러를 보면 req와 res가 있는 것을 볼 수 있다. 사실 next도 있지만 이는 middleware에서 다룬다. req는 요청한 사람의 ip, 방법 등 요청에 관한 것을 다루고, res는 그에 대한 응답을 다룬다. res.end()라고 적어주면 응답으로 종료시키고, res.send를 사용하면 메세지를 전달할 수 있다. 

### 3.10 MiddleWare Recap
미들웨어는 중간(middle)에 있는 소프트웨어(software)다. 미들웨어는 컨트롤러의 일종으로 req, res, next 변수를 사용한다. 미들웨어는 next()로 다음 함수를 호출할 수 있다. 아래 코드 예시를 보자.
```
const firstMiddleWare = (req, res, next) => {
    next();
}

const secondMiddleWare = (req, res, next) => {
    next();
}

const thirdMiddleWare = (req, res, next) => {
    return res.end();
}

const lastController = (req, res) => {
    return res.send("last one");
}

app.get('/', firstMiddleWare, secondMiddleWare, thirdMiddleWare, lastController);
```

위의 코드를 보면 라우터에 지금과는 달리 함수가 여러개 주어져 있다. 이 함수는 순서대로 실행이 되게 된다. 즉 first -> second -> third -> last 순서로 실행이 된다. firstMiddleWare를 보면 next()가 있다. next()는 스택의 다음 함수를 불러오는 것으로 이 경우 secondMiddleWare를 불러온다. 이처럼 미들웨어 함수는 중간에 지나가는 함수로 사용이 된다. 함수내의 코드가 실행되다 next()를 만나게 되면 다음 미들웨어 함수를 호출하는데, 만약 next()를 만나지 못하면 다음 함수를 호출하지 못한다. 하지만 미들웨어 함수를 중도에 끊을 수 있는데, res로 응답하는 경우다. 미들웨어 함수를 실행하다가 응답하게 되면 다음 미들웨어 함수를 호출하지 않고 종료되게 된다. thirdMiddleWare를 보면 next()가 아닌 return res.end()인 것을 확인할 수 있다. 이 함수는 다음 함수인 lastController를 호출하지 않고 응답하기 때문에 lastController는 실행되지 않는다. 이때, lastController는 next가 없는데, 그 이유는 마지막 함수라는 것을 표현하는 관습이기 때문이다.

그런데 여러 함수에서 동일한 미들웨어 함수를 사용할 수 있다. 이렇게 공통된 부분이 있을 때, app.use를 사용하면 그 미들웨어 함수는 글로벌하게 적용된다. 예를 들어 다음 코드를 보자.

```
app.get('/', firstMiddleWare, secondMiddleWare, thirdMiddleWare, lastController);

app.get('/login', firstMiddleWare, secondMiddleWare, thirdMiddleWare, loginController);
```

위를 보면 first, second, third 부분이 공통되므로 use를 사용해서 아래처럼 압축이 가능하다.

```
app.use(firstMiddleWare, secondMiddleWare, thirdMiddleWare);

app.get('/', lastController);

app.get('/login', loginController);
```

이때, 먼저 오는 미들웨어 함수가 먼저 실행되기 때문에 app.use가 app.get보다 빨라야 하고, app.use 내에서도 순서가 바뀌면 안 된다.

### 3.11 External Middlewares
모건(Morgan)은 logging에 도움을 주는 미들웨어로, 여기서 로깅이란 어떤 일이 있었는지 기록하는 것을 말한다. 우선 모건을 설치하려면 `npm i morgan`을 입력한다. 모건을 사용하기 위해서 우선 `import morgan from "morgan";`로 패키지를 불러온다. 그 후 `const logger = morgan("dev");`로 인스턴스를 만든다. 마지막으로 `app.user(logger)`로 미들웨어를 적용한다.

이렇게 작성하고 페이지를 새로고침하면 콘솔에 HTTP request, 주소, 응답 속도 등이 나온다. 모건은 함수에 따라 더 많은 정보를 보여줄 수도 있는데 이를 조절하는 것은 morgan함수로 5개의 값을 사용하며 리스트는 다음과 같다.

- combined
- common
- dev
- short
- tiny

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

## 4 Routers

### 4.0 What are the routers?
Route는 명사로 사용하면 *두 장소 사이의 경로(noun)*라는 뜻이고, 동사로 사용하면 *어떤 경로로 무엇인가를 보내다(verb)*를 의미한다. 그리고 이 단어로부터 라우터(Router)가 만들어졌다. 이렇게 읽으니까 생소해 보이는 단어다. 그런데 route를 그냥 읽으면 루트다. 그렇게 생각하면 라우트도, 라우터도 쉽게 이해된다. 어떻게 루트였던 단어가 라우트로 읽혔는가 이해가 안 되지만 영어니까 그러려니 하자. 어쨌거나 웹은 route -> function 으로 맵핑을 한다. 즉 라우트라는 key로 function을 사용한다. 예를 들어 /car/:color 라는 라우터가 있다고 하자. 여기서 :color 부분이 변수로 저기에 red, blue 등의 색이 들어간다. 그러면 /car/blue 라는 URL은 파란색 차를 호출할 것이다. 라우터는 라우트가 어떤 함수를 호출하는지 명시하는 것을 말한다. 다시 말해 라우트 개념을 구현해서 URL에 따라 어떤 함수를 사용하는지 코드로 만든 것이 라우터다. 간략히 요약하면 라우트는 사용자의 요청에 따라 다른 페이지로 보내주는 것을 말하고, 이를 구현한 것이 라우터다. 라우팅은 라우터가 동사이므로 이를 명사로 사용할 때 쓰는 동명사로, 라우트를 명사로 사용하는 표현이다.

이 개념을 바탕으로 앞으로 우리가 만들 웹 페이지를 구상해보자.

```
/ -> Home
/join -> Join
/login -> Login
/search -> Search

/users/edit -> Edit user
/users/delete -> Delete user

/videos/watch -> Watch Video
/videos/edit -> Edit Video
/videos/delete -> Delete Video
/videos/comments -> Comment on a video
/videos/comments/delete -> Delete A Comment of a Video
```

보다시피 Edit user, Delete user 기능은 /users에서 /edit과 /delete로 나눠서 만들었다. 라우터를 만드는 가장 큰 이유는 이처럼 같은 카테고리에 속하는 기능들을 묶어서 만들 수 있다는 것이다. 그래서 필요한 기능끼리 묶어서 만들 수 있고 유지 보수에도 쉽게 할 수 있게 된다.

### 4.1 Making Our Routers
앞서 만든 라우터 중에 '/', '/join', '/login', '/search' 처럼 홈에서 바로 갈 수 있는 페이지를 담고 있는 것을 Global Routers라고 한다. 앞서 우리는 users와 videos로 라우터를 만들었다. 그런데 글로벌 라우터를 보면 login, join은 users가 하는 것이므로 users 라우터에 있어야 할 것 같다. 또한 edit, delete도 videos 라우터에 있어야 할 것 같다. 논리적으로는 그렇게 하는 것이 맞지만, 때로는 예외로 하기도 한다. 그 이유는 논리적으로 작성할 경우 URL이 너무 복잡해지기 때문이다. login이나 join 등의 기능은 굉장히 기본적인 기능이다. 어떤 웹 페이지를 쓰더라도 기본적으로 있을 기능이다. 만약 이를 users 라우터에 넣게 된다면, url이 복잡해질뿐더러 사람들의 직관과 반대될 수 있다. 누군가  google에서 가입을 하고 싶다면, google/join에 들어가야 한다고 예상할 것이다. 그런데 googlt/users/join에서 가능하다면 오히려 더 불편할 것이다. 그렇기 때문에 논리적으로 맞지 않더라도, 편의를 위해 예외가 생길 수 있다.

이제 라우터를 만들어 보자. 라우터는 `express.Router()`로 만들 수 있다. 예를 들어 globalRouter를 만들고 싶다면 `const globalRouter = express.Router();` 로 만들 수 있다. 비슷한 방법으로 userRouter과 videoRouter를 만들 수 있다. 이렇게 만든 라우터를 사용하는 법도 간단하다. 우선 라우터의 루트 url이 필요하다. 예를 들어 videoRouter의 루트 url은 /videos가 되고, userRouter의 루트 url은 /users가 된다. 마지막으로 globalRouter의 루트 url은 /다. 다음으로 app.use로 사용하는데 `app.use("/videos", videoRouter);` 형태로 사용하면 된다. 지금까지를 코드로 작성하면 아래와 같다.

```
const globalRouter = express.Router();
const userRouter = express.Router();
const videoRouter = express.Router();

app.use("/", globalRouter);
app.use("/users", userRouter);
app.user("/videos", videoRouter);
```

하지만 이 코드는 아무런 일도 하지 않는다. 그래서 실행할 함수를 만들어줘야 한다. `const handleEditUser = (req, res) => res.send("Edit User");` 라는 함수를 만들었다면, 이를 사용하고 싶은 곳은 users/edit이다. `userRouter.get("/edit", handleEditUser);` 로 작성하면 된다. 나머지 부분도 비슷하게 작성하면 아래처럼 된다.

```
const globalRouter = express.Router();

const handleHome = (req, res) => res.send("Home");

globalRouter.get("/", handleHome);

const userRouter = express.Router();

const handleEditUser = (req, res) => res.send("Edit User");

userRouter.get("/edit", handleEditUser);

const videoRouter = express.Router();

const handleWatchVideo = (req, res) => res.send("Watch Video");

videoRouter.get("/watch", handleWatchVideo);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
```

이렇게 만들고 /videos/watch 나 /users/edit 에 들어가면 메세지가 나오는 것을 확인할 수 있다. 그런데 우리는 코드 상에 /videos/watch를 작성하지 않았다. 이는 라우터의 특성 때문이다. 라우터는 미들웨어 함수처럼 사용된다. 그래서 app.use()의 인자(Argument)로 사능 가능할 뿐만 아니라, 다른 라우터의 use()에 쓸 수 있다. 코드로 돌아가서 videoRouter만 대표로 살펴보자.

```
const videoRouter = express.Router();

const handleWatchVideo = (req, res) => res.send("Watch Video");

videoRouter.get("/watch", handleWatchVideo);

app.use("/videos", videoRouter);
```

위의 코드는 작성 순서와는 반대 순서로 작동한다. 예를 들어 /videos/watch에 접속했다고 하자. 그러면 app.use에서 /videos에 들어갔으므로 videoRouter를 호출한다. 라우터는 미들웨어처럼 작동하기 때문에 이전 정보를 가지고 간다. 다시 말해, 현재 주소가 /videos라는 정보를 가지고 videoRouter.get()을 확인한다. videoRouter.get("/watch", handleWatchVideo)를 보면 /watch를 확인할 수 있다. 미들웨어의 PATH는 현재 주소를 루트로 사용하기 때문에, 실질적인 주소는 /videos/watch가 된다. 그리고 우리는 /videos/watch에 접속했으므로 handleWatchVideo가 호출되고 "Watch Video"가 출력된다.

### 4.2 Cleaning the Code

#### export & import

애플리케이션의 크기가 커지면 파일을 분리하는게 더 효율적이게 된다. 이때 분리된 각각의 파일을 모듈(Module)이라고 하는데, 대부분 클래스 하나 또는 특정한 목적을 가진 복수의 함수로 구성된 라이브러리 하나로 구성된다. 이렇게 파일을 분리하게 되면 다시 파일을 불러와 합치는 과정이 필요하다. 이를 위한 지시어가 **export**와 **import**다.
- export: 변수나 함수 앞에 붙이면 그 변수나 함수를 외부에서 접근 가능하게 된다.
- import: 외부 모듈의 기능을 가져올 수 있다.

예를 들어서 다음과 같은 코드가 있다고 하자. 이 코드는 export로 helloWorld, sayHi 함수를 내보낸다. 보다시피 export를 사용해서 여러 개를 내보낼 수 있다.

```
// Hello.js
export function HelloWorld() {
    console.log("Hello World!");
}

export function sayHi(user) {
    console.log(`Hello ${user}`);
}
```

이를 사용하기 위해선 다른 파일에서 import로 불러와야 한다. 불러오는 방식은 `import {name1, name2, ... , name5} from "PATH"`의 형태로 불러온다. 주의할 것은 불러올때 같은 이름을 사용해야 한다는 것이다.

```
// main.js
import {HelloWorld, sayHi} from "Hello.js";

HelloWorld();
sayHi("Jack");
```

그런데 export 하는 함수가 하나 뿐이라거나 기본으로 내보낼 것을 정하고 싶을 수 있다. 이때 사용하는 것이 export default다. 사용법은 기존과 크게 다르지 않은데, 그저 export 대신에 export default를 써주는 것이다. 대신에 이를 import 하는 파일에선 조금 차이가 생긴다. import를 할 때 {}를 사용할 필요가 없고, 이름을 바꿀 수 있다. 하지만 불필요한 혼란을 일으키므로 이름을 그대로 사용하는 것이 좋다.

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

#### Clean Code
이번에는 import와 export를 사용해서 우리가 작성한 코드를 고쳐볼 것이다. 기존에 우리가 작성했던 코드는 여러 라우터가 한 파일안에 들어있다. 이 경우 유지 보수에 어려움을 격을 수 있다. 만약 라우터에 사용되는 함수가 굉장히 많아지거나 라우터의 수가 크게 늘어나면, 코드의 가독성도 떨어지고 서로 연괸된 코드가 어떤 것인지 분간하기 어려워진다. 그래서 라우터별로 코드를 모아주겠다. 우선 src에 routers라는 폴더를 하나 만든다. 그후 globalRouter.js, userRouter.js, videoRouter.js 파일을 만들고 각 라우터와 관련된 코드를 옮겨준다. 주의할 점은 각 모듈에서도 express를 import해야 정상적으로 작동한다는 점이다. 그 외에는 export default와 import를 사용해서 파일을 정리하면 된다. 이 과정을 완료하면면 코드는 아래처럼 된다.

```
// server.js
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");
app.use(logger);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log(`Server listenting on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
```

```
// globalRouter.js
import express from "express";

const globalRouter = express.Router();

const handleHome = (req, res) => res.send("Home");

globalRouter.get("/", handleHome);

export default globalRouter;
```

```
// userRouter.js
import express from "express";

const userRouter = express.Router();

const handleEditUser = (req, res) => res.send("Edit User");

userRouter.get("/edit", handleEditUser);

export default userRouter;
```

```
// videoRouter.js
import express from "express";

const videoRouter = express.Router();

const handleWatchVideo = (req, res) => res.send("Watch Video");

videoRouter.get("/watch", handleWatchVideo);

export default videoRouter;
```

### 4.3 Exports
앞서 우리는 각 라우터별로 모듈을 나눴다. 그런데 우리는 파일에서 라우터만을 다루고 싶은데, 파일에는 컨트롤러도 같이 존재하고 있다. 현재는 컨트롤러가 그리 많지 않아서 문제가 없어보이지만, 파일이 커지게 되면 관리에 어려움이 생긴다. 라우터만 수정하고 싶은데도 컨트롤러도 같이 나오니 코드가 길어지고, 반대로 컨트롤러를 수정하고 싶으면 각 라우터를 뒤지면서 해당 컨트롤러를 찾아야 한다. 그래서 각 라우터의 컨트롤러를 관리하는 파일을 따로 만들어주겠다.

src 폴더에 새로 controllers라는 폴더를 하나 만든다. 그리고 그 속에 userController.js와 videoController.js 파일을 만든다. 이때, globalController는 만들지 않는데, 그 이유는 globalRouter가 url의 편이를 위해 생성된 것이기 때문이다. 앞으로 globalRouter에 만들 컨트롤러들은 url의 편이를 위해 globalRouter에 있을 뿐, 실제로는 사용자와 비디오를 다룬다. 그렇기 때문에 globalController를 따로 만드는 것이 아니라 userController과 videoController에 만들어 줄 것이다. 예를 들어 /login은 globalRouter에 있지만 사용자가 로그인 하는 것이므로 userController에서 관리를 한다.

이렇게 각 파일을 나눴으면 원하는 컨트롤러를 만들어서 각 라우터에 연결해준다. 이때 여러 함수를 export하므로 export default가 아닌 그냥 export로 내보내고, import로 각 함수를 불러와주면 된다. 우리가 필요한 함수를 하나하나 살펴보자. 먼저 globalRouter에는 "/"에서 인기 동영상을 불러오는 기능이 필요하므로, 이를 `globalRouter.get("/", trending)`으로 만든다. 그리고 `globalRouter.get("/join", join)`으로 회원가입하는 함수를 하나 만든다. 이 경우 join은 userController.js에 만들어야 하고, trending은 videoController.js에 만들어야 한다. 각 파일에 하나씩 만들면 다음처럼 된다.

```
// userController.js
export const join = (req, res) => res.send("Join");
```

```
// videoControllser.js
export const trending = (req, res) => res.send("Home Page Videos");
```

그리고 이를 불러오는 globalRouter.js는 import로 join과 trending을 불러와서 라우터를 만든다.

```
// globalRouter.js
import express from "express";
import { join } from "../controllers/userController";
import { trending } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);

export default globalRouter;
```

나머지 필요한 것들은 user가 edit, remove하는 기능과 video를 watch, edit하는 기능이다. 이 둘을 각각 userController.js와 videoController.js에 만들어서 userRouter.js와 videoRouter.js에 import해서 만들어주면 파일은 최종적으로 아래처럼 된다.

```
// userController.js
export const join = (req, res) => res.send("Join");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
```

```
// videoController.js
export const trending = (req, res) => res.send("Home Page Videos");
export const watch = (req, res) => res.send("Watch");
export const edit = (req, res) => res.send("Edit");
```

```
// globalRouter.js
import express from "express";
import { join } from "../controllers/userController";
import { trending } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);

export default globalRouter;
```

```
// userRouter.js
import express from "express";
import { edit, remove } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/remove", remove);

export default userRouter;
```

```
// videoRouter.js
import express from "express";
import { watch, edit } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/watch", watch);
videoRouter.get("/edit", edit);

export default videoRouter;
```

### 4.4 Router Recap

### 4.5 Architecture Recap

### 4.6 Planning Routers
```
// README.md
/login -> Login
/search -> Search

/users/:id -> See User
/users/logout -> Log Out
/users/edit -> Edit MY Profile
/users/delete -> Delete MY Profile

/videos/:id -> See Video
/videos/:id/edit -> Edit Video
/videos/:id/delete -> Delete Video
/videos/upload -> Upload Video
```

```
// userController.js
export const join = (req, res) => res.send("Join");
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See User");
```

```
// videoController.js
export const trending = (req, res) => res.send("Home Page Videos");
export const see = (req, res) => res.send("Watch");
export const edit = (req, res) => res.send("Edit");
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Video");
```

```
// globalRouter.js
import express from "express";
import { join, login } from "../controllers/userController";
import { trending, search } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;
```

```
// userRouter.js
import express from "express";
import { edit, remove, logout, see } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get(":id", see);

export default userRouter;
```

```
// videoRouter.js
import express from "express";
import { see, edit, upload, deleteVideo } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id", see);
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/delete", deleteVideo);

export default videoRouter;
```

### 4.7 URL Parameters part One

### 4.8 URL Parameters part Two