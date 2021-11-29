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

### 10.1 Styles part One
### 10.2 Styles part Two
### 10.3 Styles Conclusions