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
### 8.4 Change Password part One
비밀번호를 바꾸는 페이지를 만들어보겠다. edit-profile.pug에서 비밀번호를 바꿀 수 있는 페이지로 가는 링크를 만들어주겠다.
```
// edit-profile.pug
...
block content
    form(method="POST")
        ...
        input(type="submit", value="Update Profile")
        // add link to go to change-password page
        hr
        a(href="change-password") Change Password &rarr;
```

물론 아직 라우터도 컨트롤러도 없기 때문에 change-password로 가더라도 아무런 일도 일어나지 않는다. 먼저 컨르롤러부터 만들어줘야 한다. 그런데 지금까지 우리는 굉장히 많은 view 파일을 만들었기 때문에, 정리되지 않은 채로 계속 늘어가고 있다. 앞으로는 사용자와 관련된 것은 users 폴더에, 비디오와 관련된 것은 videos 폴더에 만들어줄 것이다. 그러므로 컨트롤러에서 view를 랜더링할 때, users 폴더에서 불러와야 한다. 이를 가지고 userController.js에 getChangePassword와 postChangePassword를 만들어준다.

```
// userController.js
...
export const getChangePassword = (req, res) => {
    // We need to organize views for future.
    // So, we will make users folder and put change-password file inside of it.
    return res.render("users/change-password", { pageTitle: "Change Password"});
};

export const postChangePassword = (req, res) => {
    return res.redirect("/");
};
```

다음으로 라우터를 만들어준다.

```
// userRouter.js
...
// import get/postChangePassword from userController
import {
    ...
    getChangePassword,
    postChangePassword,
} from "../controllers/userController";
...
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
// add a change-password router
userRouter
    .route("/change-password")
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);
...
```

마지막으로 change-password view 파일을 만들어줘야 한다. 앞서 말했듯이 분류를 위해, views 폴더 안에 users라는 폴더를 하나 만들어서 그 안에 change-password.pug 파일을 만들어주려고 한다. 문제는 이전처럼 `extends base`를 하면 안 된다. base 파일이 폴더 밖에 있으므로 `extends ../base`로 적어줘야 한다.

```
// change-password.pug
extends ../base

block content
   form(method="POST")
    input(placeholder="Old Passwrod", type="password", name="oldPassword")
    input(placeholder="New Password", type="password", name="newPassword")
    input(placeholder="New Password Confirmation", type="password",  name="newPasswordConfirmation")
    input(type="submit", value="Change Password")
```

그 밖에도 한 가지 문제가 더 있다. 깃허브로 로그인 한 경우에는 비밀번호를 우리 사이트에서 바꿀 수가 없다. 그러므로 깃허브 로그인한 경우 비밀번호 변경 페이지가 보여서는 안 된다. 이 경우 3가지 방법이 있다. 첫 번째는 컨트롤러에서 소셜 로그인인 경우를 확인해서 홈으로 돌려보내는 것이다. 두 번째 방법은 비밀번호 변경 폼은 보이되 사용할 수는 없게 만드는 것이다. 세 번째는 아예 edit-profile 페이지에서 비밀번호 변경 버튼이 안 보이게 해서 누를 수 없게 하는 것이다. 아래는 첫 번째나, 두 번째 방법을 선택할 경우 코드를 삽입해야 할 위치다.

```
...
export const getChangePassword = (req, res) => {
    // First, if use is logged in social authentication, redirect to home
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
        // or we can show alert and go back to the page
    }
    return res.render("users/change-password", { pageTitle: "Change Password"});
};
...
```

하지만 제일 좋은 것은 기능하지 않는 것은 숨기는 방법이므로, 소셜 로그인한 경우엔 비밀번호를 바꾸는 버튼이 없도록 만들어주자. edit-profile.pug 파일에서 소셜 로그인인 경우 Change Password가 보이지 않게 만든다.

```
// edit-profile.pug
...
block content
    ...
    input(type="submit", value="Update Profile")
    // If user is logged in social authentication, Change Password anchor must be hidden.
    if !loggedInUser.socialOnly
        hr
        a(href="change-password") Change Password &rarr;
```

### 8.5 Change Password part Two
현재 우리는 소셜 로그인한 정보가 DB에 남아 있으므로, 몽고의 데이터를 모두 지워주도록 한다. `mongo`로 접속한 `use wetube`로 wetube를 사용하는 데이터로 지정한다. 그 다음에 `db.sessions.remove({})`를 입력하면 세션 데이터를 모두 지울 수 있다. 같은 방법으로 `db.users.remove({})`로 사용자 정보도 모두 지워준다.

