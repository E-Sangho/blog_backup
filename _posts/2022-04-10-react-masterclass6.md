---
layout: post
title:
date: Sun Apr 10 13:27:21 JST 2022
categories:
tag:
toc: true
---

## Recoil selector

앞서 ToDoList의 카테고리를 변경하는 방법을 배웠다.
이때 selector의 get 함수를 사용했다.
get은 atom의 값을 가져오는 함수로, selector에서 atom의 값을 가져오는데 사용했다.
get이 반환하는 값을 useRecoilValue로 사용할 수 있으므로, 이를 사용해 카테고리를 분류했다.
이 외에도 selector는 set이라는 함수가 존재한다.
set은 atom의 값을 변경하는데 사용하는 함수다.
값을 변경시키는 방법은 get과 유사한데, 조금 있다가 알아보겠다.

결국 selector는 atom의 값을 받아와서 새로운 값으로 바꿔주고, 다른 값으로 변경 시키는 일을 한다.
그런데 이는 useRecoilState를 사용하면 쉽게 할 수 있는 일이다.
그럼에도 selector를 쓰는 이유는 동시에 여러 atom을 쓸 수 있기 때문이다.
만약 사용하는 atom이 10개 정도 된다면, 각각에 useRecoilState를 사용해야 한다.
selector를 사용하면 selector 하나만으로 모든 것을 해결할 수 있다.
selector의 get, set은 여러 번 사용할 수 있기 때문이다.
그렇지만 selector를 사용하는 흐름은 atom을 사용하는 것과 동일하다.
그래서 selector의 문법은 atom을 사용하는 것과 굉장히 유사한데, 다음의 예로 알아보겠다.

selector를 사용하는 예시를 위해 간단한 기능을 만들겠다.
시나 분을 입력 받아서 다른 한쪽으로 변경해주는 input을 만들어보겠다.
이때 시간을 기록하기 위해 분으로 atom을 하나 만들어준다.

```
// atoms.tsx
export const minuteState = atom({
    key: "minutes",
    default: 0,
});
```

분과 시를 입력받을 input을 2개 만든다.
이때 분의 값이 변경되면 minuteState의 값을 변경하도록 만든다.

```
// App.tsx

function App() {
    const [minutes, setMinutes] = useRecoilState(minuteState);
    const onMinutesChange = (event: React.FormEvent<HTMLInputElement>) => {
        setMinutes(+event.currentTarget.value);
    };
    return (
        <div>
        <input
            value={minutes}
            onChange={onMinutesChange}
            type="number"
            placeholder="Minutes"
        />
        <input type="number" placeholder="Hours" />
        </div>
    );
}
```

분이 입력되면 분을 시간으로 바꿔줘야 한다.
이는 selector의 get을 사용해서 값을 바꿔준다.

```
// atoms.tsx
export const hourSelector = selector({
    key: "hours",
    get: ({ get }) => {
        const minutes = get(minuteState);
        return minutes / 60;
    },
});
```

```
// App.tsx
function App() {
    const [minutes, setMinutes] = useRecoilState(minuteState);
    const hours = useRecoilValue(hourSelector);
    ...
    return (
        <div>
            ...
            <input value={hours} type="number" placeholder="Hours" />
        </div>
    );
}
```

다음으로 시간이 입력되면 분을 변경해줘야 한다.
그런데 기존의 get만 가지고는 값을 가져올 수는 있어도 변경할 수 없다.
그러므로 set을 사용해야 한다.

set은 첫 번째 변수로 set 함수를 받고, 두 번째 변수로 newValue를 받는다.
set은 atom의 값을 변경하는데 사용되며 첫 번째 변수로 atom의 key를 받고, 두 번째 변수로 바꿀 값을 받는다.
아래는 minuteState atom의 값을 변경하는 코드다.

```
// atoms.tsx
export const hourSelector = selector<number>({
    ...
    set: ({ set }, newValue) => {
        const minutes = Number(newValue) * 60;
        set(minuteState, minutes);
    },
});
```

selector의 get은 값을 반환하고, set은 값을 변경한다.
이는 state와 setState의 관계와 동일하다.
그렇기 때문에 selector의 get, set을 사용은 atom의 사용과 굉장히 유사하다.
selector의 set을 사용하려면 useRecoilState를 사용하면 된다.

```
// App.tsx
function App() {
    const [hours, setHours] = useRecoilState(hourSelector);
    ...
}
```

