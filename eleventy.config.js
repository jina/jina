/**
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 */

import latestVersion from 'latest-version';

export const config = { dir: { input: 'src', output: '.' } };

export default (eleventyConfig) => {
	eleventyConfig.on('eleventy.beforeConfig', async () => {
		function script(
			name,
			command,
			{ dependencies = [], files = [], output = [] } = {},
		) {
			return {
				[name]: {
					command,
					...(dependencies.length > 0 ? { dependencies } : {}),
					...(files.length > 0 ? { files } : {}),
					...(output.length > 0 ? { output } : {}),
				},
			};
		}

		function formatter(
			name,
			files,
			flags,
			{
				dependencies = name === 'prettier' ? [] : ['format:prettier'],
				glob = '.',
				output,
				packageName = name,
			} = {},
		) {
			return script(
				`format:${name}`,
				`npx ${packageName} ${glob} ${flags.map((flag) => `--${flag}`).join(' ')}`,
				{ dependencies, files, output },
			);
		}

		const allFileExtensions = '**/*.{js,json,md,yaml,yml}';
		const mdExtensions = '**/*.md';
		const permalink = 'package.json';

		const formatters = {
			...formatter(
				'prettier',
				[allFileExtensions, '.editorconfig', 'LICENSE'],
				['cache', 'write'],
			),
			...formatter('eslint', [allFileExtensions], ['cache', 'fix'], {
				output: ['.eslintcache'],
			}),
			...formatter(
				'markdownlint',
				[mdExtensions, '.gitignore', '.markdownlint-cli2.yaml'],
				['fix'],
				{ glob: `'${mdExtensions}'`, packageName: 'markdownlint-cli2' },
			),
		};

		const scripts = {
			...formatters,
			...script('format', "echo 'Formatting...'", {
				dependencies: Object.keys(formatters),
			}),
			...script('build', 'npx @11ty/eleventy', {
				files: ['eleventy.config.js'],
			}),
			...script('postbuild', 'npm run format'),
		};

		eleventyConfig.addTemplate(
			`${permalink}.njk`,
			JSON.stringify(
				{
					name: 'jina',
					type: 'module',
					private: true,
					scripts: Object.keys(scripts).reduce((obj, key) => {
						obj[key] = 'wireit';
						return obj;
					}, {}),

					devDependencies: Object.fromEntries(
						await Promise.all(
							[
								...Object.keys(formatters).map((key) =>
									key.replace('format:', ''),
								),
								'@11ty/eleventy',
								'@eslint/js',
								'@eslint/json',
								'@eslint/markdown',
								'@ianvs/prettier-plugin-sort-imports',
								'eslint-config-prettier',
								'eslint-plugin-html',
								'eslint-plugin-only-warn',
								'eslint-plugin-yml',
								'globals',
								'latest-version',
								'markdownlint-cli2',
								'prettier-plugin-pkg',
								'prettier-plugin-sort-json',
								'wireit',
							].map(async (dep) => [dep, `^${await latestVersion(dep)}`]),
						),
					),
					wireit: scripts,
				},
				null,
				'\t',
			),
			{ permalink },
		);
	});
};
