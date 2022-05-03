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

## Gestures

지금까지 소개한 애니메이션은 알아서 일어났다.
이번에는 사용자 마우스 조작시에 애니메이션 효과를 주는 법을 알아보겠다.

마우스를 올렸을 경우엔 whileHover를 사용하면 된다.
그리고 클릭했을 경우엔 whileTap을 쓴다.
아래는 마우스를 올리면 크기가 커지고, 모양이 변경되는 애니메이션이다.

```
// App.tsx
const myVars = {
	hover: {
		scale: 2,
	},
	tap: {
		borderRadius: "50%",
	},
};

function App() {
	return (
		<Wrapper>
			<Box variants={myVars} whileHover="hover" whileTap="tap" />
		</Wrapper>
	);
}
```

다음으로 드래그 효과를 줘보겠다.
드래그 효과를 사용하려면 속성으로 drag를 적어줘야 한다.
그리고 whileDrag에 애니메이션을 적어준다.

```
// App.tsx
const myVars = {
	drag: {
		backgroundColor: "blue",
	},
};

function App() {
	return (
		<Wrapper>
			<Box drag variants={myVars} whileDrag="drag" />
		</Wrapper>
	);
}
```

그런데 드래그를 해보면 몇 가지 문제점이 있다.
색 변화에 애니메이션이 적용되지 않고, 드래그 범위 제한이 없고, 드래그에 탄성이 있다.
우선은 색 변화 문제를 해결해보자.
이 문제를 해결하려면 색을 rgba로 주면 된다.
애니메이션 효과는 사이 단계를 필요로 한다.
예를 들어서 흰색에서 검은색으로 변화시키려면 (255, 255, 255)에서 (0, 0, 0)으로 바꿔줘야 한다.
이 사이 단계에서 (10, 10, 10), (30, 30, 30) 같은 단계를 거칠 것이다.
그런데 색을 단순히 "blue"라고 적어주면 사이 단계를 알 수가 없다다
그래서 위 예시에서 애니메이션 효과가 나타나지 않은 것이다.
색을 rgba로 주면 이 문제는 간단히 해결된다.

```
// App.tsx
const myVars = {
	drag: {
		backgroundColor: "rgba(0, 0, 255, 0.5)",
	},
};
```

다음으로 드래그 범위를 제한해보자.
x축이나 y축으로 제한하고 싶으면 drag에 x나 y를 주면 된다.
아래는 x축 방향으로만 드래그를 제한한 것이다.

```
// App.tsx
function App() {
	return (
		<Wrapper>
			<Box drag="x" variants={myVars} whileDrag="drag" />
		</Wrapper>
	);
}
```

특정한 박스 내에서만 드래그가 가능하도록 만들고 싶으면 dragConstraints를 사용한다.
dragConstraints는 ref로 지정한 대상 내에서만 드래그가 일어나게 만든다.
이때 부모 컴포넌트를 ref로 지정해야 한다.
예시를 위해 드래그 범위 컴포넌트를 하나 만들고 ref를 사용했다.

