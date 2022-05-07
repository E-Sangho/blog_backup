---
layout: post
title: State Management
date: 2022-01-07 12:31:29
categories:
tag:
toc: true
---

## Why we need Recoil

우리는 *state*를 사용하면서 컴포넌트의 변화를 쉽게 다룰 수 있었다.
여기서 state와 props의 차이를 생각해보자.
둘 다 컴포넌트에 정보를 줘서 변화를 주기 위해 사용한다.
차이점이라면 state는 해당 컴포넌트 안에서 관리되고, props는 전달해준다는 점이다.
다시 말해 props는 위에서 아래로 정보를 전달하기 위해 사용하고, state는 컴포넌트 내부에서 사용하기 위해 만들어졌다.

그런데 경우에 따라서 state를 전달해야 하는 경우가 있다.
예를 들어서 로그인 상태를 전달한다거나, 테마 정보를 전달하는 등의 기능을 생각해보자.
이들은 하나의 컴포넌트에서만 사용하는 정보가 아니라, 모든 컴포넌트에서 공유하는 정보다.
이렇게 모든 컴포넌트에서 state를 공유해야 할 때, Recoil을 사용하면 state를 쉽게 공유할 수 있다.

하지만 Recoil로 문제를 해결하면 Recoil의 필요성이 와닿지 않는다.
그러므로 Recoil을 사용하지 않으면 얼마나 불편하게 기능을 만들어야 하는지 알기 위해, state와 props만으로 해결해보겠다.

다시 우리가 하던 테마 코드로 돌아가보자.

```
// index.tsx
ReactDOM.render(
    ...
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
```

\<ThemeProvider>는 theme props를 전달받아서 테마를 변경한다.
그런데 버튼을 눌러서 테마를 변경하려면 theme에 전달되는 값이 바뀌어야 한다.
값의 변화를 다룰 때는 state를 사용하는 것이 제일 간편하므로 state를 사용해야 한다.
여기서 문제가 생기는데, \<App>이 \<ThemeProvider>보다 아래에 있다.
props는 부모에서 자식으로 보내주고, state는 컴포넌트 안에서 작동하므로, \<App>의 정보를 \<ThemeProvider>에 보낼 수 없다.
이를 해결하기 위해선 \<ThemeProvider>를 \<App> 안에 넣어줘야 한다.

```
// index.tsx
ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
```

```
// App.tsx
import { createGlobalStyle, ThemeProvider } from "styled-components";
...
function App() {
    return (
        <>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <Router />
                <ReactQueryDevtools initialIsOpen={true} />
            </ThemeProvider>
        </>
```

이제 \<ThemeProvider>가 \<App> 안에 있으므로 state로 테마 변화를 다룰 수 있게 되었다.
간단한 버튼과 state를 사용하면 테마를 바꾸는 기능을 만들 수 있다.

```
// App.tsx
import { darkTheme, lightTheme } from "./theme";
import { useState } from "react";
...
function App() {
    const [isDark, setIsDark] = useState(false);
    const toggleDark = () => setIsDark((current) => !current);
    return (
        <>
            <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
                <button onClick={toggleDark}>Toggle Mode</button>
                <GlobalStyle />
                <Router />
                <ReactQueryDevtools initialIsOpen={true} />
            </ThemeProvider>
        </>
    )
}
```

그리고 여기에 맞춰서 darkTheme, lightTheme을 만들어준다.

```
// src/theme.ts
import { DefaultTheme } from "styled-components";

export const darkTheme: DefaultTheme = {
  bgColor: "#2f3640",
  textColor: "white",
  accentColor: "#9c88ff",
  cardBgColor: "transparent",
};

export const lightTheme: DefaultTheme = {
  bgColor: "whitesmoke",
  textColor: "black",
  accentColor: "#9c88ff",
  cardBgColor: "white",
};
```

이렇게해서 state로 theme을 바꿀 수 있었다.
문제는 이렇게 해결할 경우 theme을 바꾸는 버튼이 항상 \<App> 안에 있어야 한다는 점이다.
만약 버튼을 다른 위치에 만든다면 이처럼 해결할 수는 없다.

버튼을 \<Coins>의 header에 만들어줬다고 생각해보자.
테마를 바꿔주려면 버튼을 눌렀을 때 toggleDark가 실행돼야 한다.
그런데 toggleDark는 \<App> 내부에 있으므로 props로 전달해줘야 한다.
\<App>에서 \<Coins>까지 데이터를 전달하려면 \<App> -> \<Router> -> \<Coins>로 전달해줘야 한다.
props를 사용해서 toggleDark를 전달해주면 되겠지만, 이 경우 \<Router>과 \<Coins>에서 interface를 수정해줘야 한다.

