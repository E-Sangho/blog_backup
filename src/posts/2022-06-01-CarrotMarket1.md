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

#### Tailwind CSS IntelliSense

Tailwind CSS의 클래스는 너무 다양해서 다 외우기 힘들다.
다행히도 Tailwind CSS Intellisense라는 extension을 사용하면, 자동 완성과 해당 구문이 어떤 CSS를 적용하는지 알려준다.
className에 fl을 입력하면 자동완성 기능이 사용할 수 있는 클래스를 보여준다.
그리고 입력한 클래스 위에 마우스를 올리면, 어떤 CSS가 적용된 것인지 알려준다.
추가로 flex, grid처럼 서로 충돌하는 스타일을 사용하면 밑줄로 표시해줘서 실수를 줄일 수 있다.
간혹 자동 완성 기능을 보여주지 않을 때가 있는데, 이때는 command + i를 누르면 나온다.

### Introduction

Tailwind CSS의 클래스는 너무 다양해서 모두 소개하긴 어렵다.
그래서 일일이 소개하는 대신에 큰 그림만 설명해보겠다.
세부적인 것은 [TailWind Docs](https://tailwindcss.com/docs/installation)의 좌측의 리스트에서 찾아보자.

개인적으로 CSS는 위치, 거리, 내부 스타일, 선택자 4가지를 아는 것이 중요하다고 생각한다.
그러므로 Tailwind에서 위 4가지를 사용하는 법을 알아보겠다.

#### Layout

CSS에서 박스의 위치나 규칙을 정하는 속성을 알아보자.
예를 들어서 display: flex, box-sizing: border-box 같은 것을 말한다.
이들은 보통 속성값을 그대로 사용하거나, 속성과 속성값의 이름을 섞어서 사용한다.
위의 display: flex는 flex로 사용하고, box-sizing: border-box는 box-border로 사용한다.
그 외에도 overflow: hidden는 overflow-hidden으로 사용되는데, 이처럼 이름 둘을 이은 경우도 있다.
대체로 속성값만으로 명확한 경우는 속성값을 사용하고, 모호한 경우는 둘을 섞어서 사용한다.
그렇지만 대부분의 경우는 위의 overflow-hidden 처럼 단순하게 -로 연결한 경우가 많다.

flex와 grid는 흔히 쓰는 만큼 조금 더 자세히 설명해보겠다.
flex는 display: flex를 의미하고, grid는 display: grid를 의미한다.
그리고 justify-content: flex-start는 justify-start로 사용된다.
그 외의 justify-content도 비슷한 룰을 따르는데, justify-content: space-between은 justify-between으로 사용된다.
grid-cols-n은 grid-template-columns: repeat(n, minmax(0, 1fr))에 대응되는 클래스다.
이때 n의 값에 따라 column의 수가 변한다.

#### Spacing & Sizing

이번에는 margin, padding과 같은 spacing과, width, height 같은 sizing을 알아보겠다.
margin, padding 같은 빈 공간은 방향과 크기가 존재한다.
그래서 Tailwind는 이들을 {키워드}{방향}-{크기} 형태로 사용한다.
키워드는 p(padding), w(width), m(margin) 등이다.
방향은 t(top), r(right), b(bottom), l(left), x(가로), y(세로)를 쓴다.
마지막으로 크기는 숫자나 px을 사용한다.
예를 들어서 위쪽으로 padding을 주려면 pt-1 같이 적는다.
pt-1은 padding-top: 0.25rem을 사용한 것과 동일한 효과를 준다.
여기서 크기 값 1은 대부분 0.25rem으로, 픽셀 단위가 아닌 것에 주의하자.
별도로 설정하지 않으면 폰트 사이즈가 16px이므로, 1은 4px 정도의 차이가 난다.

다음으로 width나 height은 키워드로 w, h를 사용한다.
이들은 방향이 없으므로 따로 방향을 구분하진 않는다.
그러므로 w-1, h-3처럼 사용해서 width, height의 값을 정해준다.

#### Styles

박스의 내부 스타일을 정하는 것은 {키워드}-{스케일}로 사용한다.
예를 들어 글자와 관련된 것은 text 키워드를 사용한다.
그 뒤에 xs, sm, base, lg 등으로 얼마나 크고 작은지를 정하는데, 예를 들어 text-xs처럼 사용한다.
또한 색을 정할 때 text-{color}-{scale}로 사용하는데, 색의 정도에 따라 text-red-100, text-red-300처럼 다양한 색을 지정할 수 있다.
글꼴과 관련된 키워드는 font로 뒤에 오는 것에 따라 글꼴을 정하거나, 굵기를 정하는데 사용한다.
예를 들어 font-sans는 sans-serif 폰트를 사용하게 하고, font-bold는 폰트를 볼드체로 바꾼다.

그 외에도 border-radius는 rounded, box-shadow는 shadow, background-color는 bg를 키워드로 사용한다.
이들 키워드가 너무 다양해서 이 모든 것을 기억하긴 어려울 것이다.
하지만 대부분 키워드를 보면 어떤 스타일을 적용하려는지 알긴 쉽다.
그러므로 Tailwind CSS IntelliSense의 자동 완성 기능을 적극적으로 사용하자.

#### Modifier

Tailwind에서 가장 중요한 기능이 바로 Modifier다.
Modifier는 클래스 앞에 붙는 접두사로, 특정 조건에서만 뒤의 스타일을 실행시킨다.
예를 들어서 bg-sky-700을 hover 시에만 적용시키고 싶으면, hover:bg-sky-700이라고 적어주면 된다.
대표적으로 hover, focus, first-child, required 등이 있다.

group도 상당히 유용한 것중 하나다.
group은 부모를 기반으로 자식의 스타일을 수정해야 하는 경우 유용하게 쓰인다.
예를 들어 부모가 hover이거나, focus 상태인 경우 적용할 스타일을 만들 수 있고, 그 외에도 짝수 번째, 홀수 번째 대상의 스타일을 적용하는데도 사용된다.
group을 사용하려면 부모 클래스에 group을 적어주고, 자식은 group-hover:{스타일} 형태로 적어주면 된다.
예를 들어 group-odd:bg-black은 홀수 번째 자식의 배경색을 검은색으로 만든다.

sibling(형제자매)의 상태에 따라 스타일을 조정해야 하는 경우 peer를 사용한다.
peer 역시 peer 클래스를 가진 대상을 기준으로, 다른 대상의 스타일을 바꾼다.
예를 들어 peer-invalid:visible이란 속성은, peer로 지정한 대상이 invalid인 경우만 보이게 된다.
이를 사용하면 input이 invalid일때, 쉽게 에러 문장을 보여줄 수 있다.

반응형 웹페이지를 만들 때 미디어 쿼리를 사용한다.
Tailwind는 이들을 접두사 sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px)을 사용해서 조절한다.
이들은 화면 사이즈가 접두사보다 큰 경우에만 스타일이 적용된다.
예를 들어서 md:w-32는 화면 사이즈가 768px 이상인 경우에만 w-32가 적용된다.

