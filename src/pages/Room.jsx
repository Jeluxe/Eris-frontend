import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getMessages } from "../api";
import { Avatar, Footer, Input, Options } from "../components";
import { useSocketIOProvider, useStateProvider } from "../context";
import { formatDate, getTime, messagePositioning, messageRenderer } from "../functions";

const Room = () => {
	const params = useParams();
	const { emitData } = useSocketIOProvider();
	const { messages, setMessages, selectedRoom } = useStateProvider();
	const [loading, setLoading] = useState(true);
	const [selectedMessage, setSelectedMessage] = useState(null);
	const [editedContent, setEditedContent] = useState(null);

	useEffect(() => {
		if (params?.id) {
			getMessages(params?.id)
				.then((messages) => {
					setMessages(messages);
					setLoading(false);
				})
				.catch(err => console.error(err));
		}
	}, [params])

	const filterMessages = (msg) => {
		return (selectedRoom) ? selectedRoom.id === msg.rid : "";
	}

	const editMessage = (message) => {
		setSelectedMessage(message);
		setEditedContent(message.content);
	}

	const deleteMessage = async (message) => {
		if (confirm('Are you sure you want to delete this message?')) {
			emitData('delete-message', { id: message.id, rid: message.rid }, ({ deletedMessageID, error }) => {
				if (!error) {
					setMessages(prevMessages => [...prevMessages.filter((message) => message.id !== deletedMessageID)])
				} else {
					console.log(error)
				}
			});
			console.log('message has been deleted!');
		}
	}

	const onKeyDown = e => {
		if (e.key === 'Escape') {
			setSelectedMessage(null);
			setEditedContent(null);
		}

		if (e.key === "Enter") {
			if (editedContent.trim().length === 0) {
				deleteMessage(selectedMessage);
			} else if (selectedMessage.content !== editedContent) {
				emitData('edit-message',
					{ message: selectedMessage, newContent: editedContent }, ({ editedMessage, error }) => {
						if (!error) {
							const updatedMessages = [...messages.map(message =>
								message.id === editedMessage.id ? editedMessage : message
							)]
							setMessages(updatedMessages)
						} else {
							console.log(error)
						}
					});
			}
			setSelectedMessage(null)
			setEditedContent(null)
		}
	}

	const onChange = e => {
		setEditedContent(e.target.value)
	}

	const inputRenderer = () => {
		return <Input type="text" autoFocus value={editedContent} onChange={onChange} onKeyDown={onKeyDown} />
	}

	const optionsRenderer = (message) => {
		return <Options type={message.type} selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} editMessage={() => editMessage(message)} deleteMessage={() => deleteMessage(message)} />
	}

	if (loading) {
		return <div>Loading...</div>;
	} else {
		return (
			<div className="chat-container">
				<div className="messages-container">
					<div className="messages-wrapper">
						{messages?.filter(filterMessages).map((message, idx) => {
							return (
								<div key={idx} className="message v-center">
									{messagePositioning(messages[idx - 1], message) ? (
										<>
											<Avatar size={35} bgColor={message.sender.avatar} />
											<div>
												<div>
													<span className="message-sender">{message.sender.username}</span>
													<span className="message-date">
														{formatDate(message.timestamp)}
													</span>
												</div>
												{selectedMessage?.id === message.id ? inputRenderer() : messageRenderer(message)}
											</div>
											{optionsRenderer(message)}
										</>
									) : (
										<>
											<span className="message-time">
												{getTime(message.timestamp)}
											</span>
											<>
												{selectedMessage?.id === message.id ? inputRenderer() : messageRenderer(message)}
											</>
											{optionsRenderer(message)}
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
	}
};

export default Room;
