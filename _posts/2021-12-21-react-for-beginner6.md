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

앞서 우리는 ToDo List를 만들어봤다.
이번에는 Coin Tracker를 만들어볼텐데, Coin Tracker는 코인의 가격을 보여준다.
ToDo List와의 차이점은 데이터를 받아오기 위해 fetch를 사용한다는 것과, 데이터를 받아오는 동안에 Loading이 출력되도록 만들어준다는 점이다.
코인에 관한 정보는 "https://api.coinpaprika.com/v1/tickers"에서 받아올 수 있다.
우선 간단한 형태부터 만들도록 하자.
loading과 coins를 useState()로 만든다.
이때, loading은 로딩중인지를 표시하기 위한 것이므로 true로 초기화하고, coins는 []로 초기화한다.

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  return (
    <div>
      <h1>The Coins!</h1>
    </div>
  );
}

export default App;
```

이제 여기서 로딩중인 경우는 Loading을 출력하고 아닌 경우는 코인의 가격을 보여줘야 한다.
우선은 코인의 가격을 보여주는 부분은 null로 적어두겠다.

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  return (
    <div>
      <h1>The Coins!</h1>
      {loading ? <string>Loading</strong> : null}
    </div>
  );
}

export default App;
```

null 부분을 작성하기 전에 fetch로 코인의 가격을 받아오는 부분을 만들어보자.
코인의 가격을 받아오는 작업은 처음에 한 번만 하면 된다.
그렇기 때문에 useEffect(effect, []) 형태로 작성해서 한 번만 일어나도록 한다.
그리고 effect에 fetch를 사용해서 정보를 받아온다.
다음으로 정보를 .json으로 처리한 후에 콘솔에 출력시킨다.

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  useEffect(
      fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json)
      .then((json) => {
          console.log(json);
      });
  , []);
  return (
    <div>
      <h1>The Coins!</h1>
      {loading ? <string>Loading</strong> : null}
    </div>
  );
}

export default App;
```

출력된 결과를 보면 json에 코인에 관한 정보가 담겨있다.
그러므로 이를 setConins로 설정해주면 된다.
이때, setConins가 작동했다는 것은 로딩이 끝났다는 의미이므로 setLoading(false)로 로딩이 끝난 것을 표시한다.

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  useEffect(
      fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json)
      .then((json) => {
          setCoins(json);
          setLoading(false);
      });
  , []);
  return (
    <div>
      <h1>The Coins!</h1>
      {loading ? <string>Loading</strong> : null}
    </div>
  );
}

export default App;
```

이제 null 부분에 코인의 가격이 표시되도록 만들어준다.
coins에 json 형태로 정보가 저장되어 있으므로, coins에 map을 적용해서 각각의 정보를 보여주도록 만들면 된다.
정보를 나열해야 하므로 <li>에 코인의 name, symbol, price를 보여주도록 만들면 되는데, 이때 key를 id로 지정해줘야 한다.

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  useEffect(
      fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json)
      .then((json) => {
          setCoins(json);
          setLoading(false);
      });
  , []);
  return (
    <div>
        <h1>The Coins!</h1>
        {loading ? (
          <string>Loading</strong>
        ) : (
            <ul>
                coins.map((coin) => {
                    <li key={coin.id}>
                        {coin.name} {coin.symbol}: ${coin.quotes.USD.price} USD
                    </li>
                })
            </ul>
        )}
    </div>
  );
}

export default App;
```

이제 loading이 끝나면, 가져온 coins의 길이를 적어서 얼마나 많은 코인이 있는지 보여줄 수 있다.
그리고 <ul>을 <select>로 바꾸고 <li>를 <option>으로 만들어서, 리스트 대신에 옵션으로 보이도록 만들어준다.

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  useEffect(
      fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json)
      .then((json) => {
          setCoins(json);
          setLoading(false);
      });
  , []);
  return (
    <div>
        <h1>The Coins! {loading ? "" : `${coins.length}`}</h1>
        {loading ? (
          <string>Loading</strong>
        ) : (
            <select>
                coins.map((coin) => {
                    <option>
                        {coin.name} {coin.symbol}: ${coin.quotes.USD.price} USD
                    </option>
                })
            </select>
        )}
    </div>
  );
}

export default App;
```

## Movie App

