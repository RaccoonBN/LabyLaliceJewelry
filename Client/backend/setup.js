const { db, admin } = require("./db"); // Import Firestore và Admin SDK


// ID của bộ sưu tập cần gán vào sản phẩm
const collectionId = "LYcG68c5AFfFDF0xEZdx"; 

async function createProduct(name, price) {
  const productRef = db.collection("products").doc(); // Tạo ID ngẫu nhiên
  await productRef.set({
    name: name,
    price: price,
    collectionId: collectionId, // Gán ID bộ sưu tập vào sản phẩm
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("✅ Product added with ID:", productRef.id);
}

// Thêm sản phẩm vào bộ sưu tập có ID "LYcG68c5AFfFDF0xEZdx"
async function addProducts() {
  try {
    await createProduct("Lắc tay vàng", 4500000);
    await createProduct("Bông tai kim cương", 7000000);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

addProducts();
