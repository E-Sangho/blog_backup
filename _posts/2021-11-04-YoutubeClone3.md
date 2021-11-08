---
layout: post
title: Youtube Clone3
date: Thu Nov  4 09:27:30 JST 2021
categories: Clone NodeJS
tag: Clone NodeJS
toc: true
---
## 7 User Authentication

### 7.0 Create Account part One
이번에는 페이지에 회원가입을 위한 페이지를 만들겠다. 그리고 인증(Authentication)을 구현하겠다.

이전에 했던 것을 반복하기 때문에 어떻게 하는지 자세히 설명하지는 않겠다. 우리가 필요한 것은 name, email, userName, password, location이라는 정보를 담고 있는 스키마를 만들어서 사용자의 정보를 담는 모델을 만드는 것이다. 모델을 만들었으면 이를 init.js에서 import 해준다. 그리고 회원가입을 위 join 페이지를 만들어야 한다. 그러기 위해선 라우터부터 만들어줘야 하는데, 우리는 지금까지 globalRouter라는 이름을 써왔다. 그런데 global이라는 이름은 오해의 소지가 있으므로 rootRouter로 바꿔줬다. rootRouter에서 /join 라우터로 GET, POST 메소드를 모두 보내므로 둘을 처리해줄 컨트롤러 getJoin과 postJoin이 필요하다. 이 둘은 userController에 만들어주면 된다. 그리고 getJoin을 실행시키면 불러올 페이지인 join.pug가 필요하다. 여기에는 앞서 만들었던 스키마에 들어갈 데이터를 입력받을 form을 만들어준다.
한
```
// User.js
import mongoose from "mongoose";

const userShcema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    location: String,
});

const User = mongoose.model("User", userSchema);
export default User;
```

```
// init.js
...
import "./models/User";
...
```

```
// rootRouter.js
...
import { getJoin, postJoin, login } from "../controllers/userController";
...
rootRouter.route("/join").get(getJoin).post(postJoin);
...
```

```
// server.js
...
import rootRouter from "./routers/rootRouter";
...
app.use("/", rootRouter);
...
```

```
// userController.js
export const getJoin = (req, res) => {
    return res.render("join", { pageTitle: "Join" });
}

export const postJoin = (req, res) => {
    console.log(req.body);
    return res.end();
}
```

```
// join.pug
extends base

block content 
    form(method="POST")
        input(name="name", required, type="text")
        input(name="email", required, type="email")
        input(name="username", required, type="text")
        input(name="password", required, type="password")
        input(name="location", required, type="text")
        input(type="submit" value="Join")

```

```
// base.pug
...
        li
            a(href="/join") Join
```

### 7.1 Create Account part Two
실행하다보면 DeprecationWarning가 나올때가 있다. 이는 오래된 기능을 사용하기 때문에 나오는 경고문이다. 우리의 경우 unique: true를 스키마에서 사용했기 때문에 나오는 것인데, 이는 db.js에 useCreateIndex: true를 적어주면 간단히 해결된다. 만약 경고가 나오지 않으면 별다른 문제가 없으니 그냥 넘어가도 된다.

```
// db.js
...
mongoose.connect(..., {
    ...
    useCreateIndex: true,
});
```

postJoin 컨트롤러에서 join으로부터 받아온 데이터를 User 모델로 저장해주고 login 페이지로 보내준다.
```
// videoController.js
import User from "../models/User";

export const postJoin async (req, res) => {
    const { name, username, email, password, location } = req.body;
    await User.create({
        name,
        username,
        email,
        password,
        location,
    });
    return res.redirect("/login");
}
```

저장한 데이터를 MongoDB에서 확인한다. 확인 방법은 다음을 차례로 입력하면 된다.

mongo -> show dbs -> use wetube -> show collections -> db.users.find()

확인해보면 비밀번호가 그대로 노출되는 것을 볼 수 있다. 다음에는 이 비밀번호를 암호화하는 방법을 알아보겠다.

