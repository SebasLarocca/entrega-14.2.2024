import Router from "express";

import UsersDAO from "../daos/mongo.dao/users.dao.js";
import authenticate from "../middlewares/authentication.js";




const router = Router()

router.get('/', (req, res) => {
    res.render('home');
});


// router.get('/home', (req, res) => {
//     if(req.session.user){
//         res.redirect("/products");
//     } else {
//         res.render("home");
//     }
// });


router.get('/register', (req, res) => {
    res.render("register");
});

// router.get("/login", (req, res) => {
//     if(req.session.user){
//         res.redirect("/products");
//     } else {
//         res.render("login");
//     }
// })

router.get("/login", authenticate, (req, res) => {
    
        res.redirect("/products");
 
})

router.get("/profile", async (req, res) => {
    if(req.session.user){
        let user = await UsersDAO.getUserByID(req.session.user);
        res.render("profile", {user});
    } else {
        res.redirect("/login");
    }
})

export default router;