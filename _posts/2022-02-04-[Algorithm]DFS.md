---
layout: post
title: [Algorithm] DFS
date: Fri Feb  4 12:54:22 JST 2022
categories:
tag:
toc: true
---

# DFS(Depth First Search)

DFS는 tree나 graph에서 해를 찾는데 사용하는 알고리즘이다.
연결된 노드를 따라 최대한 깊이 확인 한 후에, 다시 뒤로 돌아가 다음 경로를 탐색한다.
tree와 graph에서 해를 찾기 때문에 항상 BFS(Breadth First Search)와 비교되는 알고리즘이다.
각각 장점이 다른데 해가 깊이 있을 경우 DFS를 사용하는 것이 유리하다.
그 이유는 BFS가 한 노드에 연결된 모든 노드를 탐색한 다음 아래로 내려가기 때문에, 깊은 곳까지 탐색하려면 오래 걸리기 때문이다.
그리고 DFS는 최적해를 찾는데는 사용해선 안 된다.
DFS는 조건을 만족하는 해를 찾으면 탐색을 중지하는데, 다른 경로에 최적의 해가 존재할 수 있기 때문이다.

## 구현

우선 DFS가 어떻게 작동하는지 알기 위해 하나의 예를 보자.
아래 그래프에서 F를 찾으려고 한다.

```
        A
       / \
      B   C
     /   / \
    D   E   F
```

DFS는 한 경로를 따라 최대한 탐색한 다음 이전 경로로 돌아간다고 했다.
그러므로 A -> B -> D로 한 경로를 끝까지 탐색한다.
이제 D에서 더 갈 수 없으므로, B로 돌아가서 다시 탐색을 한다.
그런데 B에서 갈 수 있는 것은 D뿐인데 이미 D는 방문했으므로 더 이상 갈 곳이 없다.
다시 A로 돌아가서 방문한 적 없는 노드를 찾는다.
A -> C -> E까지 탐색한 다음 더 이상 탐색할 수 없으므로 C로 돌아간다.
C에서 가지 않은 경로 F를 탐색해서 해를 찾는다.
이 예시에서 방문 순서를 보면 A, B, D, C, E, F가 된다.

여기서 핵심은 2가지로 방문 여부를 확인해야 하고, 다음에 방문할 노드를 결정해야 한다.
방문 여부는 배열을 사용해서 true, false로 쉽게 표시할 수 있다.
그리고 방문 순서를 구현하려면 스택이나 재귀호출을 사용해야 한다.
사실상 재귀호출이 스택과 비슷한 역할을 하기 때문에, 방문 순서는 스택으로 구현한다고 기억해도 된다.
아래는 코드 동작 순서다.

1. root node를 스택에 추가한다.
2. 스택의 top을 꺼내 node를 방문한 것으로 처리한다.
3. 현재 node에서 방문할 수 있는 node를 스택에 추가한다.
4. 해를 구할 때까지 2와 3을 반복한다.

여기서 스택을 사용하는 이유를 알 수 있는데, 나중에 추가한 노드일수록 먼저 탐색해야 하기 때문이다.
위 예시에서 스택의 변화를 보면 좀 더 명확히 알 수 있다.

```
[]              -> 빈 스택으로 시작, A를 추가한다.
[A]             -> A를 빼고, A와 연결된 B, C를 추가
[C, B]          -> B를 빼고, B와 연결된 D를 추가
[C, D]          -> D를 제거, D와 연결된 node가 없으므로 추가하지 않는다.
[C]             -> C를 제거, E, F를 추가
[F, E]          -> E를 제거, 추가할 node가 없다.
[F]             -> 탐색 대상인 F를 찾음
```

### 스택

우선 스택을 사용해서 만드는 법을 알아보자.
아래는 개략적인 의사코드로 G는 graph, v는 vertex를 의미한다.

```
procedure DFS(G, v) {
    let S is stack
    S.push(v)
    while(S is non-empty) {
        v = S.pop()
        if(v is not visited) {
            v is visited
            for all w in G.adjacentEdges(v) {
                S.push(w)
            }
        }
    }
}
```

이를 자바스크립트로 구현할텐데, 간단하게 하기 위해 node의 개수를 n, node v와 연결된 node가 E[v]에 들어 있다고 하겠다.

```
function DFS(v) {
    let visited = new Array.from({ length: n }, () => 0);
    let stack = [];
    stack.push(v);
    while(stack.length > 0) {
        s = stack.pop();
        if(visited[s] === false) {
            visited[s] = true;
        }

        for(let node of E[s]) {
            if(!visited[node]) {
                stack.push(node);
            }
        }
    }
}
```

