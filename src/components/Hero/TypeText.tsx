import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div<{ imageUrl: string }>`
	width: 100%;
	max-width: 1024px;
	height: 400px;

	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
	margin-top: 32px;

	background-image: linear-gradient(
			to bottom,
			rgba(20, 20, 20, 0.3),
			rgba(20, 20, 20, 0.8)
		),
		url(${(props) => props.imageUrl});
	background-position: center center;
	background-size: cover;
`;

const TypingZone = styled.div`
	width: 100%;
	height: 100%;

	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
`;

const Word = styled(motion.div)`
	display: flex;

	margin: 0 4px;
`;

const Character = styled(motion.div)`
	font-size: ${({ theme }) => theme.fontSize.h2};
	font-weight: bold;
	color: white;
`;

interface ITypeText {
	text: string;
	speed: number;
	imageUrl: string;
}

const WordVariants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
	},
};

const CharVariants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
		ease: [0, 0.9, 1],
	},
};

function TypeText({ text, speed, imageUrl }: ITypeText) {
	const words = text.split(" ");
	return (
		<Container imageUrl={imageUrl} style={{ backgroundImage: "" }}>
			<TypingZone>
				{words.map((word, index) => {
					let wordLength = 0;
					for (let i = 0; i < index; ++i) {
						wordLength += words[i].length;
					}
					return (
						<Word
							key={word + "-" + index}
							variants={WordVariants}
							initial="hidden"
							animate="visible"
							transition={{
								delayChildren: wordLength * speed,
								staggerChildren: speed,
							}}
						>
							{word.split("").map((character, index) => {
								return (
									<Character
										key={character + "-" + index}
										variants={CharVariants}
									>
										{character}
									</Character>
								);
							})}
						</Word>
					);
				})}
			</TypingZone>
		</Container>
	);
}

export default TypeText;