그리고 새로 회원가입을 해 준 다음, edit-profile에 들어가면 소셜 로그인 때는 볼 수 없었던 Change Password를 볼 수 있다. 그런데 앞으로도 소셜 로그인과, 일반 로그인을 나눠야 하는 경우가 많을 수도 있다. 이 경우엔 소셜 로그인 한 경우와 아닌 경우를 나눠주는 미들웨어를 만들어주면 더욱 편할 것이다. 우리는 아직은 필요하지 않으므로 추가하지는 않겠다. 만약 만든다면 passwordOnly 같이 비밀번호가 있는 경우에만 사용할 수 있도록 하는 미들웨어를 추가하면 된다.

다음으로 postChangePassword를 완성시켜야 한다. 우선은 form에서 보내주는 정보를 받아주고, 현재 로그인한 사용자가 누구인지를 알아내야 한다. _id는 req.session.user에 있고, form에서 보내준 정보는 req.body에 들어 있다. 이전에 postEdit에서 한 것처럼 작성하면 간단하게 데이터를 받아 온다.

```
// userController.js
...
export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { oldPassword, newPassword, newPasswordConfirmation },
    } = req;
    return res.redirect("/");
};
```

다음으로 해야 할 일은 새로 만들 비밀번호가 같은지를 확인하는 것이다. 만약 비밀번호가 다르다면 errorMessage를 전송하게 만들어야 한다. 또한 인증에 실패했으므로 status(400)으로 브라우저가 실패했음을 인지하게 만들어야 한다. 그리고 view 파일도 수정해서 errorMessage를 출력하게 만들어주자.

```
// userController.js
    ...
    const {
        ...
    } = req;
    if (newPassword !== newPasswordConfirmation) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The password does not match the confirmation",
        });
    }
    ...
```

```
// change-password.pug
block content
    if errorMessage
        span #{errorMessage}
    ...
```

다음으로 oldPassword가 일치했는지를 확인해야 한다. 이는 이전에 bcrypt로 해결한 적이 있다. 같은 방식을 사용하기 위해선 req.session.user.password가 필요하므로 받아와주고, bcrypt.compare()로 비교해준다. 그 후 비밀번호가 일치하지 않는다면 위와 동일하게 하되, 에러 메세지만 수정해주면 된다.

```
// userController.js
...
export const postChangePassword = async (req, res) => {
    const {
        session: {
            // get password
            user: { _id, password },
        },
        body: { oldPassword, newPassword, newPasswordConfirmation },
    } = req;
    // use bcrypt to check password
    const ok = await bcrypt.compare(oldPassword, password);
    // and, if !ok show errorMessage
    if (!ok) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect",
        });
    }
    if (newPassword !== newPasswordConfirmation) {
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The password does not match the confirmation",
        });
    }
    return res.redirect("/");
};
```

다음으로 모든 것이 일치한다면 비밀번호를 변경해줘야 한다. 이전에 우리는 User 스키마를 만들 때, pre로 저장하기 전에 해시함수로 암호화 하는 과정을 추가해줬다. 그러므로 우리가 `user.save();`만 사용하더라도 알아서 현재 비밀번호를 암호화 한다. 그런데 우리는 아직 사용자의 비밀번호를 바꿔주지 않았으므로, 비밀번호를 바꿔준 다음에 저장해야 한다. 그러므로 사용자를 _id로 찾아와서 password를 newPassword로 바꿔준 다음에 저장하도록 만들어준다.

```
// userController.js
export const postChangePassword = async (req, res) => {
    ...
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    return res.redirect("/");
};
```

마지막으로 비밀번호를 바꿀 경우 강제로 로그아웃 시키고 다시 로그인 하도록 만들어보자. 이 경우는 간단하다. `return res.redirect("/users/logout");`으로 보내주기만 하면 된다. 이렇게하면 완성이다.

그런데 비밀번호를 여러 번 바꾸려고 하면 The current password is incorrect라는 문구가 나온다. 다시 말해서 oldPassword와 password가 다르다는 것이다. 왜 이런 일이 발생하는 것일까?

이는 우리가 oldPassword와 세션의 비밀번호를 비교하기 때문에 발생한다. 우리는 세션에서 비밀번호를 받아와서 검증하는데 사용하지만, 정작 세션은 업데이트 하지 않았다. 그러므로 비밀번호를 비교할 때, 세션에 있느 이전의 비밀번호로 비교하게 되고, 에러 메세지가 나오는 것이다. 이를 해결하기 위해 세션을 업데이트 해줘야 한다.

