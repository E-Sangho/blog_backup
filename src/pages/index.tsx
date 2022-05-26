import React from "react";
import DefaultLayout from "../layout/default";
import TypeText from "../components/Hero/TypeText";

const IndexPage = () => {
	return (
		<DefaultLayout>
			<TypeText
				text={"Creative Thinking. Fast Following"}
				speed={0.05}
				imageUrl={
					"https://cdn.pixabay.com/photo/2017/01/18/08/25/social-media-1989152_960_720.jpg"
				}
			/>
		</DefaultLayout>
	);
};

export default IndexPage;
