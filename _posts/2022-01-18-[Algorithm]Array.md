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

> Array.from(arrayLike [, mapFn] [,this Arg])

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

> array.sort([compareFunction])

compareFunction은 정렬 순서를 정의하는 함수로 생략할 경우 오름차순으로 정렬한다.
이때 원소를 **문자열**로 취급해서 정렬한다.
그렇기 때문에 숫자를 정렬하려면 주의해야 한다.
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

> arr.reduce(callback[, initialValue])

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

## 원소 추가 및 제거

여기서는 원소를 추가하거나 제거하는 방법을 설명한다.
원소를 추가하거나 제거하는 위치는 배열의 앞, 중간, 뒤로 3가지가 있다.
다만 배열에 원소를 여러 개 추가할 경우는 아래의 배열 합치기 방법을 사용하는 것이 더 편리하다.

### 배열의 앞

#### unshift

> arr.unshift([...elementN])

배열의 제일 앞에 요소를 추가한다.
그리고 새로운 배열의 길이를 반환한다.

```
var arr = [1, 2];

arr.unshift(0); // result of call is 3, the new array length
// arr is [0, 1, 2]

arr.unshift(-2, -1); // = 5
// arr is [-2, -1, 0, 1, 2]

arr.unshift([-3]);
// arr is [[-3], -2, -1, 0, 1, 2]
```

#### shift

> arr.shift()

배열의 제일 앞 요소를 제거하고, 나머지를 한 칸씩 앞으로 당긴다.
그리고 제거된 값을 반환한다.

```
var myFish = ['angel', 'clown', 'mandarin', 'surgeon'];

console.log('myFish before: ' + myFish);
// "제거전 myFish 배열: angel,clown,mandarin,surgeon"

var shifted = myFish.shift();

console.log('myFish after: ' + myFish);
// "제거후 myFish 배열: clown,mandarin,surgeon"

console.log('Removed this element: ' + shifted);
// "제거된 배열 요소: angel"
```

### 배열의 중간

#### splice

> array.splice(start[, deleteCount[, item1[, item2[, ...]]]])

-   start: 배열에서 변경할 위치를 지정
-   deleteCount: 배열에서 제거할 원소의 수
-   item: 배열에 추가할 요소

배열의 중간에서 삽입하거나 삭제하는 경우 모두 splice를 사용한다.

예를 들어서 아무것도 삭제하지 않고 원소를 추가하려면 deleteCount가 0이면 된다.

```
var myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];
var removed = myFish.splice(2, 0, 'drum', 'guitar');

// myFish is ["angel", "clown", "drum", "guitar", "mandarin", "sturgeon"]
// removed is [], no elements removed
```

원소를 삭제하려면 deleteCount에 삭제하고 싶은 만큼 적어준다.

```
var myFish = ['angel', 'clown', 'drum', 'mandarin', 'sturgeon'];
var removed = myFish.splice(3, 1);

// removed is ["mandarin"]
// myFish is ["angel", "clown", "drum", "sturgeon"]
```

두 기능을 동시에 사용해서 삭제 후에 삽입도 가능하다.

```
var myFish = ['angel', 'clown', 'trumpet', 'sturgeon'];
var removed = myFish.splice(0, 2, 'parrot', 'anemone', 'blue');

// myFish is ["parrot", "anemone", "blue", "trumpet", "sturgeon"]
// removed is ["angel", "clown"]
```

### 배열의 뒤

#### push

> arr.push(element1[, ...[, elementN]])

push는 배열 끝에 값을 추가하는데 사용한다.
리턴값으로 새로 만들어진 배열의 길이를 반환한다.

```
var sports = ['축구', '야구'];
var total = sports.push('미식축구', '수영');

console.log(sports); // ['축구', '야구', '미식축구', '수영']
console.log(total);  // 4
```

#### pop

> arr.pop()

배열의 마지막 값을 제거하고 반환한다.

