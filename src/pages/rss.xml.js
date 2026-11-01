import { buildFeed } from '../utils/feed';

// Feed històric (arrel). Serveix el català, que és l'idioma per defecte.
export async function GET(context) {
	return buildFeed(context, 'ca');
}
