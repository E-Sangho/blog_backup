---
layout: post
title: "flex box"
date: 2021-09-23 19:48:24
categories: css
tag: flexbox
toc: true
---

# Flexbox를 잘 다뤄야 하는 이유

CSS를 다루다보면 모르는 것을 종종 마주친다. 그리고 대게는 MDN을 찾아보고 적용하는 것만으로도 쉽게 해결된다. 배경색을 바꾸고 싶다거나, 커서를 올렸을 때 반응이나, 애니메이션 효과를 주고 싶은 등의 것들은 모르고 있을 뿐 알게 되면 쉽게 해결할 수 있는 문제다. 그런데 CSS의 배치는 생각보다 쉬운 문제가 아니다. 정확히 말하자면 이해는 하되 익숙해지는데 오랜 시간이 걸린다. 내 경우에도 CSS에서 가장 많은 문제가 발생하고 또 오랜 시간이 걸리는 부분이 화면 배치가 내가 원하는대로 되지 않는 경우였다. 그래서 화면 배치를 다루는 방법을 정리해보기로 했다. 화면 배치를 다루는 것은 2가지 *Flexbox*와 *Grid*가 있다. 그 중에서 이번에는 Flexbox를 다뤄보려고 한다.

# 왜 Flexbox가 필요할까

우선 아래와 같이 박스 3개가 있다고 하자.

```
// box.html
<body>
    <div class="box">1</div>
    <div class="box">2</div>
    <div class="box">3</div>
</body>
// style.css
.box {
    width: 100px;
    height: 100px;
    background-color: blue;
    color: white;
    display: block;
}
```

박스의 배치를 다루는 기본 값은 3개가 있다.

-   Block

```
// style.css
.box {
    ...
    display: block;
}
```

Block은 각 element가 한 줄을 통째로 차지한다. 다시말해 블록들이 서로 인접하지 못한다. 그래서 블록들이 3줄에 나눠져서 보이게 된다. 또한 height, width, margin, padding이 그대로 반영된다.

-   inline

```
// style.css
.box {
    ...
    display: inline;
}
```

inline은 block과 달리 줄바꿈 없이 표현된다. 그렇지만 width, height 같은 속성은 무시된다. 왜냐하면 컨텐츠 크기에 맞춰서 공간을 차지하기 때문이다. margin과 padding도 위아래는 무시하고 좌우로만 반영된다.

-   inline-block

```
// style.css
.box {
    ...
    display: inline-block;
}
```

위에서 block은 모든 속성이 반영되고 inline은 높이나 넓이 등은 무시됨을 알았다. 그런데 같은 줄에 나오면서도 높이와 넓이 값이 필요할 때도 있다. 이 때 사용하는 것이 inline-block이다. inline-block을 쓰면 inline처럼 서로 인접하면서 block의 속성을 가져 높이와 넓이가 있는 블록을 만들 수 있다. 그런데 이렇게 만들면 상상한 것과 달리 딱 붙지 않고 블록 사이에 공간이 생긴다.

이번에는 블록들을 원하는대로 배치하는 경우를 생각해보자. 마지막 블록을 제일 끝으로 정렬하고자 한다. 기초적인 방법으론 margin을 left에만 줘서 오른쪽 끝에 정렬할 수 있다. 그런데 중간 블록의 위치를 바꿔준다면 양식이 깨져서 margin을 새로 정해줘야 한다. 뿐만 아니라 사용하는 장치의 화면 크기에 따라선 줄바꿈이 일어나거나 끝에 위치하지 않을 수도 있다.

결국 기존의 방법으로는 크게 2가지 문제점이 있음을 알 수 있다.

-   블록을 나란히 하기 힘들다.
-   블록 사이의 간격을 조절하기 어렵다.

그리고 Flexbox를 사용하면 위의 문제를 아주 간단히 해결할 수 있다.

# Flexbox 적용

Flexbox를 적용하기 전에 알아야 할 것이 두 가지 있다. 먼저 CSS의 첫 글자인 Cascading과 걸맞지 않게 Flexbox 속성은 상속되지 않는다. 다시 말해 부모 element를 flex로 만들어도 자식도 flex 속성을 가지지 않는다. 그리고 flex 속성은 정렬하고 싶은 박스가 아닌 그 박스를 포함하고 있는 container에게 적용되어야 한다. 이를 위해 코드를 조금 고치겠다.

```
// box.html
<body>
    <div class="container">
        <div class="box">1</div>
        <div class="box">2</div>
        <div class="box">3</div>
    </div>
</body>
```

