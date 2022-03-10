---
layout: post
title: Dijkstra Algorithm
date: Tue Mar  8 12:21:09 JST 2022
categories:
tag:
toc: true
---

# Dijkstra Algorithm

그래프에서 점 간의 최단거리를 찾는데 사용하는 알고리즘이다.
데이크스트라 알고리즘은 변형이 많다.
원본은 두 점 사이의 최단거리를 구한다.
이를 응용해서 한 점을 고정하고, 다른 모든 점까지의 최단거리를 찾을 수 있다.
초창기 데이크스트라 알고리즘의 시간 복잡도는 $O(V^2)$였다.
우선순위 큐를 사용하면 시간 복잡도는 $O((E + V)logV)$가 된다.
데이크스트라는 최단 경로를 찾는 알고리즘 중 제일 빠르다고 알려져있다.

데이크스트라 알고리즘은 프림 알고리즘과 비슷하다.
방문한 점과 아닌 점을 나눈다.
시작점과의 각 점의 거리를 기록한다.
방문하지 않은 점 중에서 가장 짧은 선을 방문한다.
새로 방문한 점을 기준으로 거리를 업데이트 한다.

1. 모든 점을 미방문 상태로 기록한다.
2. 모든 점의 거리를 기록한다. 초기점은 0으로 하고 나머지는 INF로 정한다.
3. 현재 점에서 인접한 미방문 점을 찾아 최단거리를 계산하고, 거리를 업데이트 한다.
4. 현재 점을 방문한 것으로 처리한다.
5. 도착할 때가지 3 ~ 4를 반복한다.

```
#define INF 0x3f3f3f3f
typedef pair<int, int> IP;

void Dijkstra(int n, int src, vector<int> edges) {
    priority_queue<IP, vector<IP>, greater<IP>> pq;
    vector<int> dist(n, INF);
    vector<IP> adj(n);
    for (auto edge : edges) {
        adj[edge[0]].push({edge[1], edge[2]});
        adj[edge[1]].push({edge[0], edge[2]});
    }

    pq.push({0, src})
    dist[src] = 0;

    while (!pq.empty()) {
        int v = pq.pop().second;
        pq.pop();

        for (auto adj : adj[v]) {
            int w = adj.first;
            int weight = adj.second;
            if (dist[w] > dist[v] + weight) {
                dist[w] = dist[v] + weight;
                pq.push({dist[w], w});
            }
        }
    }
}
```

## 참고

1. [GeeksforGeeks](https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-using-priority_queue-stl/)
