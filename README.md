# Fampam Restaurant - Management Guide

Welcome to the Fampam website documentation. This guide will show you how to update your restaurant's information, menu items, and translations easily.

## 1. Accessing the Admin Panel

The easiest way to update the menu and restaurant settings (like opening hours) is through the built-in Admin Dashboard.

- **URL:** Navigate to `your-website.com/admin/login` (or `/admin` if already logged in).
- **Login:** Use your secure Supabase administrator credentials.

> **Note:** Ensure your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured in Vercel to allow the Admin Panel to save changes directly to your database.

## 2. Managing the Menu

Once inside the Admin Panel, navigate to the **Menu** section. 

Here you can:
- **Add New Dishes:** Click "Add Item" to create a new entry.
- **Edit Existing Dishes:** Change prices, update descriptions, or swap images.
- **Dietary Badges & Spice Levels:** Toggle if an item is Vegan (`V`), Gluten-Free (`GF`), or its spice level (🌶️).

![Admin Menu Editor](/logo_fampam.png)
*(Screenshot Placeholder: The Fampam Admin interface)*
> *Tip: Upload high-quality portrait/vertical images for the best visual experience in the new mobile-first menu layout.*

## 3. Editing Translations and Text

If you need to change static text on the website (like the Hero subtitle, button text, or footer details), this is managed via the translation file in the source code.

1. Open `src/i18n/translations.ts` in your code editor (or directly on GitHub).
2. The file is split into different sections (e.g., `hero`, `nav`, `menu`, `footer`).
3. You will see translations for both English (`en`) and German (`de`):

```typescript
// Example from src/i18n/translations.ts
export const translations = {
  en: {
    "hero.subtitle": "Centuries of flavor. A new era of taste.",
    "nav.reserve": "RESERVE",
  },
  de: {
    "hero.subtitle": "Jahrhunderte des Geschmacks. Eine neue Ära.",
    "nav.reserve": "RESERVIEREN",
  }
}
```

Simply update the text strings between the quotes and commit your changes to GitHub. Vercel will automatically deploy the updates!

## 4. Deploying Updates

Because your repository is linked to Vercel, every time you commit changes to the `master` branch on GitHub, Vercel will automatically build and deploy the new version of your website within minutes.

To manually trigger a deployment or check deployment status:
1. Log in to your Vercel Dashboard.
2. Select the `fampam2` project.
3. Click on the "Deployments" tab to view real-time build logs.
