---
layout: post
title: [Algorithm] Hash Table
date: Sat Jan 29 15:20:57 JST 2022
categories:
tag:
toc: true
---

# Hash Table

## Hash Table 개념

해시 테이블은 key-value로 데이터를 저장하는 자료구조다.
이때 key-value로 저장한다는 의미는, key값으로 value를 구할 수 있다는 의미다.
왜 해시 테이블이 필요한지 알기 위해 하나의 예시를 보자.
각 과일의 판매량을 저장하려고 한다고 하자.
이때 과일과 판매량이 서로 연관되게 저장해야 한다.
배열을 사용한다면 과일 이름과 판매량을 하나의 배열로 만들어서 저장할 수 있다.

```
[[apple, 10], [banana, 20], [coconut, 30]]
```

위 방법은 그럭저럭 잘 저장한 것 같지만 실제로는 문제가 많은 방법이다.
우리가 데이터를 저장하는 이유는 나중에 찾아서 사용하기 위함이다.
그런데 위 방법을 사용하면 과일의 판매량을 찾기 어렵다.
어느 위치에 과일이 저장되어 있는지 알아야 배열에서 꺼낼 수 있기 때문이다.
위는 단 3개만 예로 들었기 때문에 직접 찾을 수 있지만, 경우의 수가 굉장히 커진다면 저장된 위치를 찾기 어렵다.

보다시피 배열을 사용하면 value의 저장 위치를 찾기 어렵다.
이 문제를 해결할 핵심은 key만 주어졌을 때, 저장할 위치를 알 수 있어야 한다는 것이다.
처음 떠오르는 생각은 알고리즘으로 key를 변화시켜서 value를 저장하는 것이다.
예를 들어서 key의 길이로 정한 위치에 value를 넣는 것이다.
이렇게 하면 apple의 판매량을 찾을 때, 5번째 위치에 있다는 것을 알 수 있다.
그러므로 수가 많아진다고 해도 쉽게 찾을 수 있다.

문제는 당연하게도 길이가 같은 경우가 생긴다는 것이다.
간단한 해결법부터 차근차근 살펴보자.
key의 길이가 같은 경우, 길이를 +1해서 저장할 수 있을 것이다.
이렇게 하면 탐색하는 알고리즘이 좀 더 복잡해지겠지만, 길이가 같은 경우를 해결할 수는 있다.
하지만 길이를 1만 더하면 서로 겹치는 경우가 많이 발생하게 될 것이다.
그러므로 +100을 한다거나, 길이에 n을 곱해서 저장하는 위치를 서로 떼어놓는 것이 좋다.
이를 정확하게 표현한다면 저장하는 위치가 한 곳에 집중되는 것이 아니라, 고르게 분산되는 것이 좋다고 할 수 있다.

지금까지 살펴본 내용을 정리하자.
우리가 필요한 것은 key만으로 저장 위치를 알 수 있어야 하고, 저장 위치가 고르게 분산 되는 것이다.
이는 해시 함수의 특성과 정확히 일치한다.
해시 함수는 같은 값이 주어지면 항상 같은 결과를 내놓는다.
그러므로 key와 해시 함수로 저장 위치를 만들게 되면, key만으로 value를 알 수 있게 된다.
또한 해시 함수의 특성상 범위내에 고르게 분포되기 때문에 해시 함수값이 겹치는 경우가 적게 발생한다.
결국 이런 자료 구조를 만드는데 가장 적절한 것은 해시 함수다.
해시 테이블이라는 이름이 붙은 이유도 해시 함수를 사용해서 key-value를 저장하기 때문이다.

위 조건을 만족하는 함수는 더 존재할 수 있지만, 해시 함수가 가장 적절한 이유가 하나 더 있다.
해시 테이블에서 자료를 읽기, 추가, 변경, 삭제하는 경우 모두 해시 함수로 위치만 찾으면 간단하게 해결된다.
그러므로 해시 테이블의 속도는 곧 해시 함수의 속도에 달려 있다.
그리고 해시 함수는 O(1)으로 굉장히 빠르기 때문에, 이로 만든 해시 테이블도 빠를 수 밖에 없다.
결국 모든 내용을 종합해 봐도 해시 함수를 사용하는 것이 가장 적절하다.

