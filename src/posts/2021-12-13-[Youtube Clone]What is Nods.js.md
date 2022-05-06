---
layout: post
title: [Youtube Clone] What is Node.js
date: Mon Dec 13 15:14:04 JST 2021
categories: Node.js
tag:
toc: true
---

## 1. Node.js는 웹 브라우저 밖의 JavaScript다.

JavaScript를 배우면서 편한 점 중 하나는, 웹 브라우저에 인터프리터가 내장되어 있다는 점이다.
그 덕분에 브라우저만 있다면 JavaScript를 쉽게 실행 시킬 수 있었다.
하지만 이 장점은 동시에 치명적인 단점인데, JavaScript를 브라우저 밖에서 실행시킬 수 없다는 것이다.
이는 JavaScript가 브라우저에 쓰기 위해 만들어진 언어이므로 당연해보이지만, 다른 용도로 쓸 수 없다는 것은 크게 아쉬운 점이었다.

그러던 중 구글에서 V8 엔진을 개발하게 된다.
V8은 C++로 작성된 JavaScript 엔진으로 웹 브라우저에서 더 빠르게 실행시키기 위해 만들어졌다.
이를 위해 JavaScript 코드를 머신 코드로 번역하고 실행시킨다.
어떤 과정으로 이런 일이 생기는지는 자세히 모르지만, 핵심은 V8이 JavaSciprt를 번역해서 실행시킨다는 것이다.

Ryan Dahl은 Ruby V8 엔진을 기반으로 Node.js를 만들게 된다.
Node.js의 등장으로 JavaScript는 브라우저를 벗어나서 다른 곳에서도 쓸 수 있게 된다.
이로 인해서 생기는 가장 큰 장점은 서버를 JavaScript로 만들 수 있다는 것이다.
다시 말해 프론트엔드에서만 쓰이던 JavaScript가 백엔드에서도 쓸 수 있게 되면서, 하나의 언어로 웹을 모두 다룰 수 있게 된 것이다.

## 2. Non-Blocking I/O & Single Thread Event-loop

그 외에도 Node.js는 Non-Blocking I/O, Single Thread Event-loop라는 특성이 있다.
이들은 지금 실제로 일어나는 것을 보기 전에는 이해하기 어려우므로 지금은 넘어가도록 한다.

## 3. NPM

Node.js는 npm(Node Package Manager)이라는 패키지 관리자를 사용하는데, Node.js에서 사용하는 모듈을 패키지로 만들어 배포하는 것이다.

// module, package, libraries, frmawork 차이 설명하기

npm은 Node.js만 있으면 별다른 설치 없이 사용할 수 있으며, 앞으로 우리는 npm을 이용해서 패키지를 설치할 서이다.
