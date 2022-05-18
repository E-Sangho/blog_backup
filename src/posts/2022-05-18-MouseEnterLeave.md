---
title: "Mouse Enter and Leave Events"
date: "2022-05-18 16:08:57"
thumbnail: "../assets/images/react.png"
summary: ""
categories: ["React"]
---

# Mouse Enter and Leave Events

## Introduction

넷플릭스 페이지가 어떻게 만들어졌는지 살펴보던 중 재밌는 것을 발견했다.
메뉴 버튼에 마우스를 올리면 메뉴창이 펼쳐지고, 마우스가 벗어나면 메뉴창이 사라진다.
여기까지는 대부분의 사이트에서 비슷한 기능이 있어서 대수롭지 않게 여겼다.
그런데 메뉴 버튼과 메뉴창 사이에 약간의 거리가 있었다.
만약 Mouse Enter과 Leave만으로 구현한다면, 마우스가 벗어났을 때 메뉴창이 사라져야 한다.
하지만 잠깐 동안 메뉴창이 유지되었다.

별것 아닌 기능처럼 보이지만 조금 생각해보면 꽤나 유용한 기능이다.
메뉴창 안에 하위 메뉴창이 있는 경우를 생각해보자.
메뉴창에 마우스를 올리면 하위 메뉴창이 열리고, 다시 마우스로 하위 메뉴창을 선택하려 한다.
이때 많은 사람이 하위 메뉴창을 선택하려다가 메뉴창이 닫히는 경우를 경험해 본 적이 있을 것이다.
이는 마우스가 메뉴창을 벗어나는 즉시 메뉴창을 닫기 때문에 발생한다.
그런데 이렇게 만들면 메뉴창을 대각선으로 가로지를 수가 없다.
대신에 불편하게 수평 수직으로 조심스럽게 움직여야 한다.

또 다른 경우를 생각해보자.
종종 의도치 않게 Mouse Enter 이벤트가 발생하는 경우가 있다.
마우스를 움직이는 경로에 hover 이벤트가 있거나, Mouse Enter 이벤트가 있는 경우다.
물론 마우스가 지나는 즉시 사라지므로 크게 거슬리진 않다.
하지만 약간의 신경을 쓴다면 이런 불필요한 경험을 없앨 수 있다.
마우스가 단순히 위를 지나는 경우 멈춰서지 않고, 위를 계속 지난다.
그러므로 굉장히 짧은 시간만 머무를텐데, 마우스가 일정 시간 위에 올려졌을 경우에만 이벤트를 발생시키면 불필요한 이벤트를 발생시키지 않는다.

이처럼 Mouse Enter, Leave 이벤트를 지연할 수 있으면 사용자 편의가 개선된다.
편의를 위해 React를 사용해서 만들었지만, JavaScript만으로도 충분히 만들 수 있을만큼 쉽다.

## Setup

박스를 2개 만들어서 하나는 마우스가 들어오고 나오는 것을 체크하는데 사용하고, 다른 하나는 마우스가 들어오면 보이게 하려고 한다.
이는 state를 하나 만들어서 onMouseEnter, onMouseLeave로 관리해주면 간단하게 만들 수 있다.

```javascript
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
	display: flex;
`;

const Box = styled.div`
	width: 400px;
	height: 400px;
	background-color: blue;
	color: white;
	display: flex;
	text-align: center;
	justify-content: center;
	align-items: center;
	font-size: 24px;
`;

const Box2 = styled(Box)`
	background-color: red;
`;

