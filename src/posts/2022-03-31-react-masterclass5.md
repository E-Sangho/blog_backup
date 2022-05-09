---
title: "State Management TodoList"
date: "2022-03-31 15:19:22"
thumbnail: "../assets/img/react.png"
summary: "React Project to create ToDoList"
categories: ["React"]
---

# TodoList

## Setup

파일을 초기화해서 가장 기본적인 것만 만들어줬다.
"react-router-dom", "recoil", "styled-components"만 설치한 다음, 아래처럼 기본적인 theme, GlobalStyle, recoil만 만들어 놓는다.

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
// ToDoList.tsx
function ToDoList() {
	const { register, handleSubmit } = useForm();
	const onValid = (data: any) => {
		console.log(data);
	};
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
			<form onSubmit={handleSubmit(onValid)}>...</form>
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

```javascript
// ToDoList.tsx
function ToDoList() {
	const { register, handleSubmit, setValue } = useForm();
	const onValid = (data: any) => {
		console.log(data);
		setValue("Email", "");
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onValid)}>...</form>
		</div>
	);
}
```

useForm을 사용하면 input의 초기값을 설정할 수 있다.
useForm에 defaultValues를 적어주면 된다.

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
import { useForm } from "react-hook-form";

interface IForm {
	toDo: string;
}

function ToDoList() {
	const { register, handleSubmit, setValue } =
		useForm <
		IForm >
		{
			defaultValues: {
				toDo: "Write a ToDo here",
			},
		};
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

## Recoil

ToDoList를 만들던 일로 돌아가보자.
ToDoList.tsx 파일을 components 폴더로 옮겨줬다.
그리고 ToDo를 Recoil을 이용해서 만들어줘야 한다.
먼저 atom을 새로 만들고 useRecoilState로 atom을 불러온다.

```javascript
// ToDoList.tsx
import { atom, useRecoilState } from "recoil";


const toDoState = atom({
	key: "toDo",
	default: [],
});

function ToDoList() {
	const [toDos, setToDos] = useRecoilState(toDoState);
	...
}
```

Add 버튼을 눌렀을 때 atom에 추가하기 위해 onValid 안에서 setToDos를 사용한다.
이때 추가할 내용은 해야할 일(text), key를 위한 id, category(진행 상태 표시)를 포함하도록 만든다.

```javascript
// ToDoList.tsx
function ToDoList() {
	const [toDos, setToDos] = useRecoilState(toDoState);
	...
	const onValid = (data: IForm) => {
		setToDos((prev) => [
			...prev,
			{ text: data.toDo, id: Date.now(), category: "ToDo" },
		]);
		setValue("toDo", "");
	};
	/*
		Argument of type '(prev: never[]) => { text: string; id: number; category: string; }[]' is not assignable to parameter of type 'never[] | ((currVal: never[]) => never[])'.
	 */
	...
}
```

그런데 toDos의 타입이 never[]로 지정되어 있어서 에러가 나온다.
interface로 toDo의 타입을 정한 다음 atom의 generic으로 넘겨줘야 한다.

```javascript
// ToDoList.tsx

interface IToDos {
	text: string;
	id: number;
	category: "ToDo" | "Doing" | "Done";
}

const toDoState = atom<IToDos[]>({
	key: "toDo",
	default: [],
});
```

여기서 category를 보면 `"ToDo" | "Doing" | "Done"`라고 입력했다.
만약 category를 string으로 정하면 어떤 것이든 입력할 수 있다.
하지만 우리는 category로 현재 진행 상태를 표시하고 싶다.
그러므로 입력받는 것은 제한해야 하는데, 위와 같이 적으면 셋 중에 하나만 입력값으로 받게 된다.
추가로 onValid에서 data를 입력 받을 때 간단히 하기 위해서 `{ toDo }: IForm`으로 바꿔준다.

```javascript
// ToDoList.tsx
function ToDoList() {
	const [toDos, setToDos] = useRecoilState(toDoState);
	...
	const onValid = ({ toDo }: IForm) => {
		setToDos((prev) => [
			...prev,
			{ text: toDo, id: Date.now(), category: "ToDo" },
		]);
		setValue("toDo", "");
	};
	...
}
```

## Refactoring

지금까지 작성한 코드를 각 종류별로 나눠주려고 한다.
우선 ToDo를 만드는 form을 저장할 CreateToDo.tsx를 만든다.
이 파일엔 form에서 쓰는 내용을 모두 저장시켜줬다.

```javascript
// CreateToDo.tsx
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";

interface IForm {
	toDo: string;
}

function CreateToDo() {
	const setToDos = useSetRecoilState(toDoState);
	const { register, handleSubmit, setValue } = useForm({
		defaultValues: {
			toDo: "Write a ToDo",
		},
	});
	const onValid = ({ toDo }: IForm) => {
		setToDos((prev) => [
			...prev,
			{ text: toDo, id: Date.now(), category: "ToDo" },
		]);
		setValue("toDo", "");
	};
	return (
		<form onSubmit={handleSubmit(onValid)}>
			<input
				{...register("toDo", {
					required: "Please write a ToDo",
				})}
			/>
			<button>Add</button>
		</form>
	);
}
```

다음으로 atom 파일을 저장할 atoms를 만들었다.

```javascript
// atoms.tsx
import { atom } from "recoil";

export interface IToDos {
	text: string;
	id: number;
	category: "ToDo" | "Doing" | "Done";
}

export const toDoState = atom<IToDos[]>({
	key: "toDo",
	default: [],
});
```

ToDo.tsx 파일을 만들어서 해야할 리스트를 만들었다.

```javascript
// ToDo.tsx
import { IToDos } from "../atoms";

function ToDo({ text }: IToDos) {
	return (
		<li>
			<span>{text}</span>
			<button>ToDo</button>
			<button>Doing</button>
			<button>Done</button>
		</li>
	);
}
```

마지막으로 ToDoList.tsx 파일에서 필요 없는 내용을 지워줬다.

```javascript
// ToDoList.tsx
import { useRecoilValue } from "recoil";
import { toDoState } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

function ToDoList() {
	const toDos = useRecoilValue(toDoState);

	return (
		<div>
			<CreateToDo />
			<hr />
			<ul>
				{toDos.map((toDo) => (
					<ToDo key={toDo.id} {...toDo} />
				))}
			</ul>
		</div>
	);
}
```

이때 ToDo에 toDo의 내용을 속성으로 보내줘야 한다.
일반적으론 `text={toDo.text} id={toDo.id} category={toDo.category}`를 사용해야 한다.
하지만 {...toDo}의 내용이 위와 동일하므로 간편하게 {...toDo}를 사용했다.

## ToDo

이제 ToDo의 버튼을 눌러서 카테고리를 변경하는 기능을 만들어보겠다.
현재 카테고리를 확인해서 보일 버튼과 보이지 않을 버튼을 구분한다.

```javascript
// ToDo.tsx
import { IToDos } from "../atoms";

function ToDo({ text, id, category }: IToDos) {
	return (
		<li>
			<span>{text}</span>
			{category !== "ToDo" && <button>ToDo</button>}
			{category !== "Doing" && <button>Doing</button>}
			{category !== "Done" && <button>Done</button>}
		</li>
	);
}
```

각 버튼을 눌렀을 때 onClick으로 카테고리를 변경해줘야한다.
우선은 버튼을 눌렀을 때 바뀔 카테고리를 출력해주도록 한다.
이를 위해선 event.currentTarget.textContent를 사용하거나, button에 name 속성을 따로 줘서 사용해도 된다.

```javascript
// ToDo.tsx
function ToDo({ text, id, category }: IToDos) {
	const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		console.log(event.currentTarget.textContent);
	};
	return (
		<li>
			<span>{text}</span>
			{category !== "ToDo" && <button onClick={onClick}>ToDo</button>}
			{category !== "Doing" && <button onClick={onClick}>Doing</button>}
			{category !== "Done" && <button onClick={onClick}>Done</button>}
		</li>
	);
}
```

이제 Recoil을 사용해서 버튼을 눌렀을 때 카테고리를 변경시켜야 한다.
toDos에서 findIndex로 바꿀 위치를 찾고 setToDos로 값을 변경시켜야 한다.
이때 toDos는 읽기 전용이기 때문에 `toDos[Index] = {...}`처럼 직접 값을 바꾸는 방법은 쓸 수 없다.
그러므로 slice를 사용해서 깊은 복사를 시행한 다음 값을 변경 시켜야 한다.

```javascript
// ToDo.tsx
function ToDo({ text, id, category }: IToDos) {
	const setToDos = useSetRecoilState(toDoState);
	const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		const {
			currentTarget: { textContent },
		} = event;
		setToDos((toDos) => {
			const toDoIndex = toDos.findIndex((toDo) => toDo.id === id);
			let newToDos = toDos.slice();
			newToDos[toDoIndex] = {
				text: text,
				id: id,
				category: textContent
			};
			return newToDos;
		});
	};
	...
}
```

이렇게 하면 category의 타입이 문제가 된다.
textContent는 string인데, IToDos 때문에 "ToDo" | "Doing" | "Done"만 가져야 하기 때문이다.
그래서 as를 사용해서 타입을 지정해줬다.

```javascript
// ToDo.tsx
function ToDo({ text, id, category }: IToDos) {
	...
	const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		...
		setToDos((toDos) => {
			...
			newToDos[toDoIndex] = {
				...
				category: textContent as IToDos["category"],
			};
			return newToDos;
		});
	};
	...
}
```

ToDo의 카테고리를 변경하는 것을 완성했다.
이어서 각 카테고리별로 보여주는 기능을 만들려고 한다.
이는 조건문을 사용해서 가능하지만 Recoil의 selector를 사용해서 해결하려 한다.
그 전에 selector이 무엇이며 왜 필요한지 알아보자.

toDos를 카테고리별로 모으려면 filter를 사용하면 된다.
filter로 거르면 "ToDo", "Doing", "Done" 3개의 배열에 각각 나뉘어 담기게 된다.
현재는 이렇게 나뉜 배열이 동일한 곳에서 사용되므로 이로도 충분하다.
그렇지만 조금 더 규모가 큰 프로젝트를 상상해보자.
각 카테고리로 나눴지만 서로 다른 곳에서 사용해야 한다면, 매 번 카테고리를 나누는 코드를 작성해야 한다.
이렇게 반복되는 코드는 함수를 만들어서 반복되는 작업을 줄여줘야 한다.
그런데 함수에 사용되는 변수가 state인 점이 일반 함수와 다르다.
현재 우리가 아는 방법으론 useRecoilState를 사용해서 state를 받아와야 한다.
문제는 사용하는 state가 많을수록 이 작업이 굉장히 번거롭다.
여기다 더해서 state를 변경시켜야 하는 경우까지 추가되면 곤란하다.
결국 state를 전문적으로 읽어오고 변경시키는 함수가 필요하다.
그래서 Recoil은 state를 다루는 함수 **selector**를 만들었다.

selector는 이름을 구분하기 위해 key를 사용하고, get을 사용해서 정보를 받아온다.
아래는 간단한 selector를 만든 것이다.

```javascript
// atoms.tsx
import { selector } from "recoil";

export const toDoSelector = selector({
	key: "toDoSelector",
	get: ({ get }) => {
		...
	},
});
```

여기서 `({ get })` 부분에서 get은 state를 읽어들이는 함수다.
그래서 get(stateName) 형태로 state를 읽어올 수 있다.
selector는 get을 사용해서 값을 읽어들인다.
그리고 return으로 값을 반환하는데, 이 값은 useRecoilValue를 사용해서 읽을 수 있다.

```javascript
export const toDoSelector = selector({
	key: "toDoSelector",
	get: ({ get }) => {
		const toDos = get(toDoState);
		return toDos;
	},
});

const selValue = useRecoilValue(toDoSelector);
console.log(selValue);
/*
	selValue = toDos
 */
```

이제 이 기능을 사용해서 현재 카테고리별로 보여주려고 한다.
우선 현재 카테고리를 저장할 state를 하나 만든다.

```javascript
// atoms.tsx
export const categoryState = atom({
	key: "category",
	default: "ToDo",
});
```

그리고 selector에서 category와 일치하는 toDos만 걸러낸다.

```javascript
// atoms.tsx
export const toDoSelector = selector({
	key: "toDoSelector",
	get: ({ get }) => {
		const category = get(categoryState);
		const toDos = get(toDoState);
		return toDos.filter((toDo) => toDo.category === category);
	},
});
```

이제 ToDoList.tsx에서 카테고리를 바꾸는 기능과 현재 카테고리의 내용을 출력하도록 만든다.
select를 만들어서 option으로 카테고리를 만든다.
그리고 select의 값이 변경되면 카테고리를 변경시킨다.

```javascript
// ToDoList.tsx
import { categoryState } from "../atoms";
...
function ToDoList() {
	...
	const [category, setCategory] = useRecoilState(categoryState);
	const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setCategory(event.currentTarget.value);
	};
	return (
		<div>
			<h1>ToDoList</h1>
			<hr />
			<select value={category} onChange={onChange}>
				<option value="ToDo">ToDo</option>
				<option value="Doing">Doing</option>
				<option value="Done">Done</option>
			</select>
			...
		</div>
	);
}
```

이제 보여지는 내용을 바꿔야 하는데, 이는 toDoSelector의 내용을 보여주면 된다.

```javascript
// ToDoList.tsx
import { toDoSelector, categoryState } from "../atoms";
...

function ToDoList() {
	const toDos = useRecoilValue(toDoSelector);
	...
	return (
		<div>
			...
			<ul>
				{toDos.map((toDo) => (
					<ToDo key={toDo.id} {...toDo} />
				))}
			</ul>
		</div>
	);
}
```

현재 ToDo를 만들면 카테고리가 항상 "ToDo"가 된다.
물론 ToDoList이므로 항상 ToDo로 만들어지는 것은 아무런 문제가 없다.
그렇지만 다른 것을 만들 경우, 예를 들어 종류별로 분류해야 하는 경우도 있을 수 있다.
또한 현재 페이지의 카테고리를 따라 만들어지지 않으므로 직관적이지 않다.
그러므로 category 값에 따라 만들어지도록 코드를 조금 수정해준다.
CreateToDo.tsx에서 category를 받아온 다음 생성될 ToDo의 카테고리 값으로 만들어준다.

```javascript
import { useSetRecoilState, useRecoilValue} from "recoil";
...
function CreateToDo() {
	...
	const category = useRecoilValue(categoryState);
	...
	const onValid = ({ toDo }: IForm) => {
		setToDos((prev) => [
			...prev,
			{ text: toDo, id: Date.now(), category },
		]);
		setValue("toDo", "");
	};
	...
}
```

이렇게하면 에러가 생긴다.
이는 category의 타입 때문에 생기는 문제다.
category의 타입이 string인 반면 setToDos에서 요구하는 타입은 "ToDo" | "Doing" | "Done"다.
그러므로 atoms.tsx에서 categoryState의 타입을 변경해줘야 한다.

```javascript
// atoms.tsx
export const categoryState =
	(atom < "ToDo") |
	"Doing" |
	("Done" >
		{
			key: "category",
			default: "ToDo",
		});
```

그리고 ToDoList.tsx의 event.currentTarget.value의 타입도 변경해줘야 한다.
as를 사용해서 타입을 "ToDo" | "Doing" | "Done"로 여기도록 만든다.

```javascript
// ToDoList.tsx
function ToDoList() {
	...
	const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setCategory(event.currentTarget.value as "ToDo" | "Doing" | "Done");
	};
	...
}
```

이렇게하면 모든게 해결된다.
하지만 atoms의 타입을 지정하는 것이 계속 문제가 되고 있다.
프로젝트가 간단해서 문제가 없지만, 복잡하면 오타의 위험이 있다.
"ToDo" | "Doing" | "Done"를 타입으로 지정해서 해결할 수 있다.
그렇지만 enum을 소개하기 위해 enum을 사용해서 해결하겠다.

[enum](https://www.typescriptlang.org/ko/docs/handbook/enums.html)은 타입스크립트에서 쓸 수 있는 기능이다.
enumerable는 열거할 수 있다는 의미로, 뜻 그대로 무엇인가를 열거하는데 사용한다.
enum은 아래처럼 선언할 수 있다.

```javascript
enum Category {
	ToDo,
	Doing,
	Done,
}
```

이제 Category를 불러와서 Category.ToDo, Category.Doing, Category.Done처럼 사용할 수 있다.
이때 자동완선 기능을 쓸 수 있으므로 안전하게 사용할 수 있다.
이를 가지고 카테고리를 지정하는 것을 대체할 수 있다.
그런데 enum으로 카테고리를 대체해보면 값이 ToDo, Doing, Done이 아니라 1, 2, 3으로 나온다.
이는 enum이라 이름 붙은 이유로 항목을 숫자로 열거한다.
카테고리가 1, 2, 3으로 변경되더라도 분류하는데만 사용하기 때문에 아무런 문제가 없다.
하지만 문자열로 바꾸고 싶을 수도 있는데, 다행히도 문자열로 enum을 만들 수 있다.

```javascript
enum Category {
	ToDo = "ToDo",
	Doing = "Doing",
	Done = "Done",
}
```

위와 같이 입력하고 다시 카테고리를 확인하면 문자열로 바뀐 것을 볼 수 있다.
이제 enum을 사용해서 카테고리를 바꿔보자.
atoms.tsx에서 아래처럼 enum을 만들고, 각 카테고리를 수정한다.

```javascript
// atoms.tsx
export enum Category {
	ToDo = "ToDo",
	Doing = "Doing",
	Done = "Done",
}

export interface IToDos {
	text: string;
	id: number;
	category: Category;
}

export const categoryState = atom<Category>({
	key: "category",
	default: Category.ToDo,
});
```

그리고 각 파일에서 카테고리의 값을 Category를 사용해서 바꿔준다.

```javascript
// ToDoList.tsx
import { toDoSelector, categoryState, Category } from "../atoms";

function ToDoList() {
	...
	return (
		<div>
			...
			<select value={category} onChange={onChange}>
				<option value={Category.ToDo}>ToDo</option>
				<option value={Category.Doing}>Doing</option>
				<option value={Category.Done}>Done</option>
			</select>
			...
		</div>
	);
}
```

ToDo.tsx를 수정할 때 타입에 문제가 있어서 textConten as any로 타입을 바꿔줬다.
그리고 각 버튼의 text를 사용해서 카테고리를 만들고 있었는데, Category의 값으로 바꾸기 위해 name을 사용했다.

```javascript
// ToDo.tsx
function ToDo({ text, id, category }: IToDos) {
	...
	const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		const {
			currentTarget: { name },
		} = event;
		setToDos((toDos) => {
			...
			newToDos[toDoIndex] = {
				...
				category: name as any,
			};
			return newToDos;
		});
	};
	return (
		<li>
			<span>{text}</span>
			{category !== Category.ToDo && (
				<button name={Category.ToDo} onClick={onClick}>
					ToDo
				</button>
			)}
			{category !== Category.Doing && (
				<button name={Category.Doing} onClick={onClick}>
					Doing
				</button>
			)}
			{category !== Category.Done && (
				<button name={Category.Done} onClick={onClick}>
					Done
				</button>
			)}
		</li>
	);
}
```
