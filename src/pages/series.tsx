import React, { useEffect } from "react";
import { graphql } from "gatsby";
import styled from "styled-components";
import Prism from "prismjs";
import DefaultLayout from "../layout/default";
import { IPosts } from "../types/IPosts";
import { Link } from "gatsby";

const SeriesContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 1024px;
	margin: 0 auto;
`;

const Title = styled.div`
	font-size: ${({ theme }) => theme.fontSize.h3};
`;

const SeriesList = styled.div`
	display: flex;
	flex-direction: column;
`;

const ListItem = styled.div``;

const ItemTitle = styled.div`
	font-size: ${({ theme }) => theme.fontSize.h6};
`;

function PostLayout({
	data: {
		allMarkdownRemark: { edges },
	},
}: IPosts) {
	const {
		node: {
			html,
			tableOfContents,
			frontmatter: {
				title,
				date,
				thumbnail: {
					childImageSharp: { gatsbyImageData },
				},
				series,
			},
			parent: { changeTime },
		},
	} = edges[0];
	useEffect(() => {
		Prism.highlightAll();
	});
	const allSeries = [
		...new Set(
			edges.map(
				({
					node: {
						frontmatter: { series },
					},
				}) => {
					return series;
				}
			)
		),
	];

	console.log(allSeries);

	return (
		<DefaultLayout>
			<SeriesContainer>
				<Title>Series</Title>
				<SeriesList>
					{allSeries.map((series) => (
						<Link to={`/series/${series.replaceAll(" ", "-")}`}>
							<ListItem key={series}>{series}</ListItem>
						</Link>
					))}
				</SeriesList>
			</SeriesContainer>
		</DefaultLayout>
	);
}

export default PostLayout;

export const queryMarkdownSeries = graphql`
	query queryMarkdownSeries {
		allMarkdownRemark(
			filter: { frontmatter: { layout: { eq: "series" } } }
			sort: {
				fields: [frontmatter___date, frontmatter___title]
				order: ASC
			}
		) {
			edges {
				node {
					html
					tableOfContents
					frontmatter {
						title
						series
						date(formatString: "YYYY.MM.DD.")
						thumbnail {
							childImageSharp {
								gatsbyImageData
							}
						}
					}
					fields {
						slug
					}
					parent {
						... on File {
							changeTime(formatString: "MMMM D, YYYY")
						}
					}
				}
			}
		}
	}
`;
