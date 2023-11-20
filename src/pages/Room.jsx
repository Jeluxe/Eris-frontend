import { useEffect, useState } from "react";
import { useMatches } from "react-router";
import { useStateProvider } from "../context";
import { createElementForMessage, getTime, messagePositioning, getDate } from "../functions";
import { Avatar, Footer } from "../components";

const Room = () => {
	let loading = false;
	const matches = useMatches()
	const { messages, addSocketEvent, removeSocketEvent } = useStateProvider()
	const [filteredMessages, setFilteredMessages] = useState(messages)

	useEffect(() => {
		setFilteredMessages(messages?.filter(message => message.rid === matches[1]?.params.id))
	}, [matches, messages])

	if (loading) {
		return <div>Loading...</div>;
	} else {
		return (
			<div className="chat-container">
				<div className="messages-container">
					<div className="messages-wrapper">
						{filteredMessages?.map((message, idx) => {
							return (
								<div key={idx} className="message">
									{messagePositioning(messages[idx - 1], message) ? (
										<>
											<Avatar size={35} bgColor={message.sender.avatar} />
											<div>
												<div>
													<span className="message-sender">{message.sender.username}</span>
													<span className="message-date">
														{getDate(message.timestamp)}
													</span>
												</div>
												{createElementForMessage(message)}
											</div>
										</>
									) : (
										<>
											<span className="message-time">
												{getTime(message.timestamp)}
											</span>
											{createElementForMessage(message)}
										</>
									)}
								</div>
							);
						})}
					</div>
				</div>
				<Footer />
			</div>
		);
	};
};

export default Room;