다음으로 영화 페이지를 만들어보겠다.
영화 정보를 가져오기 위해선 fetch와 "https://yts.mx/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year" 주소를 사용하면 된다.
그런데 영화 제목을 누르면 해당 영화의 정보를 보여주는 페이지까지 만들고 싶다.
다시 말해서 Node.js에서 한 것처럼 라우터를 만들고 싶다.
이를 위해선 [react-router-dom](https://www.npmjs.com/package/react-router-dom)을 사용해야 하므로 `npm i react-router-dom`로 패키지를 설치한다.

기본적으로 만드는 것은 이전과 동일하지만, 처음 단계부터 다시 만들어보겠다.
우선은 개략적인 모양과 필요한 변수들을 만들어주겠다.

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  return (
    <div>
      {loading ? (<h1>Loading...</h1>) : null}
    </div>
  );
}

export default App;
```

여기서 정보를 받아오면 보여주는 페이지를 null에 적어줘야 한다.
페이지를 작성하기 전에 정보를 받아오겠다.
이전처럼 fetch와 주소를 사용하면 되는데, 이번에는 async/await을 사용해서 좀 더 보기 좋게 만들겠다.
우선은 데이터를 가져오는 함수를 useEffect()로 사용하도록 코드를 만들어준다.

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const getMovie = async () => {
      await fetch("https://yts.mx/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year");
  };
  useEffect(getMovie, []);
  return (
    <div>
      {loading ? (<h1>Loading...</h1>) : null}
    </div>
  );
}

export default App;
```

이제 fetch로 정보를 받아왔지만 아직 아무런 처리도 해주지 않았다.
그러므로 .json()을 사용해서 json 형태로 바꿔주고, setMovies와 serLoading을 사용해야 한다.
이때 fetch로 돌려받는 내용을 변수에 지정해서 사용해야 한다.

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const getMovie = async () => {
      const json =await fetch("https://yts.mx/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year").json();
      setMovies(json.data.movies);
      setLoading(false);
  };
  useEffect(getMovie, []);
  return (
    <div>
      {loading ? (<h1>Loading...</h1>) : null}
    </div>
  );
}

export default App;
```

이제 null에 들어갈 내용을 만들어준다.
이전에 한 것처럼 movies에 map을 사용해주면 되는데, key를 사용해서 각각을 구분할 수 있게 만들어줘야 한다.
영화에는 각각 id가 지정되어 있지만, 장르에는 그런 것이 없다.
하지만 같은 한 영화에 장르가 중복되는 경우는 없으므로, 장르에는 key를 장르 자기 자신을 주면 된다.

```
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const getMovie = async () => {
      const json =await fetch("https://yts.mx/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year").json();
      setMovies(json.data.movies);
      setLoading(false);
  };
  useEffect(getMovie, []);
  return (
    <div>
        {loading ? (
            <h1>Loading...</h1>
        ) : (
            <div>
                {movies.map((movie) => {
                    <div key={movie.id}>
                        <img = src={mogie.medium_cover_image} />
                        <h2>{movie.title}</h2>
                        <p>{movie.summary}</p>
                        <ul>
                            {movie.genres.map((genre) => (
                                <li key={genre}>{genre}</li>
                            ))}
                        </ul>
                    </div>
                })}
            </div>
        )}
    </div>
  );
}

export default App;
```

여기까지 하면 홈화면은 완성된다.
하지만 앞서 말했듯이 우리는 라우터를 만들어서 영화를 소개하는 페이지도 만들어야 한다.
이를 위해서는 파일 구조를 바꾸는 것이 조금 더 편하다.
파일을 아래처럼 바꿔주자.

```
.
└── src
    ├── App.js
    ├── components
    │   └── Movie.js
    └── routes
        ├── Detail.js
        └── Home.js
```

이제 Node.js에서 했던 것처럼 라우터와 컴포넌트를 나눠서 작성하겠다.
우선은 기존에 작성했던 내용을 Home.js로 옮겨준다.
그리고 컴포넌트의 이름을 App이 아니라 Home으로 고친다.

```
// src/routes/Home.js
import { useEffect, useState } from "react";

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const getMovie = async () => {
      const json =await fetch("https://yts.mx/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year").json();
      setMovies(json.data.movies);
      setLoading(false);
  };
  useEffect(getMovie, []);
  return (
    <div>
        {loading ? (
            <h1>Loading...</h1>
        ) : (
            <div>
                {movies.map((movie) => {
                    <div key={movie.id}>
                        <img = src={mogie.medium_cover_image} />
                        <h2>{movie.title}</h2>
                        <p>{movie.summary}</p>
                        <ul>
                            {movie.genres.map((genre) => (
                                <li key={genre}>{genre}</li>
                            ))}
                        </ul>
                    </div>
                })}
            </div>
        )}
    </div>
  );
}

export default App;
```

여기서 movies.map으로 만드는 내용은 재활용할 수 있는 컴포넌트다.
그러므로 src/components/Movie.js에서 구조를 설정하도록 만들어야 한다.
Movie.js에 새로운 Movie 컴포넌트를 만드는데, 기본적인 구조는 동일하게 만들어주고 prop-types로 정해진 타입만 props로 받도록 했다.

```
import PropTypes from "prop-types";

