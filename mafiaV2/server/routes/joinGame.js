var express = require("express");
var router = express.Router();

router.get("/:clientID/:userName/:lobbyCode", function(req, res, next) {
    console.log(req.params.clientID);
    console.log(req.params.userName);
    console.log(req.params.lobbyCode);
    res.send("API is working");
});

module.exports = router;