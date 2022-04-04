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
문제는 form의 input이 많아질수록, 작성할 것이 많아진다는 점이다.
게다가 예외 사항이라도 생기면 일일이 state를 만들어서 하나하나 처리해줘야 한다.
다행히도 Form을 간단하게 만들 수 있는 패키지가 있다.
[**React Hook Form**](https://react-hook-form.com/)은 간단한 코드로 form을 사용하게 해준다.
React Hook Form을 `npm i react-hook-form`으로 설치한다.
그리고 useForm을 import하고 아래처럼 적어준다.

```
// ToDoList.tsx
import { useForm } from "react-hook-form";
...
function ToDoList() {
	const { register } = useForm();
	...
}
```

register는 React Hook Form의 가장 핵심적인 기능이다.
어떤 기능을 하는지 알기 위해 `console.log(register("toDo"))`로 출력해본다.

```
// ToDoList.tsx
function ToDoList() {
	const { register } = useForm();
	console.log(register("toDo"));
	/*
	{
		name: "toDo",
		onBlur: ...,
		onChange: ...,
		ref: ...,
	}
	 */
}
```

> register: (name: string, RegisterOptions?) => ({ onChange, onBlur, name, ref })

-   name: 등록될 이름
-   onBlur: onBlur 시에 발생할 이벤트
-   onChange: onChange 시에 발생할 이벤트

출력값을 보면 name, onBlur, onChange, ref가 있다.
register는 input의 변화를 체크하는데 사용한다.
onBlur는 포커스가 해제되는 경우, onChange는 값이 변경되는 경우에 사용된다.
name을 보면 register에서 넣어준 이름이 그대로 사용된다.
이는 각 input을 구분하기 위해 사용하는 이름이다.
register를 input에 적용시키기 위해선 `{...register("toDo")}`처럼 입력하면 된다.
그렇게하면 register 안의 내용이 펴져서 input에 전달되기 때문이다.
이때 변화되는 내용을 확인하기 위해서 useForm에서 watch를 사용한다.
그리고 `console.log(watch())`로 내용을 확인한다.

```
// ToDoList.tsx
function ToDoList() {
	const { register, watch } = useForm();
	console.log(watch());
	/*
	{
		toDo: "asdf"
	}
	 */
	return (
		<div>
			<form>
				<input {...register("toDo")} placeholder="Write a todo here" />
				<button>Add Todo</button>
			</form>
		</div>
	);
}
```

input에 글자를 입력하면 `{toDo: "asdf"}`와 같이 출력되는 것을 볼 수 있다.
watch를 사용하면 각 input이 어떻게 변하는지 확인할 수 있다.
input을 몇 개 더 만들어보자.

```
// ToDoList.tsx
function ToDoList() {
	const { register, watch } = useForm();
	console.log(watch());
	/*
	{
		Email: 'asdf',
		Name: 'asdf',
		Location: 'asdf',
		Password: 'asdfasdf'
	}
	 */
	return (
		<div>
			<form>
				<input {...register("Email")} />
				<input {...register("Name")} />
				<input {...register("Location")} />
				<input {...register("Password")} />
				<button>Add Todo</button>
			</form>
		</div>
	);
}
```

React Hook Form은 handleSubmit으로 제출시에 일어날 일도 제어할 수 있다.

> handleSubmit: ((data: Object, e?: Event) => void, (errors: Object, e?: Event) => void) => Function

-   SubmitHandler((data: Object, e?: Event) => void): 제출이 유효한 경우 실행될 함수
-   SubmitErrorHandler((errors: Object, e?: Event) => void): 제출이 유효하지 않을 때 실행되는 함수

handleSubmit은 2가지 변수를 사용한다.
첫 번째 변수는 Submit이 유효한 경우에 작동하는 함수고, 두 번째 변수는 유효하지 않은 경우 작동하는 함수다.
이 중 첫 번째 변수는 반드시 넣어줘야 한다.
우선은 유효한 경우의 함수만을 만들어서 사용한다.
이때 data를 전달해야 하는데, 일단은 타입을 any로 지정해두자.

```
// ToDoList.tsx
function ToDoList() {
	const { register, handleSubmit} = useForm();
	const onValid = (data: any) => {
		console.log(data);
	}
	/*
	{
		Email: 'asdf',
		Name: 'asdf',
		Location: 'asdf',
		Password: 'asdf'
	}
	 */
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				...
			</form>
		</div>
	);
}
```

onSubmit이 일어나면 input의 내용이 제출되는 것을 볼 수 있다.
보다시피 React Hook Form을 사용하면 기존의 Form을 아주 쉽게 만들 수 있다.
이전의 useState, onChange를 일일이 만든 것과 비교하면, 코드가 굉장히 간결하다.
기본적인 React Hook Form을 알아봤으므로 다른 기능을 알아보자.

> setValue: (name: string, value: unknown, config?: Object) => void

setValue는 input의 값을 변경시키는데 사용한다.
대표적으로 제출 후에 input을 비우는데 사용한다.
사용법은 간단한데 초기화 시키고 싶은 name과 값 value를 적어주면 된다.
아래는 serValue를 사용해서 유효한 제출이 일어나면 input을 초기화 시킨다.

```
// ToDoList.tsx
function ToDoList() {
	const { register, handleSubmit, setValue } = useForm();
	const onValid = (data: any) => {
		console.log(data);
		setValue("Email", "");
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				...
			</form>
		</div>
	);
}
```

useForm을 사용하면 input의 초기값을 설정할 수 있다.
useForm에 defaultValues를 적어주면 된다.

```
// ToDoList.tsx
function ToDoList() {
	const { register, handleSubmit, setValue } = useForm({
		defaultValues: {
			Email: "@gmail.com",
			Location: "Seoul",
		},
	});
	...
}
```

HTML에서 input에 required, maxLength 등을 지정할 수 있었다.
React에서도 이 같은 속성을 지정할 수 있지만, 브라우저에서 직접 지울 수 있다는 문제가 있다.
그래서 우리는 onSubmit이 일어날 때, 따로 input의 길이를 체크해서 에러를 반환했다.
이는 HTML을 수정할 수 있으므로 자바스크립트로 안전하게 제어하기 위해 만들어준 것이다.
React Hook Form은 이 같은 일을 대신해준다.
차이점은 input의 속성을 register의 두 번째 변수에 적어줘야 한다는 점이다.

```
// ToDoList.tsx
function ToDoList() {
	const { register, handleSubmit } = useForm();
	const onValid = (data: any) => {
		console.log(data);
	};
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				<input
					{...register("Email", { required: true, maxLength: 12 })}
				/>
				<input
					{...register("Name", { required: true, maxLength: 12 })}
				/>
				<input
					{...register("Location", { required: true, maxLength: 10 })}
				/>
				<input
					{...register("Password", { required: true, minLength: 8 })}
				/>
				<button>Add Todo</button>
			</form>
		</div>
	);
}
```

여기서 input이 조건을 만족하지 않으면 제출이 일어나지 않는다.
뿐만 아니라 조건이 맞지 않는 input으로 포커스를 자동으로 옮겨준다.
다만 에러가 발생해도 아무것도 출력하지 않고 있다.
formState를 사용하면 에러가 발생했을 때, 내용을 출력해준다.

```
// ToDoList.tsx
function ToDoList() {
	const { register, handleSubmit, formState } = useForm();
	...
	console.log(formState.errors);
	/*
	{
		Email: {type: 'required', message: '', ref: input},
		Location: {type: 'required', message: '', ref: input},
		Name: {type: 'required', message: '', ref: input},
		Password: {type: 'required', message: '', ref: input}
	}
	 */
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				...
			</form>
		</div>
	);
}
```

위는 input의 값이 변경될 때마다, 에러 내용을 출력한다.
이때 에러 내용을 보면 type에서 어떤 내용이 틀렸는지 나온다.
위는 required를 어겼기 때문에 위처럼 나오는 것으로 다른 조건을 어기면 다른 내용이 나온다.

```
// ToDoList.tsx
function ToDoList() {
	const { register, handleSubmit, formState } = useForm();
	...
	console.log(formState.errors);
	/*
	{
		Email: {type: 'maxLength', message: '', ref: input},
		Location: {type: 'maxLength', message: '', ref: input},
		Name: {type: 'maxLength', message: '', ref: input},
		Password: {type: 'minLength', message: '', ref: input}
	}
	 */
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				...
			</form>
		</div>
	);
}
```

다음으로 출력된 내용을 보면 message 항목이 있다.
message는 에러가 발생했을 때 나오는 문장으로, 각 속성에서 정할 수 있다.
minLength 위에 커서를 올려보면 타입이 "ValidationRule<string | number>"로 나온다.
ValidationRule의 내용을 보면 "value"와 "message"를 보내도록 돼있다.
value에는 값을 넣어주고, message에는 에러시의 메세지를 적어주면 된다.
예를 들어서 "minLength: 5"는 "minLength: { value: 5, message: "error message" }" 형태로 바꿀 수 있다.

```
// ToDoList.tsx
function ToDoList() {
	...
	console.log(formState.errors);
	/*
	{
		Password: {type: 'minLength', message: 'error message', ref: input}
	}
	 */
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				...
				<input
					{...register("Password", {
						required: true,
						minLength: {
							value: 5,
							message: "error message",
						},
					})}
				/>
				<button>Add Todo</button>
			</form>
		</div>
	);
}
```

지금까지는 formState.errors를 사용했지만 아래처럼 사용하면 errors 만으로도 사용할 수 있다.

```
// ToDoList.tsx
function ToDoList() {
	const { register, handleSubmit, formState: {errors} } = useForm();
	...
	console.log(errors);
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				...

			</form>
		</div>
	);
}
```

input이 정규 표현식을 만족하는지 확인할 때 pattern을 사용할 수 있다.
"@gmail.com"을 포함하도록 만들려면 아래처럼 하면 된다.

```
// ToDoList.tsx
function ToDoList() {
	...
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				<input
					{...register("Email", {
						required: true,
						maxLength: 12,
						pattern: /^[A-Za-z0-9]+@gmail.com/,
					})}
				/>
				...
				<button>Add Todo</button>
			</form>
		</div>
	);
}
```

다음으로 에러가 여러개일 때 메세지를 출력하는 것을 생각해보자.
위의 Email은 required, maxLength, pattern이 틀리는 3가지 경우가 있다.
그리고 각 경우마다 출력할 에러 메세지가 다르다.
기존의 방법대로 했다면, required, maxLength, patter의 값을 일일이 확인한 다음 메세지를 출력했을 것이다.
그런데 지금은 errors를 보면 에러 타입에 따라 메세지가 출력된다.

```
// ToDoList.tsx
function ToDoList() {
	...
	console.log(errors);
	/*
	{
		Email: {type: 'required', message: 'Write your email', ref: input}
		or
		Email: {type: 'maxLength', message: "Email can't exceed length 20", ref: input}
		or
		Email: {type: 'pattern', message: 'Email should be end with @gmail.com', ref: input}
	}
	 */
	return (
		<div>
			<form>
				<input
					{...register("Email", {
						required: "Write your email",
						maxLength: {
							value: 20,
							message: "Email can't exceed length 20",
						},
						pattern: {
							value: /^[A-Za-z0-9]+@gmail.com/,
							message: "Email should be end with @gmail.com",
						},
					})}
				/>
				...
				<button>Add Todo</button>
			</form>
		</div>
	);
}
```

출력되는 것을 보면 타입은 바뀌지만 항상 message에 에러 메세지가 들어 있다.
그러므로 에러를 보여주려면 message만 출력하면 된다.
그런데 아래처럼 메세지를 출력하려 하면 에러가 발생한다.

```
// ToDoList.tsx
function ToDoList() {
	...

	return (
		<div>
			<form>
				...
			</form>
			<span>{errors.Email.message}</span>
		</div>
	);
}
```

문제점은 우선 errors의 타입을 지정하지 않았다는 것이다.
errors의 타입을 지정한 interface를 만들어야 한다.
이때 required가 아닌 것에는 뒤에 ?를 붙여야 한다.

```
// ToDoList.tsx
interface IErrors {
	Name: string;
	Email: string;
	Location: string;
	Password: string;
}

function ToDoList() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IErrors>();
	return (
		<div>
			<form>
				...
			</form>
			<span>{errors.Email.message}</span>
		</div>
	);
}
```

이번에는 다른 에러 메세지가 나온다.
이는 errors가 비었을 수도 있기 때문에 발생한다.
Email이 조건을 만족하면 errors 안에 Email이 없을 수도 있다.
그러므로 ?를 뒤에 붙여서 사용한다.

```
// ToDoList.tsx
function ToDoList() {
	...
	return (
		<div>
			<form>
				...
			</form>
			<span>{errors.Email?.message}</span>
		</div>
	);
}
```

마지막으로 에러 메세지를 만드는 방법과 내가 만든 규칙으로 검사하는 법을 알아보겠다.
지금까지 에러 메세지를 보면 자연적으로 만들어주고 있다.
그런데 패스워드를 검사해서 두 값이 다르면 에러를 발생시키고 싶다고 하자.
이는 앞서 배운 내용만으로 해결되지 않는다.
각 패스워드 입력은 아무런 문제가 없기 때문이다.
그 외에도 아이디의 유효성을 백엔드와 통신해서 가져와야 하는 경우를 생각해보자.
이 경우 아이디 입력 자체는 유효하지만, 백엔드와의 통신 결과 유효하지 않을 수 있다.

위의 두 경우 모두 검사가 틀렸을 경우 새로운 에러 메세지를 만들어야 한다.
setError를 사용하면 에러 메세지를 만들 수 있다.

> setError:(name: string, error: FieldError, { shouldFocus?: boolean }) => void

-   name: string
-   error: { type: string, message?: string, types: MultipleFieldErrors }
-   config: { shouldFocus?: boolean }

setError는 name으로 error를 만드는데 사용한다.
아래는 패스워드가 다른 경우 onValid에서 에러를 만드는 코드다.

```
// ToDoList.tsx
function ToDoList() {
	const {
		...
		serError,
	} = useForm<IErrors>();
	const onValid = (data: IErrors) => {
		if (data.Password !== data.ConfirmPassword) {
			setError(
				"ConfirmPassword",
				{ message: "Passwords are not the same" }
			);
		}
	};
	console.log(errors);
	/*
	{
		ConfirmPassword: {message: 'Passwords are not the same', ref: input}
	}
	 */
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				...
				<input
					{...register("Password", {
						required: true,
						minLength: {
							value: 5,
							message: "error message",
						},
					})}
				/>
				<input
					{...register("ConfirmPassword", {
						required: true,
						minLength: {
							value: 5,
							message: "error message",
						},
					})}
				/>
				<button>Add Todo</button>
			</form>
			<span>{errors.Email?.message}</span>
		</div>
	);
}
```

여기서 error의 name을 "ConfirmPassword"로 만들었다.
이렇게 하면 ConfirmPassword input의 에러 메세지를 변경 시킬 수 있다.
특정 input의 에러 메세지를 변경 시키지 않고 새로운 에러 메세지를 만들려는 경우 새로운 name으로 지정해주면 된다.
이때 data에 새로운 데이터가 생기므로 interface도 변경시켜줘야 한다.

```
// ToDoList.tsx
interface IErrors {
	...
	newError?: string;
}

function ToDoList() {
	...
	const onValid = (data: IErrors) => {
		...
		setError("newError", {
			message: "This is new Error Message",
		});
	};
	console.log(errors);
	/*
	{
		ConfirmPassword: {message: 'Passwords are not the same', ref: input},
		newError: {message: 'This is new Error Message', ref: undefined}
	}
	 */
	return (
		<div>
			...
		</div>
	);
}
```

이렇게 하면 우리가 원한 조건으로 테스트하고 에러 메세지를 만들 수 있다.
여기서 더 나아가 에러가 발생한 곳으로 포커스를 옮길 수 있는데, shouldFocus를 추가하면 된다.

```
// ToDoList.tsx
interface IErrors {
	...
	newError?: string;
}

function ToDoList() {
	...
	const onValid = (data: IErrors) => {
		if (data.Password !== data.ConfirmPassword) {
			setError(
				"ConfirmPassword",
				{ message: "Passwords are not the same" },
				{ shouldFocus: true }
			);
		}
	};
	...
	return (
		<div>
			...
		</div>
	);
}
```

마지막으로 register에 새로운 조건을 만드는 방법인 validate를 알아보겠다.
현재 register는 maxLength, minLength, pattern 등으로 조건을 확인하지만, 이것만으론 부족하다.
그래서 사용하는 것이 validate로 register에 존재하지 않는 속성으로 테스트할 때 사용한다.
validate는 input의 value를 사용하는 콜백 함수를 받는다.
그리고 실행 결과가 false라면 에러 메세지를 반환한다.
예를 들어서 input에 "abc"를 포함시키지 않으려고 한다고 하자.
이 경우 validate를 아래처럼 작성하면 된다.

```
// ToDoList.tsx
function ToDoList() {
	...
	console.log(errors);
	/*
		Email: {type: 'validate', message: '', ref: input
	 */
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				<input
					{...register("Email", {
						...
						validate: (value) => !value.includes("abc"),
					})}
				/>
			...
			</form>
		</div>
	);
}
```

위는 메세지를 지정하지 않아서 아무것도 나오지 않았다.
에러 메세지를 지정하려면 string을 반환하기만 하면 된다.

```
// ToDoList.tsx
function ToDoList() {
	...
	console.log(errors);
	/*
	{
		Email: {type: 'validate', message: 'wrong', ref: input}
	}
	 */
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				<input
					{...register("Email", {
						...
						validate: (value) => "wrong",
					})}
				/>
			...
			</form>
		</div>
	);
}
```

다만 콜백함수를 사용하는 이유는 조건을 확인하기 위해서다.
이는 콜백함수의 테스트 결과가 틀렸으면 문자열을 반환하고, 맞으면 true를 반환하도록 만들면 된다.
아래 두 방식은 예시로 조건에만 맞으면 다른 방법을 사용해도 상관 없다.

```
// ToDoList.tsx
function ToDoList() {
	...
	console.log(errors);
	/*
	{
		Email: {type: 'validate', message: 'wrong', ref: input}
	}
	 */
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				<input
					{...register("Email", {
						...
						validate: (value) =>
							value.includes("abc") ? "wrong" : true,
					})}
				/>
			...
			</form>
		</div>
	);
}
```

```
// ToDoList.tsx
function ToDoList() {
	...
	console.log(errors);
	/*
	{
		Email: {type: 'validate', message: 'wrong', ref: input}
	}
	 */
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				<input
					{...register("Email", {
						...
						validate: (value) => !value.includes("abc") || "wrong",
					})}
				/>
			...
			</form>
		</div>
	);
}
```

지금까지 React Hook Form을 알아봤다.
다시 ToDoList로 돌아가기 위해 필요한 것만 남기고 아래처럼 수정했다.

```
import { useForm } from "react-hook-form";

interface IForm {
	toDo: string;
}

function ToDoList() {
	const { register, handleSubmit, setValue } = useForm<IForm>({
		defaultValues: {
			toDo: "Write a ToDo here",
		},
	});
	const onValid = (data: IForm) => {
		console.log(data.toDo);
		setValue("toDo", "");
	};
	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>
				<input
					{...register("toDo", {
						required: "Please write a ToDo",
					})}
				/>
				<button>Add</button>
			</form>
		</div>
	);
}

export default ToDoList;
```
