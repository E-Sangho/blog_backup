---
layout: post
title: Animation
date: Wed Apr 20 16:17:36 JST 2022
categories:
tag:
toc: true
---

# Animation

이 장에선 Animation을 쓰기 위해 [Framer Motion](https://www.framer.com/motion/)을 배운다.
Framer Motion은 리액트에서 Animation을 쉽게 쓸 수 있게 해주는 라이브러리다.
위 링크로 사이트에 들어가보면 어떤 효과를 쓸 수 있는지 보여준다.
Framer Motion을 어떻게 사용하는지는 이후에 설명하고, 일단은 실습용 파일을 만들겠다.
create-react-app으로 타입스크립트용 프로젝트를 하나 만든다.
그리고 index.tsx, App,tsx 파일을 제외하곤 모두 지워준다.
설치한 패키지는 "styled-components", "recoil"고 각각 타입스크립트도 같이 설치했다.

Theme을 사용할 예정이므로 styled.d.ts에는 Theme interface를 만든다.
그리고 theme.ts에 darkTheme으로 interface를 적용해서 틀만 만들어둔다.

```
// styled.d.ts
import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {}
}
```

```
// theme.ts
import { DefaultTheme } from "styled-components";

export const darkTheme: DefaultTheme = {};
```

이제 index.tsx 파일을 만들어야 한다.
css를 초기화하기 위해 createGlobalStyle로 resetCss를 적용시킨다.
그리고 ThemeProvider에 darkTheme을 속성으로 전달하고, RecoilRoot를 사용해 아래처럼 만든다.

```
// index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { darkTheme } from "./theme";
import { RecoilRoot } from "recoil";

const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
a {
  text-decoration: none;
  color: inherit;
}
`;
const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<RecoilRoot>
			<ThemeProvider theme={darkTheme}>
				<GlobalStyle />
				<App />
			</ThemeProvider>
		</RecoilRoot>
	</React.StrictMode>
);
```

마지막으로 App.tsx에 아래처럼 박스를 하나 만들어준다.
Wrapper에 배경으로 linear-gradient를 적용해주었다.

```
// App.tsx
import styled from "styled-components";

const Wrapper = styled.div`
	height: 100vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
	background: linear-gradient(135deg, #e09, #d0e);
`;

const Box = styled.div`
	width: 200px;
	height: 200px;
	background-color: white;
	border-radius: 10px;
	box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

function App() {
	return (
		<Wrapper>
			<Box />
		</Wrapper>
	);
}

export default App;
```

기본적인 준비는 완료했으므로 Framer Motion을 설명하겠다.

## Framer Motion

### start

Framer Motion을 `npm i framer-motion`로 설치해준다.
Framer Motion을 설치하면 motion을 사용할 수 있다.
motion은 특정 태그의 컴포넌트를 만드는데 사용한다.
이를 motion component라고 한다.
예를 들어서 \<div>의 motion component는 \<motion.div>다.
Framer Motion은 일반 컴포넌트에 애니메이션 효과를 주는 라이브러리가 아니다.
대신에 motion component에 애니메이션 효과를 주도록 만들어졌다.
그러므로 일반 HTML 태그를 사용하면 애니메이션 효과가 나타나지 않는다.
motion component는 애니메이션 효과가 추가된다는 점을 제외하고는, 일반 HTML 태그와 동일하다.
그러므로 motion component를 사용해서 문제가 생길 일은 없다.

그런데 styled component를 motion component로 만들려면 어떻게 해야 할까?
예를 들어서 \<Button> 컴포넌트가 있다면, \<motion.Button>로 하면 된다고 생각할 것이다.
하지만 이렇게 하면 작동하지 않는다.
왜냐하면 Framer Motion은 HTML 태그로 만들어지도록 정해져 있기 때문이다.
대신에 \<Button>이 선언될 때 motion을 사용하면 된다.

```
const Button = styled(motion.button)``;
```

### animate

이제 본격적으로 motion component에 애니메이션 효과를 주겠다.
우선 Box를 motion component로 만든다.

```
// App.tsx
import { motion } from "framer-motion";

const Box = styled(motion.div)`
    ...
`;
```

motion component의 속성에 animate를 사용할 수 있다.
animate에는 css 스타일을 줄 수 있는데, 처음 Box에서 해당 스타일이 적용되는 애니메이션이 나온다.
우리는 타입스크립트를 사용하고 있으므로, 스타일을 적을때 항목이 표시된다.
이 항목중에서 바꾸고 싶은 내용을 정해주면 된다.
예를 들어서 아래처럼 하면 네모에서 원이 되는 애니메이션이 된다.

