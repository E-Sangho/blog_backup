import React from "react";
import styled from "styled-components";

const RenderStyle = styled.div`
	// Renderer Style
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 768px;
	margin: 0 auto;
	padding: 100px 0;
	word-break: break-all;

	// Markdown Style
	line-height: 175%;
	font-family: "Noto Sans KR";
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

	.gatsby-highlight,
	.gatsby-resp-image-wrapper {
		margin: 32px 0px;
	}

	// Adjust Quotation Element Style
	blockquote {
		margin: 30px 0;
		padding: 5px 15px;
		border: dashed ${({ theme }) => theme.grayColor.opacity__50};
		background-color: ${({ theme }) => theme.grayColor.opacity__5};
		border-left: 3px solid ${({ theme }) => theme.primaryColor};
		font-size: 18px;
		font-weight: 800;
		position: relative;
		&:before {
			content: "";
			position: absolute;
			top: 50%;
			left: -4px;
			background-color: white;
			width: 5px;
			height: 24px;
			transform: translateY(-50%);
		}
		&:after {
			content: '"';
			color: ${({ theme }) => theme.primaryColor};
			position: absolute;
			top: 43%;
			transform: tranlateY(-50%);
			left: -5px;
			font-size: 24px;
		}
	}

	// Adjust List Element Style
	ol {
		list-style-type: decimal;
	}

	ul {
		list-style-type: disc;
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
		color: ${({ theme }) => theme.primaryColor};
	}
`;

interface IMarkdownRenderer {
	content: string;
}

function MarkdownRenderer({ content }: IMarkdownRenderer) {
	return <RenderStyle dangerouslySetInnerHTML={{ __html: content }} />;
}

export default MarkdownRenderer;
