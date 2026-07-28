NOIR BEAN - Address update

Replace these files in your project with the matching files from this folder:

1. components/MenuExperience.tsx
2. components/AdminDashboard.tsx
3. app/api/orders/route.ts
4. app/api/admin/orders/route.ts
5. app/orders/page.tsx

The database columns address and location_url were already added. This update uses address only.

After replacement run:
  npm run build

Then commit and push:
  git add .
  git commit -m "Add delivery address to orders"
  git push
