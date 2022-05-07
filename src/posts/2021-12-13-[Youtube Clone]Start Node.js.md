---
layout: post
title: [Youtube Clone] Start Node.js
date: 2021-12-13 18:18:43
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

## 3. Express

### 3.1 Installing Express

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

### 3.2 dependencies

dependencies의 유용함을 알아보자.
node_modules 폴더와, package-lock.json 파일을 삭제하자.
이렇게하면 express가 삭제되었으므로 다시 설치해줘야 한다.
그런데 이번에는 `npm i`만 입력해보자.
이렇게하면 신기하게도 자동적으로 필요한 파일이 설치된다.
그 이유는 npm이 package.json 파일의 dependencies를 보고 필요한 패키지가 없다면 자동으로 설치해주기 때문이다.
우리는 이전에 package.json에 dependencies를 추가했으므로 express가 적혀있고, npm i 만으로 모든 필요한 것을 설치할 수 있다.

이 기능이 가장 유용한 것은 파일을 공유할 때다.
node_moduels는 굉장히 많은 패키지가 들어있기 때문에 용량이 크다.
그래서 이 모든 것을 동시에 전송해주는 것은 비효율적이다.
그런데 package.json만 있다면 어떤 패키지가 필요한지 알 수 있다.
그러므로 node_modules를 제외하고 공유해도 npm i를 사용하면 동일한 환경에서 사용할 수 있다.
이 기능을 사용한다면 우리는 node_modules 폴더를 github에 저장할 필요가 없다.
왜냐하면 package.json 파일만 있다면 `npm i`로 필요한 것을 모두 설치할 수 있기 때문이다.
그러므로 .gitignore에 node_modules 폴더를 추가해 업로드하는 파일에서 제외해주자.

```
// .gitignore
/node_modules
```

이전에도 말했듯이 다른 환경에서 파일을 받고 npm으로 패키지를 설치해줄 때, 반드시 package.json 파일을 저장하고 해야 한다.
npm i가 package.json 파일을 수정하기 때문에 저장하지 않으면 제대로 작동하지 않을 수 있다.
번거롭지 않으려면 모든 파일을 저장하고 끈 후에 npm i로 패키지를 설치하도록 하자.

## 4 Babel

### 4.1 Babel?

