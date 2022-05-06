---
layout: post
title: Time Complexity
date: Mon Mar 14 11:25:38 JST 2022
categories:
tag:
toc: true
---

# Time Complexity

알고리즘의 시간 복잡도는 코드를 직접 작성하기 때문에 확인하기 쉽다.
반면 자료구조는 라이브러리를 사용해서 시간 복잡도를 눈으로 볼 수 없다.
더구나 읽기, 찾기, 삽입, 삭제 모두 시간 복잡도가 달라 기억하기 쉽지 않다.
아래는 각 자료구조의 시간복잡도를 정리한 것이다.

| Data Structure                | Access          | Search          | Insertion       | Deletion        |
| ----------------------------- | --------------- | --------------- | --------------- | --------------- |
| Array                         | $O(1)$          | $O(n)$          | $O(n)$          | $O(n)$          |
| Stack                         | $O(1)$          | $O(n)$          | $O(1)$          | $O(1)$          |
| Queue                         | $O(1)$          | $O(n)$          | $O(1)$          | $O(1)$          |
| Linked List                   | $O(n)$          | $O(n)$          | $O(1)$          | $O(1)$          |
| HashMap                       | $O(1)$ ~ $O(n)$ | $O(1)$ ~ $O(n)$ | $O(1)$ ~ $O(n)$ | $O(1)$ ~ $O(n)$ |
| Map(using Binary Search Tree) | X               | $O(1)$          | $O(1)$          | $O(1)$          |
| Set(using HashMap)            | $O(1)$ ~ $O(n)$ | $O(1)$ ~ $O(n)$ | $O(1)$ ~ $O(n)$ | $O(1)$ ~ $O(n)$ |
| Set(using List)               | $O(n)$          | $O(n)$          | $O(n)$          | $O(n)$          |
| Set(using Binary Search Tree) | $O(logn)$       | $O(logn)$       | $O(logn)$       | $O(logn)$       |
| Array                         | $O(1)$          | $O(n)$          | $O(n)$          | $O(n)$          |

Linked List는 처음이나 마지막 위치에 삽입, 삭제할 경우엔 $O(1)$이다.
그 외의 공간에 추가하려면 $O(n)$이다.

HashMap(Unordered Map)은 내부적으로 해시함수를 사용한다.
일반적으로 $O(1)$이지만 충돌이 많아지면 $O(n)$이 된다.
대부분 저정도로 채워지진 않으므로 $O(1)$으로 생각해도 된다.
HashMap을 사용한 Set의 시간 복잡도도 같은 이유로 위와 같이 된다.

# Measure Execution Time in Javascript

시간복잡도를 살펴보는 것도 좋지만, 실제로 얼마나 시간이 걸리는지 확인하는 것도 중요하다.
자바스크립트에서 프로그램의 실행 시간을 측정하려면 현재 시간을 알 수 있어야 한다.
아래는 현재 시간을 알 수 있는 방법이다.

-   console.time()
-   performance.now()
-   Date.now()

각 방법으로 프로그램 실행 시간을 측정하는 코드는 다음과 같다.

```
console.time("Execution Time");
// do something
console.timeEnd("Execution Time");
```

```
let start = performance.now();
// do something
let end = performance.now();
console.log("Execution Time:", end - start);
```

```
let start = Date.now();
// do something
let end = Date.now();
console.log("Execution Time:", end - start);
```

세 방법 모두 그리 어렵진 않다.
개인적으로 console.time()을 선호한다.
그 이유는 중간 시간을 출력할 수 있기 때문이다.
물론 다른 방법으로도 할 수 있기는 하지만 console.time()이 가장 편하다.

> console.time(label)

console.time은 타이머에 label로 이름을 설정할 수 있다.
동시에 1만개까지 설정할 수 있다.
같은 label로 console.timeEnd()를 호출하면 경과시간을 출력한다.
console.timeLog()를 사용하면 중간 시간도 출력할 수 있다.
timeEnd와 timeLog는 둘 다 현재 측정 시간을 출력해준다.
차이점은 timeEnd는 측정을 끝내고, timeLog는 측정을 계속한다.

```
console.time("answer time");
alert("Click to continue");
console.timeLog("answer time");
alert("Do a bunch of other stuff...");
console.timeEnd("answer time");
```

## 참고

1. [MDN](https://developer.mozilla.org/ko/docs/Web/API/console/timeEnd)
