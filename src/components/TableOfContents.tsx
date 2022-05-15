import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import ActiveHash from "../hooks/activeHash";

const TableOfContentsContainer = styled.div`
	position: sticky;
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
	let targetIds: string[] = [];
	useEffect(() => {
		let val: string[] = [];
		if (typeof document !== "undefined") {
			let dummyDom = document.createElement("html");
			dummyDom.innerHTML = content;
			const anchors = dummyDom.querySelectorAll("a");

			anchors.forEach((a) => {
				val.push(a.hash.replace("#", ""));
			});
		}
		targetIds = val;
	}, []);

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
