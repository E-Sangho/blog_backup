import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import GithubIcon from "../assets/github.svg";
import { motion } from "framer-motion";
import CheckScrollDown from "../animation/scrollDown";

const HeaderContainer = styled(motion.div)`
	width: 100%;
	height: 64px;
	display: grid;
	position: fixed;
	grid-template-columns: 1fr 4fr 1fr;
	border-bottom: solid 2px ${({ theme }) => theme.grayColor.opacity__5};
`;

const HeaderStart = styled.div`
	display: flex;
	justify-contet: flex-start;
	align-items: center;
	padding-left: 64px;
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
	padding-right: 64px;
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
		borderBottom: "none",
		backgroundColor: "transparent",
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
			<HeaderStart>
				<Link to="/">
					<HeaderLogo>WEBLOG</HeaderLogo>
				</Link>
			</HeaderStart>
			<HeaderMiddle>
				<HeaderNavigation>
					<HeaderNavLink variants={LinkVariants} whileHover="hover">
						<StyledLink to="/">Home</StyledLink>
					</HeaderNavLink>
					<HeaderNavLink variants={LinkVariants} whileHover="hover">
						<Link to="/about">About</Link>
					</HeaderNavLink>
					<HeaderNavLink variants={LinkVariants} whileHover="hover">
						<Link to="/posts">Posts</Link>
					</HeaderNavLink>
					<HeaderNavLink variants={LinkVariants} whileHover="hover">
						<Link to="/projects">Projects</Link>
					</HeaderNavLink>
				</HeaderNavigation>
			</HeaderMiddle>
			<HeaderEnd>
				<HeaderIcon>
					<GithubIcon />
				</HeaderIcon>
			</HeaderEnd>
		</HeaderContainer>
	);
}

export default Header;
