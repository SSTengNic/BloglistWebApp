import axios from "axios";
const baseUrl = "http://localhost:8081/api/bloglist";

let token = null;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
};

const getAll = async () => {
    try {
        const response = await axios.get(baseUrl); // how do i change this to async?
        return response.data;
    } catch (error) {
        console.error(
            "FRONTEND/services/blogs/getAll, Error fetching blogs:",
            error
        );
        throw error; // rethrow the error for the caller to handle
    }
};

const create = async (newObject) => {
    const config = {
        headers: { Authorization: token },
    };

    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
};

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject);
};

const delBlog = async (id) => {
    const config = {
        headers: { Authorization: token },
    };

    console.log("FRONTEND/services/blogs, Deleting blog with id: ", id);
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return console.log(
        "FRONTEND/services/blogs/delBlog, Blog has been deleted successfully: ",
        response.data
    );
};

export default { getAll, create, update, setToken, delBlog };