다른 것은 큰 문제가 없지만 interface에서 문제가 생긴다.
toggleDark의 타입을 지정해줘야 하는데, string, number 같은 기본적인 타입으로는 해결되지 않기 때문이다.
다행히도 굉장히 쉬운 방법으로 해결할 수 있다.
함수 위에 커서를 올리면 해당 함수의 타입이 나오는데 이를 그대로 복사해서 붙여넣어준다.
예를 들어서 toggleDark 위에 마우스를 올리면 `const toggleDark: () => void`가 나온다.
여기서 _() => void_ 부분이 함수의 타입이 된다.

```
// App.tsx
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <Router toggleDark={toggleDark} />
        <ReactQueryDevtools initialIsOpen={true} />
      </ThemeProvider>
```

```
// Router.tsx
interface IRouterProps {
  toggleDark: () => void;
}

function Router({ toggleDark }: IRouterProps) {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:coinId">
          <Coin />
        </Route>
        <Route path="/">
          <Coins toggleDark={toggleDark} />
```

다음으로 \<Coins>에서 toggleDark를 받아와서 onClick에 넣어주면 된다.

```
// Coins.tsx
interface ICoinsProps {
  toggleDark: () => void;
}

function Coins({ toggleDark }: ICoinsProps) {
          <Header>
        <Title>코인</Title>
        <button onClick={toggleDark}>Toggle Dark Mode</button>
      </Header>
```

이렇게 해서 \<App> -> \<Router> -> \<Coins> -> \<button>으로 toggleDark를 옮겨줬다.
보다시피 한 경우만 해도 여러 경로를 거처야 해서 번거롭다.
문제는 우리는 \<Coin>의 \<Chart>에도 똑같은 일을 해야 한다는 것이다.
\<Chart>에서 필요한 것은 isDark state이므로 다시 \<App>에서 부터 전달해줘야 한다.
먼저 \<App>에서 isDark를 \<Router>로 보내준다.

```
// App.tsx
        <GlobalStyle />
        <Router isDark={isDark} toggleDark={toggleDark} />
```

\<Router>에서는 이를 받아주고, interface를 고쳐야 한다.
그리고 <Coin>에 isDark를 보내주고, \<Coin>에서는 이를 다시 \<Chart>로 전달한다.

```
// Router.tsx
interface IRouterProps {
  toggleDark: () => void;
  isDark: boolean;
}

function Router({ toggleDark, isDark }: IRouterProps) {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/:coinId">
          <Coin isDark={isDark} />
        </Route>
```

```
// Coin.tsx
interface ICoinProps {
  isDark: boolean;
}

function Coin({ isDark }: ICoinProps) {
    ...
            <Route path={`/:coinId/chart`}>
                <Chart isDark={isDark} coinId={coinId} />
            </Route>
```

마지막으로 \<Chart>에서 mode 에서 isDark의 값에 따라 모드를 바꿔준다.

```
// Chart.tsx
interface ChartProps {
  coinId: string;
  isDark: boolean;
}
function Chart({ coinId, isDark }: ChartProps) {
    ...
        options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
```

우리는 \<Coins>와 \<Chart>에 state를 전달하기 위해 아래와 같은 과정을 거쳤다.

-   \<Coins>: \<App> -> \<Router> -> \<Coins> -> \<button>
-   \<Chart>: \<App> -> \<Router> -> \<Coin> -> \<Chart>

보다시피 몇 단계나 거쳐야 했다.
만약 우리가 페이지를 더 복잡하게 만든다면 더 많은 단계를 거쳐야 한다.
게다가 새로운 컴포넌트를 추가하면 다시 state를 전달하기 위해 새로운 props를 만들어야 한다.
그리고 거기에 맞춰 새로운 interface를 만들어야 하는 등 해야할 일이 산더미 같이 쌓인다.

이제 여기서 이런 생각이 들 것이다.
\<App>에서 위처럼 많은 단계를 거치는 것이 아니라, 중간 단계를 만들어서 바로 전달하면 쉽지 않을까 하는 생각.
다시 말해 아래처럼 \<Atom>라는 단계를 하나만 넣어서 해결하는 것이다.

-   \<Coins>: \<App> -> \<Atom> -> \<button>
-   \<Chart>: \<App> -> \<Atom> -> \<Chart>

위 아이디어의 핵심은 3가지다.

-   \<Atom>에 모든 state를 저장
-   \<Atom>의 state를 수정
-   \<Atom>의 state를 출력

Recoil은 조금 다르긴 하지만 위의 아이디어를 실현한 것으로 global state를 만들고, 이를 수정, 출력하는 기능을 만든 것이다.

## Recoil

