---
layout: post
title: Youtube Clone
date: Sun Oct 17 17:52:23 JST 2021
categories: Clone NodeJS
tag: Clone NodeJs
toc: true
---
## 0 What is this post?
이 포스트는 노마드코더라는 사이트의 유튜브 클론코딩을 정리한 포스트다. 우선은 영상을 보면서 배운 내용을 다 적은 다음 다시 정리하려고 한다. 내용을 다 정리하고 나면 정리된 내용을 바탕으로 새로운 것을 만들어서 배운 것을 응용하는 단계까지 진행하고 그 과정을 기록하는 포스트다. 수업에서 배우는 내용은 다음과 같다.

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