"use client";

import { defaultQuery, fetchProducts } from "@/app/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/app/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";
import { useEffect, useState } from "react";

type LoadState = "loading" | "error" | "ready";

type ProductExplorerProps = {
  isLoggedIn?: boolean;
};

export default function ProductExplorer({ isLoggedIn = false }: ProductExplorerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  
  // State สำหรับ Modal แก้ไข
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");

    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  // เปิด Modal เมื่อกดปุ่มแก้ไข
  function handleOpenEditModal(item: Product) {
    setEditingProduct(item);
    setIsModalOpen(true);
  }

  // ปิด Modal
  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingProduct(null);
  }

  function saveProduct(draft: ProductDraft) {
    if (editingProduct) {
      // กรณีแก้ไขสินค้าเดิม
      setProducts((current) =>
        current.map((p) => (p.id === editingProduct.id ? { ...p, ...draft } : p))
      );
      handleCloseModal();
    } else {
      // กรณีเพิ่มสินค้าใหม่
      setProducts([...products, { ...draft, id: Date.now() }]);
    }
  }

  function deleteProduct(id: Product["id"]) {
    if (confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) {
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id)
      );
    }
  }

  return (
    <main style={{ position: "relative" }}>
      <h1>รายการสินค้า</h1>

      <button
        type="button"
        onClick={() => loadProducts(defaultQuery)}
        disabled={status === "loading"}
      >
        {status === "loading" ? "กำลังโหลด" : "โหลดข้อมูล"}
      </button>

      <ProductSearchForm onSearch={loadProducts} />

      <section aria-live="polite">
        {status === "loading" && <p>กำลังโหลดข้อมูล</p>}

        {status === "error" && <p role="alert">{errorMessage}</p>}

        {status === "ready" && products.length === 0 && (
          <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
        )}

        {status === "ready" && products.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>รูปภาพ</th>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>คงเหลือ</th>
                <th>หมวดหมู่</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} width={48} height={48} />
                    ) : null}
                  </td>

                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>{item.category}</td>
                  <td>
                    {isLoggedIn ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                        >
                          แก้ไข
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(item.id)}
                        >
                          ลบ
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "#888", fontSize: "0.85rem" }}>ต้องเข้าสู่ระบบ</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ฟอร์มเพิ่มสินค้าใหม่ปกติ (แสดงด้านล่างเมื่อล็อกอิน) */}
      {isLoggedIn && !isModalOpen && (
        <div style={{ marginTop: "30px" }}>
          <h2>เพิ่มสินค้าใหม่</h2>
          <ProductForm
            editing={null}
            onSave={saveProduct}
            onCancel={() => {}}
          />
        </div>
      )}

      {/* หน้าต่าง Modal แก้ไขสินค้า (จะเด้งขึ้นมากลางจอเมื่อกด 'แก้ไข') */}
      {isLoggedIn && isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0 }}>แก้ไขสินค้า: {editingProduct?.title}</h2>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ✕
              </button>
            </div>

            <ProductForm
              editing={editingProduct}
              onSave={saveProduct}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </main>
  );
}