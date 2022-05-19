import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
	siteMetadata: {
		title: `Gatsby Blog`,
		siteUrl: `https://www.yourdomain.tld`,
	},
	plugins: [
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [
					`gatsby-remark-autolink-headers`,
					`gatsby-remark-prismjs-title`,
					`gatsby-remark-prismjs`,
					{
						resolve: `gatsby-remark-images`,
						options: {
							maxWidth: 560,
						},
					},
					"gatsby-remark-numbered-footnotes",
				],
			},
		},
		"gatsby-plugin-styled-components",
		{
			resolve: "gatsby-plugin-google-analytics",
			options: {
				trackingId: "314174821",
			},
		},
		"gatsby-plugin-image",
		"gatsby-plugin-react-helmet",
		"gatsby-plugin-sitemap",
		"gatsby-plugin-image",

		{
			resolve: `gatsby-plugin-sharp`,
			options: {
				defaults: {
					formats: ["auto", "webp"],
					quality: 100,
					placeholder: "blurred",
				},
			},
		},
		"gatsby-transformer-sharp",
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "images",
				path: "./src/assets/images/",
			},
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "pages",
				path: "./src/pages/",
			},
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "posts",
				path: `${__dirname}/src/posts`,
			},
		},
		{
			resolve: "gatsby-plugin-react-svg",
			options: {
				rule: {
					include: /assets/,
				},
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `code`,
				path: `${__dirname}/src/posts`,
			},
		},
	],
};

export default config;
