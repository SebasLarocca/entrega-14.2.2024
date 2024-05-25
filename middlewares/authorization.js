const authorization = (role=[])=>{

return (req,res,next)=>{
    role.includes(req.session.user.role) ? next() : res.send('Acceso no permitido') 
}
}
export default authorization