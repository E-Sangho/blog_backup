import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import GithubIcon from "../assets/github.svg";
import { motion } from "framer-motion";

const HeaderContainer = styled(motion.div)`
	width: 100%;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 0px;
	left: 0px;

	background-color: white;
	z-index: 999;
	font-family: "Roboto";
`;

const HeaderTop = styled.div`
	width: 100%;
	max-width: 1024px;

	margin-top: 40px;
	padding: 4px 0px;

	box-sizing: border-box;
	display: flex;
	flex-direction: column;

	border-top: 2px solid black;
	border-bottom: 2px solid black;
`;

const HeaderLogo = styled.div`
	width: 100%;

	display: flex;
	justify-content: center;
	align-items: center;
	padding: 8px 0;

	border-top: 1px solid black;
	border-bottom: 1px solid black;

	font-family: "Cormorant Garamond", serif;
	font-weight: bold;
	font-size: 64px;
	letter-spacing: -2px;
	color: ${(props) => props.theme.primaryColor};
`;

const HeaderBottom = styled.div`
	width: 100%;
	max-width: 1024px;

	display: flex;
	position: relative;

	border-bottom: 2px solid black;
`;

const HeaderNavigation = styled.div`
	width: 100%;
	height: 56px;

	display: flex;
	justify-content: center;
	align-items: center;
`;

const HeaderNavLink = styled(motion.div)`
	margin: 0 8px;

	font-size: ${({ theme }) => theme.fontSize.h5};
	font-family: "Cormorant Garamond", serif;
`;

const HeaderIcon = styled.div`
	width: 40px;
	height: 40px;

	position: absolute;
	right: 40px;
	top: 8px;
`;

const LinkVariants = {
	hover: {
		scale: 1.1,
	},
};

function Header() {
	const LinkList = ["", "about", "posts", "series", "projects"];
	return (
		<HeaderContainer>
			<HeaderTop>
				<HeaderLogo>
					<Link to="/">WEBLOG</Link>
				</HeaderLogo>
			</HeaderTop>
			<HeaderBottom>
				<HeaderNavigation>
					{LinkList.map((LinkUrl) => (
						<HeaderNavLink
							key={LinkUrl}
							variants={LinkVariants}
							whileHover="hover"
						>
							<Link to={`/${LinkUrl}`}>
								{(LinkUrl === "" ? "Home" : LinkUrl).replace(
									/\b[a-z]/,
									(char) => char.toUpperCase()
								)}
							</Link>
						</HeaderNavLink>
					))}
				</HeaderNavigation>
				<HeaderIcon>
					<a href="https://github.com/E-Sangho">
						<GithubIcon />
					</a>
				</HeaderIcon>
			</HeaderBottom>
		</HeaderContainer>
	);
}

export default Header;
