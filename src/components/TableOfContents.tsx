import React from "react";
import styled from "styled-components";

const TableOfContentsContainer = styled.div`
	position: sticky;
	top: 0px;
	height: 100%;
	margin-top: 128px;
	margin-left: 32px;
	font-family: "Roboto";
	font-size: 16px;
	color: ${({ theme }) => theme.grayColor.opacity__75};
	ul {
		margin-left: 8px;
		margin-bottom: 16px;
	}
	li {
		margin: 4px 0px 4px 4px;
	}
`;

interface ITableOfContents {
	content: string;
}

function TableOfContents({ content }: ITableOfContents) {
	return (
		<TableOfContentsContainer
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
}

export default TableOfContents;
