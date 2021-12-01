---
layout: post
title: Youtube Clone 6
date: Mon Nov 29 20:52:11 JST 2021
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
        ...
```

다음으로 client 폴더 안에 components랑 screens 폴더를 만든다. components는 headers, footers 같은 것을 넣고, screens는 home, search 등을 넣을 것이다. 그리고 _variables.scss에 색을 추가해준다.

```
// _variables.scss
$red: #ff1300;
$bg; #191919;
```

다음으로 styles.scss를 간단하게 작성해보자. 그런데 Config 파일을 한데 모으고 싶으므로 config 폴더를 만들고 _variables 파일도 그 안으로 옮겨준다. 또 css를 초기화 시켜야 하니 _reset.scss를 config 안에 만들어준다.

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

그리고 scss를 작성할 때, pug 파일과 동일한 이름을 가지도록 하는 것이 편하다. 예를 들어 header.pug라는 partials이 있으므로, header.scss라는 것을 component 안에 만들어서 관리하는 것이 편하다.

scss에 관해서는 이미 설명한 것이 있으므로 생략하겠다.

### 10.1 Styles part One

이제부터 scss 파일을 만들텐데, vscode를 좌우로 나눠서 pug 파일을 보면서 하는 것이 편하다. 아래에는 scss 파일을과 pug 파일을 순서대로 적었다.

```
// styles.scss
// styles.scss
// Config
@import "./config/_variables.scss";
@import "./config/_reset.scss";

// Components
@import "./components/header.scss";
@import "./components/footer.scss";
@import "./components/video.scss";
@import "./components/shared.scss";

// Screens
@import "./screens/home.scss";

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

main {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    margin-top: 50px;
}
```

```
// header.scss
header {
    padding: 20px 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header__logo {
        color: $red;
        font-size: 38px;
    }
    ul {
        display: flex;
        justify-content: space-between;
        align-items: center;
        li {
            margin-left: 30px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
        }
        i {
            font-size: 16px;
        }
    }
    .header__btn {
        background-color: white;
        color: $bg;
        padding: 5px 10px;
        border-radius: 5px;
    }
}
```

```
// header.pug
header
    a(href="/").header__logo
        i.fab.fa-youtube
    nav
        ul
            li
                a(href="/search")
                    i.fas.fa-search
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
                    a(href="/login") Login                        
                li
                    a(href="/join").header__btn  Join
            li
                a(href="/search") Search
```

```
// screens/home.scss
.video-grid {
    display: grid;
    gap: 50px;
    grid-template-rows: repeat(4, 1fr);
}
```

```
// home.pug
include mixins/video

block content
    div.video-grid
        each video in videos
            +video(video)
        else
            span.empty__message No videos found
```

```
// footer.scss
footer {
    text-align: center;
    font-size: 12px;
    opacity: 0.8;
    margin-top: 50px;
}
```

```
// video.scss
.video-mixin {
    .video-mixin__thumb {
        height: 140px;
        border-radius: 50px;
        width: 100%;
        background-color: ivory;
    }
    .video-mixin__data {
        padding: 0px 15px;
        .video-mixin__title {
            font-size: 16px;
            display: block;
            margin-top: 10px;
        }
    }
    .video-mixin__meta {
        margin-top: 5px;
        font-size: 12px;
    }
}
```

```
// video.pug
mixin video(video)
    a(href=`/videos/${video.id}`).video-mixin
        div.video-mixin__thumb
        div.video-mixin__data
            span.video-mixin__title=video.title
            div.video-mixin__meta
                span #{video.owner.name} •
                span #{video.meta.views} 회
```

```
// videoController.js
export const search = async (req, res) => {
    ...
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }
}
```

```
// shared.scss
.empty__message {
    margin-bottom: 50px;
    font-size: 18px;
}
.video__grid {
    display: grid;
    gap: 50px;
    grid-template-rows: repeat(4, repeat(0, 1fr));
}
```

### 10.2 Styles part Two
### 10.3 Styles Conclusions