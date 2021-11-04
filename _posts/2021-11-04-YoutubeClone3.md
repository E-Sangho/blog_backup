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

```
// join.pug
...
        input(type="submit", value="Join")
    hr
    div
        span Already have an account? 
        a(href="/login") Log in now &rarr; 
```

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
### 7.8 Sessions and Cookies part Two
### 7.9 Logged In User
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