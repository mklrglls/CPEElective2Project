const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


export async function fetchRooms() {
  const response = await fetch(`${API_BASE_URL}/rooms`);
  if (!response.ok) {
    throw new Error("Failed to fetch rooms");
  }
  return await response.json();
}




