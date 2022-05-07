import React from "react";
import DefaultLayout from "../layout/default";
import { graphql, Link } from "gatsby";

interface IEdges {
	node: {
		id: string;
		frontmatter: {
			date: string;
			title: string;
		};
		parent: {
			changeTime: string;
		};
		fields: {
			slug: string;
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
							fields: { slug },
						},
					}: IEdges) => (
						<li key={id}>
							<Link to={slug}>go to Post</Link>
							{title} {date}
						</li>
					)
				)}
			</ul>
		</DefaultLayout>
	);
}

export default Posts;

export const query = graphql`
	query MyQuery {
		allMarkdownRemark(
			sort: {
				fields: [frontmatter___date, frontmatter___title]
				order: DESC
			}
		) {
			edges {
				node {
					id
					frontmatter {
						date(formatString: "MMMM D, YYYY")
						title
					}
					parent {
						... on File {
							changeTime(formatString: "MMMM D, YYYY")
						}
					}
					fields {
						slug
					}
				}
			}
		}
	}
`;
