---
layout: post
title: react-masterclass 2 TypeScript
date: 2021-12-26 15:54:28
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
위와는 다르게 숫자 외의 변수가 입력되면, 작동되지 않도록 만들고 싶을 수도 있다.
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
원래 타입스크립트는 .ts 확장자를 사용하지만, 리액트에서는 .tsx 라는 확장자를 사용하기 때문이다.
하지만 확장자를 바꾼 것만으론 작동하지 않는다.
기존의 패키지는 타입스크립트로 만들어지지 않았으므로 에러가 발생한다.
그렇기 때문에 타입스크립트용 패키지를 다시 설치해줘야 한다.
다행히도 유명한 패키지는 타입스크립트용으로 만들어져 있는데, @types라는 Github Repository에 저장되어 있다.
타입스크립트용 패키지를 설치하려면 @types/{package}를 설치해야 한다.
`npm install --save typescript @types/node @types/react @types/react-dom @types/jest` 로 패키지를 설치한다.
그리고 `npm i @types/styled-components`로 styled-component용 타입스크립트 패키지도 설치한다.
이제 `npm start`를 실행하면 자동으로 tsconfig.json이란 파일을 만들어준다.
만약 자동으로 해결해주지 않는다면 에러를 따라 해결하기 보다는 아래 2개의 파일을 추가해보자.

```
// tsconfig.json
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "module": "esnext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx"
    },
    "include": ["src"]
}
```

```
// src/react-app-env.d.ts
/// <reference types="react-scripts" />
```

이 방법으로 해결되지 않는다면 1.로 진행하는 것을 추천한다.

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
    bgColor: string;
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
    bgColor: string;
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
    bgColor: string;
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
    bgColor: string;
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

interface ContainerProps {
  bgColor: string;
}

const Container = styled.div<ContainerProps>`
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

<Circle>을 보면 bgColor props를 필수적으로 넣어줘야 한다.
이번에는 선택적으로 props를 쓰는 법을 알아보겠다.
사용법은 interface에서 ?를 : 앞에 붙여주는 것이다.
예를 들어서 borderColor를 optional props로 만들려면 아래처럼 하면 된다.

```
// Circle.tsx
import styled from "styled-components";

interface CircleProps {
  bgColor: string;
  // This is Optional Props
  borderColor?: string;
}

interface ContainerProps {
  bgColor: string;
}

const Container = styled.div<ContainerProps>`
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

이제 borderColor는 string | undefined로 정의된다.
<Container> interface에도 똑같은 방법으로 borderColor를 정의하면 된다.
하지만 이번에는 고의적으로 다르게 만들어서 오류를 만들어보겠다.
<Circle>에서 borderColor를 사용해보자.
borderColor를 받아서 <Container>에서 쓰도록 하면 아래처럼 된다.

```
// Circle.tsx
import styled from "styled-components";

interface CircleProps {
  bgColor: string;
  borderColor?: string;
}

interface ContainerProps {
  bgColor: string;
}

const Container = styled.div<ContainerProps>`
  width: 200px;
  height: 200px;
  background-color: ${(props) => props.bgColor};
  border-radius: 100px;
`;

function Circle({ bgColor, borderColor }: CircleProps) {
  return <Container bgColor={bgColor} borderColor={borderColor} />;
}

export default Circle;
```

그리고 <Container>에서 borderColor을 받아 쓰기 위해 interface와 styled-component에 추가해줘야 한다.
이때 optional이 아니라 required로 만든다.

```
// Circle.tsx
import styled from "styled-components";

interface CircleProps {
  bgColor: string;
  borderColor?: string;
}

interface ContainerProps {
  bgColor: string;
  // borderColor is not optional
  borderColor: string;
}

const Container = styled.div<ContainerProps>`
  width: 200px;
  height: 200px;
  background-color: ${(props) => props.bgColor};
  border-radius: 100px;
  border: 1px solid ${(props) => props.borderColor};
`;

function Circle({ bgColor, borderColor }: CircleProps) {
  return <Container bgColor={bgColor} borderColor={borderColor} />;
}

export default Circle;
```

타입스크립트는 borderColor가 string | undefined이므로 <Container>에서 borderColor를 사용하면 에러가 생길 수 있다는 것을 알려준다.
여기서 우리는 default 값을 지정할 수 있다.
default 값은 ?? 뒤에 적으면 되는데, borderColor의 default 값을 bgColor로 설정한다.

```
// Circle.tsx
import styled from "styled-components";

interface CircleProps {
  bgColor: string;
  borderColor?: string;
}

interface ContainerProps {
  bgColor: string;
  borderColor: string;
}

const Container = styled.div<ContainerProps>`
  width: 200px;
  height: 200px;
  background-color: ${(props) => props.bgColor};
  border-radius: 100px;
  border: 1px solid ${(props) => props.borderColor};
`;

