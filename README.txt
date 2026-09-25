NOVATECH DEMO STORE

FILES
- index.html        Home / product listing
- product.html      Individual product page
- cart.html         Shopping cart + Quebec taxes
- account.html      Account / shipping-information page
- css/style.css     All website styling
- js/products.js    Product catalogue
- js/main.js        Cart, taxes, account storage, and order demo

HOW TO RUN
1. Extract the ZIP.
2. Open index.html in a browser.
3. For best results, use a local web server such as VS Code Live Server.

QUEBEC TAXES
The cart currently calculates:
- GST: 5%
- QST: 9.975%

IMPORTANT
This project is a front-end demo. It uses localStorage to save the cart and customer details.
It does NOT provide real secure authentication, a database, server-side validation,
payment processing, order emails, or production-grade protection of personal data.

For a real transactional website, add a backend (for example Node.js + Express),
a database, HTTPS hosting, secure password hashing, server-side sessions/authentication,
and a payment provider such as Stripe.
