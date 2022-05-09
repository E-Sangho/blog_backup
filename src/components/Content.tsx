import React from "react";
import styled from "styled-components";

const ContentContainer = styled.div`
	padding-top: 66px;
`;

interface IContent {
	children: React.ReactNode;
}

function Content({ children }: IContent) {
	return <ContentContainer>{children}</ContentContainer>;
}

export default Content;
