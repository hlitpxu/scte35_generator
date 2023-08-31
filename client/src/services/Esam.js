import axios from 'axios'

export default {
	post(request) {
		return axios.post('/esam', request);
	},
}