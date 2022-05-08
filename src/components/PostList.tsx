import React from "react";
import { IPostData, IEdges } from "../types/IPosts";
import { Link } from "gatsby";
import PostCard from "./PostCard";

function PostList({ edges }: IPostData) {
	return (
		<ul>
			{edges.map(
				({
					node: {
						id,
						frontmatter: { date, title },
						fields: { slug },
					},
				}: IEdges) => (
					<li key={id}>
						<PostCard title={title} date={date} slug={slug} />
					</li>
				)
			)}
		</ul>
	);
}

export default PostList;
