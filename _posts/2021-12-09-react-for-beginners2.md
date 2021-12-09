---
layout: post
title: React for Beginner 2
date: Thu Dec  9 17:41:52 JST 2021
categories: React
tag:
toc: true
---

지금까지 만든 코드를 간략하게 필요한 것만 남기겠다.
여기서 Container 안에 자식 요소를 배치하려면 HTML처럼 적어주면 된다.

```
<html>
    ...
    <script type="text/babel">
        const root = document.getElementById('root');
        const Container = () => (
            <div>
                <h3>Total clicks: 0</h3>
                <button>Click me</button>
            </div>
        );
        ReactDOM.render(<Container />, root);
    </script>
</html>
```

지금부터 우리가 할 것은 JSX로 어떻게 변수를 전달할지다.
위의 코드에서 몇 가지 수정을 해서 버튼을 누르면 클릿 횟수가 보이도록 만드려고 한다.
변수를 만드는 것은 `let counter = 0`으로 간단히 할 수 있다.
JSX로 변수를 사용하려면 중괄호({})로 감싸주면 된다.

```
<html>
    ...
    <script type="text/babel">
        const root = document.getElementById('root');
        let counter = 0;
        const Container = () => (
            <div>
                <h3>Total clicks: {counter}</h3>
                <button>Click me</button>
            </div>
        );
        ReactDOM.render(<Container />, root);
    </script>
</html>
```

이제 여기서 버튼을 클릭하면 counter이 증가하도록 만들면 된다.
counter가 증가하는 함수는 쉽게 만들 수 있고, button에 이벤트를 추가하는 것도 onClick으로 간단히 할 수 있다.
onclick에 전달하는 함수도 변수이므로 중괄호를 쓰는 것을 잊으면 안 된다.

```
<html>
    ...
    <script type="text/babel">
        const root = document.getElementById('root');
        let counter = 0;
        function countUp() {
            counter += 1;
            console.log(counter);
        }
        const Container = () => (
            <div>
                <h3>Total clicks: {counter}</h3>
                <button onClick={countUp}>Click me</button>
            </div>
        );
        ReactDOM.render(<Container />, root);
    </script>
</html>
```

여기까지 진행하고 브라우저에서 열어보면, 버튼을 누를 때마다 counter가 증가해야 한다.
그렇지만 페이지가 랜더링 되지 않으므로 화면에 변화가 없다.
대신에 콘솔을 보면 counter이 증가한다는 것만 명백히 알 수 있다.
랜더링을 좀 더 편하게 하기 위해서 `render()` 함수를 만들었다.

```
<html>
    ...
    <script type="text/babel">
        const root = document.getElementById('root');
        let counter = 0;
        function countUp() {
            counter += 1;
            render();
        }
        function render() {
            ReactDOM.render(<Container />, root);
        }
        const Container = () => (
            <div>
                <h3>Total clicks: {counter}</h3>
                <button onClick={countUp}>Click me</button>
            </div>
        );
        render();
    </script>
</html>
```

이제 브라우저를 열어서 보면 버튼을 누를 때마다 정상적으로 출력된다.
여기서 잠시 inspect를 열어서 Elements를 보자.
기존의 HTML을 사용하면 글자 하나가 바뀌더라도, 페이지를 다시 랜더링해줘야 했다.
그런데 위의 코드를 Elements에서 살펴보면, <h3>의 counter 부분만 바뀐다.
이는 React의 가장 큰 장점으로 변화가 생길 때, 모두 랜더링 하는 것이 아니라 바뀐 부분만 랜더링 해준다.
다시 말해 전체를 새로 만드는 것이 아니라 바뀐 부분만 새로 생성해준다.

그런데 지금까지 알아본 것 보다 더 좋은 랜더링 방법이 있다.
랜더링 방법을 설명하기 전에 코드를 조금 정리해서 처음 상태로 만들어주겠다.
이때 return을 사용할텐데, 이전에는 화살표 함수를 사용해서 한 줄로 만들었기 때문에 return을 생략해도 됐다.
하지만 지금부터는 App() 안에 더 많은 코드를 작성할테니 return을 사용해줬다.

