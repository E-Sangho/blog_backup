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

글자 대신에 이미지를 추가해서 링크를 좀 더 보기 좋게 바꾸겠다.
코인의 이미지를 가져오는 API는 [Cryptoion](https://cryptoicon-api.vercel.app/)을 사용했다.

우선 이미지를 넣을 styled component를 만들어준다.
그리고 만든 컴포넌트를 <Link> 안에 추가시키고 링크를 추가해준다.

```
// Coins.tsx
const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

function Coins() {
            ...
              <Link to={`/${coin.id}`}>{coin.name}
                <Img
                  src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}
export default Coins;
```

그리고 스타일을 수정해주면 되는데 <Link>의 스타일을 수정하려면 <a>를 수정해줘야 한다.

```
// Coins.tsx
const Coin = styled.li`
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;
```

### 5. State

각 코인의 링크를 누르면 코인의 세부정보를 볼 수 있다.
이 페이지는 Coin.tsx에서 만든 것인데, 앞으로 여기서도 API를 추가한다.
그리고 API를 추가하면 로딩을 한 후에 페이지를 보여준다.
그런데 Home에서 페이지로 넘어간 경우를 생각해보면, 이미 코인의 정보를 어느 정도 알고 있다.
이미 알고 있는 정보를 사용해서 미리 정보를 보내주면, 페이지가 더 빠르게 작동하도록 만들 수 있다.
이를 위해서 사용하는 것이 <Link>의 state다.
state는 다음 페이지로 전달하고 싶은 정보를 담는 곳으로, 여기에 담은 내용은 다음 페이지에서 useLocation()으로 쓸 수 있다.

우선 Coin.tsx에 Coins.tsx의 styled-component를 옮기고 같은 모양으로 만든다.
아래는 코드를 그대로 옮겨쓴 것인 뿐이다.

```
// Coin.tsx
import { useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

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

interface RouteParams {
  coinId: string;
}

function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams<RouteParams>();
  return (
    <Container>
      <Header>
        <Title>Coin</Title>
      </Header>
      {loading ? <Loader>Loading...</Loader> : null}
    </Container>
  );
}
export default Coin;
```

이제 Home에서 코인의 이름을 가져오기 위해 state를 사용한다.
state로 전달하려면 <Link>에 state를 추가하고 정보를 적어주면 된다.

```
// Coins.tsx
            ...
              <Link
                to={{
                  pathname: `/${coin.id}`,
                  state: { name: coin.name },
                }}
              >
                ...
```

이제 받아온 정보를 사용하기 위해서 Coin에서 useLocation()을 사용한다.
react-router에서 useLocation을 import하고, `console.log(useLocation())`으로 어떤 내용이 있는지 확인해보자.

```
// Coin.tsx
import { useLocation, useParams } from "react-router";

function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams<RouteParams>();
  console.log(useLocation());
  return (
    <Container>
      <Header>
        <Title>Coin</Title>
      </Header>
      {loading ? <Loader>Loading...</Loader> : null}
    </Container>
  );
}
export default Coin;
```

정보를 보면 useLocation에는 state가 있고, 그 안에 우리가 넣어준 name이 있다.
그러므로 이를 가져와서 사용해야 하는데, 타입이 지정되어 있지 않으므로 interface를 만들어서 적용시켜야 한다.
그리고 <Title>에서 이름을 보여준다.

```
// Coin.tsx
interface RouteState {
  name: string;
}

function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  return (
    <Container>
      <Header>
        <Title>{state.name}</Title>
      </Header>
      {loading ? <Loader>Loading...</Loader> : null}
    </Container>
  );
}
export default Coin;
```

이렇게하면 Home에서 링크를 누르면 정상적으로 작동한다.
하지만 Home을 거치지 않고 바로 해당 URL로 접속하면 state가 존재하지 않으므로 에러가 난다.
그러므로 ?를 사용해서 state가 없는 경우엔 "Loading..."이 나오도록 한다.

```
// Coin.tsx
interface RouteState {
  name: string;
}

