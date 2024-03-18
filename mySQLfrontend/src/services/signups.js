import axios from "axios";
const baseUrl = "http://localhost:8081/api/users";

const signup = async (signupObject) => {
    const response = await axios.post(baseUrl, signupObject);
    return response.data;
};

const deleteAccount = async (accountId) => {
    const response = await axios.delete(`${baseUrl}/${accountId}`);
    return response.data;
};

export default { signup, deleteAccount };