function Movie(coverImg, title, summary, genres) {
    return (
        <div>
            <img src={coverImg} />
            <h2>{title}</h2>
            <p>{summary}</p>
            <ul>
                {genres.map((genre) => (
                    <li key={genre}>{genre}</li>
                ))}
            </ul>
        </div>
    );
}

Movie.PropTypes = {
    coverImg: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    genres: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Movie;
```

그리고 여기에 맞춰서 Home.js를 수정해줘야 한다.
우선은 Movie.js를 import 해와야 하고, {movie.map()} 부분을 <Movie />에 props를 전달하도록 만들어야 한다.

```
// src/routes/Home.js
import { useEffect, useState } from "react";
import Movie from "../components/Movie";

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const getMovie = async () => {
      const json =await fetch("https://yts.mx/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year").json();
      setMovies(json.data.movies);
      setLoading(false);
  };
  useEffect(getMovie, []);
  return (
    <div>
        {loading ? (
            <h1>Loading...</h1>
        ) : (
            <div>
                {movies.map((movie) => {
                    <Movie
                        key={movie.id}
                        coverImg={movie.medium_cover_image}
                        title={movie.title}
                        summary={movie.summary}
                        genres={movie.genres}
                    />
                })}
            </div>
        )}
    </div>
  );
}

export default App;
```

다음으로 영화를 설명하는 Detail.js 파일은 간단하게만 만들어두겠다.

```
// src/routes/Detail.js
function Detail() {
  return <h1>Detail</h1>;
}
export default Detail;
```

이제 남은 것은 react-router-dom을 사용해서 라우터를 만들고 각 페이지를 연결해주는 일이다.
react-router-dom에서 사용하는 컴포넌트는 크게 3종류가 있는데, Routers, Mathcers, Navigation이다.

### Routers

-   <BrowserRouter>
-   <HashRouter>

Routers는 이름 그대로 라우터를 만든다.
<BrowserRouter>를 예를 들어서 설명하면, <BrowserRouter>로 둘러 쌓인 부분이 라우터가 되게 한다.

```
function App() {
    return <h1>Hello World!</h1>
}

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    document.getElementById("root");
)
```

위의 <BrowserRouter>로 만든 페이지의 URL을 들어가보면, 우리가 일반적으로 생각하는 라우터의 URL이 나온다.
<BrowserRouter>과 <HashRouter>의 차이점은 <HashRouter>는 각 URL의 뒤에 #을 붙인다.
예를 들어서 <HashRouter>에서 URL은 "http://example.com/#/page" 처럼 보이게 된다.
일반적으로 저런 표기법은 사용하지 않으므로 <BrowserRouter>만 사용해도 충분하다.

### Route Matchers

-   <Switch>(<Router>)
-   <Route>

라우트를 찾는 컴포넌트는 2가지가 있다.
<Switch>는 랜더링되면 자식 중에 <Route>를 찾고 path가 현재 URL과 비교한다.
그리고 맞는 path가 있다면 해당 <Route>를 사용하고 나머지는 무시한다.
이때 path가 중요한데, <Switch>는 현재 URL과 완전히 일치하는 것을 찾는 것이 아니다.
<Switch>는 URL과 path를 앞에서부터 비교하기 시작한다.
그리고 불일치하는 부분이 없다면 해당 <Route>를 실행시킨다.
아래의 예시를 보자.

```
function App() {
    return (
        <div>
            <Switch>
                <Route path="/">
                    <Home />
                </Route>
                <Route path="/about">
                    <About />
                </Route>
            </Switch>
        </div>
    )
}
```

위의 예시에서 /about으로 들어가면 당연히 <About />이 랜더링되기를 바란다.
하지만 <Switch>는 <Route path="/">과 비교할때, URL을 앞에서부터 비교한다.
여기서 최대한 비교할 수 있는 지점은 "/"까지다.
그러므로 <Switch>는 불일치하는 부분을 찾지못하고 <Route path="/">를 실행시킨다.
이런 일을 방지하기 위해서 path는 긴 것부터 적어줘야 한다.
정확히 표현하자면 가장 깊숙하게 있는 path를 위로 올려줘야 정상적으로 작동한다.

### Navigation

-   <Link>
-   <NavLink>
-   <Redirect>

<Link>는 이름 그대로 링크를 만든다.
<a>와 하는 일이 동일하다.

```
<Link to="/">Home</Link>
// <a href="/">Home</a>
```

<NavLink>는 현재 URL에 따라서 바뀌는 <Link>다.
만약 현재 링크 와 to로 지정한 URL이 동일하면 activeClassName에서 준 className이 적용된다.

```
<NavLink to="/react" activeClassName="hurray">
  React
