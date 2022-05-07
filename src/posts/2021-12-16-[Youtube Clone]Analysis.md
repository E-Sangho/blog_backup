---
layout: post
title: [Yotube Clone] Analysis 
date: 2021-12-16 12:54:20
categories:
tag:
toc: true
---

## 1. header

### svg

이미지 파일의 대표적인 확장자는 JPG, PNG, GIF 등이 있다.
그런데 이 이미지들은 크기가 맞지 않으면 깨져 보이는 현상이 발생한다.
그렇기 때문에 SVG(Scalable Vector Graphics)라는 새로운 이미지를 표현하는 방법을 소개하겠다.

SVG는 2차원 벡터 그래픽의 표현을 위한 XML 마크업 언어다.
기존의 이미지 파일은 픽셀 단위로 이미지를 표현하기 때문에, 크기가 정해져있고 이미지가 클 수록 파일이 커진다.
반면 SVG는 수학적으로 이미지를 그리는 방식이므로, 이미지를 확대하거나 축소해도 깨지지 않고 용량이 작은 특성이 있다.
여기까지만 보면 모든 이미지를 SVG로 대체하는 것이 좋아 보이지만, SVG도 단점이 있다.
표현해야 하는 이미지가 복잡하면 계산이 오래 걸려서 로딩이 오래 걸리게 된다.
그렇기 때문에 SVG는 아이콘, 로고 같은 아주 간단한 이미지를 그리는데 적합하다.

유튜브도 간단한 이미지는 SVG로 대체하고 있다.

function LFa(a,b) {
a=a.\_methodHost || a;
return function(c) {
if(a[b])
a[b](c,c.detail);
else
console.warn("listener method `"+b+"` not defined")
}
}

<div id="container" class="style-scope ytd-masthead">
    <div id="start" class="style-scope ytd-masthead">
        <yt-icon-button id="guide-button" class="style-scope ytd-masthead">
            <button id="button" class="style-scope yt-icon-button">
                <yt-icon id="guide-icon" icon="yt-icons:menu" class="style-scope ytd-masthead">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z" class="style-scope yt-icon"></path></g></svg>
                </yt-icon>
            </button>
            <yt-interaction id="interaction" calss="circular style-scipe yt-icon-button">
                <div class="stroke style-scope yt-interaction"></div>
                <div class="fill style-scope yt-interaction"></div>
            </yt-interaction>
        <yt-icon-button>
        <ytd-topbar-logo-renderer id="logo" use-yoodle="" class="style-scope ytd-masthead" is-red-logo>
            <a class="yt-simple-endpoint style-scope ytd-topbar-logo-renderer" id="logo" href="/">
                <>
            </a>
    </div>
    <div id="center" class="style-scope ytd-masthead">
    </div>
    <div id="end" class="style-scope ytd-masthead">
    </div>

</div>

## 2. guide
