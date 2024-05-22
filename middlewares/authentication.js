const authenticate = async (req, res, next)=>{
    const user = req.session.user;  
    console.log(user);
    if(!user) {
        console.log('No hay usuario');
        return res.render('login')}
    else { 
        console.log('Hay usuario');
        return next()}  
} 

export default authenticate;