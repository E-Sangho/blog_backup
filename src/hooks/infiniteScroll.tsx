import React, { useRef, useState, useMemo, useEffect } from "react";
import { IPostList } from "../components/PostList";
import Posts from "../pages/posts";
import { IEdges } from "../types/IPosts";

const NUMBER_OF_ITEMS_PER_PAGE = 12;

function infiniteScroll({ selectedCategory, edges }: IPostList) {
	const infiniteRef = useRef<HTMLUListElement | null>(null);
	const [count, setCount] = useState(1);
	const postListByCategory = useMemo(
		() =>
			edges.filter(
				({
					node: {
						frontmatter: { categories },
					},
				}: IEdges) =>
					selectedCategory !== "All"
						? categories.includes(selectedCategory)
						: true
			),
		[selectedCategory]
	);
	const observer = new IntersectionObserver((entries, observer) => {
		if (!entries[0].isIntersecting) return;
		setCount((value) => value + 1);
		observer.disconnect();
	});

	useEffect(() => {
		if (
			NUMBER_OF_ITEMS_PER_PAGE * count >= postListByCategory.length ||
			infiniteRef.current === null ||
			infiniteRef.current.children.length === 0
		)
			return;
		observer.observe(
			infiniteRef.current.children[
				infiniteRef.current.children.length - 1
			]
		);
	}, [count, selectedCategory]);
	return {
		infiniteRef,
		postList: postListByCategory.slice(0, count * NUMBER_OF_ITEMS_PER_PAGE),
	};
}

export default infiniteScroll;
