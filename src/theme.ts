import { DefaultTheme } from "styled-components";

export const LightTheme: DefaultTheme = {
	// primaryColor is Blue
	primaryColor: "#0F0FDC",

	// secondaryColor is Orange
	secondaryColor: "#FF9900",

	// grayColors are differ only opacity
	grayColor: {
		opacity__100: "rgba(40, 40, 45, 1)",
		opacity__75: "rgba(40, 40, 45, 0.75)",
		opacity__50: "rgba(40, 40, 45, 0.5)",
		opacity__25: "rgba(40, 40, 45, 0.25)",
		opacity__10: "rgba(40, 40, 45, 0.1)",
		opacity__5: "rgba(40, 40, 45, 0.05)",
	},

	// fontSize
	fontSize: {
		h1: "48px",
		h2: "39px",
		h3: "31px",
		h4: "24px",
		h5: "20px",
		h6: "18px",
		p: "16px",
		s: "14px",
	},
};
