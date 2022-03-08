---
layout: post
title: Kruskal's Minimum Spanning Tree
date: Tue Mar  8 14:22:19 JST 2022
categories:
tag:
toc: true
---

# Kruskal's Minimum Spanning Tree

## MST?

spanning tree는 그래프의 모든 점을 연결하는 tree를 말한다.
간단히 말해 spanning tree는 그래프가 connected인 것을 유지하면서 Edge를 최대한 줄인 것이다.
spanning tree는 Edge 선택에 따라 여러 개가 있을 수 있다.
MST(Minimum Spanning Tree)는 spanning tree 중에서 경로합이 가장 짧은 것을 말한다.
여기서 경로합이란 그래프 각 Edge의 길이를 합한 것을 말한다.
길이 개념이 일반적으로 쓰이지만, 비중, 우선도, 비용 등 어떤 개념을 사용해도 상관없다.
중요한 것은 MST는 합계가 가장 작은 spanning tree라는 것이다.

## Kruskal's Algorithm

Kruskal 알고리즘은 MST를 찾는 알고리즘 중 하나다.
아래는 Kruskal 알고리즘이 작동하는 방식이다.

1. Edge를 길이 순서로 정렬한다.
2. 가장 짧은 Edge를 고른다.
3. Edge가 지금까지 고른 tree와 cycle을 만든다면 버리고, cycle을 만들지 않으면 추가한다.
4. 2 ~ 4를 반복한다.

Kruskal은 가장 짧은 Edge를 선택하므로 그리디 알고리즘이다.
알고리즘 개념 자체는 어렵지 않지만, 문제는 cycle이 만들어지는지 알아내는 것이다.
Kruskal은 cycle을 찾기 위해 Union-Find 알고리즘을 사용한다.

## Union-Find Algorithm

그래프에서 서로 연결되지 않은 점이 존재할 수 있다.
이들은 서로 아무런 접점이 없기 때문에 하나로 다룰 이유가 없다.
그러므로 서로 연결된 점들을 하나의 그래프로 만들어서 그래프를 나누는 것이 좋다.
Union-Find 알고리즘은 그래프를 연결된 것끼리 나눠서 분할해준다.

Union-Find 알고리즘의 아이디어는 간단하다.
두 가지가 같은 나무에서 났는지 확인하려면 가지를 따라 내려가면 된다.
만약 같은 나무라면 뿌리가 같을 것이다.
서로 다른 나무라면 뿌리가 다르다.
이 같은 아이디어를 그대로 사용하면 된다.

이를 위해서 각 점은 자신과 연결된 점을 기억한다.
그리고 함수를 사용해서 자신의 부모를 거슬러 올라간다.
그러다가 뿌리에 도착하면 해당 값을 반환한다.
두 점이 같은 그래프에 속하는지는, 함수의 반환값으로 알 수 있다.

Union-Find 알고리즘은 아래의 3가지 연산을 사용한다.

-   MakeSet: 한 점만 포함하는 그래프를 만든다.
-   Find: 어떤 점이 속한 그래프를 반환한다. 보통 해당 그래프를 대표하는 점를 반환한다.
-   Union: 두 그래프를 하나로 합친다.

MakeSet은 처음에 초기화를 위해 있는 함수로 그 이후엔 쓰이지 않는다.
위 함수를 코드로 바꾸면 아래처럼 된다.

```
vector<int> parents(n);
void MakeSet() {
    for (int i = 0; i < n; ++i) {
        parents[i] = i;
    }
}

int Find(int v) {
    if (parents[v] == v) {
        return v;
    }
    return Find(parents[v]);
}

void Union(int x, int y) {
    parents[x] = y;
}
```

Find는 재귀함수로 parents를 찾는다.
그리고 parents의 값이 변수와 일치하면, 다시 말해 대표값을 찾으면 그 값을 반환한다.
그래서 서로 연결된 그래프는 같은 값을 반환하게 된다.

Union은 두 그래프를 하나로 합치기 위해 x의 parent를 y로 바꾼다.
Union을 적용하기 전에 find(y) = a라고 하자.
그리고 `Union(x, y)`를 사용하면 find(x) = a가 된다.
x와 y의 값이 일치하므로 둘이 하나의 그래프에 속하게 된다.
다만 이는 x가 점일 경우에만 성립된다.

Union-Find Algorithm으로 cycle을 찾아내는 법은 간단하다.
두 점을 연결할 때 parents를 확인해서 서로 중복되면 cycle이 생긴 것이다.
그러므로 Union을 실행하기 전에 parent를 찾아서 비교하는 부분을 추가하면 된다.

```
if (find(x) != find(y)) {
    Union(x, y);
}
```

Find와 Union은 최적화를 할 수 있다.
우선 Find를 보면 각 단계를 하나하나 거슬러 올라간다.
그런데 그래프가 선형이라면 시간 복잡도가 $O(n)$이 된다.
이를 해결하기 위해선 find로 각 단계를 찾을 때마다, parents를 업데이트 해줘야 한다.

```
int Find(int x) {
    if (parents[x] == x) {
        return x;
    }
    return parents[x] = Find(parents[x]);
}
```

코드를 수정하면 Find가 한 번만에 대표값을 찾을 수 있게 된다.
그러므로 시간 복잡도가 $O(1)$으로 개선됐다.

다음으로 Union을 최적화 하자.
Union은 현재 오른쪽 값이 대표값이 되도록 만든다.
이 방식은 잘못하면 트리가 선형이 될 가능성이 있다.
Union은 내부적으로 Find를 사용한다.
Find는 처음 사용할 때 시간 복잡도가 $O(n)$일 수 있다.
그러므로 Union을 할 때, 트리가 선형이 되지 않도록 조정할 필요가 있다.

