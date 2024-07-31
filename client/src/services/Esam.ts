import axios from 'axios'

export default {
	post(request: any) {
		return axios.post('/esam', request);
	},
}