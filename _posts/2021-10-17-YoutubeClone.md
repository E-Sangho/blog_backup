---
layout: post
title: Youtube Clone
date: Sun Oct 17 17:52:23 JST 2021
categories: Clone NodeJS
tag: Clone NodeJs
toc: true
---
## What is this post?
이 포스트는 노마드코더라는 사이트의 유튜브 클론코딩을 정리한 포스트다. 우선은 영상을 보면서 배운 내용을 다 적은 다음 다시 정리하려고 한다. 내용을 다 정리하고 나면 정리된 내용을 바탕으로 새로운 것을 만들어서 배운 것을 응용하는 단계까지 진행하고 그 과정을 기록하는 포스트다.

배우기전에 요구하는 사항으로는

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

이 코드를 실행하는 방법은 `npm run start`라고 입력하는 것이다. 그러면 index.js가 실행되서 콘솔에 *Hello World!*가 나오는 것을 볼 수 있다. scripts에는 다른 실행 명령어도 만들어 줄 수 있다. 대신 실행하려는 파일 위치가 package.json과 다른 위치에 있다면 정확히 위치를 지정해 줘야 한다.

####
`npm install`또는 `npm i`를 사용하면 원하는 패키지를 다운받을 수 있다. Express를 설치하기 위해 `npm i express`를 입력해야 하는데, 그 전에 package.json과 index.js 창을 꺼야 한다.