Tailwind로 만드는 반응형 페이지의 특징은 작은 기준부터 적용된다는 것이다.
다시 말해 모바일 페이지의 스타일부터 적용하고, 데스크탑으로 확장시킨다.
예를 들어서 class="bg-black lg-white"를 적용시켰다고 하자.
일반적인 CSS는 큰 것에서 작은 것으로 만든다.
그러므로 데스크탑에서는 검은 화면이다가, 크기가 1024px 이하가 되면 흰색이 될 것이다.
Tailwind는 이와 반대로 작용한다.
1024px보다 작은 경우엔 검은 배경이, 1024px 이상인 경우는 흰색 배경이 적용된다.

마지막으로 다크모드를 설명하겠다.
다크모드에서 적용할 스타일은 앞에 dark:를 붙이기만 하면 된다.
다만 주의할점은 dark:가 @media (prefers-color-scheme: dark)로 적용된다는 것이다.
쉽게 말해서 운영체제의 다크모드 여부를 가지고 스타일 적용을 한다는 것이다.
이를 일반적인 버튼을 눌러서 적용하는 방법으로 바꾸고 싶다면, tailwind.config.js로 가서 아래처럼 수정해줘야 한다.

```javascript
// tailwind.config.js
module.exports = {
	darkMode: "class",
	// ...
};
```

이렇게 하면 태그에 dark가 들어 있는 경우만 dark:{style}로 만든 스타일이 적용된다.
이때 dark는 하위 태그에 모두 일괄적으로 적용된다.
그러므로 dark를 html이나 body 같은 최상층에 추가하고 빼는 것이 편한다.

