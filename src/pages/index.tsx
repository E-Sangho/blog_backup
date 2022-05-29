import React from "react";
import DefaultLayout from "../layout/default";
import TypingText from "../components/Hero/TypingText";
import RecentPost from "../components/RecentPost";
import NewSeries from "../components/NewSeries";
import { StaticImage } from "gatsby-plugin-image";
import { graphql } from "gatsby";
import { IPosts } from "../types/IPosts";

function IndexPage() {
	return (
		<DefaultLayout>
			<TypingText
				text={"Creative Thinking, Fast Following"}
				speed={100}
				imageUrl={"../../assets/images/homeHero.jpg"}
			/>
			<RecentPost title={"Recent Post"} />
			<NewSeries title={"New Series"} />
		</DefaultLayout>
	);
}

export default IndexPage;
