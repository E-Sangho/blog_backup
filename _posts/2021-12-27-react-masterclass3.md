---
layout: post
title: react-masterclass 3 Crypto Tracker
date: Mon Dec 27 14:59:21 JST 2021
categories: React
tag:
toc: true
---

## Crypto Tracker

### 1. Introduction

이번에는 코인 정보를 보여주는 페이지를 만들어보겠다.
코인 정보를 받아오기 위해서 [coinpaprika api](https://api.coinpaprika.com/)를 사용하고, react-query를 써서 데이터를 가져올 예정이다.
그렇지만 react-query를 사용하기 전에 먼저 fetch를 사용한다.
그 이유는 fetch를 사용했을 때 생기는 불편함이, react-query를 쓰면 어떻게 간편하게 해결되는지 보여주고 싶기 때문이다.

코드를 작성하기 전에 파일 코드를 간결하게 만들어줬다.
우선 theme을 light, dart로 나누는 것이 아니라 하나로 만들었다.
그리고 거기에 맞춰서 index.tsx에서 theme을 import하고, <ThemeProvider>에도 theme을 건네줬다.

```
// theme.ts
import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  bgColor: "white",
  textColor: "black",
  btnColor: "tomato",
};
```

```
// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { theme } from "./theme";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

다음으로 코인 페이지에서 라우터를 만들려고 한다.
라우터를 쓰려면 react-router-dom 이 필요하므로 설치해야 한다.
겸사겸사 react-query도 설치해줬다.

`npm i react-router-dom react-query`

이번에 라우터를 만들 때, nested router도 만들 예정이므로 나중에 소개하겠다.

### 2. Setup

먼저 라우터를 만들 routes 폴더를 만들어준다.
그리고 그 안에 Coin.tsx, Coin.tsx 파일을 만든다.
Coins.tsx에는 모든 코인 정보가 보이는 페이지를 만들 예정이고, Coin.tsx에는 각 코인의 세세한 정보를 보여주도록 만들 것이다.
일단은 간단하게 형태만 만들어 놓는다.

```
// src/routes/Coins.tsx
function Coins() {
  return <h1>Coins</h1>;
}
export default Coins;
```

```
// src/routes/Coin.tsx
function Coin() {
  return <h1>Coin</h1>;
}
export default Coin;
```

다음으로 라우터 역할을 할 router.tsx 파일을 만든다.
이때 우리는 react-router-dom을 사용할텐데, 타입스크립트를 쓰고 있으므로 추가로 설치해줘야 한다.

`npm i --save-dev @types/react-router-dom`

설치가 끝났으면 아래처럼 홈화면과 각 코인 정보를 보여줄 라우트를 만든다.
아래는 5.3.0 버전으로 작성했다.

```
// src/Router.tsx
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "./routes/Coin";
import Coins from "./routes/Coins";

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:coinId">
          <Coin />
        </Route>
        <Route path="/">
          <Coins />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
export default Router;
```

이제 라우터를 App.tsx에서 불러서 사용할 수 있도록 만든다.

```
// App.tsx
import Router from "./Router";

function App() {
  return <Router />;
}

export default App;
```

다음으로 <Coin>에서 받아온 coinId를 사용하겠다.
우

```
// src/routes/Coin.tsx
import { useParams } from "react-router";

function Coin() {
    const { coinId } = useParams();
    return <h1>Coin: {coinId}</h1>;
}
export default Coin;
```

그런데 useParams에 타입이 없기 때문에 에러가 발생한다.
이를 해결하기 위해선 useParams에 타입을 설정해줘야 한다.
방버은 2가지로 직접 타입을 적어주는 것과 interface로 만드는 것이다..

```
// src/routes/Coin.tsx
import { useParams } from "react-router";

function Coin() {
    const { coinId } = useParams<{coinId: string}>();
    return <h1>Coin</h1>;
}
export default Coin;
```

```
// src/routes/Coin.tsx
import { useParams } from "react-router";

interface RouteParams {
    coinId: string;
}

function Coin() {
    const { coinId } = useParams<RouteParams>();
    return <h1>Coin</h1>;
}
export default Coin;
```

### 3. Styles

CSS 스타일을 만들어주겠다.
시작하기에 앞서 모든 스타일을 초기화 하고 싶다.
Reset CSS를 사용하면 간단한데, styled-reset을 사용해도 된다.
그런데 styled-reset 파일을 들여다보면, Reset CSS를 그대로 사용한 것이므로 사실상 동일한 것이다.
하지만 이렇게 간단히 해결하기보다는 직접 만들어서 어떻게 작동하는지 알아보자.

전체 도큐먼트에 스타일을 적용하기 위해선어떻게 해야 할까?
이전에 styled-components를 사용할 때를 생각해보자.
스타일 컴포넌트를 만들면 해당 컴포넌트에만 스타일이 적용된다.
하지만 폰트나, Reset CSS처럼 전체적으로 적용시켜야 하는 경우가 있따.
이때 사용하는 것이 createGlobalStyle이다.

createGlobalStyle을 styled-components에서 import 해준다.
createGlobalStyle은 컴포넌트를 만드는데, 랜더링 될 때 전역으로 스타일이 적용되게 된다.
App.tsx에 아래처럼 작성하자.

```
// App.tsx
import Router from "./Router";

const GlobalStyle = createGlobalStyle`
  body {
    color: red;
  }
`;

function App() {
  return <Router />;
}

export default App;
```

이제 App에서 GlobalStyle을 포함해서 리턴해줘야 한다.
그런데 하나만을 리턴할 수 있으므로 `return <GlobalStyle><Router />` 처럼 작성하거나, div를 써서 아래처럼 작성해야 한다.

```
// App.tsx
import Router from "./Router";

const GlobalStyle = createGlobalStyle`
  body {
    color: red;
  }
`;

function App() {
  return
  <div>
    <GlobalStyle />
    <Router />;
  </div>
}

export default App;
```

하지만 이런식으로 작성하면 코드에 필요없는 <div>가 너무 많이 생긴다.
그렇기 때문에 React에서는 Fragment라는 것을 사용한다.
Fragment는 <>로 작성하는데 부모 없이 서로 붙어 있는 것을 반환하는데 사용한다.
Fragment를 사용하면 위의 코드를 아래처럼 고칠 수 있다.

```
// App.tsx
import Router from "./Router";

const GlobalStyle = createGlobalStyle`
  body {
    color: red;
  }
`;

function App() {
  return
  <>
    <GlobalStyle />
    <Router />;
  <>
}

export default App;
```

이제 브라우저에서 확인해보면 스타일이 잘 적용되었다.
다시 우리가 하던 일로 돌아가서 Reset CSS를 적용시켜줘야 한다.
그러므로 [Reset CSS](https://meyerweb.com/eric/tools/css/reset/) 사이트에서 내용을 복사해서 GlobalStyled에 넣어준다.

```
// App.tsx
import Router from "./Router";

const GlobalStyle = createGlobalStyle`
  // Reset CSS Here
`;

function App() {
  return
  <>
    <GlobalStyle />
    <Router />;
  <>
}

export default App;
```

다음으로 폰트를 추가해보자.
폰트를 추가하려면 [Google Fonts](https://fonts.google.com/)를 사용하면 된다.
Google Fonts에서 원하는 폰트를 선택한 다음 스타일을 추가한다.
그리고 @import로 가져와서 GlobalStyled의 제일 위에 적어준다.
다음으로 아래처럼 폰트를 추가해준다.

```
// App.tsx
import Router from "./Router";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
  // Reset CSS Here
  body {
    font-family: 'Source Sans Pro', sans-serif;
  }
`;

function App() {
  return
  <>
    <GlobalStyle />
    <Router />;
  <>
}

export default App;
```

그 외에도 원하는 스타일을 추가하면 된다.

```
// App.tsx
import Router from "./Router";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
  // Reset CSS Here
* {
  box-sizing: border-box;
}
body {
  font-family: 'Source Sans Pro', sans-serif;
  background-color:${(props) => props.theme.bgColor};
  color:${(props) => props.theme.textColor}
}
a {
  text-decoration:none;
}
`;

function App() {
  return
  <>
    <GlobalStyle />
    <Router />;
  <>
}

export default App;
```

이제 테마의 색을 정해보자.
색조합은 [Flat Ui Colors](https://flatuicolors.com/)에서 추천 받을 수 있다.

```
// src/theme.ts
import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  bgColor: "#2f3640",
  textColor: "#f5f6fa",
  accentColor: "#9c88ff",
};
```

여기서 버튼 대신에 accentColor로 바꿔줬다.
그렇기 때문에 styled.d.ts에 가서 theme의 interface를 수정해줘야 한다.

```
// styled.d.ts
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    accentColor: string;
  }
}
```

### 4. Home

이제 본격적으로 페이지를 만들어보자.
Home은 Coins.tsx에 작성했으므로 여기에다가 만들어줘야 한다.
Container, Header, CoinsList, Coin의 styled components를 만든다.
그리고 Coins를 아래처럼 만들어준다.

```
// Coins.tsx
import styled from "styled-components";