function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  return (
    <Container>
      <Header>
        <Title>{state?.name || "Loading..."}</Title>
      </Header>
      {loading ? <Loader>Loading...</Loader> : null}
    </Container>
  );
}
export default Coin;
```

### 6. Coin Data

이제 fetch로 정보를 받아 온 다음에 코인 정보를 넣어주려고 한다.
받아올 정보는 코인 자체의 정보와 가격이다.
각각 "https://api.coinpaprika.com/v1/coins/${coinId}"와 "https://api.coinpaprika.com/v1/tickers/${coinId}"로 가져올 수 있다.
이미 fetch로 하는 것은 많이 해봤으므로 생략하겠다.
차이점이라면 받아오는 데이터가 json 형태이므로 useState({})로 초기화 시킨다는 점 뿐이다.

```
// Coin.tsx
import { useEffect, useState } from "react";
...
function Coin() {
  ...
  const [info, setInfo] = useState({});
  const [priceInfo, setPriceInfo] = useState({});
  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();
      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();
      setInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, []);
}
```

### 7. Data Types

불러온 데이터의 interface를 만들어줘야 한다.
"https://app.quicktype.io/?l=ts"나 "http://json2ts.com/"에서 데이터를 넣어주면 자동으로 만들어준다.
다 만들고 적용하면 useState({})에서 데이터 내용을 알게 되므로 {}는 필요 없다.

```
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

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

interface RouteParams {
  coinId: string;
}
interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const [loading, setLoading] = useState(true);
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const [info, setInfo] = useState<InfoData>();
  const [priceInfo, setPriceInfo] = useState<PriceData>();
  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
      ).json();
      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
      ).json();
      setInfo(infoData);
      setPriceInfo(priceData);
      setLoading(false);
    })();
  }, []);
  return (
    <Container>
      <Header>
        <Title>{state?.name || "Loading..."}</Title>
      </Header>
      {loading ? <Loader>Loading...</Loader> : null}
    </Container>
  );
}
export default Coin;
```

그런데 useEffect()를 보면 경고문이 있다.
읽어보면 [] 안에 내용을 넣어라는 뜻인데, coinId를 넣어주면 된다.

나머지 코인 설명, 가격 등은 비슷한 방법으로 만들 수 있고, 스타일링도 styled-components로 할 수 있으므로 생략하고 결과만 적는다.

```
// App.tsx
body {
  font-weight: 300;
  font-family: 'Source Sans Pro', sans-serif;
  background-color:${(props) => props.theme.bgColor};
  color:${(props) => props.theme.textColor};
  line-height: 1.2;
}
```

```
// Coin.tsx
const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
  margin: 20px 0px;
`;
...
}, [coinId]);
  return (
    <Container>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : info?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{info?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${info?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Open Source:</span>
              <span>{info?.open_source ? "Yes" : "No"}</span>
            </OverviewItem>
          </Overview>
          <Description>{info?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{priceInfo?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{priceInfo?.max_supply}</span>
            </OverviewItem>
          </Overview>
        </>
      )}
    </Container>
  );
}
```

### 8. Nested Routes

이전에 Node.js에서 라우터를 만든 것을 기억해보자.
큰 주소로 라우터를 나누고 다시 그 안에서 라우트를 만들었다.
예를 들어서 `https://localhost:4000/users/edit`과 `https://localhost:4000/users/create` 처럼 끝 부분의 주소가 다른 것만으로 다른 정보를 보여주었다.
이때 라우터로 /users를 만들었고, 그 안에서 다시 edit, create 라우트를 만들었다.
이처럼 라우트를 나누는 것은 최상위 컴포넌트에서만 가능한 것이 아니라, 하위 라우트에서도 가능하다.
그런데 이렇게 되면 라우트가 중첩되기 때문에 Nested Routes라는 표현을 사용하는 것이다.

