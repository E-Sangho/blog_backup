import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
	siteMetadata: {
		title: `Gatsby Blog`,
		siteUrl: `https://www.yourdomain.tld`,
	},
	plugins: [
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
		"gatsby-transformer-remark",
		"gatsby-plugin-image",
		"gatsby-plugin-sharp",
		"gatsby-transformer-sharp",
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: "images",
				path: "./src/assets/img/",
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
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [
					`gatsby-remark-autolink-headers`,
					{
						resolve: `gatsby-remark-prismjs`,
						options: {
							classPrefix: "language-",
							inlineCodeMarker: null,
							aliases: {},
							showLineNumbers: false,
							noInlineHighlight: false,
							languageExtensions: [
								{
									language: "superscript",
									extend: "javascript",
									definition: {
										superscript_types: /(SuperType)/,
									},
									insertBefore: {
										function: {
											superscript_keywords:
												/(superif|superelse)/,
										},
									},
								},
							],
							prompt: {
								user: "root",
								host: "localhost",
								global: false,
							},
							escapeEntities: {},
						},
					},
				],
			},
		},
	],
};

export default config;