hours는 hourSelector의 get이고, setHours는 set이다.
그러므로 값을 받아오고 싶으면 hours를 쓰면 되고, 값을 변경하고 싶으면 setHours를 쓰면 된다.
이는 atom의 useRecoilState와 굉장히 유사하다.
setHours는 바꿀 값을 받을 수 있고, 이는 set의 newValue로 사용된다.
onChange 함수와 setHours를 같이 사용하면 시간을 분으로 바꿀 수 있다.

```
// App.tsx
function App() {
    const [hours, setHours] = useRecoilState(hourSelector);
    ...
    const onHoursChange = (event: React.FormEvent<HTMLInputElement>) => {
        setHours(+event.currentTarget.value);
    };
    return (
        <div>
            ...
            <input
                onChange={onHoursChange}
                value={hours}
                type="number"
                placeholder="Hours"
            />
        </div>
    );
}
```

## react beautiful dnd

지금 ToDoList는 카테고리를 버튼으로 옮겨주고 있다.
이를 드래그 기능으로 좀 더 직관적으로 변경하려고 한다.
드래그 드랍을 직접 코드로 작성해도 좋지만, 작성할 양이 상당히 많다.
그렇기 때문에 react-beautiful-dnd 라이브러리를 사용하겠다.
[react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)는 드래그 드랍 기능을 구현해주는 라이브러리다.
우선 `npm install react-beautiful-dnd --save`로 패키지를 설치해준다.
그리고 타입스크립트용 패키지도 `npm i @types/react-beautiful-dnd`로 설치해준다.
react-beautiful-dnd는 아래의 3개의 컴포넌트가 있다.

-   \<DragDropContext />: 드래그 드랍 기능을 사용할 수 있는 영역을 설정
-   \<Droppable />: 드래그 한 대상을 드랍할 영역을 설정
-   \<Draggable />: 드래그 가능한 대상을 설정

이제 각 컴포넌트를 사용해서 드래그 드랍 기능을 만들어보겠다.
우선 \<DragDropContext>를 설명하겠다.
\<DragDropContext>는 \<ThemeProvider>나 \<RecoilRoot> 같이 패키지를 쓸 수 있는 영역을 표시하는데 사용한다.
\<DragDropContext>로 감싸진 부분만이 드래그 앤 드랍 기능을 사용할 수 있다.
아래처럼 \<DragDropContext>를 import하고 사용해보자.

```
// App.tsx
import { DragDropContext } from "react-beautiful-dnd";

function App() {
    return (
        <DragDropContext>

        </DragDropContext>
    )
}
```

그러면 \<DragDropContext>에 에러가 생기는데 onDragEnd라는 속성이 필요한 것을 알 수 있다.
onDragEnd는 드래그가 끝났을 때 사용될 함수를 적어줘야 한다.
일단은 아무것도 하지 않는 함수를 적어놓겠다.

```
// App.tsx
import { DragDropContext } from "react-beautiful-dnd";

function App() {
    const onDragEnd = () => {};
    return (
        <DragDropContext onDragEnd={onDragEnd}>

        </DragDropContext>
    )
}
```

\<DragDropContext>는 자식으로 \<Droppable>이 있어야 한다.
이때 \<Droppable>은 영역이 여러 개일 수 있으므로 서로 구분할 수 있어야 한다.
그래서 droppableId를 속성에 넣어줘야 한다.

```
// App.tsx
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function App() {
    const onDragEnd = () => {};
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="one">
            </Droppable>
        </DragDropContext>
    )
}
```

\<Droppable>은 자식이 필요한데, 이때 단순히 react 컴포넌트를 적어주면 안 된다.
\<Droppable>의 자식은 함수 형태로 주어져야 한다.
함수 형태로 주는 이유는 \<Droppable>에 어떤 값을 줄 수 있기 때문인데 일단은 넘어가겠다.

```
// App.tsx
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function App() {
    const onDragEnd = () => {};
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="one">
            {() => <ul></ul>}
            </Droppable>
        </DragDropContext>
    )
}
```

\<ul> 안에 \<Draggable> 컴포넌트를 만들어준다.

```
// App.tsx
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
    const onDragEnd = () => {};
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="one">
            {() => (
                <ul>
                    <Draggable>
                    </Draggable>
                </ul>
            )}
            </Droppable>
        </DragDropContext>
    )
}
```

\<Draggable> 역시 자식이 필요한데, \<Droppable>처럼 함수 형태로 줘야 한다.
\<Draggable>은 서로 구분하기 위해 draggableId가 필요하고, 정렬된 순서를 알기 위해 index를 사용해야 한다.

