Paste these folders/files into your Next.js project root.

New pages:
/register      Owner registration
/login         Owner login
/dashboard     Owner dashboard to submit business listing
/businesses    Public business listings with contacts and map link

Important:
1. Create .env.local in project root:
AUTH_SECRET=replace-with-any-long-random-secret

2. Restart server:
npm run dev

3. This module stores data in /data/users.json and /data/businesses.json for local development.
For production, replace JSON file storage with MongoDB/PostgreSQL/Firebase.
