import { useEffect, useState } from "react";

function ActiveHash(targetIds: string[]) {
	const [activeHash, setActiveHash] = useState("");
	const options = {
		rootMargin: "0px",
		threshold: 1.0,
	};
	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveHash(entry.target.id);
				}
			}, options);
		});

		targetIds.forEach((id) => {
			if (document.getElementById(id) !== null) {
				observer.observe(document.getElementById(id) as HTMLElement);
			}
		});

		return () => {
			targetIds.forEach((id) => {
				observer.unobserve(document.getElementById(id) as HTMLElement);
			});
		};
	}, []);
	return activeHash;
}

export default ActiveHash;
