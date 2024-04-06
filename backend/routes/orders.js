const Order = require("../models/order");
const express = require("express");
const jsonschema = require("jsonschema");
const { ensureCorrectUser } = require("../middleware/auth")
const orderCreateSchema = require("../schemas/orderCreate.json");
const router = new express.Router();
const { BadRequestError } = require("../expressError");

/** POST /orders/:username:  { data } => { cart }
 *
 * Data needs to include: 
 *  { products, total, shippingAddress }
 *
 * Returns: { id, products, total, shippingAddress, orderedOn }
 * 
 * Authorization required: same user-as-:username
 */
router.post("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, orderCreateSchema);

      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const order = await Order.create(req.params.username, req.body);

      return res.json({ order });
    } catch (err) {
      return next(err);
    }
});

/** GET /orders/:username => { orders }
 *
 * Returns {[{ id, products, total, shippingAddress, orderedOn }]}
 *
 * Authorization required: same user-as-:username
 **/

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      const orders = await Order.get(req.params.username);

      return res.json({ orders });
    } catch (err) {
      return next(err);
    }
});


module.exports = router;

