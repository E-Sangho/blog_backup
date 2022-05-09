import React, { useMemo } from "react";
import DefaultLayout from "../layout/default";
import { graphql, Link } from "gatsby";
import { IEdges, IPosts } from "../types/IPosts";
import PostList from "../components/PostList";
import CategoryList from "../components/CategoryList";
import queryString from "query-string";
import { ICategoryList } from "../components/CategoryList";

function Posts({
	location: { search },
	data: {
		allMarkdownRemark: { edges },
	},
}: IPosts) {
	const parsed = queryString.parse(search);
	const selectedCategory =
		typeof parsed.category !== "string" || !parsed.category
			? "All"
			: parsed.category;
	const categoryList = useMemo(
		() =>
			edges.reduce(
				(
					list: ICategoryList["categoryList"],
					{
						node: {
							frontmatter: { categories },
						},
					}: IEdges
				) => {
					categories.forEach((category) => {
						if (list[category] === undefined) list[category] = 1;
						else list[category]++;
					});
					list["All"]++;
					return list;
				},
				{ All: 0 }
			),
		[]
	);
	return (
		<DefaultLayout>
			<CategoryList
				selectedCategory={selectedCategory}
				categoryList={categoryList}
			/>
			<PostList selectedCategory={selectedCategory} edges={edges} />
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
						summary
						categories
						thumbnail {
							childImageSharp {
								gatsbyImageData
							}
						}
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
