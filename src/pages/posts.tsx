import React from "react";
import DefaultLayout from "../layout/default";
import { graphql, Link } from "gatsby";
import { IEdges, IPosts } from "../types/IPosts";
import PostList from "../components/PostList";

function Posts({
	data: {
		allMarkdownRemark: { edges },
	},
}: IPosts) {
	return (
		<DefaultLayout>
			<PostList edges={edges} />
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