그 외의 좀 더 자세한 내용은 Tailwind의 [Hover, Focus, and Other States](https://tailwindcss.com/docs/hover-focus-and-other-states)에 잘 정리되어 있다.
Core Concepts의 다른 글들도 굉장히 중요한 내용이므로 가급적 읽어보는 것을 추천한다.

### Just in Time Engine

과거 Tailwind는 모든 클래스를 담은 거대한 CSS 덩어리였는데, 그대로 배포한다면 쓰지 않는 CSS까지 포함되는 낭비가 생기게 된다.
이 때문에 배포 단계에서 사용하지 않는 스타일을 제거하는 작업이 필요했었다.
또한 아무리 많은 클래스를 담고 있더라도, 직접 스타일을 만들 수 없으므로 선택의 제한이 생긴다는 문제점이 있었다.

그런데 Tailwind가 3.0버전으로 업그레이드 하면서 Just in Time 엔진으로 바꿨다.
이로 인해 생긴 차이점이 있다.
우선 각 스타일을 미리 만들어두지 않게 되었다.
JIT 엔진은 적용된 클래스를 보고 필요한 CSS만 만든다.
실제로 Tailwind를 사용한 프로젝트를 브라우저에서 열어보면 이를 확인할 수 있다.
Tailwind를 사용하는 빈 프로젝트를 브라우저에서 열어보자.
그리고 Elements에서 head -> style을 열어보면 reset CSS만 존재하고, 별도의 CSS가 없는 것을 볼 수 있다.
여기다가 Tailwind를 적용한 컴포넌트를 하나 추가해보면, 새로운 CSS가 생기는 것을 볼 수 있다.
이로 인해 CSS 클래스 덩어리를 유지할 필요가 없어지고, 빌드 단계에서 필요없는 클래스를 지우는 작업이 없어져 더 빠르게 작업이 가능해졌다.

또한 JIT 엔진의 도입으로 커스텀 클래스를 만들 수 있게 되었다.
예를 들어서 margin-top: 11px을 주고 싶다고 하자.
기존에는 해당 클래스가 Tailwind에 없으므로 사용할 수 없었다.
하지만 지금은 JIT 엔진이 즉각적으로 CSS 클래스를 만들어주고 있으므로, 규칙에 따라 만들면 새로운 클래스를 만들 수 있게 되었다.
규칙은 간단한데, 새로 만들고 싶은 스케일에 []를 추가해주면 된다.
예를 들어서 텍스트 크기를 23px을 만들고 싶으면 text-[23px]로 적어주면 된다.

JIT 엔진을 도입함으로 인해 Tailwind는 기존의 약점으로 지적되던 점을 크게 개선했다.
기존의 커다란 CSS 덩어리를 없앨 수 있었고, 새로운 클래스를 만들어서 자유도를 높였다.

## Prisma

### Why Prisma?

애플리케이션 개발에서 관계형 데이터베이스(relational databases)로 작업하는 것은 많은 문제를 야기한다.
기본적으로 데이터가 테이블 형태이기 때문에, 객체 정보를 불러오려면 많은 쿼리를 작성해야 한다.
이는 스키마가 커질 수록 더 복잡해져서, 프로그램이 확장될 수록 더 많은 시간이 필요해진다.

또한 SQL은 데이터베이스 제어능력은 뛰어나지만, 생산성이 크게 떨어진다.
SQL 작성이 상당히 복잡하고 많은데다가, 스키마나 쿼리를 변경할 때마다 조정이 필요하다.
게다가 쿼리 결과물의 type-safety가 보장되지 않는다는 문제도 있다.

이런 생각을 바탕으로 나온 것이 ORM(Object Relational Model)이다.
ORM은 객체로 모델을 정의해서 데이터베이스에 연결해준다.
그런데 객체는 클래스인데 반해 데이터베이스는 테이블 형태로 모델이 다르다.
이를 ORM을 통해 자동으로 해결해주는데, 객체 스키마로 SQL을 자동으로 생성해준다.
ORM은 객체를 사용하므로 좀 더 직관적이고, 개발자가 사용하기 편하다.

프리즈마는 ORM에서 약간 더 개선한 것으로 특히 GraphQL과 같이 사용하기 좋다.

### What is Prisma?

프리즈마는 차세대 ORM으로 SQL을 사용하지 않고도 데이터베이스를 쓸 수 있게 해주는 도구다.
아래 3가지는 프리즈마의 주 기능이다.

-   Prisma Client: Node.js & TypeScript용 type-safe 쿼리를 자동으로 만들어준다. 그러므로 Node.js나 TypeScript로 만들어진 백엔드 어플리케이션에 사용할 수 있다.(e.g. REST API, GraphQL API)
-   Prisma Migrate: 데이터를 SQL 데이터베이스에서 쓸 수 있게 바꿔준다.
-   Prisma Studio: 데이터베이스의 데이터를 시각적으로 보여주고 편집할 수 있게 해준다.

### Setup

VSCode에서 Prisma Extension을 설치하기 위해 Prisma를 검색하고 설치해준다.
프리즈마 익스텐션을 설치하면 코드 하이라이팅, 포맷팅, 자동 완성 등의 기능이 추가된다.
이제 프리즈마를 설치하기 위해 `npm i prisma -D`를 입력한다.
그리고 `npx prisma init`을 실행하면, prisma 폴더와 .env 파일 생성을 생성한다.
추가적으로 프리즈마 파일을 저장할 때 정렬하기 위해 VSCode setting에 아래 코드를 추가해준다.
VSCode setting은 ⌘ + ,를 누르면 열 수 있다.
setting에서 파일 수정은 우측 상단의 Open Settings 아이콘을 누르면 된다.

```javascript
	...,
	"[prisma]": {
		"editor.defaultFormatter": "Prisma.prisma"
	}
```

### Overview

이제 우리가 해야할 일은 아래 3가지다.

1. .env에 데이터베이스 URL을 적어주기
2. schema.prisma에 provider를 바꿔주기(mysql)
3. model 만들기

1번은 이후에 PlanetScale에서 할 예정이므로 넘어간다.
2, 3번은 prisma 폴더의 schema.prisma 파일에서 만들어야 한다.
코드를 작성하기 전에 schema.prisma 파일이 하는 일을 잠시 설명하겠다.
schema.prisma 파일은 3가지 일을 한다.

-   datasource: 데이터베이스와 연결을 정의한다.
-   generator: 프리즈마 클라이언트를 만든다.
-   model: 어플리케이션의 모델을 정의한다.

#### Data Sources

데이터 소스는 프리즈마가 데이터베이스에 어떻게 연결할지를 결정한다.
이때 코드는 schema.prisma 안에서 datasource API 블록에 작성한다.
아래는 하나의 예시다.

```javascript
datasource db {
	provider = "postgresql"
	url      = "postgresql://johndoe:mypassword@localhost:5432/mydb?schema=public"
}
```

위 코드를 provider과 url이 있다.
provider는 어떤 데이터를 사용하는지 정한다.
예를 들어서 MongoDB를 사용한다면 mongodb를 써야하고, MySQL을 쓴다면 mysql을 써줘야 한다.
url은 데이터베이스의 주소를 적어줘야 한다.
이때 데이터베이스 주소가 공개되면 안 되므로, .env파일에 적어줘서 사용하는 것이 좋다.
우리는 .env 파일에 DATABASE_URL로 데이터베이스 주소를 적어줄 예정이므로 이를 사용해준다.

```javascript
// schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

#### Generators

프리즈마 클라이언트는 DB를 수정할 수 있는 도구로 `prisma generate` 명령으로 생성된다.
기본적으로 사용하는 언어는 자바스크립트고, node_modules/.prisma/client 위치에 생성된다.

generator는 프리즈마 클라이언트의 설정을 담당하며, provider로 사용하는 언어를 선택하고, output으로 생성 위치를 정한다.
그런데 현재 프리즈마는 자바스크립트만 사용할 수 있고, 파일 저장위치를 굳이 바꿀 필요는 없다.
그러므로 무조건 아래처럼 적어주면 된다.

```javascript
generator client {
  provider = "prisma-client-js"
  output   = "./generated/prisma-client-js"
}
```

#### Model

모델은 데이터의 스키마를 정한다.
아래는 모델의 예시다.

```javascript
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  role    Role     @default(USER)
  posts   Post[]
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  user   User   @relation(fields: [userId], references: [id])
  userId Int
}

