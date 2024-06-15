export const operacionSencilla = (req,res)=>{
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
        sum += i
        
    }
    res.send({sum})
}

export const operacionCompleja = (req,res)=>{
    let sum = 0;
    for (let index = 0; index < 5e8; index++) {
        sum += i
        
    }
    res.send({sum})
}