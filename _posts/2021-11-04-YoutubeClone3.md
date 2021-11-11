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

요약하면 HTTP는 응답 이후에 연결을 끊어 버리고, 이전의 정보를 기억하지도 않는다. 그런데 데이터를 유지해야 하는 경우가 많은데, 예를 들어서 로그인, 언어 설정, 구매 정보 등이 있다. 하지만 HTTP 프로토콜 만으로는 매 페이지마다 다시 로그인 해줘야 하니 번거롭고, 새로 로딩을 해야하니 페이지가 느려진다. 이를 해결하기 위해 사용하는 것이 세션과 쿠키다. 즉, 클라이언트와 정보 유지를 위해 사용하는 것이 세션과 쿠키다.

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

여기서 secret은 비밀키, resave는 같은 세션 정보를 다시 저장할지를 지정하는 옵션, saveUninitialized는 초기화되지 않은 세션도 저장되는지에 관한 옵션이다. 좀 더 자세히 설명하면 secret은 쿠키를 임의로 변조하는 것을 방지하기 위한 것으로, 해시는 이 값을 키로 사용해서 세션 ID를 암호화해서 쿠키로 사용한다. 쿠키는 클라이언트에 저장되기 때문에, 서버에서 쿠키를 돌려받을 때 이 쿠키가 올바르게 생성된 것인지 확인할 수 없다. 만약 클라이언트가 쿠키를 변경해서 보내줄 경우 서버는 이를 알아챌 수 없다는 것이다. 그렇기 때문에 secret을 사용하는데, 쿠키를 보내주기 전에 해시함수로 암호화해서 보내주는 것이다. 그렇게하면 변조를 했을 경우 서버에서 키를 사용해서 대조해서 변화를 확인할 수 있게 된다. resave는 세션이 변경되지 않도라도 저장 여부를 결정하는 것으로, true로 설정하면 매 request마다 세션의 변경여부에 상관없이 무조건 저장한다. 대부분의 경우 세션이 변화가 없을 때 저장되는 걸 막아 효율을 높이기 위해 false를 사용한다. uninitialized는 request가 들어오면 새로 생성된 세션에서 아무런 작업도 이뤄지지 않은 상태다. saveUninitialized는 새로 세션이 만들어질 때, uninitialized 상태로 세션을 저장한다. 따라서 내용이 없는 세션도 저장할 수 있게 된다. 이를 false로 하면 비어있는 세션이 저장되지 않으므로 서버 공간을 아낄 수 있다.

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

그리고 브라우저로 들어가서 로그인을 하면 콘솔에 세션 정보가 변경되었음을 볼 수 있다. 만약 다른 브라우저로 접속해서 다시 로그인해보면 브라우저마다 세션 ID가 다르기 때문에 새로운 세션이 생겨서 저장된다.

다음으로 우리가 로그인했으면 Join과 Login 링크가 나오지 않게 수정하려고 한다. 직관적으론 base.pug에서 if를 사용하면 간단히 해결될 것 같다. 아래 코드를 보자

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
이전에 우리는 퍼그가 세션과 소통하지 못하는 것을 알았다. 다행히도 퍼그는 locals로 소통이 가능하므로 세션의 정보를 locals로 옮겨서 로그인 여부를 확인하고 페이지를 랜더링하면 된다. 사용하기 전에 locals이 무엇인지 알아보자.

