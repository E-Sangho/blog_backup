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
비디오 컨트롤러도 보호해줘야 한다. 비디오를 edit, delete, upload는 로그인 한 경우에만 가능해야 한다. 그러므로 videoRouter.js로 이동해서 아래처럼 protectorMiddleware를 추가해주자.

```
// videoRouter.js
import { protectorMiddleware } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(postUpload);
```

아직은 video model과 user model을 연결하지 않았지만, 나중에 비디오에 어떤 사용자가 업로드 했는지를 추가하면 수정, 삭제, 업로드가 가능해질 것이다.

팁하나를 주자면, 임포트 하고 싶은 파일을 열어놓고, 그 파일의 함수를 사용하면 VSC에서 자동으로 그 함수를 import한다. 반드시 두 파일이 모두 열려 있어야 가능하다는 점에 주의하자.

다음으로 업로드 비디오는 로그인한 경우에만 가능해야 한다. 그러므로 base.pug에서 링크를 수정해서 로그인 한 경우에만 Upload Video가 보이도록 만든다.

```
// base.pug
...
    if loggedIn
        li
            a(href="/videos/upload") Upload Video
        li
            a(href="/users/edit") Edit Profile
        li
            a(href="/login")  Login
...
```

이제 본격적으로 edit-profile을 만들어보겠다. edit-profile 페이지에서 POST로 수정할 정보를 보내면 이를 postEdit에서 수정한다. POST로 보내준 정보는 req.body에 들어 있으므로, 그 안에서 name, emai, username, location을 받아온다.

```
// userController.js
export const postEdit = (req, res) => {
    const { name, email, username, location } = req.body;
}
```

그리고 받아온 정보를 가지고 업데이트를 해줘야 한다. 그렇게 하려면 findByIdAndUpdate()를 사용하면 된다. 여기서 우리는 id가 필요한데, 이는 req.session.user._id에 있다. 그러므로 우선은 _id를 받아와야 한다. `const _id = req.session.user._id;`로 적어줘도 _id를 받아올 수 있지만 아래 방법이 더 효과적이다.

```
const {
    session: {
        user: { _id },
    },
} = req;
```

왜 이 방식이 더 효과적인가 하면 한 번에 여러 곳에서 정보를 받아올 수 있기 때문이다. 우리의 경우 req.session.user._id를 받아옴과 동시에, req.body에서 name, email, username, location을 받아오고 있다. 아래 방식을 사용하면 이를 동시에 가져올 수 있고, 코드를 작성하기 더 편해진다.

```
const {
    session: {
        user: { _id },
    },
    body: { name, email, username, location },
} = req;
```

이제 이렇게 찾은 정보들로 데이터를 업데이트 해보자. 정보를 찾고 업데이트 하기위해선 `findByIdAndUpdate(_id, [update] [,options])`를 사용하면 된다. 여기서 _id에 _id를 넣어주고, update에 변경하고 싶은 내용을 적어주면 된다. 
findByIdAndUpdate로 새로 받아온 자료로 업데이트 해주자.

```
export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { name, email, username, location },
    } = req;
    await User.findByIdAndUpdate(_id, {
        name,
        email,
        username,
        location,
    });
    return res.render("edit-profile");
};
```

업데이트 한 후에 페이즈를 보면 name, email, username, location이 전혀 업데이트 되지 않았다. 그런데 데이터베이스를 보면 업데이트 돼있다. DB가 업데이트 됐음에도, 페이지가 그대로인 이유는, 우리가 DB를 업데이트 한 것일 뿐이지 세션을 업데이트 한 것이 아니기 때문이다. 우리가 사용하는 세션이 DB로부터 만들어진 것은 맞지만, DB와 세션은 별개의 것이다.

잠시 세션을 복습해보자. 세션이 만들어지는 과정을 아래와 같다.

1. HTTP 요청이 들어온다.
2. 미들웨어가 세션 쿠키를 확인한다.
3. 세션 쿠키가 없다면, 새로 하나 만들고 마지막에 세션 아이디를 만들어서 세션 쿠키를 반환한다.
4. 세션 쿠키가 있다면, 세션 아이디로 세션을 찾아서 request 객체에 세션 정보를 추가해준다.
5. 세션 미들웨어가 종료된다.
6. request 객체에 세션 정보가 추가되었으므로, 이후 익스프레스에서 일어나는 과정에서 세션을 사용할 수 있게 된다.

우리가 지금까지 req.session을 사용할 수 있었던 이유가, 세션 미들웨어가 실행되면서 DB에 있던 세션 객체가 request에 추가되었기 때문이다. 그리고 우리는 위에서 이 세션 정보에서 _id를 찾아와서 DB를 수정해주었을 뿐이다.

다시 돌아가서 view를 보면 locals의 자료를 우리에게 보여준다. 이 locals이 나온 곳은, middlewares.js의 localMiddleware에서 session을 locals에 넣어주고 있다. 그리고 세션은 로그인 할 때, `req.session.loggedIn = true`와 `req.session.user = user`을 추가해서 만들어준 것이다. 여기서 세션은 DB와 별개의 것으로 우리는 세션을 업데이트 해줬을 뿐이다. 그래서 우리의 DB에는 loggedIn 같은 속성이 생기지 않는 것이다.

