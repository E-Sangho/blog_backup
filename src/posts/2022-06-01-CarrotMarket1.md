---
title: Carrot Market
date: 2022-06-01 10:55:25
layout: series
series: Carrot Market
thumbnail: ../assets/images/nextjs.png
summary: Carrot Market Series
categories: [Next.js]
---

# Carrot Market

## Setup

`npx create-next-app@latest --typescript`로 설치
프로젝트에서 필요 없는 파일을 제거해준다.
/styles/Home.module.css와 /pages/api 폴더를 삭제한다.
그리고 /pages/index.tsx에서 반환하는 컴포넌트를 지우고 null로 만든다.

```javascript
// index.tsx
import type { NextPage } from "next";

const Home: NextPage = () => {
	return null;
};

export default Home;
```

## Tailwind CSS

프로젝트에서 CSS 스타일링을 위해서 Tailwind CSS 프레임워크를 사용한다.
Tailwind는 class로 스타일을 미리 만들어놓아서, 별도로 css를 만들 필요 없이 class만 적용하면 된다.
예를 들어서 `class="flex"`는 `display: flex`의 효과를 준다.
다시 말해서 아래처럼 스타일을 만든 것과 다름 없다.

```css
.flex {
	display: flex;
}
```

그 외에도 p-6은 padding을 적용하고, w-12는 width를 조정하는 등 Tailwind는 미리 만들어둔 스타일을 HTML에 적용한다.
이렇게 준비해둔 class로 스타일을 적용하는 것을 Utility-first CSS라고 한다.
여기서 Utility가 재활용성이란 뜻으로 사용되는 것 같으므로, 재활용성을 우선시하는 CSS라고 할 수 있다.

이 방법의 장점은 따로 CSS를 작성하지 않아도 된다는 것이다.
다시 말해 클래스명을 고안할 필요가 없고, CSS 파일이 비대해지는 것을 막는다.
특히 CSS는 global한 특성 때문에 많은 문제가 야기되는데, class는 local하므로 다른 부분에 영향을 주지 않는다.

그렇지만 이 방식이 옳은지는 의구심이 들 수 밖에 없다.
CSS가 생긴 이유 자체가 HTML과 CSS를 분리하기 위함이었다.
그런데 Tailwind를 사용하면 사실상 CSS를 inline으로 작성하는 것과 다름없다.
inline으로 CSS를 작성하는 것은 누구나 한 번정도는 생각해봤겠지만, 기본적인 CSS를 만든 이유에 위배되므로 약간 꺼림직한 것도 사실이다.

Tailwind는 inline 스타일이면서도 약간 다르다.
HTML에 직접 작성하므로 inline 스타일은 맞다.
하지만 일반적인 inline 스타일과는 다르게, 스타일을 class로 정의하고 있다.
이로 인해서 프로젝트 전체에서 일관적인 스타일 적용이 가능하다.
예를 들어서 margin은 기존 CSS에서 원하는 값으로 어떤 것이든 사용가능했다.
이로 인해 야기되는 문제는 margin의 통일성이 없다는 것이다.
일부는 8px 떨어져 있고, 또 어떤 부분은 10px 떨어져 있게 만들 수 있고, 일관성 없는 디자인은 보기 좋지 않다.
Tailwind는 정해진 class를 사용하므로 같은 class를 반복해서 사용함으로써 디자인의 통일성을 높일 수 있다.

Tailwind는 기존의 inline에서 사용할 수 없는 스타일을 사용할 수 있다.
미디어 쿼리는 inline 스타일에서 사용 불가능해서 반응형 페이지를 만들 수 없다.
하지만 Tailwind는 class로 미리 만들어둔 CSS를 적용하므로, 반응형 페이지를 쉽게 만들 수 있다.
또한 hover, focus 같은 스타일도 inline에서는 사용할 수 없지만, Tailwind에서는 사용할 수 있다.

### Tailwind CSS Setup

Tailwind CSS를 설치해서 사용해보자.
이때 PostCSS와 autoprefixer를 같이 설치해준다.

`npm i -D tailwindcss postcss autoprefixer`

잠시 PostCSS와 autoprefixer이 무엇인지 설명하겠다.
CSS 스타일 중 브라우저에 따라 접두사가 필요한 경우가 있다.
예를 들어서 -webkit-이나 -moz- 등이 있는데, 이들을 일일이 외우는 것은 어렵다.
그래서 PostCSS와 autoprefixer를 사용한다.
PostCSS는 여러 플러그인을 설치할 수 있는데, 이 플러그인의 자바스크립트로 CSS에 영향을 준다.
그 중 하나가 autoprefixer로 브라우저에 필요한 접두사를 알아서 추가해준다.

#### tailwind.config.js

위의 패키지를 설치하면 `npx tailwindcss init -p`를 실행시킨다.
그러면 postcss.config.js, tailwind.config.js 파일이 생성된다.
tailwind.config.js에 Tailwind CSS를 사용할 파일을 정해줘야 한다.
대상 파일은 content에서 적용하는데 아래처럼 적어준다.

```javascript
// tailwind.config.js
module.exprots = {
	content: [
		"./pages/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js, jsx, ts, tsx}",
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
```

위에서 \**는 모든 폴더를 의미하고, *는 모든 파일을 의미한다.
그리고 뒤의 {} 안에 있는 것은 확장자다.
위 코드의 의미는 pages 폴더 안의 모든 폴더, 모든 파일에 확장자가 js, jsx, ts, tsx인 파일에 Tailwind CSS를 사용한다는 것이다.

#### globals.css

