---
layout: post
title: "make site Step.1"
date: 2021-05-24 21:03:23 +0900
categories: jekyll update
---
[1. Liquid]
Liquid는 템플릿 언어로 3가지 부분으로 나뉜다. 각각 오브젝트, 태그, 필터로 하나씩 보자.

[2. 오브젝트]
오브젝트는 컨텐츠를 어디에 출력할지 알려준다. 2개의 중괄호로 아래와 같이 표시한다.
```
{{ page.title }}
```

[3. 태그]
태그는 템플릿의 논리 연산과 흐름을 제어한다 중괄호와 퍼센트로 표시한다.
```
{% if page.show_sidebar %}
    <div class="sidebar">
        sidebar content
    </div>
{% endif %}
```
