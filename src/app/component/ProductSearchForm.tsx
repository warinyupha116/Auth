"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SORT_FIELDS, SearchQuery, SearchQuerySchema, defaultQuery } from "@/app/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm(
  { onSearch }: ProductSearchFormProps
) {
    
  const {
    register,
    handleSubmit, 
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    
    resolver: zodResolver(SearchQuerySchema), //ผุกไว้กับคำค้นหา
    mode: "onTouched",
    defaultValues: defaultQuery,
  });


  return (
   
    <form onSubmit={handleSubmit(onSearch)} noValidate>
      <label htmlFor="q">คำค้น</label>
      <input id="q" {...register("q")} placeholder="phone" />

      <label htmlFor="limit">จำนวนรายการ</label>
      <input
        id="limit"
        type="number"
        required
        {...register("limit", { valueAsNumber: true })}
        aria-invalid={!!errors.limit}
        aria-describedby="limit-error"
      />

      <span id="limit-error" role="alert">{errors.limit?.message}</span>
    
      <label htmlFor="sortBy">เรียงตาม</label>
      <select id="sortBy" {...register("sortBy")}>
        {SORT_FIELDS.map((field) => (
          <option key={field} value={field}>{field}</option>
        ))}
      </select>

      



      {/* เติม: ป้องกันการคลิกซ้ำด้วย disabled={isSubmitting} และเปลี่ยนข้อความ */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "กำลังค้นหา" : "ค้นหา"}
      </button>
      
    </form>
  );
}