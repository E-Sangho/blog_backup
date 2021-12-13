---
layout: post
title: [Youtube Clone] Start Node.js
date: Mon Dec 13 18:18:43 JST 2021
categories: Node.js
tag:
toc: true
---

## 1. Start Node.js

시작하기에 앞서 본인은 MacOS를 사용하고, VSCode로 코드를 작성한다.
각자의 환경이 다른 만큼 조금의 차이는 있을 수 있으므로 이에 유의하자.
Node.js를 시작하려면 우선 설치를 해야 한다.
[Node.js](https://nodejs.org/ko/) 사이트에 들어가면 각자의 OS에 맞는 Node.js를 다운 받을 수 있다.
Node.js가 정상적으로 설치되었다면 터미널에서 `node -v`를 입력했을 때, Node.js의 버전이 출력된다.

이제 VSCode로 앞으로 작업을 진행할 폴더를 열어준다.
`git init`을 입력하고 레파지토리와 연결해서 Github에 백업할 준비를 해준다.

Node.js로 작업을 시작하려면 `npm init`을 입력해야 하는데, 명령어를 입력하면 **package.json** 파일을 만들게 된다.
명령어를 입력하면 패키지 이름, 버젼, 설명을 적을 수 있는데, 크게 중요한 부분은 아니므로 적당히 적어준다.
그 외의 entry point, text command, keyword 등은 우선은 엔터로 넘어가주자.
그러면 package.json 파일에 지금까지 적은 내용이 JSON 파일로 저장된 것을 볼 수 있다.
추후에 바꾸고 싶은 내용이 생긴다면 pakage.json 파일을 수정하면 된다.

## 2. scripts

[package.json](https://docs.npmjs.com/cli/v8/configuring-npm/package-json) 파일을 보면 다양한 것이 있다.
name, version, description 등의 내용들은 패키지를 배포한다면 굉장히 중요하겠지만, 우리는 패키지를 배포하지 않을테니 크게 신경쓸 필요는 없다.
정확한 설명을 보고 싶으면 위의 링크를 확인해보자.

파일을 보면 main에 **index.js**라고 적혀 있다.
main은 내가 배포하는 패키지를 다른 사람이 설치하면, main을 사용한다는 의미로, 우리에게 필요한 것이 아니므로 지워주자.

이제 파일을 한 번 실행시켜보자.
아직 아무런 파일도 없으므로, 실행시킬 파일을 index.js라는 이름으로 하나 만든다.
그리고 index.js 파일에는 `console.log("Hello World!");`를 입력해준다.

이제 index.js 파일을 실행해야 한다.
index.js 파일을 실행하기 위해선 `node index.js`를 입력하면 된다.
이는 Node.js를 사용해서 파일을 실행하는 방법으로, 파일 속의 자바스크립트를 실행해준다.
이 방법은 간단한 파일을 실행하고 내용을 확인하는데 좋지만, 명령어에 옵션을 많이 추가할 수록 길어지는 단점이 있다.
그렇기 때문에 앞으로는 다른 방법으로 파일을 실행하겠다.

파일을 실행하는 다른 방법은 package.json의 **scripts**를 쓰는 것이다.
scripts는 실행하고 싶은 명령어를 지정할 수 있는데, `npm run <stage>`의 형태로 실행할 수 있다.
scripts에는 아래처럼 코드를 추가해주자.

```
// package.json
...
"scripts": {
    "start": "node index.js"
},
...
```

이 script를 실행시키는 방법은 `npm run start`를 입력하는 것이다.
그렇게 하면 start에 매칭되는 `node index.js`가 실행되고, 콘솔에 *Hello World!*가 출력된다.
scripts에는 다른 실행 명령어도 만들 수 있는데, 예를 들어 아래처럼 명령어를 추가하면 `npm run another`로 실행할 수도 있다.

```
// package.json
...
"scripts": {
    "start": "node index.js",
    "another": "node index.js"
},
...
```

다만 실행하려는 파일 경로를 정확하게 파악해야 한다.
파일을 package.json 파일을 기준으로 찾기 때문에, 다른 위치에 있다면 위치를 정확하게 지정해줘야 한다.

## 3. Installing Express

우리는 [Express](https://expressjs.com/ko/)를 사용해서 서버를 만들 것이다.
Express는 Node.js 웹 어플리케이션 프레임워크로 아래의 기능을 제공한다.

-   HTTP 요청에 핸들러를 만든다.
-   viwe의 랜더링 엔진을 쓸 수 있다.
-   접속용 포트, 랜더링을 위한 템플릿 위치같은 설정이 가능하다.
-   미들웨어를 사용할 수 있다.

이들은 지금 이해하기엔 무리지만 직접 사용해보면 어떤 의미인지 알 수 있게 된다.
지금은 그저 **Express를 사용해서 서버를 만든다**는 것만 기억하자.

이제 Express를 설치해보자.

`npm install` 또는 `npm i`는 패키지를 다운로드 하는 명령어다.
예를 들어 Express를 설치하기 위해선 `npm install express` 또는 `npm i express`를 입력하면 된다.
그렇지만 이렇게 패키지를 설치할 때는 주의할 점이 하나 있는데, 반드시 **package.json을 저장하고 실행해야 한다**는 것이다.
왜냐하면 `npm i`는 설치한 패키지를 **dependencies**라는 항목에 저장하게 되는데, 저장하지 않고 이를 진행하면 이전에 작성한 내용이 사라지게 된다.

`npm i express`로 Express를 설치하면 package-lock 파일과 node_modules 폴더가 생겼다.
node_modules 폴더는 npm으로 설치한 모든 패키지가 저장된다.
node_modules 폴더를 열어보면 express 폴더가 있다.
그리고 express를 열어보면 package.json 파일이 있는데, 그 안을 보면 **dependencies**가 있다.
여기에는 express가 실행되기 위해 필요한 패키지와 그 버전을 적는다.
npm은 패키지를 설치할 때, 단순히 그 패키지만 설치하는 것이 아니라, dependencies의 패키지를 모두 다운 받는다.
그리고 다시 다운 받는 패키지의 dependencies에서 패키지를 다운 받는 과정을 반복해준다.
그 결과 우리는 express만 설치했을 뿐인데도, 이를 실행시키기 위해 필요한 패키지를 모두 자동으로 설치할 수 있다.
만약 이런 기능이 없었다면 일일이 모든 패키지를 설치해야 했겠지만, 다행히도 npm이 이 모든 과정을 대신해준다.

다시 제일 처음 위치로 돌아와서 우리가 만든 package.json 파일을 보자.
그러면 이전에 없던 dependencies가 생기고, express가 있는 것을 볼 수 있다.
즉, npm으로 설치해주면 package.json에 자동적으로 dependencies를 만들어서 관리해주게 되므로, 우리는 따로 dependencies를 작성할 필요가 없다.
