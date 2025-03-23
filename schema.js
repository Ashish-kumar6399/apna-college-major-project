const Joi = require('joi');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(), // Change Joi.object() to Joi.string()
        description: Joi.string().required(),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null),
    }).required(),
});


const reviewSchema =Joi.object({
    review:Joi.object({
        rating:Joi.number().required(),
        comment:Joi.string().required()
    })
})

module.exports = { listingSchema, reviewSchema };