

## What it does
The Laundry Order Management System (OMS) is a full-stack web application designed for laundry businesses to easily track, manage, and bill customer orders. It allows staff to create new orders with specific garments, automatically calculates pricing, tracks the item's status through various stages of completion (Received, Processing, Ready, Delivered), and provides a comprehensive dashboard with analytics to monitor business performance.

## Tech stack
- **Backend:** Node.js, Express, MongoDB (with Mongoose), express-validator
- **Frontend:** React, Vite, Tailwind CSS, Recharts, React Router v6


## Setup instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/laundry
NODE_ENV=development
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```
Start the development server:
```bash
npm run dev
```

## Features implemented
- ✅ **Create Orders:** Form with dynamic garment rows and auto-calculating bill summary.
- ✅ **Order List & Filtering:** View all orders with debounced search by name/phone, and filter by status or garment type.
- ✅ **Order Details:** View specific order receipts, estimated delivery dates, and a vertical stepper showing the status timeline.
- ✅ **Status Management:** Sequentially update order statuses with strict backend validation.
- ✅ **Dashboard Analytics:** Live metrics including total revenue, active orders, and a bar chart of orders by status.
- ✅ **Input Validation:** Strict `express-validator` middleware on the backend preventing bad data.
- ✅ **Global Error Handling:** Structured JSON error responses across the entire application.
- ✅ **Responsive UI:** Fully responsive design using Tailwind CSS that works well on mobile devices.

## API documentation

### 1. Create an Order
- **Method:** `POST`
- **Path:** `/api/orders`
- **Body:**
  ```json
  {
    "customerName": "John Doe",
    "customerPhone": "9876543210",
    "garments": [
      { "type": "Shirt", "quantity": 2 }
    ]
  }
  ```
- **Example cURL:**
  ```bash
  curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"John Doe","customerPhone":"9876543210","garments":[{"type":"Shirt","quantity":2}]}'
  ```

### 2. Get Orders (with optional filters)
- **Method:** `GET`
- **Path:** `/api/orders`
- **Query Params:** `status`, `name`, `phone`, `garmentType`
- **Example cURL:**
  ```bash
  curl -X GET "http://localhost:5000/api/orders?status=RECEIVED&name=John"
  ```

### 3. Get Order by ID
- **Method:** `GET`
- **Path:** `/api/orders/:orderId`
- **Example cURL:**
  ```bash
  curl -X GET http://localhost:5000/api/orders/ORD-ABCDEF
  ```

### 4. Update Order Status
- **Method:** `PATCH`
- **Path:** `/api/orders/:orderId/status`
- **Body:**
  ```json
  {
    "status": "PROCESSING",
    "note": "Starting the wash cycle"
  }
  ```
- **Example cURL:**
  ```bash
  curl -X PATCH http://localhost:5000/api/orders/ORD-ABCDEF/status \
  -H "Content-Type: application/json" \
  -d '{"status":"PROCESSING"}'
  ```

### 5. Get Dashboard Analytics
- **Method:** `GET`
- **Path:** `/api/dashboard`
- **Example cURL:**
  ```bash
  curl -X GET http://localhost:5000/api/dashboard
  ```

## Evaluator Self-Assessment

### 1. Speed & Execution
By utilizing AI correctly, I successfully scoped, generated, and fully deployed a complete 4-tier Full-Stack MERN application with active Dashboards, Rechart visualizations, and automated order life-cycles in a fraction of standard manual-scaffolding completion times. 

### 2. AI Leverage
I heavily leveraged LLMs to scaffold the boilerplate features (Express controllers, MongoDB schemas, Tailwind CSS Grid structures, and Regex string matching). This allowed me to allocate more brainpower towards deep-level business logic, architectural boundaries, and solving infrastructure integration issues that the AI is typically blind to.

### 3. Problem Solving
**Gap:** My ISP routinely hijacks or blocks DNS SRV (`mongodb+srv://`) connections in MongoDB Atlas making standard `mongoose.connect()` deployments fail entirely with `ECONNREFUSED`. 
**Fix:** Instead of installing a heavy VPN, I manually executed terminal `nslookup` queries against Google's nameservers (`8.8.8.8`) to reverse-engineer Atlas's physical AWS shard addresses, reconstructed the old-style cluster URI without SRV dependencies, and directly bypassed the ISP's DNS blocker successfully reconnecting the database!

