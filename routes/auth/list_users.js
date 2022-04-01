const router = require('express').Router();
const User = require('../../models/Users');

// Get a list of the users :
router.get("/list_users", async (req, res) => {
    let allUsers = await User.find({});
    res.send(allUsers);
    return;
});

module.exports = router;