Tailwind CSS를 사용하는 곳에선 아래와 같은 코드가 필요하다.

```javascript
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Next.js에선 globals.css에서 모든 페이지에 적용될 css를 설정할 수 있다.
그러므로 globals.css 파일에 위 코드를 추가해준다.

```javascript
// globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

이제 Tailwind CSS를 사용할 수 있다.
index.tsx 파일로 가서 코드를 아래처럼 수정해서 Tailwind를 사용해보자.

```javascript
// index.tsx
import type { NextPage } from "next";

const Home: NextPage = () => {
	return <div className="text-3xl font-bold underline">Hello</div>;
};

export default Home;
```

그리고 `npm run dev`로 코드를 실행시켜서 페이지를 확인해보면, 텍스트에 스타일이 적용된 것을 볼 수 있다.

#### CSS IntelliSense

Tailwind CSS의 클래스는 너무 다양해서 다 외우기 힘들다.
다행히도 Tailwind CSS Intellisense라는 extension을 사용하면, 자동 완성과 해당 구문이 어떤 CSS를 적용하는지 알려준다.
className에 fl을 입력하면 자동완성 기능이 사용할 수 있는 클래스를 보여준다.
그리고 입력한 클래스 위에 마우스를 올리면, 어떤 CSS가 적용된 것인지 알려준다.
추가로 flex, grid처럼 서로 충돌하는 스타일을 사용하면 밑줄로 표시해줘서 실수를 줄일 수 있다.
간혹 자동 완성 기능을 보여주지 않을 때가 있는데, 이때는 command + i를 누르면 나온다.

### Introduction

Tailwind CSS의 클래스는 너무 다양해서 모두 소개하긴 어렵다.
대신에 자주 쓰이는 것만 정리하고, 그 외의 것은 [TailWind Docs](https://tailwindcss.com/docs/installation)의 좌측의 리스트에서 찾아보자.

Tailwind는 거리와 관련된 속성은 {키워드}{방향}-{크기} 형태로 사용한다.
키워드는 p(padding), w(width), m(margin) 등으로 사용하고, 방향은 t(top), r(right), b(bottom), l(left), 그리고 크기는 숫자나 px을 사용한다.
예를 들어서 위쪽으로 padding을 주려면 pt-1 같이 적는다.
이후에 padding, margin, width 등을 볼 때 이 점을 염두해두고 보자.

사실 이 정도 지식만 가지고 몇 가지 CSS를 만들어보는 것이 가장 좋다.
아래는 최소한으로 필요한 것만 정리한 것이다.

#### display

flex는 display: flex를 의미하고, grid는 display: grid를 의미한다.
그리고 justify-content: flex-start는 justify-start로 사용된다.
그 외의 justify-content도 비슷한 룰을 따르는데, justify-content: space-between은 justify-between으로 사용된다.
grid-cols-n은 grid-template-columns: repeat(n, minmax(0, 1fr))에 대응되는 클래스다.
이때 n의 값에 따라 column의 수가 변한다.

#### padding

padding은 p로 줄 수가 있는데, 뒤에 오는 알파벳에 따라 방향이 정해진다.
예를 들어 pt는 padding-top, pb는 padding-bottom을 의미한다.
그리고 그 뒤에 - 다음에 값을 적어준다.
예를 들어서 p-0.5는 padding: 0.125rem을 의미하고, p-px은 padding: 1px을 의미한다.
p 뒤에 오는 숫자는 px을 의미하는 것이 아니라 단위를 의미한다.
실제로는 대부분 rem 단위를 사용하는데, 1당 0.25rem인 경우가 많다.
페이지의 폰트 사이즈가 16px이라면 1은 4px 정도의 차이가 나타난다.

#### margin

margin 역시 padding과 비슷한 룰을 따른다.
m 뒤에 알파벳이 방향을 정하고, - 뒤의 수가 크기를 정한다.
예를 들어 mt-1은 margin-top: 0.25rem이다.

#### width & height

width는 w를 키워드로 사용해서 w-1처럼 사용하고, height는 h-2 처럼 사용한다.
이때 min-width, max-height 등을 사용하고 싶으면 각각 min-w-1, max-h-2처럼 min, max를 앞에 붙여준다.

#### font

font-size는 text로 조절하는데 text-xs, text-sm, text-base, text-lg 처럼 뒤에 크기가 붙는다.
글꼴을 변경하려면 font 뒤에 글꼴을 붙이는데 font-sans는 sans-serif 글꼴을 사용한다.
font-weihgt은 font-bold, font-normal, font-light 등으로 사용한다.
그리고 색은 text-{color} 형태로 사용한다.

#### Border Radius

border-radius는 rounded-{size} 형태로 사용한다.
예를 들어 rounded-md는 border-radius: 0.375rem이다.

#### Box Shadow

box-shadow는 shadow-{size}로 사용한다.

#### Background Color

배경색은 bg-{color}로 사용하는데 bg-black 등으로 사용하며, bg-gray-300, bg-gray-500 처럼 색의 진함을 바꿀 수 있다.

modifier

hover, active, focus, ring utility, group, peer modifier
details, summary 태그
selection, select-none
file modifier

responsive
Tailwind의 스타일은 모바일부터 적용된다.

@media (prefers-color-scheme: dark)
darkMode: "media" or "class"
dark를 부모에 추가(html이나 body 같은 최상층에 추가)

Just in Time Compiler

## References

1. [Tailwind](https://tailwindcss.com/)
2. [Tailwind with Next.js](https://tailwindcss.com/docs/guides/nextjs)
