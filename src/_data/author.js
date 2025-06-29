import slugify from '../_includes/helpers/slugify.js';

export default {
	name: {
		first: 'Jina',
		toString() {
			return [this.first, 'Anne'].join(' ');
		},
	},

	get username() {
		return { default: slugify(this.name.first), github: this.default };
	},
};