model Post {
  id         Int        @id @default(autoincrement())
  createdAt  DateTime   @default(now())
  title      String
  published  Boolean    @default(false)
  author     User       @relation(fields: [authorId], references: [id])
  authorId   Int
  categories Category[] @relation(references: [id])
}
```

위를 보면 모델을 어떻게 만드는지 대충 유추가 될 것이다.
model 뒤에 모델의 이름을 적고 {} 안에 fields를 작성한다.
fields에는 각 줄에 field를 작성하는데, field의 이름과 타입을 작성한다.
그 외에도 뒤에 부가적인 부분이 있는데 이를 attributes라고 한다.
아래는 모델의 작성법이다.

```javascript
model {ModalName} {
	fieldName fieldType typeModifiers attributes
}
```

fieldName에는 원하는 이름을 적어주면 된다.
이때 각 모델은 반드시 id라는 필드를 포함해야 하는데, id는 조금 있다가 자세히 설명하겠다.

fieldName 뒤에는는 fieldType을 적어줘야 한다.
타입은 Int, String, Boolean, DateTime 등이 사용되며, 다른 모델을 사용할 수도 있다.
위의 예시에서도 User의 profile은 Profile 타입인데, 이는 다른 Profile 모델의 데이터 스키마를 사용하는 것을 의미한다.

fieldType 뒤에는 부가적인 타입 변환 기능이 있다.
이를 Type Modifiers라고 하며 []를 붙이면 해당 타입의 배열을 의미하고, ?는 optional 한 것을 의미한다.
위 예시에서 User의 posts는 Post[]타입이므로 Post 타입 데이터의 배열이고, profile은 ?가 붙어 optional한 것을 볼 수 있다.

마지막으로 attributes에는 @id, @default, @unique 등을 설정할 수 있다.
attributes는 해당 field를 특수하게 다루는 속성으로 id로 설정, 초기값 정하기, 유일성을 정할 수 있다.
각 데이터는 서로를 구분하기 위해서 id를 사용해야 한다.
당연히 id는 유일해야 하며 서로 구분하기 위한 특수한 값인만큼 이를 @id를 사용해 표시한다.
@unique는 해당 field가 유일해야 함을 의미한다.
다시 말해 데이터를 추가할 때, 해당 값이 중복되어서는 안 되는 데이터를 지정할 때 사용한다.
예를 들어 email은 중복되어선 안 되므로 @unique를 붙여줘야 한다.

@default는 해당값의 초기값을 정해주는데 사용한다.
예를 들어서 초기값을 false로 지정하고 싶으면 @default(false)라고 적어준다.
이때 초기값으로 함수를 사용할 수 있는데, 이를 사용하면 좀 더 유연하게 초기값을 정할 수 있다.
예를 들어서 id를 지금까지 존재하는 데이터 수 + 1로 정하려면 @default(autoincrement())를 사용하고, 시간을 현재 시간으로 정하고 싶으면 @default(now())를 사용한다.

우리 파일에서는 사용자 정보를 아래처럼 정의했다.

```javascript
// schema.prisma
model User {
	id Int @id @default(autoincrement())
	phone Int? @unique
	email String? @unique
	name String
	avatar String?
	createdAt DateTime @default(now())
	updatedAt DateTime @updatedAt
}
```

중요한 것만 설명하자면, id는 @id를 붙여서 id를 사용한다는 것을 표시하고 그 뒤에 @default(autoincrement())를 사용해서, 자동으로 증가하는 순서로 생성되도록 하였다.
phone, email, avatar는 필수적이지 않은 정보라 ?를 붙여 optional로 정했다.
그리고 createdAt은 @default(now())를 써서 현재 시간을 적어줬다.
마지막으로 updatedAt에 @updatedAt을 사용했는데, 이는 attributes의 일종으로 업데이트 시간이다.
비슷한 것으로 @createdAt이 있다.

## PlanetScale

### Overview

PlanetScale은 MySQL과 호환되는 serverless database다.
여기서 serverless라는 것은 서버를 관리할 필요 없이 사용할 수 있다는 뜻이다.
서버리스가 다른 서버와 다른 점은 트래픽에 따라 알아서 대역폭을 늘리고 줄여준다는 점이다.
만약 서버를 1000명 분의 서비스를 사용했다면, 이용자수와 상관없이 1000명분의 금액을 내야한다.
하지만 서버리스에서는 동적으로 자원을 할당한다.
그래서 사용자 수가 적으면 자원을 할당하지 않고, 사용자 수가 많으면 자원을 할당해서 효율적으로 사용한다.
그리고 실제 사용한 자원의 비용만 청구되므로 저렴하다.
그 외에도 보안, 업데이트 측면을 신경쓰지 않고 어플리케이션 제작에만 신경쓸 수 있다.

이름이 서버리스여서 서버가 필요 없다고 생각할 순 있지만, 서버가 필요없다는 것은 아니다.
서버의 데이터베이스를 클라우드 시스템으로 사용한다는 것일 뿐, 나머지 소프트웨어적인 부분은 작성해야 한다.
추후에 서버는 Next.js의 API를 사용해 만들겠다.

Planet Scale은 한달에 10GB, 1억 번의 읽기, 천만 번의 쓰기, 1000명의 동시 지원이 무료 서비스로 제공된다.
이 정도면 우리 프로젝트에 차고 넘치므로 비용없이 만들 수 있다.
또한 Planet Scale은 branch 기능이 있는데, 이는 깃허브의 branch와 비슷하다.
branch로 데이터를 관리하다가 배포할 정도가 되면 이를 다른 브랜치와 합칠 수 있다.

### Setup

[Planet Scale](https://planetscale.com/)에 접속해서 Sign in을 누른다.
회원가입을 하거나 깃허브 아이디로 로그인 한다.
로그인 하면 화면이 나오는데, 우리는 CLI를 사용할 예정이므로 CLI를 설치해줘야 한다.
[Planet Scale CLI Installation](https://github.com/planetscale/cli#installation)에서 자신의 버전에 맞는 cli를 설치한다.
맥 유저는 `brew install planetscale/tap/pscale`와 `brew install mysql-client`를 설치해주면 된다.
그리고 VSCode의 터미널에서 pscale을 입력했을 때, pscale cli 설명이 나오면 제대로 설치된 것이다.

이제 로그인을 해줘야 하므로 `pscale auth login`을 입력한다.
그러면 새 창이 뜨면서 Device confirmation이라는 창과, 문자열이 나온다.
해당 문자열이 터미널의 user_code와 동일한지 확인하고 Confirm code를 누르면 로그인 된다.

이제 데이터베이스를 만들어 보겠다.
데이터베이스를 만들 때, 가까운 지역의 데이터베이스를 사용하는 것이 좋다.
로그인 후에 `pscale region list`를 입력하면 pscale의 지역 정보가 나온다.
이 글을 쓰는 현재 아래 9개의 지역이 있다.

```
  NAME (9)                            SLUG                 ENABLED
 ----------------------------------- -------------------- ---------
  AWS us-east-1 (Northern Virginia)   us-east              Yes
  AWS us-west-2 (Oregon)              us-west              Yes
  AWS eu-west-1 (Dublin)              eu-west              Yes
  AWS ap-south-1 (Mumbai)             ap-south             Yes
  AWS ap-southeast-1 (Singapore)      ap-southeast         Yes
  AWS ap-northeast-1 (Tokyo)          ap-northeast         Yes
  AWS eu-central-1 (Frankfurt)        eu-central           Yes
  AWS ap-southeast-2 (Sydney)         aws-ap-southeast-2   Yes
  AWS sa-east-1 (Sao Paulo)           aws-sa-east-1        Yes
