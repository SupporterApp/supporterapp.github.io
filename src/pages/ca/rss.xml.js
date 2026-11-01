import { buildFeed } from '../../utils/feed';

export async function GET(context) {
	return buildFeed(context, 'ca');
}
