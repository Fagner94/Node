const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("outra rota");
});
module.exports = router;