해시 테이블의 단점은 주소의 충돌이 발생한다는 점이다.
어떤 방법을 쓰더라도 주소가 겹치는 일이 발생할 수 밖에 없는데, 이를 해결하는 것은 크게 3가지 방법이 있다.
하나는 메모리 크기를 늘려 더 많은 주소를 사용하는 것이다.
다른 하나는 충돌이 일어나면 다른 위치에 저장하는 것이다.
마지막으로 연결 리스트로 데이터를 연결하는 것이다.
첫 번째 해결법은 충돌이 일어나는 것 자체를 줄이는 방법이고, 나머지는 충돌이 일어났을 때 해결하는 방법이다.

우선 메모리를 늘리는 것부터 말해보자.
key의 수보다 메모리의 양이 커질수록 충돌이 생길 일이 적다.
하지만 메모리 양을 무작정 크게 만든다고 좋은 것은 아니다.
메모리 양을 늘리면 충돌이 덜 발생하긴 하지만, 낭비되는 메모리 양도 증가하게 된다.
이렇게 하면 충돌 발생을 막을 수야 있겠지만, 너무나 비효율적이다.
그래서 대부분의 경우 key의 수보다 메모리 주소양이 적은 모델을 사용한다.
다시 말해서 충돌이 발생하는 것을 감수하고 사용한다.

결국 충돌이 발생할 수 밖에 없다면, 최대한 다음 충돌을 막도록 만들어야 한다.
충돌이 생겼을 때 다른 위치에 삽입하는 방법을 개방 주소법(Open Addressing)이라고 한다.
앞서 말했듯이 충돌이 발생했을 때, 1칸씩 뒤에 저장하는 것은 그다지 좋은 방법이 아니다.
해시 함수가 균일하게 분포하긴 하므로 1씩 떨어져 있어도 큰 문제가 없어 보일 순 있다.
하지만 이런 경우가 반복되면 1칸씩 떨어진 주소를 몇 번이나 탐색해야 다음 저장 위치를 찾을 수 있게 된다.
균일하게 분포되면 2~3번이면 저장 위치를 찾을 수 있지만, 연속되면 100번을 넘어도 못 찾을 수도 있는 것이다.

서로 거리를 떨어뜨리기 위해 제곱으로 떨어뜨리기도 한다.
이 경우 반복될 수록 거리가 멀어지기 때문에, 겹치는 경우의 수가 줄어든다.
또 다른 방법으로는 해시 함수를 한 번 더 사용하는 방법이 있다.
이 외에도 다른 방법도 있지만, 공통적으로 서로 최대한 거리를 벌리고 균일하게 저장하는 것이 좋다.

충돌을 해결하는 다른 방법은 Chaning이라고 하며, Linked List로 해결하는 법이다.
해시 테이블에 같은 결과가 발생하면, 이전의 결과와 이어지는 node를 만들어서 저장하는 방법이다.
구현은 간단한데, node에 key, value, nextNode를 추가해서 Linked List로 만들면 된다.

Chaining과 Open Addressing의 차이점은, Chaining은 별다른 연산 없이 Linked List로 해결한다는 점이다.
특히 이 방법은 수가 늘어나더라도 낭비되는 시간이 크게 늘어나진 않는다.
반면 Open Addressing은 별도의 추가 공간이 필요 없지만, 수가 늘어나면 속도가 크게 줄어든다.
결국 수가 적으면 Open Addressing이 좋고, 수가 많으면 Chaining으로 해결하는 것이 좋다.

정리하자면 해시 테이블의 장단점은 아래와 같다.

-   삽입, 삭제, 읽기, 수정을 빠르게 할 수 있다.
-   key 값만 알면 value를 쉽게 찾을 수 있다.

-   해시 충돌이 발생해서 많이 저장할수록 느려진다.
-   key간의 거리 개념이 없어서 가까운 key를 찾을 수 없다.(이 경우 배열을 사용해야 한다.)

## JavaScript

