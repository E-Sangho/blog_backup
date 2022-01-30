---
layout: post
title: [Algorithm] Hash Table
date: Sat Jan 29 15:20:57 JST 2022
categories:
tag:
toc: true
---

해시테이블을 사용하려면 Map, Set을 주로 사용한다.
여기서 둘의 차이점은 Map은 key-value 구조고, Set은 key 값만 사용한다는 차이점이 있다.

## Map

Map은 key-value로 데이터를 저장하는데 사용된다.
아래는 Map에서 사용할 수 있는 method다.

-   set(key, value): key와 value를 저장한다.
-   get(key): key에 해당하는 value를 출력한다.
-   has(key): key값의 포함 여부를 boolean으로 반환한다.
-   delete(key): key로 원소를 찾아 삭제한다.
-   size: Map의 크기를 반환한다.

```
const map1 = new Map();

map1.set('a', 1);
map1.set('b', 2);
map1.set('c', 3);

console.log(map1.get('a'));
// expected output: 1

map1.set('a', 97);

console.log(map1.get('a'));
// expected output: 97

console.log(map1.size);
// expected output: 3

map1.delete('b');

console.log(map1.size);
// expected output: 2
```

## Set

-   new Set([iterable])

Set은 수학의 집합과 동일하다.
처음 Set을 만들 때 값을 전달하려면 보통 배열을 사용한다.
아래와 같은 method를 사용한다.

-   add
-   has
-   delete
-   size

```
var mySet = new Set();

mySet.add(1); // Set { 1 }
mySet.add(5); // Set { 1, 5 }
mySet.add(5); // Set { 1, 5 }
mySet.add('some text'); // Set { 1, 5, 'some text' }
var o = {a: 1, b: 2};
mySet.add(o);

mySet.add({a: 1, b: 2}); // o와 다른 객체를 참조하므로 괜찮음

mySet.has(1); // true
mySet.has(3); // false, 3은 set에 추가되지 않았음
mySet.has(5);              // true
mySet.has(Math.sqrt(25));  // true
mySet.has('Some Text'.toLowerCase()); // true
mySet.has(o); // true

mySet.size; // 5

mySet.delete(5); // set에서 5를 제거함
mySet.has(5);    // false, 5가 제거되었음

mySet.size; // 4, 방금 값을 하나 제거했음
console.log(mySet);// Set {1, "some text", Object {a: 1, b: 2}, Object {a: 1, b: 2}}
```

수학의 Set처럼 합집합, 교집합, 여집합 등을 아래처럼 구현할 수 있다.

```
Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}

//Examples
var setA = new Set([1, 2, 3, 4]),
    setB = new Set([2, 3]),
    setC = new Set([3, 4, 5, 6]);

setA.isSuperset(setB); // => true
setA.union(setC); // => Set [1, 2, 3, 4, 5, 6]
setA.intersection(setC); // => Set [3, 4]
setA.difference(setC); // => Set [1, 2]
```
