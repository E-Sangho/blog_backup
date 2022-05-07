import React, { useEffect } from "react";
import { graphql } from "gatsby";
import styled from "styled-components";
import Prism from "prismjs";

const MarkdownRenderer = styled.div`
	// Renderer Style
	display: flex;
	flex-direction: column;
	width: 768px;
	margin: 0 auto;
	padding: 100px 0;
	word-break: break-all;

	// Markdown Style
	line-height: 1.8;
	font-size: 16px;
	font-weight: 400;

	// Apply Padding Attribute to All Elements
	p {
		padding: 3px 0;
	}

	// Adjust Heading Element Style
	h1,
	h2,
	h3 {
		font-weight: 800;
		margin-bottom: 30px;
	}

	* + h1,
	* + h2,
	* + h3 {
		margin-top: 80px;
	}

	hr + h1,
	hr + h2,
	hr + h3 {
		margin-top: 0;
	}

	h1 {
		font-size: 30px;
	}

	h2 {
		font-size: 25px;
	}

	h3 {
		font-size: 20px;
	}

	// Adjust Quotation Element Style
	blockquote {
		margin: 30px 0;
		padding: 5px 15px;
		border-left: 2px solid #000000;
		font-weight: 800;
	}

	// Adjust List Element Style
	ol,
	ul {
		margin-left: 20px;
		padding: 30px 0;
	}

	// Adjust Horizontal Rule style
	hr {
		border: 1px solid #000000;
		margin: 100px 0;
	}

	// Adjust Link Element Style
	a {
		color: #4263eb;
		text-decoration: underline;
	}
`;

interface IEdges {
	node: {
		id: string;
		html: string;
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

function PostLayout({
	data: {
		allMarkdownRemark: { edges },
	},
}: IPosts) {
	const {
		node: { html },
	} = edges[0];
	useEffect(() => {
		Prism.highlightAll();
	});
	return <MarkdownRenderer dangerouslySetInnerHTML={{ __html: html }} />;
}

export default PostLayout;

export const queryMarkdown = graphql`
	query queryMarkdown($slug: String) {
		allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
			edges {
				node {
					html
					frontmatter {
						title
						date(formatString: "YYYY.MM.DD.")
					}
				}
			}
		}
	}
`;
