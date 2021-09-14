---
layout: post
title: "make site Step.1"
date: 2021-05-24 21:03:23 +0900
categories: jekyll update
author: Sangho Lee
---
[1.Liquid]
Liquid는 템플릿 언어로 3가지 부분으로 나뉜다. 각각 오브젝트, 태그, 필터로 하나씩 보자.

[2.오브젝트]
오브젝트는 컨텐츠를 어디에 출력할지 알려준다. 2개의 중괄호로 아래와 같이 표시한다.
```
{{ page.title }}
```
페이지에 page.title의 값을 출력한다.

[3.태그](http://jekyllrb-ko.github.io/docs/liquid/tags/)
태그는 템플릿의 논리 연산과 흐름을 제어한다 중괄호와 퍼센트로 표시한다.
```
{% if page.show_sidebar %}
    <div class="sidebar">
        sidebar content
    </div>
{% endif %}
```
page.show_sidebar가 참일 경우 사이드바를 출력한다.

[4.필터](http://jekyllrb-ko.github.io/docs/liquid/filters/)
필터는 Liquid 오브젝트의 출력을 변환시킨다.
예를 들어 {{ "/assets.style.css" }}는 출력값도 "/assets.style.css"이 된다.
이를 필터로 relative_url을 추가하면 앞에 baseurl값을 추가한다.
필터: {{ "/assets/style.css" | relative_url }}
출력: /my-baseurl/assets/style.css (my_baseurl부분에 baseurl 값이 추가된다.)