### 4. Code Quality (Practical, Readable, Logical)
- **Not Over-Engineered:** I entirely avoided Redux/Zustand as they represent dramatic over-engineering for an MVP dashboard state. A standard React Context or Prop-drilled layout via `useState` and `React Router` was the most logical choice.
- **Readable boundaries:** Express routes, controllers, MongoDB Models, and `express-validator` middleware files are cleanly split.
- **Pure Functions:** Billing algorithms inside `src/utils/billing.js` are strictly pure functions with zero side effects—ensuring predictable frontend subtotal renders and guaranteeing easy setup for Jest Unit testing down the line.

### 5. Ownership Mindset (Going Beyond MINIMUM)
I did not just build standard CRUD. I actively focused on user-experience and real-world business constraints:
- Built a native **PDF/Device Print Integration** directly into the Order Details page via Tailwind CSS `@media print` features wiping sidebars for clean billing receipts.
- Discarded standard JS `alert()` tools and installed **react-hot-toast** for buttery smooth UX notifications ensuring employees immediately notice when orders are complete.
- Deployed a robust 404 Catch-All route.
- Added a `debouncer (400ms)` on the database search bar preventing the UI from DDOSing my own backend while typing customer names.

## AI usage report

### Tools used
GitHub Copilot, Gemini 3.1 Pro (Preview)

### Prompts I gave
1. Scaffold a Node.js + React laundry OMS project structure with Vite, Tailwind, Express, and base configs.
2. Create the MongoDB Order schema (with pre-save hooks) and a pure-function billing utility.
3. Build the Express controllers and routes for CRUD operations and Dashboard aggregations.
4. Add `express-validator` input validation and a global error handling middleware for the backend.
5. Create React pages (Dashboard, Orders list, Create Order form, Order details) utilizing Tailwind CSS.
6. Generate a comprehensive README for the repository mapping out features, API routes, and deployment details.

### What AI generated correctly
- The folder structure and Vite/React/Express boilerplate were set up flawlessly.
- Complex MongoDB aggregations (like `$unwind` and Promise.all execution) were written accurately in the dashboard controller.
- The React hooks structure (debouncing search inputs and mapping dynamic form fields) was solid.
- Tailwind CSS layouts and responsive grid setups were heavily automated and visually appealing out of the box.

### Bugs AI introduced and how I fixed them
  - Bug 1: **Mongoose default IDs vs Custom orderId** — Copilot initially attempted to search by MongoDB's default `_id` parameter instead of my custom generated `orderId` in the `getOrderById` endpoint. 
    → **Fix:** I updated the controller to specifically query `Order.findOne({ orderId: req.params.orderId })` instead of using `findById`.
  - Bug 2: **Backend CORS configuration** — The AI didn't automatically restrict CORS origins to just the frontend local URL in development, leaving it totally open. 
    → **Fix:** I explicitly passed origin options to `app.use(cors({ origin: process.env.FRONTEND_URL }))` inside `server.js`.
  - Bug 3: **Recharts responsiveness issue** — The bar chart container initially collapsed to 0px height on mobile views due to a missing explicit container height. 
    → **Fix:** Wrapped the `<ResponsiveContainer>` in a parent `div` with a fixed `h-72` utility class in Tailwind.

### What I improved beyond AI output
- I refactored the UI to use a generic `<StatusBadge>` component to keep coloring consistent across the entire app.
- I optimized the dynamic form for adding garments to ensure users couldn't delete the last remaining input row.
- I structured the routing to ensure a persistent Sidebar layout so the header wouldn't aggressively remount between page transitions.

## Tradeoffs and decisions
- **No User Authentication:** Skipped implementing JWT/Passport.js authentication for staff accounts to keep the scope of the MVP manageable. 
- **No Pagination:** The `/api/orders` endpoint currently returns an unbound array. For a production system dealing with thousands of orders, cursor-based or offset-based pagination would be strictly required.
- **In-memory state management vs Redux/Zustand:** Elected to use standard React `useState` and `useEffect` hooks heavily to maintain simplicity since the state didn't need aggressive global sharing aside from the UI layout.

## What I would build next
1. **SMS Notifications via Twilio:** Automatically trigger an SMS API call when an order transitions to `READY` to dramatically improve customer pickup times.
2. **WhatsApp Integration:** Relevant for certain markets like India where customers prefer receiving digital billing receipts directly to their WhatsApp numbers over traditional SMS/Email.
3. **PWA Support:** Convert the frontend into a Progressive Web App so store owners can install it natively on their phones/tablets for offline robustness and camera-based barcode scanning.