Nested Routes를 사용하면 원하는 위치에서 URL을 나눌 수 있고, 끝부분을 바꾸는 것만으로 다른 정보를 보여줄 수 있다.
이를 사용해서 Coin.tsx에서 Price와 Chart를 보여주는 라우트를 만들겠다.
만드는 법은 이전에 라우트를 만들었듯이 <Switch>와 <Route>를 사용하면 된다.
다만 주소는 \`/${coinId}/price\`나 \`/${coinId}/chart\`로 다르게 해주면 된다.
물론 라우트에서 쓰일 컴포넌트도 Price.tsx와 Chart.tsx에 만들어준다.

```
// src/routes/Chart.tsx
function Chart() {
  return <h1>Chart</h1>;
}

export default Chart;
```

```
// src/routes/Price.tsx
function Price() {
  return <h1>Price</h1>;
}

export default Price;
```

```
// Coin.tsx
import { Switch, Route, useLocation, useParams } from "react-router";
import Chart from "./Chart";
import Price from "./Price";
          ...
          </Overview>
          <Switch>
            <Route path={`/${coinId}/price`}>
              <Price />
            </Route>
            <Route path={`/${coinId}/chart`}>
              <Chart />
            </Route>
          </Switch>
        </>
```

그런데 위처럼 ${coinId}로 적어줄 필요 없이 :coinId로 적어도 작동한다.

```
// Coin.tsx
          <Switch>
            <Route path={`/:coinId/price`}>
              <Price />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart />
            </Route>
          </Switch>
```

다음으로 Price와 Chart를 바꿔주는 탭을 만들겠다.
<Tab> 컴포넌트를 만들고 스타일을 만들어준다.
그리고 <Tab> 안에 <Link>를 사용해서 경로를 지정해주면 된다.

```
//Coin.tsx
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  a {
    display: block;
  }
`;

function Coin() {
          </Overview>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>
```

이제 탭을 누르면 Price와 Chart 페이지를 오갈 수 있게 됐다.

여기서 현재 어떤 페이지에 들어와 있는지를 색으로 표현하고 싶다.
현재 URL을 알기 위해선 useRouteMatch()를 사용한다.
useRouteMatch()는 현재 URL과 경로가 일치하는 경우에만 match를 반환한다.
어떤 내용이 나오는지 보기 위해 console.log로 출력해보자.

```
// Coin.tsx
import {
  Switch,
  Route,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";

function Coin() {
  ...
  const priceMatch = useRouteMatch("/:coinId/price");
  console.log(priceMatch);
}
```

만약 URL이 일치하지 않는다면, null이 나온다.
URL이 일치하는 경우엔 객체를 반환하는데, 그 안에 isExact, params, path, url 등의 정보가 들어가 있다.
이를 사용해서 null이 아닌 경우에만 색을 바꿔주도록 하겠다.

```
// Coin.tsx
const Tab = styled.span<{ isActive: boolean }>`
  ...
  color: ${(props) =>
  props.isActive ? props.theme.accentColor : props.theme.textColor};
  ...
`;

function Coin() {
          ...
          <Tabs>
              <Tab isActive={chartMatch !== null}>
                <Link to={`/${coinId}/chart`}>Chart</Link>
              </Tab>
              <Tab isActive={priceMatch !== null}>
                <Link to={`/${coinId}/price`}>Price</Link>
              </Tab>
            </Tabs>
```

### 9. React Query

