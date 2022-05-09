import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import GithubIcon from "../assets/github.svg";
import { motion } from "framer-motion";
import CheckScrollDown from "../hooks/scrollDown";

const HeaderContainer = styled(motion.div)`
	width: 100%;
	height: 64px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	top: 0px;
	left: 0px;
	background-color: white;
	z-index: 999;
`;

const HeaderContents = styled.div`
	width: 100%;
	height: 100%;
	max-width: 1024px;
	display: grid;
	grid-template-columns: 1fr 4fr 1fr;
`;

const HeaderStart = styled.div`
	display: flex;
	justify-contet: flex-start;
	align-items: center;
	color: ${(props) => props.theme.primaryColor};
`;

const HeaderMiddle = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	a {
		margin: 0px 8px;
		font-size: ${({ theme }) => theme.fontSize.h6};
	}
`;

const HeaderEnd = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

const HeaderNavigation = styled.div`
	display: flex;
	align-items: center;
`;

const HeaderLogo = styled.div`
	font-size: ${({ theme }) => theme.fontSize.h4};
`;

const HeaderIcon = styled.div`
	width: 40px;
	height: 40px;
`;

const HeaderNavLink = styled(motion.div)``;

const StyledLink = styled(Link)`
	border-radius: 20px;
`;

const HeaderVariants = {
	initial: {},
	scrolled: {
		borderBottom: "solid 2px rgba(0, 0, 0, 0.5)",
	},
};

const LinkVariants = {
	hover: {
		scale: 1.1,
	},
};

function Header() {
	const { isScrolled } = CheckScrollDown();
	return (
		<HeaderContainer
			variants={HeaderVariants}
			animate={isScrolled ? "scrolled" : "initial"}
		>
			<HeaderContents>
				<HeaderStart>
					<Link to="/">
						<HeaderLogo>WEBLOG</HeaderLogo>
					</Link>
				</HeaderStart>
				<HeaderMiddle>
					<HeaderNavigation>
						<HeaderNavLink
							variants={LinkVariants}
							whileHover="hover"
						>
							<StyledLink to="/">Home</StyledLink>
						</HeaderNavLink>
						<HeaderNavLink
							variants={LinkVariants}
							whileHover="hover"
						>
							<Link to="/about">About</Link>
						</HeaderNavLink>
						<HeaderNavLink
							variants={LinkVariants}
							whileHover="hover"
						>
							<Link to="/posts">Posts</Link>
						</HeaderNavLink>
						<HeaderNavLink
							variants={LinkVariants}
							whileHover="hover"
						>
							<Link to="/projects">Projects</Link>
						</HeaderNavLink>
					</HeaderNavigation>
				</HeaderMiddle>
				<HeaderEnd>
					<HeaderIcon>
						<a href="https://github.com/E-Sangho">
							<GithubIcon />
						</a>
					</HeaderIcon>
				</HeaderEnd>
			</HeaderContents>
		</HeaderContainer>
	);
}

export default Header;
