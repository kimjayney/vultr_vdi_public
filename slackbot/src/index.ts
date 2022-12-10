/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	SLACK_WEBHOOK_URL: string,
	GIT_PAT:string
	BLOCKSTORAGE_ID: string
	SNAPSHOT_ID: string,
	GITHUB_ACTION_DEPLOY_YAML_URL: string,
	GITHUB_ACTION_DESTROY_YAML_URL: string,
	VULTR_API_KEY: string

}

export default {
	async fetch(request:Request, env:Env) {
		return await handleRequest(request,env).catch(
		(err) => new Response(err.stack, { status: 500 })
		)
	}
}
async function handleRequest(request:Request, env: Env) {
	const { pathname } = new URL(request.url);
	if (pathname.startsWith("/webhook") && request.method == "POST") {
		const message = await request.json()
		if (String(message.event.text).includes("서버생성")) {
			const MessageSplit = message.event.text.split("/")
			if (MessageSplit.length > 1) {
				const replyText = {
					text : `아래 사양으로 서버를 만들고 있습니다.${MessageSplit[1]}`
				}
				const slackPoster = await fetch(env.SLACK_WEBHOOK_URL, {
					body: JSON.stringify(replyText) ,
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
				});
				const plan = MessageSplit[1]
				const gitActionData = {ref:"main",inputs:{snapshot_id:env.SNAPSHOT_ID, plan: plan}}
				const ActionCaller = await fetch(env.GITHUB_ACTION_DEPLOY_YAML_URL, {
					body: JSON.stringify(gitActionData),
					headers: {
						'Accept': 'application/vnd.github+json',
						'Authorization': `Bearer ${env.GIT_PAT}`,
						'User-Agent': 'Awesome-Octocat-App'
					},
					method: "POST"
				}).then((response) => response.text()).then((data) => console.log(data))
			} else {
				const replyText = {
					text : "서버를 만들 사양을 아래와 같이 보내주세요. 서버생성/vhf-1c-1gb/사양"
				}
				const slackPoster = await fetch(env.SLACK_WEBHOOK_URL, {
					body: JSON.stringify(replyText) ,
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
				});
			}
		} else if (String(message.event.text).includes("서버삭제")) {
			const replyText = {
				text : "서버를 제거하고 있습니다."
			}
			
			const slackPoster = await fetch(env.SLACK_WEBHOOK_URL, {
				body: JSON.stringify(replyText) ,
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});
			const gitActionData = {ref:"main"}
			const ActionCaller = await fetch(env.GITHUB_ACTION_DESTROY_YAML_URL, {
				body: JSON.stringify(gitActionData),
				headers: {
					'Accept': 'application/vnd.github+json',
					'Authorization': `Bearer ${env.GIT_PAT}`,
					'User-Agent': 'Awesome-Octocat-App'
				},
				method: "POST"
			}).then((response) => response.text()).then((data) => console.log(data))
		}
		return new Response(env.GITHUB_ACTION_DEPLOY_YAML_URL, {
			headers: { "Content-Type": "application/json" },
		});
	}
	if (pathname.startsWith("/attach_blockstorage")) {
		const message = await request.json()
		const vultrApiBody = {
			instance_id : message.instance_id,
			live : true
		}
		const vultrApiCaller = await fetch(`https://api.vultr.com/v2/blocks/${env.BLOCKSTORAGE_ID}/attach`, {
			body: JSON.stringify(vultrApiBody) ,
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${env.VULTR_API_KEY}`,
			},
		}).then((response) => response.text()).then((data) => console.log(data))
		console.log(env.BLOCKSTORAGE_ID)
		const replyText = {
			text : `서버에 하드디스크를 부착했습니다.`
		}
		const slackPoster = await fetch(env.SLACK_WEBHOOK_URL, {
			body: JSON.stringify(replyText) ,
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		});
		return new Response(env.BLOCKSTORAGE_ID, {
			headers: { "Content-Type": "application/json" },
		});
	}
	if (pathname.startsWith("/status")){
		return new Response(JSON.stringify({status : "OK"}), {
			headers: { "Content-Type": "application/json" },
		});
	}

	return fetch("https://welcome.developers.workers.dev");
}