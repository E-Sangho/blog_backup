---
layout: post
title: React for Beginner 6
date: Tue Dec 21 17:31:48 JST 2021
categories: React
tag:
toc: true
---

## Todo

지금까지 알아본 내용을 바탕으로 간단하게 몇 가지를 만들어보겠다.
처음 만들어볼 것은 ToDoList다.
ToDoList는 우리가 해야 할 일을 작성하는데 사용하는 애플리케이션으로 앱스토어에서 종종 볼 수 있다.
이와 유사한 기능을 간단하게 만들어볼텐데, 하고 싶은 내용을 적으면 버튼으로 추가하는 기능을 만들겠다.
그리고 추가한 리스트를 페이지에서 볼 수 있도록 해주겠다.

우선 처음으로 필요한 것은 toDo라는 하고 싶은 일을 input으로 받아들이는 변수다.
toDo를 useState로 만들어주면 이제 내용을 입력받아야 한다.
input으로 받은 내용을 사용하기 위해서 form 안에 button을 만들어서 제출하도록 만들었다.
기본적인 구조는 아래처럼 된다.

```
import { useState } from "react";

function App() {
    const [toDo, setToDo] = useState("");
    return (
        <form>
            <input />
            <button>Add ToDo</button>
        </form>
    );
}

export default App;
```

우선 input부터 만들어보자.
우리가 설정해야 할 것은 input의 value, onChange, type, placeholder다.
type은 "text", placeholder는 "Write your to do..."로 간단하게 적어줬다.
value는 당연히 {toDo}가 되어야 하고, 이제 남은 것은 onChange에 들어갈 함수다.

```
import { useState } from "react";

function App() {
    const [toDo, setToDo] = useState("");

    return (
        <form>
            <input
                value={toDo}
                onChange={onChange}
                type="text"
                placeholder="Write your to do..."
            />
            <button>Add ToDo</button>
        </form>
    );
}

export default App;
```

onChange에서는 setToDo로 toDo의 값을 바꿔줘야 한다.
이를 위해서 input의 현재 값을 사용해야 하는데, onChange에서 event를 출력해서 어떤 구조로 값이 들어있는지 확인해보자.

```
import { useState } from "react";

function App() {
    const [toDo, setToDo] = useState("");

    const onChange = (event) => {
        console.log(event);
    };

    return (
        <form>
            <input
                value={toDo}
                onChange={onChange}
                type="text"
                placeholder="Write your to do..."
            />
            <button>Add ToDo</button>
        </form>
    );
}

export default App;
```

출력된 결과를 보면 input의 값은 event.target.value에 들어있다.
그러므로 setToDo에 event.target.value의 값을 넣어주면 된다.

```
import { useState } from "react";

function App() {
    const [toDo, setToDo] = useState("");

    const onChange = (event) => {
        setToDo(event.target.value);
    };

    return (
        <form>
            <input
                value={toDo}
                onChange={onChange}
                type="text"
                placeholder="Write your to do..."
            />
            <button>Add ToDo</button>
        </form>
    );
}

export default App;
```

이제 버튼을 눌러서 제출을 해보면 화면이 새로고침된다.
이는 form에서 제출이 일어나면 기본족으로 화면이 새로고침 되기 때문이다.
이를 막기 위해선 form에서 제출이 일어날 경우 실행되는 onSubmit을 만들어줘야 한다.
onSubmit에는 event.preventDefault()로 브라우저가 새로고침 되는 것을 막아준다.

```
import { useState } from "react";

function App() {
    const [toDo, setToDo] = useState("");

    const onChange = (event) => {
        setToDo(event.target.value);
    };

    const onSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                value={toDo}
                onChange={onChange}
                type="text"
                placeholder="Write your to do..."
            />
            <button>Add ToDo</button>
        </form>
    );
}

export default App;
```

toDo를 추가할 List가 필요하므로, toDos를 useState()를 사용해서 빈 배열로 초기화시킨다.
다음으로 onSubmit에서 toDo를 toDos에 추가시키면 된다.

