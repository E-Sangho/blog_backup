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
이때 return은 하나의 컴포넌트만 전달할 수 있으므로 <div>로 전체 return에 들어갈 내용을 감싸줘야 한다.

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
      <div>
        <form onSubmit={onSubmit}>
            <input
                value={toDo}
                onChange={onChange}
                type="text"
                placeholder="Write your ToDo"
            />
            <button>Add ToDo</button>
        </form>
        <hr />
        <ul>
          {toDos.map(todo => <li>{todo}</li>)}
        </ul>
      </div>
    );
}

export default App;
```

그리고 브라우저에서 확인하면 리스트가 만들어지지만, 콘솔에는 에러가 나온다.
이는 map을 사용하면 key를 사용해줘야 하기 때문이다.
key가 왜 필요한지를 알기 위해선 React가 페이지를 갱신하는 법을 이해해야 한다.
React의 render()는 React element tree를 만드는 것이다.
무슨 의미인가 하면, 부모 노드에서 자식 노드로 이어지는 구조가 tree 형태가 된다는 의미다.

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
            {loading ? <strong>Loading</strng> : null}
        </div>
    );
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
function App() {
    const [loading, setLoading] = useState(true);
    const [coins, setCoins] = useState([]);
    useEffect(() => {
        fetch("https://api.coinpaprika.com/v1/tickers")
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
            });
    }, []);
    return (
        <div>
            <h1>The Coins!</h1>
            {loading ? <strong>Loading</strong> : null}
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
            <h1>The Coins!</h1>
            {loading ? <strong>Loading</strong> : null}
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
    ...
    return (
        <div>
            <h1>The Coins!</h1>
            {loading ? (
                <strong>Loading</strong>
            ) : (
                <ul>
                    {coins.map((coin) => (
                        <li>
                            {coin.name} {coin.symbol}: ${coin.quotes.USD.price} USD
                        </li>
                    ))}
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
    ...
    return (
        <div>
            <h1>The Coins!</h1>
            {loading ? (
                <strong>Loading</strong>
            ) : (
                <select>
                    {coins.map((coin) => (
                        <option>
                            {coin.name} {coin.symbol}: ${coin.quotes.USD.price}{" "}
                            USD
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

다음으로 영화 페이지를 만들어볼텐데, 일반적인 사이트처럼 여러 페이지를 옮겨다닐 수 있게 만들겠다.
앞으로 할 것은 크게 3부분으로 나뉜다.

1. 페이지 제작
2. 라우터 구현
3. publishing

그 중에서도 1은 이미 해본 것이고, 3은 그다지 어려운 일은 아니다.
이중 중요한 것은 라우터 구현 부분으로, 라우터를 구현하기 위해서 [react-router-dom](https://www.npmjs.com/package/react-router-dom)을 사용한다.
문제는 react-router-dom이 업데이트하면서 버전이 v5와 v6로 나뉜다는 점이다.
처음에는 오래된 버전인 v5로 작성하고, 추가적으로 새로 나온 v6로 작성하는 법을 알아보겠다.

### 페이지 제작

영화 정보를 가져오기 위해선 fetch와 "https://yts.mx/api/v2/list_movies.json?minimum_rating=8.8&sort_by=year" 주소를 사용하면 된다.
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

### 라우터

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

#### Routers

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

#### Route Matchers

-   <Switch>(<Routes>)
-   <Route>

라우트를 찾는 컴포넌트는 2가지가 있다.
<Switch>는 랜더링되면 자식 중에 <Route>를 찾고 path를 현재 URL과 비교한다.
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

#### Navigation

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

#### 라우터 구현

이제 이를 바탕으로 다시 하던 일로 돌아가보자.
`npm i react-router-dom`로 패키지를 설치한다.
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

### v6

문제는 react-router-dom이 업데이트를 했다는 점이다.
그래서 사용법이 조금 바뀌었는데, v5의 react-router-dom을 사용하거나,[react-router-dom v6](https://reactrouter.com/docs/en/v6/upgrading/v5#upgrade-to-react-router-v6)의 설명을 보고 v6을 써도 된다.

기존의 v5와 달라진 점은 <Switch> 대신에 <Routes>를 쓴다는 점이다.
둘의 가장 큰 차이점은 URL을 지정하는 방법이다.
이를 위해서 아래 예시를 보자.

```
// This is a React Router v5 app
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

