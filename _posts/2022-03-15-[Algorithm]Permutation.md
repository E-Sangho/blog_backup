---
layout: post
title: Permutation
date: Tue Mar 15 10:57:15 JST 2022
categories:
tag:
toc: true
---

# Permutation

순열은 DFS를 사용해서 구현할 수 있다.
각 원소를 방문했는지를 기록하면서 선택을 이어가면 된다.
방법 자체는 그다지 어렵지 않다.

```
function Permutation(arr) {
    let n = arr.length;
    let answer = [];
    let visited = Array.from({ length: n });
    let chosen = [];
    function PUtil(depth, r) {
        if (depth === r) {
            answer.push(chosen.slice());
            return;
        }
        for (let i = 0; i < n; ++i) {
            if (!visited[i]) {
                visited[i] = true;
                chosen[depth] = arr[i];
                PUtil(depth + 1, r);
                visited[i] = false;
            }
        }
    }
    for (let r = 0; r <= n; ++r) {
        PUtil(0, r);
    }
    return answer;
}
```

C++에서는 이보다 더 간단하게 진행할 수 있다.
C++는 next_permutation을 사용하면 아래처럼 순열을 구할 수 있다.

```
#include <algorithm>
#include <iostream>

using namespace std;

void permute(string s) {
    sort(s.begin(), s.end());
    do {
        cout << s << endl;
    } while (next_permutation(s.begin(), s.end()));
}

int main() {
    permute("ABC");
}
```

다만 next_permutation을 사용할 때, 오름차순으로 정렬되어 있어야 한다.

```
template<class BidirIt>
bool next_permutation(BidirIt first, BidirIt last)
{
    if (first == last) return false;
    BidirIt i = last;
    if (first == --i) return false;

    while (true) {
        BidirIt i1, i2;

        i1 = i;
        if (*--i < *i1) {
            i2 = last;
            while (!(*i < *--i2))
                ;
            std::iter_swap(i, i2);
            std::reverse(i1, last);
            return true;
        }
        if (i == first) {
            std::reverse(first, last);
            return false;
        }
    }
}
```

## 참고

1. [GeeksforGeeks](https://www.geeksforgeeks.org/permutations-of-a-given-string-using-stl/)
2. [cppreference](https://en.cppreference.com/w/cpp/algorithm/next_permutation)