이때, 배열에 원소를 추가하는 법을 알아야 한다.
a라는 원소가 있고, Array라는 배열이 있다고 하자.
Array에 a를 추가하려면 [a, ...Array]라고 적어주면 된다.
이렇게 하면 배열의 제일 앞 부분에 a가 추가된다.
그 외에도 [...Array, a]라고 적으면 제일 뒤에 추가하는 것도 가능하다.

이를 사용해서 ToDos에 toDo를 추가해주고, toDo를 setToDo로 빈 문자열로 만들어준다.
이때, toDo가 처음부터 빈 문자열이면 ToDos에 추가하면 안 되므로 이 경우는 return으로 종료시킨다.

```
import { useState } from "react";

function App() {
    const [toDo, setToDo] = useState("");
    const [toDos, setToDos] = useState([]);

    const onChange = (event) => {
        setToDo(event.target.value);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        if (toDo === "") {
            return;
        }
        setToDos((array) => [toDo, ...array]);
        setToDo("");
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                value={toDo}
                onChange={onChange}
                type="text"
                placeholder="Write your to do..."
            />
            <button>Add ToDo</button>
        </form>
    );
}

export default App;
```

마지막으로 toDos에 있는 toDo를 list로 보여주겠다.
이를 위해서 map을 사용할텐데, map은 array의 각 원소에 map의 함수를 적용해주는 효과가 있다.
예를 들어서 `[1, 2, 3].map(x => x*2)`는 [2, 4, 6]이 출력된다.

<ul>에 toDos에 map을 사용해서 각 원소마다 <li>를 만들고, 각 <li>에 toDos의 원소를 넣어주면 된다.

```
import { useState } from "react";

function App() {
    const [toDo, setToDo] = useState("");
    const [toDos, setToDos] = useState([]);

    const onChange = (event) => {
        setToDo(event.target.value);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        if (toDo === "") {
            return;
        }
        setToDos((array) => [toDo, ...array]);
        setToDo("");
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                value={toDo}
                onChange={onChange}
                type="text"
                placeholder="Write your to do..."
            />
            <button>Add ToDo</button>
        </form>
        <hr />
        <ul>
            {toDos.map(todo => <li>{todo}</li>)}
        </ul>
    );
}

export default App;
```

그리고 브라우저에서 확인하면 리스트가 만들어지지만, 콘솔에는 에러가 나온다.
이는 map을 사용하면 key를 사용해줘야 하기 때문이다.
key가 왜 필요한지를 알기 위해선 React가 페이지를 갱신하는 법을 이해해야 한다.
React의 render()는 React element tree를 만드는 것이다.
무슨 의미인가 하면, 부모 노드에서 자식 노드로 이어지는 구조가 tree 형태가 된다는 의미다.
구글에서 tree를 검색해서 이미지를 보면 어떤 의미인지 알 수 있을 것이다.

React는 tree를 바탕으로 이전과 이후에 차이점이 없는지를 확인한다.
만약 element의 타입이 다르다면, 그 아래로는 새로운 tree를 만든다.
이는 <div>가 <ul>로 타입이 변한 것을 의미한다.
element가 타입은 같지만 props가 다른 경우에는, props만 바꾼다.
예를 들어서 <div className="before" />에서 <div className="after" />로 변한 경우, 새로 만들지 않고 props만 바꿔주는 것이다.

여기까지는 굉장히 효율적인 방법으로만 보이지만, 문제점이 존재한다.
바로 같은 타입이 props 없이 나열된 경우다.
예를 들어 아래의 두 구조를 보자.

```
<ul>
    <li>first</li>
    <li>second</li>
</ul>

<ul>
    <li>first</li>
    <li>second</li>
    <li>third</li>
</ul>
```

두 구조를 비교해보면 마지막 <li>third</li>만 다르기 때문에 한 번만 업데이트 해주면 된다.
그런데 저 <li>third</li>가 처음 위치에 추가된다면, React는 3개의 element가 모두 바뀌었다고 생각하게 된다.
왜냐하면 tree를 그려보면 일치하지 않는 지점이 3개 생겼기 때문이다.
그래서 사람의 시점에서는 업데이트가 1번이면 되지만, React 시점에서는 업데이트가 3번 일어난다.

