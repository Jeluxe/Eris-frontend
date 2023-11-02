import { useState } from "react";
import { Avatar, Footer } from "../components";
import { createElementForMessage, getTime, messagePositioning, getDate } from "../functions";

const Room = () => {
	let loading = false;
	const [messages, setMessages] = useState([]);

	if (loading) {
		return <div>Loading...</div>;
	} else {
		return (
			<div className="chat-container">
				<div className="messages-container">
					<div className="messages-wrapper">
						{messages?.map((message, idx) => {
							return (
								<div key={idx} className="message">
									{messagePositioning(messages[idx - 1], message) ? (
										<>
											<Avatar size={35} bgColor={message.sender.color} />
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
				<Footer setMessages={setMessages} />
			</div>
		);
	};
};

export default Room;
