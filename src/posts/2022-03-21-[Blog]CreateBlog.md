---
layout: post
title: Create React Blog
date: 2022-03-21 21 15:44:22
categories: React, TypeScript
tag:
toc: true
---

## Before Start

TypeScript를 이용해서 블로그를 만들 것이므로 create-react-app으로 typescript 폴더를 하나 만든다.
아래 명령어를 입력하는데 ReactBlog는 폴더 이름으로 원하는대로 작성하면 된다.

`npx create-react-app ReactBlog --template typescript`

생성된 폴더 안의 src를 보자.
여러 파일이 있지만, App.tsx, index.tsx를 제외하곤 필요 없으므로 삭제한다.
그리고 각 파일에서 필요 없는 부분을 삭제해서 아래처럼 만든다.

```
// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
```

```
// App.tsx
function App() {
  return <h1>App</h1>;
}

export default App;
```

기본적으로 필요한 패키지를 몇 개 설치하겠다.
styled-components와 react-router-dom이 필요하므로 설치해준다.
이때 TypeScirpt용 패키지도 같이 설치한다.

```
npm i styled-components
npm i @types/styled-components
npm i react-router-dom
npm i @types/react-router-dom
```

## Reset CSS

Reset CSS를 적용하기 위해 createGlobalStyle을 사용했다.
우선 아래처럼 createGlobalStyle을 styled-components로 부터 import한다.
그리고 createGlobalStyle로 컴포넌트를 만든 다음, Reset CSS를 붙여넣기 한다.

```
// App.tsx
import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
    // Copy and Paste Reset CSS
    // You can find Reset CSS here "https://meyerweb.com/eric/tools/css/reset/"
`;
```

## Router

## Header & Navbar

## React fontawesome
