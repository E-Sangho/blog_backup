export interface IEdges {
	node: {
		id: string;
		frontmatter: {
			date: string;
			title: string;
		};
		parent: {
			changeTime: string;
		};
		fields: {
			slug: string;
		};
	};
}

export interface IPostCard {
	title: string;
	date: string;
	slug: string;
}

export interface IPostData {
	edges: IEdges[];
}

export interface IPosts {
	data: {
		allMarkdownRemark: {
			edges: IEdges[];
		};
	};
}
