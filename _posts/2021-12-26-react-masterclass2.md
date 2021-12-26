---
layout: post
title: react-masterclass 2 TypeScript
date: Sun Dec 26 15:54:28 JST 2021
categories: React
tag:
toc: true
---

## TypeScript

### 1. 개요

자바스크립트는 타입에 자유로운 언어다.
그래서 변수를 지정하거나 함수를 만들 때, 타입을 지정해주지 않는다.
덕분에 타입을 신경쓰지 않아서 간편하고 코드량이 줄어들기는 했지만 안정성은 떨어지게 되었다.
예를 들어서 두 변수를 받아서 더해주는 함수가 있다고 하자.
자바스크립트에서는 3과 "5"의 덧셈을 알아서 숫자간의 덧셈으로 바꿔준다.

```
function sum(a, b) => {
    return a + b;
}

console.log(sum(3, "5"));
```

문제는 이런 경우가 개발자가 의도한 결과가 아닐 수도 있다는 점이다.
위처럼 숫자 외의 변수가 입력되면, 작동되지 않도록 만들고 싶을 수도 있다.
게다가 자바스크립트가 에러 메세지를 보내지 않으므로, 이런 오류가 생긴 것을 파일을 실행해보기 전에 알아낼 수 없다.

이처럼 자바스크립트에서 타입을 지정하지 않는 것이 단점으로 느껴지는 경우가 있다.
그래서 사용하는 것이 [TypeScript](https://www.typescriptlang.org/)로, 타입스트립트는 자바스크립트에 타입을 추가한 언어다.
기존 언어에서 확장했을 뿐이므로 자바스크립트 코드가 그대로 동작한다.
차이점이라면 변수에 타입을 지정할 수 있다는 점과, 타입과 다른 값이 들어 있는 변수와 함수를 보면 에러가 난다는 점이다.
이로 인해 생기는 가장 큰 장점은 **자바스크립트 실행 전에 타입 에러를 확인**할 수 있다는 것이다.
그래서 원하지 않는 값이 지정되거나, 값이 들어있지 않는 경우를 미리 알아채고 수정할 수 있다.

마지막으로 타입스크립트는 컴파일을 하면 babel처럼 코드를 자바스크립트로 바꾼 후 실행하게 된다.
그래서 다른 언어가 아니라 자바스크립트를 확장한 언어라 한 것이다.
이 때문에 기존의 자바스크리트를 그대로 사용할 수 있고, 설치만 하면 자바스크립트가 동작하는 환경이면 어디서든 쓸 수 있다.

정리하자면 타입스크립트는 자바스크립트에 타입을 추가했고, 그 덕분에 코드 작성 단계에서 에러를 알려준다.

### 2. Installation

이제 create-react-app에 타입스크립트를 설치해주겠다.
[Adding TypeScript](https://create-react-app.dev/docs/adding-typescript)를 보면 방법이 나와있는데, 이때 2가지 경우가 있다.

1. 완전히 새로운 프로젝트를 만드는 경우: `npx create-react-app my-app --template typescript`
2. 기존에 create-react-app으로 만든 프로젝트에 타입스크립트를 쓰려는 경우

1의 경우를 권하지만, 어쩔 수 없으면 2번으로 진행해야 한다.

우선 자바스크립트 파일의 확장자를 .tsx로 고쳐준다.
왜냐하면 타입스크립트는 .ts 확장자를 사용하고, 특히 리액트에서는 .tsx 라는 확장자를 사용하기 때문이다.
하지만 확장자를 바꾼 것만으론 작동하지 않는다.
기존의 패키지는 타입스크립트로 만들어지지 않았으므로 에러가 발생한다.
그렇기 때문에 타입스크립트용 패키지를 다시 설치해줘야 한다.
다행히도 유명한 패키지는 타입스크립트용으로 만들어져 있는데, @types라는 Github Repository에 저장되어 있다.
타입스크립트용 패키지를 설치하려면 @types/{package}를 설치해야 한다.
`npm install --save typescript @types/node @types/react @types/react-dom @types/jest` 로 패키지를 설치한다.
그리고 `npm i @types/styled-components`로 styled-component용 타입스크립트 패키지도 설치한다.

### 3. Explicit Types & Interface

이제 컴포넌트에 타입을 지정하는 일을 하기 위해 파일은 정리하겠다.

```
// App.tsx
function App() {
  return (
    <div>
    </div>
  );
}

export default App;
```

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

그리고 새로운 컴포넌트인 Circle을 만들고 App에서 불러왔다.

```
// Circle.tsx
import styled from "styled-components";

const Container = styled.div``;

function Circle() {
  return <Container />;
}

export default Circle;
```

```
// App.tsx
import Circle from "./Circle";

function App() {
  return (
    <div>
        <Circle />
    </div>
  );
}

export default App;
```

리액트에서 prop-types를 사용했을 때를 기억해보자.
prop-types를 사용하면 prop가 전달되지 않았거나 타입이 없다면, 콘솔에 출력된다.
그렇지만 코드를 실행하기 전에는 에러를 알 수 없었다.
앞서 설명했듯이 타입스크립트를 사용하는 이유는 코드가 실행되기 전에 오류를 확인하기 위해서다.
그렇기 때문에 prop-types를 사용하지 않고 타입스크립트를 사용하는 것이다.

이제 타입스크립트로 컴포넌트의 props의 타입을 설정해보자.
Circle에 prop로 bgColor를 만든다.

```
// Circle.tsx
import styled from "styled-components";

const Container = styled.div``;

function Circle({ bgColor }) {
  return <Container bgColor={bgColor} />;
}

export default Circle;
```

```
// App.tsx
import Circle from "./Circle";

function App() {
  return (
    <div>
        <Circle bgColor="teal" />
        <Circle bgColor="tomato" />
    </div>
  );
}

export default App;
```

기본적으로 타입을 설정하려면 :뒤에 타입을 적어주면 된다.
예를 들어서 아래는 number로 a, b를 받아서 더해주는 함수다.

```
const sum = (a:number, b:number) {
    return a + b;
}
```

이제부터 interface를 작성할텐데, interface란 object shape를 타입스크립트에게 설명해주는 타입스크립트 개념이다.
앞의 방법처럼 하나하나 지정하는 것이 아니라, 미리 입력받는 매개변수와 타입을 약속하고 사용하는 것이다.
interface를 지정하기 위해선 아래처럼 하면 된다.

```
// Circle.tsx
import styled from "styled-components";

// write interface
interface CircleProps {
    bgColor: strkng;
}

const Container = styled.div``;

function Circle({ bgColor }) {
  return <Container bgColor={bgColor} />;
}

export default Circle;
```

그리고 컴포넌트에서 사용하려면 아래처럼 사용하면 된다.

```
// Circle.tsx
import styled from "styled-components";

interface CircleProps {
    bgColor: strkng;
}

const Container = styled.div``;

// apply interface
function Circle({ bgColor }: CircleProps) {
  return <Container bgColor={bgColor} />;
}

export default Circle;
```

위의 코드는 bgColor의 타입이 CircleProps의 객체임을 지정한 것이다.
여기서 CircleProps로 지정해주지 않은 내용이 들어가면 에러가 나온다.

```
// Circle.tsx
import styled from "styled-components";

interface CircleProps {
    bgColor: strkng;
}

const Container = styled.div``;

// x occurs error
function Circle({ bgColor, x }: CircleProps) {
  return <Container bgColor={bgColor} />;
}

export default Circle;
```

위의 ES6 방식은 아래처럼 props로 적어도 똑같이 작동한다.

```
// Circle.tsx
import styled from "styled-components";

interface CircleProps {
    bgColor: strkng;
}

const Container = styled.div``;

// x occurs error
function Circle(props: CircleProps) {
  return <Container bgColor={props.bgColor} />;
}

export default Circle;
```

이제 여기서 bgColor를 styled-component에 보내면 된다.
그런데 styled-component에서도 타입을 지정해줘야 하므로 Container용 interface를 하나 만든다.
styled-component에서 interface를 적용하려면 <interface>를 뒤에 붙여주면 된다.

```
// Circle.tsx
import styled from "styled-components";

interface CircleProps {
  bgColor: string;
}

interface ContainerProps {
  bgColor: string;
}
const Container = styled.div<ContainerProps>``;

function Circle({ bgColor }: CircleProps) {
  return <Container bgColor={bgColor} />;
}

export default Circle;
```

지금까지의 코드를 정리해보자.
App.tsx를 보면 <Circle> 컴포넌트에 bgColor를 넣어줬다.
여기서 <Circle>의 props에 적용하는 타입은 Circle.tsx 파일의 CicleProps에서 지정해줬다.
그렇지만 여기서 <Circle>에서 만들어지는 <Container>에는 아무런 타입도 지정하지 않았기 때문에 에러가 생겼다.
그래서 ContainerProps를 만들어서 <Container>에 적용해야 한다.
styled-component에 interface를 적용하려면 뒤에 <interface> 형태로 추가해주면 된다.
이렇게 하면 <Circle>로 props를 받아오는 부분도 해결되고, <Container>의 styled-component를 만드는 부분도 타입을 정하게 된다.

이제 간단하게 스타일을 만들어주자.
스타일을 만들때, props 뒤에 점을 찍은 후에 자동완성을 보면 interface의 bgColor이 나온다.
타입스크립트는 interface를 지정하면 자동완성도 지원하므로 간편하게 쓸 수 있다.

```
// Circle.tsx
import styled from "styled-components";

interface CircleProps {
  bgColor: string;
}

const Container = styled.div<CircleProps>`
  width: 200px;
  height: 200px;
  background-color: ${(props) => props.bgColor};
  border-radius: 100px;
`;

function Circle({ bgColor }: CircleProps) {
  return <Container bgColor={bgColor} />;
}

export default Circle;
```

다만 여기서 생기는 문제점은 모든 props가 required가 된다는 점이다.

### Optional Props