```
// App.tsx
import { useRef } from "react";

const DragArea = styled.div`
	width: 400px;
	height: 400px;
	background-color: rgba(255, 255, 255, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
`;

function App() {
	const dragAreaRef = useRef<HTMLDivElement>(null);
	return (
		<Wrapper>
			<DragArea ref={dragAreaRef}>
				<Box
					drag
					variants={myVars}
					whileDrag="drag"
					dragConstraints={dragAreaRef}
				/>
			</DragArea>
		</Wrapper>
	);
}
```

드래그를 해보면 \<DragArea> 내부에서 드래그가 일어난다.
그런데 드래그 범위 밖으로도 살짝 드래그 할 수 있다.
범위 밖에서는 탄성 같은 효과가 생기고 손을 놓으면 \<DragArea> 내로 돌아간다.
이처럼 약간 밖으로 드래그 되는 것을 허용은 하되 보여주고 싶지 않으면 overflow: hidden을 사용하면 된다.

```
// App.tsx
const DragArea = styled.div`
	width: 400px;
	height: 400px;
	background-color: rgba(255, 255, 255, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
`;
```

만약 범위 밖으로 나가는 것을 허용하지 않으려면 dragElastic을 조절하면 된다.
dragElastic은 0 ~ 1 사이의 값을 사용한다.
0은 전혀 탄성이 없고, 1은 완전히 탄성적이다.
이때 탄성이 있다는 의미는 스프링을 생각하면 된다.
스프링이 탄성이 전혀 없으면 밧줄처럼 전혀 늘어나지 않는다.
그래서 dranConstraints 밖으로 나갈 수가 없다.
탄성이 클 수록 범위를 약간씩 벗어날 수 있다.
만약 탄성이 1이라면 스프링이 굉장히 탄력적이라서 어디든지 늘어난다.
아래의 dragElastic을 조금씩 바꿔가며 사용해보자.
이때 overflow: hidden 없이 확인해야 보기 좋다.

```
// App.tsx
const DragArea = styled.div`
	width: 400px;
	height: 400px;
	background-color: rgba(255, 255, 255, 0.4);
	display: flex;
	align-items: center;
	justify-content: center;
`;

function App() {
	const dragAreaRef = useRef<HTMLDivElement>(null);
	return (
		<Wrapper>
			<DragArea ref={dragAreaRef}>
				<Box
					drag
					variants={myVars}
					whileDrag="drag"
					dragConstraints={dragAreaRef}
					dragElastic={1}
				/>
			</DragArea>
		</Wrapper>
	);
}
```

마지막으로 드래그가 끝났을 때 원래 위치로 돌아가도록 해보겠다.
dragSnapToOrigin 속성을 주면 드래그가 끝났을 때 원래 위치로 돌아간다.

```
// App.tsx
function App() {
	const dragAreaRef = useRef<HTMLDivElement>(null);
	return (
		<Wrapper>
			<DragArea ref={dragAreaRef}>
				<Box
					drag
					variants={myVars}
					whileDrag="drag"
					dragConstraints={dragAreaRef}
					dragElastic={1}
					dragSnapToOrigin
				/>
			</DragArea>
		</Wrapper>
	);
}
```

## Motion Value

### useMotionValue

Motion Value는 애니메이션에서 변하는 값을 추적하는데 사용된다.
예를 들어서 사용자가 x축으로 드래그한 길이를 알아내거나, 얼마나 스크롤을 내렸는지 등을 알아낼 수 있다.
Motion Value는 useMotionValue hook로 만들 수 있다.
그리고 그 값을 set으로 변경시키고, get으로 불러올 수 있다.

```
const x = useMotionValue(0)
x.set(100)
x.get()	// 100
```

Motion Value는 motion component에서 쓸 수 있다.
style에서 쓸 수 있으며 motion component의 값을 정하는데 사용한다.
아래는 x의 처음 위치를 100으로 만든다.

```
// App.tsx
function App() {
	const xValue = useMotionValue(100);
	return (
		<Wrapper>
			<Box style={{ x: xValue }} />
		</Wrapper>
	);
}
```

Motion Value의 장점은 Motion Value를 바꿔서 motion component를 조절할 수 있다는 점이다.
위의 예에서 xValue의 값을 바꿔주면 x의 값이 변화된다.

```
// App.tsx
function App() {
	const xValue = useMotionValue(0);
	return (
		<Wrapper>
			<button onClick={() => xValue.set(100)}>click me</button>
			<Box style={{ x: xValue }} />
		</Wrapper>
	);
}
```

x의 값이 변하면 자동으로 xValue의 값도 변한다.
이를 console.log(xValue)로 출력해보자.

```
// App.tsx
function App() {
	const xValue = useMotionValue(0);
	console.log(xValue);
	return (
		<Wrapper>
			<Box drag="x" style={{ x: xValue }} />
		</Wrapper>
	);
}
```

그런데 드래그가 일어나도 Motion Value의 값이 출력되지 않는다.
이는 Motion Value의 값의 변화가 React의 랜더링을 일으키지 않기 때문이다.
다시 말해서 Motion Value가 바뀔 때마다 다시 랜더링하는 비효율적인 일을 하지 않는다.

덕분에 별다른 최적화 없이도 사용할 수 있지만, 우리는 xValue의 값을 출력하고 싶다.
Motion Value에는 onChange method가 있다.
onChange는 Motion Value가 바뀔 때 일어날 이벤트를 지정할 수 있다.
이때 useEffect 안에서 사용해야 한다는 제약이 있다.
아래처럼 코드를 작성하면 콘솔에서 xValue의 값의 변화를 볼 수 있다.

```
// App.tsx
function App() {
	const xValue = useMotionValue(0);
	useEffect(() => {
		xValue.onChange(() => console.log(xValue.get()));
	}, [xValue]);
	return (
		<Wrapper>
			<Box drag="x" style={{ x: xValue }} />
		</Wrapper>
	);
}
```

### useTransform

Motion Value의 값의 변화에 따라서 motion component를 변화시키려 한다.
이때 사용하는 것이 useTransform이다.

> useTransform(value, inputRange, outputRange, options)

useTransform은 Motion Value를 받아서 새로운 Motion Value를 만드는 함수다.
useTransform은 변화시킬 값과 범위를 받는다.
예를 들어서 `useTransform(xValue, [-400, 400], [1, 2])`는 xValue의 값에 따라서 1 ~ 2 사이의 값을 반환한다.
만약 xValue가 -400이면 1이 되고, 400이면 2가 된다.
이때 범위는`useTransform(xValue, [-400, 0, 400], [1, 1.6, 2])`처럼 더 세세하게 바꿀 수 있다.

useTransform이 반환한 값은 Motion Value이므로 motion component의 값을 바꾸는데 사용한다.
아래는 xValue의 변경된 값을 받아서 scale을 조절한 것이다.

```
// App.tsx
function App() {
	const xValue = useMotionValue(0);
	useEffect(() => {
		xValue.onChange(() => console.log(xValue.get()));
	}, [xValue]);
	const scaleValue = useTransform(xValue, [-400, 400], [0.2, 2]);
	return (
		<Wrapper>
			<Box drag="x" style={{ x: xValue, scale: scaleValue }} />
		</Wrapper>
	);
}
```

지금까지는 설명을 위해 xValue, scaleValue로 적었지만, ES6 환경에서 이름이 같으면 변수가 알아서 받아진다.
그러므로 xValue를 x로 바꾸고, scaleValue를 scale로 바꿔서 아래처럼 쓴다.

```
// App.tsx
function App() {
	const x = useMotionValue(0);
	useEffect(() => {
		x.onChange(() => console.log(x.get()));
	}, [x]);
	const scale = useTransform(x, [-400, 400], [0.2, 2]);
	return (
		<Wrapper>
			<Box drag="x" style={{ x, scale }} />
		</Wrapper>
	);
}
```

useTransform을 사용하면 자기 자신 외에 다른 motion component도 애니메이션을 만들 수 있다.
\<Wrapper>를 motion component로 만들고 아래처럼 작성하면 드래그하면서 색이 바뀌게 된다.

```
// App.tsx
const Wrapper = styled(motion.div)`
	...
`;

function App() {
	...
	const gradient = useTransform(
		x,
		[-400, 400],
		[
			"linear-gradient(135deg, rgb(0, 210, 238), rgb(0, 83, 238))",
			"linear-gradient(135deg, rgb(0, 238, 155), rgb(238, 178, 0))",
		]
	);
	return (
		<Wrapper style={{ background: gradient }}>
			...
		</Wrapper>
	);
}

export default App;

```

### useViewportScroll

useViewportScroll은 현재 스크롤 위치를 나타내는 4개의 MotionValue를 반환한다.

-   scrollX
-   scrollY
-   scrollXProgress
-   scrollYProgress

대표로 Y 스크롤만 설명하겠다.
scrollY, scrollYProgress는 현재 스크롤의 위치다.
scrollY는 픽셀 단위의 스크롤을 의미한다.
그러므로 값이 242px, 1565px 같은 숫자 단위로 나온다.
반면 scrollYProgess는 0 ~ 1 사이의 값으로 0.122384 같은 퍼센트 단위로 나온다.

useViewportScroll을 useTransform과 같이 조합하면 스크롤 시에 애니메이션을 적용할 수 있다.
아래는 스크롤하면 scale이 커지게 만든 코드다.
이때 스크롤을 해야 하므로 \<Wrapper>의 height를 조절해줬다.

```
// App.tsx
const Wrapper = styled(motion.div)`
	height: 500vh;
	...
`;

function App() {
	const x = useMotionValue(0);
	const { scrollYProgress } = useViewportScroll();
	const scale = useTransform(scrollYProgress, [0, 1], [0.1, 4]);
	...
	return (
		<Wrapper style={{ background: gradient }}>
			<Box drag="x" style={{ x, scale }} />
		</Wrapper>
	);
}
```

### svg

SVG는 수학 연산으로 이미지를 그린다.
사이트 중에선 SVG에 애니메이션을 준 경우가 있다.
본래 SVG는 그리는 과정이 보이지 않는데, 그리는 과정을 보여주고 점차 색을 칠하는 애니메이션이 있다.
이번에는 Framer Motion로 SVG 애니메이션을 만드는 법을 알아보겠다.

우선 SVG가 필요하다.
SVG가 있는 사이트에서 가져올 수 있는데, fontawesome에서 가져오겠다.
fontawesome에서 airbnb를 검색하고 열어준다.
그러면 </> 모양의 버튼이 있는데, 이 버튼을 누르면 SVG가 복사된다.
간단하게 아래 태그를 복사해서 써도 된다.

```
// App.tsx
function App() {
	return (
		<Wrapper>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
				<path d="M224 373.12c-25.24-31.67-40.08-59.43-45-83.18-22.55-88 112.61-88 90.06 0-5.45 24.25-20.29 52-45 83.18zm138.15 73.23c-42.06 18.31-83.67-10.88-119.3-50.47 103.9-130.07 46.11-200-18.85-200-54.92 0-85.16 46.51-73.28 100.5 6.93 29.19 25.23 62.39 54.43 99.5-32.53 36.05-60.55 52.69-85.15 54.92-50 7.43-89.11-41.06-71.3-91.09 15.1-39.16 111.72-231.18 115.87-241.56 15.75-30.07 25.56-57.4 59.38-57.4 32.34 0 43.4 25.94 60.37 59.87 36 70.62 89.35 177.48 114.84 239.09 13.17 33.07-1.37 71.29-37.01 86.64zm47-136.12C280.27 35.93 273.13 32 224 32c-45.52 0-64.87 31.67-84.66 72.79C33.18 317.1 22.89 347.19 22 349.81-3.22 419.14 48.74 480 111.63 480c21.71 0 60.61-6.06 112.37-62.4 58.68 63.78 101.26 62.4 112.37 62.4 62.89.05 114.85-60.86 89.61-130.19.02-3.89-16.82-38.9-16.82-39.58z" />
			</svg>
		</Wrapper>
	);
}
```

현재 SVG가 너무 크므로 styled component를 만들어서 크기를 조절해준다.

```
// App.tsx
const Svg = styled.svg`
	width: 300px;
	height: 300px;
`;

function App() {
	return (
		<Wrapper>
			<Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
				<path d="M224 373.12c-25.24-31.67-40.08-59.43-45-83.18-22.55-88 112.61-88 90.06 0-5.45 24.25-20.29 52-45 83.18zm138.15 73.23c-42.06 18.31-83.67-10.88-119.3-50.47 103.9-130.07 46.11-200-18.85-200-54.92 0-85.16 46.51-73.28 100.5 6.93 29.19 25.23 62.39 54.43 99.5-32.53 36.05-60.55 52.69-85.15 54.92-50 7.43-89.11-41.06-71.3-91.09 15.1-39.16 111.72-231.18 115.87-241.56 15.75-30.07 25.56-57.4 59.38-57.4 32.34 0 43.4 25.94 60.37 59.87 36 70.62 89.35 177.48 114.84 239.09 13.17 33.07-1.37 71.29-37.01 86.64zm47-136.12C280.27 35.93 273.13 32 224 32c-45.52 0-64.87 31.67-84.66 72.79C33.18 317.1 22.89 347.19 22 349.81-3.22 419.14 48.74 480 111.63 480c21.71 0 60.61-6.06 112.37-62.4 58.68 63.78 101.26 62.4 112.37 62.4 62.89.05 114.85-60.86 89.61-130.19.02-3.89-16.82-38.9-16.82-39.58z" />
			</Svg>
		</Wrapper>
	);
}
```

SVG는 항상 내부에 path가 존재하고 path로 이미지를 만든다.
이때 벡터로 외곽선만 만들게 되는데, 외곽선을 이용해 내부와 외부를 구분한다.
SVG는 외곽선의 스타일과, 내부의 스타일을 따로 적용한다.
내부의 색은 fill을 사용해서 바꿀 수 있다.
예를 들어 fill="red"라고 적어주면 붉은 색으로 바뀌고, 현재 색을 쓰고 싶으므로 fill="currentColor"를 사용한다.
외곽선의 색을 바꾸고 싶으면 stroke 속성을 사용하면 된다.
그리고 stroke의 굵기를 strokeWidth로 조절할 수 있다.
우선은 fill을 transparent로 바꾸고 stroke와 strokeWidth를 조절해보자.

```
// App.tsx
function App() {
	return (
		<Wrapper>
			<Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
				<path
					fill="transparent"
					stroke="white"
					strokeWidth="4"
					...
				/>
			</Svg>
		</Wrapper>
	);
}
```

SVG에서 애니메이션 효과를 보여주려면 path를 motion component로 바꿔야 한다.
그리고 애니메이션으로 무색에서 흰색으로 바뀌도록 만든다.

```
// App.tsx
function App() {
	return (
		<Wrapper>
			<Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
				<motion.path
					initial={{ fill: "rgba(255, 255, 255, 0)" }}
					animate={{ fill: "rgba(255, 255, 255, 1)" }}
					transition={{
						duration: 3,
					}}
					stroke="white"
					strokeWidth="4"
					...
				/>
			</Svg>
		</Wrapper>
	);
}
```

다음으로 할 일은 pathLength를 바꾸는 일이다.
pathLength는 SVG가 그려지는 길이를 의미한다.
이를 0에서 1까지 변하도록 만들면 그려지는 듯한 애니메이션 효과가 생긴다.
pathLength가 잘 바뀌는지 보기 위해서 위의 fill은 색을 바꾸지 않도록 만든다.

```
// App.tsx
function App() {
	return (
		<Wrapper>
			<Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
				<motion.path
					initial={{ fill: "rgba(255, 255, 255, 0)", pathLength: 0 }}
					animate={{ fill: "rgba(255, 255, 255, 0)", pathLength: 1 }}
					transition={{
						duration: 3,
					}}
					stroke="white"
					strokeWidth="4"
					...
				/>
			</Svg>
		</Wrapper>
	);
}
```

이제 위 내용을 variants와 styled component에 나눠 담으면 깔끔하게 정리된다.

```
// App.tsx
const Svg = styled.svg`
	width: 300px;
	height: 300px;
	path {
		stroke: white;
		stroke-width: 4;
	}
`;

const svgVariants = {
	start: { fill: "rgba(255, 255, 255, 0)", pathLength: 0 },
	end: {
		fill: "rgba(255, 255, 255, 0)",
		pathLength: 1,
		transition: {
			duration: 3,
		},
	},
};

function App() {
	return (
		<Wrapper>
			<Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
				<motion.path
					variants={svgVariants}
					initial="start"
					animate="end"
					...
				/>
			</Svg>
		</Wrapper>
	);
}
```

마지막으로 각 애니메이션의 duration을 조절하는 법을 알아보자.
path를 먼저 그리고 fill을 하도록 duration을 조절한다.
transition은 default로 기본값을 정한다.
그리고 transition은 각 항복별로 다른 transition을 적용할 수 있다.
이를 사용해서 default와 다른 transition을 적용할 수 있다.
아래는 fill에 따로 transition을 만든 것이다.

```
// App.tsx
const svgVariants = {
	start: { fill: "rgba(255, 255, 255, 0)", pathLength: 0 },
	end: {
		fill: "rgba(255, 255, 255, 1)",
		pathLength: 1,
	},
};

function App() {
	return (
		<Wrapper>
			<Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
				<motion.path
					variants={svgVariants}
					initial="start"
					animate="end"
					transition={{
						default: { duration: 3 },
						fill: { duration: 2, delay: 3 },
					}}
					...
				/>
			</Svg>
		</Wrapper>
	);
}
```

### AnimatePresence

AnimatePresence는 컴포넌트가 사라지고 나타날 때 애니메이션을 적용하게 해준다.
우선 state를 사용해서 버튼을 누르면 컴포넌트가 생기고 사라지도록 만들겠다.

```
// App.tsx
const Box = styled(motion.div)`
	width: 400px;
	height: 300px;
	border-radius: 16px;
	background-color: white;
`;

function App() {
	const [showing, setShowing] = useState(false);
	const onClick = () => {
		setShowing((prev) => !prev);
	};
	return (
		<Wrapper>
			{showing ? <Box /> : null}
			<button onClick={onClick}>click</button>
		</Wrapper>
	);
}
```

위의 \<Box>에 애니메이션을 주려면 AnimatePresence로 감싸줘야 한다.
\<Box>에 애니메이션 효과를 주기 전에 exit 속성을 알아보자.
지금까지 initial, animate를 사용했다.
initial은 초기 상태, animate는 애니메이션이 일어나는 상태를 적어줬다.
exit은 해당 컴포넌트가 없어질 때 적용하는 애니메이션이다.
중요한 것은 exit은 AnimatePresence 내부에서만 사용할 수 있고, 첫 번째 자식 컴포넌트야 한다.
아래처럼 애니메이션을 적용해보면 컴포넌트가 생길 때의 애니메이션과, 없어질 때의 애니메이션이 적용된다.

```
// App.tsx
const boxVariants = {
	start: {
		opacity: 0,
		scale: 0,
	},
	middle: {
		opacity: 1,
		scale: 1,
		rotateZ: 360,
	},
	end: {
		opacity: 0,
		scale: 0,
		y: 20,
	},
};

function App() {
	const [showing, setShowing] = useState(false);
	const onClick = () => {
		setShowing((prev) => !prev);
	};
	return (
		<Wrapper>
			<AnimatePresence>
				{showing ? (
					<Box
						variants={boxVariants}
						initial="start"
						animate="middle"
						exit="end"
					/>
				) : null}
			</AnimatePresence>
			<button onClick={onClick}>click</button>
		</Wrapper>
	);
}
```

### Slider

AnimatePresence를 사용해서 슬라이더를 만들 수 있다.
우선 버튼을 눌렀을 때, 왼쪽으로 넘어가는 슬라이더부터 만들어보겠다.
현재 보여줄 번호를 담을 state가 필요하고, 버튼을 누르면 state의 값을 바꿔줘야 한다.

```
// App.tsx
function App() {
	const [showIndex, setShowIndex] = useState(0);
	const onClick = () => {
		setShowIndex((prev) => (prev === 9 ? 9 : prev + 1));
	};
	return (
		<Wrapper>
			<AnimatePresence>
				<Box />
			</AnimatePresence>
			<button onClick={onClick}>Next</button>
		</Wrapper>
	);
}
```

이제 Box를 어떻게 만들지가 문제다.
일단은 [0, 1, 2, ..., 9].map()을 사용해서 showIndex와 값이 일치하는 경우만 Box가 나오도록 만든다.
이때 Box에 key를 꼭 사용해야 한다.
key를 사용하지 않으면 React가 새로 생성되는 컴포넌트인지 아닌지 판단하지 못한다.
그래서 variants의 animate나 exit이 제대로 동작하지 않는다.
추가로 Box의 스타일을 바꿔서 안의 숫자가 잘 보이게 했다.

```
// App.tsx
const Box = styled(motion.div)`
	width: 400px;
	height: 300px;
	border-radius: 16px;
	background-color: white;
	position: absolute;
	top: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 48px;
`;

function App() {
	const [showIndex, setShowIndex] = useState(0);
	const onClick = () => {
		setShowIndex((prev) => (prev === 9 ? 9 : prev + 1));
	};
	return (
		<Wrapper>
			<AnimatePresence>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) =>
					e === showIndex ? <Box key={e}>{e}</Box> : null
				)}
			</AnimatePresence>
			<button onClick={onClick}>Next</button>
		</Wrapper>
	);
}
```

마지막으로 Box에 variants를 줘서 애니메이션 효과를 주면 된다.

```
// App.tsx
const boxVariants = {
	start: {
		opacity: 0,
		scale: 0,
		x: 500,
	},
	middle: {
		opacity: 1,
		scale: 1,
		x: 0,
	},
	end: {
		opacity: 0,
		scale: 0,
		x: -500,
	},
};

function App() {
	const [showIndex, setShowIndex] = useState(0);
	const onClick = () => {
		setShowIndex((prev) => (prev === 9 ? 9 : prev + 1));
	};
	return (
		<Wrapper>
			<AnimatePresence>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) =>
					e === showIndex ? (
						<Box
							variants={boxVariants}
							initial="start"
							animate="middle"
							exit="end"
							key={e}
						>
							{e}
						</Box>
					) : null
				)}
			</AnimatePresence>
			<button onClick={onClick}>Next</button>
		</Wrapper>
	);
}
```

버튼을 눌러보면 슬라이더 기능이 정상 작동된다.
다음으로 이전 숫자로 돌아가는 슬라이더를 만들려고 한다.
버튼을 만들고 showIndex를 조절하는 것은 비슷하게 하면 된다.

```
// App.tsx
function App() {
	const [showIndex, setShowIndex] = useState(0);
	const nextIndex = () => {
		setShowIndex((prev) => (prev === 9 ? 9 : prev + 1));
	};
	const prevIndex = () => {
		setShowIndex((prev) => (prev === 0 ? 0 : prev - 1));
	};
	return (
		<Wrapper>
			<AnimatePresence>
				...
			</AnimatePresence>
			<button onClick={prevIndex}>Prev</button>
			<button onClick={nextIndex}>Next</button>
		</Wrapper>
	);
}
```

애니메이션 효과를 보면 여전히 오른쪽에서 온다.
이는 방향에 따라 애니메이션 효과가 바뀌도록 지정하지 않았기 때문이다.
그런데 방향에 따라 애니메이션이 달라진다는 것은 곧, variants에 변수가 필요하다는 의미다.
variants에 방향을 표시하는 변수를 전달하고 이 값으로 x의 값을 조절해야 방향이 바꿔야 한다.
variants에 변수를 주는 것은 custom에서 설명하겠다.

### custom

custom은 variants에 변수를 주기 위해 사용한다.
motion component에서 custom이란 속성에 변수를 전달하면, 해당 변수를 variants 내부에서 쓸 수 있다.
이때 custom에 전달하는 내용을 AnimatePresence에도 전달해줘야 한다.
아래처럼 방향을 표시하는 state isRight를 만든다.
그리고 각 버튼을 누를 때마다 isRight를 바꾸고, custom에 isRight를 전달한다.

```
// App.tsx
function App() {
	const [showIndex, setShowIndex] = useState(0);
	const [isRight, setIsRight] = useState(false);
	const nextIndex = () => {
		setIsRight(false);
		setShowIndex((prev) => (prev === 9 ? 9 : prev + 1));
	};
	const prevIndex = () => {
		setIsRight(true);
		setShowIndex((prev) => (prev === 0 ? 0 : prev - 1));
	};
	return (
		<Wrapper>
			<AnimatePresence custom={isRight}>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) =>
					e === showIndex ? (
						<Box
							custom={isRight}
							...
						>
							{e}
						</Box>
					) : null
				)}
			</AnimatePresence>
			...
		</Wrapper>
	);
}
```

이제 variants에서 custom으로 받아온 isRight를 사용해야 한다.
variants 내에서 변수를 사용하려면 각 속성을 콜백 함수로 바꿔줘야 한다.
이때 콜백 함수의 변수에 custom의 변수를 사용할 수 있다.
변수는 콜백 함수에 순서대로 전달된다.
그래서 변수의 이름은 custom에서 준 것과 달라도 상관없다.
하지만 굳이 다른 이름을 써서 혼란을 줄 필요는 없으니 통일해서 사용한다.

variants의 속성을 콜백 함수로 바꿀 때, 값이 확실히 return 되어야 한다.
그러므로 직접 return을 적어주거나 ({...}) 형태로 적어야 한다.
또한 우리는 타입스크립트를 사용하므로 전달하는 변수의 타입을 적어야 한다.
아래는 isRight를 사용해서 x의 값을 바꾸는 코드다.

```
// App.tsx
const boxVariants = {
	start: (isRight: boolean) => ({
		opacity: 0,
		scale: 0,
		x: isRight ? -500 : 500,
	}),
	middle: {
		opacity: 1,
		scale: 1,
		x: 0,
		transition: {
			duration: 2,
		},
	},
	end: (isRight: boolean) => ({
		opacity: 0,
		scale: 0,
		x: isRight ? 500 : -500,
		transition: {
			duration: 2,
		},
	}),
};
```

현재 애니메이션을 보면 animate와 exit이 동시에 일어난다.
정확히 표현하자면 animate와 exit이 별개로 일어난다.
현재 둘이 동시에 일어나는 이유는 duration, delay가 동일하기 때문이다.
이를 수정하면 서로 별개로 일어나므로 뒤죽박죽이 될 수도 있다.
만약 exit이 일어나고 animate가 일어나길 원하면 exitBeforeEnter를 사용하면 된다.
exitBeforeEnter는 AnimatePresence에서 사용하며 아래처럼 쓰면 된다.

```
// App.tsx
function App() {
	...
	return (
		<Wrapper>
			<AnimatePresence exitBeforeEnter custom={isRight}>
				...
			</AnimatePresence>
			...
		</Wrapper>
	);
}
```

마지막으로 코드를 조금 정리하겠다.
현재 우리는 map을 사용해서 슬라이더를 만들고 있다.
그런데 React는 key를 가지고 컴포넌트가 생기는지 사라지는지 확인한다.
그러므로 key값이 변하는 것만으로도 컴포넌트가 사라진다고 인식한다.
위에서 map과 null을 사용해서 컴포넌트가 사라지는 것을 표시하고 있다.
이를 단순히 key를 변경시키는 것으로 해결할 수 있으므로 아래처럼 적어준다.

```
// App.tsx
function App() {
	...
	return (
		<Wrapper>
			<AnimatePresence exitBeforeEnter custom={isRight}>
				<Box
					variants={boxVariants}
					custom={isRight}
					initial="start"
					animate="middle"
					exit="end"
					key={showIndex}
				>
					{showIndex}
				</Box>
			</AnimatePresence>
			...
		</Wrapper>
	);
}
```

### Layout Animation

어떤 대상에 자동으로 애니메이션을 주고 싶으면 layout을 사용하면 된다.
layout이 무엇인지는 알아보기 전에, 위치를 옮기는 애니메이션을 만들어보자.
아래는 버튼을 누르면 원의 위치가 옮겨지는 코드다.

```
// App.tsx
const Wrapper = styled(motion.div)`
	height: 100vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
	background: linear-gradient(135deg, #e09, #d0e);
`;

const Box = styled(motion.div)`
	width: 400px;
	height: 300px;
	border-radius: 16px;
	background-color: white;
	display: flex;
	font-size: 48px;
`;

const Circle = styled(motion.div)`
	width: 100px;
	height: 100px;
	border-radius: 50%;
	background-color: blue;
`;

function App() {
	const [clicked, setClicked] = useState(false);
	const onClick = () => {
		setClicked((prev) => !prev);
	};
	return (
		<Wrapper onClick={onClick}>
			<Box
				style={{
					justifyContent: clicked ? "flex-start" : "center",
					alignItems: clicked ? "flex-start" : "center",
				}}
			>
				<Circle />
			</Box>
		</Wrapper>
	);
}
```

clicked를 변수로 사용해서 Wrapper를 누를 때마다 Box의 스타일을 변경하고 있다.
만약 여기에 애니메이션을 주고 싶으면 앞에서 했듯이 variants를 만들고 custom을 사용하면 된다.
그런데 위의 코드를 조금만 수정하고도 간단히 애니메이션을 추가할 수 있다.
방법은 간단한데, Circle에 layout만 추가하면 된다.

```
// App.tsx
function App() {
	const [clicked, setClicked] = useState(false);
	const onClick = () => {
		setClicked((prev) => !prev);
	};
	return (
		<Wrapper onClick={onClick}>
			<Box
				style={{
					justifyContent: clicked ? "flex-start" : "center",
					alignItems: clicked ? "flex-start" : "center",
				}}
			>
				<Circle layout />
			</Box>
		</Wrapper>
	);
}
```

보다시피 layout만 추가했는데도 css 변화에 맞춰 애니메이션이 생긴다.
사용법이 굉장히 간단하므로 알아두면 편하게 쓸 수 있다.

다음으로 layoutId를 소개하겠다.
layoutId는 layout에 Id가 추가된 것이다.
Id가 생겼기 때문에 새로 생기는 컴포넌트가 기존의 것과 동일한지 아닌지를 알 수 있다.
이를 사용해 같은 컴포넌트가 생기면 이전의 컴포넌트가 다음 컴포넌트로 변하는 애니메이션 효과를 줄 수 있다.

layoutId를 사용해서 생기는 이점을 알기 위해 하나의 예시를 들어보겠다.
버튼을 누를때마다 왼쪽 박스와 오른쪽 박스를 오가는 원을 상상해보자.
variants를 사용해 이 애니메이션을 구현하는 것은 가능하지만 쉽지 않다.
variants는 구조를 바꾸지 않는다.
그래서 1번 박스에 속한 것이 2번 박스에 속하도록 옮길 수 없다.
애니메이션으로 옮긴 것처럼 표현할 수는 있지만, 속하지는 않아서 2번 박스의 스타일이 적용되지 않는다.
이런 부분을 일일이 손으로 구현해줘야 하는 어려움이 있다.

앞의 layout을 사용하기도 어렵다.
사물이 한 박스 안에 있을 때는 layout으로 체크가 가능하다.
그렇지만 두 박스 사이에선 layout이 작동하지 않는다.
아래는 박스를 2개 만들고 layout을 사용해본 것이다.

```
// App.tsx
const Wrapper = styled(motion.div)`
	...
	justify-content: space-around;
`;

const Box = styled(motion.div)`
	...
	justify-content: center;
	align-items: center;
`;

function App() {
	const [clicked, setClicked] = useState(false);
	const onClick = () => {
		setClicked((prev) => !prev);
	};
	return (
		<Wrapper onClick={onClick}>
			<Box>{!clicked ? <Circle layout /> : null}</Box>
			<Box>{clicked ? <Circle layout /> : null}</Box>
		</Wrapper>
	);
}
```

위 코드는 원의 위치만 옮겨질뿐 애니메이션이 일어나지 않는다.
이처럼 서로 다른 박스에서의 변화를 추적하기 위해선 다른 방법이 필요하다.
Framer motion은 이를 layoutId를 사용해서 해결한다.
박스가 달라도 layoutId가 같다면 같은 컴포넌트로 생각하는 것이다.
layout 대신에 layoutId="circle"을 줘보자.

```
// App.tsx
function App() {
	const [clicked, setClicked] = useState(false);
	const onClick = () => {
		setClicked((prev) => !prev);
	};
	return (
		<Wrapper onClick={onClick}>
			<Box>{!clicked ? <Circle layoutId="circle" /> : null}</Box>
			<Box>{clicked ? <Circle layoutId="circle" /> : null}</Box>
		</Wrapper>
	);
}
```

버튼을 누르면 원 사이에 애니메이션이 생긴 것을 볼 수 있다.
지금까지의 내용을 정리해보자.
variants와 initial, animate, exit을 사용해서 애니메이션을 만들 수 있다.
이때 같은 variants는 같은 애니메이션을 만들기 때문에, 공통된 애니메이션을 만들기 좋다.
한 컴포넌트 내에서 일어나는 애니메이션은 layout을 사용해도 된다.
layout을 준 대상은 스타일 변화를 체크해서 스스로 애니메이션을 만든다.
다만 둘 다 다른 박스로 옮겨지는 애니메이션은 만들기 힘들다.
이 경우는 애니메이션 대상을 2개 만들고 layoutId를 줘서 해결할 수 있다.
Framer Motion은 layoutId가 같은 대상은 컴포넌트를 넘어서 같은 존재로 인식한다.
그래서 서로 다른 컴포넌트 사이의 애니메이션이 발생한다.

### Tab Card

카드를 누르면 해당 카드가 확대되는 애니메이션을 만들어보려고 한다.
우선 grid를 사용해서 카드를 4개 만들어준다.

```
// App.tsx
const Box = styled(motion.div)`
	width: 400px;
	height: 300px;
	border-radius: 16px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
	font-size: 48px;
	div:first-child,
	div:last-child {
		grid-column: span 2;
	}
`;

const Card = styled(motion.div)`
	background-color: white;
	border-radius: 24px;
`;

function App() {
	return (
		<Wrapper>
			<Box>
				<Card />
				<Card />
				<Card />
				<Card />
			</Box>
		</Wrapper>
	);
}
```

이제 카드를 눌렀을 때, 카드가 커지면서 정중앙에 보이게 만들려고 한다.
이때 카드 자체의 스타일을 변경하는 애니메이션은 구현하기 어렵다.
그래서 layoutId를 사용해서 애니메이션을 적용하겠다.

애니메이션을 만들기 전에 카드를 눌렀을 때 보일 컴포넌트를 만들어준다.
그리고 state를 만들어서 카드가 클릭되었는지 여부를 가지고 화면을 보여준다.
모든 카드에 적용해야 하지만, 우선은 첫 번째 카드에만 클릭 기능을 만들어줬다.

```
// App.tsx
const CardClicked = styled(motion.div)`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.5);
`;

function App() {
	const [cardClicked, setCardClicked] = useState(false);
	const onClick = () => {
		setCardClicked((prev) => !prev);
	};
	return (
		<Wrapper>
			<Box>
				<Card onClick={onClick} />
				<Card />
				<Card />
				<Card />
			</Box>
			{cardClicked ? (
				<CardClicked onClick={onClick}>
					<Card
						style={{ width: "300px", height: "200px" }}
					/>
				</CardClicked>
			) : null}
		</Wrapper>
	);
}
```

첫 번째 카드를 클릭하면 CardClicked가 화면에 보인다.
이제 카드가 바뀌는 애니메이션을 줘야 한다.
우선 CardClicked에 쓰일 variants를 만들어서 적용시킨다.
이때 카드가 사라질 때 애니메이션을 사용하기 위해 AnimatePresence로 감싸준다.

```
// App.tsx
const clickedVariant = {
	hidden: {
		backgroundColor: "rgba(0, 0, 0, 0)",
	},
	visible: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	exit: {
		backgroundColor: "rgba(0, 0, 0, 0)",
	},
};

function App() {
	...
	return (
		<Wrapper>
			...
			<AnimatePresence>
				{cardClicked ? (
					<CardClicked
						variants={clickedVariant}
						initial="hidden"
						animate="visible"
						exit="exit"
						onClick={onClick}
					>
						...
					</CardClicked>
				) : null}
			</AnimatePresence>
		</Wrapper>
	);
}
```

이제 첫 번째 카드가 CardClied 안의 Card로 변하는 애니메이션을 적용시키자.
이는 각 카드에 layoutId를 지정해주면 된다.

```
// App.tsx
function App() {
	...
	return (
		<Wrapper>
			<Box>
				<Card layoutId="first" onClick={onClick} />
				<Card />
				<Card />
				<Card />
			</Box>
			<AnimatePresence>
				{cardClicked ? (
					<CardClicked
						variants={clickedVariant}
						initial="hidden"
						animate="visible"
						exit="exit"
						onClick={onClick}
					>
						<Card
							layoutId="first"
							style={{ width: "300px", height: "200px" }}
						/>
					</CardClicked>
				) : null}
			</AnimatePresence>
		</Wrapper>
	);
}
```

카드를 클릭해보면 첫 번째 카드가 커지거나 작아지는 애니메이션이 적용되었다.
나머지 카드에도 같은 기능을 적용하려고 한다.
생각해보면 클릭된 상황은 5가지가 존재한다.
아무것도 클릭되지 않은 상황 1개와 각각이 클릭된 상황 4개가 있다.
이 5개의 상태를 state로 표시하면, state에 어떤 카드가 클릭되었는지 저장된다.
이를 가지고 key, layoutId를 만들어주면 된다.

우선 clickState를 저장할 State를 만든다.
그리고 ["1", "2", "3", "4"]로 map을 사용해서 Card를 만든다.
이때 string은 원소로 사용하는 이유는 layoutId가 string을 써야하기 때문이다.
그리고 onClick 시에 clickState를 바꿔줘야 한다.
이때 clickState는 ["1", "2", "3", "4"] 중의 하나가 된다.
clickState가 처음에는 null일 것을 생각하면 타입이 string | null이 된다.
이를 useState를 사용할 때 적어줘야 한다.

```
// App.tsx
function App() {
	const [clickState, setClickState] = useState<string | null>(null);
	return (
		<Wrapper>
			<Box>
				{["1", "2", "3", "4"].map((e) => (
					<Card layoutId={e} onClick={() => setClickState(e)} />
				))}
			</Box>
			...
		</Wrapper>
	);
}
```

이제 clickState가 null이 아닐 경우엔 클릭된 화면을 보여주면 된다.
그러므로 cardClicked를 clickState로 대체한다.
그리고 onClick 시에 clickState를 null로 만들어준다.
마지막으로 애니메이션 연결을 위해 Card의 layoutId를 clickState로 만든다.

```
// App.tsx
function App() {
	...
	return (
		<Wrapper>
			...
			<AnimatePresence>
				{clickState ? (
					<CardClicked
						variants={clickedVariant}
						initial="hidden"
						animate="visible"
						exit="exit"
						onClick={() => setClickState(null)}
					>
						<Card
							layoutId={clickState}
							style={{ width: "300px", height: "200px" }}
						/>
					</CardClicked>
				) : null}
			</AnimatePresence>
		</Wrapper>
	);
}
```

### Keyframe

### Component animation controls

지금까지 우리는 `animate="middle"`처럼 animate에 variants의 이름을 바로 줬었다.
그런데 상황에 따라 animate에 다른 값을 주고 싶을 수 있다.
이때 useState를 사용하면 아래처럼 할 수 있다.

```
const check = useState(false);

return (
	<motion.div animate={check ? "middle" : "other"} />
)
```

위에서 check의 값을 바꿔주는 코드만 추가하면 animate가 변경된다.
이처럼 간단한 애니메이션 조작은 쉽지만, 좀 더 복잡한 변경을 하기 어렵다.
예를 들어서 애니메이션을 새로 지정하거나, 멈추거나, 다른 것으로 시작하는 등의 일을 해야 한다고 하자.
이때 각 상태를 새로운 state를 만들어서 해결하려면, 관리할 state가 너무 많아진다.
애니메이션에 복잡한 조작을 해야 하면 useAnimation을 사용하면 된다.
useAnimation은 animate에 들어갈 애니메이션 대상을 지정, 시작, 정지 시에 사용한다.
set을 사용하면 애니메이션을 지정하고, start는 해당 애니메이션을 시작하고, stop은 애니메이션을 멈춘다.

set은 애니메이션을 지정하는데 사용한다.
이때 variants로 지정하는 것도 가능하다.

```
const controls = useAnimation();

// use property
controls.set({ opacity: 0 });

// use variants
controls.set("hidden");
```

다음으로 start는 아래처럼 직접 애니메이션을 지정해서 시작할 수 있다.

```
controls.start({
	x: 0,
	transition: {
		duration: 1
	}
});
```

하지만 아래처럼 variants의 라벨을 사용하는 것이 편하다.

```
const divVariants = {
	label1: {
		x: 0,
		transition: {
			duration: 1
		}
	}
}

controls.start("label1");

<motion.div variants={divVariants} animate={controls} />
```

애니메이션이 실행되는 도중에 중단하려면 `controls.stop()`으로 중단한다.
