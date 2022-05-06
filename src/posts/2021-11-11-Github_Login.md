---
layout: post
title: How to make Authorization in the browser by Github?
date: Thu Nov 11 16:45:54 JST 2021
categories: Login, NodeJs, Github, Authorization
tag: Login, NodeJs, Github, Authorization
toc: true
---

웹사이트를 이용하다보면 소셜 로그인을 마주치게 된다. 여기서 소셜 로그인이란 구글, 카카오, 깃허브 등의 다른 사이트의 계정으로 페이지에 로그인 하는 것을 말한다. 소셜 로그인을 이용하면 하나의 계정으로 여러 사이트에서 로그인 가능하기 때문에 간편하므로 많은 사용자가 이용한다. 이번 포스트에서는 깃허브를 사용해서 소셜 로그인을 구현하는 방법을 알아보겠다. 다른 소셜 로그인도 세세한 부분은 다르지만 큰 틀은 비슷하므로, 깃허브 방식만 알면 다른 소셜 로그인에도 적용 가능하다.

### Authorized OAuth Apps
소셜 로그인을 하기 전에 깃허브에서 몇 가지 해야 할 일이 있다. 다음 단계를 따라가자.

1. github.com/settings/applications에 접속한다.
2. 좌측의 Developer settings에 들어간다.
3. 좌측의 OAut Apps를 누른다.
4. 오른쪽 위의 New OAut App을 누른다.
5. Application name은 원하는 대로 적어주고, Homepage URL은 우리 웹사이트의 URL을 적어준다.(우리의 경우 http://localhost:4000/)
6. Application descripttion은 적당히 적어주고, Authorization callback URL은 우선은 http://localhost:4000/users/github/finish 로 넣어준다. 아무거나 넣어줘도 되지만 코드에서 사용해야 하니 꼭 기억하자.
7. Register application을 누른다.
8. Client ID가 나오는 페이지가 보이는데 이 페이지는 추후에 써야하니 끄지 않고 그대로 둔다.

깃허브에서 필요한 것을 끝냈으면 본격적으로 로그인하는 방법을 알아보자. 소셜 로그인이 행해지는 과정과 설명은 [Aurhoeizing OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)에서 읽을 수 있는데, 큰 틀은 다음과 같다.

1. 사용자는 깃허브로 보내져서 사용자 정보를 요청한다.
2. 깃허브는 사용자를 다시 웹사이트로 돌려보내준다.
3. 돌를받을 때, 받은 토큰으로 웹사이트에 접근 가능해진다.

### 1 Request a user's GitHub identity

#### 1.1 매개변수

우리는 깃허브로부터 사용자 정보를 받아와야 하는데, "https://github.com/login/oauth/authorize"에다가 GET으로 정보를 요청하게 된다. 요청할 때 뒤에 매개변수를 붙일 수 있는데, 우리가 필요한 정보를 받으려면 적절한 매개변수를 덧붙여야 한다.

- client_id: **필수**적으로보내줘야 하는 값으로, 앞서 깃허브에서 만든 Client ID를 적어줘야 한다.
- scope: 유저에게서 얼마나 많은 정보를 요청할지 정하는 것으로 어떤 것을 받을 수 있는지는 [scope](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)를 참고하자. 우리가 필요한 것은 read:user과 user:email이다.
- allow_signup: 깃허브로 보내줬을 때, 아이디가 있다면 로그인 하겠지만 없을 경우는 새로 만들게 될 것이다. 만약 allow_signup을 true로 지정하면 새로 아이디를 만드는 것을 허용하지만, false로 지정하면 아이디를 만드는 것을 제한한다.

주소에 매개변수를 붙여주려면 기본정인 url의 사용법을 알아야 한다. url 뒤에 ?를 붙이면 매개변수를 보낼 수 있다. 예를 들어서 구글에서 검색할 경우, ?q=검색어 형태로 주소를 보내서 검색어를 알려준다. 또한 &를 사용하면 동시에 여러 매개변수를 보낼 수 있다. 예를 들어 ?a=1&b=2를 사용하면 a=1과 b=2를 동시에 사용한다.

#### 1.2 링크 만들기

다시 깃허브 로그인으로 돌아가서 우리는 "https://github.com/login/oauth/authorize"에다가 client_id와 allow_signup을 보내줘야 한다. 이때 client_id는 앞서 깃허브에서 만든 것이니 그대로 복사해서 넣어주고, signup은 false로 지정해서 회원가입은 막아놓겠다. 그러므로 주소는 "https://github.com/login/oauth/authorize?client_id=9fac726866be2ff14f36&allow_signup=false"가 된다. 이 위치로 가는 링크를 login.pug에 만들어주면 다음처럼 된다.

```
// login.pug
        input(type="submit", value="Login")
        br
        a(href="https://github.com/login/oauth/authorize?client_id=6d1bb5d0737bc0cd2d42&allow_signup=false") Continue with Github &rarr;    // *
    hr
    div
        span Don't have an account? 
```

이 링크를 누르면 깃허브에서 로그인을 허가하는 페이지가 나오게 된다. 그러므로 첫 번째 단계는 해결했다.

#### 1.3 링크 수정

하지만 한 가지 문제가 남아 있다. 바로 링크가 너무 길어진다는 것이다. 만약 지금 더 많은 내용을 매개변수로 보내고 싶다면 링크가 길어져서 가독성이 크게 떨어진다. 그러므로 링크로 다른 페이지로 보내준 후에 컨트롤러로 이를 관리해주겠다. login.pug에서 링크를 아래처럼 바꿔주자.

```
// login.pug
...
        a(href="/users/github/start") Continue with Github &rarr;
...
```

아직 users/github/start 라우터가 없으므로 uerRouter.js에 라우터와 컨트롤러를 추가해준다.

```
// userRouter.js
import {
    ...
    startGithubLogin    // *
    ...
} from "../controllers/userController";
...
userRouter.get("/remove", remove);
userRouter.get("/users/github/start", startGithubLogin);    // *
userRouter.get(":id", see);
```

그리고 userController.js에 컨트롤러를 만들어줘야 한다. 이때, 정보를 나눠서 적어줄텐데 baseUrl에는 우리가 요청할 페이지를 적고, 추가적인 정보는 config에 적어준다.

```
// userController.js
...
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: "6d1bb5d0737bc0cd2d42",
    allow_signup: false,
    scope: "read:user user:email",
  };
};
```

#### 1.4 URLSearchParams

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

### 2. Users are redirected back to your site by GitHub

우리가 하려던 것은 config에 적어준 것을 baseUrl 뒤에 붙여주는 것이다. 우선 config를 string으로 바꿔주려면 `const params = new URLSearchParams(config).toString();`을 해주면 된다. 그리고 백틱을 사용해서 두 주소를 하나로 합쳐준 다음 ridirect로 해당 주소로 보내주면 된다.

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

이렇게 되면 finalUrl로 보내주는데, 깃허브에서 허가할 수 있는 페이지가 나오게 된다. 그리고 여기서 Authorize를 누르면 깃허브는 다른 페이지로 넘겨준다. 여기서 주소를 살펴보면 이전에 OAut App을 만들때, 적어준 callback의 주소임을 다 수 있다. 그러므로 사용자는 Authorize로 로그인이 확인되면, http://localhost:4000/users/github/finish로 돌아오게 된다. 다음으로 여기서 받아온 토큰으로 로그인을 구현해야 한다. 이를 위해 라우터와 컨트롤러의 형태를 만들어 놓고 이번에는 마무리 하겠다.

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

### 2. Users are redirected back to your site by GitHub

#### 2.1 POST to https://github.com/login/oauth/access_token 
깃허브 페이지에서 리다이렉션을 받아서 다시 홈페이지로 돌아오는 것까지는 성공했다. 다음으로 해야할 것은 깃허브에서 받은 토큰을 Acess token으로 바꾸는 일이다. "https://github.com/login/oauth/access_token" 주소로 POST 방식으로 보내줘야 하는데, 뒤에 매개변수를 붙일 수 있다. 매개변수 중 필수적인 것은 다음과 같다.

- client_id: 깃허브에서 받은 cliend ID로 필수적으로 적어줘야 한다.
- client_secret: 깃허브에서 받은 client secret으로 코드에서 직접적으로 보여선 안 된다. 그러므로 env 파일에서 가져와야 한다.
- code: 앞선 단계에서 돌려받은 code를 말하는데, 리다이렉션으로 받아온 것을 말한다.

코드를 작성하기에 앞서 env 파일에 client_id와 client_secret을 적어줘야 한다. GH_CLIENT에는 client_id를 적어주고 GH_SECRET에는 client_secret을 적어주면 된다.

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

#### 2.2 fetch

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
    something
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

깃허브에서 준 토큰이 10분만 유지되기 때문에, 이 코드는 시간이 너무 지나면 작동하지 않는다.

위의 코드는 자바스크립트 상으로 문제가 없다. 그렇지만 실행할 경우 에러가 나온다. 이는 fetch가 NodeJs에 없기 때문에 에러가 나오는 것이다. 지금까지는 NodeJS가 자바스크립트와 거의 동일하게 여겨졌지만, 실제로는 작동하지 않는 함수들이 존재한다. fetch가 그 중에 하나로 다음에는 이를 수정할 방법을 알아보겠다.

#### 2.3 node-fetch
우린 fetch가 필요한데 NodsJs에는 fetch가 없다. 다행히도 [node-fetch](https://www.npmjs.com/package/node-fetch)를 설치하면 fetch를 사용할 수 있게 된다. `npm i node-fetch@2.6.1`으로 node-fetch를 설치해준다. 최신 버전이 아니라 구버전을 설치하는 이유는, 3.0 버전부터 ESM-only Module이 되면서 작동하지 않기 때문이다.

설치를 완료하면 `import fetch from "node-fetch";`로 해서 다시 실행시켜보자. 토큰이 만료되서 에러가 날 수도 있지만, 코드가 정상적으로 작동한다. 우리가 작성한 json 파일을 보기 위해서 마지막 줄에 res.send(JSON.stringify(json)); 을 적어준다. 그리고 다시 깃허브 로그인을 누르면 json을 페이지에서 볼 수 있다.

json이 정상적으로 돌아오는 것을 확인했으면 마지막 코드를 지우고 `res.send(JSON.stringify(json));`을 적어준다. 그렇게하면 페이지에서 json 정보를 확인할 수 있다.

```
// userController.js
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
...
```

코드를 실행하고 페이지를 보면 access_token, token_type, scope가 json 형태로 나온다.

### 3. Use the access token to access the API

#### 3.1 User information
지금까지 한 결과 json으로 access_token을 받아왔다. 마지막으로 해야 할 일은 이 access_token으로 사용자의 정보를 받아오는 일이다. 해야할 것은 "https://api.github.com/user"에다가 GET으로 받아오는데, headers에다가 Authorization: token OAUTH-TOKEN을 보내야 한다. 여기서 OAUTH-TOKEN은 앞서 우리가 받은 access_token을 의미한다.

위의 일은 fetch를 사용하면 간단히 해결할 수 있다. 다만 access_token을 못 받아온 경우, 다시 말해서 실패한 경우가 있을 수 있으므로 이를 고려해서 if-else로 실패한 경우 login 페이지로 보내준다.

```
// userController.js
...
    const json = await data.json();
    if("access_token" in json) {
        const { access_token } = json;
        const userData = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `token ${access_token}`,
            },
        });
    } else {
        return res.redirect("/login");
    }
};
```

여기까지 작성했으면 코드는 완성한 것이다. 마지막으로 코드가 지저분하기 때문에 조금 수정을 해주겠다. 수정하기 전에 현재 코드는 아래와 같다.

```
// userController.js
...
export const finishGithubLogin = async (req, res) => {
    ...
    const data = await fetch(finalUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
    });
    const json = await data.json();
    if("access_token" in json) {
        const { access_token } = json;
        const userData = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `token ${access_token}`,
            },
        });
    } else {
        return res.redirect("/login");
    }
};
```

코드를 보면 data와 json을 구하는 부분이 구별되어 있다. 하지만 fetch를 생각해보면 fetch().json()으로 json을 간단히 구할 수 있다. 대신에 이는 2번 실행하는 것이므로 await을 2번 사용해줘야 한다. 그리고 결과값이 요청한 토큰이므로 이름을 tokenRequest로 바꿔줬다.

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
```

그리고 같은 논리로 access_token을 사용하는 부분도 fetch().json()을 사용하면 아래처럼 고쳐줄 수 있다. 이때 이름도 json에서 tokenRequest로 바꿔줬다.

```
// userController.js
...
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const userData = await (
      await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
  } else {
    return res.redirect("/login");
  }
};
...
```

마지막으로 여기까지 작성한 것이 제대로 나오는지 확인하기 위해 console.log(userData)로 확인해보자.


```
// userController.js
...
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const userData = await (
      await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${access_token}`,
        }이
      })
    ).json();
    console.log(userData);   // *
  } else {
    return res.redirect("/login");
  }
};
...
```

결과를 확인해보면 사용자 정보가 json 형태로 잘 나오는 것을 알 수 있다. 그런데 내용을 확인해보면 email: null인 것을 볼 수 있다. 즉, 이메일 정보는 받아오지 못한 것이다. 이전에 access_token을 만들 때, 우리는 scope에서 read:user과 user:email을 둘 다 적어줬으므로 이메일 정보도 들어오길 기대하지만, 둘은 별개의 일이라 들어오지 않는다. 다시 말해 access_token은 사용자 정보를 받아오고, 이메일을 받아오는데 사용할 수 있다. 그렇지만 둘은 별개의 과정이므로 사용자 정보를 받아오는 것과, 이메일을 받아오는 것 둘 다 만들어야 한다. 지금까지는 사용자 정보만을 받아왔고 다음으로 이메일을 받아오는 법을 알아보자.

#### 3.2 email information
[링크](https://docs.github.com/en/rest/reference/users#emails)를 확인하면 email을 설정하는 방법을 볼 수 있다. 우리가 원하는 항목은 "List public email addresses for the authenticated user"이다.

우리가 해야할 일은 "https://api.github.com/user/emails"에 헤더파일을 GET으로 보내주는 것이다. 그런데 주소를 보면 공통되는 부분이 있으므로, apiurl = "https://api.github.com"로 지정하고, 그에 맞게 fetch 안의 내용을 수정하겠다.

```
// userController.js
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
```

그리고 여기에 이어서 emailData를 받아오는 fetch를 만들겠다. 우리가 보내줘야 하는 것은 GET으로 "https://api.github.com/user/emails"에 헤더를 보내줘야 한다. 그리고 마지막에 받아온 데이터를 확인하도록 console.log()를 사용했다.

```
// userController.js
    ...
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(emailData);
  } else {
    return res.redirect("/login");
  }
```

이렇게하면 email 정보를 볼 수 있게 된다. 정보를 확인해보면 primary와 verified라는 정보를 볼 수 있는데, 우리는 이 둘이 true인 이메일만 사용한다. 왜냐하면 깃허브에 로그인 하더라도 둘이 false인 경우가 있을 수 있기 때문이다. 조건을 만족하는 email은 find()로 찾았고, 만약 조건에 맞는 email이 없다면 login 페이지로 보내준다.

```
// userController.js
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(email => email.primary === true && email.verified === true);
    if (!emailObj) {
      return res.redirect("/login");
    }
    // ******
  } else {
    return res.redirect("/login");
  }
};
```

코드가 `// ******`에 도착하게 되면 primary, verified가 true인 이메일을 받은 것이니, 필요한 사용자 데이터는 모두 받은 것이다. 이를 사용해서 사용자를 로그인 시킬 수도 있지만, 이메일이 없다면 계정을 만들게 할 수도 있다. 그리고 이메일은 동일하지만 하나는 페이지에서 비밀번호로 로그인 하는 경우와, 다른 하나는 깃허브에서 로그인 하는 경우가 있을 수 있다. 간단히 말해서 로그인하려는 경우는 아래처럼 4경우의 수가 있다.

- 사이트에 아이디가 없고, 깃허브에 아이디가 없다.
- 사이트에 아이디가 있고, 깃허브에 아이디가 없다.
- 사이트에 아이디가 없고, 깃허브에 아이디가 있다.
- 사이트에 아이디가 있고, 깃허브에 아이디가 있다.

이 중에서 둘 다 없는 경우나, 깃허브에 아이디가 없는 경우는 깃허브 로그인이 불가능하다. 그러므로 깃허브로 로그인을 하려고 하면 깃허브에서 아이디를 만들게 된다.

다음으로 깃허브에 아이디가 있지만 사이트엔 아이디가 없는 경우다. 이 경우엔 깃허브 로그인을 한 것으로 계정을 만들어서 서버에 저장한다.

제일 문제가 되는 경우는 둘 다 있는 경우다. 만약 두 사용자가 동일한 이메일을 사용할 경우 어떻게 해야할까? 둘을 동일한 사용자로 생각해서 계정을 하나로 합쳐서 관리할 수도 있지만, 따로 로그인 가능하게 만들 수도 있다. 아니면 에러를 보내면서 한쪽의 로그인이 불가능하게 만들 수도 있다.

우리는 이메일이 동일하다면 로그인을 허용하는 방향으로 만들어보겠다. 실제로는 이렇게 하기 보다는 이메일을 연동시킨다거나 별개로 하는 경우가 많지만, 일단은 이대로 진행해보자.

emailObj를 보면 안에 email이 들어있다. 이를 사용해서 같은 email을 쓰는 사용자를 찾아서 existingUser에 넣어줬다. 만약 사용자가 있다면 세션의 값을 바꿔서 로그인 시켜준다.

```
// userController.js
    ...
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
```

그런데 이메일이 없다면, 이는 사용자가 깃허브 아이디만으로 로그인한다는 의미다. 그러므로 새로운 User를 만들어서 계정을 생성해야한다. 하지만 그에 앞서 스키마를 수정해줘야 한다. 왜냐하면 현재는 password가 required이므로 없어서는 안 된다. 덤으로 사용자가 소셜 로그인을 했는지 확인하기 위해서 socialOnly라는 속성을 더해주려고 한다. User.js에서 스키마를 수정해서 아래처럼 만들어주자.

```
// User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, default: false },  // ******
  username: { type: String, required: true, unique: true },
  password: { type: String }, // ******
  name: { type: String, required: true },
  location: String,
});
```

그리고 거기에 맞추서 계정을 생성할 때, socialOnly: true,를 넣어서 만들어준다.

```
    ...
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

소셜 로그인을 할 때, socialOnly: true로 만들어줬다. 그런데 사이트에서 로그인을 할 때, 우리는 socialOnly의 값을 체크해주지 않고 있다. 그런데 소셜 로그인만 한 계정의 경우 비밀번호가 존재하지 않는다. 그러므로 사이트에서 로그인 할 때, 아이디만 알아내면 비밀번호와 관계 없이 로그인 할 수 있게 된다.

이를 해결하기 위해 사이트에서 로그인 하는 경우에 socialOnly: false인 경우만 찾아보도록 만들어주겠다. postLogin으로 가서 아래처럼 수정해준다.
```
// userController.js
...
  const pageTitle = "Login";
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
...
```

다음으로 코드를 조금 정리해주겠다. 우린는 req.session() 부분을 2번 반복하고 있다. 이를 고치기 위해선 const를 let으로 바꾸고 if-else의 순서를 바꿔서 아래처럼 적어주면 된다.

```
// userController.js
 if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
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
```

추가적으로 User.js를 수정해서 avatarURl을 추가하겠다. 이는 다음에 avatar를 다루기 위해 미리 수정하는 것이다.

```
// User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,  // ******
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
```

그리고 그에 맞춰서 깃허브로 계정을 만들 때, avatarUrl을 받아오도록 만든다.

```
// userController.js
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url, // ******
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
```

마지막으로 로그아웃 페이지를 만들어보겠다. 로그아웃 하는 방법은 간단하다. `req.session.destroy();`로 세션을 없애주고 페이지를 다시 열어주면 된다.

```
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
...
```

그리고 코드에서 필요없는 remove 컨트롤러와 라우터를 삭제해줬다. 마지막으로 base.pug에서 logout 링크를 수정해주면 끝이다.

```
// base.pug
      if loggedIn
          li
              a(href="/users/logout")  Log Out
          li
```
