---
layout: post
title: React for Beginner 3
date: Fri Dec 10 19:44:41 JST 2021
categories: React
tag:
toc: true
---

Prop 부모 component에서 child component로 데이터를 보내는 방식

```
<html>
    ...
    <script type="text/babel">
        function Btn(props) {
            console.log(props);
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
