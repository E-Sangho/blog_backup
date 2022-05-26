import React, { useEffect } from "react";
import styled from "styled-components";
import ActiveHash from "../hooks/activeHash";

const TableOfContentsContainer = styled.div`
	position: sticky;
	border-left: 2px solid ${({ theme }) => theme.grayColor.opacity__50};
	top: 64px;
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
	a.isActive {
		color: ${({ theme }) => theme.primaryColor};
	}
	a:hover {
		color: ${({ theme }) => theme.secondaryColor};
	}
`;

interface ITableOfContents {
	content: string;
}

function TableOfContents({ content }: ITableOfContents) {
	let targetIds = content
		.split("\n")
		.filter((e) => e.includes("a href="))
		.map((e) => {
			return e.split('"')[1].replace("#", "");
		});

	const activeHash = ActiveHash(targetIds);
	useEffect(() => {
		const TOCLinks = document.querySelectorAll(".TOC a");
		TOCLinks.forEach((a) => {
			a.classList.remove("isActive");
		});

		const activeLink = document.querySelectorAll(
			`.TOC a[href="#${activeHash}"]`
		);

		if (activeLink.length) {
			activeLink[0].classList.add("isActive");
		}
	}, [activeHash]);
	return (
		<TableOfContentsContainer
			className="TOC"
			dangerouslySetInnerHTML={{ __html: content }}
		/>
	);
}

export default TableOfContents;
