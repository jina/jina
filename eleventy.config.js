/**
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 */

import jsYaml from 'js-yaml';

export const config = {
	dir: { input: 'src', output: '.', layouts: '_includes/layouts' },
};

export default (eleventyConfig) => {
	eleventyConfig.addDataExtension('yml', (content) => jsYaml.load(content));

	['md', 'plain-text'].forEach((layout) =>
		eleventyConfig.addLayoutAlias(layout, `${layout}.njk`),
	);

	eleventyConfig.setLayoutResolution(false);
};
