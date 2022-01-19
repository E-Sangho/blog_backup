---
layout: post
title: [Algorithm] Array
date: Tue Jan 18 13:35:00 JST 2022
categories:
tag:
toc: true
---

## 배열 만들기

### JavaScript

프로그래밍에서 배열을 만들 때 크게 3가지 경우로 나뉜다.

1.  빈 배열 만들기
2.  초기 값이 있는 배열
3.  크기만 존재하는 배열

자바스크립트에서 배열을 만들 때 Array() 생성자 함수를 사용한다.
Array()로 배열을 만드는 방법은 값을 지정하는 방법과, 길이를 지정하는 방법 2가지가 있다.

-   new Array(element0, element1, ..., elementN)
-   new Array(arrayLength)

이때 첫 번째 방법은 간소화해서 [element0, element1, ..., elementN]로도 적는다.
이들을 사용해서 아래처럼 배열을 만들 수 있다.

```
// 빈 배열
let array = [];
let array = new Array();
```

```
// 초기 값이 있는 배열
let array = ['a', 'b', 'c'];
let array = new Array('a', 'b', 'c');
```

```
// 크기만 존재하는 배열
let array = [,,,];          // ,의 수만큼 길이가 정해진다.
let array = new Array(3);
```
