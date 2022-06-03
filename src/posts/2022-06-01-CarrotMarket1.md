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

ORM
Prisma = translator (SQL 등을 사용하지 않고 DB와 연결)

vscode prisma extension(Prisma 검색: syntax highliting, formatting, auto-complete)

`npm i prisma -D`

`npx prisma init`: prisma 폴더, .env 파일 생성

1. .env에 데이터베이스 URL을 적어주기
2. shcema.prisma에 provider를 바꿔주기(mysql)
3. model 만들기

```javascript
model User {
	id Int @id @default(autoincrement())
	//id 는 int고 unique하고 증가하는 순서로 정렬
	phone Int? @unique
	// phone은 있을 수도 없을 수도 있지만, 유일하다.
	email String? @unique
	name String
	avatar String?
	createdAt DateTime @default(now())
	updatedAt DateTime @updatedAt
}
```

## PlanetScale

PlanetScale(MySQL serverless database)
serverless: 서브를 유지할 필요가 없다.
서버는 만들어야 함
vitess, mysql scale
회원가입 or 깃허브 로그인

pscale 설치
pscale auto login(화면과 터미널의 값이 같은지 확인 => logged in)
pscale region list -> ap-northeast에 만들기
pscale database create
pscale database create carrot-market --region ap-northeast

브라우저의 관리자 패널에 보면 새로운 데이터베이스가 생김
브라우저에서 버튼으로 해결되긴 하지만, cli로 해결하는 것 추천

.env에 url을 적어줘야 한다.
보통 데이터베이스는 만들 때 암호를 생성한다.
Heroku, AWS는 해당 암호를 .env에 저장해야 한다.
만약 암호가 유출되면 망함
그래서 2개의 데이터 베이스를 준비한다.
컴퓨터에서는 가짜 데이터베이스로 작업하고, 배포는 Heroku, AWS에서 한다.

PlanetScale에서는 .env에 암호를 저장하지 않는다.
cli에서 pscale을 입력하면 connet 명령이 있다.
pscale connect carrot-market => 연결됨
-> url이 나옴. (콘솔을 유지해야 연결이 유지되므로 끄면 안 됨)
-> url을 .env의 DATABASE_URL에 추가

```javascript
DATABASE_URL = "mysql://127.0.0.1.3306/carrot-market";
```

model을 db에 연결
prisma는 schema.prism를 2가지 목적으로 살펴본다.

1. model을 dbdㅔ push하고 sql migration을 자동으로 처리
2. 다른 db와 상호작용하기 위해 client를 생성하고, 그 client에 자동완성 기능을 추가하기 위해.

PlanetScale은 MySql과 호환되는 페이지.
foerin key

```javascript
generator client {
	provider = "prisma-client-js"
	previewFeatures = ["referentialIntegrity]
}
datasource db {
	provider = "mysql"
	url = env("DATABASE_URL")
	referentialIntegrity = "prisma"
}
```

npx prisma db push

PlanetScale에서 Branches를 눌러보면 main에서 Schema에 데이터베이스의 Schema가 나온다.

npx prisma studio

libs/client.ts

`npm i @prisma/client`

```javascript
// client.ts
import { PrismaClient } from "@prisma/client";

export default new PrismaClient();
```

PrismaClient는 프론트엔드에서 사용할 수 없도록 막혀있다.

/pages/api/client-test.tsx

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

localhost:3000/api/client-test로 들어가면 api가 나온다.

## References

1. [Tailwind](https://tailwindcss.com/)
2. [Prisma](https://www.prisma.io/)
