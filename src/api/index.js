import axios from "axios"

export const getMessages = async (id) => {
  try {
    const res = await axios.get(`/api/${id}/messages`)
    const { data: { messages } } = res
    if (messages) return messages
  } catch (error) {
    console.error(error)
  }
}

export const fetchData = async () => {
  try {
    const { data: { rooms, friends } } = await axios.get(`/api/data`);
    return { rooms, friends }
  } catch (error) {
    console.error(error)
  }
}

export const refresh = () => axios.post('/api/refresh')