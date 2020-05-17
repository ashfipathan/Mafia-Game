var express = require("express");
var router = express.Router();

router.get("/:test", function(req, res, next) {
    console.log(req.params.test)
    res.send("API is working");
});

module.exports = router;