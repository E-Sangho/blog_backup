---
layout: post
title: [Algorithm] DFS
date: Fri Feb  4 12:54:22 JST 2022
categories:
tag:
toc: true
---

# DFS(Depth First Search)

DFS는 그래프에서 모든 경로를 탐색하는데 사용하는 알고리즘이다.
연결된 점을 따라가는데 더는 갈 곳이 없을 때까지 진행한다.
그리고 경로가 막히게 되면 다시 경로를 되돌아가서 탐색한다.
모든 경로를 탐색하므로 BFS(Breadth First Search)와 비교되는 알고리즘이다.
둘의 차이점은 DFS는 깊게 탐색하고, BFS는 넓게 탐색한다는 점이다.
그렇기 때문에 그래프의 형태가 깊을 경우 DFS를 사용하고, 넓을 경우 BFS를 사용한다.
DFS는 경로를 찾는 것 외의 방법으로도 사용할 수 있다.
조건을 만족하는 해, 부분집합, 우선 순위 탐색 등으로 사용한다.

## 구현

우선 DFS가 어떻게 작동하는지 알기 위해 하나의 예를 보자.
아래 그래프에서 모든 노드를 지나는 경로를 찾으려고 한다.

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
C에서 가지 않은 경로 F를 탐색한다.
이 예시에서 방문 순서를 보면 A, B, D, C, E, F가 된다.

DFS의 특징은 모든 노드에서 동일한 탐색 방법을 사용한다는 점이다.
예를 들어서 위 그래프에서 A가 없다고 생각하자.
B에서부터 시작하면 경로는 B -> D가 된다.
C에서부터 시작하면 C -> E - > F다.
이는 A부터 시작한 경로인 A -> (B -> D) -> (C -> E -> F)의 일부분이다.
같은 탐색 방법을 사용한다는 뜻은 곧 재귀함수로 구현할 수 있다는 의미다.
아래는 v 노드를 방문하고 v 노드와 인접한 w 노드에서 DFS를 실행하는 의사 코드다.

```
DFS(G, v)
    visit(v)
    for(w in neighbor(v))
        DFS(G, w)
```

다만 한 가지 문제점이 있다.
그래프 내부에 cycle이 존재할 경우 무한히 실행될 수 있다는 점이다.
위 코드를 아래에 그대로 적용시키면 무한히 반복할 것이다.

```
    A
  /   \
 B  -  C
```

이를 피하기 위해선 방문한 노드를 표시할 필요가 있다.
방문을 기록할 배열 marked를 만들고 값을 false로 초기화 한다.
그리고 v를 방문한 경우 marked[v]를 true로 기록한다.
이렇게 하면 marked로 노드가 이미 방문했는지 아닌지를 알 수 있다.
다음으로 w를 방문하지 않은 경우만 DFS(G, w)를 실행한다.

```
marked = Array(G.size, false)
DFS(G, v)
    visit(v)
    marked[v] = true
    for(w in neighbor(v))
        if(marked[w])
            DFS(G, w)
```

지금까지 코드를 정리해보자.
DFS는 노드 v를 방문하고 visit(v)를 실행시킨 후에, marked로 해당 노드를 표시한다.
그리고 v와 연결된 노드 w를 방문했는지 확인하고 DFS(G, w)를 실행한다.

위 코드에서 visit(v)를 제외하고는 항상 동일하다고 보면 된다.
visit(v)만이 각 노드를 방문했을 때 실행할 함수로 구하고자 하는 것에 따라 달라진다.
예를 들어서 만약 경로를 기록하고 싶다면 push로 경로를 추가하면 된다.

```
marked = Array(G.size, false)
arr = [];
DFS(G, v, arr)
    arr.push(v)
    marked[v] = true
    for(w in neighbor(v))
        if(!marked[w])
            DFS(G, w, arr)
```