`app.locals`는 자바스크립트 객체로 어플리케이션 안에서 지역 변수처럼 사용된다. 우리는 어플리케이션 안에서 계속 실행하기 때문에 사실상 글로벌이라 생각해도 된다. 어플리케이션이 실행되는 동안에는 계속 사용가능하므로 뷰에서 사용하고 싶은 모든 값을 넣어줘도 된다. req.app에 app에 관한 정보가 담겨 있으므로 req.app.locals를 사용하면 미들웨어에서도 사용 가능하다. 반면 `res.locals`는 요청에 응답하기 위한 데이터를 담고 있다. 예를 들어서 GET /something은 새로운 res.locals를 만들고, res.locals는 /something에 응답하는 모든 미들웨어를 거친다. 또한 요청에 응답하는 데이터를 담고 있기 때문에 뷰가 랜더링될 때만 사용되고, 응답이 끝나면 사라지게 된다. 요청/응답 사이클 안에서만 사용된다는 것을 제외하면 app.locals와 거의 똑같다. 어떤 단계까지 유효한지를 알기 위해선 locals이 만들어지는 다음 과정을 참고하자.

- app is created
- app.locals is created
- request arrives
- res.locals is created for that request
- you add things to res.locals
- you serve a response to the request(res.render('some view'))
- res.locals for that request is gone
- app.locals continues to exist as long as the app exists

그런데 인증은 페이지가 랜더링 될 때만 필요하다. 우리가 보여주고 싶은 것은 로그인 되었을 경우에 다른 페이지를 보여주는 것이기 때문이다. 그러므로 우리는 res.locals를 사용해서 페이지를 로그인 여부를 확인하겠다.

server.js에서 라우터 위에 res.locals를 만들어주겠다. res.locals에 어떤 것을 입력하려면 res.locals.something에 값을 넣어주면 된다. 

```
// server.js
...
app.use((req, res, next) => {
  res.locals.message = "local message";
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});

app.use("/", rootRouter);
...
```

그리고 이 메세지를 base.pug에서 받아보겠다. 이때 req.locals.message가 아닌 message로 사용해주면 된다.

```
// base.pug
...
    body
      header
        h1 This is #{message}
...
```

이렇게 res.locals에 저장한 것들을 뷰에서 사용가능함을 알아보았다. 이제는 미들웨어로 locals를 전달하면 되는데, 이는 서버와 관련된 코드가 아니다. 그러므로 따로 middlewares.js라는 파일은 만들어서 미들웨어를 따로 관리하고 server.js에 import해오도록 하겠다. src에 middlewares.js라는 파일을 만들고 아래처럼 적어준다.

```
// middlewares.js
export const localsMiddleware = (req, res, next) => {
  req.locals.siteName = "Wetube";
  next();
};
```

그리고 server.js로 돌아와서 이를 import해주고 라우터 위에 만들어준다. 주의할 것은 반드시 session을 사용하는 코드 아래에 적어줘야 한다. 왜냐하면 localMiddleware에서 session을 사용할 예정이기 때문이다.

```
// server.js
import { localsMiddleware } from "./middlewares";
...
app.use(localsMiddleware);
app.use("/", rootRouter);
...
```

이렇게하면 앞으로 locals를 다룰때 middlewares.js 파일만 고쳐주면 된다. 다시 middlewares.js로 돌아가서 다음처럼 적는다.

```
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  console.log(res.locals);
  next();
}
```

이때 Boolean을 사용한 이유는 res.session.loggedIn이 undefined일 수도 있기 때문이다. base.pug로 돌아가서 loggedIn에 따라 링크가 바뀌도록 만들자.

```
// base.pug
...
  nav
    ul
      li
        a(href="/") Home
        if loggedIn
          li
            a(href="/logout) Logout
        else
          li
            a(href="/join") Join
          li
            a(href="/login") Login
      li
        a(href="/search") Search
...
```

다시 middlewares.js로 돌아가서 req.session.user를 받아보자.

```
export const localsMiddleware = (req, res, next) => {
  res.local.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  next();
}
```

로그인 전에는 res.session.user는 undefined다. 하지만 로그인을 하면 user이 생기게되고 뷰에서 사용가능하다.

```
// base.pug
...
  nav
    ul
      li
        a(href="/") Home
        if loggedIn
          li
            a(href="/logout) Logout
          li
            a(hfre="my-profile") #{loggedInUser.name}의 Profile
        else
          li
            a(href="/join") Join
...
```