```
// userController.js
    ...
    await user.save();
    // update session's password
    req.session.user.password = user.password;
    ...
```

다른 방법으로는 _id로 사용자를 찾는 부분을 패스워드 검증하는 곳 보다 먼저 사용한 다음, password 대신에 user.password를 사용해도 된다. 이렇게 하면 세션에서 값을 가져오는 것이 아니라 DB에서 가져오기 때문에, 세션을 업데이트해줄 필요가 없다.

```
// userController.js
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  // find user by _id 
  const user = await User.findById(_id);
  // We can use user.password to confirm oldPassword.
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }
  // We don't need to find _id here.
  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};
```

### 8.6 File Uploads part One
어떻게 파일을 업로드 하는지 알아보자. 사용자의 아바타용 사진을 업로드하는 기능을 추가하려고 한다. 우선 당연히 로그인 한 경우에 edit-profile에 파일을 업로드하는 칸을 만들어주자. 그러기 위해서는 input에 속성으로 type="file"로 지정해서 만들면 된다. 다만 우리는 이미지 파일만 추가하기를 원하므로 accept="image/*"를 추가해주도록 하자.

```
// edit-profile.pug
block content
    form(method="POST")
        label(for="avatar") Avatar
        input(type="file", name="avatar", id="avatar", accept="image/*")
        ...
```

