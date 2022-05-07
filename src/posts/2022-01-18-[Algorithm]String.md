---
layout: post
title: [Algorithm] String
date: 2022-01-18 11:50:09
categories:
tag:
toc: true
---

알고리즘 문제를 풀다보면 문자열을 써야하는 경우가 종종 있다.
아래는 문자열 문제를 풀 때 자주 사용하는 것을 정리한 것이다.

# JavaScript

## 문자열 역순

`str.split("").reverse().join("");`

배열의 순서를 바꿔주는 `reverse()`를 사용하면 순서를 바꿀 수 있다.
이때 문자열이 아닌 배열의 순서를 바꿔주는 것이므로 split으로 문자열로 바꿔주고, 마지막에 join으로 다시 합쳐줘야 한다.

## 대소문자 구분 없이

모든 문자를 대문자로 바꾸는 `str.toUppercase()`를 사용하거나, 소문자로 바꾸는 `str.toLowerCase()`를 사용한다.

## 알파벳만 가져오기

### charCodeAt 사용

아스키 코드로 바꿔주는 charCodeAt()을 사용해서 각 글자를 아스키 코드로 바꾼다.
그리고 알파벳 범위([a-z](65~90), [A-Z](97~122))내에 있는 글자만 사용한다.

```
let p_str = "";
str.split("").forEach((e) => {
    let ascii = e.charCodeAt(0);
    if ((65 <= ascii && ascii <= 90) || (97 <= ascii && ascii <= 122)) {
        p_str += e;
    }
});
```

### replace 사용

`str.replace(/[^a-zA-Z]/g, "");`

replace의 첫 번째 매개변수로 정규 표현식을 사용해서 알파벳이 아닌 글자를 지워줄 수 있다.

## 문자열의 일부분

## 문자열 포함
