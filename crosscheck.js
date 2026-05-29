async function runCrosscheck() {
  console.log("Starting System Crosscheck: DB <-> Backend <-> Frontend <-> CMS\n");

  try {
    // 1. Frontend -> Backend -> DB (Read Menu)
    process.stdout.write("1. Testing Menu Fetch (Frontend -> DB)... ");
    const menuRes = await fetch("https://fampam-restaurant.duc-toan-le.workers.dev/api/menu");
    if (!menuRes.ok) throw new Error(`HTTP error! status: ${menuRes.status}`);
    const menuData = await menuRes.json();
    if (!menuData.dishes || menuData.dishes.length === 0) throw new Error("No dishes returned.");
    console.log(`✅ SUCCESS (${menuData.dishes.length} dishes found, first dish: ${menuData.dishes[0].name})`);

    // 2. Frontend -> Backend -> DB (Checkout Flow)
    process.stdout.write("2. Testing Checkout Session Creation (Frontend -> DB)... ");
    const checkoutPayload = {
      items: [{ dish_id: menuData.dishes[0].id, name: menuData.dishes[0].name, quantity: 1, price_cents: 1200 }],
      order_type: "pickup",
      subtotal_cents: 1200,
      delivery_fee_cents: 0,
      total_cents: 1200,
      guest_name: "Integration Test User",
      guest_email: "test@fampam.de"
    };

    const checkoutRes = await fetch("https://fampam-restaurant.duc-toan-le.workers.dev/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkoutPayload)
    });
    if (!checkoutRes.ok) throw new Error(`Checkout failed: ${await checkoutRes.text()}`);
    const checkoutData = await checkoutRes.json();
    
    if (!checkoutData.mock || !checkoutData.orderId) throw new Error("Mock response missing or invalid.");
    console.log(`✅ SUCCESS (Order created, ID: ${checkoutData.orderId})`);

    // 3. Webhook/Mock -> Backend -> DB (Payment Success)
    process.stdout.write("3. Testing Mock Payment Webhook (Stripe -> DB)... ");
    const mockSuccessRes = await fetch("https://fampam-restaurant.duc-toan-le.workers.dev/api/stripe/mock-success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: checkoutData.orderId })
    });
    if (!mockSuccessRes.ok) throw new Error(`Mock success failed: ${mockSuccessRes.status} ${await mockSuccessRes.text()}`);
    console.log(`✅ SUCCESS (Order ${checkoutData.orderId} marked as paid)`);

    // 4. CMS -> Backend -> DB (Read Orders)
    process.stdout.write("4. Testing Admin Dashboard Orders (CMS -> DB)... ");
    const adminOrdersRes = await fetch("https://fampam-restaurant.duc-toan-le.workers.dev/api/admin/orders");
    if (!adminOrdersRes.ok) throw new Error(`Admin orders fetch failed: ${await adminOrdersRes.text()}`);
    const adminOrdersData = await adminOrdersRes.json();
    
    const ourOrder = adminOrdersData.find((o) => o.id === checkoutData.orderId);
    if (!ourOrder) throw new Error("Order not found in Admin Dashboard!");
    if (ourOrder.status !== "preparing") throw new Error(`Order status is ${ourOrder.status}, expected 'preparing'`);
    
    console.log(`✅ SUCCESS (Order successfully retrieved by CMS with status: '${ourOrder.status}')`);

    console.log("\n🚀 ALL SYSTEMS NOMINAL: Frontend, Database, and CMS are fully synchronized.");

  } catch (error) {
    console.error(`\n❌ CROSSCHECK FAILED: ${error.message}`);
  }
}

runCrosscheck();
