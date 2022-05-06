import React from "react";
import DefaultLayout from "../layout/default";
import { graphql } from "gatsby";

interface IEdges {
	node: {
		id: string;
		frontmatter: {
			date: string;
			title: string;
		};
	};
}

interface IPosts {
	data: {
		allMarkdownRemark: {
			edges: IEdges[];
		};
	};
}

function Posts({
	data: {
		allMarkdownRemark: { edges },
	},
}: IPosts) {
	return (
		<DefaultLayout>
			<ul>
				{edges.map(
					({
						node: {
							id,
							frontmatter: { date, title },
						},
					}: IEdges) => (
						<li>{title}</li>
					)
				)}
			</ul>
		</DefaultLayout>
	);
}

export default Posts;

export const query = graphql`
	query getPostList {
		allMarkdownRemark {
			edges {
				node {
					id
					frontmatter {
						date
						title
					}
				}
			}
		}
	}
`;