```
// App.tsx
function App() {
	return (
		<Wrapper>
			<Box animate={{ borderRadius: "50%" }} />
		</Wrapper>
	);
}
```

### transition

transiiton이라는 속성도 있는데, 애니메이션이 어떻게 일어날지를 정한다.
예를 들어서 delay를 사용하면 애니메이션 지연이 일어나고, duration을 사용하면 몇 초 동안 일어날지 정할 수 있다.

```
// App.tsx
function App() {
	return (
		<Wrapper>
			<Box
				transition={{ delay: 1, duration: 2 }}
				animate={{ borderRadius: "50%" }}
			/>
		</Wrapper>
	);
}
```

그 외에도 transition에는 type, stiffness, damping 같은 것이 있다.
transition은 일종의 애니메이션 물리 엔진을 조절하는 속성이다.
어떤 물리엔진이 적용될지는 type으로 정할 수 있다.
예를 들어서 type: "spring"을 적용하면 애니메이션이 끝날때 튕기는 효과가 있다.
효과가 잘 보이도록 animate로 회전을 넣어서 확인해보자.

```
// App.tsx
function App() {
	return (
		<Wrapper>
			<Box
				transition={{ duration: 1, type: "spring" }}
				animate={{ scale: 2, rotateZ: 360 }}
			/>
		</Wrapper>
	);
}
```

애니메이션을 보면 스프링처럼 튕긴다.
type에 따라서 다른 효과가 나타난다.
예를 들어서 tween을 사용하면 변경이 선형으로 일어나서, 스프링처럼 튕기는 표과가 없어진다.

그 외에 stiffness는 단단함, damping은 팅기는 정도, mass는 사물의 무게를 정한다.
앞서 transition이 물리 엔진 같은 것을 조절하는 속성이라 한 것이 이 때문이다.
말 그대로 stiffness, damping, mass를 조절하면 물리 엔진이 변한 효과가 나온다.

```
// App.tsx
function App() {
	return (
		<Wrapper>
			<Box
				transition={{
					duration: 1,
					type: "spring",
					stiffness: 30,
					mass: 4,
					damping: 9,
				}}
				animate={{ scale: 2, rotateZ: 360 }}
			/>
		</Wrapper>
	);
}
```

transition의 타입에 따라서 사용할 수 있는 속성이 다르다.
예를 들어서 위의 stiffness, damping, mass는 spring에서 쓸 수 있는 스타일이다.

### initial

다음으로 initial이라는 속성이 있다.
initial은 처음에 적용될 스타일을 만든다.
initial로 스타일을 시작해서 animate가 시작되므로, 초기값을 적는데 사용한다.
예를 들어서 scale: 0 를 사용하면 처음엔 없다가 나중에 나오는 애니메이션을 쓸 수 있다.

```
function App() {
	return (
		<Wrapper>
			<Box
				initial={{ scale: 0 }}
				transition={{ duration: 1 }}
				animate={{ scale: 1, rotateZ: 360 }}
			/>
		</Wrapper>
	);
}
```

### variants

애니메이션을 작성하는 법은 개략적으로 알았다.
그런데 위와 같은 방식은 코드가 길어지면 가독성이 떨어진다.
variants를 사용해서 코드를 깔끔하게 정리할 수 있다.
variants는 이름 그대로 애니메이션을 변수로 선언하는 것이다.
motion conponent에서 variants 속성을 쓸 수 있다.
이때 variants에 선언한 variants의 이름을 넣어준다.
그리고 variants 안에서 선언한 애니메이션을 animate나 initial에 적용할 수 있다.
아래는 myVars라는 이름으로 variants를 선언한 것이다.

```
// App.tsx
const myVars = {
	anyName: {
		rotate: 360,
	},
};
```

보다시피 myVars는 단순한 객체에 불과하다.
이를 motion component의 variants로 사용하면, 라이브러리가 알아서 객체를 해석해준다.
그리고 animate나 initial에서 myVars 내부의 객체를 사용할 수 있게 된다.
아래는 위의 anyName을 animate에 적용시킨 것이다.

```
// App.tsx
function App() {
	return (
		<Wrapper>
			<Box variants={myVars} animate="anyName" />
		</Wrapper>
	);
}
```

variants는 여러 애니메이션을 선언할 수 있다.
예를 들어서 start, end 두 애니메이션을 선언한 다음, 각각 initial, animate에 적용할 수 있다.

