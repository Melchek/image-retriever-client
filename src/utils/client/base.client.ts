import axios from 'axios'

const initClient = () => {
    axios.defaults.baseURL = 'http://127.0.0.1:5000';
}

export { initClient }