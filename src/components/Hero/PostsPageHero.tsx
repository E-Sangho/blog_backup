import React from "react";
import styled from "styled-components";
import { StaticImage } from "gatsby-plugin-image";

const PostsHeroContainer = styled.div`
	width: 100%;
	height: 400px;
	position: relative;
`;

const PostsHeroContent = styled.div`
	width: 400px;
	height: 200px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: transparent;
	display: flex;
	justify-content: center;
	align-items: center;
	color: rgb(235, 235, 235);
	font-size: ${({ theme }) => theme.fontSize.h1};
	font-family: "Roboto";
`;

function PostsHero() {
	return (
		<PostsHeroContainer>
			<StaticImage
				src="../../assets/images/postHero.jpg"
				alt="Hero image for posts page"
				style={{
					width: "100%",
					height: "400px",
					objectFit: "cover",
					filter: "brightness(50%)",
				}}
			/>
			<PostsHeroContent>Posts</PostsHeroContent>
		</PostsHeroContainer>
	);
}

export default PostsHero;