```

우리는 동북 아시아에 있으므로 도쿄의 데이터베이스를 사용하면 된다.
ap-northeast가 동경 서버의 이름이므로 이를 사용하겠다.
pscale database create {데이터베이스 이름} 으로 데이터 베이스를 만들 수 있다.
이때 뒤에 --region ap-northeast을 적어주면, 도쿄의 데이터베이스를 쓸 수 있다.
`pscale database create carrot-market --region ap-northeast`로 데이터베이스를 만들고, 출력되는 주소로 접속해보면 데이터베이스가 만들어진 것을 볼 수 있다.

사실 이는 플래닛 스케일 페이지에서 New database 버튼으로도 만들 수 있다.
그렇지만 CLI로 작업하는 것이 일일이 접속하는 것보다 편하므로, CLI로 작업하도록 하겠다.

이제 .ent 파일에 url을 적어줘야 한다.
대부분의 회사에선 데이터베이스와 연결하기 위해 Secret Key를 사용한다.
그리고 Secret Key를 .env 파일에 적어줘야 한다.
만약 해당 키가 공개되거나, 다른 사람이 컴퓨터를 들여다보면 위험하다.
그러므로 사람들은 작업용 데이터베이스를 따로 준비해서 코드를 만든다.
그리고 배포시에만 데이터베이스를 사용한다.

플래닛 스케일은 암호를 사용하지 않고 CLI의 기능을 사용한다.
CLI로 로그인 했기 때문에 보안적 측면은 플래닛 스케일 회사에 맡기고 데이터베이스를 사용할 수 있다.
`pscale`을 입력하면 connet라는 명령어가 있다.
`pscale connect carrot-market`을 입력하면 데이터베이스와 연결된다.
그러면 터미널에 주소가 나오는데, 이 주소를 사용해서 연결한다.
해당 주소의 앞에 mysql://을 붙이고, 뒤에 데이터베이스의 이름을 추가하면 된다.

```javascript
// .env
DATABASE_URL = "mysql://127.0.0.1.3306/carrot-market";
```

이제 필요한 준비는 끝냈다.
다음부터는 프리즈마를 사용해서 데이터베이스에 연결해보겠다.

### Foreign Key

잠시 MySQL을 설명해야 한다.
MySQL은 데이터를 테이블 형태로 저장한다.
그리고 데이터 사이의 연결이 필요할 때 Foreign Key를 사용한다.
예를 들어서 Post에서 User 정보가 들어간다고 하자.
이때 User 정보는 User id를 사용한다.
이는 테이블 형태를 유지하기 위해선 하나의 정보 밖에 들어갈 수 없고, id만 알아도 해당 데이터를 찾을 수 있기 때문이다.
이처럼 다른 테이블의 정보를 찾을 수 있는 것을 Foreign Key라고 한다.
MySQL에선 Foreign Key가 유효한지 확인한다.
쉽게 말해서 해당 id가 가리키는 정보가 실제로 존재하는지 확인한다.
그러므로 존재하지 않는 데이터의 id를 Foreign Key로 사용할 수 없다.

플래닛 스케일은 Vitess를 기반으로 하는데, Vitess는 MySQL과 호환되지만 MySQL을 사용하진 않는다.
둘의 차이점 중 하나가 플래닛 스케일은 Foreign Key를 제한하지 않는다는 것이다.
플래닛 스케일은 데이터베이스를 여러 곳에 나눠서 저장하는데 특화되어 있다.
그런데 Foreign Key는 같은 데이터베이스에서 검색해서 확인하기 때문에, 플래닛 스케일에서 이를 제한하기 어렵다.
그래서 플래닛 스케일은 정보가 없더라도 Foreign Key를 만들 수 있다.

이로 인해 발생하는 문제는 존재하지 않는 데이터로 Foreign Key가 생성될 수 있다는 것이다.
보통은 Foreign Key를 제한하는 것은 데이터베이스에 맡기지만, 플래닛 스케일에선 불가능하다.
그러므로 프로그래머가 이를 직접 제한하도록 만들어야 하는데, 프리즈마에서 해당 기능을 제공한다.
schema.prisma 파일에 아래처럼 코드 2줄을 추가하면 된다.

```javascript
// schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["referentialIntegrity"]
}