```
// style.css
.container {
    display: flex;
}

.box {
    width: 100px;
    height: 100px;
    background-color: blue;
    color: white;
}
```

이렇게 하면 우리의 첫 번째 문재점인 박스 사이의 간격을 해결할 수 있다. 하지만 박스가 가로로 오는 경우만 해결했을 뿐 세로로 만드는 경우는 해결되지 않았다.

# Flex Direction

flex-direction은 row와 column 두 가지 값이 있다. row는 말 그대로 컨텐츠를 가로 방향으로 쌓아 나가는 것이고 column은 세로 방향으로 만드는 것이다. 위에서 flex로 속성을 바꿧을 때, 방향이 가로로 바뀌었다. 이는 flexbox의 기본값이 row로 설정되어 있기 때문이다. 간단히 아래 두 경우를 비교해보면 쉽게 이해할 수 있다.

```
// style.css
.container {
    display: flex;
    flex-direction: row;
}
```

```
// style.css
.container {
    display: flex;
    flex-direction: column;
}
```

# Main & Cross Axis

flexbox는 main axis와 cross axis가 있다. flex-direction이 row라면 main axis는 row가 되고 cross axis는 column이 된다. 반대로 flex-direction이 column이면 main axis는 column이 되고 cross axis는 row가 된다. 다시 말해 쌓이는 방향이 main axis고 그 외의 방향이 cross axis가 된다.

이 때, main axis 방향의 간격을 조절하는 Property가 justify-content이고 cross axis 방향의 간격을 조절하는 것은 align-items다. 각 Property마다 Value는 여러가지 있으니 팔요할때마다 MDN을 참조하면 된다. 간단히 예를 몇가지 들어보자. main axis 방향으로 중앙 정렬하고 싶으면 `justify-content: center`을 쓰면 된다. 서로 간격을 주고 싶으면 space-between, 늘리고 싶으면 stretch를 쓴다. cross axis 방향으로도 같은 방법으로 배치를 바꿀 수 있다. 이때, 종종 실수하는 것이 높이를 주지 않는 경우다. 당연하지만 높이가 없으면 컨텐츠 크기에 높이가 맞춰지므로 세로 방향은 정렬이 안 되는 경우가 생긴다. 이때는 container에 높이를 줘야 작동한다. 각 property에 쓰이는 값을 모두 외울 필요는 없다. 중요한 것은 둘의 방향이므로 아래 2가지만 기억하고 있으면 된다.

-   main axis: justify-content
-   cross axis: align-items

# align-self & order & reverse

지금까지는 box가 아니라 container에게 값을 줘서 위치를 다뤘다. 이번에는 box에게 값을 줘서 위치를 바꾸는 법을 설명하겠다. 3개의 박스 중에서 중앙의 박스만 중앙 정렬을 하려면 어떻게 해야 할까? 간단히 다음과 같이 쓰면 된다.

```
// style.css
.box:nth-child(2) {
    align-self: center;
}
```

위와 같이 쓰면 cross-axix를 기준으로 중앙으로 이동하게 된다. 즉, `flex-direction: row`일 때는 세로 방향으로 중앙 정렬하고, `flex-direction: column`이면 가로 방향으로 중앙정렬한다.

다음으로 box의 순서를 바꾸는 법을 알아보겠다. 간단히 html 파일을 수정할 수도 있겠지만, 서버에서 정보를 받아오는 경우등 html을 수정할 수 없는 경우도 생길 수 있으므로 유용하다. 바꾸는 법은 order을 정해주면 된다. 예를 들어 두 번째 박스를 제일 앞으로 오게 하려면 어떻게 해야 할까? 아마 아래와 같이 생각할 것이다.

```
// style.css
.box:nth-child(2) {
    order: 1;
}
```

하지만 이렇게 하면 오히려 제일 뒤로 가버린다. 그 이유는 order의 기본값이 0이기 때문이다. 즉 위의 css파일은 나머지 박스들은 order을 0이 되고 두 번째 박스가 값이 1이 된다. order의 값이 클 수록 뒤로 가기 때문에 두 번째 박스가 제일 뒤로 가게 된다. 그래서 두 번째 박스를 제일 앞으로 오게 하려면 나머지 박스의 order를 수정해줘야 한다.

```
// style.css
.box:nth-child(1), .box:nth-child(3) {
    order: 1;
}
```

그런데 순서를 한 두개 바꾸는 수준이 아니라면 어떻게 해야할까? 만약 모든 컨텐츠의 순서를 반대로 하고 싶은 경우가 있으면 flex-direction을 바꿔주면 된다.

