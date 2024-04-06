import axios from "axios"
import { BASE_URL } from "../config";

// Own database API, handling users, carts, and orders. 

class FurnifyAPI {

  // the token for the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${FurnifyAPI.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {

      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;

      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Users *******************************************************************************/

  /** Get the current user. */
  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get token for login from username, password. */
  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    
    return res.token;
  }

  /** Signup for site. */
  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    
    return res.token;
  }

  /** Save user profile page. */
  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  /** Carts *******************************************************************************/

  /** 
   * Handles, get, post, and patch requests.
   * 
   * GET: Gets cart based on current user.
   * POST: Creates new cart when user signs up.
   * PATCH: Adds or removes product sku from products and updates cart total. 
  */
  static async cart(username, data, action) {
    let res = await this.request(`cart/${username}`, data, action)
    return res.cart
  }
  
  /** Orders *******************************************************************************/

  /** 
   * Handles, get, and post requests.
   * 
   * GET: Gets orders based on current user.
   * POST: Creates new order. 
  */
  static async order(username, data, action) {
    let res = await this.request(`orders/${username}`, data, action)

    if (action == "post") {
      return res.order
    }

    if (action == "get") {
      return res.orders
    }
    
  }
}

export default FurnifyAPI;