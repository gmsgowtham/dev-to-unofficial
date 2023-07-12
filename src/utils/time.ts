export const secondsToHMS = (d: number): string => {
	const h = Math.round(d / 3600);
	const m = Math.round((d % 3600) / 60);
	const s = Math.round((d % 3600) % 60);

	const hDisplay = h > 0 ? `${String(h).padStart(2, "0")}:` : "";
	const mDisplay = m > 0 ? `${String(m).padStart(2, "0")}:` : "00:";
	const sDisplay = s > 0 ? `${String(s).padStart(2, "0")}` : "00";

	return `${hDisplay}${mDisplay}${sDisplay}`;
};
