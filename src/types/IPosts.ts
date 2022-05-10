import { IGatsbyImageData } from "gatsby-plugin-image";

export interface IEdges {
	node: {
		id: string;
		html: string;
		tableOfContents: string;
		frontmatter: {
			date: string;
			title: string;
			summary: string;
			categories: string[];
			thumbnail: {
				childImageSharp: {
					gatsbyImageData: IGatsbyImageData;
				};
			};
		};
		parent: {
			changeTime: string;
		};
		fields: {
			slug: string;
		};
	};
}

export interface IPostData {
	edges: IEdges[];
}

export interface IPosts {
	location: { search: string };
	data: {
		allMarkdownRemark: {
			edges: IEdges[];
		};
	};
}
