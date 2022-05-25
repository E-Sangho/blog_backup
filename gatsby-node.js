const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
	const { createNodeField } = actions;
	if (node.internal.type === `MarkdownRemark`) {
		const slug = createFilePath({ node, getNode });
		createNodeField({
			node,
			name: `slug`,
			value: slug,
		});
	}
};

// Generate Post Page Through Markdown Data
exports.createPages = async ({ actions, graphql, reporter }) => {
	const { createPage } = actions;

	// Get All Markdown File For Paging
	const queryAllMarkdownData = await graphql(
		`
			{
				allMarkdownRemark(
					sort: {
						order: DESC
						fields: [frontmatter___date, frontmatter___title]
					}
				) {
					edges {
						node {
							fields {
								slug
							}
							frontmatter {
								layout
								series
							}
						}
					}
				}
			}
		`
	);

	const series = queryAllMarkdownData.data.allMarkdownRemark.edges.filter(
		({
			node: {
				frontmatter: { layout },
			},
		}) => layout === "series"
	);

	const seriesList = queryAllMarkdownData.data.allMarkdownRemark.edges.reduce(
		(acc, cur) => {
			if (cur.node.frontmatter.layout === "series") {
				const seriesName = cur.node.frontmatter.series;
				if (seriesName && !acc.includes(seriesName)) {
					return [...acc, seriesName];
				}
			}
			return acc;
		},
		[]
	);

	// Handling GraphQL Query Error
	if (queryAllMarkdownData.errors) {
		reporter.panicOnBuild(`Error while running query`);
		return;
	}

	// Import Post Template Component
	const PostTemplateComponent = path.resolve(
		__dirname,
		"src/template/post.tsx"
	);

	// Import SeriesList Template Component
	const SeriesListTemplateComponent = path.resolve(
		__dirname,
		"src/template/seriesList.tsx"
	);

	// Import Series Template Component
	const SeriesTemplateComponent = path.resolve(
		__dirname,
		"src/template/series.tsx"
	);

	// Page Generating Function
	const generatePostPage = ({
		node: {
			fields: { slug },
		},
	}) => {
		const pageOptions = {
			path: `posts${slug}`,
			component: PostTemplateComponent,
			context: { slug },
		};

		createPage(pageOptions);
	};

	const generateSeriesListPage = (seriesName) => {
		const pageOptions = {
			path: `series/${seriesName.replaceAll(" ", "-")}`,
			component: SeriesListTemplateComponent,
			context: { series: seriesName },
		};

		createPage(pageOptions);
	};

	const generateSeriesPage = ({
		node: {
			fields: { slug },
			frontmatter: { series },
		},
	}) => {
		const pageOptions = {
			path: `series/${series.replaceAll(" ", "-")}${slug}`,
			component: SeriesTemplateComponent,
			context: { slug },
		};

		createPage(pageOptions);
	};

	// Generate Post Page And Passing Slug Props for Query
	queryAllMarkdownData.data.allMarkdownRemark.edges.forEach(generatePostPage);
	seriesList.forEach(generateSeriesListPage);
	series.forEach(generateSeriesPage);
};
