import React from "react";
import { IEdges } from "../types/IPosts";

import PostCard from "./PostCard";
import styled from "styled-components";
import infiniteScroll from "../hooks/infiniteScroll";

const PostListContainer = styled.div`
	display: flex;
	justify-content: center;
`;

const GridList = styled.ul`
	width: 100%;
	max-width: 1024px;
	display: grid;
	grid-template-columns: repeat(auto-fill, 320px);
	column-gap: 16px;
	row-gap: 32px;
	justify-items: center;
	justify-content: space-between;
`;

export interface IPostList {
	selectedCategory: string;
	edges: IEdges[];
}

function PostList({ selectedCategory, edges }: IPostList) {
	const { infiniteRef, postList } = infiniteScroll({
		selectedCategory,
		edges,
	});
	return (
		<PostListContainer>
			<GridList ref={infiniteRef}>
				{postList.map(({ node }: IEdges) => (
					<PostCard key={node.id} node={node} />
				))}
			</GridList>
		</PostListContainer>
	);
}

export default PostList;
