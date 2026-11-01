import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../consts';

/**
 * Construeix el feed RSS d'un idioma.
 *
 * Els posts viuen a src/content/blog/<lang>/<slug>.md, així que `post.id` és
 * "<lang>/<slug>". La URL pública, però, és /<lang>/blog/<slug>/ (el prefix
 * "blog" el posa src/pages/<lang>/blog/[...slug].astro). Cal construir-la
 * explícitament: fer `/${post.id}/` genera /ca/<slug>/, que és un 404.
 */
export async function buildFeed(context: APIContext, lang: string) {
	const posts = (await getCollection('blog', ({ id }) => id.startsWith(`${lang}/`))).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);

	return rss({
		title: `${SITE_TITLE} (${lang})`,
		description: SITE_DESCRIPTION,
		site: context.site ?? new URL(SITE_URL),
		customData: `<language>${lang}</language>`,
		items: posts.map((post) => {
			const slug = post.id.replace(new RegExp(`^${lang}/`), '');
			return {
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: `/${lang}/blog/${slug}/`,
			};
		}),
	});
}
