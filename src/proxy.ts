export { auth as proxy } from "@/auth"; 

export const config = { 
  matcher: ["/products/:id/edit", "/products/:id/delete"], 
};
//เพิ่มอันอื่น ลบ แก้ไข ทำแบบนี้ 