문제의 조건에 따라 다르겠지만 DFS는 위의 형태를 기본으로 한다.
좀 더 정확히 그래프를 class로 정의해서 사용한 코드는 아래와 같다.

```
class Graph{

constructor(v)
{
    this.V = v;
    this.adj = new Array(v);
    for(let i = 0; i < v; ++i) {
        this.adj[i] = [];
    }
}

addEdge(v, w)
{
    this.adj[v].push(w);
}

DFS(s)
{
    let visited = new Array.from({ length: n }, () => 0);
    let stack = [];
    stack.push(s);
    while(stack.length > 0) {
        s = stack.pop();
        if(visited[s] === false) {
            visited[s] = true;
        }

        for(let node of E[s]) {
            if(!visited[node]) {
                stack.push(node);
            }
        }
    }
}
}
```

### 재귀 호출

앞서 재귀 함수를 사용하는 것이 스택과 다를바 없다고 했다.
그 이유를 알기 위해선 재귀 함수의 특징을 알아봐야 한다.
재귀함수는 아래와 같은 구조로 이뤄진다.

```
procedure recursion(start_input) {
    // if(endCondition) return;
    // A Block
    recursion(next_input);
    // B Block
}
```

위 코드를 좀 더 쉽게 이해하기 위해서 start_input을 i로 하고, 재귀 함수를 호출 할때 i를 1씩 증가시킨다고 하자.
그리고 endCondition을 i가 5가 될 때 끝낸다고 하자.

```
let i = 1;
procedure recursion(i) {
    if(i === 5) return;
    // A_i Block
    ++i
    recursion(i);
    // B_i Block
}
```

이제 위 코드가 작동하는 순서는 아래처럼 된다.

| Oper Order |
| ---------- |
| A_1 Block  |
| A_2 Block  |
| A_3 Block  |
| A_4 Block  |
| B_4 Block  |
| B_3 Block  |
| B_2 Block  |
| B_1 Block  |

보다시피 A Block은 순서대로 작동하지만, B Block은 역순으로 작동한다.
여기서 B Block 만을 사용한다면, 재귀 함수를 스택처럼 사용할 수 있다.
이 형태를 이해하고 있어야 DFS를 변형할 때 구체적인 구조를 상상할 수 있다.

아래는 재귀 함수를 사용해서 DFS의 의사 코드를 작성한 것이다.

```
procedure DFS(G, v) {
    v is visited
    for all w in G.adjacentEdges(v) {
        DFS(G, w)
    }
}
```

이를 구체적인 코드로 작성하면 아래처럼 된다.
이때 n은 node의 수, E[v]는 v와 인접한 node다.

```
let visited = new Array.from({ length: n }, () => false);

function DFS(v) {
    visited[v] = true;
    for(let node of E[v]) {
        if(!visited[node]) {
            DFS(node);
        }
    }
}
```

class로 작성하면 아래처럼 된다.

```
class Graph
{
    constructor(v)
    {
        this.V = v;
        this.adj = new Array(v);
        for(let i = 0; i < v; i++)
            this.adj[i] = [];
    }

    addEdge(v, w)
    {
        this.adj[v].push(w);
    }

    DFSUtil(v, visited)
    {
        visited[v] = true;

        for(let node of this.adj[v]) {
            if (!visited[node]) {
                this.DFSUtil(node, visited);
            }
        }
    }

    DFS(v)
    {
        let visited = new Array(this.V);
        for(let i = 0; i < this.V; i++)
            visited[i] = false;
        this.DFSUtil(v, visited);
    }
}
```

## tree에서 DFS 탐색 순서

지금까지는 간단한 형태의 DFS를 살펴봤다.
DFS는 단순히 경로 탐색에서만 사용하는 것이 아니라 더 복잡한 방법으로 사용할 수 있다.
그렇지만 이를 위해서는 DFS에서 각 코드가 어떤 의미이고, 코드를 추가하면 생기는 효과를 이해할 필요가 있다.
그래서 코드 작성 방법에 따라 어떤 순서로 작동하는지 알아보자.

앞서 살펴본 DFS 코드를 보면 아래와 같다.

```
let visited = new Array.from({ length: n }, () => false);

function DFS(v) {
    visited[v] = true;
    for(let node of E[v]) {
        if(!visited[node]) {
            DFS(node);
        }
    }
}
```

