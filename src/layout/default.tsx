import React, { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import { LightTheme } from "../theme";
import GlobalStyle from "../components/GlobalStyle";
import Header from "../components/Header";
import Content from "../components/Content";

interface IDefaultLayout {
	children: ReactNode;
}

function DefaultLayout({ children }: IDefaultLayout) {
	return (
		<ThemeProvider theme={LightTheme}>
			<GlobalStyle />
			<Header />
			<Content>{children}</Content>
		</ThemeProvider>
	);
}

export default DefaultLayout;