const Container = styled.div``;

const Header = styled.header``;

const CoinsList = styled.ul``;

const Coin = styled.li``;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

function Coins() {
  return (
    <Container>
      <Header>
        <Title>코인</Title>
      </Header>
      <CoinsList>
          <Coin >

          </Coin>
      </CoinsList>
    </Container>
  );
}
export default Coins;
```

CSS가 적용되는지 확인하기 위해선 coinpaprika에서 정보를 받아와야 하지만, 지금은 임시로 데이터를 복사해와서 사용하도록 하자.
아래처럼 임시로 사용할 데이터를 추가한다.

```
// Coins.tsx
const coins = [
  {
    id: "btc-bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    rank: 1,
    is_new: false,
    is_active: true,
    type: "coin",
  },
  {
    id: "eth-ethereum",
    name: "Ethereum",
    symbol: "ETH",
    rank: 2,
    is_new: false,
    is_active: true,
    type: "coin",
  },
  {
    id: "hex-hex",
    name: "HEX",
    symbol: "HEX",
    rank: 3,
    is_new: false,
    is_active: true,
    type: "token",
  },
];
...
function Coins() {
  ...
}
```

이제 위의 데이터로 링크를 만들어야 하는데 coins에 map을 사용해서 만들어준다.
이때 map을 사용했으므로 <Coin>에는 key가 필요하다.
key로는 coin.id를 사용한다.

```
// Coins.tsx
function Coins() {
  return (
    <Container>
      <Header>
        <Title>코인</Title>
      </Header>
      <CoinsList>
        {coins.map((coin) => (
          <Coin key={coin.id}>
            {coin.name} &rarr
          </Coin>
        ))}
      </CoinsList>
    </Container>
  );
}
```

이제 <Coin>에 링크를 만들어야 하는데, <a>를 사용하면 페이지가 새로고침 되므로 <Link>를 사용했었다.

<Link>에 연결되는 경로는 coin.id를 사용했으므로 아래처럼 만든다.

```
// Coins.tsx
import { Link } from "react-router-dom";
function Coins() {
  return (
    <Container>
      <Header>
        <Title>코인</Title>
      </Header>
      <CoinsList>
        {coins.map((coin) => (
          <Coin key={coin.id}>
            <Link to={`/${coin.id}`}>{coin.name} &rarr;</Link>
          </Coin>
        ))}
      </CoinsList>
    </Container>
  );
}
```

이제 여기다가 CSS를 만들어줬다.

```
// Conis.tsx
const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    padding: 20px;
    transition: color 0.2s ease-in;
    display: block;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;
