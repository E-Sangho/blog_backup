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
이는 랜더링이 한 번만 되기 때문에 생기는 문제로, 함수가 실행될 때마다 페이지가 다시 랜더링 되도록 만들어야 한다.
랜더링을 좀 더 편하게 하기 위해서 `render()` 함수를 만들었다.
그리고 render()를 countUp()에 포함시켜서 함수가 실행되면 랜더링하게 만들었다.

```
<html>
    ...
    <script type="text/babel">
        const root = document.getElementById('root');
        let counter = 0;
        function countUp() {
            counter += 1;
            // add render()
            render();
        }
        // create render()
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
여기서 우리는 render()를 사용하지 않았다.
만약 값만 바꿔주는 것이라면 counter이 변하는 것이 페이지에 반영되지 않아야 한다.
편리하게도 modifier는 값을 변경시킬 뿐만 아니라 변한 내용을 업데이트 해주는 일도 한다.
그렇기 때문에 counter를 업데이트 하고 다시 랜더링할 필요가 없다.

이제 React.useStste()가 변수를 초기화 하고, 그 변수를 바꾸고 랜더링하는 함수를 만드는데 사용하는 것을 알았다.
여기서 우리는 [counter, modifier]라는 이름을 사용했는데, 보통은 [state, setState]과 같은 형태로 사용한다.
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

setState를 사용할때, 2가지 사용법이 있다.
`setState(state +1)`처럼 값을 넣어준다면, state를 변수의 값으로 업데이트 해준다.
그런데 함수를 매개변수로 사용하면 그 함수에 state를 변수로 줘서 업데이트 하게 된다.
예를 들어서 `setState((current) => current + 1)`의 경우, setState에 함수를 매개변수로 줬다.
그렇기 때문에 안의 함수에 state를 변수로 줘서 `(state) => state + 1`이 실행된다.
그리고 state가 1이 더해진 값으로 업데이트 되는 것이다.

그렇다면 2가지 방법은 어떤 차이가 있을까?
이를 알기 위해선 setState의 특성을 알아야 한다.
setState는 비동기 함수로 작동한다.
비동기 함수로 작동할 때의 특성을 알기 위해, setState가 여러 번 불렸다고 생각해보자.
setState가 동기함수라면 값을 업데이트 하고 랜더링을 한다.
그리고 setState를 여러 번 호출했으므로, setState를 처리할 때마다 랜더링이 일어난다.
반면에 비동기 함수라면 setState를 모두 처리하고 랜더링을 한 번만 하게 된다.

이런 비동기성의 특징으로 setState는 효율적인 특징이 있다.
바로 React는 동일한 setState 호출을 하나로 합쳐주는 일을 한다는 것이다.
코드가 굉장히 길 경우, 실수로 setState를 여러 번 사용할 수도 있다.
React는 이를 알아서 찾아내서 한 번만 처리함으로써 비효율적인 일을 하지 않는다.

하지만 이 때문에 예상하지 못한 결과가 발생하기도 한다.
예를 들어서 아래 코드를 실행할 경우 3이 아니라 1이 나오게 된다.

```
const [state, setState] = React.useState(0);
setState(state + 1);
setState(state + 1);
setState(state + 1);
```

setState가 동일한 호출을 3번하고 있으므로 React에서 이를 하나로 합쳐주기 때문에 이런 일이 발생한다.
그런데 setState에 함수를 매개변수로 사용하면 각각을 모두 실행시켜준다.
그래서 아래 코드는 실행하면 3이 결과값으로 나온다.

```
const [state, setState] = React.useState(0);
setState((state) => state + 1);
setState((state) => state + 1);
setState((state) => state + 1);
```

이처럼 setState에 들어가는 변수가 값인지, 함수인지에 따라 작동하는 과정이 달라진다.
그렇기 때문에 예상치 못한 결과를 내지 않으려면 함수 형태를 사용하는 것이 더 좋다.
그러므로 우리의 코드에서 setCounter도 매개변수로 함수를 사용하였다.

```
<html>
    ...
    <script type="text/babel">
        const root = document.getElementById('root');
        function App() {
            let [counter, setCounter] = React.useState(0);
            const onClick = () => {
                setCounter((current) => current + 1);
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

이번에는 단순히 값을 증가시키는 것이 아니라, 분과 시간을 변환해주는 기능을 만들어보겠다.
<label>과 <input>을 사용해서 만드려고하면 아래처럼 만들 것이다.

```
<html>
    ...
    <script type="text/babel">
        function App() {
            return (
                <div>
                    <h1 class="hi">Super Converter</h1>
                    <label for="minutes">Minutes</label>
                    <input id="minutes" placeholder="Minutes" />
                    <label for="hours">Hours</label>
                    <input id="hours" placeholder="Hours" />
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

그렇지만 여기서 문제가 생기는데, 우리가 사용하는 것이 자바스크립트가 아니라 JSX기 때문이다.
for는 자바스크립트를 위해서 지정되어 있다.
우리가 JSX를 쓰긴 하지만, 자바스크립트에서 지정된 명령을 무시할 수는 없다.
그래서 이를 그대로 JSX에서 사용할 수가 없고, 대신에 htmlFor을 사용해야 한다.
마찬가지의 이유로 class 대신에 className을 사용해서 만들어줘야 한다.

```
<html>
    ...
    <script type="text/babel">
        function App() {
            return (
                <div>
                    <h1 className="hi">Super Converter</h1>
                    <label htmlFor="minutes">Minutes</label>
                    <input value={minutes} id="minutes" placeholder="Minutes" type="number" />
                    <label htmlFor="hours">Hours</label>
                    <input id="hours" placeholder="Hours" />
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

이제 여기다가 minutes가 변화할 경우 실행시킬 onChange() 함수를 만들어보겠다.
onChange()를 minutes <input>에 연결시켰는데, 변화가 생길 경우 event 변수로 전달되게 된다.
`console.log(event)`로 event에 어떤 내용이 들었는지 확인해보면, 일반적인 event와는 다르다.
그 이유는 React에서 event를 만들었기 때문에 실제 event가 아니라 SyntheticEvent라는 것으로 바꿔주기 때문이다.
기본 event를 사용하려면 nativeEvent를 사용하면 되지만, 우리는 event로 특별한 일을 할 것이 아니므로 넘어가겠다.
SyntheticEvent를 확인해보면 event.target.value에 <input>의 값이 들어있다.
우리는 이 값으로 minutes를 업데이트 하고 싶으므로 setMinutes로 업데이트 해준다.

```
<html>
    ...
    <script type="text/babel">
        function App() {
            const [minutes, setMinutes] = React.useState();
            const onChange = (event) => {
                // console.log(event);
                setMinutes(event.target.value);
            };
            return (
                <div>
                    <h1 className="hi">Super Converter</h1>
                    <label htmlFor="minutes">Minutes</label>
                    <input value={minutes} id="minutes" placeholder="Minutes" type="number" onChange={onChange} />
                    <label htmlFor="hours">Hours</label>
                    <input id="hours" placeholder="Hours" />
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

다음으로 reset 버튼을 만들어서 모든 수를 reset하도록 만들겠다.
이는 onClick과 setMinutes(0)로 쉽게 구현할 수 있다.

```
<html>
    ...
    <script type="text/babel">
        function App() {
            const [minutes, setMinutes] = React.useState(0);
            const onChange = (event) => {
                setMinutes(event.target.value);
            };
            const reset = () => setMinutes(0);
            return (
                <div>
                    <h1 className="hi">Super Converter</h1>
                    <div>
                        <label htmlFor="minutes">Minutes</label>
                        <input value={minutes} id="minutes" placeholder="Minutes" type="number" onChange={onChange} />
                    </div>
                    <div>
                        <label htmlFor="hours">Hours</label>
                        <input value={Math.round(minutes/60)} id="hours" placeholder="Hours" type="number" disabled} />
                    </div>
                    <button onClick={reset}>Reset</button>
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

분을 시간으로 바꾸는 것을 구현했으므로 이제 반대로 시간을 분으로 바꾸도록 만들겠다.
그 전에 flip 버튼을 만들어서 누르면 바꾸는 대상을 변경하도록 만들어주겠다.
이를 위해선 새로 React.useState(false)로 state를 하나 만들어주고, 버튼을 누르면 state를 바꾸도록 한다.
그리고 현재 flipped의 값에 따라서 disables를 조절해주면, 사용하는 대상을 바꿀 수 있다.

```
<html>
    ...
    <script type="text/babel">
        function App() {
            const [minutes, setMinutes] = React.useState(0);
            const [flipped, setFlipped] = React.useState(false);
            const onChange = (event) => {
                // console.log(event);
                setMinutes(event.target.value);
            };
            const reset = () => setMinutes(0);
            const onFlip = () => setFlipped((current) => !current);
            return (
                <div>
                    <h1 className="hi">Super Converter</h1>
                    <div>
                        <label htmlFor="minutes">Minutes</label>
                        <input value={minutes} id="minutes" placeholder="Minutes" type="number" onChange={onChange} disabled={flipped}/>
                    </div>
                    <div>
                        <label htmlFor="hours">Hours</label>
                        <input value={Math.round(minutes/60)} id="hours" placeholder="Hours" type="number" disabled={!flipped} />
                    </div>
                    <button onClick={reset}>Reset</button>
                    <button onClick={onFlip}>Flip</button>
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

마지막으로 시간을 분으로 바꾸는 계산이 다르기 때문에 input의 value를 수정해줘야 한다.
flipped의 값에 따라서 계산하는 방법이 바뀌도록 만들어줬다.

```
<html>
    ...
    <script type="text/babel">
        function App() {
            const [minutes, setMinutes] = React.useState(0);
            const [flipped, setFlipped] = React.useState(false);
            const onChange = (event) => {
                // console.log(event);
                setMinutes(event.target.value);
            };
            const reset = () => setMinutes(0);
            const onFlip = () => {
                reset();
                setFlipped((current) => !current);
            };
            return (
                <div>
                    <h1 className="hi">Super Converter</h1>
                    <div>
                        <label htmlFor="minutes">Minutes</label>
                        <input value={flipped ? minutes * 60 : minutes} id="minutes" placeholder="Minutes" type="number" onChange={onChange} disabled={flipped}/>
                    </div>
                    <div>
                        <label htmlFor="hours">Hours</label>
                        <input value={flipped ? minutes : Math.round(minutes/60)} id="hours" placeholder="Hours" type="number" disabled={!flipped} />
                    </div>
                    <button onClick={reset}>Reset</button>
                    <button onClick={onFlip}>Flip</button>
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

만약 이 외에도 다른 변환을 추가하고자 한다면, 이는 select와 option으로 만들 수 있다.
우선 지금까지 만든 코드를 MinutesToHours 함수로 옮겨준다.

```
<html>
    ...
    <script type="text/babel">
        function MinutesToHours() {
            const [minutes, setMinutes] = React.useState(0);
            const [flipped, setFlipped] = React.useState(false);
            const onChange = (event) => {
                // console.log(event);
                setMinutes(event.target.value);
            };
            const reset = () => setMinutes(0);
            const onFlip = () => {
                reset();
                setFlipped((current) => !current);
            };
            return (
                <div>
                    <h1 className="hi">Super Converter</h1>
                    <div>
                        <label htmlFor="minutes">Minutes</label>
                        <input value={flipped ? minutes * 60 : minutes} id="minutes" placeholder="Minutes" type="number" onChange={onChange} disabled={flipped}/>
                    </div>
                    <div>
                        <label htmlFor="hours">Hours</label>
                        <input value={flipped ? minutes : Math.round(minutes/60)} id="hours" placeholder="Hours" type="number" disabled={!flipped} />
                    </div>
                    <button onClick={reset}>Reset</button>
                    <button onClick={onFlip}>Flip</button>
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

이제 km를 mile로 바꾸는 함수 KmToMiles()라는 함수가 있다고 생각하고, select와 option으로 선택하는 기능을 만들겠다.
먼저 select와 option의 기본 형태부터 만들겠다.

```
<html>
    ...
    <script type="text/babel">
        function MinutesToHours() {
            ...
        }
        function KmToMiles() {
            return <h3>Km 2 M</h3>
        }
        function App() {
            return (
                <div>
                    <h1>Super Converter</h1>
                    <select>
                        <option value="0">Minutes & Hours</options>
                        <option value="1">Km & Miles </options>
                    </select>
                </div>
            )
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

여기서 option에서 값을 선택하면 onChange로 확인해서 함수를 실행시켜야 한다.
이때 함수는 어떤 변수의 값을 변화시켜야 하고, 이 변화된 값을 다시 select의 value로 사용해서 select도 변화 시켜야 한다.
이를 위해서 React.useState()로 새로운 state를 만든다.

```
<html>
    ...
    <script type="text/babel">
    ...
        function App() {
            const [index, setIndex] = React.useStste("xx");
            const onSelect = (event) => {
                setIndex(event.target.value);
            }
            return (
                <div>
                    <h1>Super Converter</h1>
                    <select value={index} onChange={onSelect}>
                        <option value="xx">Select your units</options>
                        <option value="0">Minutes & Hours</options>
                        <option value="1">Km & Miles </options>
                    </select>
                    <hr />
                    {index === "0" ? <MinutesToHours /> : null}
                    {index === "1" ? <KmToMiles /> : null}
                </div>
            )
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

이제 select의 기본 값을 "xx"로 만들고 index의 값에 따라서 구성물을 보여주면 된다.

```
<html>
    ...
    <script type="text/babel">
    ...
        function App() {
            const [index, setIndex] = React.useStste("xx");
            const onSelect = (event) => {
                setIndex(event.target.value);
            }
            return (
                <div>
                    <h1>Super Converter</h1>
                    <select value={index} onChange={onSelect}>
                        <option value="xx">Select your units</options>
                        <option value="0">Minutes & Hours</options>
                        <option value="1">Km & Miles </options>
                    </select>
                    <hr />
                    {index === "0" ? <MinutesToHours /> : null}
                    {index === "1" ? <KmToMiles /> : null}
                </div>
            )
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

## 참고

[setState](https://medium.com/@baphemot/understanding-reactjs-setstate-a4640451865b)
[SyntheticEvent](https://ko.reactjs.org/docs/events.html)