지금까지 API로 정보를 받아올 때 fetch를 사용하고, useState, useEffect를 써서 해결했다.
이 모든 것을 간단하게 해결할 수 있는데, [React Query](https://react-query.tanstack.com/)를 사용하면 된다.
`npm i react-query`로 설치할 수 있는데, 우리는 이미 이전에 설치했줬다.
React Query의 페이지에서 설명을 읽어보면, <QueryClient>와 <QueryClientProvider>를 쓴다.
이는 이전에 <ThemeProvider>를 쓴 것과 동일한 것으로, React Query를 사용하려면 <QueryClientProvider>를 사용해야 한다.

index.tsx로 가서 <QueryClient>와 <QueryClientProvider>를 추가해주자.
이때 <QueryClientProvider>에 client로 QueryClient()를 줘야 한다.

```
// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { theme } from "./theme";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

그리고 모든 api를 컨트롤하는 api.ts 파일을 만들었다.
모든 파일의 api는 이곳에서 작성하고 다른 곳에서 import해서 사용한다.

우선 Coins.tsx의 fetch코드를 가져와서 넣어준다.

```
// src/api.tsx
export function fetchCoins() {
  return fetch("https://api.coinpaprika.com/v1/coins").then((response) =>
    response.json()
  );
}
```

React Query가 promise를 사용하므로 promise를 반환해줬다.
그리고 async/await을 사용하면 코드가 길어지므로, .then을 썼다.

이제 Coins.tsx로 돌아가서 코드를 수정해보자.
우리는 React Query를 사용하기 때문에, 더이상 useState나 useEffect가 필요없다.
react-query에서 `useQuery(queryKey, queryFn)`를 import한다.
[useQuery](https://react-query.tanstack.com/reference/useQuery)에 관한 설명은 링크를 보면 알 수 있다.

-   queryKey(Required): 유일해야하고, queryKey를 기반으로 만들기 때문에 바뀔경우 새로 업데이트 한다.
-   queryFn(Required): 프로미스를 반환하는 함수가 되어야 하는데, 위에서 만든 fetch 함수가 들어가면 된다.

useQuery는 isLoading과 data를 반환하는데, isLoading에는 로딩중인지 boolean 값이 들어있고, data에는 fetch로 받아온 데이터가 들어간다.
isLoading과 data를 사용하면 별도로 useState로 state를 만들 필요가 없다.
그러므로 코드를 isLoading과 data를 사용하도록 수정해준다.

```
// Coins.tsx
import { useQuery } from "react-query";
import { fetchCoins } from "../api";
function Coins() {
  const { isLoading, data } = useQuery("allCoins", fetchCoins);
  return (
    <Container>
      <Header>
        <Title>코인</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data.map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
```

그런데 data가 어떤 형태인지 설명하지 않아서, 에러가 난다.
그래서 interface를 지정해줘야 하는데, 이전의 CoinInterface를 ICoin으로 이름만 바꿔서 사용했다.
그리고 data가 위에 마우스를 올리면 ICoin || undefined로 나오는데, 이는 data 유무가 확실하지 않아서 그렇다.
그러므로 ?를 붙여서 없는 경우엔 실행되지 않도록 한다.

```
// Coin.tsx
interface ICoin {
  id: string;
  name: string;
  symbol: string;
  ...
}

function Coins() {
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
  return (
    <Container>
      <Header>
        <Title>코인</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
```

여기까지 보면 코드가 조금 더 깔끔해지긴 했지만, 기존의 fetch를 사용한 것을 분리했을 뿐 큰 차이는 없어 보인다.
하지만 브라우저에서 확인하면 큰 차이점이 있다.
이전에 Home에서 코인 정보 페이지로 가고, 다시 Home으로 돌아갔을 때 로딩이 필요했다.
그런데 React Query를 사용하면 로딩이 필요 없다.
이는 React Query가 캐시 데이터에 정보를 저장했기 때문이다.
앞서 useQuery에서 설명했듯이 queryKey를 설정하면 계속해서 내용을 추적하기 때문이다.

다음 단계로 넘어가기 전에 [Devtools](https://react-query.tanstack.com/devtools#_top)를 소개하려고 한다.
Devtools는 캐시의 query를 보여주는 컴포넌트를 만들어주는데, 위의 링크에서 사용법을 볼 수 있다.
App.tsx에서 ReactQueryDevtools를 import하고, 아래처럼 initialIsOpen={true} 속성을 줘서 만들어준다.

```
// App.tsx
import { ReactQueryDevtools } from "react-query/devtools";
...
      <Router />
      <ReactQueryDevtools initialIsOpen={true} />
    </>
```

그리고 브라우저를 열어보면 뭔가가 생겼는데, 이것이 Devtools다.
Devtools를 보면 캐시의 query 정보를 자세히 볼 수 있다.
어떤 내용이 들어있고, 어떤 정보가 있으며, 현재 사용 유무 등 다양한 정보가 있다.
그리고 Home에 들어가면 모든 코인 정보를 담은 query가 있다.
Devtools를 보면 query를 더 쉽게 다룰 수 있고, 현재 상태를 시각화하므로 코드를 작성하는 동안 Devtools를 사용하겠다.

이제 Coin.tsx 파일에서도 React Query를 사용해주려고 한다.
그 전에 api.ts에서 fetch 기능을 사용하도록 가져오겠다.
그런데 URL이 공통되는 부분이 많으므로 BASE_URL을 만들어서 아래처럼 간단히 할 수 있다.

```
// api.ts
const BASE_URL = `https://api.coinpaprika.com/v1`;

export function fetchCoins() {
  return fetch(`${BASE_URL}/coins`).then((response) => response.json());
}

export function fetchCoinInfo(coinId: string) {
  return fetch(`${BASE_URL}/coins/${coinId}`).then((response) =>
    response.json()
  );
}

export function fetchCoinTickers(coinId: string) {
  return fetch(`${BASE_URL}/tickers/${coinId}`).then((response) =>
    response.json()
  );
}
```

여기서 새로운 점은 coinId를 가져오기 위해 변수를 사용했다는 점이다.
나중에 useQuery에서 변수를 어떻게 넘겨주는지 설명하겠다.
다시 Coin.tsx로 돌아가서 useQuery를 사용해보자.
그런데 여기서 문제점이 생기는데, 이전에 useQuery를 사용할때는 딱 하나만 사용했으므로 isLoading, data, queryKey가 겹치지 않았다.
하지만 지금은 2개를 사용하고 있으므로 이름이 중복되는 문제가 생긴다.
우선 isLoading, data의 이름을 새로 설정할 수 있는데, 뒤에 :를 붙이고 새로운 이름을 적어주면 된다.
현재까지의 코드를 적으면 아래처럼 된다.

```
// Coin.tsx
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";

function Coin() {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery();
  const { isLoading: tickersLoading, data: tickersData } = useQuery();
}
```

위와 같이 적으면 isLoading, data의 중복 문제는 해결되었다.
다음으로 queryKey의 중복 문제를 해결하겠다.
우선 queryKey에 unique한 값인 coinId를 사용해야 하는것은 확실하다.
하지만 useQuery를 2개 사용하고 있으므로 coinId만으로는 불충분하다.
여기서 queryKey가 Array를 사용할 수 있다는 점을 이용한다.
coinId는 그대로 두고 Array에 다른 내용을 적어주기만 하면 두 useQuery를 구분할 수 있고, 나머지와는 coinID가 구분해준다.

```
// Coin.tsx
function Coin() {
  ...
  const { isLoading: infoLoading, data: infoData } = useQuery(["info", coinId],);
  const { isLoading: tickersLoading, data: tickersData } = useQuery(["tickers", coinId],);
  ...
}
```

다음으로 queryFn에 변수를 넣어줘야 한다.
기존에는 함수명만 작성하면 알아서 해결해줬다.
하지만 이렇게하면 변수를 작성할 수 없다.
그렇다고 fetchCoinInfo(coinId)를 바로 적으면 이는 함수를 실행하는 것이므로 문제가 된다.
그래서 우리는 콜백 함수를 작성해야 한다.

```
// Coin.tsx
function Coin() {
  ...
  const { isLoading: infoLoading, data: infoData } = useQuery(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
  );
  ...
}
```

이제 나머지 부분을 수정할텐데, 우선 2개를 불러오므로 loading을 ||를 사용해서 둘 다 확인해야 한다.
그리고 info는 infoData로 수정해야 하고, priceInfo는 tickersData로 바꿔준다.

```
// Coin.tsx
function Coin() {
  ...
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
  );
  const loading = infoLoading || tickersLoading;
  ...
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
        ...
         <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Open Source:</span>
              <span>{infoData?.open_source ? "Yes" : "No"}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
}
```

그런데 여기서 infoData와 tickersData의 타입을 정하지 않았다.
그러므로 위의 useQuery에 interface를 지정해줘야 한다.
interface는 이전에 InfoData와 PriceData를 사용했다.

```
// Coin.tsx
function Coin() {
  ...
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
  );
  ...
}
```

### 10. Price Chart

Chart.tsx 작성
api.ts에 fetcher 작성

APEXCHARTS
