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

### 3.6 MiddleWares Part Two

### 3.7 Setup Recap

### 3.8 Servers Recap

### 3.9 Controllers Recap

### 3.10 MiddleWare Recap

### 3.11 External Middlewares