---
layout: post
title: Youtube Clone 8
date: Sun Dec  5 23:10:13 JST 2021
categories: Nodsjs
tag:
toc: true
---
## 12 VIEWS API

### 12.0 Register View Controller
영상 조회수를 기록하는 것을 만들어보겠다. 영상을 시청할 때마다 백엔드에 요청을 보내고, 해당 id의 조회수를 올려준다. 그 전에 우리가 만들 새로운 views를 이해해야 한다. 현재 우리 코드를 보면 서버에서 views로 페이지를 랜더링해주고 있다. 그런데 대부분의 페이지는 이런식으로 작동하지 않는다. 요즘 백엔드는 템플릿은 랜더링하지 않는다. 백앤드는 인증, DB를 담당하고, 프론트엔드는 React 등으로 만든다. 현재 우리 Nodejs는 페이지까지 랜더링하고 있는데 이를 바꿔보려고 한다. 그래서 템플릿을 랜더링하지 않는 views를 만들텐데 이를 api views라고 한다.

지금까지 우리가 아는 지식으로 조회수를 올려주는 기능을 만드려고 해보자. routers에 새로운 apiRouter.js 파일을 만든다. 그리고 그 안에 새로운 라우터를 만들고 server.js에서 특정 주소로 들어가면 그 라우터를 쓸 수 있게 해준다. 다음으로 해당 라우터에서 사용할 컨트롤러를 만든다. 컨트롤러는 비디오의 id로 영상을 찾아서 비디오가 없다면 오류를 보내고, 있다면 조회수를 +1 한 다음 저장하는 기능을 할 것이다.

하지만 이는 우리가 하려는 바가 아니다. 다음에는 어떻게 이를 바꿀 수 있는지 알아보자.

### 12.1 Register View Event

### 12.2 Conclusions

## 13 VIDEO RECORDER

### 13.0 Recorder Setup

### 13.1 Video Preview

### 13.2 Recording Video

### 13.3 Recording Video part Two

### 13.4 Downloading the File

### 13.5 Recap