여기서 node v와 인접한 node에 대해 for문을 사용하는 것을 볼 수 있다.
다시 말해서 node에서 갈림길이 생기면 DFS를 사용하고 있다.
여기서 코드를 추가할 수 있는 부분은 4곳으로, for문 앞, 재귀 함수를 사용하기 전, 재귀 함수를 사용한 아래, for문이 종료된 곳이다.
각각을 A, B, C, D Block으로 표현하면 아래처럼 된다.

```
function DFS(v) {
    visited[v] = true;
    // A(v) Block
    for(let node of E[v]) {
        if(!visited[node]) {
            // B(node) Block
            DFS(node);
            // C(node) Block
        }
    }
    // D(v) Block
}
```

A, B, C, D에 코드를 추가하면 어떤 효과가 나타나는지 알기 위해 예를 들어 설명하겠다.
다만 A와 B는 if로 동작 여부만 다를 뿐 순서는 비슷하므로 하나로 생각한다.
우선 아래와 같은 구조가 있다고 하자.

```
       1
    /     \
   2       3
 /   \   /   \
4     5 6     7
```

위 그래프에 맞는 DFS 코드는 아래처럼 된다.

```
function DFS(v) {
    if(v > 7) return;
    DFS(2 * v);
    DFS(2 * v + 1);
}
```

제일 윗 줄은 DFS가 더 이상 진행되지 않도록 하는 부분이다.
그리고 그 아래는 각 node가 나뉘는 부분이다.
이제 여기서 A, B, C 블록을 표시해보자.

```
function DFS(v) {
    if(v > 7) return;

    // A(v) Block

    DFS(2 * v);

    // B(v) Block

    DFS(2 * v + 1);

    // C(v) Block
}
```

이제 각 블록이 작동하는 순서를 보자.
아래는 각 블록을 순서대로 정렬한 것으로 탭을 사용해서 좀 더 보기 편하게 만든 것이다.

```
A(1)
    A(2)
        A(4)
        B(4)
        C(4)
    B(2)
        A(5)
        B(5)
        C(5)
    C(2)
B(1)
    A(3)
        A(6)
        B(6)
        C(6)
    B(3)
        A(7)
        B(7)
        C(7)
    C(3)
C(1)
```

조금 복잡해 보이지만 중요한 것은 각각 어떤 순서로 사용되는지다.
아래는 A, B, C가 각각 작동하는 순서다.

-   A: 1, 2, 4, 5, 3, 6, 7
-   B: 4, 2, 5, 1, 6, 3, 7
-   C: 4, 5, 2, 6, 7, 3, 1

이들은 각각 전위, 중위, 후위 순회라고 불리는 순서다.
A는 root에서 왼쪽 tree를 탐색하고, 오른쪽 tree를 탐색한다.
B는 왼쪽 트리를 탐색하고, root로 간 다음, 오른쪽 tree를 탐색한다.
C는 왼쪽 트리를 탐색하고, 오른쪽 트리를 탐색한 다음 root로 간다.
위 순서를 tree에서 직접 보면서 확인하면 좀 더 간단하게 알 수 있다.

이처럼 DFS에서 코드를 삽입하는 위치에 따라서 코드가 3가지 방향으로 작동하는 것을 알 수 있다.
이들을 복합적으로 사용하려면 굉장히 어렵기 때문에 각각 서로 독립되도록 하는 것이 좋다.

## 시간 복잡도

DFS는 한 번의 호출마다 각 node에 연결된 edge의 수 만큼 탐색한다.
종합적으로 보면 모든 node와 edge를 방문하므로 O(V+E)만큼 시간이 걸린다고 볼 수 있다.
보다 시피 시간 복잡도가 그리 복잡하지 않으므로 사용할 수만 있다면 웬만해서는 큰 문제는 없다.
오히려 스택을 사용하기 때문에 메모리 공간을 넘어설 가능성이 더 크다.

## 장단점

### 장점

-   현 경로 상의 노드만 기억하므로 저장 공간의 수요가 적다.
-   목표 노드가 깊이 있을 경우 빠르게 구할 수 있다.

### 단점

-   해가 없는 경로가 깊으면 시간이 오래 걸린다.
-   얻어진 해가 최단 경로가 아닐 수 있다. DFS는 해를 구하면 탐색을 끝내버리므로 다른 해를 찾지 않는다. 그래서 찾은 해답이 최적의 답인지 확신할 수 없다.

## 참고

1. [geeksforgeeks](https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/)
