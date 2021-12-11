---
layout: post
title: React for Beginner 3
date: Fri Dec 10 19:44:41 JST 2021
categories: React
tag:
toc: true
---

지금까지 우리가 사용했던 State는 한 Component 안에서 정의되고 사용되었다.
그런데 경우에 따라서 Component에 값을 전해주는게 필요할 수 있다.
예를 들어서 하나의 버튼을 만드는데 그 안의 텍스트만 다르게 하고 싶은 경우, 굳이 여러 개의 Component를 만드는 것이 아니라 하나의 Component에서 값만 바꿔주는 것이 편하다.
이때 사용 가능한 것이 Props로, Props는 부모 component에서 child component로 데이터를 보내는 방식이다.

기존 Component를 만드는 법은 `function Btn(){}`으로 작성하는 것이었다.
여기에 Props를 더하는 것은 간단한데, `function Btn(props){}` 처럼 괄호 안에 props를 적어주면 된다.
더 진행하기 전에 버튼 2개가 있는 코드를 아래에 만들었다.

```
<html>
    ...
    <script type="text/babel">
        function Btn(props) {
            return (
                <button>
                    // we want to put some text here
                </button>
            );
        }
        function App() {
            return (
                <div>
                    <Btn />
                    <Btn />
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

위의 코드에서 Btn을 보면 버튼을 만드는 Component고 그 안에 텍스트를 건네주고 싶다.
그러기 위해서 <Btn /> 안에 속성처럼 text="Save Changes"를 적어준다.
`<Btn text="Save Changes" />`라고 적어주면 되는데 그 다음 `function Btn(props)` 안에서 props를 출력해보자.

```
<html>
    ...
    <script type="text/babel">
        function Btn(props) {
            console.log(props);
            return (
                <button>
                   // we want to put some text here
                </button>
            );
        }
        function App() {
            return (
                <div>
                    <Btn text="Save Changes" />
                    <Btn text="Another Btn" />
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

여기서 출력 결과를 보면 props가 {text: "Save Changes"} 형태의 객체임을 알 수 있다.
<Btn />에 추가로 onClick="Click"을 만들어서 다시 확인해보자.

```
<html>
    ...
    <script type="text/babel">
        function Btn(props) {
            console.log(props);
            return (
                <button>
                   // we want to put some text here
                </button>
            );
        }
        function App() {
            return (
                <div>
                    <Btn text="Save Changes" onClick="Click" />
                    <Btn text="Another Btn" />
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

출력된 props를 확인하면 첫 번째는 {text: "Save Changes", onClick: "Click"}으로 나오고, 두 번째는 {text: "Save Changes"}로 나온다.
다시 말해 props는 <Btn /> 안에서 속성처럼 적힌 것을 모두 가져와서 객체로 만들어준다.
그리고 이 props는 Btn 안에서 사용할 수 있으므로 button에서 텍스트를 출력하려면 {props.text}를 쓰면 된다.

```
<html>
    ...
    <script type="text/babel">
        function Btn(props) {
            return (
                <button>
                    {props.text}
                </button>
            );
        }
        function App() {
            return (
                <div>
                    <Btn text="Save Changes" />
                    <Btn text="Another Btn" />
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

그런데 onClick은 <button>에서 이벤트를 추가할 때 사용된 것인데, <Btn />에서는 이벤트가 추가되지 않는다.
이는 <button>이 직접적으로 element를 만들기 때문에 onClick을 사용하면 이벤트가 추가되는 반면, <Btn />은 Component이므로 값을 전달하는 방향으로 해석되기 때문이다.
다시 말해 Component에서 속성처럼 쓰인 것들은 props 안에 들어가는 객체로써 사용된다.

props는 단순히 string만 전달하는 것이 아니라 boolean을 포함해서 어떤 것이든 전달할 수 있다.
아래는 big을 props에 전달해주는 코드로, 이때 props 대신에 {text, big}을 사용했다.
이는 ES6를 활용한 것으로 props.text, props.big을 text, big으로 받아서 더 편하게 쓸 수 있다.
이때 주의할 것은 반드시 <Btn />에서 전달하는 것과 funciton Btn() 안의 이름이 동일해야 한다는 것이다.

```
<html>
    ...
    <script type="text/babel">
        function Btn({ text, big }) {
            console.log(big);
            return (
                <button
                    style={{
                        fontsize: big ? 18: 16,
                    }}
                >
                    {text}
                </button>
            );
        }
        function App() {
            return (
                <div>
                    <Btn text="Save Changes" big={true} />
                    <Btn text="Continue" big={false}/>
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

아래는 State를 만들어서 props에 전달해서 이벤트를 만든 것이다.
이처럼 props는 기본적인 형태에 바꾸고 싶은 것을 전달하는 용도로 사용하면 된다.

```
<html>
    ...
    <script type="text/babel">
        function Btn({ text, onClick }) {
            return (
                <button
                    onClick={onClick}
                >
                    {text}
                </button>
            );
        }
        function App() {
            const [value, setValue] = React.useState("Save Changes");
            const changeValue = () => setValue("Revert Changes");
            return (
                <div>
                    <Btn text={value} onClick={changeValue} />
                    <Btn text="Continue" }/>
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

다만 여기서 한 가지 문제점이 생기는데, 기존 State를 사용하면 바뀌는 부분만 랜더링 됐었다.
그런데 props로 전달해주면 해당 Component가 모조리 업데이트 된다.
이를 해결하기 위해선 `React.memo()`를 사용하면 되는데, `React.memo()`안에 컴포넌트를 넣어주면 된다.
그리고 반환되는 값을 받아서 새로운 Component처럼 사용하면 안의 State가 바뀔 때, 바뀐 부분만 업데이트 해준다.

```
<html>
    ...
    <script type="text/babel">
        function Btn({ text, onClick }) {
            return (
                <button
                    onClick={onClick}
                >
                    {text}
                </button>
            );
        }
        const MemorizedBtn = React.memo(Btn);
        function App() {
            const [value, setValue] = React.useState("Save Changes");
            const changeValue = () => setValue("Revert Changes");
            return (
                <div>
                    <MemorizedBtn text={value} onClick={changeValue} />
                    <MemorizedBtn text="Continue" }/>
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

말하자면 Props는 Component를 함수처럼 사용하는 것이라 할 수 있다.
함수처럼 값을 전달해서 기본적인 틀은 유지하고, 값에 따라 서로 다른 값을 보이기 때문이다.
그런데 함수는 전달되는 값의 타입을 지정할 수 있다.
이와 같은 기능이 Props에도 있는데 이를 사용하려면 prop-types를 사용해야 한다.
`<script src="https://unpkg.com/prop-types@15.6/prop-types.js"></script>`를 추가해주면 prop-types를 쓸 수 있다.

prop-types를 사용하려면 `Component.propTypes = {}` 형태로 적어준다.
{} 안에는 props에 전달되는 것의 이름과 정해지길 원하는 타입을 적어야 한다.
타입을 적어주는 형태는 `PropTypes.string`처럼 작성하면 된다.

```
<html>
    ...
    <script src="https://unpkg.com/prop-types@15.6/prop-types.js"></script>
    <script type="text/babel">
        function Btn({ text, fontSize = 16}) {
            return (
                <button
                    style={{
                        fontSize,
                    }}
                >
                    {text}
                </button>
            );
        }
        Btn.propTypes = {
            text: PropTypes.string,
            fontSize: PropTypes.number,
        };
        function App() {
            const [value, setValue] = React.useState("Save Changes");
            const changeValue = () => setValue("Revert Changes");
            return (
                <div>
                    <Btn text="Save Changes" fontsize={18} />
                    <Btn text="Continue" }/>
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```

이렇게하면 props에 타입을 지정해서 원하는 값만 받을 수 있다.
하지만 값이 전달되지 않는 경우가 발생할 수 있다.
다시 말해 전달해야 할 것이 정해지지 않고 전달될 수도 있다.
반드시 받아야 하는 값에는 isRequired를 사용하면 된다.
그렇게 하면 필수적인 props가 누락되는 경우를 방지할 수 있다.
마지막으로 props에 전달되는 기본값을 정할 수 있는데, `function Btn({ text, fontSize = 16 })`의 경우 fontSize의 기본값이 16이 된다.
isRequired와 디폴트값을 잘 사용하면 Component를 우리가 원하는 내에서 적절한 제한을 준다.

```
<html>
    ...
    <script src="https://unpkg.com/prop-types@15.6/prop-types.js"></script>
    <script type="text/babel">
        function Btn({ text, fontSize = 16}) {
            return (
                <button
                    style={{
                        fontSize,
                    }}
                >
                    {text}
                </button>
            );
        }
        Btn.propTypes = {
            text: PropTypes.string.isRequired,
            fontSize: PropTypes.number,
        };
        function App() {
            const [value, setValue] = React.useState("Save Changes");
            const changeValue = () => setValue("Revert Changes");
            return (
                <div>
                    <Btn text="Save Changes" fontsize={18} />
                    <Btn text="Continue" }/>
                </div>
            );
        }
        const root = document.getElementById('root');
        ReactDOM.render(<App />, root);
    </script>
</html>
```