function Users() {
  // In v5, nested routes are rendered by the child component, so
  // you have <Switch> elements all over your app for nested UI.
  // You build nested routes and links using match.url and match.path.
  let match = useRouteMatch();

  return (
    <div>
      <nav>
        <Link to={`${match.url}/me`}>My Profile</Link>
      </nav>

      <Switch>
        <Route path={`${match.path}/me`}>
          <OwnUserProfile />
        </Route>
        <Route path={`${match.path}/:id`}>
          <UserProfile />
        </Route>
      </Switch>
    </div>
  );
}
```

위의 코드를 보면 라우트가 중첩되었다.
다시 말해서 <App>에 라우트가 있고 또 <Users>에도 라우트가 있다.
이렇게 중첩된 구조에서 하위 라우트에서는 path를 지정할 때, path에는 match.path와 match.url을 사용해야 했다.
여기서 match.path는 <Route>에서 사용되는 주소고, match.url은 <Link>에 사용된다.

그런데 v6로 바뀌면서 상대주소로 찾게 만들어졌고, match.path나 match.url을 적을 필요가 없어졌다.

```
// This is a React Router v6 app
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="users/*" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

function Users() {
  return (
    <div>
      <nav>
        <Link to="me">My Profile</Link>
      </nav>

      <Routes>
        <Route path=":id" element={<UserProfile />} />
        <Route path="me" element={<OwnUserProfile />} />
      </Routes>
    </div>
  );
}
```

그리고 exact가 사라졌다.
기존에는 URL이 완전히 동일해야 작동하도록 exact를 사용해줬다.
v6에서는 이 대신에 _를 사용해서 하위 라우트가 존재하는 것을 표시한다.
위의 예에서도 App 안의 라우트를 보면 path="users/_"로 적어서 하위 라우트가 있음을 보여준다.

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

퍼블리싱을 위해 `npm i gh-pages`로 gh-pages를 설치한다.
그 후 package.json 파일의 script를 보면 build가 생겼다.
build를 실행시키면 우리가 만든 코드를 업로드하기에 적절한 코드로 변경시켜준다.
`npm run build`로 스크립트를 실행시키면 build 폴더에 변환된 코드가 저장된다.

다음으로 package.json 파일의 마지막줄을 아래처럼 바꿔준다.

```
    },
    "homepage": "https://{username}.github.io/{githubRepository}"
}
```

여기서 {username}은 자기 깃허브 사용자명이고, {githubRepository}는 레파지토리 이름이다.
`git remote -v`로 레파지토리 이름을 확인할 수 있는데, 연결하지 않았다면 미리 연결을 해줘야 한다.

script를 추가해줄텐데, 아래 두 script를 추가해준다.

-   "deploy": "gp-pages -d build"
-   "predeploy": "npm run build"

여기서 deploy는 gh-pages로 build라는 파일을 올려준다.
그런데 deploy로 올려주기 전에 자동으로 build가 실행되도록 하고 싶으므로, predeploy를 만들어서 npm run build가 일어나도록 만들었다.
이렇게 하면 `npm run deploy`를 실행하면 `npm run predeploy`가 먼저 실행된다.
이 스크립트는 `npm run build`를 실행하므로 먼저 build가 일어나고 deploy가 일어난다.
deploy는 바로 일어나지 않으므로 몇 분 후에 다시 확인해주면 된다.

다만 react-router-dom v6로 진행했다면, gh-pages로 배포해도 화면이 나오지 않는다.
이는 경로가 제대로 지정되지 않아서 생기는 문제점으로 경로 앞에 {process.env.PUBLIC_URL}를 붙여줘야 한다.
해결 방법은 2가지로 하나는 path에 직접적으로 추가하는 방법이다.

```
<Route path=`${process.env.PUBLIC_URL}/` element={<Home />} />
```

다른 하나는 <BrowserRouter>에 basename에 추가해주는 것이다.
basename은 <BrowserRouter>의 경로를 지정해주는 속성이다.

```
<BrowserRouter basename={process.env.PUBLIC_URL}>
    ...
</BrouwerRouter>
```

여기서 process.env.PUBLIC_URL이 무엇인지 설명해보겠다.
환경 변수(environment variable)는 프로그램이 실행되는 환경, 다시 말해 프로그램 밖의 값을 저장한 변수다.
그리고 가장 대표적인 환경 변수가 바로 현재 경로다.
Node.js에서는 process.env 안에 환경 변수 값이 들어 있다.
여기서 process가 전역 변수이므로 어디서든 사용가능하다.
예를 들어서 `process.env.USER`, `process.env.HOME`, `process.env.LANG`을 출력해보면 현재 사용 환경을 알 수 있다.
그 중에서도 `process.env.PUBLIC_URL`에는 현재 실행되는 프로그램의 경로가 지정되어 있다.
gh-pages에서 화면에 보이지 않는 이유가 경로가 잘못되었기 때문이므로, `process.env.PUBLIC_URL`로 경로를 정확히 지정해줘야 한다.
