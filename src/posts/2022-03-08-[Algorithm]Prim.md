---
layout: post
title: Prim's Algorithm
date: 2022-03-08 12:07:18
categories:
tag:
toc: true
---

## Prim's Algorithm

MST(Minimum Spanning Tree)를 찾는 알고리즘이다.
MST는 Greedy로 최적해를 찾을 수 있는데, 프림 알고리즘과 크루스칼 알고리즘이 유명하다.
우선순위 큐로 구현할 경우 시간복잡도는 $O((V+E)logV)$다.
아래는 Prim 알고리즘의 작동 방식이다.

1. 임의의 점을 선택해서 트리에 포함시킨다.
2. 트리에 포함된 점과 아닌 점 사이의 선 중에 가장 짧은 선을 고른다.
3. 선과 연결된 점이 트리에 포함되어 있으면 사이클을 만드므로 넘어간다. 아니라면 트리에 포함시킨다.
4. 모든 점이 포함될 때까지 2 ~3을 반복한다.

Prim 알고리즘의 핵심은 두 집합을 사용하는 것이다.
트리에 포함되는 점 집합과 포함되지 않은 집합으로 나눈다.
그리고 이 둘 사이의 가장 가까운 거리를 반복해서 선택한다.

## Implementation Prim's Algorithm

알고리즘은 가장 가까운 거리를 반복해서 선택하고 있다.
배열로 구현할 경우 최소값을 찾기 위해 $O(n)$의 시간이 소요된다.
항상 작은값을 찾고 있으므로 우선순위 큐로 대체할 수 있다.
우선순위 큐는 내부 정렬에 $O(logn)$ 밖에 일어나지 않으므로 더 효율적이다.

우선순위 큐는 현재 트리와 각 점의 거리를 표시하는데 사용한다.
만약 연결되지 않는 점이 있다면, 아주 큰 값을 주거나 특정값으로 표시해야 한다.
우선순위 큐는 트리에 점을 추가할 때마다 갱신해야 한다.
새로운 점 v가 추가되면 v와 인접한 점의 거리를 갱신해주면 된다.

```
#include <string>
#include <vector>
#include <queue>

#define INF 0x3f3f3f3f

using namespace std;

typedef pair<int, int> PI;

int prim(int n, vector<vector<int>> costs) {
    int answer = 0;
    priority_queue<PI, vector<PI>, greater<PI>> pq;
    vector<int> dist(n, INF);
    vector<bool> marked(n, false);
   	vector<vector<PI>> edges(n);

    for (auto cost : costs) {
		edges[cost[0]].push_back({cost[1], cost[2]});
        edges[cost[1]].push_back({cost[0], cost[2]});
    }

    pq.push({0, 0});
    dist[0] = 0;
    while (!pq.empty()) {
        int v = pq.top().second;
        int v_length = pq.top().first;
        pq.pop();
        if (marked[v]) {
            continue;
        }
        answer += v_length;
        marked[v] = true;
        vector<PI>::iterator i;
       	for (i = edges[v].begin(); i != edges[v].end(); ++i) {
            int w = i -> first;
           	int length = i -> second;
           	if (!marked[w] && dist[w] > length) {
                dist[w] = length;
                pq.push({length, w});
            }
        }
    }
   	return answer;
}

int solution(int n, vector<vector<int>> costs) {
    return prim(n, costs);
}
```

## 참고

1. [Geeksforgeeks](https://www.geeksforgeeks.org/prims-algorithm-using-priority_queue-stl/)
