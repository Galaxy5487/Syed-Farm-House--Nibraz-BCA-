# SYED FARM HOUSE (SFH)

Static multi-page website built only with HTML5, CSS3 and Vanilla JavaScript.

## Pages
- index.html
- about.html
- breeds.html
- services.html
- gallery.html
- contact.html

## Run
Open `index.html` directly in a browser, or serve the folder with any static web server.

## Important branding note
The uploaded Syed Farm House banner was not available as a file in the current working conversation, so the project uses a restrained text-based SFH mark and natural farm photography fallbacks. When the official banner/logo is available, place it in `assets/logo/` and replace the text mark or relevant image URLs without changing the overall layout.

## Emailing Service (Brevo Integration)
The contact form is integrated with **Brevo Emailing Service** (v3 Transactional Email API) to deliver enquiries directly to `nnibraz15@gmail.com`.
- **Direct Background Delivery:** Open `js/script.js` and set `const BREVO_API_KEY = 'xkeysib-...'` with your Brevo v3 API key.
- **Client Fallback:** If no API key is specified, the form automatically formats the Brevo email content and opens the default email client for seamless delivery.

## Images
The current demo uses remote responsive agricultural image URLs. For an offline/self-contained deployment, download the chosen farm photographs into `assets/images/` and replace the URLs in the HTML files.
