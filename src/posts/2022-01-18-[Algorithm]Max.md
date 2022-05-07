---
layout: post
title: [Algorithm] SAFE_INTEGER
date: 2022-01-18 13:48:22
categories:
tag:
toc: true
---

## JavaScript

최댓값을 구할 때 변수를 설정해서 적당히 작은 수로 초기화해야 하는 경우가 있다.
이는 최솟값을 구할 때도 비슷하게 굉장히 큰수로 초기화를 해야 한다.
그런데 얼마나 큰 수나 작은 수를 적을지 결정하기 어렵다.
비트 단위로 표현할 수 있는 가장 큰 수나 작은 수를 사용하면 되겠지만, 이 값을 기억하지 못하는 경우가 많다.
그럴 때 사용할 수 있는 것이 MAX_SAFE_INTEGER, MIN_SAFE_INTEGER다.

사용법은 간단히 `Number.MAX_SAFE_INTEGER`로 사용하면 된다.
위의 값이 곧 자바스크립트에서 표현 가능한 가장 큰 정수값을 표현한다.
`Number.MIN_SAFE_INTEGER`도 비슷하게 가장 작은 정수값을 표현한다.
