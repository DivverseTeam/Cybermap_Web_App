import React from "react";
import SemiCircleProgressBar from "react-progressbar-semicircle";
import { getProgressColor } from "../constants";

export default function ProgressChart() {
	const progress = 72;
	return (
		<SemiCircleProgressBar
			percentage={progress}
			// stroke={getProgressColor(+progress)}
			stroke={"#962DFF"}
			background="#F9F9FB"
			strokeWidth={36}
			width="100%"
			diameter={255}
		/>
	);
}
