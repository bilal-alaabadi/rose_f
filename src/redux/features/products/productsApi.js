// productsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: ({
        mainCategory = '',
        subCategory = '',
        brand = '',
        page = 1,
        limit = 10,
      }) => {
        const params = {
          page: page.toString(),
          limit: limit.toString(),
        };

        // إضافة mainCategory فقط إذا كانت محددة وليست 'كل المنتجات'
        if (mainCategory && mainCategory !== 'كل المنتجات') {
          params.category = mainCategory;
        }

        // إضافة subCategory إذا كانت محددة
        if (subCategory) {
          params.subCategory = subCategory;
        }

        // إضافة brand إذا كانت محددة
        if (brand) {
          params.brand = brand;
        }

        const queryParams = new URLSearchParams(params).toString();
        return `/?${queryParams}`;
      },
      providesTags: ["Products"],
    }),

    // باقي النقاط النهائية تبقى كما هي...
    fetchProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    AddProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    fetchRelatedProducts: builder.query({
      query: (id) => `/related/${id}`,
    }),

    updateProduct: builder.mutation({
      query: ({ id, body, headers }) => ({
        url: `update-product/${id}`,
        method: "PATCH",
        body,
        headers: {
          ...headers,
        },
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery
} = productsApi;

export default productsApi;