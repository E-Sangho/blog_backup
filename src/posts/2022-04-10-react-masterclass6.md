---
title: "React Master Class 6"
date: "2022-04-10 13:27:21"
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

## multiboard

하나의 보드에서 리스트를 표시하는 것은 완성했다.
다음으로 보드를 여러 개 만들어서 드래그 드랍 기능을 만들겠다.
그 전에 보드를 추가하기 편하도록 보드 컴포넌트를 하나 만들겠다.
ToDoBoard.tsx에 \<Droppable>의 내용을 모두 넣어준다.

```
// ToDoBoard.tsx
function ToDoBoard() {
	return (
        <ul>
            <Droppable droppableId="one">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {toDos.map((toDo, index) => (
                            <ToDoDrag key={toDo.text} index={index} toDo={toDo} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </ul>
	);
}

export default ToDoBoard;
```

\<Droppable>을 import 해준 하나씩 수정한다.
\<Droppable>은 현재 toDos와 droppableId가 필요하다.
그러므로 ToDoBoard의 매개변수로 받아와야 한다.
이때 toDos와 droppableId의 타입을 정해야 하므로 새로 인터페이스를 만든다.

```
// ToDoBoard.tsx
import { Droppable } from "react-beautiful-dnd";
import { IToDos } from "../atoms";
import ToDoDrag from "./ToDoDrag";

interface IToDoBoard {
	toDos: IToDos[];
	droppableId: string;
}

function ToDoBoard({ toDos, droppableId }: IToDoBoard) {
	return (
        <ul>
            <Droppable droppableId={droppableId}>
                ...
            </Droppable>
        </ul>
	);
}
```

그리고 ToDoList.tsx 파일로 돌아가서 \<Droppable>이 있던 곳을 ToDoBoard로 바꿔줘야 한다.
이때 toDos와 droppableId를 추가해야 한다.

```
...
import ToDoBoard from "./ToDoBoard";


function ToDoList() {
    ...
	return (
		<div>
            ...
			<DragDropContext onDragEnd={onDragEnd}>
			    <ToDoBoard toDos={toDos} droppableId={"One"} />
			</DragDropContext>
		</div>
	);
}
```

다음으로 카테고리별로 보드를 만들어보자.
"ToDo", "Doing", "Done" 3개의 보드를 만든다.
이때 droppableId로 보드의 이름을 준다.
나중에 보드에서 이 이름을 타이틀로 사용한다.

```
// ToDoList.tsx
...
function ToDoList() {
    ...
	return (
		<Window>
            ...
			<DragDropContext onDragEnd={onDragEnd}>
				<Wrapper>
					<Board>
						<ToDoBoard toDos={toDos} droppableId={"ToDo"} />
						<ToDoBoard toDos={toDos} droppableId={"Doing"} />
						<ToDoBoard toDos={toDos} droppableId={"Done"} />
					</Board>
				</Wrapper>
			</DragDropContext>
		</Window>
	);
}
```

보드에서 droppableID를 가지고 타이틀을 만든다.

```
// ToDoBoard.tsx
function ToDoBoard({ toDos, droppableId }: IToDoBoard) {
	return (
		<BoardWrapper>
			<Title>{droppableId}</Title>
            ...
		</BoardWrapper>
	);
}

export default ToDoBoard;
```

보드를 구분하기 어려우므로 간단하게 스타일을 만들어줬다.
아래는 각 파일에서 만든 styled-component다.

```
// ToDoList.tsx
...
import styled from "styled-components";

const Window = styled.div`
	background-color: ${(props) => props.theme.dominantColor};
	height: 100vh;
`;

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	margin: 20px auto;
	max-width: 720px;
`;

const Board = styled.div`
	display: grid;
	width: 100%;
	gap: 20px;
	grid-template-columns: repeat(3, 1fr);
	border-radius: 5px;
`;

function ToDoList() {
    ...
	return (
		<Window>
            ...
			<DragDropContext onDragEnd={onDragEnd}>
				<Wrapper>
					<Board>
						<ToDoBoard toDos={toDos} droppableId={"ToDo"} />
						<ToDoBoard toDos={toDos} droppableId={"Doing"} />
						<ToDoBoard toDos={toDos} droppableId={"Done"} />
					</Board>
				</Wrapper>
			</DragDropContext>
		</Window>
	);
}
```

```
// ToDoBoard.tsx
...
import styled from "styled-components";

const ToDoWrapper = styled.div`
	min-height: 120px;
	border-radius: 5px;
	margin: 12px 10px;
	text-color: ${(props) => props.theme.textColor};
`;

const BoardWrapper = styled.div`
	background-color: ${(props) => props.theme.bgColor};
	border-radius: 6px;
`;

const Title = styled.div`
	margin: 12px auto;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: bold;
	color: ${(props) => props.theme.textColor};
`;

interface IToDoBoard {
	toDos: IToDos[];
	droppableId: string;
}

function ToDoBoard({ toDos, droppableId }: IToDoBoard) {
	return (
		<BoardWrapper>
			<Title>{droppableId}</Title>
			<ul>
				<Droppable droppableId={droppableId}>
					{(provided) => (
						<ToDoWrapper
                            ...
						</ToDoWrapper>
					)}
				</Droppable>
			</ul>
		</BoardWrapper>
	);
}
```

```
// ToDoDrag.tsx
...
import styled from "styled-components";

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	margin: 6px 0px;
	border-radius: 5px;
	background-color: white;
	min-height: 30px;
	padding: 0 12px;
`;

interface IToDoDrag {
	toDo: IToDos;
	index: number;
}

function ToDoDrag({ toDo, index }: IToDoDrag) {
	return (
		<Wrapper>
			<Draggable key={toDo.text} draggableId={toDo.text} index={index}>
                ...
			</Draggable>
		</Wrapper>
	);
}
```

지금까지 완성한 보드를 보면 ToDo를 추가하면 모든 보드에 추가되고 있다.
이는 우리가 atoms에서 같은 정보를 받기 때문이다.
이전에는 카테고리별로 나누기 위해 한 state에 정보를 넣어줬다.
하지만 지금은 모든 정보가 한 번에 보여지고 있으므로 카테고리별로 저장하는 것이 좋다.
atoms를 수정하면 ToDo를 입력받는 것을 바꿔줘야 한다.
일단은 임시로 ToDoList를 만들고 추후에 추가하는 부분을 수정하겠다.
atoms.tsx를 수정해서 각 카테고리별로 저장하도록 만든다.

