# Cloud sync setup

The settings page writes the current widget configuration to Supabase. The OBS browser source polls the same row every 1.2 seconds, so edits appear without refreshing OBS.

## 1. Create the Supabase table

1. Create a Supabase project.
2. Open **SQL Editor** and run the contents of [supabase-setup.sql](./supabase-setup.sql).
3. In **Project Settings → API**, copy the Project URL and the **anon / publishable** key.

## 2. Add Vercel environment variables

In Vercel → Project → Settings → Environment Variables, add these variables for **Production** (and Preview if you test previews):

- `VITE_SUPABASE_URL` = your Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` = your Supabase anon / publishable key

Redeploy the Vercel project after adding them. The anon key is designed to be public; never use the Supabase service-role key in the browser.

## 3. Use it

Open `/settings`, change any setting, and wait for the status to say **Облачная синхронизация активна**. Keep the existing OBS Browser Source URL:

`https://twitch-social-widget.vercel.app/widget`

The widget checks for changes about every 1.2 seconds.

## Security note

The table contains only public visual configuration, but this simple setup allows anonymous clients to update the single `default` row. Do not store credentials or private data in it. For stronger protection, put writes behind an authenticated server endpoint before using this with a public audience.
