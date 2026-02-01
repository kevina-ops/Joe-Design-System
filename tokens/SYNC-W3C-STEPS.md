# Converting to W3C DTCG Without Losing the New Minimal Tokens

Your **repo** has the new minimal token set. **Token Studio** still has the old tokens.  
Use this order so the minimal set wins and ends up in W3C format.

---

## Step 1: Push your local changes first

Push the current `tokens/joe-tokens.json` (minimal set, Legacy format) to GitHub so the repo is the source of truth.

```bash
git add tokens/joe-tokens.json
git commit -m "chore: minimal token set as source of truth"
git push origin main
```

---

## Step 2: In Token Studio – pull from the repo

In Token Studio, **sync from GitHub** so it **replaces** its old token set with the minimal one from the repo.

- Use the option that **pulls / imports from the repository** (e.g. “Pull from GitHub” or “Sync from repo”).
- Do **not** push from Token Studio yet; that would overwrite the repo with the old tokens.

After this, Token Studio should show the **minimal** token set (same as the repo), still in Legacy format.

---

## Step 3: In Token Studio – convert to W3C DTCG

With the minimal set loaded in Token Studio:

- Open the convert dialog and choose **“Convert to W3C DTCG format”**.
- Confirm. Token Studio now has the minimal set in W3C format (`$value` / `$type`).

---

## Step 4: In Token Studio – push back to GitHub

Sync **from Token Studio to GitHub** (e.g. “Push to GitHub” / “Sync to repo”) so `tokens/joe-tokens.json` in the repo is updated to the **minimal set in W3C format**.

---

## Summary

| Step | Who wins | Result |
|------|----------|--------|
| 1. Push local | Repo has minimal (Legacy) | GitHub = source of truth |
| 2. Pull in Token Studio | Repo → Token Studio | Token Studio = minimal (Legacy) |
| 3. Convert in Token Studio | — | Token Studio = minimal (W3C) |
| 4. Push from Token Studio | Token Studio → Repo | Repo = minimal (W3C) |

**Do not** pull from Token Studio before pushing; that would overwrite your minimal tokens with the old set.
