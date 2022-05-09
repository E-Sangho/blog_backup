import { useState } from "react";
import { useViewportScroll } from "framer-motion";
import { useEffect } from "react";

function CheckScrollDown() {
	const [isScrolled, setIsScrolled] = useState(false);
	const { scrollY } = useViewportScroll();
	useEffect(() => {
		scrollY.onChange(() => {
			if (scrollY.get() > 0) {
				setIsScrolled(true);
				return;
			}
			setIsScrolled(false);
		});
	}, [scrollY]);
	return {
		isScrolled,
	};
}

export default CheckScrollDown;
