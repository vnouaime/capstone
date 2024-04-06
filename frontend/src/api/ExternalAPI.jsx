import axios from "axios";
import { EXTERNAL_BASE_URL, headers, caid } from "../config";

// External API as static class, handling furniture data
class FurnitureAPI {

    /** getAllCategories
     * Returns all categories from API with data about each category
     */
    static async getAllCategories() {
        try {
            const allCategoriesResponse = await axios.get(`${EXTERNAL_BASE_URL}/categories/list`, {
                params: { caid },
                headers
            });

            const categories = allCategoriesResponse.data.response.categoryAppData.departmentCategories;
            return categories;
        } catch (error) {
            console.error("Error fetching categories:", error);
            throw error; 
        }
    }

    /** getProductsFromCategory
     * Checks if categoryId exists from database of categories.
     * Returns all products from specific category from their categoryId. 
     */
    static async getProductsFromCategory(categoryId) {
        try {
            const allCategories = await this.getAllCategories();
            const categoryExists = allCategories.some(obj => Object.values(obj).includes(+categoryId));

            if (!categoryExists) {
                throw new Error(`No category found with id number: ${categoryId}`);
            }

            const allProductsResponse = await axios.get(`${EXTERNAL_BASE_URL}/products/list`, {
                params: { categoryId },
                headers
            });

            const products = allProductsResponse.data.response.data.category.browse.products;
            return products;
        } catch (error) {
            console.error("Error fetching products from category:", error);
            throw error; 
        }
    }

    /** getProductsFromSearch
     * Returns all products with their data based on keyword.
     */
    static async getProductsFromSearch(keyword) {
        try {
            let products;
            const searchResults = await axios.get(`${EXTERNAL_BASE_URL}/products/search`, {
                params: { keyword },
                headers
            });

            if (searchResults.data.response.superbrowse_object) {
                products = searchResults.data.response.superbrowse_object.product_collection;
            } else {
                products = searchResults.data.response.product_collection;
            }

            return products;
        } catch (error) {
            console.error("Error fetching products from search:", error);
            throw error; 
        }
    }

    /** getProductDetails
     * Returns data for a product based on sku.
     */
    static async getProductDetails(sku) {
        try {
            const productResult = await axios.get(`${EXTERNAL_BASE_URL}/products/get-common-info`, {
                params: { sku },
                headers
            });

            const product = productResult.data.response.data.product;
            return product;
        } catch (error) {
            console.error("Error fetching product details:", error);
            throw error; 
        }
    }
}

export default FurnitureAPI;