우리가 상요한 findByIdAndUpdate는 DB를 업데이트 하는 함수다. 그래서 DB는 업데이트 되었지만, 세션을 바꿔주는 것이 아니라 세션은 그대로인 것이다. 그래서 우리에게 보이는 페이지는 이전의 세션을 그대로 보여주고 아무런 변화가 없는 것이다.

### 8.3 Edit Profile Post part Two
우리는 DB를 업데이트 해줬지만, 페이지에 아무런 변화도 없었다. 이는 프론트엔트는 session으로부터 정보를 얻기 때문이다. 여기서 session은 로그인 할 때만 사용되고 있는데, 결국 사용자가 로그인 한 경우에만 바뀐다. 그래서 DB를 업데이트 해도 session이 바뀌질 않는다. 이를 해결하는 방법은 2가지가 있다.

첫 번째, session에 직접 넣어주는 것이다. 앞서 DB를 업데이트 한 postEdit에서 `res.session.user = {name, email, username, locaion}`으로 직접 업데이트 해주는 것이다. 그런데 session은 저 외에도 다양한 정보를 담고 있다. 위와 같이 작성하면 저 이외의 정보는 없어지게 될 것이다. 그러므로 나머지 정보도 넣어줘야 한다. 이는 `...req.session.user`를 사용하면 된다. 여기서 ...은 안의 내용을 밖으로 꺼내준다는 의미로, req.session.user 안의 내용을 {}을 제거하고 꺼내준다는 뜻이다. 그러므로 아래처럼 작성하면 session의 내용을 모두 꺼내주고, name, email, username, location을 덮어써준다.

```
// userController.js
    ...
    req.sesison.user = {
        ...req.session.user,
        name,
        email,
        username,
        loaction,
    };
    return res.redirect("/user/edit");
```

두 번째, findByIdAndUpdate를 이용하는 것이다. `findByIdAndUpdate(_id, [update], [options]))`는 찾으려는 _id, 업데이트할 내용, 옵션 순서로 패러미터를 넣는다. 그리고 findByIdAndUpdate는 변경한 데이터를 반환한다. 그런데 findByIdAndUpdate의 중요한 점은 반환하는 것이 업데이트 이전의 데이터라는 점이다. 우리는 업데이트 이후의 데이터가 필요하다. 이 경우 options에 returnDocument="after"로 설정하면 업데이트 이후의 데이터가 나온다. 그러므로 업데이트 한 내용을 반환 받아서 바로 req.session.user에 넣어주면 된다.

```
// userController.js
...
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location,
    },
    { returnDocument: "after" }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
}
```

마지막으로 username과 email을 업데이트 할 때, 중복되는 값이 있는지 검사해야 한다. 이는 exists를 쓰면 존재 여부는 쉽게 알 수 있다. 우리는 이전에도 `const exists = await User.exitsts({ $or: [{ username }, { email }] });`로 username과 email이 있는지 확인했었다. 그런데 어떻게 사용자가 내용을 업데이트 하려는지 확인할 수 있을까? 만약 사용자가 아무것도 수정하지 않고 그대로 업데이트를 누르면, 이미 존재하는 사용자이므로 값을 업데이트 하지 않게 된다. 그러므로 우리는 사용자가 username이나 email을 변경시켰는지를 알아봐야 한다.

이를 위해서 _id로 사용자를 찾아주고, 사용자의 username, email과 입력받은 username, email에 차이가 있는지를 확인하고, 차이가 없다면 업데이트를 해줘야 한다. 먼저 `const findedUser = await User.findById({_id});`로 _id를 사용해서 사용차를 찾아준다. 그 후 email을 비교해서 서로 다르다면, 바꾸려는 email을 검색해서 존재하는지 확인해줘야 한다. 이는 `const findEmail = await User.findOne({ email });`로 가능하다. 그 후에 둘의 _id를 비교해서 다르다면 바꾸려는 이메일을 쓰는 사용자가 있다는 의미이므로 허용해서는 안 된다. 이때, 바꾸려는 이메일을 쓰는 사용자가 없을 수도 있기 때문에, findEmail이 null인지 확인해줘야 한다. 동일한 과정을 username에 적용하고, 이 둘을 통과했다면 username과 email을 변경해준다. 아래는 이를 코드로 적은 것이다.

```
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = req;
  /*
   * We need to check that username or email are already existed or not.
   * First, we need to find user by _id.
   */
  const findedUser = await User.findById({ _id });
  // Next, we check findedUser.email and email are equal 
  if(findedUser.email !== email) {
    // If they are different, find the owner of email
    const findEmail = await User.findOne({ email });
    // findEmail can be null, so we need to check it 
    // and identify they have same _id
    if(findEmail !== null && findedUser._id !== findEmail._id) {
        // If _id are different, it means that the users are different
        // So, we shouldn't allow to change email
        console.log("This email already exists");
        return res.redirect("/users/edit");
    }
  }
  if(findedUser.username !== username) {
    const findName = await User.findOne({ username });
    if(findName !== null && findedUser._id !== findName._id) {
      console.log("This username already exists");
      return res.redirect("/users/edit");
    }
  } 
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location,
    },
    { returnDocument: "after" }
  );
  req.session.user = updatedUser; 
  return res.redirect("/users/edit");
};
```
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
