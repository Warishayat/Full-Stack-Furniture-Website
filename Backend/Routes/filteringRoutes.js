const express = require("express");
const filter_router =  express.Router();
const {getFilteredProducts, getFilterOptions} = require("../Controller/Filter/FilterApi");

filter_router.get("/products", getFilteredProducts);
filter_router.get("/filters", getFilterOptions);

module.exports = filter_router;