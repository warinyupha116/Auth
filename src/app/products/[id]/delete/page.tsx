import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";
import Link from "next/link";

type DeletePageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({ params }: DeletePageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>ยืนยันการลบสินค้า</h1>
      <p>คุณต้องการลบ <strong>{product.name}</strong> ใช่หรือไม่?</p>

      <form action={deleteAction} style={{ marginTop: "1rem" }}>
        <button type="submit" style={{ backgroundColor: "red", color: "white", padding: "0.5rem 1rem", border: "none", borderRadius: "4px" }}>
          ยืนยันการลบ
        </button>
        <Link href="/" style={{ marginLeft: "1rem" }}>
          ยกเลิก
        </Link>
      </form>
    </main>
  );
}