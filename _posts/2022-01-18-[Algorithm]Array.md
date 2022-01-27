---
layout: post
title: [Algorithm] Array
date: Tue Jan 18 13:35:00 JST 2022
categories:
tag:
toc: true
---

# JavaScript

## 배열 만들기

프로그래밍에서 배열을 만들 때 크게 3가지 경우로 나뉜다.

1.  빈 배열 만들기
2.  초기값이 있는 배열
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
// 초기값이 있는 배열
let array = ['a', 'b', 'c'];
let array = new Array('a', 'b', 'c');
```

```
// 크기만 존재하는 배열
let array = [,,,];          // ,의 수만큼 길이가 정해진다.
let array = new Array(3);
```

다만 여기서 초기값이 특정 패턴으로 만들어지는 경우가 있다.
이때 사용할 수 있는 것이 Array.from()으로 아래에서 설명하겠다.

## Array.from

-   Array.from(arrayLike [, mapFn] [,this Arg])

Array.from()은 string, map, set 등으로 배열을 만들 수 있다.
그 중에서 자주 사용하는 것만 2가지 소개하겠다.

### 1. String에서 배열 만들기

```
Array.from('foo');
// ["f", "o", "o"]
```

### 2. Array.from과 화살표 함수

```
Array.from([1, 2, 3], x => x + x);
// [2, 4, 6]

Array.from({length: 5}, (v, i) => i);
// [0, 1, 2, 3, 4]

Array.from({length: 3}, () => 1);
// [1, 1, 1]
```

## 정렬

sort()는 조건에 따라 정렬한 배열을 반환한다.
이때 반환한다는 뜻은 새로운 배열을 만든다는 것이 아니라 기존의 배열이 정렬된다는 의미다.

-   array.sort([compareFunction])

compareFunction은 정렬 순서를 정의하는 함수로 생략할 경우 오름차순으로 정렬한다.
정렬 순서는 compareFunction의 반환값에 따라 다르다.

-   compareFunction(a, b) < 0: a가 b보다 앞에 온다.
-   compareFunction(a, b) = 0: a와 b를 교환하지 않는다.
-   compareFunction(a, b) > 0: b가 a보다 앞에 온다.

아래는 compareFunction을 사용하는 예시다.

```
function compareNumber(a, b) {
    return a - b;
}

arr = [2, 4, 1, 5, 3]
arr.sort(compareNumber)
console.log(arr)    // [1, 2, 3, 4, 5]
```

## reduce

reduce()는 배열의 각 요소로 함수를 실행해서 하나의 결과를 반환한다.

-   arr.reduce(callback[, initialValue])

initialValue는 callback의 최초 호출에 사용하는 값으로, 없을 경우 배열의 첫 번째 값을 사용한다.
callback은 아래의 4가지 인수를 사용한다.

-   accumulator: callback의 반환값을 누적한다. callback이 첫 호출이면 initialValue를 사용한다.
-   currentValue: 현재 처리하는 요소
-   currentIndex[Optional]: 처리할 요소의 인덱스. initialValue를 주면 0부터, 아니면 1부터 시작.
-   array[Optional]: reduce()를 호출할 배열

```
var sum = [0, 1, 2, 3].reduce(function (accumulator, currentValue) {
  return accumulator + currentValue;
}, 0);
// sum is 6

var total = [ 0, 1, 2, 3 ].reduce(
  ( accumulator, currentValue ) => accumulator + currentValue,
  0
);
```
