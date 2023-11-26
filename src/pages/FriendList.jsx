import React, { useEffect, useState } from "react";
import { Friend, NewFriendForm } from "../components";
import { useStateProvider } from "../context";

const userStatus = ['online', 'offline', 'idle'];
const requestStatus = ["pending", "approved", "blocked"]

const FriendList = () => {
	const { friendList, selectedFilter, smallDevice } = useStateProvider();
	const [friendListObject, setFriendListObject] = useState({})

	useEffect(() => setFriendListObject(filterArray(friendList)), [friendList])

	const filterClientsByStatus = (client) => {
		const validation = client.requestStatus !== "pending" && client.requestStatus !== "blocked"
		const status = "offline"

		switch (selectedFilter) {
			case "All":
				return userStatus.includes(status) && validation
			case "Online":
				return userStatus.includes(status) && status === "online" && validation
			case "Blocked":
				return requestStatus.includes(client.requestStatus) && client.requestStatus === "blocked"
			case "Pending":
				return requestStatus.includes(client.requestStatus) && client.requestStatus === "pending"
			default:
				break;
		}
	}

	const filterArray = (friends) => {
		const filteredObject = {
			"online": [],
			"offline": [],
			"idle": []
		}

		friends.forEach(friend => {
			if (friend.requestStatus !== 'pending' && friend.requestStatus !== 'blocked') {
				filteredObject[friend?.user?.status || 'offline'] = [...filteredObject[friend?.user?.status || 'offline'], friend]
			}
		});

		return filteredObject
	}

	return (
		<div className="friends-container">
			{
				!selectedFilter ? <NewFriendForm /> :
					smallDevice ?
						<div className="friend-list">
							{Object.entries(friendListObject).map(([key, list], idx) => {
								return <div key={idx}>
									<b>{key}</b>
									<div>{list.map((candidate, idx) => {
										// candidate.user = candidate.sender.id !== user.id ? candidate.sender : candidate.receiver;
										return <Friend key={idx} data={candidate} />
									})}</div>
								</div>
							})}
						</div>
						:
						<div className="friend-list">
							{
								friendList.filter(filterClientsByStatus)
									.map((friend, idx) => {
										// friend.user = friend.sender.id !== user.id ? friend.sender : friend.receiver;
										return <Friend key={idx} data={friend} />
									})
							}
						</div>
			}
		</div>

	);
};

export default FriendList;