```
// atoms.tsx
export const toDoState = atom({
	key: "toDo",
	default: {
		ToDo: ["a", "b", "c", "d"],
		Doing: ["x", "y", "z"],
		Done: ["p", "q", "r", 's'],
	},
});
```

다음으로 toDoState와 이어진 파일을 모두 수정해줘야 한다.

```
// ToDoList.tsx
function ToDoList() {
	const [toDos, setToDos] = useRecoilState(toDoState);
	const onDragEnd = ({ destination, source }: DropResult) => {
		let newToDos = JSON.parse(JSON.stringify(toDos));
		let moved = newToDos.splice(source.index, 1);
		newToDos.splice(destination?.index, 0, ...moved);
		setToDos(newToDos);
	};
	return (
		<Window>
			<h1>ToDoList</h1>
			<DragDropContext onDragEnd={onDragEnd}>
				<Wrapper>
					<Board>
						<ToDoBoard toDos={toDos["ToDo"]} droppableId={"ToDo"} />
						<ToDoBoard
							toDos={toDos["Doing"]}
							droppableId={"Doing"}
						/>
						<ToDoBoard toDos={toDos["Done"]} droppableId={"Done"} />
					</Board>
				</Wrapper>
			</DragDropContext>
		</Window>
	);
}

export default ToDoList;
```

```
// ToDoBoard.tsx
interface IToDoBoard {
	toDos: string[];
	droppableId: string;
}

function ToDoBoard({ toDos, droppableId }: IToDoBoard) {
	return (
		<BoardWrapper>
			<Title>{droppableId}</Title>
			<ul>
				<Droppable droppableId={droppableId}>
					{(provided) => (
						<ToDoWrapper
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{toDos.map((toDo, index) => (
								<ToDoDrag
									key={toDo}
									index={index}
									toDo={toDo}
								/>
							))}
							{provided.placeholder}
						</ToDoWrapper>
					)}
				</Droppable>
			</ul>
		</BoardWrapper>
	);
}

export default ToDoBoard;
```

```
// ToDoDrag.tsx
interface IToDoDrag {
	toDo: string;
	index: number;
}

function ToDoDrag({ toDo, index }: IToDoDrag) {
	return (
		<Wrapper>
			<Draggable key={toDo} draggableId={toDo} index={index}>
				{(provided) => (
					<ToDo
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
					>
						{toDo}
					</ToDo>
				)}
			</Draggable>
		</Wrapper>
	);
}

export default React.memo(ToDoDrag);
```

이제 다시 ToDoList.tsx의 onDragEnd를 수정해줘야 한다.
이번에는 다른 박스로 옮겼을 때도 작동해야 한다.
드래그가 일어났을 때 결과를 출력해보자.

```
// ToDoList.tsx
function ToDoList() {
    ...
	const onDragEnd = (args: any) => {
		console.log(args);
	};
	return (
        ...
	);
}
```

출력 결과를 보면 destination과 source에 필요한 정보가 들어있따.
destination의 droppableId, index에 드랍 위치가 적혀 있고, source의 droppableId, index로 어디에서 왔는지 알 수 있다.
둘의 droppableId를 비교하면 다른 보드로 옮기는지 같은 보드에서 옮기는지 알 수 있다.
우선은 같은 보드에서 움직이는 경우를 만들어보자.
두 droppableId가 일치하는 경우의 코드를 만들어주면 된다.

```
// ToDoList.tsx
function ToDoList() {
	const [toDos, setToDos] = useRecoilState(toDoState);
	const onDragEnd = ({ destination, source }: DropResult) => {
		if (destination?.droppableId === source.droppableId) {
            // do Something here
		}
	};
```