function Circle({ bgColor, borderColor }: CircleProps) {
  return <Container bgColor={bgColor} borderColor={borderColor ?? bgColor} />;
}

export default Circle;
```

<Circle>의 argument에서 default 값을 정할 수 있는데, text를 하나 만들어서 default 값을 정하겠다.

```
// Circle.tsx
import styled from "styled-components";

interface CircleProps {
  bgColor: string;
  borderColor?: string;
  text?: string;
}

interface ContainerProps {
  bgColor: string;
  borderColor: string;
}

const Container = styled.div<ContainerProps>`
  width: 200px;
  height: 200px;
  background-color: ${(props) => props.bgColor};
  border-radius: 100px;
  border: 1px solid ${(props) => props.borderColor};
`;

function Circle({ bgColor, borderColor, text = "default text" }: CircleProps) {
  return (<Container bgColor={bgColor} borderColor={borderColor ?? bgColor}
            {text}
        </Container>
  );
}

export default Circle;
```

### State

타입스크립트에서 state를 사용해보자.

```
// Circle.tsx
import { useState } from "react";
...

function Circle({ bgColor, borderColor }: CircleProps) {
  const [value, setValue] = useState(0);
  ...
}

export default Circle;
```

위와 같이 사용했다면, setValue는 앞으로 number만이 값으로 들어올거라 생각한다.
이처럼 setState 함수는 state에 주어진 초기값을 가지고 앞으로 사용할 값의 타입을 유추한다.
그래서 string을 썼으면 setState에도 string을 써야 하고, boolean을 썼으면 setState에도 boolean을 써야 한다.
이는 보통 같은 타입을 사용하기 때문에 합리적인 방법이다.

하지만 경우에 따라서 2가지 이상의 타입을 써야 한다.
아래는 string, number 타입을 사용하고 싶을 때의 코드다.

```
// Circle.tsx
import { useState } from "react";
...

function Circle({ bgColor, borderColor }: CircleProps) {
  const [value, setValue] = useState<number|string>(0);
  ...
}

export default Circle;
```

그리고 초기값이 주어지지 않은 경우에 타입을 정해야 한다면 useState<type> 형태로 적는다.

### Forms

이제 Circle.tsx는 필요 없으니 지워준다.
앞으로는 <form>을 알아보겠다.
간단한 input의 내용을 제출받는 <form>을 만들어줬다.

```
// App.tsx
import React, { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const onChange = (event) => {

  };
  const onSubmit = (event) => {

  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={onChange}
          type="text"
          placeholder="username"
        />
        <button>Log in</button>
      </form>
    </div>
  );
}
```

이제 할 일은 onChange와 onSubmit을 완성하는 것이다.
그런데 event의 타입을 보면 any라고 나온다.
any는 타입스크립트의 타입으로 이름 그대로 어떤 타입이든 사용할 수 있다.
하지만 any는 자바스크립트처럼 타입을 지정하지 않는 것이므로 가급적 any가 있으면 안 된다.
그러므로 event에 타입을 추가해줘야 한다.
추가해줘야 할 타입은 React.FormEvent다.

```
// App.tsx
import React, { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const onChange = (event: React.FormEvent) => {

  };
  const onSubmit = (event) => {

  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={onChange}
          type="text"
          placeholder="username"
        />
        <button>Log in</button>
      </form>
    </div>
  );
}
```

문제는 위처럼 어떤 타입을 지정하는 것이 굉장히 비직관적이다.
React 내에 FormEvent라는 것이 있다는 것을 직접 알아내는 것은 불가능하기 때문이다.
이런 타입을 알아내는 법은 구글 검색 뿐이다.

이런 이상한 타입을 사용하는 이유는 React가 SyntheticEvent를 만들기 때문이다.
React는 실제 이벤트를 전달하는 것이 아니라, SyntheticEvent를 만들어서 전달한다.
이 때문에 React용 event 타입이 필요한 것이다.

FormEvent를 보면 어떤 element가 onChange를 발생시킬지 특정할 수 있다.
우리는 input을 다루므로 <HTMLInputElement>를 적어준다.
그리고 콘솔에 출력해야 하는데, 일단은 event.currentTarget.value를 쓴다.

```
// App.tsx
import React, { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
      console.log(event.currentTarget.value);
  };
  const onSubmit = (event) => {

  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={onChange}
          type="text"
          placeholder="username"
        />
        <button>Log in</button>
      </form>
    </div>
  );
}
```

보면 target이 아니라 currentTarget을 썼다.
타입스크립트는 currentTarget을 사용하기로 했는데, 우리가 아는 target과 동일하다.
값을 받아와서 setValue로 지정하도록 만든다.

```
// App.tsx
import React, { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
      const {
          currentTarget: { value },
      } = event;
      setValue(value);
  };
  const onSubmit = (event) => {

  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={onChange}
          type="text"
          placeholder="username"
        />
        <button>Log in</button>
      </form>
    </div>
  );
}
```

이제 onSubmit을 완성하면 된다.
onSubmint을 일으키는 태그는 <form> 태그이므로, event의 타입은 React.FormEvent<HTMLFormElement>가 된다.

```
// App.tsx
import React, { useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
      const {
          currentTarget: { value },
      } = event;
      setValue(value);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log("hello", value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={onChange}
          type="text"
          placeholder="username"
        />
        <button>Log in</button>
      </form>
    </div>
  );
}
```

### Themes

#### .d.ts

타입스크립트로 테마를 구현하기 위해 [styled-components typescript](https://styled-components.com/docs/api#typescript)를 참고해서 진행하겠다.

이전에 우리는 타입스크립트가 패키지를 이해하도록 @type/이 붙은 몇 가지를 설치했었다.
이 파일들은 모듈을 정의해서 타입스크립트가 패키지를 이해하도록 하는데, 이때 사용하는 파일이 _.d.ts_ 파일이다.
만약 타입스크립트를 지원하지 않는 라이브러리를 사용한다면 .d.ts 파일을 만들어서 타입을 직접 선언해야 한다.
.d.ts 파일 안에 declare module을 작성하면, 해당 패키지에서 interface, class, function 등의 타입을 선언할 수 있다.

테마 기능을 쓰기 위해선 styled-component에 테마의 타입을 선언해줘야 한다.
아래는 styled.d.ts 파일을 만들어서 DefaultTheme을 선언한 것이다.

```
// src/styled.d.ts
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    btnColor: string;
  }
}
```

위와 같이 작성하면 이제 styled-components로부터 DefaultTheme을 import할 수 있게 된다.
이를 이용해 테마 내용이 들어 있는 theme.ts 파일을 만들었다.

```
// src/theme.ts
import { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
  bgColor: "white",
  textColor: "black",
  btnColor: "tomato",
};

