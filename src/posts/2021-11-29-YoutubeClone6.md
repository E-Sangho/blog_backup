---
layout: post
title: Youtube Clone 6
date: 2021-11-29 20:52:11
categories: NodeJS
tag:
toc: true
---

## 10 STYLES

### 10.0 Introduction

base.pug의 MVP를 스타일은 이제 필요가 없으니 지워주자. 다음으로 우리는 font-awsome을 사용할 것이므로 [cdnjs](https://cdnjs.com/libraries/font-awesome)로 이동해서 링크를 복사하자. 그리고 퍼그 파일에 링크로 추가해준다.

```
// base.pug
...
    head
        title #{pageTitle} | #{siteName}
        link(rel="stylesheet", href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css")
        link(rel="stylesheet", href="/assets/css/style.css")
        ...
```

다음으로 client 폴더 안에 components랑 screens 폴더를 만든다. components는 headers, footers 같은 것을 넣고, screens는 home, search 등을 넣을 것이다. 그리고 \_variables.scss에 색을 추가해준다.

```
// _variables.scss
$red: #ff1300;
$bg: #191919;
```

다음으로 styles.scss를 간단하게 작성해보자. 그런데 Config 파일을 한데 모으고 싶으므로 config 폴더를 만들고 \_variables 파일도 그 안으로 옮겨준다. 또 css를 초기화 시켜야 하니 \_reset.scss를 config 안에 만들어준다.

```
// styles.scss
// Config
@import "./config/_variables.scss";
@import "./config/_reset.scss";

// Components

// Screens

// Defaults

a {
    color: inherit;
    text-decoration: none;
}

body {
    font-family: -apple-system;
    background-color: $bg;
    color: white;
}
```

그리고 [Reset CSS](https://meyerweb.com/eric/tools/css/reset/)에서 reset 내용을 복사해와서 붙여넣기 해준다.

```
// _reset.scss
/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
```

이제 pug도 정렬해주자. partials 폴더 안에 header.pug 파일을 만들어서 이 안에 header 내용을 옮겨준다. 그리고 base.pug에는 include로 header.pug를 포함시켜준다.

```
// header.scss
header
    a(href="/")
        i.fab.fa-youtube
    nav
        ul
            if loggedIn
                li
                    a(href="/videos/upload") Upload Video
                li
                    a(href=`/users/${loggedInUser._id}`) My Profile
                li
                    a(href="/users/edit") Edit Profile
                li
                    a(href="/users/logout")  Log Out
            else
                li
                    a(href="/join")  Join
                li
                    a(href="/login")  Login
            li
                a(href="/search") Search
```

그리고 scss를 작성할 때, pug 파일과 동일한 이름을 가지도록 하는 것이 편하다. 예를 들어 header.pug라는 partials이 있으므로, header.scss라는 것을 component 안에 만들어서 관리하는 것이 편하다.

scss에 관해서는 이미 설명한 것이 있으므로 생략하겠다.

### 10.1 Styles part One

#### fontawesome

fontawesome을 사용할 때, 아이콘을 넣기 위해 찾아봐야 하는 경우가 많다. 이때, 아이콘을 직접 찾아보지 않아도 어느정도 유추할 수 있는 방법이 있다. [fontawesome Basie use](https://fontawesome.com/v5.15/how-to-use/on-the-web/referencing-icons/basic-use)를 보면 Style에 따라 Example이 적혀있다. 이를 보면 카메라 이미지를 가져올 때, 개략적인 형태가 `<i class="fas fa-camera"></i>` 형태이고 여기서 fas만 다른 것들로 바뀜을 볼 수 있다. 선택지는 각각 solid, regular, light, duotone, brands가 있다. 예를 들어 brands 아이콘을 사용하고 싶으면 `<i class="fab fa-font-awesome"></i>`가 된다.

그런데 pug에서 class 이름을 줄 때, 띄워쓰기는 어떻게 해야 할까? 이는 .을 쓰면 된다. .을 쓰면 뒤의 글자가 class에 추가되기 때문에 위의 경우 `i.fas.fa-camera`로 적어주면 `<i class="fas fa-camera"></i>`로 만들어주게 된다.

#### grid-template-column: repeat(4, 1fr) vs repeat(4, minmax(0, 1fr))

grid를 사용하다보면 폭을 줄였을 때, 각 grid가 폭에 맞춰서 줄어들기를 기대한다. 그런데 grid 크기가 컨텐츠 크기 까지만 줄어들어서, 가로폭 밖으로 컨텐츠가 나아는 경우가 생긴다. 이는 1fr과 minmax(0, 1fr)의 차이를 모르기 때문에 생기는 문제점이다.

1fr은 minmax(auto, 1fr)과 동일하다. 그렇기 때문에 가로폭을 줄여도 auto의 크기, 다시 말해 컨텐츠의 크기에 맞춰지게 된다. 그래서 컨텐츠 크기보다 줄어들 수 없게 되어서, container 안에 grid가 다 표현되지 못한다.

1fr 대신에 minmax(0, 1fr)을 사용하면 폭의 min이 auto가 아니라 0이 되기 때문에, grid가 container 밖으로 벗어나는 일이 없다. 그렇지만 grid 크기가 줄어들더라고 컨텐츠의 크기가 줄어들지는 않기 때문에, 내용이 겹쳐서 보이게 된다.

결론은 1fr을 사용하면 컨텐츠가 겹치지 않고 오른쪽으로 밀려나게 되지만, minmax(0, 1fr)을 사용하면 모두 표현되는 대신에 컨텐츠가 겹치게 된다.

#### button vs input(type="submit")

#### all: unset;

#### pug에서 여러 줄 입력하기

|를 사용하면 여러 줄 입력할 수 있다.

### 10.2 Styles part Two

### 10.3 Styles Conclusions