### 7.11 Recap

### 7.12 MongoStore
지금까지 다뤄온 세션 정보는 메모리에 저장되기 때문에 서버를 종료하면 사라졌다. 하지만 실제 서버는 데이터를 계속 저장하고 있어야 한다. 이를 위해 사용할 것이 [connect-mongo](https://www.npmjs.com/package/connect-mongo)다. `npm install connect-mongo`로 설치하고 server.js에서 import해서 사용하면 된다.

connect-mongo 페이지를 확인해보면 간단한 사용법을 알 수 있다. 페이지에서 제안하는 사용법은 아래와 같다.

```
// Basic usage
app.use(session({
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/test-app' })
}));
```

app.use(session())에는 store라는 속성이 있는데 여기에 저장될 위치를 지정하는게 가능하다. `mongodb://localhost/test-app`대신에 들어가야 하는 것이 바로 우리가 사용하는 mongoDB의 위치다. 우리는 이를 이미 db.js에 적어놨다. db.js 파일에서 3번째 줄을 보면 `"mongodb://127.0.0.1:27017/wetube"` 가 우리가 찾던 위치다. 이를 사용해 app.use(session())에 적어주면 아래처럼 된다.

```
// server.js
...
import MongoStore from "connect-mongo";
...

app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/wetube" }),
  })
);
```

이렇게 작성하고 페이지에 로그인 한 이후에 서버를 재시동하거나 새로고침을 해도 로그인이 유지되는 것을 확인할 수 있다. 터미널로 mongoDB에서 확인해보면 mongo -> show dbs -> use wetube -> show collections -> db.sessions.find({})로 확인 가능하다.
### 7.13 Uninitialized Sessionos
현재 우리는 방문자가 생길 때 마다 세션을 만들고 저장하고 있다. 하지만 이는 좋은 생각이 아니다. 로그인한 사용자만 세션이 필요하기 때문에 그 외의 비용은 낭비다. 그렇기 때문에 옵션을 바꿔서 로그인한 경우에만 세션을 만들겠다.

server.js에서 app.use(session)에서 resave와 saveUninitialized를 false로 수정한다. 앞서 설명했듯이 resave는 세션의 변화가 있을 때만 저장하는 것이고, saveUninitialized는 세션에 수정이 없는 이상 저장하지 않는 기능이다. 이 둘이 있기 때문에 단순한 방문자의 세션은 저장되지 않고, 로그인한 유저의 세션만 저장된다.

다음으로 세션의 secret와 store의 url을 수정하겠다. 왜냐하면 이 둘은 웹 사이트에 배포할 때 보여주면 안 되기 때문이다. 그러므로 다음 시간에는 이 둘을 숨기는 방법을 알아보겠다.

### 7.14 Expiration and Secrets
쿠키는 Name, Value, Domain, Path등의 값이 있다. 우선 secret은 쿠키가 sign할 때, 사용하는 string이다. 쿠키에 sign 하는 이유는 백엔드가 쿠키를 줬다는 것을 확인하기 위함이다. 왜냐하면 session hijack 이라는 해킹 기법 때문에, 누군가 쿠키를 훔쳐서 사용자인척 할 수 있기 때문이다. 그래서 secret은 랜덤한 string을 사용해야 한다. Domain을 보면 어떤 backend에서 쿠키를 만들었는지 알려준다. 브라우저는 Domain마다 생성되기 때문에 해당 Domain에 접속할 때만 쿠키를 보내준다. Expires는 만료일자로 지정하지 않으면 session cookie로 지정된다. session cookie는 브라우저가 닫히면 세션이 없어진다. Max-Age 역시 세션이 만료되는 시간인데, app.use(session())에서 수정할 수 있다. 아래 코드를 추가해서 확인해보자.

```
cookie: {
  maxAge: 20000,
},
```

위의 코드는 ms 단위로 실행되므로 20초 후에 쿠키가 삭제된다. 즉, 로그인 가능한 시간이 20초가 되게 해준다.

다음으로 secret과 store의 url이 공개되어 있으므로 이를 수정해서 숨기도록 하겠다. 이를 위해서 최상위 층에 .env라는 파일을 만들어준다. 그리고 .gitignore에 .env를 추가해서 깃허브에 올라가지 않도록 만든다. env 파일에 추가하는 것은 관습적으로 대문자만을 사용한다. 다음 내용을 env 파일에 추가해주자.

```
// .env
COOKIE_SECRET=jsdklflasjdfkljsaklfjklasgkl
DB_URL=mongodb://127.0.0.1:27017/wetube
```

env 파일의 코드에 접근하는 법은 간단하다. process.env.something 형태로 적어주면 된다. 예를 들어 process.env.DB_URL로 적어주면 된다. 이에 맞추서 server.js와 db.js 파일을 수정한다.

```
// db.js
...
mongoose.connect(process.env.DB_URL, {
...
```

```
// server.js
...
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
...
```

하지만 이렇게하면 에러가 발생하고 읽어오지 못한다. 다음 시간에는 이를 수정하는 법을 알아보겠다.

### 7.15 Environment Variables
우리가 사용하고 싶은 것은 dotenv다. dotenv는 env 파일을 읽고 각각의 변수들을 process.env에 넣어준다. `npm i dotenv`로 설치해준다. 그리고 `require("dotenv").config();`를 적어주면 그 다음 부터는 env 파일의 변수를 사용할 수 있게 된다. 다시 말해 저 코드를 최대한 빠르게 사용해야 한다. 우리 코드의 작동 순서를 보면 init.js가 가장 먼저 실행되고 그 다음으로 db.js, models, server.js 순서로 실행된다. 그러므로 저 안에서 env의 변수를 사용하려면 init.js의 제일 위에 코드를 적어줘야 한다.

하지만 이렇게 해도 작동하지 않는다. 해결법은 2가지가 있다. env를 사용하는 파일의 제일 위에 코드를 추가하는 것과 다른 하나는 import로 바꿔주는 것이다. import로 바꿔주려면 `import "dotenv/config";`로 바꿔주면 된다.

### 7.16 Github Login part One
이번에는 웹사이트에 소셜 로그인을 구현하는 방법을 알아보겠다. 구현할 것은 깃허브 로그인이다. 깃허브는 좀 특이하지만 대부분의 소셜 로그인과 흐름은 동일하다. 작동 과정은 다음과 같다.

1. 사용자는 깃허브로 보내져서 로그인을 확인 받는다.
2. 확인되면 다시 웹사이트로 돌려보낸다.
3. 토큰으로 웹사이트에 접근 가능해진다.

이를 사용하기 위해선 깃허브에서 몇 가지 처리가 필요하다. 다음 단계를 따라가자.

1. github.com/settings/applications에 접속한다.
2. 좌측의 Developer settings에 들어간다.
3. 좌측의 OAut Apps를 누른다.
4. 오른쪽 위의 New OAut App을 누른다.
5. Application name은 원하는 대로 적어주고, Homepage URL은 우리 웹사이트의 URL을 적어준다.(우리의 경우 http://localhost:4000/)
6. Application descripttion은 적당히 적어주고, Authorization callback URL은 우선은 http://localhost:4000/users/github/finish 로 넣어준다. 아무거나 넣어줘도 되지만 코드에서 사용해야 하니 꼭 기억하자.
7. Register application을 누른다.
8. Client ID가 나오는 페이지가 보이는데 이 페이지는 추후에 써야하니 끄지 않고 그대로 둔다.

깃허브에서 세팅은 끝났고 이제는 페이지에서 어떻게 정보를 보내줄 것인지를 알아보자. [Authorizing OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)를 보면 설명이 나온다. 우리가 해야할 것은 https://github.com/login/oauth/authorize로 보내주는 것이다. 그런데 뒤에 붙이는 parameter에 따라서 요청하는 정보가 달라진다.

- client_id: **필수**적으로보내줘야 하는 값으로, 앞서 깃허브에서 만든 Client ID를 적어줘야 한다.
- scope: 유저에게서 얼마나 많은 정보를 요청할지 정하는 것으로 어떤 것을 받을 수 있는지는 [scope](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)를 참고하자. 우리가 필요한 것은 read:user과 user:email이다.
- allow_signup: 깃허브로 보내줬을 때, 아이디가 있다면 로그인 하겠지만 없을 경우는 새로 만들게 될 것이다. 만약 allow_signup을 true로 지정하면 새로 아이디를 만드는 것을 허용하지만, false로 지정하면 아이디를 만드는 것을 제한한다.

### 7.17 Github Login part Two
앞의 내용을 가지고 링크를 만들어보겠다. 그전에 링크의 기본적인 원리를 알고 있어야 한다. 링크에 보면 ?와 &가 있는 것을 볼 수 있다. ?는 뒤에 오는 것들이 변수로 제공된다는 것을 의미한다. 예를 들어 구글에서 검색을하면 ?로 검색어가 입력되는 것을 볼 수 있다. 그리고 &는 변수를 여러 개 넣어줄 때, 사용하는데 ?a&b&c 처럼 사용하면 동시에 a, b, c 3개를 변수로 보내주는 것을 의미한다.

다시 깃허브 로그인으로 돌아가서 우리가 변수를 보내줘야 하는 링크는 https://github.com/login/oauth/authorize다. 그리고 이 뒤에 우리가 보내주고 싶은 변수와 그 값을 적어주면 된다. 우선 client_id와 allow_singup을 넣어서 login.pug에 하나 만들어보겠다.

```
// login.pug
        input(type="submit", value="Login")
        br
        a(href="https://github.com/login/oauth/authorize?client_id=9fac726866be2ff14f36&allow_signup=false") Continue with Github &rarr;
    hr
    div
        span Don't have an account? 
```

위를 보면 ? 뒤에 client_id=9fac726866be2ff14f36로 client_id를 보내고, allow_signup=false로 보내준 것을 볼 수 있다. 여기다가 scope=user:email를 적어줄 수도 있다. 그런데 scope에 추가적으로 read:user를 적어줘야 하는데, scope는 space-delimited 즉, 스페이스로 구분한다. 그러므로 뒤에 한 칸 띄워주고 적어주면 된다. 최종적으로 url은 `"https://github.com/login/oauth/authorize?client_id=9fac726866be2ff14f36&allow_signup=false&scope=read:user user:email"`이 된다. 하지만 이렇게 계속 늘려가면 url이 계속 길어지게 된다. 그러므로 이를 정리해주겠다.

login.pug로 돌아가서 링크를 아래처럼 바꿔준다.

```
// login.pug
...
        a(href="/users/github/start") Continue with Github &rarr;
...
```

아직 users/github/start가 없기 때문에 라우터를 만들어줘야 한다. userRouter.js에 들어가서 라우터와 컨트롤러를 추가해준다.

```
// userRouter.js
...
userRouter.get("/remove", remove);
userRouter.get("/github/start", startGithubLogin);
userRouter.get(":id", see);
```

그리고 이에 맞춰서 userController.js에 컨트롤러를 만들어줘야 한다. 정보를 나눠서 적어줄 텐데, baseUrl을 만들고 추가적인 정보는 config에 적어준다.

```
// userController.js
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "9fac726866be2ff14f36",
    allow_signup: false,
    scope: "read:user user:email",
  };
};
```

그런데 문제는 config의 정보를 어떻게 하나로 모을 것인지다. 이는 [URLSearchParams](https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams)를 사용하면 된다. URLSearchParams는 URL의 ? 뒷 부분을, 다시 말해 전달되는 변수 부분을 사용하게 해준다. 아래 예시를 보자.

```
// Retrieve params via url.search, passed into ctor
var url = new URL('https://example.com?foo=1&bar=2');
var params = new URLSearchParams(url.search);

// Pass in a string literal
var params2 = new URLSearchParams("foo=1&bar=2");
var params2a = new URLSearchParams("?foo=1&bar=2");

// Pass in a sequence of pairs
var params3 = new URLSearchParams([["foo", "1"], ["bar", "2"]]);

// Pass in a record
var params4 = new URLSearchParams({"foo": "1", "bar": "2"});
```

위의 예시를 보면 `url = new URL()`을 하나 받아온 것을 볼 수 있다. URL을 사용하면 변수로 받아온 url을 분석해서 URL 객체를 만든다. 특히 그 안에는 search라는 것이 포함되는데 URL의 매개변수가 string 형태로 저장된다. 그러므로 url.search를 사용하면 해당 url의 매개변수 부분만 나오는 것이다.

다음으로 URLSearchParams에 매개변수 string이 있는 구체적인 형태를 살펴보자.

```
const params = new URLSearchParams("q=first+second&value=1&person=Me");

params.get("q") === "first second";
params.get("value") === "1";
params.get("person") === "Me";
```

위를 보면 params.get을 사용하면 매개변수의 값을 쉽게 가져오는 것을 볼 수 있다. 뿐 만아니라 set을 사용하면 아래처럼 값을 넣어주는 것도 가능하다.

```
params.set("value", 2);

```

만약 다른 값을 추가하고 싶다면 다음처럼 append를 사용하면 된다.

```
params.append("person", "You");
params.getAll("person") === ["Me", "You"];
```

delete를 사용하면 지우는 것도 가능하다.

```
params.delete("person");
```

그리고 가장 중요한 기능으로 이를 다시 string으로 바꾸는 것이 가능하다.

```
const url = new URL("http://example.com?foo=1&bar=2");
const params = new URLSearchParams(url.search);
params.set("bar", 3);

params.toString() === "foo=1&bar=3";
```

정리하면 URLSearchParams를 사용하면 URL의 매개변수 부분을 수정할 수 있고, 마지막에 toString()으로 다시 string으로 바꿀 수 있다.

```
const url = new URL("http://example.com?foo=1&bar=2");
const params = new URLSearchParams(url.search);
params.set("bar", 3);

const newParams = params.toString();

const modifiedUrl = `${url.origin}?${newParams}`
```

다시 하던 일로 돌아가보자. 우리가 하려던 것은 config에 적어준 것을 baseUrl 뒤에 붙여주는 것이다. 우선 config를 string으로 바꿔주려면 `const params = new URLSearchParams(config).toString();`을 해주면 된다. 그리고 백틱을 사용해서 두 주소를 하나로 합쳐준다. 마지막으로 이렇게 합쳐준 url로 ridirect 해주면 된다.

```
// userController.js
...
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "9fac726866be2ff14f36",
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
```

이렇게 되면 finalUrl로 보내주는데, 이는 깃허브에 있는 페이지가 된다. 여기서 Authorize를 누르면 다른 페이지로 넘겨준다. 여기서 주소를 살펴보면 이전에 OAut App을 만들때, 적어준 callback의 주소임을 알 수 있다. 그러므로 사용자는 Authorize로 로그인이 확인되면, http://localhost:4000/users/github/finish로 돌아오게 된다. 이를 위한 라우터와 컨트롤러의 형태를 만들어 놓고 이번에는 마무리 하겠다.

```
// userRouter.js
import {
  edit,
  remove,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController";
...
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
...
```

```
// userControllser.js
...
export const startGithubLogin = (req, res) => {
  ...
};

export const finishGithubLogin = (req, res) => {};
```

### 7.18 Github Login part Three
깃허브 페이지에서 리다이렉션을 받아서 다시 홈페이지로 돌아오는 것까지는 성공했다. 다음으로 해야할 것은 깃허브에서 받은 토큰을 Acess token으로 바꾸는 일이다. "https://github.com/login/oauth/access_token" 이 주소를 POST 방식으로 보내주는데, 뒤에 매개변수를 붙일 수 있다. 매개변수 중 필수적인 것은 다음과 같다.

- client_id: 깃허브에서 받은 cliend ID로 필수적으로 적어줘야 한다.
- client_secret: 깃허브에서 받은 client secret으로 코드에서 직접적으로 보여선 안 된다. 그러므로 env 파일에서 가져와야 한다.
- code: 앞선 단계에서 돌려받은 code를 말하는데, 리다이렉션으로 받아온 것을 말한다.

코드를 작성하기에 앞서 env 파일에 몇 가지 적어줘야 한다.

```
// .env
COOKIE_SECRET=####
DB_URL=####
GH_CLIENT=####
GH_SECRET=####
```

이때 깃허브에서 받은 client ID는 url에서 보이기 때문에 별도로 적어줄 필요는 없지만 편의를 위해 적어줬다. GH_SECRET에는 깃허브에서 만든 OAuth application 페이지에서 client secrets를 보면 찾을 수 있다. 주의할 것은 client secrets는 다시 볼 수 없으므로 꼭 복사해서 코드로 옮겨놔야 한다. 이를 가지고 finishGithubLogin 컨트롤러를 작성해보자.

```
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id = process.env.GH_CLIENT,
    client_secret = process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?#{params}`;
  const data = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await data.json();
  console.log(json);
};
```

여기서 fetch를 볼 수 있는데, fetch는 자바스크립트에서 서버로 네트워크 요청을 보내고 응답을 받을 수 있게 해주는 매소드다. 기본 형태는 다음과 같다.

```
fetch(url [,option])
  .then(res => {})
  .catch(error => {});
```

url에는 요청을 보낼 url을 적어주고 .then에는 응답으로 할 일을 적어준다. 그리고 .catch에는 에러가 발생할 경우 처리하는 부분이다. 여기서 보면 [,option]이 있는데, 이는 fetch의 2번째 매개변수로 추가적인 정보를 입력할 수 있다.

```
fetch(url, {
  method: something,
  headers: {
    sonething
  },
  body: something,
})
  .then(res => {})
  .catch(error => {});
```

- method: HTTP method를 적어주는 곳으로 적지 않으면 GET을 디폴트 값으로 사용한다.
- header: 요청의 header의 정보를 나타낸다.
- body: 요청에 보내는 데이터를 의미한다.

우리는 fetch로 POST method를 보내주고 있고, 파일을 json 형태로 받기 위해 headers에 Accept: "application/json"을 적어줬다. 그리고 이렇게 돌려받은 정보를 data에 저장했다. 마지막으로 이 정보를 data.json으로 json 형태로 바꿔준다.

이 코드는 시간이 너무 지나면 작동하지 않는다. 왜냐하면 깃허브에서 준 토큰이 10분만 유지되어서 만료되기 때문이다. 또한 위의 코드에서 fetch가 NodeJs에 없기 때문에 에러가 나온다. 다음에는 이를 수정할 방법을 알아보겠다.

### 7.19 Github Login part Four
우린 fetch가 필요한데 NodsJs에는 fetch가 없다. 다행히도 [node-fetch](https://www.npmjs.com/package/node-fetch)를 설치하면 fetch를 사용할 수 있게 된다. `npm i node-fetch@2.6.1`으로 node-fetch를 설치해준다. 최신 버전이 아니라 구버전을 설치하는 이유는, 3.0 버전부터 ESM-only Module이 되면서 작동하지 않기 때문이다.

설치를 완료하면 node-fetch를 import해서 다시 실행시켜보자. 토큰이 만료되서 에러가 날 수도 있지만, 코드가 정상적으로 작동한다. 우리가 작성한 json 파일을 보기 위해서 마지막 줄에 res.send(JSON.stringify(json)); 을 적어준다. 그리고 다시 깃허브 로그인을 누르면 json을 페이지에서 볼 수 있다.

json이 정상적으로 돌아오는 것을 확인했으면 마지막 코드를 지우고 다음을 적어준다.

```
//userController.js
...
  const data = await fetch(finalUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const json = await data.json();
  res.send(JSON.stringify(json));
};
```

이렇게하면 access_token, token_type, scope가 json 형태로 나온다.

이제 마지막 단계를 해야 한다. 마지막 단계는 access_token을 가지고 사용자의 정보를 얻는 것이다. 먼저 json의 access_token을 가져오자. access_token이 없는 경우 login 페이지를 불러오고, 아니라면 access_token으로 코드를 처리하려고 한다. 그렇다면 코드의 형태는 아래처럼 될 것이다.

```
// userController.js
...
  const json = await data.json();
  if("access_token" in json) {
    // access api
  } else {
    return res.redirect("/login");
  }
};
```

마지막으로 해야할 것은 "https://api.github.com/user" 주소에 GET 메소드로 Authorization: token OAUTH-TOKEN를 보내주는 것이다. 여기서 OAUTH-TOKEN은 우리가 받은 access_token을 의미한다. 이를 fetch로 만들면 아래처럼 된다.

```
// userController.js
...
  const json = await data.json();
  if("access_token" in json) {
    const { access_token } = json;
    const userRequest = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
  } else {
    return res.redirect("/login");
  }
};
```

그런데 우리는 data = await fetch();와 json = await data.json();을 사용하고 있다. 자바스크립트를 생각해보면 fetch().json()으로 간결하게 코드를 줄인 것을 기억할 것이다. 그러므로 이를 다음과 같이 줄일 수 있다.

```
// userController.js
  const data = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