datasource db {
  provider             = "mysql"
  url                  = env("DATABASE_URL")
  referentialIntegrity = "prisma"
}
```

schema.prism 파일에 모델을 만들었었다.
모델을 만든 이유는 2가지가 있다.
첫 번째로 model을 데이터베이스에 추가하고, SQL 변환을 자동으로 처리하기 위함이다.
두 번째로 클라이언트를 만들어서 데이터베이스와 소통하고, 해당 클라이언트에 자동완성 기능을 추가하기 위해서다.

우선 스키마를 플래닛 스케일에 추가해보자.
이 일을 하기 전에 반드시 플래닛 스케일과 연결되어 있어야 한다는 것을 기억하자.
`npx prisma db push`를 입력한다.
플래닛 스케일에서 Branches를 눌러보면 main에서 Schema에, 우리가 만든 스키마의 SQL 버전이 나온다.

## Prisma Client

`npx prisma studio`를 입력하면 데이터베이스 관리 페이지가 나온다.
여기서 어떤 모델을 사용할지 정할 수 있는데 User를 사용해보자.
모델을 보면 Int는 #, String은 A, optional은 ?로 표현된 것을 볼 수 있다.
이 페이지에서 Add record를 누르면 데이터를 추가할 수 있다.
데이터를 하나 추가하고 Save change를 누르면 데이터가 추가된다.

다음으로 프리즈마 클라이언트를 사용해보자.
`npm i @prisma/client`로 프리즈마 클라이언트를 설치한다.
libs폴더를 만들고 그 안에 client.ts 파일을 만든다.
그 후 아래처럼 적어준다.

```javascript
// client.ts
import { PrismaClient } from "@prisma/client";

