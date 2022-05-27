import React from "react";
import styled from "styled-components";
import { IEdges } from "../types/IPosts";
import { GatsbyImage } from "gatsby-plugin-image";
import { graphql, Link, useStaticQuery } from "gatsby";

const Container = styled.div`
	width: 100%;

	display: flex;
	flex-direction: column;
	margin-top: 128px;
`;

const Title = styled.div`
	width: 100%;
	max-width: 1024px;

	display: flex;
	justify-content: flex-start;
	margin: 0 auto;
	box-sizing: border-box;

	font-size: ${({ theme }) => theme.fontSize.h3};
`;

const GridContainer = styled.div`
	width: 100%;
	max-width: 1024px;

	display: grid;
	grid-template-columns: repeat(3, 1fr);
	margin: 0 auto;
	margin-top: 16px;
	column-gap: 16px;
`;

const GridItem = styled.div`
	width: 100%;
	height: 25vw;

	display: flex;
	flex-direction: column;
	box-sizing: border-box;

	border: 1px solid ${({ theme }) => theme.grayColor.opacity__50};
`;

const ItemImage = styled(GatsbyImage)`
	height: 10vw;
	min-height: 100px;
`;

const ItemContents = styled.div`
	width: 100%;

	box-sizing: border-box;
	padding: 16px 16px;
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
`;

const ItemMiddle = styled.div``;
const ItemCategory = styled.div`
	margin-bottom: 8px;

	font-size: ${({ theme }) => theme.fontSize.p};
	color: ${({ theme }) => theme.grayColor.opacity__50};
`;

const ItemTitle = styled.div`
	margin-bottom: 16px;
	font-size: ${({ theme }) => theme.fontSize.h4};
	font-weight: bold;
`;

const ItemSummary = styled.div`
	font-size: ${({ theme }) => theme.fontSize.p};
`;

const ItemDate = styled.div`
	font-size: ${({ theme }) => theme.fontSize.p};
	color: ${({ theme }) => theme.grayColor.opacity__50};
`;

const ItemBottom = styled.div`
	width: 100%;

	display: flex;
	justify-content: space-between;
`;

const ReadPost = styled(Link)`
	font-size: ${({ theme }) => theme.fontSize.h6};
	text-decoration: underline;
	&:hover {
		color: ${({ theme }) => theme.primaryColor};
	}
`;

interface IRecentPost {
	title: string;
}

function RecentPost({ title }: IRecentPost) {
	const data = useStaticQuery(graphql`
		query queryRecentPost {
			allMarkdownRemark(
				sort: {
					fields: [frontmatter___date, frontmatter___title]
					order: DESC
				}
				filter: { frontmatter: { layout: { eq: "post" } } }
				limit: 3
			) {
				edges {
					node {
						frontmatter {
							date(formatString: "MMMM D, YYYY")
							title
							summary
							categories
							thumbnail {
								childImageSharp {
									gatsbyImageData
								}
							}
						}
						fields {
							slug
						}
					}
				}
			}
		}
	`);
	return (
		<Container>
			<Title>{title}</Title>
			<GridContainer>
				{data.allMarkdownRemark.edges.map(
					({
						node: {
							frontmatter: {
								title,
								date,
								summary,
								categories,
								thumbnail: {
									childImageSharp: { gatsbyImageData },
								},
							},
							fields: { slug },
						},
					}: IEdges) => {
						return (
							<GridItem>
								<ItemImage
									image={gatsbyImageData}
									alt="Recent Post Image"
								/>
								<ItemContents>
									<ItemMiddle>
										<ItemCategory>
											{categories}
										</ItemCategory>
										<ItemTitle>{title}</ItemTitle>
										<ItemSummary>{summary}</ItemSummary>
									</ItemMiddle>
									<ItemBottom>
										<ItemDate>{date}</ItemDate>
										<ReadPost to={`/posts${slug}`}>
											Read Post
										</ReadPost>
									</ItemBottom>
								</ItemContents>
							</GridItem>
						);
					}
				)}
			</GridContainer>
		</Container>
	);
}

export default RecentPost;
