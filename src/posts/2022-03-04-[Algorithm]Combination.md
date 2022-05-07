---
layout: post
title: Combination
date: 2022-03-04 13:18:44
categories:
tag:
toc: true
---

# Combination

조합 ${n \choose r}$을 구하는 코드는 크게 2가지가 있다.
둘 다 DFS를 사용하는데 아래와 같다.
첫 번째 방법은 n개의 수를 돌아가며 각 수를 뽑은 경우와 아닌 경우를 살피는 것이다.
두 번째 방법은 수를 하나씩 고정시켜가며 r개를 뽑는 것이다.

첫 번째 방법부터 설명하겠다.
이 아이디어는 아래의 조합을 구하는 공식의 방법과 동일하다.

> ${n \choose r} = {n-1 \choose r} + {n-1 \choose r-1}$

다시말해 각 수를 선택한 경우와 선택하지 않은 경우로 나눠서 그래프를 진행하는 것이다.

```
vector<vector<int>> answer;
vector<int> arr(n);
vector<int> chosen(r);

void Combination(int index, int r, int depth) {
    if (r == 0) {
        answer.push_back(chosen);
        return;
    }

    if (depth == arr.size()) {
        return;
    }
    chosen[index] = arr[depth];
    Combination(index + 1, r - 1, depth + 1);
    Combination(index, r, depth + 1);
}
```

종료 조건을 r == 0을 사용하고 있다.
여기서 r은 앞으로 선택해야 할 수를 표시하고 있다.
그러므로 r == 0이면 더 이상 뽑을 수가 없으므로 종료한다.
이와 유사하게 뽑은 수가 r이 되면 종료되도록 아래처럼 만들 수도 있다.

```
void Combination(int index, int r, int depth) {
    if (index == r) {
        answer.push_back(chosen);
        return;
    }

    if (depth == arr.size()) {
        return;
    }
    chosen[index] = arr[depth];
    Combination(index + 1, r - 1, depth + 1);
    Combination(index, r, depth + 1);
}
```

두 번째 방법은 각 뽑아야 할 자리에 수를 배치해서 찾는 것이다.
이 방법은 사람이 조합의 경우의 수를 찾는 경우와 비슷하다.
예를 들어서 ['a', 'b', 'c', 'd', 'e']에서 ${5 \choose 3}$를 구한다고 하자.
사람이 직접 구한다면 ['a', 'b', 'c'], ['a', 'b', 'd'], ['a', 'b', 'e'] ... ['c', 'd', 'e'] 순서로 뽑을 것이다.
여기서 ['a', 'b', 'c']에서 ['a', 'b', 'd']로 넘어간 경우를 보자.
처음부터 a, b, d를 다시 뽑지 않았을 것이다.
대신에 마지막 수인 c를 제거한 다음, 다음 수부터 1개를 골랐을 것이다.
여기서 중요한 힌트를 얻을 수 있다.
다음 조합을 선택할 때 선택한 원소 이전의 수는 무시해도 된다는 것이다.
같은 이유로 ['a', 'b', 'e']에서 ['a', 'c', 'd']로 넘어갈 때도, b를 제거하고 c부터 2개를 뽑는다.
마지막으로 ['a', 'e', #] 같은 경우를 살펴보지 않는다.
이는 뽑아야 할 수보다 뽑을 수 있는 수가 적은 경우는 불필요하기 때문이다.

코드를 작성할 때 필요한 것은 현재 뽑는 위치 start와 몇 번째 수를 뽑는지 표시하는 index다.
index가 r이 되면 종료한다.
그리고 남은 수 arr.size() - i가 뽑아야 할 수 r - index 보다 작은 경우는 살펴보지 않는다.

```
void Combination(int start, int index) {
    if (index == r) {
        answer.push_back(chosen);
        return;
    }

    for (int i = start; i < arr.size() && arr.size() - i >= r - index; ++i) {
        chosen[index] = arr[i];
        Combination(i+1, index + 1)
    }
}
```
