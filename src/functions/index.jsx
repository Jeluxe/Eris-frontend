import CustomAudioBar from "../components/CustomAudioBar";

export const getRandomColor = () => {
	// Define the characters that can be used in a hexadecimal color
	var chars = "0123456789ABCDEF";
	// Start with a hash sign
	var color = "#";
	// Loop six times, adding a random character to the color
	for (var i = 0; i < 6; i++) {
		// Pick a random index from the chars string
		var index = Math.floor(Math.random() * 16);
		// Append the character at that index to the color
		color += chars[index];
	}
	// Return the random color
	return color;
};

export const messagePositioning = (prevMsg, nextMsg) => {
	if (
		!prevMsg ||
		prevMsg.sender?.id !== nextMsg.sender?.id ||
		Date.parse(nextMsg.timestamp) - Date.parse(prevMsg.timestamp) >=
		1000 * 60 * 5 ||
		(isNewDay(prevMsg.timestamp, nextMsg.timestamp) &&
			prevMsg)
	) {
		return true;
	}
	return false;
};

const isNewDay = (prevDate, nextDate) => {
	return getDay(prevDate) !== getDay(nextDate)
}

const getDay = (date) => new Date(date).getDate()

export const formatDate = (recievedDate) => {
	recievedDate = new Date(recievedDate).toISOString();
	let date = new Date().toISOString();

	let processedDate = recievedDate.split("T");
	processedDate[0] = processedDate[0].split("-");

	date = date.split("T");
	date[0] = date[0].split("-");

	if (date[0][0] - processedDate[0][0] === 0) {
		//same year
		if (date[0][1] - processedDate[0][1] === 0) {
			//same month
			if (date[0][2] - processedDate[0][2] === 0) {
				//today
				return humanizeDate(recievedDate, "T");
			} else if (date[0][2] - processedDate[0][2] === 1) {
				//yesterday
				return humanizeDate(recievedDate, "Y");
			}
		}
	}
	//any other date
	return humanizeDate(recievedDate);
};

const humanizeDate = (date, type) => {
	date = new Date(date);
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();

	if (type === "T") {
		return `Today at ${getTime(date)}`;
	} else if (type === "Y") {
		return `Yesterday at ${getTime(date)}`;
	} else {
		return `${day}/${month + 1}/${year} ${getTime(date)}`;
	}
};

export const getTime = (date) => {
	date = new Date(date);
	let hours = date.getHours();
	let minutes = date.getMinutes();

	if (hours < 10) {
		hours = `0${hours}`;
	}

	if (minutes < 10) {
		minutes = `0${minutes}`;
	}

	return `${hours}:${minutes}`;
};

export const calculateTime = (secs) => {
	const minutes = Math.floor(secs / 60);
	const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
	const seconds = Math.floor(secs % 60);
	const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
	return `${returnedMinutes}:${returnedSeconds}`;
};

export const messageRenderer = (message, clicked) => {
	if (message.type === 1) {
		return <div id={`message-${message.id}`} className="message-content">{message.content} {message.edited_timestamp ? "(edited)" : ""}</div>;
	} else if (message.type === 2) {
		return <CustomAudioBar src={`data:audio/wav;base64,${message.content}`} clicked={clicked} />;
	}
};

export const blobToBuffer = (audioBlob) => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			resolve(reader.result);
		};
		reader.readAsArrayBuffer(audioBlob);
	});
};