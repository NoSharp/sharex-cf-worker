/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {

	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	IMAGE_BUCKET: R2Bucket;
	AUTHORIZATION_KEY: String;
	IMAGE_PREFIX_URL: String;
}


function canCreateNewImage(request: Request, env: Env){
	return (request.headers.get("auth") ?? "") === env.AUTHORIZATION_KEY;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		
		const { protocol, pathname } = new URL(request.url);
		if(request.method === "POST"){
			if(!canCreateNewImage(request, env)){
				return new Response("Unauthorized", {
					status: 403
				});
			}
			const key = crypto.randomUUID();
			await env.IMAGE_BUCKET.put(key, request.body);
			return new Response(`${env.IMAGE_PREFIX_URL}/${key}`, {
				status: 200
			});

		}else if(request.method === "GET"){
			const key = pathname.slice(1);
			const object = await env.IMAGE_BUCKET.get(key);
			if(!object) return new Response("404", {status: 404});
			return new Response(await object.arrayBuffer(), {
				status: 200,
				headers: {
					"Content-Type": object?.httpMetadata?.contentType ?? '',
					"Cache-Control": `public, max-age=${ 60 * 60 * 24 * 30}`
				}
			})
		}

		return new Response("404", {
			status: 404
		})
	},
};