그런데 재귀함수는 함수가 쌓여서 뒤에서부터 처리하게 된다.
그렇기 때문에 스택과 같은 면이 있다.
DFS를 보면 앞으로 방문할 노드 함수가 스택처럼 쌓이는 것을 알 수 있다.
그렇기 때문에 위 함수를 스택으로 구현할 수 있다.

```
marked = Array(G.size, false)
arr = [];
DFS(G, v, arr)
    stack = [v]
    while(stack.length > 0)
        v = stack.pop()
        if(!marked[v])
            visit(v)
            marked[v] = true
            for(w in neighbor(v))
                if(!marked[w])
                    stack.push(w)
```

여기까지가 아이디어 설명이고 아래는 실제 코드로 구현해보겠다.

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
            for(w in G.neighbor(v)) {
                S.push(w)
            }
        }
    }
}
```

이를 자바스크립트로 구현할텐데, 간단하게 하기 위해 node의 개수를 n, node v와 연결된 node가 E[v]에 들어 있다고 하겠다.

```
function DFS(v) {
    let visited = Array.from({ length: n }, () => 0);
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
    let visited = Array.from({ length: n }, () => 0);
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
A와 B를 적절히 사용하면 재귀 함수를 스택처럼 사용할 수 있다.
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

## pre, middle, post Order

지금까지는 간단한 형태의 DFS를 살펴봤다.
DFS는 단순히 경로 탐색에서만 사용하는 것이 아니라 더 복잡한 방법으로 사용할 수 있다.
그렇지만 이를 위해서는 DFS에서 각 코드가 어떤 의미이고, 코드를 추가하면 생기는 효과를 이해할 필요가 있다.
그래서 코드 작성 방법에 따라 어떤 순서로 작동하는지 알아보자.

앞서 살펴본 DFS 코드를 보면 아래와 같다.

```
let visited = Array.from({ length: n }, () => false);

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
만약 그래프가 binary tree라면 이를 아래처럼 만들 수 있다.

```
let visited = Array.from({ length: n }, () => false);

function DFS(v) {
    visited[v] = true;
    if(!visited[node1]) {
        DFS(node1);
    }
    if(!visited[node2]) {
        DFS(node2);
    }
}
```

여기서 코드를 추가할 수 있는 부분은 4곳으로, for문 앞, 재귀 함수를 사용하기 전, 재귀 함수를 사용한 아래, for문이 종료된 곳이다.
그런데 재귀함수가 사용되는 전후에 코드를 삽입하는 것은 탐색 순서에 영향을 주지 않는다.
대신에 노드를 방문하기 전 후에 실행하는 코드를 삽입하는 곳이다.
우리가 알아볼 것은 아래 A, B, C Block에 코드를 삽입했을 때 어떤 효과가 나타날지다.

```
let visited = Array.from({ length: n }, () => false);

function DFS(v) {
    visited[v] = true;
    // A(v) Block
    if(!visited[node1]) {
        DFS(node1);
    }
    // B(v) Block
    if(!visited[node2]) {
        DFS(node2);
    }
    // C(v) Block
}
```

A, B, C에 코드를 추가하면 어떤 효과가 나타나는지 알기 위해 예를 들어 설명하겠다.
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

이들은 각각 pre, middle, post-order라고 불리는 순서다.
A는 root에서 왼쪽 tree를 탐색하고, 오른쪽 tree를 탐색한다.
B는 왼쪽 트리를 탐색하고, root로 간 다음, 오른쪽 tree를 탐색한다.
C는 왼쪽 트리를 탐색하고, 오른쪽 트리를 탐색한 다음 root로 간다.
위 순서를 tree에서 직접 보면서 확인하면 좀 더 간단하게 알 수 있다.

이처럼 DFS에서 코드를 삽입하는 위치에 따라서 코드가 3가지 방향으로 작동하는 것을 알 수 있다.

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
-   얻어진 해가 최단 경로가 아닐 수 있다.

## 참고

1. [geeksforgeeks](https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/)