아마 바벨탑을 들어봤을 것이다.
바벨탑은 알다시피 모든 인간의 언어를 나뉘게 만든 전설이 있는데, 현재 JavaScript도 브라우저마다 호환성이 갈리게 된다.
그래서 각 브라우저를 고려해서 코드를 만들어야 하는 불편함이 있다.
다행히도 [Babel](https://babeljs.io/)을 사용하면 이를 간편하게 해결할 수 있다.
Babel은 JavaScript 컴파일러로, 최신 JavaScript를 웹 브라우저와 호환되는 이전 버전으로 번역해주는 일을 한다.
우리는 Node.js에서 Babel을 사용할 것이다.
그로 인해 ES6로 작성한 자바스크립트를 알아서 구버전으로 바꿔주고, 브라우저에서 사용할 수 있게 된다.

### 4.2 devDependencies

[바벨 웹페이지](https://babeljs.io/setup#installation)의 설명을 따라가며 진행하겠다.
우선은 NodeJS용 Babel을 설치하기 위해 `npm i --save-dev @babel/core`를 입력한다.
그후 package.json을 열어보면 **devDependencies**가 생긴 것을 알 수 있다.
이름을 보면 dependencies와 devDependiencies가 유사한데, 과연 둘은 어떤 차이점이 있을까?

devDependencies developer Dependencies로, 개발자를 위한 dependencies다.
이전에 설명했듯이 dependencies는 프로젝트의 코드가 실행되기 위해 필수적인 패키지다.
반면 devDependencies는 개발자가 코드를 만들 때 필요한 패키지로, 개발자의 편의를 위해 만들어졌다.
둘의 차이점은 dependencies가 필수적인 기능을 한다면, devDependencies는 코드 작성을 용이하게 해준다는 것이다.
그래서 devDependencies는 개발 단계에서만 사용하고, 런타임에서 사용하는 패키지는 dependencies에 있어야 한다.
Babel은 코드를 빌드하는 개발 단계에서만 사용하기 때문에 devDependencies에 있다.

그렇다면 어떻게 devDependencies에 저장할 수 있을까?
이전에 설치 했던 것을 보면 --save-dev라고 쓴 것을 알 수 있다.
npm i 에서 --save-dev 라고 추가한 것은 모두 devDependencies에 만들어진다.
간략하게 줄여서 -D를 사용해도 동일한 일을 한다.

### 4.3 Babel presets

이번에는 babel.config.json 파일을 만들어주자. 그리고 다음 코드를 적어준다.

```
// babel.config.json
{
  "presets": ["@babel/preset-env"]
}
```

그리고 `npm install @babel/preset-env --save-dev`를 실행한다.
이는 바벨의 presets를 지정하는 과정이다.
우리는 최신 자바스크립트를 번역하는데 사용하지만, React나 TypeScript를 번역하는데도 사용할 수 있다.
그리고 어떤 방식으로 번역할지 json 파일의 presets로 지정할 수 있다.
[프리셋](https://babeljs.io/docs/en/presets/)에서 어떤 프리셋이 있는지 볼 수 있지만, 우리는 자바스크립트 번역에만 쓸 것이므로 깊게 알 필요는 없다.

### 4.4 babel/node

바벨을 사용하는 방법은 아래 코드의 <code> 부분에 바꾸고 싶은 코드를 넣어주면 된다.

```
require("@babel/core").transform("<code>", {
  presets: ["@babel/preset-env"],
});
```

그렇지만 이는 굉장히 불편한데, 코드가 조금만 바뀌어도 다시 <code>에 바뀐 것을 넣어주고 코드를 다시 시작해야 하기 때문이다.
그래서 사용하는 것이 babel/node다.
babel/node는 Node.js의 CLI와 동일하게 동작하지만, 코드를 알아서 번역해준다는 점만 다르다.
예를 들어서 `babel-node index.js`는 `node index.js`와 동일하지만, JavaScript를 알아서 번역해준다는 점만 다르다.
이를 사용하면 매번 코드를 번역해주는 단계를 알아서 실행해주므로 번거로움이 줄어든다.

`npm install @babel/core @babel/node --save-dev`로 설치할 수 있다.
설치한 이후에 devDependencies를 확인하면 패키지가 설치되었다.

이제 Nodemon을 사용해서 script를 수정해보자.

```
// package.json
...
"scripts": {
    "dev": "babel-node index.js"
},
...
```

이렇게 하면 index.js 파일을 자동으로 바벨로 번역해서 Node.js로 실행해준다.
scripts의 명령 이름이 dev로 바뀌었으므로 실행 방법도 `npm run dev`로 바뀐다.
이제부터 index.js 파일에서 최신 JavaScript를 사용할 수 있다.
예를 들어서 `const express = require("express")` 대신에 `import express from "express"`를 대신 사용할 수 있다.

### 4.5 Nodemon

코드를 작성하다보면 다시 시작하는 경우가 굉장히 많다.
우리의 경우도 서버가 제대로 작동하는지 확인하기 위해서 매 번 새로 서버를 시작해야 한다.
하지만 코드가 바뀔 때마다 명령어를 입력하는 것은 번거로우므로, 코드 변화가 생기면 알아서 서버를 재시작해주는 기능이 필요하다.

다행히도 Nodemon이라는 것을 사용하면, 파일이 수정될 때마다 재시작해준다.
우선 `npm i nodemon --save-dev`으로 Nodemon을 설치해준다.
그리고 package.json 파일의 scripts를 수정해준다.

```
// package.json
...
"scripts": {
    "dev": "nodemon --exec babel-node index.js"
},
...
```

이번에 npm run dev로 실행하면 코드가 끝나지 않는 것을 알 수 있다.
이 때, index.js 파일을 수정해서 console에 이것저것 출력하게 만들어보자.
그러면 수정된 파일을 인식해서 자동으로 파일을 새로 시작해 주는 것을 알 수 있다.

정리하면 처음에 우리는 `node index.js`로 파일을 실행시켰다.
이는 노드로 index.js 파일을 실행 시킨 것을 의미한다.
하지만 노드는 최신 자바스크립트를 이해하지 못할 때가 있다.
그렇기 때문에 바벨을 사용해서 최신 자바스크립트를 사용할 수 있게 했다.
그래서 `babel-node index.js`로 실행했다.
그런데 파일에 변화가 생길 때마다 재시작하는 것은 번거롭다.
그러므로 우리는 파일이 수정되면 자동으로 재실행되도록 하려고 Nodemon을 설치했다.
최종적으로 코드는 `nodemon --exec babel-node index.js`가 되었다.
그래서 콘솔이 종료되지 않고 파일이 변할때마다 매번 명령어를 새로 시작해준다.
이제 기본적으로 필요한 패키지는 모두 설치했으므로 드디어 서버 만들기를 시작할 수 있게 되었다.
