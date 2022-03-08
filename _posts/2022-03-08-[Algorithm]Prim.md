---
layout: post
title: Prim's Algorithm
date: Tue Mar  8 12:07:18 JST 2022
categories:
tag:
toc: true
---

# Prim's Algorithm

MST(Minimum Spanning Tree)를 찾는 알고리즘이다.
Spanning Tree는 그래프가 connected인 것을 유지하면서 Edge를 최대한 줄인 것이다.
Edge를 최대한 줄였기 때문에 noncyclic graph이고, 모든 점이 연결되어 있으므로 Tree 형태가 된다.
여기서 Edge의 거리합이 최소가 되는 Tree가 MST다.

MST는 Greedy로 최적해를 찾을 수 있는데, 프림 알고리즘과 크루스칼 알고리즘이 유명하다.
