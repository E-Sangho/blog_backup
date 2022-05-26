import react from "react";
import styled from "styled-components";

const Container = styled.div`
	width: 100%;

	display: flex;
	flex-direction: column;
`;

const Title = styled.div`
	width: 100%;

	display: flex;
	justify-content: flex-start;
`;
const GridContainer = styled.div`
	width: 100%;

	display: grid;
	grid-template-columns: repeat(3, 1fr);
`;
const GridItem = styled.div`
	width: 100%;
	height: 40vw;
`;

interface IColumn3Box {
	title: string;
}

function Column3Box({ title }: IColumn3Box) {
	return (
		<Container>
			<Title>{title}</Title>
			<GridContainer></GridContainer>
		</Container>
	);
}

export default Column3Box;
