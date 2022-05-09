import React from "react";
import { IEdges } from "../types/IPosts";
import { Link } from "gatsby";
import styled from "styled-components";
import { GatsbyImage } from "gatsby-plugin-image";

const PostCardContainer = styled.li`
	width: 320px;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: ${({ theme }) => theme.grayColor.opacity__25} 0px 7px 29px 0px;
`;

const PostCardTitle = styled.div`
	width: 320px;
	margin: 8px 0px;
	font-size: ${({ theme }) => theme.fontSize.h4};
	text-align: center;
`;

const PostCardDate = styled.div`
	width: 320px;
	font-size: ${({ theme }) => theme.fontSize.s};
	color: ${({ theme }) => theme.grayColor.opacity__50};
	text-align: right;
	padding: 0 8px;
	box-sizing: border-box;
`;

const PostCardSumamry = styled.div`
	width: 320px;
	height: 120px;
	font-size: ${({ theme }) => theme.fontSize.p};
	color: ${({ theme }) => theme.grayColor.opacity__100};
	box-sizing: border-box;
	padding: 0 8px;
`;

const PostCardLink = styled(Link)``;

const PostCardImage = styled(GatsbyImage)`
	width: 320px;
	height: 160px;
	border-radius: 8px 8px 0px 0px;
`;

function PostCard({
	node: {
		id,
		frontmatter: {
			date,
			title,
			summary,
			thumbnail: {
				childImageSharp: { gatsbyImageData },
			},
		},
		parent: { changeTime },
		fields: { slug },
	},
}: IEdges) {
	return (
		<PostCardContainer key={id}>
			<PostCardLink to={slug}>
				<PostCardImage image={gatsbyImageData} alt="Post Image" />
				<PostCardTitle>{title}</PostCardTitle>
				<PostCardSumamry>{summary}</PostCardSumamry>
				<PostCardDate>{`${date}`}</PostCardDate>
			</PostCardLink>
		</PostCardContainer>
	);
}

export default PostCard;
