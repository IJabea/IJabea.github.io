# Activate daily Google Scholar updates

Prepared for IJabea/IJabea.github.io and profile qjryeWoAAAAJ. NOT ACTIVE until the files, secret, and Pages setting below are installed. No account was created or billed. No live provider call or live deployment was performed in preparation; importer logic is tested with synthetic responses.

## One-time setup
1. Create a free SerpApi account at https://serpapi.com/users/sign_up and copy the API key privately. This is separate from the OpenAI key used by AI chat. The currently advertised free plan allows 250 searches/month (checked September 20, 2026).
2. Upload the full website contents to the repository root, including the scripts folder. Keep any existing chat-config.js endpoint you have already activated.
3. Install the workflow at EXACTLY .github/workflows/scholar-pages.yml. On a Mac this folder may be hidden; Cmd+Shift+Period shows it. Alternatively use GitHub Add file > Create new file, enter .github/workflows/scholar-pages.yml as the filename, then paste the supplied YAML. The package includes a visible SCHOLAR_WORKFLOW.txt copy for this purpose. Do not use the .txt file as the workflow itself.
4. Repository Settings > Secrets and variables > Actions > New repository secret: name SERPAPI_API_KEY, value your private SerpApi key. Never put this key in an uploaded file or chat message.
5. Settings > Actions > General: allow the included GitHub actions and workflow write access. Branch protection may require an administrator to permit this workflow's commits; do not disable protection blindly.
6. Settings > Pages > Build and deployment > Source: GitHub Actions. If you already have a custom Pages deployment workflow, replace its deployment role with this combined workflow to avoid competing deployments; keep unrelated workflows.
7. Actions > Update Scholar map and publish website > Run workflow. Verify both the build and deploy jobs are green. The Collaborators page should show the last successful Scholar check.

## Behavior
- Runs daily at 08:23 UTC (GitHub may delay the run) and manually on demand. Pushes publish website edits without making provider requests.
- Fetches the profile in pages of up to 100 articles. Retrieves complete citation details for new/changed imported articles. Maximum six provider requests per run; queued papers continue in later runs. For your small profile, normally one request per day plus new article detail requests. Maximum 186 requests over 31 scheduled daily runs; extra manual runs and other uses of the same account consume additional quota.
- Exact normalized article titles and stored Scholar citation IDs prevent duplicates. Reviewed title aliases are included for the renamed splitting paper. A genuinely changed unbound title may require merging manually. The five curated records and their reviewed affiliations are preserved. Removed Scholar entries are not automatically deleted from the website.
- Known full names reuse a single recorded directory location, explicitly labelled as directory-based, not a verified affiliation for the new article. New names, abbreviations, ambiguous names and people with multiple recorded institutions stay pending. This avoids inventing a country.
- To confirm a collaborator, edit scripts/collaborator-directory.json with an existing location key and optional exact name aliases. Add new institution coordinates in publications-map.js under locations. The next successful sync resolves pending imported names. Setting confirmedForArticle: true on a manually verified imported author preserves that record on future updates.
- The map recalculates routes and counts from articles. The workflow commits the updated data and explicitly deploys the website, because bot commits alone may not trigger a branch-based Pages build.
- On provider failure, parsing error, or an empty response, the workflow stops and does not deploy a replacement site. Existing published pages remain available. Inspect failed Actions runs and check service quota.
- GitHub can disable scheduled workflows in public repositories after 60 days of inactivity. Check Actions if updates stop. This job records successful check timestamps with real data maintenance commits, but still monitor the schedule.

## Scope and limits
This is a third-party Scholar import, not an official Google push notification and not instant. New papers appear after Scholar exposes them through the provider and a scheduled run succeeds. It cannot guarantee new countries without reliable affiliation information. It does not update research.html project prose or the AI backend's knowledge snapshot.

Sources:
https://serpapi.com/google-scholar-author-articles
https://serpapi.com/google-scholar-author-citation
https://serpapi.com/pricing
https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