```
// App.tsx
function App() {
    const onDragEnd = () => {};
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="one">
            {() => (
                <ul>
                    <Draggable draggableId="first" index={0}>
                        {() => <li>One</li>}
                    </Draggable>
                    <Draggable draggableId="second" index={1}>
                        {() => <li>Two</li>}
                    </Draggable>
                </ul>
            )}
            </Droppable>
        </DragDropContext>
    )
}
```

\<Droppable>은 자식을 함수로 받았다.
이때 함수에 provided라는 변수를 사용할 수 있다.
provided는 innerRef와 droppableProps를 가지고 있다.
이 둘이 어떤 역할을 하는지는 이후에 설명하고 일단은 튜토리얼을 그대로 따라가보자.

\<ul>에 아래처럼 적어준다.

```
// App.tsx
function App() {
    ...
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="one">
            {(provided) => (
                <ul
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <Draggable draggableId="first" index={0}>
                        {() => <li>One</li>}
                    </Draggable>
                    <Draggable draggableId="second" index={1}>
                        {() => <li>Two</li>}
                    </Draggable>
                </ul>
            )}
            </Droppable>
        </DragDropContext>
    )
}
```

\<Draggable>에도 역시 provided가 있다.
\<Draggable>의 provided는 innerRef, draggableProps, dragHandleProps가 있다.
아래처럼 작성해준다.

```
// App.tsx
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
    ...
    return (
			<DragDropContext onDragEnd={onDragEnd}>
                ...
							<Draggable draggableId="first" index={0}>
								{(provided) => (
									<li
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
									>
										One
									</li>
								)}
							</Draggable>
							<Draggable draggableId="second" index={1}>
								{(provided) => (
									<li
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
									>
										Two
									</li>
								)}
							</Draggable>
                ...
			</DragDropContext>
    )
}
```

여기까지 작성하고 브라우저에서 확인하면 드래그 기능이 활성화된 것을 볼 수 있다.
다만 드랍 기능은 onDragEnd에 아무런 기능도 적지 않아서 별다른 일이 일어나진 않는다.

지금 위의 \<li>는 어디를 눌러도 드래그 기능이 수행된다.
드래그 가능한 지역을 지정하는 것은 dragHandleProps다.
컴포넌트의 속성으로 넣어주면 해당 컴포넌트만 드래그 가능하게 된다.

```
// App.tsx
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
    const onDragEnd = () => {};
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            ...
                    <Draggable draggableId="first" index={0}>
                        {(provided) => (
                            <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                            >
                                <span {...provided.dragHandleProps}>
                                    Drag Here
                                </span>
                                One
                            </li>
                        )}
                    </Draggable>
                    <Draggable draggableId="second" index={1}>
                        {(provided) => (
                            <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                            >
                                <span {...provided.dragHandleProps}>
                                    Drag Here
                                </span>
                                Two
                            </li>
                        )}
                    </Draggable>
            ...
        </DragDropContext>
    )
}
```

여기까지 react-beautiful-dnd의 각 컴포넌트를 개략적으로 알아봤다.
별다른 일을 하지 않고 각 컴포넌트의 값을 전달하는 것만으로도 드래그 기능이 수행되는 것을 볼 수 있다.
이후에 드랍 기능은 onDragEnd에 추가하면 된다.
드랍 기능을 설명하기 전에 각 컴포넌트를 좀 더 자세히 설명하겠다.

### DragDropContext

\<DragDropContext>는 드래그 드랍 기능의 영역을 정하는 컴포넌트다.
\<DragDropContext>로 쌓인 부분에서만 드래그 드랍 기능이 작동한다.
그렇다고 특정 영역에 지정할 필요는 없다.
\<ThemeProvider>나 \<RecoilRoot>처럼 모든 내용을 \<DragDropContext> 안에 둬도 작동한다.
\<DragDropContext>는 중첩 기능을 사용할 수 없다.
그러므로 앱의 최상위에서 모든 내용을 감싸주도록 사용하는 것이 좋다.

\<DragDropContext> 내부에서 \<Droppable>와 \<Draggable>을 사용할 수 있다.
\<Droppable>은 드랍 기능을 수행할 곳을 정하고, \<Draggable>은 드래그 기능을 수행할 곳을 정한다.
각 컴포넌트는 이후에 자세히 설명하겠다.

\<DragDropContext>는 아래와 같은 속성이 있다.

-   onBeforeCapture?
-   onBeforeDragStart?
-   onDragStart?
-   onDragUpdate?
-   onDragEnd

이름을 보면 알 수 있듯이 여러 드래그 상황에서 실행시킬 함수를 정할 수 있다.
이때 onDragEnd만이 필수적이고 나머지는 선택사항이다.
보통은 드래그가 끝나면 함수를 실행시키므로 onDragEnd를 주로 사용한다.

