# Start here — complete website package

Everything is included. Use this package instead of earlier ZIP files.

## 1. Upload the website
Unzip the package. Upload the contents directly into IJabea/IJabea.github.io, with index.html at the repository root. Keep the scripts and ai-backend folders. On Mac, press Command + Shift + Period to show the included .github folder. Its workflow must be placed at .github/workflows/scholar-pages.yml. If GitHub upload does not include it, use Add file > Create new file and paste the contents of SCHOLAR_WORKFLOW.txt into that exact path.

If you have already configured chat-config.js on GitHub, preserve its endpoint URL; this package's endpoint is blank because AI has not been activated in this session. No API keys belong in the uploaded files.

The static pages, university/article dropdowns, animated map and website-guide chat work before either API is configured. Local preview: open index.html in a browser after unzipping.

## 2. Activate automatic Scholar updates later
- Create/use a SerpApi account. This is a separate service from OpenAI.
- In repository Settings > Secrets and variables > Actions, create a repository secret named SERPAPI_API_KEY with your SerpApi key.
- Allow the workflow's GitHub actions and write access under Settings > Actions > General. Respect any branch protection requirements.
- Under Settings > Pages, select GitHub Actions as the publishing source. Use the supplied workflow for deployment; avoid having another workflow deploy an older copy of the site.
- Under Actions, run Update Scholar map and publish website. Confirm its build and deploy jobs finish successfully.

After activation, daily checks import articles and publish the updated map. The job runs at 08:23 UTC; schedules can be delayed. New coauthors without a reliable directory location remain pending. AUTOMATIC_UPDATES.md contains details and quota notes. A missing secret causes a scheduled/manual sync to fail safely; the published site stays available.

## 3. Activate AI chat later
The backend is in ai-backend. Its configured model is gpt-4.1-mini; check model access in your OpenAI API project.

1. Create/use Cloudflare Workers and an OpenAI API account with billing enabled.
2. With Node.js installed, open Terminal inside ai-backend and run these commands separately:

   npx wrangler login

   npx wrangler deploy

   npx wrangler secret put OPENAI_API_KEY

3. Enter your OpenAI key only at that final private prompt. Alternatively, add OPENAI_API_KEY as a secret in the deployed Worker's dashboard.
4. Copy the deployed Worker's HTTPS URL into the website's chat-config.js:

   window.SITE_CHAT_ENDPOINT = "https://YOUR-WORKER.workers.dev";

5. Upload/commit chat-config.js. The chat panel switches to AI mode. Test an academic question and an unknown question on the live site.

The Worker accepts https://ijabea.github.io as its website origin. If you use a custom domain, update ALLOWED_ORIGIN in ai-backend/wrangler.jsonc and redeploy. Uploading ai-backend to GitHub alone does not run it; it must be deployed to Cloudflare. The supplied Pages workflow publishes only root website assets and excludes backend/scripts folders.

## Keys and settings
| Setting | Where to put it |
| --- | --- |
| SERPAPI_API_KEY | GitHub repository Actions secret |
| OPENAI_API_KEY | Cloudflare Worker secret |
| Worker HTTPS URL | Public chat-config.js file |

Never put secret keys in chat-config.js or any public file. The URL is public and is not an API key.

## What has been checked
All eight pages and the previous map/chat features were checked in a local browser. The new university dropdown was checked with article filtering, selected institution details, keyboard controls and mobile width. Scholar import logic was checked using simulated responses for duplicates, ambiguous locations, bad links and provider failure. Actual external API calls and deployment still require your accounts and keys.

The AI backend uses a prepared knowledge snapshot. Daily Scholar updates refresh the map, not that separate deployed snapshot. Update ai-backend/knowledge.json and redeploy the Worker when you want the AI's publication knowledge refreshed.
