import React, { useEffect } from "react";
import { graphql } from "gatsby";
import styled from "styled-components";
import Prism from "prismjs";
import DefaultLayout from "../layout/default";
import { IEdges, IPosts } from "../types/IPosts";
import TableOfContents from "../components/TableOfContents";
import MarkdownRenderer from "../components/MarkdownRenderer";
import PostHeroContainer from "../components/Hero/PostHero";
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
	return (
		<DefaultLayout>
			<SeriesContainer>
				<Title>Series</Title>
				<SeriesList>
					{edges.map(
						({
							node: {
								frontmatter: { title, date, series },
								fields: { slug },
							},
						}) => (
							<Link
								to={`/series/${series.replaceAll(
									" ",
									"-"
								)}${slug}`}
							>
								<ListItem key={title}>
									{title}
									{date}
								</ListItem>
							</Link>
						)
					)}
				</SeriesList>
			</SeriesContainer>
		</DefaultLayout>
	);
}

export default PostLayout;

export const querySeriesList = graphql`
	query querySeriesList($series: String) {
		allMarkdownRemark(
			filter: { frontmatter: { series: { eq: $series } } }
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