### Droppable

\<Droppable>는 \<Draggable>로 드랍할 수 있는 영역을 정하는 컴포넌트다.
\<Droppable>는 아래와 같은 속성이 있다.

-   droppableId:
-   type?
-   mode?
-   isDropDisabled?
-   isCombineEnabled?
-   direction?
-   ignoreContainerClipping?
-   renderClone?
-   getContainerForClone?

이 중에서 중요한 것은 droppbleId이다.
droppableId는 각 \<Droppable>을 구분하는 Id로 각자 고유한 값을 사용해야 한다.
\<Droppable>의 자식은 함수형태로 주어져야 하며 provided, snapshot 2개의 변수를 사용한다.

```
<Droppable droppableId="droppable-1">
  {(provided, snapshot) => ({
    /*...*/
  })}
</Droppable>
```

provided는 innerRef, droppableProps, placeholder를 가지고 있다.
innerRef는 \<Droppable>이 정상적으로 작동하기 위해 사용하는 속성이다.
\<Droppable> 내부의 최상위 요소에 `ref={provided.innerRef}`로 전달하면 된다.
droppableProps는 드롭이 적용될 요소에 필요한 속성이다.
ref를 적용하는 곳에 같이 적용해주면 된다.
placeholder는 드래그가 일어나는 동안 공간을 유지해주는데 사용한다.
ref를 적용하는 곳에서 쓸 수 있고 아래처럼 사용하면 된다.

```
<Droppable droppableId="droppable-1">
  {(provided, snapshot) => (
    <div ref={provided.innerRef} {...provided.droppableProps}>
      Good to go
      {provided.placeholder}
    </div>
  )}
</Droppable>
```

### Draggable

\<Draggable>은 드래그 가능한 컴포넌트를 만든다.
\<Draggable>은 \<Droppable> 안에서만 사용가능한데, 다른 위치의 \<Droppable>로 옮길 수도 있다.
\<Draggable>은 \<Droppable>처럼 draggableId와 index를 정해줘야 한다.
당연히 draggableId는 형제간에 유일해야 하고, index는 순서를 정하는데 사용된다.
자식 요소는 함수로 주어져야 하며 아래처럼 만들 수 있다.

```
import { Draggable } from 'react-beautiful-dnd';

<Draggable draggableId="draggable-1" index={0}>
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <h4>My draggable</h4>
    </div>
  )}
</Draggable>;
```

자식을 만들 때, 함수에 provided와 snapshot이 있다.
이들은 \<Droppable>에서 했듯이 드래그 대상에 필요한 속성을 전달해준다.
이때 dragHandleProps라는 속성이 있다.
이는 드래그 가능한 영역을 지정하는데 사용한다.
만약 전체를 드래그 가능한 지영ㄱ으로 설정하고 싶으면 아래처럼 ref와 같은 위치에 속성으로 주면 된다.

```
<Draggable draggableId="draggable-1" index={0}>
  {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      Drag me!
    </div>
  )}
</Draggable>
```

일부분에서만 드래그 기능이 동작하도록 만들려면 아래처럼 만든다.

```
<Draggable draggableId="draggable-1" index={0}>
  {(provided, snapshot) => (
    <div ref={provided.innerRef} {...provided.draggableProps}>
      <h2>Hello there</h2>
      <div {...provided.dragHandleProps}>Drag handle</div>
    </div>
  )}
</Draggable>
```

### ToDoDrag

### onDragEnd

하던 일로 돌아가서 드롭 기능을 만들어보자.
원래 우리는 ToDoList를 ToDoList.tsx 파일에서 만들고 있었으므로 코드를 옮겨준다.
이때 toDoState의 값을 사용해서 ToDoList를 보여줘야 한다.
각 ToDo에서 상당히 많은 일을 하고 있으므로 새로 컴포넌트를 만들어줬다.

```
// ToDoDrag.tsx
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IToDos } from "../atoms";

interface IToDoDrag {
	toDo: IToDos;
	index: number;
}
function ToDoDrag({ toDo, index }: IToDoDrag) {
	return (
		<Draggable key={toDo.text} draggableId={toDo.text} index={index}>
			{(provided) => (
				<li
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					{toDo.text}
				</li>
			)}
		</Draggable>
	);
}

export default ToDoDrag;
```

