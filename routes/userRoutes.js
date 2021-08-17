const app = require("express");
const router = app.Router();
const {creatUser, creatUserValidation, login, loginValidation, fetchUsers} = require("../controllers/userController")
const auth = require("../utils/auth");


router.post("/creatUser", creatUserValidation, creatUser);
router.post("/login", loginValidation, login);
router.post("/fetchUsers", auth, fetchUsers);



module.exports = router;