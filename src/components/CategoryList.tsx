import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";

const CategoryListContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 32px 0px;
	box-sizing: border-box;
	font-family: "Roboto";
`;

const GridContainer = styled.div`
	display: grid;
	width: 100%;
	max-width: 1024px;
	grid-template-columns: repeat(auto-fill, minmax(auto, 128px));
	justify-items: center;
	margin-bottom: 16px;
`;

const CategoryItem = styled(Link)<ICategoryLink>`
	font-weight: ${(props) => (props.$active ? "bold" : "normal")};
	color: ${(props) => (props.$active ? props.theme.secondaryColor : "black")};
`;

const UnderLine = styled.div`
	width: 100%;
	max-width: 1024px;
	margin-bottom: 2px;
	height: 2px;
	background-color: ${({ theme }) => theme.grayColor.opacity__100};
`;

export interface ICategoryList {
	selectedCategory: string;
	categoryList: {
		[key: string]: number;
	};
}

interface ICategoryLink {
	$active: boolean;
}

function CategoryList({ selectedCategory, categoryList }: ICategoryList) {
	return (
		<CategoryListContainer>
			<GridContainer>
				{Object.entries(categoryList).map(([name, count]) => (
					<CategoryItem
						to={`/posts/?category=${name}`}
						$active={name === selectedCategory}
						key={name}
					>
						{name} {count}
					</CategoryItem>
				))}
			</GridContainer>
			<UnderLine />
			<UnderLine />
		</CategoryListContainer>
	);
}

export default CategoryList;
