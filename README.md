This plugin is build by: https://huzaifascripts.site/

## **MERN Checkout Bridge – Full Setup & Run Guide**

This project connects **WooCommerce (WordPress)** to a **MERN stack** app for handling orders, processing them in a custom front-end, and sending the updates back to WooCommerce.

---

### **1. Project Structure**

The extracted folder from the zip should look like:

```
delta-mern-starter/
    delta-mern/
        client/     ← Vite React front-end
        server/     ← Express/Node.js back-end
```

---

### **2. Required Tools**

Before running, install:

* [Node.js](https://nodejs.org/) (LTS or Latest, we used v22.x)
* npm (comes with Node.js)
* Visual Studio Code (or any IDE)
* WooCommerce WordPress site with the **Delta Plugin** installed

---

### **3. Environment Files**

We need `.env` files for both **server** and **client**.

#### **3.1 Server .env**

Create `delta-mern/server/.env`:

```env
SITE_ID=2a2944b8-3185-4ecf-a355-7ff02ca073ea
SITE_SECRET=f3816b9b1d73ba7564f6d112cebc83f1cc0d4ebf7ad1693067e6d221664748a9
RSA_PRIVATE_KEY_PATH=./keys/private.pem
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

* `SITE_ID` and `SITE_SECRET` come from your WordPress plugin settings.
* Make sure `private.pem` is inside `delta-mern/server/keys/`.

---

#### **3.2 Client .env**

Create `delta-mern/client/.env`:

```env
VITE_API=http://localhost:8080
```

* Match the port to the server’s `PORT` setting.

---

### **4. Install Dependencies**

Open **two separate terminals** in VS Code.

#### **4.1 Server terminal**:

```bash
cd delta-mern/server
npm install
```

#### **4.2 Client terminal**:

```bash
cd delta-mern/client
npm install
```

---

### **5. Run the Applications**

We will run **backend** first, then **frontend**.

#### **5.1 Start Server**

From `delta-mern/server`:

```bash
npm run dev
```

You should see:

```
Delta MERN server listening on http://localhost:8080
```

If you see:

```
Error: EADDRINUSE :::8080
```

then either:

* Kill the process on that port:

```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

* Or change `PORT` in `.env` and `VITE_API` in client `.env`.

---

#### **5.2 Start Client**

From `delta-mern/client`:

```bash
npm run dev
```

You should see:

```
VITE vX.X.X ready in XXX ms
Local: http://localhost:5173
```

---

### **6. Configure WordPress Plugin**

Inside your WordPress admin:

1. Go to **Delta Plugin Settings**.
2. Set:

   * **API Base**: `http://localhost:5173`
   * **Site ID**: Your `SITE_ID`
   * **Site Secret**: Your `SITE_SECRET`
   * **Server Public Key**: Copy from `delta-mern/server/keys/public.pem`
3. Save settings.
4. Test connection in the plugin’s **Health Check**.
   Should return:

   ```json
   {"ok":true,"connected":true}
   ```

---

### **7. Test the Flow**

1. Keep both server and client running.
2. Place a WooCommerce order.
3. After placing the order, you will be redirected to:

```
http://localhost:5173/?site=...&payload=...
```

4. Complete the form (demo flow).
5. The client sends data to the server → server sends signed data to WooCommerce → order updates.
6. User is redirected back to WooCommerce order confirmation page.

---

### **8. Common Errors & Fixes**

* **ERR\_CONNECTION\_REFUSED** → Server not running or wrong port in `.env`.
* **EADDRINUSE** → Port already in use, free it or change in `.env`.
* **CORS error** → `CORS_ORIGIN` in server `.env` must match the client URL.
* **RSA verify failed** → Make sure public.pem in WP matches private.pem in server.

---

### **9. Running Again Later**

Whenever you restart:

1. Start backend:

```bash
cd delta-mern/server
npm run dev
```

2. Start frontend:

```bash
cd delta-mern/client
npm run dev
```

---


