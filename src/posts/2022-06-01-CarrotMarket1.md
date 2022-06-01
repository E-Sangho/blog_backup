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

## TailwindCSS Setup

`npm i -D tailwindcss postcss autoprefixer`
`npx tailwindcss init -p` -> postcss.config.js, tailwind.config.js 생성.

```javascript
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

tailwind를 어디다 사용할지 알려줘야 한다. => content에 적어준다.

globals.css 초기화

```javascript
// globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`npm run dev`

## Tailwind CSS

### Introduction

utility css framework: utility == with a lot of className

어떤 class가 있는지 자동완성 -> extension tailwind css intellisense
마우스를 올리면 해당 클래스가 어떤 스타일인지 보여준다.
flex, grid처럼 서로 충돌하는 스타일을 같이 사용하면 밑줄로 보여준다.

tailwind는 엄청 많은 클래스를 가지고 있을 뿐이다.

ctrl + space를 누르면 자동완성 표시
