import { useEffect, useState } from "react";
import { useMatches } from "react-router";
import { useStateProvider } from "../context";
import { messageRenderer, getTime, messagePositioning, formatDate } from "../functions";
import { Avatar, Footer, Input, Options } from "../components";
import { getMessages } from "../api";

const Room = () => {
	let loading = false;
	const matches = useMatches()
	const { messages, setMessages, selectedRoom, emitData } = useStateProvider()
	const [selectedMessage, setSelectedMessage] = useState(null)
	const [editedMessage, setEditedMessage] = useState(null)

	useEffect(() => {
		if (matches[1].params.id) {
			getMessages(matches[1].params.id)
				.then((messages) => setMessages(messages))
				.catch(err => console.error(err))
		}
	}, [matches])

	const filterMessages = (msg) => {
		return (selectedRoom) ? selectedRoom.id === msg.rid : "";
	}

	const editMessage = (id, content) => {
		setSelectedMessage(id)
		setEditedMessage(content)
	}

	const deleteMessage = async (id) => {
		if (confirm('Are you sure you want to delete this message?')) {
			emitData('delete-message', id)
			console.log('message has been deleted!')
		}
	}

	const onKeyDown = e => {
		if (e.key === 'Escape') {
			setSelectedMessage(null)
			setEditedMessage(null)
		}

		if (e.key === "Enter") {
			if (editedMessage.trim().length === 0) {
				deleteMessage(selectedMessage)
			} else {
				emitData('edit-message', { id: selectedMessage, content: editedMessage })
				console.log('message has been edited!')
				setSelectedMessage(null)
				setEditedMessage(null)
			}
		}
	}

	const onChange = e => {
		setEditedMessage(e.target.value)
	}

	const inputRenderer = () => {
		return <Input type="text" autoFocus value={editedMessage} onChange={onChange} onKeyDown={onKeyDown} />
	}

	const optionsRenderer = (message) => {
		return <Options type={message.type} selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} edit={() => editMessage(message.id, message.content)} deleteMessage={() => deleteMessage(message.id)} />
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
								<div key={idx} className="message">
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
												{selectedMessage === message.id ? inputRenderer(message.content) : messageRenderer(message)}
											</div>
											{optionsRenderer(message)}
										</>
									) : (
										<>
											<span className="message-time">
												{getTime(message.timestamp)}
											</span>
											<>
												{selectedMessage === message.id ? inputRenderer(message.content) : messageRenderer(message)}
												{message.edited && <span>(edited)</span>}
											</>
											{optionsRenderer(message)}
										</>
									)}
								</div>
							);
						})}
					</div>
				</div>
				{selectedMessage ? "" : <Footer />}
			</div>
		);
	};
};

export default Room;