```
var myFish = ['angel', 'clown', 'mandarin', 'sturgeon'];

var popped = myFish.pop();

console.log(myFish); // ['angel', 'clown', 'mandarin' ]

console.log(popped); // 'sturgeon'
```

## 배열 합치기

### concat

> array.concat([value1[, value2[, ...[, valueN]]]])

concat는 array에 value를 덧붙여서 새로운 배열을 만든다.
이때 value에 배열을 사용해서 두 배열을 이어 붙일 수도 있다.

```
const alpha = ['a', 'b', 'c'];
const numeric = [1, 2, 3];

alpha.concat(numeric);
// 결과: ['a', 'b', 'c', 1, 2, 3]
```

```
const num1 = [1, 2, 3];
const num2 = [4, 5, 6];
const num3 = [7, 8, 9];

num1.concat(num2, num3);
// 결과: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### spread operator

배열이나 문자열 앞에 ...를 붙이면 안의 내용을 전개해준다.

```
const number = [1, 2, 3];

function sum(x, y, z) {
  return x + y + z;
}

console.log(sum(...number));
// 6
```

이를 사용하면 두 배열을 간단히 합칠 수 있다.

```
let alphabet = ['a', 'b', 'c'];
let number = [1, 2, 3];

let arr = [...alphabet, ...number];
// arr = ['a', 'b', 'c', 1, 2, 3]
```

## 포함

> arr.includes(valueToFind[, fromIndex])

-   valueToFind: 찾을 요소
-   fromIndex: 검색을 시작할 위치

```
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
[1, 2, NaN].includes(NaN); // true
```

## 배열 복사

배열을 복사하는 이유를 알기 위해선 얕은 복사(Shallow Copy)와 깊은 복사(Deep Copy)를 알아야 한다.
결과부터 얘기하자면 얕은 복사는 객체의 주소를 복사하고, 깊은 복사는 값을 복사하는 것이다.
아래는 깊은 복사의 예다.

```
let a = 1;
let b = a;

console.log(a);
console.log(b);
// a = 1
// b = 1

a = 2;

console.log(a);
console.log(b);
// a = 2
// b = 1
```

깊은 복사는 해당 값을 복사해서 새로운 주소에 만든다.
그렇기 때문에 원본을 수정하더라도 복사본에 아무런 변화가 생기지 않는다.
문제는 배열의 복사에서 발생한다.

```
let a = [1, 2, 3];
let b = a;

console.log(a);
console.log(b);
// a = [1, 2, 3]
// b = [1, 2, 3]

a = [2, 4, 6];

console.log(a);
console.log(b);
// a = [2, 4, 6]
// b = [2, 4, 6]
```

보다시피 a만 바꿔줬는데도 b도 변경된 것을 볼 수 있다.
배열의 경우 변수가 가리키는 것은 해당 배열이 시작하는 첫 번째 주소다.
다시 말해 a에 들어 있는 것은 메모리 주소다.
그래서 b가 복사한 것은 값이 아니라 주소가 된다.
결국 a와 b가 동일한 주소를 공유하기 때문에 a의 값을 변경 시키면 b의 값도 변경되는 것이다.
이는 배열 뿐만 아니라 객체 같이 주소를 사용하는 경우 동일하게 발생하는 문제다.

배열을 복사하는 경우는 원본을 저장해두고 변경하고 싶은 경우다.
그런데 위와 같이 얕은 복사를 하면 변경 사항이 원본에 영향을 주게 된다.
그렇기 때문에 새로운 배열을 만들어서 값을 전달해줘야 한다.
가장 간단한 방법은 slice를 사용하는 것이다.

> arr.slice([begin[, end]])

-   begin[Optional]: 추출 시작점
-   end[Optional]: 추출 종료점

slice는 배열의 특정 구간을 추출한다.
begin으로 시작 지점을 정하고, end로 종료 지점을 정한다.
만약 begin을 생략하면 처음부터 추출하고, end를 생략하면 마지막까지 추출한다.
그리고 추출한 요소로 새로운 배열을 만들어서 반환한다.
이를 사용해서 아래처럼 깊은 복사를 할 수 있다.

```
let a = [1, 2, 3];
let b = a.slice();