```
.container {
    flex-direction: row-reverse;
}
```

위와 같이 하면 row 방향으로 쌓이되 순서가 반대가 된다. column방향도 마찬가지로 colum-reverse를 사용하면 순서가 바뀌게 된다.

# wrap & nowrap & align-content

지금까지는 box가 적어서 모두 한 줄에 있을 경우를 살펴봤다. 만약 컨텐츠가 많아져서 한 줄에 너무 많은 박스가 들어가면 어떻게 될까? 생각할 수 있는 경우는 두 가지다. 첫 번째는 줄이 바뀔 것이다. 두 번째는 폭을 조절해서 한 줄에 넣을 것이다.

결론부터 말하자면 flex box는 줄에 박스가 너무 많을 경우 폭을 조절해서 한 줄에 넣게 된다. 하지만 이를 원하지 않는 경우도 있을 것이다 이를 조절하는 property가 *flex-wrap*이다.

```
// style.css
.container {
    flex-wrap: wrap;
}
```

위와 같이 설정하면 컨텐츠의 폭을 유지하고 그 수가 많아지면 줄을 바꾸게 된다. 만약 줄을 바꾸고 싶지 않으면 아무런 값을 주지 않으면 된다. 왜냐하면 기본값이 `flex-wrap: nowrap`으로 지정되어 있기 때문이다. 줄 바꿈에도 reverse를 줄 수 있다. `flex-wrap: wrap-reverse`를 사용하면 줄이 바뀌긴 하지만 늘어난 컨텐츠가 위쪽줄로 가게 된다.

다음으로 줄이 바뀌게 되면 줄 사이에 간격이 있는 것을 볼 수 있다. 이 간격을 조절하는 것이 `align-content` 속성이다. 사이에 줄이 없기를 원하면 flex-start를 value로 주고, 중앙에 정렬하려면 center를 value를 주면 된다.

# flex-grow, flex-shrink

flex-grow는 빈 공간이 생겼을 때 어떻게 처리할 것인지를 다루는 property다. 기본적으로 flex-grow는 0으로 지정되어 있어서 빈 공간이 있어도 아무런 일도 발생하지 않는다. 하지만 `flex-grow: 1`이라고 지정하면 빈 공간이 생겼을 때, 그 공간을 차지하게 된다. 그런데 값을 2, 3으로 바꿔도 아무런 변화가 없다. 왜냐하면 flex-grow는 빈 공간이 생겼을 때, 이를 나누는 비율을 정하는 값이므로 여러 박스에 flex-grow가 지정되어 있어야 그 변화를 확인할 수 있다. 예를 들어서 아래와 같이 만들면 2번째 박스가 3번째 박스보다 빈 공간을 더 많이 차지 하는 것을 알 수 있다.

```
// style.css
.box:nth-child(2) {
    flex-grow: 2;
}

.box:nth-child(3) {
    flex-grow: 1;
}
```

flex-shrink는 폭을 줄여서 공간이 부족해졌을 때, 컨텐츠를 어떻게 다룰지 정하는 property다. 값이 클 수록 더 빠르게 줄어들게 된다. 예를 들어서 두 번째 박스가 `flex-shrink: 2`라면 2배로 더 빠르게 줄어들게 된다. 기본값은 1이 지정되어 있으므로 아무런 값을 주지 않는다면 다 같은 비율로 줄어들게 된다.

```
// style.css
.box:nth-child(2) {
    flex-shrink: 2;
}
.box:nth-child(3) {
    flex-shrink: 3;
}
```

위와 같이 숫자를 주면 1번째 박스는 값이 안 주어졌으므로 1이 된다. 그리고 2번째는 2배로 줄어들고, 3번째 박스는 3배로 줄어들게 된다.

# flex-basis

flex-basis는 초기 크기를 지정하는 속성이다. 만약 200px이라고 준다면, 가로로 200px인 박스를 볼 수 있다. 그렇지만 width와는 다른 속성인데, flex-basis는 flex-direction의 방향에 따라 바뀌기 때문이다. 만약 row라면 width의 역할을, column이라면 height의 역할을 한다.

# Flexbox Froggy

지금까지 배운 flexbox를 연습할 수 있는 사이트가 있다. [Flexbox Froggy](https://flexboxfroggy.com/#ko) 모르는 내용이 생기면 MDN을 참조해서 풀면 된다. 해답을 모르겠으면 인터넷을 검색하면 쉽게 찾을 수 있다.