그리고 우리는 [multer](https://www.npmjs.com/package/multer)이라는 미들웨어를 사용한다. multer은 파일을 업로드 하도록 도와준다. `npm i multer`로 패키지를 설치해준다. multer를 사용하려면 form을 **multipart/form-data**로 만들어줘야 한다. 위의 form으로 돌아가서 enctype="multipart/form-data"를 추가해준다. 이 속성은 form의 인코딩 방법을 바꿔주기 때문에 잊어버려서는 안 된다.

다음으로 우리는 미들웨어를 만들어야 한다. middlewares.js에 가서 미들웨어를 만들어야 하는데 uploadFiles라는 이름으로 만들자. 그런데 이 미들웨어는 req, res를 사용하지 않는다. 대신 dest, fileFilter, limits, preservePath를 사용한다. dest는 말 그대로 파일을 어디에 저장시킬지를 지정하는 것이다. 추후에 자세히 설명하겠지만 하드에 직접 저장하는 것은 그리 좋은 방법이 아니다. 하지만 지금은 하드에 저장시키고 나중에 바꿔주도록 하자.

```
// middlewares.js
import multer from "multer";
...
export const uploadFiles = multer({
   dest: "uploads/"
});
```

나는 위의 폴더가 자동으로 생겨서 아무런 문제 없었지만, 혹시라도 생기지 않는다면 직접 만들어준다.

다음으로 미들웨어를 사용해보겠다. 우리가 사용하고 싶은 곳은 edit-profile이 post되는 곳이다. 사용되는 순서는 `app.post("/profile", upload.single("avatar"), function (req, res, next){})` 형태가 되면 된다. 다시 말해 url, 미들웨어, 컨트롤러 순으로 작성해야 한다. 우리는 url을 앞에 route에 적어줬기 때문에 post 안에 미들웨어, 컨트롤러만 적어주면 된다. 미들웨어를 적어줄 때, single, array, fields를 지정할 수 있는데, 각각 하나의 파일, array 파일, object 파일이다. 우리는 이미지 파일 하나만 올릴 것이기 때문에 uploadFiles.single()을 사용한다. 이때, single 안에 들어가는 문자는 form에서 받아오는 input의 name이다. 그러므로 아래처럼 적어줘야 한다.

```
// userRouter.js
...
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(uploadFiles.single("avatar"), postEdit);
...
```

여기서 multer 미들웨어의 작동 방법을 설명해야 한다. multer은 form에서 파일을 받아오고 uploadFiles를 실행시켜서 그 파일을 폴더에 저장한다. 그 후 저장한 정보를 postEdit에 전달해준다. 이렇게 추가한 정보는 req.file에서 찾을 수 있다. postEdit에서 console.log(req.file)을 적어주고, 파일을 업로드 했을 때 콘솔에 적히는 것을 확인해보자. 그 중에서 path가 중요한데, 우리가 User 스키마를 만들 때, 아바타 url을 만들었다. 여기에다가 콘솔에 나온 path를 적어주면 해당 사용자와 파일이 연결되게 된다. 이에 관한 것은 다음에 계속하겠다.

### 8.7 File Uploads part Two
어떻게 하면 파일을 사용자와 연결 시킬 수 있을끼? 처음 드는 생각은 req.file.path를 가져와서 findByIdAndUpdate를 사용할 때, 같이 넣어서 업데이트 해주면 될 것 같다. 그런데 사용자가 아바타를 사용하지 않으면 어떻게 될까? 아바타를 사용하지 않았다면 file이 undefined이므로 path가 존재하지 않아서 에러가 발생한다. 그러므로 req.file.path를 가져오는 것이 아니라 req.file을 가져와야 한다. 하지만 여전히 file이 undefined인 경우엔 업데이트 해주는 것이 불가능하다. 그러므로 세션의 user 정보를 활용해야 한다.

우선 req.session.user에서 avatarUrl을 받아온다. 그리고 findByInAndUpdate 안에서 avatarUrl을 업데이트 하되, 삼항 연산자를 사용해서 file이 undefined인 경우엔 avatarUrl을 그대로 넣어준다.

```
// userController.js
export const postEdit = async (req, res) => {
  const {
    session: {
        // get avatarUrl
        user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
        // use ternary operator to update avatarUrl
        avatarUrl: file ? file.path : avatarUrl,
      ...
    }
```

마지막으로 commit 하기 전에 .gitignore에 /uploads 폴더를 추가해서 파일이 커밋 되는 것을 막아야 한다.

```
// .gitignore
/node_modules
.env
/uploads
```

이렇게 파일을 업로드하는 것을 완료했다. 이렇게 하면 우리는 파일을 DB에 저장하지 않는다. 대신에 파일의 위치를 DB에 저장하고, 파일은 따로 uploads에 저장한다. 다시 말해 DB에는 파일을 저장하지 않고 오직 그 위치만을 저장해야 한다. DB는 파일을 저장하기 위한 공간이 아니기 때문이다.

이제 업로드한 이미지가 보이도록 edit-profile을 수정해주자. 그런데 img의 src 속성을 사용할 때, loggedInUser.avatarUrl을 그대로 사용하면 상대 url로 판단해서 users/uploads에서 파일을 찾게 된다. 그런데 uploads 폴더는 /uploads에 있으므로, 절대 url을 사용해야 한다.

```
// edit-profile.pug
...
block content
    img(src="/" + loggedInUser.avatarUrl, width="100", height="100")
    ...
```

하지만 이렇게 작성해줘도 제대로 작동하지 않는다. 그 이유는 이미지를 받아와야할 url을 라우터나 사용해야 할 폴더로 지정한 적도 없기 때문에 익스프레스가 처리하지 못하기 때문이다.

### 8.8 Static Fiels and Recap
이제 브라우저가 uploads 폴더에 있는 파일에 접근할 수 있어야 한다. 왜 이런 일을 해야 하냐면, 만약 브라우저가 어떤 폴더든 갈 수 있다고 하면, 보안상 좋지 못하다. 그러므로 사용하는 폴더를 따로 지정해주도록 만들어져있다. 그러기 위해서 static files serving이라는 것을 활성화 시킨다. 이는 폴더 전체를 브라우저에게 노출 시키는 기능이다.

우선 /upload 라우터를 만들어야 한다. 그리고 폴더를 노출시키기 위해 express.static()을 사용한다. static에는 노출시키고 싶은 폴더를 적어주면 된다.

```
// server.js
...
app.use(localsMiddleware);
app.use("uploads", express.static("uploads"));
app.use("/", rootRouter);
...
```

이렇게 하고 다시 edit-profile을 확인해보면 아바타가 나오는 것을 확인할 수 있다. 

요약하면 우리가 원하던 것은 파일을 업로드 하는 것이었다. 그래서 multer을 사용해 파일을 받아오게 만들었다. 다음으로 form을 만들어서 이미지를 받아오고 서버에 저장했다. multer 미들웨어는 받아온 파일의 정보를 다음 컨트롤러의 req에 넣어서 사용할 수 있게 해준다. 우리는 req에서 file을 받아왔다. 이 file은 사용자가 업로드 했을 수도 안 했을 수도 있으므로 삼항 연산자를 사용해서 undefined인 경우에도 에러가 발생하지 않도록 만들었다. 그리고 avartarUrl을 받아왔지만 아직 브라우저는 이 파일이 존재하는지 모른다. 그러므로 express.static()으로 폴더를 사용할 수 있게 만들어줬다. 그 결과 edit-profile에서 업로드한 이미지를 볼 수 있게 되었다.

그런데 문제가 있다. 우리가 새로 파일을 업로드할 때마다 새로 파일이 생기고, 이전의 파일은 삭제되지 않으므로 파일이 계속 쌓이게 된다. 또한 파일이 서버에 저장되고 있다는 점도 문제다. 서버는 계속 종료되고 다시 시작되기 때문에, 업로드하면 그 전 서버의 저장된 파일들이 사라지게 된다. 또한 여러 서버를 사용하고 있으면 한 서버가 다운되었을 때, 그 서버에 저장된 파일을 사용할 수 없게 된다. 나중에 이 방법을 고쳐서 서버가 다시 시작돼도 파일은 그대로 남아있게 만들겠다.

### 8.9 Video Upload
이번에는 비디오를 업로드 하는 것을 추가해보겠다. 앞서 이미지에서 했던 것을 그대로 비디오로 한다고 보면 된다. 우선 샘플 비디오가 하나 필요하다. 샘플 비디오는 [sample-video](https://sample-videos.com/)에서 원하는 사양으로 받을 수 있으니 하나 준비하자.

upload.pug에 들어가서 비디오를 업로드하는 것을 추가한다.

```
// upload.pug
block content
    if errorMessage
        span=errorMessage
    form(method="POST", enctype="multipart/form-data")
        label(for="video") Video File
        input(type="file", accept="video/*", required, id="video", name="video")
        ...
```

다음으로 videoRouter.js에 들어가서 /upload의 post에 uploadFiles 미들웨어를 추가해준다.

```
import {
    ...
    avatarUpload,
} from "../middlewares";

...
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  // add avatarUpload middleware
  .post(UploadFile.single("avatar"), postEdit);
```

여기서 multer의 옵션을 소개해야 한다. multer는 파일의 크기를 제한할 수 있다. fileSize라는 옵션인데, 이를 사용해서 이미지는 3MB이하로, 비디오는 10MB 이하로 제한하겠다. 그래서 미들웨어를 나눠서 용량을 제한하는 미들웨어 2개로 만들겠다.

```
// middlewares.js

expot const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
        fileSize: 300000,
    },
});

export const videoUpload = multer({
    dest: "uploads/videos/",
    limits: {
        fileSize: 10000000,
    },
});
```

미들웨어의 이름을 바꿨으므로 그에 맞추어 이름을 바꿔줘야 한다.

```
// userRouter.js
import {
    ...
    avatarUpload,
} from "../middlewares";
...
userRouter
    .route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    // change middleware's name
    .post(avatarUpload.single("avatar"), postEdit);
...
```

```
// videoRouter.js
import {
    ...
    videoUpload
} from "../middlewares";
...
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);
...
```

파일의 크기에 따라 숫자를 바꿔가며 파일이 업로드 되는지 아닌지 테스트 해보자. 만약 파일이 너무 크다면 에러가 발생해서 페이지가 랜더링 되지 않는다. 우리는 에러만 보내고 페이지는 랜더링 되게 하고 싶기 때문에 나중에 이 문제를 수정해보겠다.

우선은 postUpload에서 비디오를 추가하는 것을 만들어주려고 한다. 그 전에 videoSchema를 보면 우리는 비디오의 url을 속성으로 넣어주지 않았다. 그러므로 스키마를 수정해서 fileUrl을 속성으로 가지도록 만든다.

```
// Video.js
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 20 },
  ...
```

```
// videoController.js

export const postUpload = async (req, res) => {
    // get fileUrl from req.file.path
    const file = req.file;
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
        title,
        description,
        // We add fileUrl on the videoSchema.
        // So, we can create video with fileUrl
        fileUrl: file.path,
        hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(400).render("upload", {
        pageTitle: "Upload Video",
        errorMessage: error._message,
        });
    }
};
```

다음으로 비디오가 나오도록 watch.pug에 만들어준다. video에 src를 추가해주면 비디오가 생성된다. 여기다가 controls를 추가해서 재생 가능하게 만들어준다.

```
// watch.pug
block content
    video(src="/" + video.fileUrl, controls)
    ...
```

마지막으로 postUpload 컨트롤러를 조금 수정하겠다. file을 받아오는 대신에 `{ path } = req.file`을 사용하면 `fileUrl: path,`로 줄일 수 있다. 아니면 ES6를 사용해서 아래처럼 줄일 수도 있다.

```
// videoController.js

export const postUpload = async (req, res) => {
    // We can make a path to fileUrl
    const { path: fileUrl } = req.file;
    ...
    try {
        // We can shortcut fileUrl: path, to fileUrl.
        fileUrl, 
    }
    ...
};
```

### 8.10 User Profile
### 8.11 Video Owner
### 8.12 Video Owner part Two
### 8.13 User's Videos
### 8.14 Bugfix
### 8.15 Conclusions
