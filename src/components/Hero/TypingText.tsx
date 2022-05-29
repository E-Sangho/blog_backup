import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { StaticImage } from "gatsby-plugin-image";

const Container = styled.div`
	width: 100%;
	max-width: 1024px;
	height: 400px;

	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
	margin-top: 32px;
`;

const TypingZone = styled.div`
	width: 100%;
	height: 100%;

	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	z-index: 0;
	background-color: transparent;
`;

const Text = styled.div`
	display: flex;
	align-items: center;

	font-size: ${({ theme }) => theme.fontSize.h2};
	font-weight: bold;
	color: white;
`;

const Parenthesis = styled.div`
	font-weight: normal;
	font-size: ${({ theme }) => theme.fontSize.h1};
	color: ${({ theme }) => theme.secondaryColor};
`;

const Bar = styled(motion.div)``;

interface ITypingText {
	text: string;
	speed: number;
	imageUrl: string;
}

function TypingText({ text, speed, imageUrl }: ITypingText) {
	const [displayedText, setDisplayedText] = useState("");
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const animation = setInterval(() => {
			setIndex((index) => {
				if (index >= text.length - 1) {
					clearInterval(animation);
					return index;
				}
				return index + 1;
			});
		}, speed);
	}, []);

	useEffect(() => {
		setDisplayedText((prev) => prev + text[index]);
	}, [index]);
	return (
		<Container>
			<StaticImage
				src={"../../assets/images/homeHero.jpg"}
				alt="Hero image for home"
				style={{
					position: "absolute",
					width: "100wh",
					height: "100vh",
					objectFit: "cover",
					filter: "brightness(50%)",
				}}
			/>
			<TypingZone>
				<Text>
					{displayedText}
					<Bar
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 1, 0] }}
						transition={{
							repeat: Infinity,
							duration: 0.75,
						}}
					>
						|
					</Bar>
				</Text>
			</TypingZone>
		</Container>
	);
}

export default TypingText;
