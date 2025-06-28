import _ from 'lodash';

const firstName = 'Jina';

export default {
	name: `${firstName} Anne`,

	username: { github: _.kebabCase(firstName) },
};