```
<html>
    ...
    <script type="text/babel">
        const root = document.getElementById('root');
        function App() {
            return (
                <div>
                    <h3>Total clicks: 0</h3>
                    <button>Click me</button>
                </div>
            );
        }
        ReactDOM.render(<App />, root);
    </script>
</html>
```

이제 우리가 사용할 것은 `React.useState()`다.
[State Hook](https://ko.reactjs.org/docs/hooks-state.html)를 보면 React.useState() 사용법이 나온다.
`React.useState()`가 무엇인지 아직 모르지만 console.log()로 출력해보자.

```
<html>
    ...
    <script type="text/babel">
        const root = document.getElementById('root');
        function App() {
            const data = React.useState();
            console.log(data);
            return (
                <div>
                    <h3>Total clicks: 0</h3>
                    <button>Click me</button>
                </div>
            );
        }
        ReactDOM.render(<App />, root);
    </script>
</html>
```

출력 결과를 보면 [undefined, f]라고 나온다.
이를 보면 React.useState()는 2가지를 반환한다는 것을 알 수 있다.
여기서 첫 번째는 초기값이고, 두 번째는 함수다.
정확히 말하면 첫 번째는 변수가 초기화 되기를 원하는 값이다.
함수는 변수를 바꾸는 방법을 지정하는데, 변수가 바뀌고 나면 알아서 랜더링 해주는 기능도 있다.
`const data = React.useState(0);`로 0을 넣어서 새로 출력해보면 [0, f]로 나온다.
이를 봐서 React.useState()안에 들어가는 것은 배열의 첫 번째 값이 된다는 것을 알 수 있다.
배열의 값을 받아오기 위해서 `const [counter, modifier] = React.useStste(0);`로 받아온다.
여기서 배열의 처음 값이 0이므로 counter는 0이 된다.
다음으로 modifier가 어떤 일을 하는지 알아보기 위해 아래처럼 코드를 만들었다.

```
<html>
    ...
    <script type="text/babel">
        const root = document.getElementById('root');
        function App() {
            const [counter, modifier] = React.useState(0);
            const onClick = () => {
                modifier(counter + 1);
            };
            return (
                <div>
                    <h3>Total clicks: {counter}</h3>
                    <button onClick={onClick}>Click me</button>
                </div>
            );
        }
        ReactDOM.render(<App />, root);
    </script>
</html>
```

이제 코드를 실행해서 버튼을 눌러보면 counter가 1씩 증가하는 것을 알 수 있다.
modifier는 안의 내용을 실행해서 counter에 넣어주는 일을 한다.
그렇기 때문에 `counter = counter + 1`이라고 지정한 것과 동일한 일이 일어나고, counter이 증가하는 것이다.
만약 값만 바꿔주는 것이라면 counter이 변하는 것이 페이지에 반영되지 않아야 한다.
편리하게도 modifier는 값을 변경시킬 뿐만 아니라 변한 내용을 업데이트 해주는 일도 한다.
그렇기 때문에 counter를 업데이트 하고 다시 랜더링할 필요가 없다.

이제 React.useStste()가 변수를 초기화 하고, 그 변수를 바꾸고 랜더링하는 함수를 만드는데 사용하는 것을 알았다.
여기서 우리는 [counter, modifier]라는 이름을 사용했는데, 보통은 [variable, setVariable]과 같은 형태로 사용한다.
다시 말해 변수 이름을 첫 번째로 쓰고, 거기에 set을 붙여서 함수 이름을 만든다.
우리의 경우 이를 따르면 [counter, setCounter]가 되어야 한다.

```
<html>
    ...
    <script type="text/babel">
        const root = document.getElementById('root');
        function App() {
            let [counter, setCounter] = React.useState(0);
            const onClick = () => {
                setCounter(counter + 1);
            };
            return (
                <div>
                    <h3>Total clicks: {counter}</h3>
                    <button onClick={onClick}>Click me</button>
                </div>
            );
        }
        ReactDOM.render(<App />, root);
    </script>
</html>
```
