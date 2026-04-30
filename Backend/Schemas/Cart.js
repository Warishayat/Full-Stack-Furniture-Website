const {Schema,model} = require('mongoose');

const CartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    min: 1,
                    default: 1
                }
            }
        ],
        totalPrice : {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);
const Cart = model("Cart", CartSchema);
module.exports = Cart;

