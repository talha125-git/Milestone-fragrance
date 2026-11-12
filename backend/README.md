# Milestone Fragrance - Express.js API Backend

A fast, lightweight Node.js & Express.js REST API server powering the Milestone Fragrance luxury e-commerce application.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
* **Development (Auto-reload with Node 24 native watch):**
  ```bash
  npm run dev
  ```
* **Production:**
  ```bash
  npm start
  ```

Server will run at **`http://localhost:5000`**.

---

## 📡 API Endpoints & Routes

### 1. Products

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/products` | Retrieve all products | `?gender=Men\|Women\|Unisex`<br>`?type=Woody\|Fresh\|Citrus`<br>`?bestseller=true`<br>`?search=keyword`<br>`?sort=price-low\|price-high\|rating` |
| `GET` | `/api/products/:id` | Get single product by ID (e.g. `signature`, `believe`, `ghanam`, `professor`) + 3 related products | None |
| `GET` | `/api/products/bestsellers` | Retrieve bestselling fragrances | None |

#### Example: Single Product Response (`/api/products/believe`)
```json
{
  "success": true,
  "data": {
    "id": "believe",
    "name": "Believe",
    "subtitle": "Pour Homme & Femme",
    "price": 6499,
    "originalPrice": 7499,
    "gender": "Women",
    "type": "Fresh",
    "concentration": "Eau De Parfum",
    "topNotes": ["Grapefruit Zest", "Marine Accord", "Mandarin"],
    "heartNotes": ["Bay Leaf", "Aromatic Jasmine", "Lavender"],
    "baseNotes": ["Ambergris", "Guaiac Wood", "Oakmoss"],
    "inStock": true
  },
  "related": [...]
}
```

---

### 2. Scent Families & Categories

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | Retrieve all 6 fragrance categories (Woody, Citrus, Floral, Sweet, Fruity, Fresh) |
| `GET` | `/api/categories/:id` | Get details for a specific fragrance category |
| `GET` | `/api/categories/meta/testimonials` | Retrieve customer verified review testimonials |

---

### 3. Newsletter Subscription

* **Endpoint:** `POST /api/newsletter`
* **Request Body:**
  ```json
  {
    "email": "customer@example.com"
  }
  ```
* **Response:**
  ```json
  {
    "success": true,
    "message": "Thank you for subscribing! Your welcome discount code has been sent.",
    "email": "customer@example.com"
  }
  ```

---

### 4. Contact Form Inquiries

* **Endpoint:** `POST /api/contact`
* **Request Body:**
  ```json
  {
    "name": "Hamza Ali",
    "email": "hamza@example.com",
    "phone": "+92 300 1234567",
    "subject": "Fragrance Inquiry",
    "message": "Is Professor suitable for evening winter wear?"
  }
  ```
* **Response:**
  ```json
  {
    "success": true,
    "message": "Thank you for contacting Milestone Fragrance. Our fragrance concierge will reply within 24 hours."
  }
  ```

---

### 5. Health Check
* **Endpoint:** `GET /api/health`
* Returns status, timestamp, service name, and route catalog.

---

## 🔗 Frontend Integration

The frontend (Vite React app) is configured with an API proxy in `frontend/vite.config.js`:
All calls to `/api/*` from the frontend are automatically routed to `http://localhost:5000`.
A complete service client is available in `frontend/src/services/api.js`.

