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
        sortBy = '',
        minPrice = '',
        maxPrice = '',
        searchQuery = ''
      }) => {
        const params = {
          page: page.toString(),
          limit: limit.toString(),
        };

        if (mainCategory && mainCategory !== 'كل المنتجات') {
          params.category = mainCategory;
        }

        if (subCategory) {
          params.subCategory = subCategory;
        }

        if (brand) {
          params.brand = brand;
        }

        if (sortBy) {
          params.sort = sortBy;
        }

        if (minPrice) {
          params.minPrice = minPrice;
        }

        if (maxPrice) {
          params.maxPrice = maxPrice;
        }

        if (searchQuery) {
          params.search = searchQuery;
        }

        const queryParams = new URLSearchParams(params).toString();
        return `/?${queryParams}`;
      },
      providesTags: ["Products"],
    }),

    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: '/search',
        params: { q: searchTerm },
        validateStatus: (response, result) => 
          response.status === 200 && result.success
      }),
      transformResponse: (response) => response.products || [],
      transformErrorResponse: (response) => {
        try {
          const parsedError = JSON.parse(response.data);
          return {
            status: response.status,
            data: parsedError,
            message: parsedError.message || 'حدث خطأ أثناء البحث'
          };
        } catch {
          return {
            status: response.status,
            data: null,
            message: "خطأ في الاتصال بالخادم"
          };
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Products', id: _id }))]
          : ['Products']
    }),

    fetchProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    addProduct: builder.mutation({
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
      providesTags: (result, error, id) => [{ type: "Products", id }],
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
      invalidatesTags: (result, error, { id }) => [{ type: "Products", id }],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    fetchLatestProducts: builder.query({
      query: (limit = 8) => `/latest?limit=${limit}`,
      providesTags: ["Products"],
    }),

    fetchTopSellingProducts: builder.query({
      query: (limit = 8) => `/top-selling?limit=${limit}`,
      providesTags: ["Products"],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useSearchProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery,
  useFetchLatestProductsQuery,
  useFetchTopSellingProductsQuery,
} = productsApi;

export default productsApi;