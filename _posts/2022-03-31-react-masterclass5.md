---
layout: post
title: State Management TodoList
date: Thu Mar 31 15:19:22 JST 2022
categories:
tag:
toc: true
---

# TodoList

## Setup

파일을 초기화해서 가장 기본적인 것만 만들어줬다.
"react-router-dom", "recoil", "styled-components"만 설치한 다음, 아래처럼 기본적인 theme, GlobalStyle, recoil만 만들어 놓는다.

```
// App.tsx
import { createGlobalStyle } from "styled-components";

let GlobalStyle = createGlobalStyle`
// reset css
`;

function App() {
	return (
		<>
			<GlobalStyle />
		</>
	);
}

export default App;
```

```
// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { darkTheme } from "./theme";
import { ThemeProvider } from "styled-components";
import { RecoilRoot } from "recoil";
import App from "./App";

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={darkTheme}>
			<RecoilRoot>
				<App />
			</RecoilRoot>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
```

```
// styled.d.ts
import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		bgColor: string;
		textColor: string;
		accentColor: string;
		dominantColor: string;
	}
}
```

```
// theme.ts
import "styled-components";
import { DefaultTheme } from "styled-components";

export const darkTheme: DefaultTheme = {
	bgColor: "black",
	textColor: "white",
	accentColor: "yellow",
	dominantColor: "gray",
};

export const lightTheme: DefaultTheme = {
	bgColor: "white",
	textColor: "black",
	accentColor: "blue",
	dominantColor: "gray",
};
```

그리고 ToDoList.tsx 안에 TodoList를 만든다.
대부분 다뤄본 내용이므로 자세한 것은 생략하겠다.

```
// ToDoList.tsx
import React, { useState } from "react";

function ToDoList() {
	const [todo, setTodo] = useState("");
	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTodo(event.target.value);
	};
	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		console.log(todo);
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					value={todo}
					onChange={onChange}
					placeholder="Write a todo here"
				/>
				<button>Add Todo</button>
			</form>
		</div>
	);
}

export default ToDoList;
```

여기서 하나 걸릴만한 것은 event의 타입을 지정해주는 것이다.
event에 타입을 지정하는 방법은 2가지가 있다.
하나는 함수에 타입을 지정해주는 방법이고, 다른 하나는 event의 타입을 지정해주는 것이다.
아래는 각각의 예시다.

```
const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    ...
};

const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ...
};
```

위의 타입을 보면 두 타입이 굉장히 유사하다.
차이점은 함수에 타입을 지정하는 것에 *Handler*라는 글자가 붙어 있다는 점이다.
다시 말해 Handler가 있으면 함수의 타입이고, Handler가 없으면 event의 타입이다.

함수와 event에 타입을 지정하는 법은 알았지만, 보다시피 너무 길다는 문제가 있다.
다행히도 타입을 직접 기억할 필요는 없다.
커서를 올리면 타입을 알 수 있기 때문이다.
위의 input에서 _onChange_ 위에 마우스를 올리면 "React.ChangeEventHandler\<HTMLInputElement>"라고 나온다.
Handler가 있으므로 이는 함수의 타입인 것을 알 수 있다.
함수의 타입을 알았으므로 event의 타입도 쉽게 알 수 있다.
여기서 Handler만 지우면 안의 event의 타입이 된다.
둘 중에 어떤 것을 써도 상관 없으므로 편한 방식을 사용하면 된다.

## React Hook Form

현재 ToDoList.tsx의 내용은 간단하지만 작성법이 너무 복잡하다.
Form이 복잡해질수록 문제도 커진다.
각 Input 마다 state를 만들어 줘야 하고, 예외 처리할 것을 일일이 직접 입력해야 하기 때문이다.

**React Hook Form**을 사용하면 Form을 쉽게 만들 수 있다.
npm i react-hook-form

useForm
register

onBlur
onChange
