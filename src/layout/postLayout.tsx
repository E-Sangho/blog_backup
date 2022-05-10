import React, { useEffect } from "react";
import { graphql } from "gatsby";
import styled from "styled-components";
import Prism from "prismjs";
import DefaultLayout from "./default";
import { IEdges, IPosts } from "../types/IPosts";
import TableOfContents from "../components/TableOfContents";
import MarkdownRenderer from "../components/MarkdownRenderer";

const PostContainer = styled.div`
	display: flex;
	width: 100%;
	max-width: 1024px;
	margin: 0 auto;
`;

function PostLayout({
	data: {
		allMarkdownRemark: { edges },
	},
}: IPosts) {
	const {
		node: { html, tableOfContents },
	} = edges[0];
	useEffect(() => {
		Prism.highlightAll();
	});
	return (
		<DefaultLayout>
			<PostContainer>
				<MarkdownRenderer content={html} />
				<TableOfContents content={tableOfContents} />
			</PostContainer>
		</DefaultLayout>
	);
}

export default PostLayout;

export const queryMarkdown = graphql`
	query queryMarkdown($slug: String) {
		allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
			edges {
				node {
					html
					tableOfContents
					frontmatter {
						title
						date(formatString: "YYYY.MM.DD.")
					}
				}
			}
		}
	}
`;