console.log(a);
console.log(b);
// a = [1, 2, 3]
// b = [1, 2, 3]

a = [2, 4, 6];

console.log(a);
console.log(b);
// a = [2, 4, 6]
// b = [1, 2, 3]
```

하지만 slice도 결점이 있다.
slice는 중첩된 배열을 제대로 복사하지 못한다.
이는 slice가 작동되는 방식 때문이다.
slice는 각 원소를 복사한 배열을 반환한다.
이때 string이나 number 같은 원시값(Primitive Value)은 깊은 복사가 이뤄진다.
반면 객체를 복사할 때는 메모리 주소를 복사하므로 얕은 복사가 이뤄진다.
그래서 복사하는 원소가 객체일 경우

```
let a = [1, 2, [3, 4]];

let b = a.slice();

b[2].push(5);

console.log(a);

console.log(b);
```

물론 `b[2] = [3, 4, 5]` 같이 직접 대입해서 바꿀 경우엔 새주소가 할당되므로 달라진다.
다만 위처럼 원본을 불러올 경우는 제대로 작동하지 않는다.

객체를 복사하려는 경우 `JSON.parse(JSON.stringify(arr))`를 사용해서 복사해야 한다.
위는 JSON을 string으로 바꾼다음 다시 parse하는 코드다.
그러므로 복사를 하는 것이 아니라, 문자열로 바꾼 다음 다시 문자열을 해석하는 코드다.

## 배열의 순서 변경

배열 안에서 두 원소의 위치를 변경해야 하는 경우가 있다.
이때 사용하는 것이 구조 분해 할당(Destructuring assignment)이다.
우선 구조 분해 할당은 아래처럼 한 번에 값을 할당할 수 있다.

```
let a, b;
[a, b] = [10, 20];

console.log(a);
// expected output: 10

console.log(b);
// expected output: 20
```

아래처럼 배열에 값을 전달하는 것도도 가능하다.

```
let rest;

[...rest] = [30, 40, 50];

console.log(rest);
// expected output: Array [30,40,50]
```

이를 응용하면 두 원소의 위치를 바꿀 수 있다.
아래는 i, j 위치의 배열의 원소를 바꿔준다.

```
[a[i], a[j]] = [a[j], a[i]];
```

## 검색

> arr.filter(callback(element[, index[, array]])[, thisArg])

-   callback: 각 요소를 테스트해서 true를 반환하면 유지하고, false를 반환하면 삭제한다. 위처럼 element, index, array를 매개변수로 사용한다.
-   thisArg[Optional]: callback을 실행할 때 this로 사용하는 값

filter를 사용해서 특정값을 쉽게 검색할 수 있다.

```
let a = [1, 2, 3, 4, 5];
let b = a.filter((element) => element !== 3);

console.log(b);
// [1, 2, 4, 5]

let c = a.filter((element) => element === 3);

console.log(c);
// [3]
```

# C++

## sort

C++는 배열을 정렬하는데 sort를 사용한다.
sort는 <algorithm> 헤더 파일에 있는데, 함수의 형태는 아래와 같다.

> sort(start, end, [comp]);

처음 두 변수는 정렬하는 범위를 정해준다.
sort의 범위는 [start, end) 까지므로 보통 sort(v.begin(), v.end())로 사용한다.
세 번째 변수 없이 사용하면 자동으로 오름차순으로 정렬해준다.
그 외의 경우는 비교 함수를 만들어서 세 번째 변수에 전달해야 한다.
비교 함수는 bool을 반환하는 함수로, false를 반환하면 자리를 바꾸고, true가 반환되면 순서를 바꾸지 않는다.
