import React from "react";
import { IEdges } from "../types/IPosts";
import { Link } from "gatsby";
import styled from "styled-components";
import { GatsbyImage } from "gatsby-plugin-image";
import { motion } from "framer-motion";

const PostCardContainer = styled(motion.li)`
	width: 320px;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: ${({ theme }) => theme.grayColor.opacity__25} 0px 2px 8px 0px;
`;

const PostCardTitle = styled.div`
	width: 320px;
	margin: 8px 0px;
	font-size: ${({ theme }) => theme.fontSize.h4};
	text-align: center;
	font-family: "Roboto";
`;

const PostCardDate = styled.div`
	width: 320px;
	font-family: "Noto Sans KR";
	font-size: ${({ theme }) => theme.fontSize.s};
	color: ${({ theme }) => theme.grayColor.opacity__25};
	text-align: right;
	padding: 0 8px;
	box-sizing: border-box;
	margin-bottom: 8px;
`;

const PostCardSumamry = styled.div`
	width: 320px;
	height: 120px;
	font-family: "Noto Sans KR";
	font-size: ${({ theme }) => theme.fontSize.p};
	color: ${({ theme }) => theme.grayColor.opacity__50};
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
		<PostCardContainer
			whileHover={{
				translateY: "-16px",
				boxShadow: "rgba(0, 0, 0, 0.5) 0px 16px 32px",
			}}
			key={id}
		>
			<PostCardLink to={`/posts${slug}`}>
				<PostCardImage image={gatsbyImageData} alt="Post Image" />
				<PostCardTitle>{title}</PostCardTitle>
				<PostCardSumamry>{summary}</PostCardSumamry>
				<PostCardDate>{`${date}`}</PostCardDate>
			</PostCardLink>
		</PostCardContainer>
	);
}

export default PostCard;
