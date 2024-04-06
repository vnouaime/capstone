const Cart = require("../models/cart");
const express = require("express");
const jsonschema = require("jsonschema");
const { ensureCorrectUser } = require("../middleware/auth")
const cartUpdateSchema = require("../schemas/cartUpdate.json");
const router = new express.Router();
const { BadRequestError } = require("../expressError");

/** GET /[username] => { cart }
 *
 * Returns { products, total }
 *
 * Authorization required: same user-as-:username
 **/
router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      const cart = await Cart.get(req.params.username);

      return res.json({ cart });
    } catch (err) {
      return next(err);
    }
});

/** PATCH /[username] { data } => { cart }
 *
 * Data can include:
 *   { productSku, action, productPrice }
 *
 * Returns { products, total }
 *
 * Authorization required: same-user-as-:username
 **/
router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, cartUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const cart = await Cart.update(req.params.username, req.body);

      return res.json({ cart });
    } catch (err) {
      return next(err);
    }
});

module.exports = router;