export default new PrismaClient();
```

이제 위 파일의 PrismaClient를 다른 파일에서 불러와서, 프리즈마 클라이언트를 사용할 수 있다.
프리즈마 클라이언트는 `npx prisma generate` 명령어를 사용하면 생성된다.
우리는 그 이전에 `npx prisma db push`를 입력했을 때, 자동으로 생성되므로 따로 입력할 필요는 없다.
프리즈마 클라이언트는 node_modules/@prisma/client에 만들어져 있다.
여기서 index.d.ts를 보면 우리가 만든 모델의 타입이 정의되어 있다.
프리즈마 클라이언트는 이를 사용해서 데이터의 타입을 검사하고, 타입이 맞지 않으면 에러를 표시한다.

다시 client.ts로 돌아가서 클라이언트를 사용하기 위해 코드를 아래처럼 수정했다.

```javascript
// client.ts
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

client.user.create({
	data: {
		email: "Email@gmail.com",
		name: "Your name",
	},
});
```

위 코드는 Users 모델에 따라서 데이터를 생성한다.
이때 필수적인 데이터인 name만 적어주면, id, createdAt 등은 자동으로 생성된다.

그런데 PrismaClient를 모든 파일에서 쓸 수 있으면 문제가 된다.
프론트엔드에서 PrismaClient를 불러올 수 있으면, 클라이언트에서 서버를 거치지 않고 데이터베이스를 수정할 수 있게 되기 때문이다.
하지만 PrismaClient를 pages의 파일에서 불러서 사용하면 쓸 수 없다.
PrismaClient는 프론트엔드에서 사용할 수 없도록 막혀 있기 때문이다.
PrismaClient를 index.tsx 파일에서 불러온 다음, 브라우저에서 열어보면 에러가 나온다.
이처럼 프리즈마가 PrismaClient를 브라우저에서 쓸 수 없도록 막기 때문에, 브라우저에서 데이터베이스가 변경될 걱정없이 PrismaClient를 사용할 수 있다.

이제 PrismaClient를 서버에서 사용해보겠다.
Next.js는 API를 만들기 위해 별도로 파일을 만들 필요가 없다.
Next.js는 pages/api 폴더에 작성된 내용을 서버로 사용한다.
api 폴더에 client-test.tsx 파일을 만들자.
여기서 export default로 반환되는 함수를 서버에서 사용한다.
이때 해당 함수에서는 req, res를 사용할 수 있는데, 둘의 역할은 Express에서 했던 것과 동일하다.
두 변수를 누르면 어떤 메소드를 사용할 수 있는지 볼 수 있다.
타입스크립트를 사용하면 req, res에 NextApiRequest, NextApiResopnse 타입을 추가해줘야 한다.
아래는 API를 사용해서 간단한 json 데이터를 반환한다.

```javascript
// client-test.tsx
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	res.json({
		ok: true,
		data: "xx",
	});
}
```

API 생성 주소는 /api/{파일이름}으로 결정된다.
위 API를 확인하려면 localhost:3000/api/client-test로 들어가면 된다.

다시 client.ts 파일로 돌아가서 아래처럼 파일을 수정하자.

```javascript
// client.ts
import { PrismaClient } from "@prisma/client";

export default new PrismaClient();
```

그리고 이를 client-test.tsx 파일에서 불러와서 사용할 수 있다.
PrismaClient를 API와 같이 사용하면, 데이터를 만드는 부분을 구현할 수 있다.
이때 PrismaClient는 비동기 함수이므로 async를 function 앞에 추가해주고, await을 PrismaClient 앞에 적어줬다.

```javascript
// client-test.tsx
import { NextApiRequest, NextApiResponse } from "next";
import PrismaClient from "../../libs/client";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	await PrismaClient.user.create({
		data: {
			email: "Email@gmail.com",
			name: "Your name",
		},
	});
	res.json({
		ok: true,
		data: "xx",
	});
}
```

이제 "http://localhost:3000/api/client-test"에 접속하면 json 데이터가 출력된다.
그리고 프리즈마 스튜디오에 들어가보면 프리즈마 클라이언트에서 만든 데이터도 추가되었다.

## References

1. [Tailwind](https://tailwindcss.com/)
2. [Prisma](https://www.prisma.io/)
3. [Planet Scale](https://planetscale.com/)
