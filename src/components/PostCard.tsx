import React from "react";
import { IPostCard } from "../types/IPosts";
import { Link } from "gatsby";
import styled from "styled-components";

const PostCardContainer = styled.div`
	width: 240px;
	height: 400px;
`;

const PostCardTitle = styled.div``;

const PostCardDate = styled.div``;

const PostCardLink = styled(Link)``;

function PostCard({ title, date, slug }: IPostCard) {
	return (
		<PostCardContainer>
			<PostCardTitle>{title}</PostCardTitle>
			<PostCardDate>{date}</PostCardDate>
			<PostCardLink to={slug}>Read Post</PostCardLink>
		</PostCardContainer>
	);
}

export default PostCard;
