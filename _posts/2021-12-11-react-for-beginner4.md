---
layout: post
title: React for Beginner 4
date: Sat Dec 11 20:44:53 JST 2021
categories: React
tag:
toc: true
---

React로 App을 만들 때, [Create React App](https://create-react-app.dev/)을 사용하면 필요한 파일, 구조, 설정을 알아서 만들 수 있다.
CRA(create-react-app)을 사용하려면 Node.js가 필요하므로, Node.js가 없다면 사이트에서 설치해주면 된다.
그 다음으로 `npm i create-react-app`으로 패키지를 설치해준다.
기본 파일을 만들려면 `npx create-react-app react-for-beginner`을 입력해준다.
여기서 react-for-beginner는 만들어지는 폴더의 이름이므로 원하는대로 바꿔줘도 된다.
그러면 파일이 자동으로 생성된다.
이 중에서 yarn 파일은 필요 없으므로 지워준다.

package.json을 보면 scipts가 있다.
Nods.js를 해봤다면 알겠지만, scripts를 사용하면 복잡한 명령을 간단하게 할 수 있다.
우리의 경우 `npm start`를 입력하면 App을 개발 모드로 실행하게 된다.
hppt://localhost:3000에 들어가면 우리가 만든 App을 볼 수 있다.

src 폴더는 앞으로 우리가 작업하게 될 폴더다.
그 중에서도 index.js 파일을 보면 익숙한 코드가 있다.
여기서 작성된 코드는 public 폴더 안의 index.html에 사용된다.

개발 모드에서 파일에 수정이 생길 경우 자동으로 이를 반영한다.
예를 들어 App.js에서 <div> 안의 내용을 바꿔주면 브라우저에도 이를 반영하게 된다.
이 덕분에 코드를 수정할 때마다 일일이 새로 시작해줄 필요가 없이 편하게 작업할 수 있다.

이제 필요없는 코드와 파일을 정리해보겠다.
우선 index.js와 App.js에서 아래 코드만 남도록 지워준다.

```
// index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
```

```
// App.js
function App() {
    return (
        <div>
            <h1>Welcome back!</h1>
        </div>
    );
}

export default App;
```

App.test.js, App.css, index.css, logl.svg, reportWebVitals.js, setupTests.js 는 모두 지워준다.

이제 가장 기본적인 파일 빼고는 없는 상태다.
지금부터 src 폴더 안에 필요한 파일을 만들어가면서 진행하겠다.
우선 src 폴더에 Button.js 파일을 만들어서 아래 내용을 적어준다.

```
// Button.js
function Button({ text }) {
    return <button>{text}</button>;
}

export default Button;
```

그리고 Button.js 파일을 App.js에서 import하면 사용할 수 있게 된다.

```
// App.js
import Button from "./Button";

function App() {
    return (
        <div>]
            <h1>Welcome back!</h1>
            <Button />
        </div>
    );
}

export default App;
```

그런데 우리는 prop-types를 사용하고 있으므로 `npm i prop-types`로 패키지를 설치해줘야 된다.
패키지를 설치한 다음 <Button />에 {text}를 적어서 보내준다.

```
// App.js
import Button from "./Button";

function App() {
    return (
        <div>]
            <h1>Welcome back!</h1>
            <Button text={"Continue"} />
        </div>
    );
}

export default App;
```

여기서 Button.js에서 propTypes를 정해서 prop로 전해주는 내용의 타입을 제한할 수 있다.

```
// Button.js
import PropTypes from "prop-types";

function Button({ text }) {
  return <button className={styles.title}>{text}</button>;
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Button;
```

다음으로 css를 적용시키는 방법을 알아보자.
우선 style.css 파일을 만들어서 일괄적으로 적용시키는 방법이 있다.
이는 기존과 동일한 방식으로 이 또한 충분하지만, 개별적으로 css를 적용할 수 없다는 단점이 있다.
그렇다고 style={{backgroundColor: "red";}}와 같은 형태로 전달하자니 이는 너무 불편하다.

그래서 사용하는 것이 css-module이다.
CRA로 만든 React 프로젝트는 css-module이라는 기능을 쓸 수 있다.
css-module을 사용하면 css 파일을 불러올 때, 클래스 이름을 [fileName]\_[className]\_\_[hashedValue]로 정해진다.
나중에 설명하겠지만 이 특성 때문에 각각에 고유한 css를 적용할 수 있게 된다.
css-module을 쓰려면 `Name.module.css` 형태로 파일을 작성하면 된다.

우선 Button.module.css와 App.module.css 파일을 만들겠다.

```
// Button.module.css
.btn {
  color: white;
  background-color: tomato;
}
```

```
// App.module.css
.title {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 18px;
}
```

이제 이 파일을 사용하려면 `import styles from "./App.module.css";` 형태로 import 해준다.
그리고 styles.title을 className에 넣어주면 css가 적용되게 된다.

```
// App.js
import Button from "./Button";
import styles from "./App.module.css";

function App() {
  return (
    <div>
      <h1 className={styles.title}>Welcome back!!!</h1>
      <Button text={"Continue"} />
    </div>
  );
}
```

```
// Button.js
import PropTypes from "prop-types";
import styles from "./Button.module.css";

function Button({ text }) {
  return <button className={styles.btn}>{text}</button>;
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Button;
```

그런데 styles에 어떤 내용이 전달되기에 css가 적용되는 것일까?
console.log(styles)로 출력해보면 css의 클래스 이름과 그에 대응되는 값이 들어 있다.
앞서 css-module 파일은 클래스 이름을 [fileName]\_[className]\_\_[hashedValue]로 만든다고 했었다.
이 변환된 이름이 styles에 본래 클래스 이름과 쌍을 이루게 된다.
예를 들어서 위의 App.modules.css의 .title이 들어있는 styles는 아래 내용을 담고 있다.

```
{
    title: 'App_title__#####'
}
```

여기서 ##### 부분이 해시로 바뀌는 부분이다.
그러므로 style.title은 `App_title__#####`이 되고, className={style.title}은 해당 이름으로 클래스 이름을 정한다.
그리고 css-module로 바뀐 css 파일의 스타일이 적용되는 것이다.

여기서 css-module의 가장 큰 장점이 있는데, 바로 파일마다 클래스 이름이 달라진다는 것이다.
예를 들어서 Button.module.css 파일의 .btn을 .title로 바꾼다고 해도, Button.module.css의 스타일이 <h1>에 적용되지 않는다.
그 이유는 Button.module.css의 스타일은 `Button_title__####` 형태가 되고, App.module.css의 스타일은 `App_title__####` 형태가 되기 때문이다.
다시 말해 각 파일에서 스타일의 이름은 같지만 css-module이 이름을 처리하면서 다른 것으로 바꿔준다.
만약 기존의 css 스타일이라면 둘은 일관적으로 같은 스타일이 적용되었겠지만, css-module의 방식 덕분에 서로 다른 스타일이 적용된다.