```

코드를 잘 살펴보면 알겠지만 안의 await을 실행한 다음에 결과로 나오는 프라미스를 .json()을 사용하기 위해 한 번 더 await을 썼다. 마지막으로 이름이 data로 되어있는데 tokenRequest가 더 적절하므로 이름을 바꿔주었고 그에 맞춰 밑에 data라고 적힌 이름을 바꿔줬다. 그리고 userRequest에도 같은 논리를 적용해서 아래처럼 작성했다.

```
// userController.js
...
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const userRequest = await (
      await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userRequest);
  } else {
    return res.redirect("/login");
  }
};
...
```

여기까지 하고 uerRequest를 console.log로 출력해보면 email: null로 나온다. 이는 email이 private이기 때문이다. 다음에는 이를 고쳐보겠다.

### 7.20 Github Login part Five
지금까지 작성한 코드를 실행하면 로그에는 email: null로 나온다. 그런데 우리는 user:email로 정보를 받아오기로 했었는데 정보가 없다. 이는 이메일 정보를 받아오기 위해 다른 url로 정보를 보내줘야 하기 때문이다.

```
// userControlelr.js
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const email = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!email) {
      return res.redirect("/login");
    }
  } else {
    return res.redirect("/login");
  }
```

### 7.21 Github Login part Six 

```
// userController.js
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    const existingUser = await User.findOne({ email: emailObj.email });
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      const user = await User.create({
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
```

```
// User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
});
```

### 7.22 Log Out

```
// userController.js
...
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
...
 if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
...
```

```
// User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
```

```
// userRouter.js
import {
  edit,
  logout,
  see,
  startGithubLogin,
...
userRouter.get("/edit", edit);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
```

```
// base.pug
      if loggedIn
          li
              a(href="/users/logout")  Log Out
          li
```
### 7.23 Recap