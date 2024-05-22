

const authorization = (role=[])=>{

return (req,res,next)=>{
    console.log('Desde authorization: ' + req.session.user.role);
    console.log('Desde authorization, paramentro: ' + role);
    role.includes(req.session.user.role) ? next() : res.send('Acceso no permitido') 
}
}
export default authorization