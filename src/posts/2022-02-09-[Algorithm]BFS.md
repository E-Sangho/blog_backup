---
layout: post
title: [Algorithm] BFS
date: 2022-02-09 23:04:42
categories:
tag:
toc: true
---

# BFS(Breadth First Search)

BFS는 그래프에서 모든 경로를 탐색하는 알고리즘이다.
경로를 탐색할 때 현재 점과 연결된 점을 먼저 방문하므로 폭 넓게 탐색하게 된다.
각 단계를 순서대로 찾기 때문에 최단거리를 찾는 문제에서 자주 사용한다.
BFS를 구현할 때는 queue를 사용한다.
BFS는 다음에 탐색할 점을 queue에 저장해서 사용하고, 더 이상 탐색할 곳이 없는 경우 즉, queue가 비었을 때 멈추게 된다.
DFS 알고리즘은 서로 보완적인 알고리즘이다.
그래프의 깊이가 깊을 경우 DFS가 유리하고, 넓을 경우엔 BFS가 유리하다.

DFS와의 차이점은 DFS는 스택을 사용하는 반면 BFS는 큐를 사용한다.
이때 스택은 그래프의 깊이를 저장하고, 큐는 넓이를 저장한다.
일반적으로 DFS, BFS는 트리에서 사용하는데, 이 경우 깊이는 O(logn), 넓이는 O(n)이 된다.
그래서 메모리적으로 DFS가 더 여유롭다.
그 외에 시간 복잡도 측면에서는 동일하므로 모든 경로를 탐색하는 시간은 비슷하다.
다만 스택과 큐의 차이점 때문에 BFS가 조금 더 느릴 수는 있다.

## 구현

DFS와 거의 동일한 방법으로 구현한다.
한 가지 차이점이라면 탐색 순서가 같은 단계에 있는 점을 순서대로 검색해야 한다는 점이다.
이는 queue에 방문할 점을 순서대로 추가하면 된다.
현재 점에서 방문할 점들을 queue에 추가하더라도 기존의 순서는 그대로 유지되기 때문이다.
아래는 코드로 이를 구현한 것이다.

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

BFS(s)
{
    let visited = Array.from({ length: n }, () => 0);
    let queue = [];
    visited[s] = true;
    queue.push(s);
    while(queue.length > 0) {
        s = queue.shift();
        for(let node of E[s]) {
            if(!visited[node]) {
                visited[node] = true;
                queue.push(node);
            }
        }
    }
}
}
```