### 7.2 Create Account part Three
암호화 하면 생각나는 것이 해시함수다. 그런데 SHA-256은 연산속도가 굉장히 빠르기 때문에 짧은 시간에 여러번 계산할 수 있다. 애초에 해시함수가 빠른 데이터 검색을 위해 만들어졌기 때문이다. 물론 해시함수를 모두 검색하려면 굉장히 오랜 시간이 걸리겠지만, 현실은 특정 문자를 사용하거나 쉬운 비밀번호를 사용하므로 경우의 수가 크게 줄 수도 있다. 게다가 같은 비밀번호를 암호화하면 매번 똑같은 결과같이 나온다는 것 또한 큰 문제다. 여러 값을 대입하면서 찾아낸 결과와 같은 것이 있다면 쉽게 비밀번호를 찾을 수 있기 때문이다. 이를 레인보우 테이블이라고 하는데 인터넷에서 쉽게 검색할 수 있다. 특히나 비밀번호는 생각보다 가지수가 많지 않아서 이미 레인보우 테이블에 있을 가능성이 굉장히 높다. 그렇기 때문에 SHA-256은 비밀번호의 암호화에는 권장되지 않는다. 

이를 위한 해결법이 2가지가 있다. 첫 번째는 Key Stretching이다. 아마 해시함수가 너무 빠른 것이 문제라고 할 때, 가장 쉽게 생각할 수 있는 방법이다. 바로 함수를 여러 번 돌리는 것이다. 몇 번 실행하는지는 개발자만이 알고 있고, 설령 해커가 이를 알게 되더라도 소모되는 시간이 늘어나게 된다. 예를 들어서 해시함수를 실행하는데 0.0001초가 걸린다고 할때, 이를 1000번 반복하는 것이다. 그렇게하면 0.1초가 걸리는데 일반 사용자들에게 그리 긴 시간이 아니지만, 해커에게는 치명적으로 긴 시간일 수도 있다.

하지만 이것만으로는 완벽하지 않다. 반복횟수를 알게 되면 또 대표값들을 추려서 유추할 수 있기 때문이다. 그래서 두 번째 방법인 Salt를 사용한다. Salt란 원본에 랜덤한 문자열을 추가하여 해시함수를 사용하는 것을 말한다. 음식에 소금치는 것에서 따온 이름인듯하다. 이렇게하면 해시함수 결과만으로 원본을 찾기 더 어렵다. 왜냐하면 원본과 salt를 모두 알아내야 하기 때문이다. 게다가 같은 비밀번호라도 다른 결과값이 레인보우 테이블로 알아내기 어렵다.