JavaScript에서 해시테이블을 사용하려면 Map, Set을 주로 사용한다.
여기서 둘의 차이점은 Map은 key-value 구조고, Set은 key 값만 사용한다는 차이점이 있다.

### Map

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

### Set

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

## Futher Explanation of Map

알고리즘에서 Map을 사용할 때 몇 가지 팁이 있다.
우선 Map을 사용한다는 것은 기본적으로 Map에 사용할 배열이 있다는 것이다.
그리고 이 배열을 어떻게 Map에 추가할지, 그리고 값을 어떻게 변경 시킬지가 문제가 된다.
이때 배열을 사용하고 있으므로 배열의 메소드를 사용해야 한다.
선택지는 크게 3가지로 forEach, map, reduce가 있다.
우선 각 방법의 차이점을 알아보자.

### forEach

forEach를 사용하면 배열의 각 원소로 코드를 실행하게 된다.
이때 Map을 따로 선언하는 방법이 없으므로, 이전에 Map을 하나 선언해줘야 한다.
그러므로 forEach는 배열을 반환하지 않는다.

### reduce

reduce는 초기값을 쓸 수 있다.
그렇기 때문에 reduce와 함께 Map을 선언해서 사용할 수 있다.
처음 Map을 선언함과 동시에 값을 채워줄 때 사용한다.

### map

map은 callback 함수의 리턴값으로 배열을 만들어서 반환한다.
그렇기 때문에 Map 외에 별도의 배열이 필요한 경우에 사용한다.

### sort

Map은 Object로 만들어져 있다.
그렇기 때문에 sort를 사용할 수 없다.
그런데 상황에 따라서 Map의 내용을 정렬할 필요가 있다.
이 경우 Map을 배열로 바꾼 다음에 정렬해줘야 한다.
이때 사용할 수 있는 것이 앞의 map 메소드다.
map 메소드로 배열로 만든 다음 sort를 사용하면 쉽게 정렬할 수 있다.
다른 방법으로 Array.from()에 Map을 전달해주면 배열로 바꿀 수 있다.

### Conclusion

결론을 정리하자면 선언과 동시에 값을 만들어야 하는 경우 reduce가 유용하다.
이미 선언된 Map을 수정하는 경우는 forEach를 사용하는 것이 좋다.
그 외에 정렬과 같이 배열이 필요한 경우는 map을 쓰면 된다.

## C++

C++에서 Hash Table을 사용하려면 unordered_map을 사용해야 한다.
unordered_map은 중복된 데이터를 허용하지 않고, map과는 달리 key 값이 정렬되어 있지 않다.
사용하기 위해선 `#include <unordered_map>`으로 불러와야 한다.
아래는 unordered_map의 함수다.

-   empty(): 비어있는지 여부를 true, false로 반환한다.
-   size(): 현재 해시 테이블의 크기를 리턴한다.
-   begin(): 첫 iterator를 리턴한다.
-   end(): 마지막 + 1 iterator를 리턴한다.
-   umap[key] = value: umap에 key, value를 추가한다.
-   insert({key, value}): {key, value}를 해시 테이블에 추가한다. 이때 make_pair를 사용해서 {key, value}를 만들 수도 있다.
-   find(key): key의 iterator를 리턴한다. 만약 존재하지 않는다면 end를 리턴한다.
-   count(key): key의 원소의 수를 리턴한다.
-   erase(key): key를 지운다.
-   clear(): 해시 테이블을 초기화한다.

unordered_map의 내용을 모두 출력하려면 for문을 사용한다.
그런데 unordered_map은 정렬되어 있지 않으므로 index로 값을 찾을 수 없다.
대신에 iterator를 사용해야 하는데 first에 key가 저장되어 있고, second에 value가 저장되어 있다.
아래처럼 iterator를 선언하고, begin()에서 end()까지 사용하면 unordered_map의 내용을 출력할 수 있다.

```
unordered_map<string, int> umap;

umap.insert(make_pair("a", 1));
umap["b"] = 2;

unordered_map<string, int>::iterator itr;
for(itr = umap.begin(); itr != umap.end(); ++itr) {
    cout << itr -> first << " " << itr -> second << endl;
}
```
