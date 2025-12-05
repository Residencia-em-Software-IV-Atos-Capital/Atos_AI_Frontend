import axios from "axios";

const API_BASE_URL = "http://localhost:8000/years";

export async function getAvailableYears() {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data.data;
}