우리가 사용할 것은 [bcrypt](https://www.npmjs.com/package/bcrypt)로 Blowfish 방식을 사용한다. Blowfish는 key setup phase로 막대한 전처리 요구를 해서 느린데다가, 반복횟수를 지정할 수 있어서 원하는대로 해싱시간을 조절할 수 있다. 즉 속도를 조절가능한 해시함수다. 그리고 솔트를 결합했기 때문에 레인보우 테이블 공격에도 강하다.

`npm i bcrypt`로 bcrypt를 설치한다. bcrypt로 암호화하려면 `bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {})`로 적어준다. 여기서 myPlaintextPassword는 해시함수에 사용하려는 암호고, saltRounds는 몇 번이나 해줄지 적어주는 것이다. 이를 가지고 User.js에 암호화하는 코드를 작성해보면 다음과 같다.

```
// User.js
...
import bcrypt from "bcrypt";
...
userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 5);
});
```

### 7.3 Form Validation
회원가입을 할 때, email과 username은 중복되면 안 된다. 그러므로 userController.js를 수정해서 중복 여부를 확인하는 코드를 만들겠다.

```
// userController.js
...
export const postJoin = async (req, res) => {
    const { name, username, email, password, location } = req.body;
    const pageTitle = "Join";
    const usernameExists = await User.exists({ username });
    if(usernameExists) {
        return res.render("join", {
            pageTitle,
            errorMessage: "This username is already taken.",
        });
    }
    const emailExists = await User.exists({ email });
    if(emailExists) {
        return res.render("join", {
            pageTitle, 
            errorMessage: "This email is already taken.",
        });
    }
    await User.create({
        name,
        username,
        email,
        password,
        location,
    });
    ...
};
```

```
// join.pug
block content
    if errorMessage
        span=errorMessage
...
```

하지만 이렇게 작성하면 if문 안의 내용이 거의 일치하게 된다. 그래서 사용하는 것이 [#or](https://docs.mongodb.com/manual/reference/operator/query/or/)이다. { $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }의 형태로 사용하는데, 우리의 경우 `{ $or: [ { username }, { email } ] }`를 사용하면 된다. 이를 이용해 수정하면 아래처럼 된다.

```
// userController.js
...
export const postJoin = async (req, res) => {
    const { name, username, email, password, location } = req.body;
    const pageTitle = "Join";
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if(exists) {
        return res.render("join", {
            pageTitle,
            errorMessage: "This username is already taken.",
        });
    } 
    ...
};
```

다음으로 넘어가기 전에 마지막으로 하나만 더 고치겠다. 회원가입을 할 때 보통은 비밀번호를 2번 입력한다. 그렇기 때문에 확인용 비밀번호를 받는 칸을 하나 더 만들고 둘이 같은지 확인해보겠다.

```
// join.pug
block content
    ...
    input(placeholder="Password", name="password", type="password", required)
    input(placeholder="Confirm Password", name="password2", type="password", required)
```

```
// userController.js
...
export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if(exists) {
        return res.render("join", {
            pageTitle,
            errorMessage: "This username is already taken.",
        });
    } 
    ...
};
```

### 7.4 Status codes
[Status Code](https://ko.wikipedia.org/wiki/HTTP_%EC%83%81%ED%83%9C_%EC%BD%94%EB%93%9C)는 HTTP 요청을 했을 때 성공 여부를 알려준다. 대표적인 것으로 200은 Ok라는 뜻으로 요청이 성공했다는 의미다. 400은 Bad Request로 잘못된 문법으로 서버가 요청을 이해할 수 없음을 의미한다. 404는 Not Found로 요청받은 서버를 찾을 수 없다는 뜻으로 해당 url이 없음을 의미한다. Status code의 대표적인 사용처가 로그인이다. 종종 아이디를 만들면 그 아이디와 비밀번호를 저장하겠냐는 문구가 나오는 것을 보았을 것이다. 이는 회원가입 성공시에 200을 보내고 브라우저에서 이를 인식해서 나오는 문구다. 그렇기 때문에 Status code를 바꿔서 보내주면 그 문구가 나오지 않는다.

Status code를 보내주는 것은 간단하다. `res.status().render()`형태로 보내주면 된다. 예를 들어서 404를 보내고 싶다면 `res.status(400).render()`로 적으면 된다.

### 7.5 Login part One
지금까지 Join 페이지를 만들었다. 추가적으로 try/catch를 사용해서 postJoin에서 error가 발생할 경우의 코드를 만들어주었다.

```
// userController.js
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
```

이번에는 Join에서 만든 아이디로 로그인 하기 위해 login 페이지를 만들고 컨트롤러를 추가하겠다. 만들어야할 컨트롤러는 2개로, getLogin과 postLogin을 만들고 각각 라우터에 연결한다. getLogin은 별다른 내용을 받을 것이 없어 간단하지만, postLogin은 조금 복잡하다. 우선은 라우터를 만든다.

```
// rootRouet.js
...
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";
...
rootRouter.route("/login").get(getLogin).post(postLogin);
```

다음으로 getLogin과 postLogin을 만든다. getLogin은 간단히 만들 수 있다. 반면 postLogin은 패스워드를 확인하는 것이 조금 어렵다. 지금은 패스워드를 만드는 부분을 주석으로 놓고 나머지 부분부터 만들어보겠다.

```
// userController.js
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.exists({ username });
  if (!exists) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exists.",
    });
  }
  // check if password correct
  res.end();
};
```

login 페이지를 만들기 전, join.pug를 수정해서 login 페이지로 가는 링크를 하나 만들겠다.

```
// join.pug
...
        input(type="submit", value="Join")
    hr
    div
        span Already have an account? 
        a(href="/login") Log in now &rarr; 
```

그리고 login 페이지를 만들어준다.

```
// login.pug
extends base

block content
    if errorMessage
        span=errorMessage
    form(method="POST")
        input(placeholder="Username", name="username", type="text", required)
        input(placeholder="Password", name="password", type="password", required)
        input(type="submit", value="Login")
    hr
    div
        span Don't have an account? 
        a(href="/join") Create one now &rarr;
```

### 7.6 Login part Two
해시함수로 만든 암호와 로그인 페이지에서 보내주는 암호를 비교하려면 bcrypt의 기능을 사용하면 된다. `const match = await bcrypt.compare(password, user.passwordHash);` 여기서 password는 로그인 페이지의 비밀번호를 적어주고, user.passwordHash에 암호화된 비밀번호를 넣어주면 된다.

그런데 salt는 랜덤한 값을 고르는데 어떻게 비밀번호가 같은지를 확인할 수 있는 걸까? 이는 해시값에 salt가 포함되어 있기 때문이다. 예를 들어서 해시값이 $2a$5$Akeialkn....과 같이 되어 있다면 2a는 해시 알고리즘 식별자고, 5는 반복횟수(2^5)를 의마한다. 그리고 $ 뒤에 오는 22글자가 salt다. 그러므로 해시값이 주어지면 salt를 알 수 있다. 그리고 비밀번호가 주어졌을 때 salt로 해시값을 구한 후에 두 값을 비교하면 되는 것이다.

```
// userController.js
import bcrypt from "bcrypt";
...
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  return res.redirect("/");
};
```

### 7.7 Sessions and Cookies part One

#### Why we use Cookies and Sessions
HTTP는 2가지 특성을 가지고 있다. 하나는 비연결성(connectionless), 다른 하나는 무상태(stateless)다. 비연결성은 클라이언트가 서버에 요청을 하고 응답을 받으면 연결을 끊어 버리는 것이다. 이렇게하면 클라이언트가 많더라도 연결을 유지하지 않기 때문에, 처리하는 요청은 그 수가 크게 줄게 된다. 예를 들어 구글은 엄청난 수의 사람이 사용하고 있지만, 대부분 하나를 검색하면 그 페이지를 읽는데 상당한 시간을 사용한다. 그래서 사람 수에 비해 구글이 처리해야 하는 요청은 크게 줄어든다.

무상태는 서버가 클라이언트의 이전 상태를 보존하지 않는다는 의미다. 즉 이전의 요청이 기억되지 않으므로, 다음 요청에 영향을 끼치지 않는다. 그래서 같은 클라이언트의 요청에도 다른 서버가 응답해도 문제 없고, 요청이 대폭 증가해도 단순히 서버를 증설하는 것만으로 해결 가능하다. 이와 반대대는 개념은 stateful로 서버가 클라이언트의 이전 상태를 보존하므로, 항상 같은 서버를 사용해야 된다.

요약하면 HTTP는 응답 이후에 연결을 끊어 버리고, 이전의 정보를 기억하지도 않는다. 그런데 데이터를 유지해야 하는 경우가 많은데, 예를 들어서 로그인, 언어 설정, 구매 정보 등이 있다. 하지만 HTTP 프로토콜 만으로는 매 페이지마다 다시 로그인 해줘야 하는 번거롭고, 새로 로딩을 해야하니 페이지가 느려진다. 이를 해결하기 위해 사용하는 것이 세션과 쿠키다. 즉, 클라이언트와 정보 유지를 위해 사용하는 것이 세션과 쿠키다.

#### Cookie?
사용자가 어떤 웹 페이지에 접속할 때, 서버에서 **사용자의 컴퓨터**에 저장하는 기록 파일이다. 그리고 HTTP에서 해당 정보가 다시 필요하게 되면 쿠키 데이터를 재사용해준다. 쿠키는 이름, 값, 만료일, 경로 정보로 구성되어 있다. 만료일이 있기 때문에 쿠키 데이터는 너무 긴 시간이 지나면 쓸 수 없게 된다. 또한 클라이언트는 300개까지 쿠키를 저장 가능하고, 한 도메인 당 20개의 쿠키를 사용할 수 있다. 마지막으로 각 쿠키는 4kb이 최대 용량이다.

쿠키가 작동하는 순서는 다음과 같다. 쿠키는 클라이언트가 페이지에 요청을 보내면 서버에서 만든다. 그리고 서버는 응답을 할 때 쿠키도 같이 돌려보내준다. 클라이언트는 쿠키를 저장하고 있다가 다시 서버에 요청할 때 요청과 함께 쿠키를 전송한다.

#### Session?
세션(Session)이란 영어 단어는 특정 활동을 하는 기간을 의미한다. 컴퓨터에서는 이를 그대로 가져와서 사용자가 사이트에 접속한 시점부터 사용자가 브라우저를 닫아 서버와의 연결을 끊는 시점까지를 말한다. 서버는 세션이 종료될 때까지 같은 사용자의 요구를 기억하고 **서버**에 저장한다. 세션의 특징은 브라우저를 닫거나 서버에서 세션을 삭제할 경우에만 없어지고, 정보를 서버에 저장하므로 쿠키보다 보안이 좋다. 또한 저장 데이터의 제한이 없고 각 클라이언트 고유의 Session ID로 구분하여 요청에 맞는 응답을 해준다.

세션의 동작 순서는 다음과 같다. 클라이언트가 페이지에 요청을 하면, 서버는 쿠키를 확인하여 session ID를 보냈는지 확인한다. 만약 session ID가 없다면 새로 생성해서 돌려주고 클라이언트는 쿠키에 이를 저장한다. 만약 session ID가 있다면 이를 확인해서를 서버에 저장된 데이터를 사용한다. 예를 들어 로그인을 하면 로그아웃을 하거나 브라우저를 종료하기 전까지는 로그인이 유지가 된다.

세션이 보안에 더 좋은데도 쿠키를 사용하는 이유는, 세션은 서버에 저장되므로 사용자가 많으면 서버 자원 소모가 상당하다. 그렇기 때문에 세션과 쿠키를 동시에 사용해서 서버 자원 소모를 줄이고 웹 페이지의 속도를 높이는 것이다.

| | 쿠키 | 세션 |
|--|---|------|
| 저장 위치 | 클라이언트(접속자 PC) | 웹 서버 |
| 만료 시점 | 쿠키 저장시 설정(브라우저가 종료돼도 만료 시점이전까지 삭제되지 않음) | 브라우저 종료시 삭제 |
| 사용 자원 | 클라이언트 리소스 | 웹 서버 리소스 |
| 용량 제한 | 4kb | 서버가 허용하는 만큼 사용 가능 |
| 속도 | 빠르다 | 느리다 |
| 보안 | 비교적 안 좋음 | 쿠키보다 좋음 |

위 개념을 가지고 우리가 만들 로그인을 설명해보겠다. 아이디와 비밀번호를 입력해서 서버에 요청을 보낸다. 그러면 서버에서 아이디와 비밀번호를 확인해서 사용자가 맞는지를 확인한다. 확인이 끝나면 session ID를 만들어서 쿠키에 담아서 돌려보낸다. 브라우저는 이를 저장하고 있다가 다시 서버에 요청을 보내게 되면 쿠키를 같이 보낸다. 서버는 쿠키를 확인하고 session ID가 있으므로 이전에 로그인한 사용자라는 것을 확인하고 로그인한 페이지를 보여준다. 결국 쿠키는 세션 ID를 전달하기 위해 사용되고, 그 외의 중요한 정보는 모두 서버에서 다뤄지게 되므로 안전한 상태로 유지된다.

#### express-session
[express-session](https://www.npmjs.com/package/express-session)은 express에서 session을 사용할 수 있게 해준다. `npm i express-session`로 설치해준 다음 server.js에서 session을 import한다. 그리고 라우터 앞에서 미들웨어를 초기화해주면 된다. 다음과 같이 작성하자.

```
// server.js
import session from "express-session";
...

app.use(
  session({
    secret: "Hello",
    resave" true,
    saveUninitialized: true,
  })
);

app.use("/", rootRouter);
...
```

브라우저로 가서 inspect -> Application -> Cookies를 확인하자. 페이지를 새로고침하면 session 미들웨어가 브라우저에게 텍스트를 전송한다. 쿠키가 생성되었다면 브라우저에 다시 접속할 때마다 쿠키가 서버로 전송된다. 어떤 내용이 보내지는지 확인하기 위해 app.use(session())아래에 다음 코드를 추가해주자.

```
// server.js
...
app.use((req, res, next) => {
  console.log(req.headers);
  next();
});
```

그리고 콘솔을 확인하면 쿠키가 출력된다. 다음으로 아래처럼 입력해보자.

```
// server.js
...
app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});
```

이번에는 백엔드가 기억하고 있는 session이 출력된다. 처음에는 비어있지만 새로고침하면 session이 생긴 것을 볼 수 있다. 그리고 세션을 보면 string을 포함하고 있는데, 브라우저의 쿠키를 확인하면 동일한 string이 있다. 만약 다른 브라우저로 접속한다면 쿠키에선 session ID는 다른 값이 나올 것이다. 하지만 콘솔을 확인해보면 session ID가 2개인 것을 볼 수 있다.

### 7.8 Sessions and Cookies part Two
이번에는 서버를 중단한 다음 다시 시작해보자. 그러면 세션이 완전히 사라졌다. 즉, 세션은 서버가 중단되면 완전히 초기화된다. 나중에는 백엔드가 잊지 않도록 mongoDB와 연결하겠다. 지금은 백엔드가 쿠키로 브라우저를 구분할 수 있음을 보여주겠다. 이전에 서버가 브라우저에게 세션 ID를 보내줬다. 브라우저는 도메인에 접속할 때마다, 세션 ID를 보내주고 서버에서 이를 검사한다. 서버의 세션 ID를 확인하려면 다음처럼 작성한다.

```
// server.js
app.get("/add-one", (req, res, next) => {
  return res.send(`${req.session.id}`);
});
```

다음으로 세션에 정보를 추가해보겠다. 우리가 도메인에 들어가면 자동으로 세션 ID가 서버로 전달된다. 그러면 우리는 해당 세션을 사용할 수 있게 되는데, 아래와 같이 potato라는 것을 추가할 수도 있다. potato는 1번 접속할 때마다 1씩 상승하게 만들었다.

```
// server.js
app.get("/add-one", (req, res, next) => {
  req.session.potato += 1;
  return res.send(`${req.session.id}`);
});
```

서로 다른 브라우저에서 /add-one에 접속하면 세션 ID에 따라 값이 따로 저장되는 것을 볼 수 있다.

### 7.9 Logged In User
로그인을 하면 세션에서 로그인한 정보를 유지하도록 코드를 수정하겠다. 로그인정보를 보내는 컨트롤러가 postLogin에다가 다음처럼 작성한다.

```
// userController.js
...
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};
```

그리고 브라우저로 들어가서 로그인을 하면 콘솔에 세션 정보가 변경되었음을 볼 수 있다. 만약 다른 브라우저로 접속해서 다시 로그인해보면 브라우저마다 세션 ID가 다르기 때문에 새로운 세션이 생겨서 저장된다. 다음으로 우리가 로그인했으면 Join과 Login 링크가 나오지 않게 수정하려고 한다. 직관적으론 base.pug에서 if를 사용하면 간단히 해결될 것 같다. 아래 코드를 보자

```
// base.pug
      ul
          li
              a(href="/") Home
          if !req.session.loggedIn
              li
                  a(href="/join")  Join
              li
                  a(href="/login")  Login                        
          li
              a(href="/search") Search
```

하지만 아쉽게도 위의 코드는 작동하지 않는다. 이로인해 우리는 퍼그가 세션과 소통하지 못한다는 것을 알았다. 이를 수정하는 방법은 다음 시간에 배워보도록 하겠다.

### 7.10 Logged In User part Two
### 7.11 Recap
### 7.12 MongoStore
### 7.13 Uninitialized Sessions
### 7.14 Expiration and Secrets
### 7.15 Environment Variables
### 7.16 Github Login part One
### 7.17 Github Login part Two 
### 7.18 Github Login part Three
### 7.19 Github Login part Four
### 7.20 Github Login part Five
### 7.21 Github Login part Six 
### 7.22 Log Out
### 7.23 Recap