여기서 key를 추가해줬는데, key는 \<Draggable>을 구분하는데 사용된다.
이때 주의할 점은 key로 index를 사용하면 안 된다.
업데이트 할 때 key가 중복되어서 문제가 생길 수 있기 때문이다.
일반적으론 draggableId를 키로 사용하면 된다.
draggableId 역시 구분할 수 있는 값을 줘야 한다.
ToDo의 내용이 중복되지 않을 것이므로 toDo.text를 사용했다.
물론 아직은 ToDoList의 내용이 중복되는지 체크하진 않지만, 이후에 추가한다.

이제 위의 \<ToDoDrag>를 ToDoList.tsx에서 불러와서 사용한다.
이미 앞서 해본 내용이므로 자세한 내용은 생략한다.

```
// ToDoList.tsx
...
import {
	DragDropContext,
	Droppable,
	DropResult,
} from "react-beautiful-dnd";
import ToDoDrag from "./ToDoDrag";

function ToDoList() {
	const [toDos, setToDos] = useRecoilState(toDoState);
    ...
	const onDragEnd = ({ destination, source }: DropResult) => {
		let newToDos = JSON.parse(JSON.stringify(toDos));
		let moved = newToDos.splice(source.index, 1);
		newToDos.splice(destination?.index, 0, ...moved);
		setToDos(newToDos);
	};
	return (
		<div>
            ...
			<hr />
			<DragDropContext onDragEnd={onDragEnd}>
				<ul>
					<Droppable droppableId="one">
						{(provided) => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{toDos.map((toDo, index) => (
									<ToDoDrag
										key={toDo.text}
										index={index}
										toDo={toDo}
									/>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</ul>
			</DragDropContext>
		</div>
	);
}

export default ToDoList;
```

현재 ToDoList의 항목은 atoms로 만들고 있다.
그리고 atoms의 순서대로 ToDoList가 만들어진다.
우리가 할 일은 드롭이 일어났을 때 atoms의 순서를 바꾸는 일이다.

onDragEnd는 변수로 드래그가 끝났을 때의 정보를 받는다.
아래처럼 변수를 출력해보자.

```
// ToDoList.tsx

function ToDoList() {
    ...
    const onDragEnd = (args: any) => {
        console.log(args);
    };
    return (
        ...
    )
}
```

정보를 보면 누가 어디로 드랍되는지 알려준다.
destination에는 목적지 정보가 들어있고, source는 드래그 대상의 정보가 들어있다.
우리가 할 일은 index를 변경해서 순서를 바꿔주는 일이다.
/<DragDropContext>의 onDragEnd를 보면 args의 타입이 DropResult라는 것을 알 수 있다.

```
// ToDoList.tsx
function ToDoList() {
    const onDragEnd = ({ destination, source }: DropResult) => {
        // change Order
    };
    return (
        ...
    )
}
```

atoms의 순서를 변경시키는 것은 splice를 사용해서 해당 위치의 값을 변경시켜주면 된다.
그리고 setToDos로 변경된 값을 toDos로 만들어 준다.

```
// ToDoList.tsx
function ToDoList() {
	const onDragEnd = ({ destination, source }: DropResult) => {
		let newToDos = JSON.parse(JSON.stringify(toDos));
		let moved = newToDos.splice(source.index, 1);
		newToDos.splice(destination?.index, 0, ...moved);
		setToDos(newToDos);
	};
    return (
        ...
    )
}
```

그런데 변경되는 내용을 보면 업데이트가 일어나는 경우가 있다.
화면을 보면 빠르게 업데이트가 진행되어서 화면이 깜빡거리기도 한다.
React는 부모 속성이나 state가 변경되면 화면을 새로 랜더링 한다.
이 때문에 순서만 변경해도 state가 변경되어서 새로 랜더링되는 것이다.
브라우저의 Element에서 확인해보면 드래그한 대상뿐만 아니라 모든 내용을 랜더링한다.
물론 순서를 바꾼 아래로는 내용이 변경되겠지만, 나머지는 변경되지 않아야 함에도 모든 내용을 바꾸고 있다.
이를 막기 위해서 React.memo를 사용한다.
React.memo는 컴포넌트가 동일한 props로 랜더링하면 새로 랜더링하지 않게 해준다.
다시 말해 props만 동일하다면 이전의 랜더링된 결과를 재사용한다.
그래서 프로그램의 작동 속도를 높일 수 있다.
우리의 경우 Draggable에서 동일한 index, props를 받으면 랜더링하지 않게 된다.
아래처럼 ToDoDrag.tsx 파일을 수정하면 필요없는 랜더링이 없어진다.

```
// ToDoDrag.tsx
...
export default React.memo(ToDoDrag);
```
