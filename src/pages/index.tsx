import React from "react";
import DefaultLayout from "../layout/default";
import TypingText from "../components/Hero/TypingText";
import RecentPost from "../components/RecentPost";
import NewSeries from "../components/NewSeries";
import { graphql } from "gatsby";
import { IPosts } from "../types/IPosts";

const IndexPage = ({
	data: {
		allMarkdownRemark: { edges },
	},
}: IPosts) => {
	return (
		<DefaultLayout>
			<TypingText
				text={"Creative Thinking, Fast Following"}
				speed={100}
				imageUrl={
					"https://cdn.pixabay.com/photo/2017/01/18/08/25/social-media-1989152_960_720.jpg"
				}
			/>
			<RecentPost title={"Recent Post"} />
			<NewSeries title={"New Series"} />
		</DefaultLayout>
	);
};

export default IndexPage;
