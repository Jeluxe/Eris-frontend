import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getMessages } from "../api";
import { Avatar, Footer, Options, Textarea } from "../components";
import { useSocketIOProvider, useStateProvider } from "../context";
import { formatDate, getTime, messagePositioning, messageRenderer } from "../functions";

const Room = () => {
	const params = useParams();
	const { emitData } = useSocketIOProvider();
	const { user, messages, setMessages } = useStateProvider();
	const [loading, setLoading] = useState(true);
	const [selectedMessage, setSelectedMessage] = useState(null);
	const [editedContent, setEditedContent] = useState(null);

	useEffect(() => {
		const fetchMessages = async () => {
			if (params?.id) {
				try {
					if (!messages[params.id]?.length) {
						const messagesData = await getMessages(params.id);
						setMessages((prevMessages) => ({ ...prevMessages, [params.id]: messagesData }));
					}
					setLoading(false);
				} catch (error) {
					console.error('Error fetching messages:', error);
				}
			}
		}
		fetchMessages();
	}, [params]);

	const editMessage = (message) => {
		setSelectedMessage(message);
		setEditedContent(message.content);
	}

	const deleteMessage = async (message) => {
		if (confirm('Are you sure you want to delete this message?')) {
			emitData('delete-message', { id: message.id, rid: message.rid }, ({ deletedMessageID, error }) => {
				if (!error) {
					setMessages(messages => ({
						...messages,
						[message.rid]: messages[message.rid].filter(message =>
							message.id !== deletedMessageID)
					}));
				} else {
					console.log(error);
				}
			});
			console.log('message has been deleted!');
		}
	}

	const handleEditing = () => {
		if (editedContent.trim().length === 0) {
			deleteMessage(selectedMessage);
		} else if (selectedMessage.content !== editedContent) {
			emitData('edit-message',
				{ message: selectedMessage, newContent: editedContent }, ({ editedMessage, error }) => {
					if (!error) {
						setMessages(messages => ({
							...messages,
							[editedMessage.rid]: messages[editedMessage.rid].map(message =>
								message.id === editedMessage.id ? editedMessage : message)
						}));
					} else {
						console.log(error);
					}
				});
		}
		closeEditMode();
	}

	const closeEditMode = () => {
		setSelectedMessage(null);
		setEditedContent(null);
	}

	const onInput = e => {
		setEditedContent(e.target.value);
	}

	const onKeyDown = e => {
		if (e.key === 'Escape') {
			closeEditMode();
		}

		if (e.key === 'Enter' && !e.shiftKey) {
			handleEditing();
		}
	}

	const handleChanges = (e, isCancelled) => {
		e.preventDefault();
		if (isCancelled) {
			closeEditMode();
		} else {
			handleEditing();
		}
	}

	const inputRenderer = () => (
		<div className="edit-mode">
			<Textarea autoFocus message={editedContent} onInput={onInput} onKeyDown={onKeyDown} />
			<span style={{ fontSize: "12px" }}>Esc to <a className="edit-label" onClick={e => handleChanges(e, true)}>cancel</a>•Enter to <a className="edit-label" onClick={e => handleChanges(e, false)}>save</a></span>
		</div>
	);

	const optionsRenderer = (message) => {
		if (selectedMessage?.id !== message.id && message.sender.id === user.id)
			return <Options type={message.type} selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} editMessage={() => editMessage(message)} deleteMessage={() => deleteMessage(message)} />
	}

	return (
		<div className="chat-container">
			{!loading ? (
				<div className="messages-container">
					<div className="messages-wrapper">
						{messages[params?.id]?.map((message, idx) => (
							<div key={idx} className="message v-center">
								{messagePositioning(messages[params?.id][idx - 1], message) ? (
									<>
										<Avatar size={35} bgColor={message.sender.avatar} />
										<div className="message-wrapper">
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
										{selectedMessage?.id === message.id ? inputRenderer() : messageRenderer(message)}
										{optionsRenderer(message)}
									</>
								)}
							</div>
						))}
					</div>
				</div>
			) : (
				"loading..."
			)}
			<Footer />
		</div>
	);
};

export default Room;
