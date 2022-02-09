---
layout: post
title: React for Beginner 1
date: Wed Dec  8 10:24:19 JST 2021
categories: React
tag:
toc: true
---

## 2 The Basics of React

[React](https://ko.reactjs.org/)는 간단히 말해 자바스크립트로 HTML을 만들 수 있게 해준다.
물론 정확한 표현은 아니지만 글로 읽기보다 직접 해보는 것이 이해하기 좋을 것이다.
React를 사용하는 방법은 여러가지가 있지만, 지금은 가장 간단한 CDN을 써서 시작해보려고 한다.
우선 index.html 파일을 만들고 그 안에 기본적인 html 구조를 만들어주자.
그리고 <body> 밑에 React, ReactDOM의 CDN 링크를 넣어준다.
[CDN](https://ko.reactjs.org/docs/cdn-links.html)을 보면 두 스크립트가 제공되므로 복사 붙여넣로 넣어준다.
지금까지의 형태는 아래처럼 된다.

```
<!DOCTYPE html>
<html>
    <body>

    </body>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
</html>
```

지금까지 프론트엔드를 만들 때, body 에 모든 내용을 만들어줬었다.
그런데 React를 사용하면 자바스크립트로 이들을 대체할 수 있다.
지금부터 아래에 작성할 내용은 시작을 위해서 만들 뿐, 일반적인 React 사용법이 아니다.
대부분의 개발자는 이런 방법으로 React를 만들지 않으므로 직접 해볼 필요가 없다.
React에서 html element를 만드려면 `React.createElement(component, props, ...children)` 형태로 만들 수 있다.
여기서 component는 html 태그, props는 속성, children은 그 속에 어떤 자식 속성을 넣을지를 정한다.
우선은 간단하게 span과 button을 만들어보겠다.

```
<html>
    <body>

    </body>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script>
        const span = React.createElement('span');
        const btn = React.createElement('button');
    </script>
</html>
```

하지만 이 파일을 실행시켜도 브라우저엔 아무것도 나오지 않을 것이다.
React로 만든 element를 배치시키려면 ReactDOM을 사용해야 하기 때문이다.
`ReactDOM.render(element, container [, callback])`를 사용하면 element를 배치할 수 있는데, element에는 배치 시킬 것을 넣고, container는 어디에 배치 시킬지를 정할 수 있다.
body에 배치시키기 위해 `<div id='root'></div>`를 하나 만들어주고 아래처럼 ReactDOM.render()를 사용한다.
물론 별다른 내용이 없으므로 아래 페이지를 보면 빈 버튼 하나만 있을 것이다.

```
<html>
    <body>
        <div id='root'></div>
    </body>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script>
        const root = document.getElementById('root');
        const span = React.createElement('span');
        const btn = React.createElement('button');
        ReactDOM.render(btn, root);
    </script>
</html>
```

그런데 ReactDOM.render()에 사용할 수 있는 element는 하나 뿐이라서, span과 button 2개를 배치할 수 없다.
이는 createElement로 container를 하나 만들어주면 간단하게 해결된다.
여기서 createElement의 마지막 속성으로 array를 사용하면 여러 자식 요소를 가지게 만들 수 있다.

```
<html>
    <body>
        <div id='root'></div>
    </body>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script>
        const root = document.getElementById('root');
        const span = React.createElement('span');
        const btn = React.createElement('button');
        const container = React.createElement('div', null, [span, btn]);
        ReactDOM.render(container, root);
    </script>
</html>
```

그 외에 이벤트를 만들거나, 안에 텍스트를 적는 등의 일도 createElement()의 prop와 ...children에 적어주면 된다.
아래는 span에 마우스가 들어가거나, button을 클릭하면 텍스트가 출력되게 만들었다.

```
<html>
    <body>
        <div id='root'></div>
    </body>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script>
        const root = document.getElementById('root');
        const span = React.createElement(
            'span',
            { onMouseEnter: () => console.log('mouse enter') },
            'This is a span'
        );
        const btn = React.createElement(
            'button',
            { onClick: () => console.log('im clicked') },
            'Click me'
        );
        const container = React.createElement('div', null, [span, btn]);
        ReactDOM.render(container, root);
    </script>
</html>
```

여기서 React를 사용하는 핵심은 자바스크립트로 HTML을 모두 컨트롤 한다는 점이다.
지금까지 해온 방식대로라면 HTML과 자바스크립트 파일을 오가면서 고쳐야 하는데, React는 자바스크립트만으로 모두 해결 할 수 있다.
하지만 이렇게 작성하면 HTML로 만드는 것보다, 오히려 더 어려워 보인다.
물론 이는 이해를 위해서 한 것일 뿐 실제로 이런 방식으로 코드를 만들진 않는다.
이제 위의 코드를 더 간단히 만들 수 있는 방법을 알아보자.

[JSX](https://ko.reactjs.org/docs/introducing-jsx.html)는 자바스크립트를 확장한 문법으로, HTML과 비슷한 문법으로 React element를 만들게 해준다.
아래는 JSX로 코드를 수정한 것으로 별다른 설명 없이 보기만 해도 HTML과 굉장히 비슷한 것을 알 수 있다.

```
<html>
    <body>
        <div id='root'></div>
    </body>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script>
        const root = document.getElementById('root');
        const Title = <h3 id="title" onMouseEnter={(() => console.log("mouse enter"))}>
            Hello I'm a title
        </h3>
        const Button = <button style={{ backgroundColor: "tomato" }} onclick={() => console.log("im clicked")}>
            Click me
        </button>
        const container = React.createElement('div', null, [Title, Button]);
        ReactDOM.render(container, root);
    </script>
</html>
```

하지만 이렇게 작성하고 확인해보면 브라우저가 코드를 전혀 이해하지 못했다.
이는 JSX로 작성한 코드를 브라우저가 이해 가능한 방식으로 바꿔줘야 하기 때문이다.
[@babel/standalone](https://babeljs.io/docs/en/babel-standalone)에서 사용법을 자세히 볼 수 있다.
우선은 `<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>`으로 코드를 추가해준다.
이때, 번역하고 싶은 script에 type="text/babel"을 적어줘야 한다.

```
<html>
    <body>
        <div id='root'></div>
    </body>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel">
        const root = document.getElementById('root');
        const Title = <h3 id="title" onMouseEnter={(() => console.log("mouse enter"))}>
            Hello I'm a title
        </h3>
        const Button = <button style={{ backgroundColor: "tomato" }} onclick={() => console.log("im clicked")}>
            Click me
        </button>
        const container = React.createElement('div', null, [Title, Button]);
        ReactDOM.render(container, root);
    </script>
</html>
```

그런데 아직 우리는 container를 JSX 방식으로 바꿔주지 않았다.
container를 바꿔주려면 어떻게 해야 할까?

<div>Title Button</div>로 적으면 안의 내용을 그대로 글자로 인식할 뿐이다.
해결 방법은 Title, Button을 함수로 만들어 주는 것이다.
그리고 Title, Button을 태그처럼 사용해주면 되는데, <Title>이 아니라 <Title />로 적어주면 된다.

```
<html>
    <body>
        <div id='root'></div>
    </body>
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel">
        const root = document.getElementById('root');
        const Title = () => (
            <h3 id="title" onMouseEnter={(() => console.log("mouse enter"))}>
                Hello I'm a title
            </h3>
        );
        const Button = () => (
            <button style={{ backgroundColor: "tomato" }} onclick={() => console.log("im clicked")}>
                Click me
            </button>
        );
        const Container = (
            <div>
                <Title />
                <Button />
            </div>
        );
        ReactDOM.render(Container, root);
    </script>
</html>
```

주의해야할 점은 제일 앞 글자를 대문자로 써야 한다.
만약 소문자로 적어주면 <button> HTML 태그로 이해한다.
그러므로 앞 글자를 대문자로 써서 <Button />으로 적어야 제대로 이해하게 된다.

여기서 /를 사용하는 의미는 안에 아무런 내용도 적지 않는다는 뜻이다.
예를 들어서 <h1> 태그에 내용을 적어줄 때, <h1>Hello World</h1>으로 적어준다.
그런데 아무런 내용도 포함하지 않는다면, <h1></h1>으로 적게 된다.
마찬가지로 <Title>이란 React에서 만들었다면, 안에 내용을 적어줘야 하는 경우도 있을 것이다.
이 경우에는 <Title>Hello World</Title>로 적어주면 된다.
그리고 대부분의 경우 안에 내용을 적어주지 않을 텐데, 이를 간편하게 작성하기 위해서 <Title />로 적기로 문법으로 정해놓았다.

이렇게 React를 사용하면 HTML을 쪼개서 만든 다음 원하는 곳에서 합쳐서 사용할 수 있다.
이는 굉장한 장점으로 반복되는 코드를 함수로 만들어서 사용하는 것처럼, 반복되는 HTML을 하나의 덩어리로 만들어서 쓸 수 있게 된다.
그래서 하나를 수정하면 전체를 수정한 것과 동일한 효과를 얻을 수 있다.

## 참고 사이트

[React](https://ko.reactjs.org/)
[ReactDom](https://ko.reactjs.org/docs/react-dom.html)
[React 자습서](https://ko.reactjs.org/tutorial/tutorial.html)
[Tania Rascia의 React 개요](https://www.taniarascia.com/getting-started-with-react/)
[NomadCoders](https://nomadcoders.co/)