export const darkTheme: DefaultTheme = {
  bgColor: "black",
  textColor: "white",
  btnColor: "teal",
};
```

#### Declaration Merging

그런데 위에서 모듈을 선언한 것을 보면 이미 styled-components가 있음에도 불구하고 같은 이름으로 모듈을 만들었다.
그리고 import 한 것을 보면 선언한 내용이 styled-components와 합쳐진 것을 알 수 있다.

이런 일이 일어나는 이유는 선언 병합(Declaration Merging) 때문이다.
선언 병합은 컴파일러가 같은 이름으로 선언된 정의를 하나로 합치는 것을 말한다.
예를 들어 아래처럼 2개의 interface가 있다고 하자.

```
interface Box {
  height: number;
  width: number;
}

interface Box {
  scale: number;
}

let box: Box = { height: 5, width: 6, scale: 10 };
```

2개의 interface를 하나로 만들어주기 때문에 위이 box처럼 3개의 값을 적어도 작동한다.
물론 각 interface에 이름은 같지만 타입이 다른 멤버를 선언하면 에러가 발생하므로 주의하자.
그 외에도 선언 순서에 따라 병합되는 순서가 다르고, 몇 가지 규칙이 더 있지만 추가적인 내용은 [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)을 확인하자.

중요한 것은 이처럼 같은 이름으로 작성하면 하나로 병합된다는 점이다.
그러므로 특정 모듈과 같은 이름으로 선언하고 interface를 만들어주면, 그 모듈이 업데이트 된 것과 동일한 효과가 나타난다.
이것이 앞서 우리가 styled-components로 모듈을 선언하고 interface를 작성한 것이, 기존의 styled-components에서 불러올 수 있었던 이유다.

#### theme

다시 하던 일로 돌아가자.
우리는 styled.d.ts에서 DefaultTheme interface를 만들었다.
그리고 이를 가지고 theme.ts에 lightTheme과 darkTheme을 만들었다.
다음으로 index.tsx에서 theme을 적용시키겠다.
우선은 <ThemeProvider>를 styled-components에서 불러와야 한다.
그리고 속성에 theme={darkTheme}을 줘서 <App>에 테마 변화 기능을 준다.

```
// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { darkTheme, lightTheme } from "./theme";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

그리고 App.tsx를 고쳐서 테마 변화가 잘 보이도록 고쳐줬다.

```
// App.tsx
import styled from "styled-components";

const Container = styled.div`
    background-color: ${(props) => props.theme.bgColor};
`;

const H1 = styled.h1`
    color: ${(props) => props.theme.textColor}
`;

function App() {
    return (
        <Container>
            <H1>Hello</H1>
        </Container>
    )
}
```

테마를 변화시키려면 index.tsx에서 <ThemeProvider>의 theme만 lightTheme으로 바꿔주면 해결된다.