이때 문제가 생기는데, toDos에서 어떤 값을 불러올지 모른다.
예를 들어서 droppableId가 "ToDo"라면 우리는 toDos의 "ToDo" 항목이 필요하다.
그런데 속성값이 바뀔 수 있으므로 toDos.### 형태로 불러올 수 없다.
대신에 toDos[###]으로 불러와야 한다.
하지만 toDos[ToDo]라고 적으면 에러가 발생한다.
이는 타입스크립트에서 string을 key값으로 쓸 수 없기 때문에 생기는 문제다.
정확히 말하면 타입스크립트는 key의 타입을 string 대신 string literal을 사용한다.
string과 string literal이 어떻게 다른지 알아보자.

### string literal

타입스크립트에서 let, const로 선언하는 것은 큰 차이가 있다.
아래의 세 예시를 보자.

```
const a = "This is a literal string";
let b = "This is a string";
const c: string = "This is a string";
```

b, c는 string 타입이다.
우선 b는 let으로 선언되었으므로 재할당이 가능하다.
그래서 타입을 string 전체로 생각한다.
c는 타입을 string이라고 지정해줬으므로 string 타입이다.
그렇다면 a는 어떨까?

a는 "This is a literal string" 타입이다.
무슨 말인가 하면 a는 상수이므로 다른 값이 들어갈 수 없다.
타입스크립트에서 string 타입은 말 그대로 string이 들어가는 타입이다.
그래서 모든 문자열이 들어갈 수 있어야 한다.
그런데 a는 상수이므로 일반적인 string이 들어갈 수 없다.
그래서 string으로 취급하지 않고, 좀 더 좁은 타입으로 생각한다.
이를 Literal Narrowing이라고 하는데, 타입의 범위를 줄여주는 것이다.
그래서 a의 타입을 "This is a literal string"만 받을 수 있는 타입으로 정한다.

앞서 toDos[ToDo]가 불가능한 이유도 이 때문이다.
ToDo라는 string을 직접적인 key의 값으로 쓸 순 없다.
대신에 아래처럼 사용할 순 있다.

```
const ToDoType = "ToDo";

toDos[ToDoType];
```

이렇게하면 ToDoType과 toDos의 key 모두 literal type이라서 해결된다.
하지만 key값이 늘어남에 따라 이렇게 일일이 지정하는 것은 불편하다.
간단한 해결법이 있는데 atom를 만들 때부터 string을 key값으로 사용하도록 하는 것이다.
이를 이해하기 위해선 우선 타입스크립트에서 타입을 선언하는 방법을 이해해야 한다.

### Declare type on TypeScript

타입스크립트에서 타입을 선언하는 것은 간단하다.
"변수이름: 타입" 형태로 적어주기만 하면 된다.
이는 배열에서도 그대로 적용되는데 "변수이름: 타입[]" 형태로 적어주면 된다.

```
let name: string = "John";

let age: number = 40;

let list: string[] = ["a", "b", "c"];
```

이때 대상이 졍해져 있으면 string literal을 사용해 범위를 줄일 수 있다.
예를 들어서 name을 "John"으로만 제한하려면 타입을 "John"으로 바꾸면 된다.

```
let name: "John" = "John";

let name: "Tom" = "Tom";    // This makes an error
```

string으로 설명했지만 number과 배열에서도 같은 방식이 적용된다.

```
let age: 30 = 30;

let age: 40 = 30;   // This makes an error

let list: "A"[] = ["A", "A"]

let list: "A"[] = ["A", "B"]    // This makes an error
```

그런데 제한된 값이 여러 개일 경우도 있다.
이 경우는 |를 사이에 두고 적어주면 된다.

```
let name: "John" | "Tom" | "Andrew" = "John";

let name: "John" | "Tom" | "Andrew" = "Tom";

let name: "John" | "Tom" | "Andrew" = "Andrew";
```

정리하자면 타입스크립트에서 타입을 정의할 때 크게 3가지 경우가 있다.

1. 하나의 고정된 값을 사용하는 경우
2. 몇 개의 선택지가 주어진 경우
3. 데이터 타입이 정해진 경우

1은 해당 값을 타입으로 사용하면 된다.
2는 각 값을 |를 사이에 두고 타입으로 사용하면 된다.
3은 string, number처럼 일반적인 타입을 쓰면 된다.

여기까지는 별로 어렵지 않다.
문제는 객체의 타입 선언이다.
객체는 key와 value 2개의 타입을 정해야 한다.
지금까지 우리는 객체의 타입을 아래와 같이 사용해왔다.

```
interface Human {
    name: "John" | "Tom" | "Andrew";
    age: 40;
    list: number[];
}
```

이는 value의 타입을 제한한 것이다.
지금까지 우리는 value만을 사용해서 문제 없었다.
이번에는 key를 사용해보자.
객체에서 key를 사용해서 value를 불러오려면 아래처럼 사용한다.

```
let obj: Human = {
    name: "John",
    age: 40,
    list: [1, 2, 3],
};

console.log(obj["name"]);

or

const thisIsName = "name";

console.log(obj[thisIsName]);
```

이때 string literal을 사용해야 하므로 let 대신에 const를 사용했다.
그런데 string을 key로 사용할 수 없는 것은 불편하다.
항상 const로 선언할 수 없고, 때로는 let으로 값을 변경할 필요가 있기 때문이다.
그러므로 key의 타입을 선언하는 법을 알아보자.
객체에서 Key의 타입을 선언하는 것은 [Index Signature](https://radlohead.gitbook.io/typescript-deep-dive/type-system/index-signatures)라고 한다.
Index Signature는 객체에 들어 있는 내용의 타입을 설정하는 것이다.
key의 타입은 [index: type] 형태로 정할 수 있다.
예를 들어 {key: string} 구조에서 key를 string으로 하고 싶으면 아래처럼 하면 된다.

```
interface Signature {
    [index: string] : string;
}
```

여기서 index는 다른 문자여도 상관 없다.
편의에 따라서 key를 사용해도 된다.
위와 같이 정의하면 key가 string이라는 것이 보장된다.
그래서 아래처럼 사용해도 문제가 없다.

```
interface Signautre {
    [index: string]: string;
}

let obj:Signature = {
    name: "John",
};

let thisIsName = "name"

console.log(obj[thisIsName]);
```

key를 string으로 정해줬으므로 let을 사용해도 된다.
다만 index signature를 정해줬으면 모든 속성이 이를 따라야 한다.
예를 들어서 위에 number를 추가하면 에러가 발생한다.

```
let obj:Signature = {
    name: "John",
    0: "Hello",        // This makes an error
}
```

key의 타입을 string과 number 둘 다 되도록 할 수도 있다.
단순히 index signature를 2번 선언해주면 된다.
다만 number이 좀 더 구체적이어야 한다는 제약이 있다.
아래를 보면 [key: string] 타입의 value의 범위가 더 넓고, [index: number]의 범위가 더 좁다.

```
interface Signautre {
    [key: string]: string | number;
    [index: number]: string;
}
```

Key를 string처럼 광범위한 타입이 아니라, 정해진 값으로 제한할 수 있다.
Mapped Type을 사용하면 되는데, in 키워드와 함께 사용하며 다음처럼 쓸 수 있다.

```
type Index = "hello" | "world";

type Signature {
    [key in Index]: string;
}
```

object의 타입 선언을 요약해보겠다.
object의 타입 선언에서 중요한 것은 Key의 타입 설정이다.
이때 Key의 타입에 따라 아래와 같은 경우가 있다.

1. Key 값이 하나인 경우(string literal인 경우)
2. Key 값이 몇 가지로 정해져 있는 경우
3. Key의 타입이 하나인 경우
4. Key의 타입이 여러 개인 경우

1은 Key가 특정 값으로 정해진 경우다.
예를 들어 아래는 Key가 name으로 정해져 있다.

```
interface ITest {
    name: string
}
```

이 경우 Key의 타입이 string literal로 지정되어 있다.
string literal로 지정되어 있으므로 string 값을 사용할 수 없다.
그래서 ITest의 속성을 let 변수로는 찾을 수 없고, const 변수로만 찾을 수 있다.

```
let obj: ITest = {
    name: "Jack",
}

const constName = "name";
let letName = "name";

console.log(obj[constName]);    // ok
console.log(obj[letName]);    // error
```

2는 Key의 값이 몇 가지로 정해진 경우다.
이 경우 string literal을 |로 나눠서 적어준다.
이때 interface 대신에 type을 사용해야 한다.

```
type testType = "name" | "age";

type ITest {
    [key in testType]: string;
}
```

3은 Key의 타입이 일괄적으로 하나의 primitive type으로 정해진 경우다.
"[key: keyType]: valueType" 형태로 key와 value의 타입을 정할 수 있다.

```
interface Itest {
    [key: string]: string
    name: string
}
```

이 방식의 장점은 앞의 1과 다르게 let으로 속성을 찾을 수 있다.
그래서 객체에서 찾는 값이 바뀌는 상황에서 사용하기 좋다.

```
let obj: ITest = {
    name: "Jack",
}

const constName = "name";
let letName = "name";

console.log(obj[constName]);    // ok
console.log(obj[letName]);    // ok
```

마지막으로 Key의 타입이 여러 개인 경우가 있다.
이때는 Key의 타입을 여러 번 선언하면 된다.
다만 number 타입의 value 폭이 더 좁아야 한다.

```
interface ITest {
    [key: string]: string | number;
    [key: number]: string;
    name: "Jack";
    0: "Hello";
}
```

### onDragEnd

다시 하던 일로 돌아가보자.
우리는 같은 보드에서 드래그 드랍이 일어날 때, 순서를 바꿔주는 일을 하고 있었다.
onDragEnd에서 droppableId로 어떤 보드에서 드랍이 일어나는지 알 수 있다.
하지만 객체에서 droppableId로 값을 찾으려고 하자 에러가 발생했다.
이제 우리는 이 것이 string literal이라서 발생한 문제라는 것을 알고 있다.
이를 해결하는 방법은 key의 타입을 string으로 정해주는 것이다.
atoms.tsx로 가서 key의 타입을 수정한다.
interface를 만들고 이를 atom에 적용시켜준다.

```
// atoms.tsx
interface IToDoState {
	[key: string]: string[];
}

export const toDoState = atom<IToDoState>({
	key: "toDo",
	default: {
		ToDo: ["a", "b", "c", "d"],
		Doing: ["x", "y", "z"],
		Done: ["p", "q", "r", "s"],
	},
});
```

이제 ToDoList.tsx로 돌아면 toDos 객체의 값을 string값으로 찾을 수 있게 된다.
아래처럼 droppableId를 key로 사용하고 있는 값을 출력해보자.

```
// ToDoList.tsx
function ToDoList() {
	...
	const onDragEnd = ({ destination, source }: DropResult) => {
		if (destination?.droppableId === source.droppableId) {
			console.log(toDos[destination?.droppableId]);
		}
	};
    ...
}
```

출력결과를 보면 드래그 드랍이 일어나는 보드의 값이 출력된다.
이제 setToDos를 사용해서 순서를 바꿔준다.
이때 toDos state를 직접적으로 바꿔줄 수 없으므로 JSON.parse(JSON.stringify(...))로 복사한 다음 값을 변경한다.
그리고 splice로 값을 변경한 다음 값을 돌려줘야 한다.
객체는 key가 중복되면 마지막 값을 사용한다.
이를 사용해서 ...로 내용을 펼쳐준 다음 변경할 값을 적어주면 된다.
그런데 이때 source.droppableId를 그대로 사용할 수 없다.
왜냐하면 source.droppableId를 그대로 입력하면, 해당 변수 안의 값이 아니라 source.droppableId 자체를 키로 생각한다.
이는 []를 사용하면 해결할 수 있는데, 왜 그런지는 조금 있다가 설명하겠다.

```
function ToDoList() {
    ...
	const onDragEnd = ({ destination, draggableId, source }: DropResult) => {
		if (destination?.droppableId === source.droppableId) {
			setToDos((oldToDos) => {
				let copiedToDos = JSON.parse(
					JSON.stringify(oldToDos[source.droppableId])
				);
				copiedToDos.splice(source.index, 1);
				copiedToDos.splice(destination.index, 0, draggableId);
				return {
					...oldToDos,
					[source.droppableId]: copiedToDos,
				};
			});
		}
	};
    ...
}
```

위에서 []를 사용한 이유를 알아보자.
자바스크립트에서 객체의 키는 string literal로 저장한다고 했다.
그렇기 때문에 따로 string으로 저장하지 않아도 알아서 string으로 변환해준다.
그러므로 아래처럼 "name"이나 anotherName으로 적어도 아무런 차이가 없다.

```
let object = {
    "name": "Jack",
    anotherName: "John",
}
```

하지만 이는 어디까지나 이름이 유효한 경우만 해당 된다.
만약 아래처럼 자바스크립트에서 이름으로 생각하지 않는 것을 적어주면 key로 인식하지 못한다.

```
let object = {
    first-name: "Jack",
}
```

자바스크립트는 위를 first - name이라고 생각한다.
그러므로 위와 같은 이름은 "first-name"이라고 적어야만 한다.
하지만 경우에 따라 진짜로 first - name이 일어나야 하는 경우가 있다.
앞서 우리도 source.droppableId의 계산 결과를 key로 사용하고자 했다.
이 경우는 대괄호를 씌우면 된다.
Key에 대괄호가 있으면 해당 값을 연산한 다음 key로 만든다.
그래서 앞의 source.droppableId를 대괄호로 묶어준 것이다.

이번에는 다른 보드로 옮길 경우의 코드를 작성해보자.
이 경우도 그다지 어렵지는 않다.
다만 destination이 항상 존재하지 않는다는 점이 문제가 된다.
앞서 작성한 코드는 destination이 존재하지않으면 (destination?.droppableId === source.droppableId)가 거짓이 되어 실행되지 않는다.
하지만 조건이 (destination?.droppableId !== source.droppableId)가 되면 destination이 존재하지 않는 경우에도 실행된다.
이때 destination의 존재를 확신할 수 없으므로 에러가 발생한다.
그래서 코드의 첫 부분에 destination이 존재하지 않으면 return이 일어나도록 한다.

```
function ToDoList() {
    ...
	const onDragEnd = ({ destination, draggableId, source }: DropResult) => {
		if (!destination) return;
		if (destination?.droppableId === source.droppableId) {
            ...
		}
		if (destination?.droppableId !== source.droppableId) {
			setToDos((oldToDos) => {
				let desCopy = JSON.parse(
					JSON.stringify(oldToDos[destination.droppableId])
				);
				let sourceCopy = JSON.parse(
					JSON.stringify(oldToDos[source.droppableId])
				);
				sourceCopy.splice(source.index, 1);
				desCopy.splice(destination.index, 0, draggableId);
				return {
					...oldToDos,
					[destination.droppableId]: desCopy,
					[source.droppableId]: sourceCopy,
				};
			});
		}
	};
    ...
}
```

### fix some problem

보드를 보면 몇 가지 문제점이 있다.
우선 ToDo를 옮기면 ToDo 전체가 밀려나는 것이 아니라, 글자가 밀려나는 현상이 있다.
이는 \<ToDoDrag>가 \<Draggable>외에 \<Wrapper>로 감싸져 있어서 그렇다.
\<Wrapper>의 빈 공간으로 들어오려고 한다고 인식해서 밀어내는 것이다.
그래서 \<Wrapper>를 삭제하고 아래처럼 변경했다.

```
// ToDoDrag.tsx
const ToDo = styled.div`
	background-color: white;
	min-height: 30px;
	border-radius: 5px;
	padding: 0 12px;
	margin-bottom: 5px;
	display: flex;
	align-items: center;
`;

function ToDoDrag({ toDo, index }: IToDoDrag) {
	return (
		<Draggable key={toDo} draggableId={toDo} index={index}>
			{(provided) => (
				<ToDo
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					{toDo}
				</ToDo>
			)}
		</Draggable>
	);
}
```

다음으로 드래그 한 ToDo를 보드의 밑에 넣으면 인식되지 않는 현상이 있다.
특히 보드가 비어 있을 때 그런 현상이 많이 일어난다.
ToDoBoard.tsx로 이동해서 \<ToDoWrapper>에 background-color: red 속성을 주자.
브라우저를 확인해보면 드래그 가능한 범위가 나온다.
범위를 보면 굉장히 협소하다.
드래그 범위를 변경하기 위해서 flex-grow 속성을 사용한다.
flex-grow는 flex-item인 요소가 얼마나 많은 공간을 차지하는지를 정한다.
만약 컨텐츠가 3개가 있고 각각 flex-grow: 1이라면 1:1:1 비율로 공간을 차지한다.
우리는 딱 하나의 컨텐츠가 공간을 차지하므로 flex-grow: 1을 주면 모든 공간을 차지할 것이다.
\<ToDoWrapper>에 flex-grow: 1을 적어준다.
이때 상위 컨텐츠가 display: flex 여야만 작동한다.
그런데 우리 파일은 중간에 \<ul>이 있어서 제대로 동작하지 않는다.
\<ul>을 지우고 아래처럼 만들면 드래그 공간이 가득찬다.

```
// ToDoBoard.tsx
import { Droppable } from "react-beautiful-dnd";
import ToDoDrag from "./ToDoDrag";
import styled from "styled-components";

const ToDoWrapper = styled.div`
    ...
	background-color: red;
	flex-grow: 1;
`;

const BoardWrapper = styled.div`
    ...
	display: flex;
	flex-direction: column;
`;

function ToDoBoard({ toDos, droppableId }: IToDoBoard) {
	return (
		<BoardWrapper>
			<Title>{droppableId}</Title>
			<Droppable droppableId={droppableId}>
				{(provided) => (
					<ToDoWrapper
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
						{toDos.map((toDo, index) => (
							<ToDoDrag key={toDo} index={index} toDo={toDo} />
						))}
						{provided.placeholder}
					</ToDoWrapper>
				)}
			</Droppable>
		</BoardWrapper>
	);
}
```

### snapshot

보통 드래그 드랍이 일어날 때 색을 변경해서 알려준다.
드래그가 일어나는 곳은 음영이 지고, 드랍이 가능한 곳의 색이 변경되면서 사용자가 직관적으로 알 수 있다.
이 기능을 react-beautiful-dnd를 사용하면 쉽게 쓸 수 있다.
이전에 provided를 소개했었다.
\<Droppable>은 자식을 함수 형태로 받는다.
함수에 provided를 전해줄 수 있고, 이를 사용해 드래그 기능을 구현했다.
이때 provided 외에 snapshot이라는 변수를 전달할 수 있다.
snapshot은 아래의 속성을 사용한다.

-   isDraggingOver: boolean
-   draggingOverWith?: DraggableId | undefined
-   draggingFromThisWith?: DraggableId | undefined
-   isUsingPlaceholder: boolean

isDraggingOver는 \<Droppable> 위로 드래그 했는지 여부를 알려준다.
draggingOverWith은 \<Droppable> 위로 드래그 되는 대상의 draggableId를 알려준다.
draggingFromThisWith은 현재 보드에서 드래그 중인것의 draggableId를 알려준다.
같은 보드 내에서 드래그 중이면 draggableId가 나오지만, 다른 보드로 옮기면 undefined가 된다.
이를 사용해서 다른 보드로 옮겼는지 여부를 알 수 있다.

이제 snapshot을 사용해보자.
\<Droppable>의 자식에 snapshot을 추가한다.
그리고 \<ToDoWrapper>에 isDraggingOver과 draggingFromThisWith을 사용해서 색을 변경시키겠다.
우선 isDraggingOver이 true일 경우 blue, false일 경우 red가 되도록 만든다.

```
// ToDoBoard.tsx
interface IToDoWrapper {
	isDraggingOver: boolean;
}

const ToDoWrapper = styled.div<IToDoWrapper>`
	border-radius: 5px;
	margin: 12px 10px;
	text-color: ${(props) => props.theme.textColor};
	background-color: ${(props) => (props.isDraggingOver ? "blue" : "red")};
	flex-grow: 1;
`;

function ToDoBoard({ toDos, droppableId }: IToDoBoard) {
	return (
		<BoardWrapper>
			<Title>{droppableId}</Title>
			<Droppable droppableId={droppableId}>
				{(provided, snapshot) => (
					<ToDoWrapper
                        ...
						isDraggingOver={snapshot.isDraggingOver}
					>
                        ...
					</ToDoWrapper>
				)}
			</Droppable>
		</BoardWrapper>
	);
}
```

ToDo를 드래그해보면 위에 있을 때 파란색으로 바뀐다.
다음으로 draggingFromThisWith를 사용해보자.
draggingFromThisWith는 현재 보드에서 드래그하고 있는 대상의 draggableId를 표시한다.
만약 드래그 중인 대상이 현재 보드에 없다면 undefined가 나온다.
이를 사용해서 boolean(draggingFromThisWith)를 하면 원본 보드를 찾을 수 있다.
드래그 중인 ToDo가 현재 보드에 속한다면 boolean([x])로 true가 나온다.
반대로 ToDo가 현재 보드에 속하지 않는다면 boolean(undefined)로 false가 나온다.
이를 사용해서 아래처럼 색을 변경할 수 있다.

```
// ToDoBoard.tsx
interface IToDoWrapper {
	isDraggingOver: boolean;
	draggingFromThisWith: boolean;
}

const ToDoWrapper = styled.div<IToDoWrapper>`
    ...
	background-color: ${(props) => {
		return props.isDraggingOver
			? "blue"
			: props.draggingFromThisWith
			? "pink"
			: "red";
	}};
	...
`;

function ToDoBoard({ toDos, droppableId }: IToDoBoard) {
	return (
		<BoardWrapper>
            ...
				{(provided, snapshot) => (
					<ToDoWrapper
						ref={provided.innerRef}
						{...provided.droppableProps}
						isDraggingOver={snapshot.isDraggingOver}
						draggingFromThisWith={Boolean(
							snapshot.draggingFromThisWith
						)}
					>
                        ...
					</ToDoWrapper>
                ...
	);
}
```

이제 보드를 보면 드랍 가능한 범위는 붉은색이다.
드래그 중인 대상이 보드 위에 있으면 파란색이 된다.
그리고 드래그한 ToDo가 본래 속했던 보드는 핑크색으로 표시된다.
마지막으로 transition 효과를 주면 좀 더 보기 좋다.

```
// ToDoBoard.tsx
const ToDoWrapper = styled.div<IToDoWrapper>`
    ...
	background-color: ${(props) => {
		return props.isDraggingOver
			? "blue"
			: props.draggingFromThisWith
			? "pink"
			: "red";
	}};
	transition: background-color 0.2s ease-in-out;
`;
```

ToDo가 드래그 될 때도 색을 바꿔준다.
\<Draggable>에서도 snapshot을 사용해서 색을 바꾼다.
드래그 중이면 색을 파란색으로 바꾸고, 그림자도 생기게 만들었다.

```
// ToDoDrag.tsx
const ToDo = styled.div<{ isDragging: boolean }>`
	background-color: ${(props) => (props.isDragging ? "#18A3EA" : "white")};
	...
	box-shadow: ${(props) =>
		props.isDragging ? "3px 3px 5px rgba(0, 0, 0, 0.3)" : "none"};
`;

function ToDoDrag({ toDo, index }: IToDoDrag) {
	return (
		<Draggable key={toDo} draggableId={toDo} index={index}>
			{(provided, snapshot) => (
				<ToDo
					isDragging={snapshot.isDragging}
					...
				>
					{toDo}
				</ToDo>
			)}
		</Draggable>
	);
}
```

이제 드래그시에 필요한 일은 끝냈다.
드래그 범위를 알기 위해 정했던 색을 일반적인 색으로 다시 바꿔줬다.

```
// ToDoBoard.tsx
const ToDoWrapper = styled.div<IToDoWrapper>`
	...
	background-color: ${(props) => {
		return props.isDraggingOver
			? "#F88100"
			: props.draggingFromThisWith
			? "#2441B1"
			: "transparent";
	}};
	...
`;
```

## ref

### ref

react-beautiful-dnd에서 ref를 사용했었다.
당시 ref가 어떤 의미인지 설명하지 않았다.
이번에 ref가 어떤 의미가 있고 또 어떻게 사용할 수 있는지 알아보겠다.

자바스크립트에서 querySelector는 id나 class로 요소를 선택할 수 있었다.
반면 React는 자바스크립트로 element를 만들기 때문에 querySelector를 사용하지 않는다.
그래서 하나의 요소를 선택하려면 다른 방법을 사용해야 한다.
우선은 우리가 아는 방식으로 해결 가능한지 생각해보자.
React는 부모의 props를 사용해서 자식을 다룬다.
그러므로 자식을 다루도록 state를 전달해서 해결해야 한다.
하지만 state로 모든 것을 해결할 순 없다.
예를 들어서 input의 foucus나 blur, 스크롤 조작 같은 경우를 보자.
기존 자바스크립트에서 `document.querySelector("#myInput").focus()`와 같이 처리하던 일은 state로 처리할 수 없다.
그래서 React에서도 요소를 직접 선택하는 방법이 필요하다.

React에서 요소를 직접 지정하려면 ref를 사용한다.
ref는 컴포넌트의 요소로 참조 대상을 저장하는데 쓰인다.
예를 들어서 `<input ref={myInput} />`이라고 적으면, myInput은 input 컴포넌트를 가리키게 된다.
ref를 만들려면 useRef를 사용해야 한다.
useRef는 useState와 비슷하게 초기값을 받아서 ref를 초기화 시켜준다.
useRef를 사용해서 ref를 만들고 input에 ref 속성을 줘서 연결해보자.
그리고 버튼을 눌러서 ref에 어떤 내용이 있는지 보자.

```
// ToDoBoard.tsx
import { useRef } from "react";

function ToDoBoard({ toDos, droppableId }: IToDoBoard) {
	const myInput = useRef(null);
	const onClick = () => {
		console.log(myInput);
		// {current: input}
	};
	return (
		<BoardWrapper>
			<input ref={myInput} />
			<button onClick={onClick}>click me</button>
			...
	)
}
```

버튼을 누르면 {current: input}이라고 나온다.
보다시피 ref는 굉장히 간단하다.
current에 현재 지정한 대상을 가리키고 있다.
그래서 ref.current는 input을 가리킨다.
이는 자바스크립트에서 document.querySelector("#myInput")으로 요소를 지정하는 것과 비슷하다.

그런데 querySelector는 해당 요소를 반환해서 바로 쓸 수 있었던 반면, ref는 current를 써야 한다.
ref가 곧 input을 가리킨다면 더 쓰기 편할텐데 왜 그렇지 않을까?
이를 설명하기 위해선 우선 closure를 설명해야 한다.

### closure

잠시 수학의 closure를 설명하겠다.
집합에서 연산 결과가 다시 그 집합에 속하면 closed라고 한다.
예를 들어서 자연수의 덧셈은 다시 자연수에 속하므로 closed라고 할 수 있다.
closed 여부를 정하는 것은 집합과 연산에 따라 다르다.
먄약 자연수에 - 연산을 한다면 음수가 나오므로 closed가 아니다.
그런데 closed 여부는 굉장히 중요하다.
집합이 closed여야만 집합의 특성을 유의미하게 알 수 있기 때문이다.
예를 들어서 자연수에서만 성립하는 특징이 있다고 하자.
자연수는 + 연산에서 closed이므로 연산 결과도 같은 성질을 보이게 된다.
반면 - 연산은 범위를 벗어나므로 같은 특징을 가질거라는 보장이 없다.

다행히도 closed가 아닌 집합 S를 포함하면서 가장 작은 closed 집합이 존재한다.
다시 말해 closed가 아닌 집합도, 적절히 확장하면 closed가 되도록 만들 수 있다.
이를 closure이라고 한다.
핵심은 조건이 맞지 않을 때 적당히 넓혀서 조건을 만족할 수 있다는 것과, 이를 closure이라고 한다는 것이다.

프로그래밍에서 closure는 위의 개념과 유사하다.
어떤 함수를 실행하는데 필요한 변수를 세트로 만들어서, 다른 곳에서도 함수를 실행할 수 있도록 만든 것이다.
이를 설명하기 위해선 자바스크립트가 함수를 return 할 수 있다는 것에서부터 시작해야 한다.
아래 예시를 보자.

```
function makeFunc() {
	var name = "Mozilla";
	function displayName() {
		alert(name);
	}
	return displayName;
}

var myFunc = makeFunc();
// myFunc에 displayName을 반환한다.

myFunc();
// 반환된 displayName 함수를 실행한다.

```

makeFunc 함수는 displayName 함수를 반환한다.
이때 함수를 새로운 변수에 할당할 수도 있고, 리던된 함수를 실행하는 것도 가능하다.
이를 보면 myFunc가 아래처럼 선언되었다고 생각할 수 있다.

```
var myFunc = function () {
	alert(name);
}
```

만약 위와 같이 정의되었다면 name이 없으므로 에러가 발생해야 한다.
하지만 함수를 실행시키면 정상적으로 작동한다.
이는 return이 일어날 때 함수뿐만 아니라 변수도 같이 반환하기 때문이다.
그래서 makeFunc에서 선언한 name이 함께 포함되어 있고, 함수가 정상 작동하는 것이다.
이처럼 함수가 반환될 때 함수와 지역 변수를 조합한 것을 closure라고 한다.
다시 말해 closure는 함수가 실행되기 위해 필요한 변수를 포함한 것이다.
이는 수학의 closure처럼 조건을 만족하기 위해 범위를 넓힌 것이다.

closure의 장점은 원본을 그대로 유지한다는 점이다.
예를 들어 아래 예시를 보자.

```
function makeAdder(x) {
	var y = 1;
	return function(z) {
	y = 100;
	return x + y + z;
	};
}

let addNum = 5;

var add5 = makeAdder(addNum);

addNum = 10

var add10 = makeAdder(addNum);

console.log(add5(2));  // 107 (x:5 + y:100 + z:2)
console.log(add10(2)); // 112 (x:10 + y:100 + z:2)
//함수 실행 시 클로저에 저장된 x, y값에 접근하여 값을 계산
```

closure는 만들 당시의 환경을 저장한다.
add5와 add10이 closure로 이들은 같은 함수로부터 만들어졌지만 addNum의 값이 서로 다르다.
이때 x의 값은 addNum 값을 따라가지 않는다.
closure는 함수가 만들어질 당시의 x, y를 기억하기 때문에 값이 바뀌더라도 이에 영향을 받지 않는다.

이번에는 아래 예시를 보자.

```
function makeAdder(x) {
	var y = 1;
	return function(z) {
	y = 100;
	return x.current + y + z;
	};
}

let addNum = { current: 5 };

var add5 = makeAdder(addNum);

addNum.current = 10;

var add10 = makeAdder(addNum);

console.log(add5(2));  // 112 (x:10 + y:100 + z:2)
console.log(add10(2)); // 112 (x:10 + y:100 + z:2)
//
```

위 예시는 x 대신에 x.current로 계산하도록 바꾼 것이다.
그런데 이번에는 addNum.current의 값이 바뀌자 closure에 저장된 값도 바뀌었다.
이는 앞의 closure이 literal을 복사해서 깊은 복사가 이뤄진 반면, 이번에는 객체를 복사하므로 얕은 복사가 이뤄졌기 때문이다.
그래서 객체 내부의 값이 바뀌면 closure에도 영향을 준다.

### current

앞서 closure에서 객체를 사용할 경우를 살펴봤다.
이때는 값이 바뀌면 모든 closure이 영향을 받았다.
이는 ref에서 current를 사용하는 이유다.
ref의 값을 변경할 필요가 있다고 하자.
그런데 current를 사용하지 않으면, 이전에 ref로 반환했던 내용이 영향을 받지 않는다.
이를 방지하기 위해서 ref가 직접적으로 값을 가리키는 것이 아니라, current를 사용한다.
그렇게 함으로 참조 상태를 유지하고 값의 변경이 일괄적으로 적용된다.

### ref again

다시 ref의 설명으로 돌아가자.
ref는 useRef를 사용해서 만들고, current에 참조 대상이 저장된다.
이를 사용해서 input에 ref를 사용할 수 있다.
ref를 사용해서 클릭을 누르면 input으로 포커스가 옮겨가도록 만든다.

```
// ToDoBoard.tsx
function ToDoBoard({ toDos, droppableId }: IToDoBoard) {
	const inputRef = useRef(null);
	const onClick = () => {
		inputRef.current?.focus();
	};
	return (
		<BoardWrapper>
			<input ref={inputRef} />
			<button onClick={onClick}>click me</button>
			...
		</BoardWrapper>
	);
}
```

React를 사용한다면 위 코드만으로 작동해야 한다.
우리는 타입스크립트를 사용하고 있으므로 에러가 나온다.
이는 useRef에 타입을 지정해주지 않아서 나오는 것이다.
input의 ref위에 커서를 올리면 HTMLInputElement 타입이란 것을 알 수 있다.

```
// ToDoBoard.tsx
function ToDoBoard({ toDos, droppableId }: IToDoBoard) {
	const inputRef = useRef<HTMLInputElement>(null);
	...
}
```

### Form

ToDo를 입력받고 추가할 Form을 만들겠다.
이전에 사용했던 react-hook-form을 사용했다.
우선은 AddToDo.tsx 파일에 아래처럼 만들어준다.
이전에 react-hook-form을 만들때 했던 방식 그대로 했으므로 설명은 생략한다.

```
// AddToDo.tsx
import { useForm } from "react-hook-form";
import styled from "styled-components";

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
`;

const Form = styled.form`
	width: 360px;
`;
const Input = styled.input`
	width: 100%;
	height: 24px;
`;

function AddToDo() {
	const { register, handleSubmit } = useForm();
	const onValid = (data: any) => {
		console.log(data);
	};
	return (
		<Wrapper>
			<Form onSubmit={handleSubmit(onValid)}>
				<Input
					{...register("ToDo", { required: true })}
					type="text"
					placeholder={"Add ToDo"}
				/>
			</Form>
		</Wrapper>
	);
}

export default AddToDo;
```

그리고 AddToDo를 ToDoList.tsx에 넣어준다.

```
// ToDoList.tsx
import AddToDo from "./AddToDo";

function ToDoList() {
	...
	return (
		<Window>
			<h1>ToDoList</h1>
			<AddToDo />
			...
		</Window>
	);
}
```

이제 AddToDo.tsx 파일만 신경쓰면 된다.
우리가 할 일은 제출된 ToDo를 atom에 추가하는 일이다.
일을 계속하기 전에 atom을 수정해보자.
현재 우리는 atom에 임시로 ToDo를 저장해서 사용하고 있다.
우리가 추가할 ToDo는 id와 text를 사용해야 한다.
아래처럼 ToDo interface를 만들고 value의 타입으로 지정해준다.
그리고 toDoState의 default를 모두 []로 만든다.

```
// atoms.tsx
import { atom } from "recoil";

interface ToDo {
	id: number;
	text: string;
}

interface IToDoState {
	[key: string]: ToDo[];
}

export const toDoState = atom<IToDoState>({
	key: "toDo",
	default: {
		ToDo: [],
		Doing: [],
		Done: [],
	},
});
```

이렇게 하면 에러가 발생한다.
이는 이전에 value를 string으로 사용한 반면, 지금은 ToDo를 사용하고 있기 때문이다.
ToDoList.tsx를 보면 toDos를 전달하는데 문제가 있다.
이는 ToDoBoard.tsx에서 타입을 string[]으로 지정했기 때문에 생긴 문제다.
atoms.tsx의 ToDo를 export로 바꾼 다음 ToDoBoard.tsx에서 import 한다.
그리고 toDos의 타입을 ToDo[]로 바꾼다.

```
// atoms.tsx
export interface ToDo {
	id: number;
	text: string;
}
```

```
// ToDoBoard.tsx
import { ToDo } from "../atoms";

interface IToDoBoard {
	toDos: ToDo[];
	droppableId: string;
}
```

이렇게하면 ToDoList.tsx의 에러는 고쳤다.
다음으로 ToDoBoard.tsx에 에러가 발생한다.
key와 toDo에 number, string이 아닌 ToDo 타입을 넣어주고 있어서 문제가 된다.
이는 toDo.id, toDo.text로 수정하면 해결된다.

```
// ToDoBoard.tsx
function ToDoBoard({ toDos, droppableId }: IToDoBoard) {
	return (
		<BoardWrapper>
			...
						{toDos.map((toDo, index) => (
							<ToDoDrag
								key={toDo.id}
								index={index}
								toDo={toDo.text}
							/>
						))}
			...
		</BoardWrapper>
	);
}
```

다음으로 드래그 종료시의 함수를 수정해야 한다.
atoms.tsx에서 임시로 데이터를 넣어보자.

```
// atoms.tsx
export const toDoState = atom<IToDoState>({
	key: "toDo",
	default: {
		ToDo: [
			{ id: 1, text: "foo" },
			{ id: 2, text: "bar" },
		],
		Doing: [
			{ id: 3, text: "baz" },
			{ id: 4, text: "fie" },
		],
		Done: [
			{ id: 5, text: "foe" },
			{ id: 6, text: "fee" },
		],
	},
});
```

이제 ToDoList.tsx의 onDragEnd 함수를 수정해야 한다.
변경할 대상이 string이 아니라 객체라는 점만 다르다.
이전에는 droppable를 바로 넣어줬다.
droppableId가 곧 text였기 때문이다.
이제 넣어주는 데이터 타입이 바뀌었으므로 droppableId만으로 해결할 수 없다.
대신에 source의 index를 가지고 해결한다.
source.index에 삭제되는 데이터 위치가 들어있다.
이 위치의 정보를 저장한 다음에 나중에 이 값을 추가해주면 해결된다.

```
// ToDoList.tsx
function ToDoList() {
	...
	const onDragEnd = ({ destination, draggableId, source }: DropResult) => {
		...
		if (destination?.droppableId === source.droppableId) {
			setToDos((oldToDos) => {
				...
				let tempSave = copiedToDos[source.index];
				copiedToDos.splice(source.index, 1);
				copiedToDos.splice(destination.index, 0, tempSave);
				...
			});
		}
		if (destination?.droppableId !== source.droppableId) {
			setToDos((oldToDos) => {
				...
				let tempSave = sourceCopy[source.index];
				sourceCopy.splice(source.index, 1);
				desCopy.splice(destination.index, 0, tempSave);
				...
			});
		}
	};
	...
}
```

이제 atoms의 데이터를 수정하면서 바뀐 것을 다 고쳤다.
하던 일로 돌아가서 ToDo를 추가하는 일을 끝내자.
toDo의 데이터 타입은 string이므로 interface를 만들어서 적용시킨다.

```
// AddToDo.tsx
interface IForm {
	toDo: string;
}

function AddToDo() {
	const setToDo = useSetRecoilState(toDoState);
	const { register, setValue, handleSubmit } = useForm<IForm>();
	const onValid = ({ toDo }: IForm) => {
		...
	};
	return (
		<Wrapper>
			<Form onSubmit={handleSubmit(onValid)}>
				<Input
					{...register("toDo", { required: true })}
					type="text"
					placeholder={"Add ToDo"}
				/>
			</Form>
		</Wrapper>
	);
}
```

이제 onValid 안에 새로운 ToDo를 만들고, toDoState에 추가해주면 끝이다.
id는 Date.now()를 사용해서 서로 겹치지 않게 만들었다.
그리고 제출되면 setValue로 값을 ""로 돌려준다.

```
function AddToDo() {
	...
	const onValid = ({ toDo }: any) => {
		const newToDo = {
			id: Date.now(),
			text: toDo,
		};
		setToDo((oldToDo) => {
			return {
				...oldToDo,
				ToDo: [...oldToDo["ToDo"], newToDo],
			};
		});
		setValue("toDo", "");
	};
	...
}
```

이제 모든 일이 끝났으므로 atoms의 임시 데이터를 지워준다.

```
// atoms.tsx
export const toDoState = atom<IToDoState>({
	key: "toDo",
	default: {
		ToDo: [],
		Doing: [],
		Done: [],
	},
});
```

해야할 일

1. local storage에 데이터 저장
2. ToDo를 삭제하는 버튼 또는 드래그로 삭제하는 쓰레기통 만들기
3. 보드의 순서 바꾸기
4. 새로운 보드 만들기

## 참고

1. [Index Signature](https://radlohead.gitbook.io/typescript-deep-dive/type-system/index-signatures)
2. [why do refs have a key named current](https://tkplaceholder.io/why-do-refs-have-a-key-named-current/)
3. [closure](https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures)