```

여기서 <Coin>의 스타일을 보면 <Link>가 최종적으로 <a>로 바뀌기 때문에, <Link> 대신에 <a>를 썼다.

추가로 a의 색 때문에 App.tsx를 조금 수정했다.

```
// App.tsx
a {
  text-decoration:none;
  color:inherit;
}
`;
```

이제 스타일링을 다 했으므로 fetch로 데이터를 가져오겠다.
타입스크립트로 가져오므로 fetch로 받아오는 정보도 타입을 정해야 한다.
그래서 interface를 만들어줬다.

```
// Coins.tsx
interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}
```

받아온 데이터를 넣어줄 변수가 필요하므로 useState를 사용해야 한다.
그리고 useState에 앞서 만든 interface를 적용해야 한다.
이때 interface가 array에 적용되는 것이므로 뒤에 []를 붙여야 한다.

```
// Coins.tsx
import { useState } from "react";
function Coins() {
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  return (
    ...
  );
}
export default Coins;
```

다음으로 fetch로 데이터를 받아오려고 한다.
페이지에 처음 들어왔을 때만 데이터를 받아와야 하므로 useEffect(effect, [])를 써야 한다.
그리고 useEffect 안에서 effect를 작성할 때, async await을 사용하려고 한다.
여기서 간단한 트릭을 쓰면 코드를 더 쉽게 쓸 수 있다.
`(async() => {})`는 함수를 만든다.
그리고 이 뒤에()를 붙이면 그 함수를 실행시키게 된다.

```
// Coins.tsx
import { useEffect, useState } from "react";

function Coins() {
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      console.log(json);
    })();
  }, []);
  return (
    ...
  );
}
export default Coins;
```

그런데 가져오는 데이터 양이 너무 많기 때문에 json에 slice를 사용해서 100개만 setCoins에 사용하겠다.

```
// Coins.tsx
import { useEffect, useState } from "react";

function Coins() {
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      setCoins(json.slice(0, 100));
    })();
  }, []);
  return (
    ...
  );
}
export default Coins;
```

마지막으로 로딩 스테이트를 만들겠다.
useState로 변수를 만들고, useEffect가 끝나는 순간 setLoading(false)을 사용한다.
그리고 {loading ? () : ()}으로 로딩중인 경우를 만들어준다.

```
// Coins.tsx
function Coins() {
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      setCoins(json.slice(0, 100));
      setLoading(false);
    })();
  }, []);
  return (
    <Container>
      <Header>
        <Title>코인</Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {coins.map((coin) => (
            <Coin key={coin.id}>
              <Link to={`/${coin.id}`}>{coin.name} &rarr;</Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}
export default Coins;
```