[Recoil](https://recoiljs.org/ko/)은 앞서 설명했듯이 global state를 만들어준다.
이를 *Atoms*라고 하며, Atoms를 사용하기 위해선 atom 함수를 사용해야 한다.
atom 함수는 key와 default를 사용해서 state를 만든다.
이때 *key*는 고유값을 사용해야 하며, *defalut*에는 기본값을 넣어준다.
아래 예시를 보자.

```
const fontSizeState = atom({
    key: 'fontSizeState',
    default: 14,
});
```

위 예시는 key를 'fontSizeState'로 지정하고 default를 14로 만들었다.
이렇게 만든 state의 값을 읽고 쓰려면 *useRecoilState*를 사용하면 된다.
useRecoilState React의 useState와 비슷한 기능을 한다.
차이점이라면 state가 모든 컴포넌트 사이에 공유된다는 점이다.
아래는 useRecoilState를 사용한 예시로 useState와 굉장히 유사하다.

```
function FontButton() {
    const [fontSize, setFontSize] = useRecoilState(fontSizeState);
    return (
        <button onClick={() => setFontSize((size) => size + 1)} style={{fontSize}}>
            Click to Enlarge
        </button>
    );
}
```

여기서 useRecoilState는 값을 읽고 수정하는 기능을 동시에 수행하게 해준다.
그런데 우리가 이전에 했던 예시처럼 값을 읽는 곳과 수정하는 곳이 다른 경우가 빈번하다.
이때 사용하는 것이 *useRecoilValue*와 *useSetRecoilState*다.
useRecoilValue는 Atoms의 값만을 가져오는 기능으로 state와 동일한 기능을 한다.
그리고 useSetRecoilState는 setState와 같은 일을 한다.
아래는 둘의 예시다.

```
function Font() {
    const fontSize = useRecoilValue(fontSizeState);
    return (
        <div style={{fontSize}}>
            This is font.
        </div>
  );
}
```

```
function FontButton() {
    const setFontSize = useSetRecoilState(fontSizeState);
    return (
        <button onClick={() => setFontSize((size) => size + 1)}>
            Click to Enlarge
        </button>
    );
}
```

간단히 표현해서 `[state, setState] = useState`의 기능이 `[useRecoilValue, useSetRecoilState] = useRecoilState`으로 대응되었다고 생각하면 된다.
물론 useRecoilValue 등은 함수이므로 뒤에 Atoms가 변수에 들어가야 한다.

이제 실제로 Recoil을 사용해보자.
`npm install recoil`로 Recoil을 설치해준다.
Recoil을 적용시키려면 <RecoilRoot>라는 컴포넌트로 감싸줘야 한다.
그러므로 index.tsx로 이동해서 아래처럼 <RecoilRoot>를 사용한다.

```
// index.tsx
import { RecoilRoot } from "recoil";
...
ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);
```

다음으로 atoms.ts 파일에 아래처럼 Atom을 만들어준다.

```
// src/atoms.ts
import { atom } from "recoil";

export const isDarkAtom = atom({
  key: "isDark",
  default: true,
});
```

그리고 기존의 useState와 props를 수정해줘야 한다.
우선 <App>에서는 setState 기능이 필요 없으므로 useRecoilValue만을 사용한다.
그리고 <Router>에는 어떤 props도 전달할 필요가 없으므로 지워준다.

```
// App.tsx
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atoms";
...
function App() {
    const isDark = useRecoilValue(isDarkAtom);
    return (
        <>
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
            <GlobalStyle />
            <Router />
            <ReactQueryDevtools initialIsOpen={true} />
        </ThemeProvider>
        </>
    );
}
```

<Router>과 <Coin>에선 이제 props를 사용하지 않으므로 모두 지워줬다.

```
// Router.tsx
import Coin from "./routes/Coin";
import Coins from "./routes/Coins";

interface IRouterProps {}

function Router({}: IRouterProps) {
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
```

```
// Coin.tsx
}

interface ICoinProps {}

function Coin({}: ICoinProps) {
    ...

                <Route path={`/:coinId/chart`}>
                    <Chart coinId={coinId} />
                </Route>
            </Switch>
            </>
```

<Coins>와 <Chart>에선 state를 변화시키기 때문에 useSetRecoilState를 사용하면 된다.
이때 기존의 state를 전달하는 props는 필요없으므로 지워줬다.

```
// Chart.tsx
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
...
interface ChartProps {
    coinId: string;
}
function Chart({ coinId }: ChartProps) {
    const isDark = useRecoilValue(isDarkAtom);
```

```
// Coin.tsx
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";
...
interface ICoinsProps {}

function Coins() {
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
    ...
        <Header>
            <Title>코인</Title>
            <button onClick={toggleDarkAtom}>Toggle Mode</button>
        </Header>
```

코드를 보면 알겠지만 useSetRecoilState는 기존의 setState를 그대로 대체해준다.
