---
title: "Web Design"
date: "2022-04-18 20:29:11"
thumbnail: "../assets/images/react.png"
summary: "Some keyword to study about Webdesign"
categories: ["webdesign"]
---

## Color

primary colors: red blue yellow
secondary colors: primary color를 섞은 것
tertiary colors(intermediate): primary, secondary를 섞은 것

hue: dominant color
tint: 흰색을 섞은 것
shade: 검은색을 섞는 것
tone: mix pure color with gray
saturation:
brightness:
temperature:
opacity

hsb
hue, saturation, brightness

red: passion
blue: calm, tech
yellow: fun, happiness
blue <-> orange

color.adobe.com에 primary color 넣기 -> 색추천 analogous,monochromatic, complementary가 가장 많이 쓰임

mycolor.space, colorhunt.co, colors.muz.li(ui demo를 보여줌), webgradients.com, dribble.com, colorsnapper(mac에서 색추출에 쓸 수 있음, hex, rgb등 다른 형태 선택 가능),

160x160 원에 색 넣어두기, pigma는 색을 저장 가능, gradient도 만들 수 있음
gray는 텍스트에 써야하므로 필수, 검은색은 너무 강새서 안 된다. 약간 진한 회색 선택
primary색의 대칭위치에서 선택하면 좋다. opacity를 조절하는 것도 고려해볼만 하다.
100% 75% 50% 25% 10% 5%의 회색을 선택한다.

contexture color(error message에 쓰일 색, 붉은색 계열)

글자는 배경색과 대비(contrast)되어야 한다 -> contrast 앱을 사용(돈을 내야함)

## Typograph

fonts 구하는 곳: envatoelements(일반 폰트 말고 특수한 폰트, 유료), Google Fonts(일반 폰트, 무료), adobe fonts(유료)

럭셔리한 브랜드(serif 사용), san-serif(modern, trustable, tech)

typeScale 설정

brandon grotesque, proxima nova

type-scale.com(글자 크기를 설정하는 사이트, Base Size를 설정하면 크기 변화를 보여줌), archetype

글자 크기가 커지면 빈 공간이 많아지고 깔끔해보인다.

## Spacing & Sizing

margin, padding, width, height 등 모든 사이즈는 8의 배수가 되도록 설정

grid-column: 12개

grid가 복잡하면 ruler를 대신 사용

## Icon & Image

Bootstrap Icon, fontawesome, heroicons, ionicons, forge icons

## Header

stripe, adidas, Dribble, kbdfans, amazon, craiecraie, irene-studio

## Hero

Hero(Header 바로 옆이나 아래에 있는 공간, 중요한 정보를 담고 있다. e.g. brand offering, benefits): 사이트의 가장 핵심적인 내용이 있어야 한다. 이미지나 슬라이더가 있는 경우가 많지만, 사이트가 무슨 사이튼지 알 수 있도록 키워드, 아이콘, action 등이 사용되는게 좋다.

## Button

상하 margin x2 = 좌우 margin

figma plugin smoothshadow

버튼이 무슨 일을 하는지 명확히 표현할 것

default, hover, active, clicked, disabled 시에 일어날 형태를 새로 frame에 만들어주기

## Image Gallary

## Footer

navigation, copy right, links

unsplash(무료 이미지)

글자크기: 16px, 제목: 21px, 아이콘은 글자크기 16px일시 24px 추천(24px 아이콘이 16px과 크기 비슷함)

1024 이상은 데스크톱 grid: 12, gap: 20
600 이상은 태블릿 grid: 8, gap: 16 margin: 24
그 외는 모바일 grid: 4, gap: 8, margin: 16

간격 단위 4, 8, 16, 20, 40, 60

텍스트와 배경간의 명도 대비는 최소 4.5:1 이상(7:1 정도는 되어야 읽기 좋다), 24px 이상인 경우는 3:1까지 낮출 수 있다. 특히 primary color와 배경의 대비는 4.5:1 이상이어야 한다. 부가정보는 3:1이상

행간 = 글자크기 \* 1.75

primary color의 비중이 secondary보다 높아야 한다.
interaction color: 4 ~ 5단계를 두어 각각 1 ~ 2 톤씩 밝은 색 지정. 마우스 호버 등에서 사용가능

부정적인 클릭은 긍정적인 버튼보다 색의 강조가 약해야 한다. e.g.) border만 색을 준다.

모바일에서의 아이콘 최소 사이즈는 48px

아이콘의 선 두께는 최소 2px

흰색 바탕에서 활성 아이콘의 투명도는 87%, 초점이 맞지 않은 활성 아이콘은 54%, 비활성은 38% 권장,
검은 바탕에서 활성 아이콘은 100%, 초점이 맞지 않으면 70%, 비활성은 50% 권장

media query는 em으로 작성해야 폰트 사이즈, view port 사이즈 변경시에도 일관성 있게 작동한다.