이는 트리를 이어 붙일 때 가급적이면 한 숫자에 붙도록 하면 된다.
예를 들어서 둘 중에 작은 값에 붙이도록 만든다면, 그래프는 옆으로 넓어지고 깊어지지 않는다.
또한 원소수로 정렬하는 방법도 좋다.
원소 수가 적을 수록 깊이가 얕고, 수가 많을 수록 깊이가 깊을 확률이 높다.
두 그래프를 합치는 것은 깊이가 최소한 1은 깊어질 수 밖에 없다.
많은 것을 적은 것에 붙이면 최대 깊이가 더 깊어진다.
반면 적은 것을 많은 것에 붙이면 최대 깊이가 늘어나지 않을 가능성이 있다.
그러므로 수가 적은 것을 많은 것에 붙어야 한다.
어쨌거나 중요한 것은 연결을 선형으로 하지 않는 것이다.
기준은 아래처럼 Rank 함수를 사용해서 지정하면 된다.

```
void Union(int x, int y) {
    int p_x = Find(x);
    int p_y = Find(y);
    if (Rank(p_x) < Rank(p_y)) {
        parents[p_y] = p_x;
    } else {
        parents[p_x] = p_y;
    }
}
```

## Implementation Kurskal's Algorithm

앞서 살펴본 Kruskal 알고리즘을 그대로 구현하면 된다.
이때 Union-Find 알고리즘을 사용하면 되는데, Union 시에 parent를 작은 수로 설정하는 것이 편하다.
아래는 프로그래머스의 섬 연결하기 문제에서 Kurskal 알고리즘을 사용한 것이다.

```
let parents;

function find(v) {
    if(parents[v] === v) {
        return v;
    }
    return find(parents[v]);
}

function union(x, y) {
    let p_x = find(x),
        p_y = find(y);
    if (p_x < p_y) {
        parents[p_y] = p_x;
    } else {
      	parents[p_x] = p_y;
    }
}

function solution(n, costs) {
    let answer = 0;
    parents = Array.from({ length: n });
    for (let i = 0; i < n; ++i) {
        parents[i] = i;
    }
    costs.sort((a, b) => {
        return a[2] - b[2];
    });
    for (let [x, y, weight] of costs) {
        if (find(x) !== find(y)) {
           	union(x, y);
            answer += weight;
        }
    }
    return answer;
}
```

여기서 핵심은 union이다.
union 코드를 아래 둘 중 하나를 사용하면 정상적으로 작동하지 않는다.

```
function union1(x, y) {
    let p_x = find(x),
        p_y = find(y);
    if (p_x < p_y) {
        parents[y] = x;
    } else {
      	parents[x] = y;
    }
}

function union2(x, y) {
    let p_x = find(x),
        p_y = find(y);
    if (p_x !== p_y) {
        parents[y] = x;
    }
}
```

parents의 구조는 directed graph다.
쉽게 말해 방향이 존재하는 그래프다.
Find를 보면 한 점에서 시작해서 대표값으로 진행한다.
이 순서는 절대 역으로 일어나지 않는다.
그런데 위의 union1을 보면 x, y를 연결하면서 parents 그래프의 방향을 바꿀 수 있다.
이 경우 원래의 parents 관계가 끊어지고 새로운 관계가 만들어진 것이다.
그렇기 때문에 y가 x에 붙었을 뿐, y와 연결된 그래프가 x와 붙는 것이 아니다.
그래서 y와 연결된 다른 점 v의 find(v)와 find(y)가 달라지는 경우가 생긴다.
다음으로 union2는 점을 연결하는데 사용할 수 있지만 그래프를 연결하는데 사용할 수 없다.
이 역시 union1과 마찬가지로 기존의 parents 연결을 끊고 새로운 연결을 만들기 때문이다.

위 같은 실수를 하지 않으려면 Kruskal's Algorithm이 2가지 그래프로 만들어진다는 것을 기억해야 한다.
첫 번째는 주어진 그래프에서 MST를 만드는 것이다.
두 번째는 각 점의 연결관계를 표시하는 parents 그래프다.
MST를 만드는 그래프는 연결관계가 변하지 않으므로 쉽게 상상할 수 있다.
반면 parents를 표시하는 그래프는 업데이트가 일어나면서 연결관계가 변경된다.
게다가 parents가 directed graph라는 점도 약간 까다롭다.
특히 union이 일어날 때가 문제다.
2개의 parents 그래프를 합칠 때 directed graph의 특성을 변경시키지 않고 합쳐야 하기 때문이다.
다만 이는 쉽게 해결할 수 있는데, 항상 find로 찾은 대표값을 연결한다고 기억하면 된다.
사실 directed graph의 방향을 유지하면서 두 그래프를 합치려면, 대표값을 연결하는 수 밖에 없다.
parents의 directed graph의 형태를 상상해보면 모든 화살표가 대표값으로 모이는 형태가 된다.
이 중에 어느 하나를 바꾸면 연결관계가 끊어지게 된다.
그런데 그 그래프에서 유일하게 연결관계가 정해지지 않은 것은 대표값 뿐이다.
그러므로 두 대표값을 연결해야 한다.
이런 이유로 union은 아래처럼 find로 대표값을 찾고, 두 대표값을 연결하는 형태가 된다.

```
function union(x, y) {
    let p_x = find(x),
        p_y = find(y);
    if (p_x < p_y) {
        parents[p_y] = p_x;
    } else {
      	parents[p_x] = p_y;
    }
}
```

## Reference

1. [Kruskal's Algorithm](https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/?ref=lbp)
2. [Union-Find Algorithm](https://www.geeksforgeeks.org/union-find/)
