import Api from './Api'

export default {
	post(request) {
		return Api().post('esam', request);
	},
}