function App() {
	const [mouseEnter, setMouseEnter] = useState(false);
	const mouseEnterHandler = () => {
		setMouseEnter(true);
	};

	const mouseLeaveHander = () => {
		setMouseEnter(false);
	};
	return (
		<Container>
			<Box
				onMouseEnter={mouseEnterHandler}
				onMouseLeave={mouseLeaveHander}
			>{`Did the mouse come into this box?: ${mouseEnter}`}</Box>
			{mouseEnter && (
				<Box2>You can see this box, if you enter the mouse</Box2>
			)}
		</Container>
	);
}
```

이제 파란 박스에 마우스를 올리면 붉은 박스가 나온다.
이제 마우스가 들어오고 나가는 것에 시간 지연을 추가하면 된다.

## setTimeout & clearTimeout

> setTimeout(function, [delay])

setTimeout은 지정한 시간이 끝나면 지정한 함수를 실행시킨다.
setTimeout은 첫 번째 변수로 실행시킬 함수를 받고, 두 번째 변수로 지연할 시간을 받는데 ms 단위로 적어준다.
예를 들어서 1초 후에 메세지가 나오게 하려면 아래처럼 하면 된다.

```javascript
setTimeout(() => {
	console.log("A second has passed"), 1000;
});
```

setTimeout은 timeoutID를 반환한다.
이 timeoutID는 타이머를 구분하는데 사용하며, clearTimeout과 같이 쓰면 타이머를 취소할 수도 있다.
clearTimeout은 setTimeout에서 반환하는 timeoutID를 넣어주기만 하면 바로 타이머를 취소해준다.

> clearTimeout(timeoutID)

우리는 이 둘을 사용해서 마우스가 나가면 setTimeout을 실행해서 나간 시간을 측정한다.
그리고 마우스가 시간 내에 들어오면 clearTimeout으로 지우고, 아니면 setTimeout이 실행해서 mouseEnter state를 바꾼다.

마우스가 들어오고 나갈 때 delay를 정할 enterDelay와 leaveDelay를 만든다.
그리고 마우스가 들어온 시간을 측정할 mouseEnterTimer와 나간 시간을 측정할 mouseLeaveTimer를 만든다.
이때 typescript를 사용하면 mouseEnterTimer과 mouseLeaveTimer의 타입을 지정해줘야 한다.
timeoutId의 타입은 NodeJS.Timeout이므로 이로 지정해주면 된다.

```javascript
function App() {
    ...
    const enterDelay = 1000,
		leaveDelay = 1000;
	let mouseEnterTimer: NodeJS.Timeout, mouseLeaveTimer: NodeJS.Timeout;
}
```

그리고 마우스가 들어오면 mouseLeaveTimer를 초기화 시키고 mouseEnterTimer를 실행시킨다.
반대로 마우스가 나가면 mouseEnterTimer를 초기화하고 mouseLeaveTimer를 시작한다.

```javascript
function App() {
    ...
	const mouseEnterHandler = () => {
		clearTimeout(mouseLeaveTimer);
		mouseEnterTimer = setTimeout(() => {
			setMouseEnter(true);
		}, enterDelay);
	};

	const mouseLeaveHander = () => {
		clearTimeout(mouseEnterTimer);
		mouseLeaveTimer = setTimeout(() => {
			setMouseEnter(false);
		}, leaveDelay);
	};
}
```

이제 마우스가 들어가면 1초 후에 붉은 박스가 보이고, 마우스가 나가면 1초 후에 박스가 사라진다.
중요한 것은 중간에 마우스가 들어갔다가 나갔을 경우엔 이벤트가 취소돼서 박스가 나타나지 않는다.

## Click Event

이처럼 가시성을 바꾸는 경우는 팝업, Modal, 메뉴창 등 여럿이 있다.
이들의 공통점은 외부를 눌렀을 경우 바로 사라지는 것이다.
앞의 마우스 지연 기능을 쓰는 사용자도 비슷한 기능을 기대할 것이므로, 마우스가 다른 곳을 눌렀을 때 즉각적으로 가시성을 바꾸는 코드를 추가하겠다.

우선 클릭 위치를 알 수 있어야 한다.
박스 안을 눌렀을 때 가시성이 변동되어선 안 된다.
그러므로 누른 위치가 박스 안인지 밖인지를 확인해야 한다.
마우스로 클릭할 경우 event.currentTarget에 대상이 들어간다.
이때 currentTarget이 박스 안에 있는지 확인해줘야 한다.
박스를 대상으로 지정한 다음 **box.contains(event.currentTarget)** 처럼 사용하면, box 안에 currentTarget이 있는지 알 수 있다.
이 방법으로 박스 안을 누른 경우를 확인할 수 있다.

box를 지정하는 방법은 여럿 있지만 그 중에서 ref를 사용하겠다.
ref를 사용하는 이유는 이 효과를 hook으로 만들기 좋기 때문이다.
hook 파일을 하나 만들어서 ref와 위의 handler를 정의하고, 이를 반환하는 함수를 만든다.
그리고 이 함수로 전달하는 ref와 handler를 받아서 컴포넌트에 사용하면 쉽게 코드를 재활용 할 수 있다.
예를 들어서 아래처럼 할 수 있다.

```javascript
// useMouseDelay.ts

