---
layout: post
title: React for Beginner 5
date: Sun Dec 12 23:32:49 JST 2021
categories: React
tag:
toc: true
---

```
import { useState } from "react";

function App() {
  const [counter, setValue] = useState(0);
  const onClick = () => setValue((prev) => prev + 1);
  console.log("i run all the time");
  return (
    <div>
      <h1>{counter}</h1>
      <button onClick={onClick}>click me</button>
    </div>
  );
}

export default App;
```

현재 우리 코드는 state가 바뀔 때마다 App이 다시 랜더링 된다.
그리고 "i run all the time"이 콘솔에 계속 출력된다.
다시말해 App 내부의 모든 코드가 다시 실행되는 것이다.

그런데 경우에 따라서 처음에만 실행되고 다시 실행되지 않는 함수가 필요할 수 있다.
예를 들어 API를 가져오는 기능은 처음 한 번에만 작동하면 된다.
이럴 때 사용할 수 있는 것이 `useEffect(effect, deps)`다.
useEffect의 첫 번째 변수에는 한 번만 실행하고 싶은 함수를 적어주면 된다.
아래 코드를 실행해서 콘솔을 확인해보면, 버튼을 클릭하면 useEffect 안의 함수는 한 번만 실행된다.

```
import { useState, useEffect } from "react";

function App() {
  const [counter, setValue] = useState(0);
  const onClick = () => setValue((prev) => prev + 1);
  console.log("i run all the time");
  function useOnce() {
      console.log("i run only once");
  };
  useEffect(useOnce, []);
  return (
    <div>
      <h1>{counter}</h1>
      <button onClick={onClick}>click me</button>
    </div>
  );
}

export default App;
```

다음으로 useEffect()의 두 번째 변수 deps(Dependencies)를 알아보자.
useEffect()는 deps로 지정한 것이 변화될 경우 함수를 실행시킨다.
이를 사용하면 특정 부분이 바뀔 때만 코드가 실행되도록 만들 수 있다.
예를 들어서 검색창을 만들려고 한다.
그러면 input으로 검색창을 만드고, onChange에 실행시킬 함수를 적어준다.
그리고 keyword가 바뀔 때마다 검색어를 출력시켜주려고 한다.
이때 useEffect()의 deps로 [keyword]를 적어주면, keyword가 바뀔 때마다 코드가 실행된다.
이를 그대로 만든다면 아래처럼 된다.

```
function App() {
  const [counter, setValue] = useState(0);
  const [keyword, setKeyword] = useState("");
  const onClick = () => setValue((prev) => prev + 1);
  const onChange = (event) => setKeyword(event.target.value);
  console.log("I run all the time");
  useEffect(() => {
    console.log("I run when 'keyword' changes.");
  }, [keyword]);
  console.log("Search keyword is ", keyword);
  return (
    <div>
      <input
        value={keyword}
        onChange={onChange}
        type="text"
        placeholder="Search here..."
      />
      <h1>{counter}</h1>
      <button onClick={onClick}>click me</button>
    </div>
  );
}
```

그런데 콘솔을 확인해보면 keyword에 아무것도 없는 경우도 출력된다.
이는 if로 조건을 추가하면 간단히 해결된다.
추가로 길이가 5보다 큰 경우에만 출력되도록 만들었다.

```
function App() {
  const [counter, setValue] = useState(0);
  const [keyword, setKeyword] = useState("");
  const onClick = () => setValue((prev) => prev + 1);
  const onChange = (event) => setKeyword(event.target.value);
  useEffect(() => {
    console.log("I run only once.");
  }, []);
  useEffect(() => {
    if (keyword !== "" && keyword.length > 5) {
        console.log("Search keyword is ", keyword);
    }
  }, [keyword]);
  return (
    <div>
      <input
        value={keyword}
        onChange={onChange}
        type="text"
        placeholder="Search here..."
      />
      <h1>{counter}</h1>
      <button onClick={onClick}>click me</button>
    </div>
  );
}
```

deps에는 동시에 여러개를 적을 수도 있다.
예를 들어서 [counter, keyword]라고 적으면 counter 또는 keyword가 바뀔 때, 실행되는 함수를 만들 수 있다.

```
import { useState, useEffect } from "react";

function App() {
  const [counter, setValue] = useState(0);
  const [keyword, setKeyword] = useState("");
  const onClick = () => setValue((prev) => prev + 1);
  const onChange = (event) => setKeyword(event.target.value);
  useEffect(() => {
    console.log("I run only once.");
  }, []);
  useEffect(() => {
    console.log("I run when 'keyword' changes.");
  }, [keyword]);
  useEffect(() => {
    console.log("I run when 'counter' changes.");
  }, [counter]);
  useEffect(() => {
    console.log("I run when keyword & counter change");
  }, [keyword, counter]);
  return (
    <div>
      <input
        value={keyword}
        onChange={onChange}
        type="text"
        placeholder="Search here..."
      />
      <h1>{counter}</h1>
      <button onClick={onClick}>click me</button>
    </div>
  );
}

export default App;
```

마지막으로 cleanup을 알아보겠다.
cleanup은 component가 없어질 때, 작동하는 함수로 effect에서 return으로 받은 함수가 사용된다.
아래는 버튼을 누르면 <Hello /> component가 생성되고 없어지는 코드다.
<Hello />가 없어지면 useEffect()에서 받은 cleanup이 실행되므로, 콘솔에는 "bye :("가 출력된다.

```
import { useState, useEffect } from "react";

function Hello() {
    useEffect(() => {
        console.log("hi :)");
        return () => console.log("bye :(");
    }, []);
    return <h1>Hello</h1>;
}

function App() {
    const [showing, setShowing] = useState(false);
    const onClick = () => setShowing((prev) => !prev);
    return (
        <div>
        {showing ? <Hello /> : null}
        <button onClick={onClick}>{showing ? "Hide" : "Show"}</button>
        </div>
    );
}

export default App;
```

지금까지 써왔던 것을 정리하기에 앞서 React가 정확히 어떤 단계로 작동하는지 알아보자.
React는 크게 3단계로 생성, 업데이트, 제거로 나뉜다.

< 생성 >

1. ReactDOM.render()이 실행된다.
2. ReactDOM.render() 안의 component가 호출된다.
3. component의 constructor이 실행된다.
4. component의 props를 가져온다.
5. component 안의 코드가 실행 된 후에 render()이 호출된다.
6. DOM을 업데이트 한다.
7. Mount

< 업데이트 >

1. 새로운 prop 입력 or setState() 실행
2. componet 업데이트
3. render() 호출
4. DOM을 업데이트
5. Update 실행

< 제거 >

-   Unmount
