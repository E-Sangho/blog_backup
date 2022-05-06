---
layout: post
title: react-masterclass 1 styled-components
date: Fri Dec 24 17:47:57 JST 2021
categories: React, styled-components
tag:
toc: true
---

## styled-component

### Introduction

React에서 CSS를 적용할 때, module-style을 사용했었다.
물론 module-style도 충분히 좋지만, CSS의 단점도 그대로 가지고 있다.
CSS를 작성하면 id와 class 단위로 만든다.
그런데 CSS를 수정할 때 태그에서 id나 class를 찾아봐야 한다.
이는 같은 id와 class를 일괄적으로 적용할 수 있지만, 태그와 CSS를 번갈아가면서 찾아야 해서 가독성은 그리 좋지 않다.
게다가 우리는 컴포넌트 단위로 코드를 작성하는데, 스타일은 id, class 단위로 작성하고 있으므로 불편하다.

그래서 사용하는 것이 [styled-component](https://styled-components.com/)로, styled-component를 사용하면 컴포넌트 단위로 스타일을 작성할 수 있다.
컴포넌트 단위로 작성한다는 의미는 사용법을 보면 알 수 있을 것이고, 그 외에도 장점이 있다.
우리가 React를 쓰면서 생긴 장점 중 하나는 JavaScript로 HTML을 만든다는 것이다.
그리고 styled-component는 JavaScript로 CSS를 만들게 해준다.
그렇기 때문에 이 둘을 조합하면 JavaScript만으로 HTML과 CSS를 다루게 되고, 별도로 HTML, CSS 파일을 만들 필요가 없어진다.

### Before start

styled-component를 사용하기 위해 `npm install --save styled-components`로 패키지를 설치해준다.
그리고 새로운 React 프로젝트를 만들기 위해 `npx create-react-app react-masterclass`를 실행시킨다.
여기서 폴더명을 react-masterclass로 설정했다.
그리고 styled-component를 styled로 import하면 준비는 끝이다.

### Basic

styled-component에서는 따로 컴포넌트와 스타일을 연결할 필요가 없다.
왜냐하면 styled-component에서 스타일을 만든다는 것은, 컴포넌트를 만드는 것과 동일하기 때문이다.
정확히 말하자면 스타일이 적용된 컴포넌트를 만들게 된다.
styled를 적용하는 법은 간단한데 아래처럼 작성하면 된다.

```
import styled from "styled-component";

const {component} = styled.{tag}`
  // styling {tag}
`

// e.g.)
const blueBtn = styled.button`
  background-color: blue;
`
```

styled는 {tag}에 백틱(`) 사이의 스타일 적용한 컴포넌트를 만들기 때문에, 반드시 백틱을 써야 한다.

이제 styled를 사용해서 간단하게 만들어보겠다.
형태는 부모 컴포넌트에 2개의 박스를 만들었다.

```
import styled from "styled-components";

const Father = styled.div`
  display: flex;
`;

const Box = styled.div`
  background-color: teal;
  width: 100px;
  height: 100px;
`;

function App() {
  return (
    <Father>
      <Box />
      <Box />
    </Father>
  );
}
```

브라우저에서 확인하면 스타일이 잘 적용되었다.
그리고 inspect로 적용된 코드를 열어보면 각각 class를 준 것을 볼 수 있다.
styled-component는 각 스타일에 독립적인 class명을 붙여주므로, 서로 중복될 걱정 없이 쓸 수 있다.

또한 여기서 만든 컴포넌트는 기존의 컴포넌트와 동일한 일을 하므로 자식 요소도 만들 수 있고, 안에 내용도 적을 수 있다.

```
import styled from "styled-components";

const Father = styled.div`
  display: flex;
`;

const Box = styled.div`
  background-color: teal;
  width: 100px;
  height: 100px;
`;

const Text = styled.span`
  color:white;
`;

function App() {
  return (
    <Father>
      <Box>
        <Text>Hello</Text>
      </Box>
      <Box />
    </Father>
  );
}
```

### Adapting based on props

우리가 만든 컴포넌트를 보면 고정된 값만 가진다.
이렇게 되면 색을 바꾸거나 할 때마다 새로운 컴포넌트를 만들어야 하겠지만, 당연히 styled-component는 변수 지정이 가능하다.
이전에 props로 컴포넌트에 변수를 넘겨준 방법과 비슷한데, 스타일이 백틱 안에 있으므로 ${}안에 적어준다는 점이 다르다.

```
import styled from "styled-components";

const Father = styled.div`
  display: flex;
`;

const Box = styled.div`
  background-color: ${(props) => props.bgColor};
  width: 100px;
  height: 100px;
`;

function App() {
  return (
    <Father>
      <Box bgColor="teal"/>
      <Box bgColor="tomato"/>
    </Father>
  );
}
```

### Extending Styles

다음으로 <Box> 2개를 서로 다른 스타일을 적용하려고 한다.
그런데 대부분의 스타일이 동일하고 한 두가지만 다른 경우를 만들려고 한다.
단순한 방법으로는 Box1, Box2 2개를 만들어주면 되겠지만, 둘의 차이가 적다면 코드가 낭비된다.

```
import styled from "styled-components";

const Father = styled.div`
  display: flex;
`;

const Box1 = styled.div`
  background-color: teal;
  width: 100px;
  height: 100px;
`;

const Box2 = styled.div`
  background-color: tomato;
  width: 100px;
  height: 100px;
`;

function App() {
  return (
    <Father>
      <Box1 />
      <Box2 />
    </Father>
  );
}
```

styled-component는 이처럼 비슷한 코드를 작성해서 낭비되지 않도록 Extending Styles를 지원한다.
`styled({component})`처럼 작성하면 해당 component의 스타일을 사용할 수 있게 된다.
아래는 Box2에 Box1의 스타일을 상속시키고 색만 바꿔준 코드로 위와 동일하게 작동한다.

```
import styled from "styled-components";

const Father = styled.div`
  display: flex;
`;

const Box1 = styled.div`
  background-color: teal;
  width: 100px;
  height: 100px;
`;

const Box2 = styled(Box1)`
  background-color: tomato;
`;

function App() {
  return (
    <Father>
      <Box1 />
      <Box2 />
    </Father>
  );
}
```

### As

스타일은 그대로 두고 태그를 바꿔주고 싶은 경우도 있다.
이때 사용하는 것이 as로, as를 사용하면 스타일은 동일한 다른 태그를 만들 수 있다.
아래는 버튼 스타일은 유지한채로 <a> 태그를 만든 것이다.

```
import styled from "styled-components";

const Father = styled.div`
  display: flex;
`;

const Btn = styled.button`
  color: white;
  background-color: tomato;
  border: 0;
  border-radius: 15px;
`;

function App() {
  return (
    <Father>
    <Btn>Log in </Btn>
    <Btn as="a" href="/">
      Log in
    </Btn>
    </Father>
  );
}

export default App;
```

여기서 href를 보면 알 수 있듯, HTML 태그의 속성도 지정할 수 있다.

### Attrs

앞서 컴포넌트에 태그의 속성을 지정할 수 있음을 보였다.
styled-component에서는 컴포넌트를 만들 때, attrs를 사용하면 속성값을 설정할 수 있다.
아래는 <Input>에 required 속성을 준 것이다.

```
import styled from "styled-components";

const Father = styled.div`
  display: flex;
`;

const Input = styled.input.attrs({ required: true })`
  background-color: tomato;
`;

function App() {
  return (
    <Father as="header">
      <Input />
      <Input />
      <Input />
      <Input />
      <Input />
    </Father>
  );
}

export default App;
```

### Animation

CSS에서 애니메이션 기능을 사용하려면 @keyframes를 사용하면 됐다.
그런데 @keyframes를 사용하면 global하게 만들어지므로, 이름이 겹치는 경우가 생길 수도 있다.
그래서 styled-component는 keyframes를 사용해서, 컴포넌트의 고유한 애니메이션 기능을 만들도록 했다.
keyframes를 사용하기 위해서 styled-component로부터 import 해준다.
애니메이션 기능을 만드는 방법은 기존의 CSS와 동일하다.
주의할 점은 keyframes로 만든 애니메이션을 적용할 때, ${} 사이에 적어줘야 한다.

```
import styled, { keyframes } from "styled-components";

const Wrapper = styled.div`
  display: flex;
`;

const rotationAnimation = keyframes`
  0% {
    transform:rotate(0deg);
    border-radius:0px;
  }
  50% {
    border-radius:100px;
  }
  100%{
    transform:rotate(360deg);
    border-radius:0px;
  }
`;

const Box = styled.div`
  height: 200px;
  width: 200px;
  background-color: tomato;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${rotationAnimation} 1s linear infinite;
  span {
    font-size: 36px;
    &:hover {
      font-size: 48px;
    }
    &:active {
      opacity: 0;
    }
  }
`;

function App() {
  return (
    <Wrapper>
      <Box>
        <span>🤩</span>
      </Box>
    </Wrapper>
  );
}

export default App;
```

### Pseudo Selector

한 컴포넌트 안에는 여러 자식 컴포넌트가 있을 수 있다.
그리고 styled-component는 sass처럼 안의 컴포넌트를 지정해서 스타일을 적용할 수 있다.
예를 들어서 아래는 <Box> 안에서 span을 지정해서 스타일을 적용한 코드다.

```
import styled from "styled-components";

const Box = styled.div`
  height: 200px;
  width: 200px;
  span {
    font-size: 36px;
  }
`;

function App() {
  return (
    <Wrapper>
      <Box>
        <span>Hello</span>
      </Box>
    </Wrapper>
  );
}

export default App;
```

또한 sass 처럼 &는 자기 자신을 가리키기 때문에, :hover, :active 등과 같이 사용하면 편하게 쓸 수 있다.

```
import styled from "styled-components";

const Emoji = styled.span`
  font-size: 36px;
`;

const Box = styled.div`
  height: 200px;
  width: 200px;
  span:hover {
    font-size: 100px;
  }
`;

function App() {
  return (
    <Wrapper>
      <Box>
        <Emoji>🤩</Emoji>
      </Box>
      <Emoji>🔥</Emoji>
    </Wrapper>
  );
}

export default App;
```

위의 예시를 보면 <Emoji> 태그를 만들었다.
그런데 <Emoji>는 span이기 때문에 위의 스타일이 적용된다.
하지만 앞서 사용했듯이 as를 쓰게 된다면, 스타일이 적용되지 않을 것이다.
이때는 <Emoji> 태그를 직접 지정하는 것이 더 좋다.
여기서 컴포넌트의 이름이 HTML에 존재하는 것이 아니라 우리가 만든 것이므로 ${}를 써줘야 한다.

```
import styled from "styled-components";

const Emoji = styled.span`
  font-size: 36px;
`;

const Box = styled.div`
  height: 200px;
  width: 200px;
  ${Emoji}:hover {
    font-size: 98px;
  }
`;

function App() {
  return (
    <Wrapper>
      <Box>
        <Emoji>🤩</Emoji>
      </Box>
      <Emoji>🔥</Emoji>
    </Wrapper>
  );
}

export default App;
```

위의 예시에서 2번째 <Emoji>는 <Box> 안에 없으므로 스타일이 적용되지 않는다.
그래서 마우스를 올려도 아무런 변화가 없다.

### Theme

styled-component는 다크모드, 라이트모드처럼 다양한 테마를 선택할 때, 사용할 수 있는 Theme도 지원한다.
이를 위해서 <ThemProvider>를 사용해야 한다.
<ThemeProvider>는 theme으로 전달 받는 객체를 모든 하위 컴포넌트의 props로 넣어준다.
그래서 하위 컴포넌트에서 theme의 값을 사용할 수 있게 된다.
이를 이용해서 미리 테마의 색을 정할 수 있다.

ThemeProvider를 import 해주고, 적용하고 싶은 컴포넌트를 <ThemeProvider>로 감싸준다.
그리고 그 안에 props로 theme으로 적용하고 싶은 스타일을 넘겨준다.

```
// index.js
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";

const darkTheme = {
  textColor: "whitesmoke",
  backgroundColor: "#111",
};

const lightTheme = {
  textColor: "#111",
  backgroundColor: "whitesmoke",
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

이렇게하면 App.js에서 props.theme에서 값을 가져올 수 있다.

```
// App.js
import styled from "styled-components";

const Title = styled.h1`
  color: ${(props) => props.theme.textColor};
`;

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.backgroundColor};
`;

function App() {
  return (
    <Wrapper>
      <Title>Hello</Title>
    </Wrapper>
  );
}

export default App;
```

이를 이용하면 미리 지정해놓은 스타일을 적용하는 것이 가능한데, 나중에 배울 local Estate Management와 같이 사용하면 테마를 바꿀 수 있게 된다.
지금은 <ThemeProvider>를 사용하면 미리 지정한 스타일 값을 가져올 수 있다는 것만 기억해두자.
