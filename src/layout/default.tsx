import React, { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import { LightTheme } from "../theme";
import GlobalStyle from "../components/GlobalStyle";
import Header from "../components/Header";

interface IDefaultLayout {
	children: ReactNode;
}
function DefaultLayout({ children }: IDefaultLayout) {
	return (
		<ThemeProvider theme={LightTheme}>
			<GlobalStyle />
			<Header />
			{children}
		</ThemeProvider>
	);
}

export default DefaultLayout;