```
// App.tsx
const myVars = {
	start: {
		scale: 0,
	},
	end: {
		scale: 1,
	},
};

function App() {
	return (
		<Wrapper>
			<Box variants={myVars} initial="start" animate="end" />
		</Wrapper>
	);
}
```

이때 transition도 함께 써야하는데, transition은 end 내부에 함께 써주면 된다.
그러면 자동으로 transition이 적용된다.

```
// App.tsx
const myVars = {
	start: {
		scale: 0,
	},
	end: {
		scale: 1,
		transition: {
			type: "tween",
		},
	},
};

function App() {
	return (
		<Wrapper>
			<Box variants={myVars} initial="start" animate="end" />
		</Wrapper>
	);
}
```

variant의 또 다른 장점은 자식 컴포넌트에게 애니메이션 이름이 전달된다는 것이다.
무슨 의미인지 알기 위해서 아래처럼 예시를 만들었다.

```
// App.tsx
const Box = styled(motion.div)`
	width: 200px;
	height: 200px;
	background-color: white;
	border-radius: 10px;
	box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	align-items: center;
	justify-items: center;
`;

const Circle = styled(motion.div)`
	border-radius: 50%;
	width: 50px;
	height: 50px;
	background-color: black;
`;

function App() {
	return (
		<Wrapper>
			<Box variants={myVars} initial="start" animate="end">
				<Circle />
				<Circle />
				<Circle />
				<Circle />
			</Box>
		</Wrapper>
	);
}
```

위 예시는 네모 안에 4개의 원을 넣어 주사위처럼 만든 것이다.
이때 원에서 애니메이션을 적용하려고 한다.
그러면 새로운 variants를 만들어서 전달해줘야 한다.
이때 새 variants를 아래처럼 선언하고 Circle에 사용했다.

```
// App.tsx
const newVars = {
	start: {
		opacity: 0,
	},
	end: {
		opacity: 1,
		transition: {
			type: "tween",
		},
	},
};

function App() {
	return (
		<Wrapper>
			<Box variants={myVars} initial="start" animate="end">
				<Circle variants={newVars} />
				<Circle variants={newVars} />
				<Circle variants={newVars} />
				<Circle variants={newVars} />
			</Box>
		</Wrapper>
	);
}
```

그런데 Circle에 initial이나 animation을 주지 않았는데도, 애니메이션 효과가 일어난다.
이는 variants의 특성 때문이다.
variants는 부모의 initial, animate를 받아온다.
그러므로 위에서 initial, animate를 적어주지 않았지만 `<Circle variants={newVars} initial="start" animate="end"/>`라고 적어준 것과 동일한 효과가 나타난다.
이때 중요한 것은 initial, animate에 할당되는 이름이 부모의 것과 동일하다는 점이다.
그래서 newVars를 만들 때, start와 end로 동일한 이름을 사용했다.

장황하게 쓰긴했지만 결론은 variants가 변수라는 것이다.
애니메이션을 variants로 선언해서, 각 키워드만으로 애니메이션을 설정하게 해준다.
이 덕에 애니메이션이 길어지더라도 가독성이 좋고, 재사용하기도 편하다.
또한 부모 variants의 이름이 자식에서도 유지되어서 일괄적으로 애니메이션을 적용하기 좋다.

### orchestrate animation using variants and staggerChildren

variants의 또 다른 장점은 애니메이션을 순서대로 일어나도록 할 수 있다는 것이다.
이때 사용하는 것이 staggerChildren이다.
stagger는 엇갈린다는 뜻으로, 레이더에서 점이 번갈아가면서 나타날 때 쓰는 단어다.
transition 내부에 staggerChildren을 쓸 수 있는데, 지정한 시간만큼의 차이를 두고 애니메이션이 발생한다.
이때 staggerChildren은 부모 컴포넌트에 적어줘야 한다.
아래는 0.5초 간격으로 애니메이션이 일어나도록 만들었다.

```
// App.tsx
const myVars = {
	start: {},
	end: {
		transition: {
			type: "tween",
			staggerChildren: 0.5,
		},
	},
};
```

애니메이션 효과를 보면 0.5초 간격으로 순서대로 일어나는 것을 볼 수 있다.
조금 더 명확하게 보려면 newVars에서 위치를 옮기는 형태로 바꿔서 보자.

```
// App.tsx
const newVars = {
	start: {
		opacity: 0,
		y: 20,
	},
	end: {
		opacity: 1,
		y: 0,
		transition: {
			type: "tween",
		},
	},
};
```
