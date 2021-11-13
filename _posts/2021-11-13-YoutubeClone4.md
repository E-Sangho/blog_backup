---
layout: post
title: Youtube Clone4
date:Sat Nov 13 14:34:30 JST 2021
categories: NodeJs Clone
tag: NodeJs Clone
toc: true
---
### 8.0 Edit Profile GET
로그인 했을 때, 프로필을 바꾸는 페이지를 만들어보겠다. userRouter.js에서 /edit 라우터를 수정해서 GET, POST에 맞는 컨트롤러를 만든다.

```
// userRouter.js
...
import {
    getEdit,
    postEdit,
    ...
}
...
userRouter.route("/edit").get(getEdit).post(postEdit);
...
```

다음으로 컨트롤러를 만들어주는데, edit-profile 뷰로 랜더링하게 만들어준다.

```
// userController.js
...
export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = (req, res) => {
    return res.render("edit-profile");
};
```

아직 edit-profile이라는 뷰가 없기 때문에 만들어준다. 이때, Name, Email, Username, Location만 수정할 수 있도록 만든다. 이때, 각 input 안의 값은 loggedInUser에서 사용한다. 비밀번호는 나중에 따로 수정하는 것을 만들어줄 예정이다.

```
// edit-profile.pug
extends base

block content
    form(method="POST")
        input(placeholder="Name", name="name", type="text", required, value=loggedInUser.name)
        input(placeholder="Email", name="email", type="email", required, value=loggedInUser.email)
        input(placeholder="Username", name="username", type="text", required, value=loggedInUser.username)
        input(placeholder="Location", name="location", type="text", required, value=loggedInUser.location)
        input(type="submit", value="Update Profile")
```

그리고 base.pug를 수정해서 로그인 했을 경우 프로필을 수정하는 링크를 만들어준다.

```
// base.pug
...
    if loggedIn
        li
            a(href="/users/edit") Edit Profile
        ...
```

이렇게하면 기본적인 틀은 완성되었지만 문제가 있다. 우리는 프로필을 수정하는 페이지가 로그인 했을 경우에만 보이게 만들어줬다. 하지만 링크를 거치지 않고 주소를 바로 입력해도 해당 페이지에 갈 수 있다. 이 경우 로그인을 하지 않았으므로 loggedInUser이 undefined일 것이다. 그런데 우리는 edit-profile.pug에서 loggedInUser의 값을 사용하고 있으므로 에러가 발생한다. 이를 수정하기 위해서 loggedInUser이 비어있을 경우 비어있는 객체가 되도록 만들어야 한다. 이는 || 를 사용하면 굉장히 간단히 수정할 수 있다.

```
// middlewares.js
export const localsMiddleware = (req, res, next) => {
    ...
    res.locals.loggedInUser = req.session.user || {};
    next();
};
```

이렇게하면 req.session이 비어있는 경우 {}로 사용하고 아닐 경우 그대로 사용하므로 아무런 문제 없다. 주의할 것은 a || b 가 a를 먼저 실행하고 a가 false인 경우에만 b를 실행한다는 것이다. 그러므로 순서를 바꿔서 {} || req.session.user로 적어주면, loggedInUser이 항상 비게 되므로 순서를 바꿔서는 안 된다.

### 8.1 Protector and Public Middlewares
우리는 이전에 주소를 통한 페이지 이전으로 생기는, 프로필 수정 페이지의 오류를 해결해줬다. 그런데 이는 여기서만 해당되는 이야기가 아니다. 로그인한 경우에 로그인 페이지 링크가 보이지 않게 만들었지만, 사용자가 직접 입력할 경우 접속할 수 있다. 로그아웃한 경우에도 로그아웃 페이지에 접속할 수 있고, 프로필 수정 페이지에 접근할 수 있다. 이처럼 현재 로그인 여부와 상관 없이 페이지를 오갈 수 있다는 문제가 있다.

이번에는 이를 수정하기 위해 미들웨어를 만들어주겠다. 사용할 미들웨어는 2가지로 protectorMiddleware, publicOnlyMiddleware다. 우선 protectorMiddleware는 사용자가 로그인 한 경우 그대로 통과하고, 로그인 하지 않은 경우는 로그인 페이지로 보내준다. publicOnlyMiddleware는 로그인하지 않은 경우 통과하고, 로그인 한 경우 홈으로 보내준다.

이 둘을 사용해서 라우터에 미들웨어를 추가해주면, 뒤의 컨트롤러가 실행되기 전에 로그인 여부를 확인하고 실행되어선 안 되는 컨트롤러를 막아준다. 예를 들어서 `userRouter.get("/logout", protectorMiddleware, logout)`으로 적어주었다고 생각해보자. /users/logout에 접속했을 때, protectorMiddleware가 실행된다. 만약 로그인 했다면, protectorMiddleware가 아무런 일도 하지 않으므로 logout 컨트롤러가 실행된다. 반대로 로그인 하지 않은 경우, protectorMiddleware가 로그인 페이지로 보내므로, 뒤의 logout 컨트롤러가 실행되지 않는다.

아래는 middlewares.js에 protectorMiddleware과 publicOnlyMiddleware를 만들어 준 것이다.

```
// middlewares.js

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/");
    }
};
```

그리고 이들을 import해서 라우터별로 사용해주면 된다. 그 전에 어떤 것을 사용해야 하는지 분류해야 한다. 로그인한 경우에만 작동되고 싶은 라우터는 "/users/logout", "/users/edit"이다. 로그아웃한 경우에만 사용하고 싶은 라우터는 "/users/github/start", "/users/github/finish", "/login", "/join"이다.

그런데 "/edit"이나 "/join"은 .get과 .post를 둘 다 사용하고 있다. 선택지는 2가지가 있다. 첫 번째는 `rootRouter.route("/join").get(publicOnlyMiddleware, getJoin).post(publicOnlyMiddleware, postJoin);`처럼 .get, .post에 둘 다 사용하는 것이 있다. 다른 하나는 .all을 사용해서 모든 경우에 작동되는 미들웨어를 만들고 그 뒤에 .get, .post를 적어주는 것이다. `rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);`

이를 적용해서 각 라우터별로 만들어주면 다음처럼 된다.

```
// rootRouter.js
import { publicOnlyMiddleware } from "../middlewares";
...
rootRouter
    .route("/join")
    .all(publicOnlyMiddleware)
    .get(getJoin)
    .post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
```

```
// userRouter.js
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";
...
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
```

### 8.2 Edit Profile Post part One
### 8.3 Edit Profile Post part Two 
### 8.4 Change Password par One
### 8.5 Change Password par Two
### 8.6 File Uploads par One
### 8.7 File Uploads par Two
### 8.8 Static Fiels and Recap
### 8.9 Video Upload
### 8.10 User Profile
### 8.11 Video Owner
### 8.12 Video Owner par Two
### 8.13 User's Videos
### 8.14 Bugfix
### 8.15 Conclusions