</NavLink>

// When the URL is /react, this renders:
// <a href="/react" className="hurray">React</a>

// When it's something else:
// <a href="/react">React</a>
```

<Redirect>는 이름 그대로 해당 위치로 보내주는 일을 한다.
차이점이라면 <Link>는 눌러야 작동하지만, <Redirect>는 로그인처럼 중간 과정에서 거쳐가는 URL에 사용된다.

```
<Redirect to="/login" />
```

이제 이를 바탕으로 다시 하던 일로 돌아가보자.
App.js에 라우터를 만들어준다.
이때 BrowserRouter는 Router로 불러오고, path는 더 깊은 순서대로 작성해야 하는 것을 잊으면 안 된다.

```
// src/App.js
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
imrport Detail from "./routes/Detail";
import Home from "./routes/Home";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/hello">
                    <h1>Hello</h1>
                </Route>
                <Route path="/movie">
                    <Detail />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
```

이제 영화의 제목을 누르면 해당 페이지로 가도록 <Link>를 Movie.js에 만들어주자.

```
// Movie.js

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Movie({ coverImg, title, summary, genres }) {
  return (
    <div>
      <img src={coverImg} alt={title} />
      <h2>
        <Link to="/movie">{title}</Link>
      </h2>
      <p>{summary}</p>
      <ul>
        {genres.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
    </div>
  );
}
...
```

그런데 영화 설명으로 가는 링크를 만들 때, 영화의 id를 주소로 해서 찾아가고 싶다.
다시 말해서 주소에서 변수를 사용해주고 싶다.
이전에 Node.js에서 해줬듯이 :id를 사용하면 주소를 변수로 지정할 수 있다.

```
// App.js
      <Switch>
        <Route path="/abot-us">
          <h1>Hello</h1>
        </Route>
        <Route path="/movie/:id">
          <Detail />
        </Route>
```

그리고 이렇게 전달받은 내용은 useParams 안에 들어 있으므로 이를 받아와서 사용해주면 된다.

```
// Detail.js
import { useEffect } from "react";
import { useParams } from "react-router-dom";
function Detail() {
  const { id } = useParams();
  const getMovie = async () => {
    const json = await (
      await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
    ).json();
    console.log(json);
  };
  useEffect(() => {
    getMovie();
  }, []);
  return <h1>Detail</h1>;
}
export default Detail;
```

마지막으로 Movie.js를 수정해서 해당 링크로 가도록 수정해줘야 한다.
그러므로 Home.js에서 id를 받아와서 링크를 수정한다.

```
// Home.js
        {movies.map((movie) => (
            <Movie
              key={movie.id}
              id={movie.id}
              coverImg={movie.medium_cover_image}
              title={movie.title}
              summary={movie.summary}
```

```
// Movie.js
function Movie({ id, coverImg, title, summary, genres }) {
  return (
    <div>
      <img src={coverImg} alt={title} />
      <h2>
        <Link to={`/movie/${id}`}>{title}</Link>
      </h2>
      <p>{summary}</p>
      <ul>
...
Movie.propTypes = {
  id: PropTypes.number.isRequired,
  ...
```

문제는 react-router-dom이 업데이트를 했다는 점이다.
그래서 사용법이 조금 바뀌었는데, v5의 react-router-dom을 사용하거나, 아래의 설명을 보고 v6을 써도 된다.

기존의 v5와 달라진 점은 <Switch> 대신에 <Routes>를 쓴다는 점이다.
그리고 <Route>에 component를 넣어주는 대신에, element에 지정하도록 바뀌었다.
예를 들어서 아래의 예시는 동일한 일을 한다.

```
function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}
```

```
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}
```

## publishing

`npm i gh-pages`

package.json script build `npm run build`

마지막줄에
},
"homepage": "https://{username}.github.io/{githubRepository}"
`git remote -v`로 체크가능

script만들기
"deploy": "gp-pages -d build"
"predeploy": "npm run build"

5분 정도 후에 반영된다.

혹시 React router 6버전으로 진행하신 분들 중 gh-pages로 배포 후, 빈 화면이 나온다면 Route컴포넌트의 path경로 앞에 process.env.PUBLIC_URL을 추가해서 수정을 해주시면 됩니다.

```
Route path={`${process.env.PUBLIC_URL}/`} element={Home}
```

element Home은 <>로 감싸주셔야 합니다.

react-router-dom": "^6.2.1 를 사용합니다.
App.js 에서 아래 가이드에 맞게 해서 잘되었습니다. 공유합니다.

Router basename={process.env.PUBLIC_URL}
