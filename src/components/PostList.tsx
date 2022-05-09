import React, { useMemo } from "react";
import { IPostData, IEdges } from "../types/IPosts";
import { Link } from "gatsby";
import PostCard from "./PostCard";
import styled from "styled-components";

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

interface IPostList {
	selectedCategory: string;
	edges: IEdges[];
}

function PostList({ selectedCategory, edges }: IPostList) {
	const edgesFiltered = useMemo(
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
	return (
		<PostListContainer>
			<GridList>
				{edgesFiltered.map(({ node }: IEdges) => (
					<PostCard node={node} />
				))}
			</GridList>
		</PostListContainer>
	);
}

export default PostList;
