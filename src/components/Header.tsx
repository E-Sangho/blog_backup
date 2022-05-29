import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import GithubIcon from "../assets/github.svg";
import { motion } from "framer-motion";
import BarIcon from "../assets/svg/bar.svg";

const HeaderContainer = styled(motion.div)`
	width: 100vw;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 0px;
	left: 0px;

	background-color: ${({ theme }) => theme.dittoColor.main};

	z-index: 999;
	font-family: "Roboto";

	@media screen and (max-width: 1023px) {
	}

	@media screen and (max-width: 767px) {
	}
`;

const HeaderTop = styled.div`
	width: 100%;
	max-width: 1024px;

	box-sizing: border-box;
	display: flex;
	flex-direction: column;
`;

const HeaderLogo = styled.div`
	font-family: sans-serif;
	font-weight: bold;

	color: ${(props) => props.theme.primaryColor};

	@media screen and (max-width: 1023px) {
	}

	@media screen and (max-width: 767px) {
		margin: 8px auto;
		font-size: 24px;
	}
`;

const HeaderBottom = styled.div`
	width: 100%;
	max-width: 1024px;

	display: flex;
	position: relative;

	@media screen and (max-width: 1023px) {
	}
`;

const HeaderNavigation = styled.div`
	width: 100%;
	height: 56px;

	display: flex;
	justify-content: center;
	align-items: center;

	@media screen and (max-width: 767px) {
		display: none;
	}
`;

const MobileNavigation = styled.div`
	width: 100%;

	display: flex;
	flex-direction: column;
	align-items: center;

	color: white;

	@media screen and (min-width: 768px) {
		display: none;
	}
`;

const HeaderNavLink = styled(motion.div)`
	margin: 0 8px;

	font-size: ${({ theme }) => theme.fontSize.h5};
	font-family: "Cormorant Garamond", serif;

	@media screen and (max-width: 767px) {
		margin-bottom: 8px;
	}
`;

const HeaderIcon = styled.div`
	width: 40px;
	height: 40px;

	position: absolute;
	right: 40px;
	top: 8px;

	@media screen and (max-width: 767px) {
		display: none;
	}
`;

const LinkVariants = {
	hover: {
		scale: 1.1,
	},
};

const Bar = styled.div`
	width: 20px;
	height: 20px;

	position: absolute;
	top: 8px;
	right: 16px;
	fill: white;

	@media screen and (min-width: 768px) {
		display: none;
	}
`;

function Header() {
	const LinkList = ["", "about", "posts", "series", "projects"];
	const [barClicked, setBarClicked] = useState(false);
	const barOnclick = () => {
		setBarClicked((prev) => !prev);
	};
	return (
		<HeaderContainer>
			<HeaderTop>
				<HeaderLogo>
					<Link to="/">{":)itto"}</Link>
				</HeaderLogo>
			</HeaderTop>
			<Bar onClick={barOnclick}>
				<BarIcon />
			</Bar>

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
				{barClicked && (
					<MobileNavigation>
						{LinkList.map((LinkUrl) => (
							<HeaderNavLink
								key={LinkUrl}
								variants={LinkVariants}
								whileHover="hover"
							>
								<Link to={`/${LinkUrl}`}>
									{(LinkUrl === ""
										? "Home"
										: LinkUrl
									).replace(/\b[a-z]/, (char) =>
										char.toUpperCase()
									)}
								</Link>
							</HeaderNavLink>
						))}
						<HeaderIcon>
							<a href="https://github.com/E-Sangho">
								<GithubIcon />
							</a>
						</HeaderIcon>
					</MobileNavigation>
				)}
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