function useMouseDelay() {
	const delayRef = useRef(null);
	const [mouseEnter, setMouseEnter] = useState(false);
	const enterDelay = 1000,
		leaveDelay = 1000;
	let mouseEnterTimer: NodeJS.Timeout, mouseLeaveTimer: NodeJS.Timeout;
	const mouseEnterHandler = () => {
		clearTimeout(mouseLeaveTimer);
		mouseEnterTimer = setTimeout(() => {
			setMouseEnter(true);
		}, enterDelay);
	};

	const mouseLeaveHandler = () => {
		clearTimeout(mouseEnterTimer);
		mouseLeaveTimer = setTimeout(() => {
			setMouseEnter(false);
		}, leaveDelay);
	};
	return {
		delayRef,
		mouseEnterHandler,
		mouseLeaveHandler,
	};
}
```

```javascript
// App.tsx
import useMouseDelay from "./useMouseDelay.ts";

function App() {
	const { delayRef, mouseEnterHandler, mouseLeaveHandler } = useMouseDelay();
	return (
		<Container ref={delayRef}>
			<Box
				onMouseEnter={mouseEnterHandler}
				onMouseLeave={mouseLeaveHandler}
			>{`Did the mouse come into this box?: ${mouseEnter}`}</Box>
			{mouseEnter && (
				<Box2>You can see this box, if you enter the mouse</Box2>
			)}
		</Container>
	);
}
```

Container에 ref 속성을 사용해서 대상을 지정했으므로 delayRef.current가 Container를 가리킨다.
마우스 클릭시에 mouseEnter이 false가 되려면 몇 가지 조건이 필요하다.
우선 mouseEnter이 true여야 하고, delayRef.current가 null이면 안 된다.
마지막으로 Container가 event.currentTarget을 포함하고 있어야 한다.
다시 말해 !delay.current.contains(event.currentTarget)이 true인 경우에만 실행해야 한다.

```javascript
// useMouseDelay.ts

function useMouseDelay() {
    ...
    const handler = (event) => {
        if (
            mouseEnter &&
            delayRef.current &&
            !delayRef.current.contains(event.currentTarget)
        ) {
            setMouseEnter(false);
        }
    }
    ...
}
```

문제는 클릭 위치가 외부일 수 있다는 점이다.
이를 해결하기 위해선 document 자체에 addEventListener로 클릭시의 이벤트를 추가하는 것이 좋다.
다만 document가 랜더링 된 다음에 실행되어야 하므로 이는 useEffect 내에 작성해줘야 한다.
그리고 cleanup 함수를 작성해서 mouseEnter이 바뀌면 addEventListener를 지워주도록 한다.

```javascript
// useMouseDelay.ts

function useMouseDelay() {
    ...
    useEffect(() => {
        const handler = (event) => {
            if (
                mouseEnter &&
                delayRef.current &&
                !delayRef.current.contains(event.currentTarget)
            ) {
                setMouseEnter(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, [mouseEnter]);
    ...
}
```

만약 타입스크립트를 사용하고 있다면 위 코드가 조금 문제가 있다.
addEventListener는 event의 타입이 MouseEvent여야 한다고 생각한다.
하지만 event의 타입을 MouseEvent로 지정하면 contains에서 문제가 생긴다.
event.currentTarget의 타입은 **EventTarget | null**인 반면, contains는 내부가 **Node | null**이라 생각하기 때문이다.
그러므로 as 키워드를 사용해서 아래처럼 해결해야 한다.

```javascript
// useMouseDelay.ts

function useMouseDelay() {
    ...
	useEffect(() => {
		const handler = (event: MouseEvent) => {
			if (
				mouseEnter &&
				delayRef.current &&
				!delayRef.current.contains(event.currentTarget as Node)
			) {
				setMouseEnter(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => {
			document.removeEventListener("mousedown", handler);
		};
	}, [mouseEnter]);
    ...
}
```

## Reference

[settimeout delay](https://codelair.com/javascript/settimeout-delay-hover-javascript/)