```
<ul>
    <li>first</li>
    <li>second</li>
</ul>

<ul>
    <li>third</li>
    <li>first</li>
    <li>second</li>
</ul>
```

이런 문제를 해결하려면 각 element에 구분할 수 있는 속성을 주면 된다.
그렇게 하면 React가 새로운 element라고 인식하지 않으므로, 각 element를 유지한 채로 순서만 바꾸게 되고 element를 다시 만드는 비효율적인 일이 발생하지 않는 것이다.
이때, 각 element에 구분하기 위해 주는 속성이 key다.
React는 자식 element 가지고 있는 key를 통해 트리가 일치하는지 확인한다.
그래서 위의 예시에서 key만 주어진다면 작업이 효율적이게 진행된다.

```
<ul>
    <li key="first">first</li>
    <li key="second">second</li>
</ul>

<ul>
    <li key="third">third</li>
    <li key="first">first</li>
    <li key="second">second</li>
</ul>
```

이때, key는 당연히 고유한 값을 줘서 서로 구분이 가능해야 한다.
보통 list로 나열하는 데이터는 id가 있는 경우가 많으므로, id를 주로 사용한다.
다만 id가 없는 경우도 있을 수 있다.
이 경우에는 key가 형제간에만 구분가능하면 어떤 것이든 사용해도 좋다.
왜냐하면 tree를 비교할 때 key가 사용되는 부분은, 같은 element에 속해있는 형제간의 구분에 쓰이기 때문이다.
그래서 key는 App에서 고유할 필요는 없고, 형제 사이에서만 구분할 수 있게 정하면 된다.

다시 우리가 하던 일로 돌아가서, 이전의 에러는 우리가 <li>에 key를 주지 않아서 발생했다.
우리가 만든 것은 따로 id가 없으므로, index를 사용해야 한다.
map 함수의 구조를 다시 살펴보면 아래와 같다.

> arr.map(callback(currentValue [,index] [,array]))

여기서 index가 현재 처리하는 element의 index를 표시한다.
우리가 array의 앞쪽으로 element를 추가하고 있으므로 index를 사용하는 것은 그다지 바람직하진 않다.
왜냐하면 <li>가 key값을 유지하지 못하기 때문이다.
이를 해결하기 위해선 array에 추가되는 순서를 바꾸거나, key값을 {array.length - index}를 사용하면 된다.

```
import { useState } from "react";

function App() {
    const [toDo, setToDo] = useState("");
    const [toDos, setToDos] = useState([]);

    const onChange = (event) => {
        setToDo(event.target.value);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        if (toDo === "") {
            return;
        }
        setToDos((array) => [toDo, ...array]);
        setToDo("");
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                value={toDo}
                onChange={onChange}
                type="text"
                placeholder="Write your to do..."
            />
            <button>Add ToDo</button>
        </form>
        <hr />
        <ul>
            {toDos.map((todo, index) => (
                <li key={toDos.length-index}>{todo}</li>
            ))}
        </ul>
    );
}

export default App;
```

### 참고내용

[재조정](https://ko.reactjs.org/docs/reconciliation.html#recursing-on-children)
[리스트와 Key](https://ko.reactjs.org/docs/lists-and-keys.html)

## Coin Tracker

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json())
      .then((json) => {
        setCoins(json);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <h1>The Coins! {loading ? "" : `(${coins.length})`}</h1>
      {loading ? (
        <strong>Loading...</strong>
      ) : (
        <select>
          {coins.map((coin) => (
            <option>
              {coin.name} ({coin.symbol}): ${coin.quotes.USD.price} USD
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default App;
```

## Movie App

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const getMovies = async () => {
    const json = await (
      await fetch(
        `https://yts.mx/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year`
      )
    ).json();
    setMovies(json.data.movies);
    setLoading(false);
  };
  useEffect(() => {
    getMovies();
  }, []);
  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          {movies.map((movie) => (
            <div key={movie.id}>
              <img src={movie.medium_cover_image} />
              <h2>{movie.title}</h2>
              <p>{movie.summary}</p>
              <ul>
                {movie.genres.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
```
