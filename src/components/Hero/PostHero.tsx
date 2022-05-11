import React from "react";
import styled from "styled-components";
import { IGatsbyImageData } from "gatsby-plugin-image";

const PostHeroContainer = styled.div``;

interface IPostHeroContainer {
	title: string;
	date: string;
	gatsbyImageData: IGatsbyImageData;
	changeTime: string;
}

function PostHero({
	title,
	date,
	gatsbyImageData,
	changeTime,
}: IPostHeroContainer) {
	return <PostHeroContainer></PostHeroContainer>;
}

export default PostHero;
