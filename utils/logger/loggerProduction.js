import winston from "winston";

//winston tiene sus propios niveles de error: error, warn, info, http, vervose, debug, silly
//si se cambian, como ahora con customCLoggerConfiguration, se debe usar los nuevos niveles, no se van a reconocer los de default 
const customCLoggerConfiguration = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'orange',
        warning: 'yellow',
        info: 'white',
        http: 'green',
        debug: 'blue'
    }
}

const logger = winston.createLogger({
    levels: customCLoggerConfiguration.levels, //esto es opcional, si quiero definir mis propios niveles. 
    transports: [
        new winston.transports.Console({
            level: "http",
            format: winston.format.combine(
                winston.format.colorize({ colors: customCLoggerConfiguration.colors}),
                winston.format.simple()
            )
        }), //indica que los logs http los imprima en consola
        new winston.transports.File({
            filename: './errors.log',
            level: 'warning',
            format: winston.format.simple()
        }) //indica que los logs warn los guarde en errors.log
    ]
})

//este logger lo arma como middleware
export const addProdLogger =  (req,res,next)=>{
    req.logger = logger;
    let date = new Date().toLocaleTimeString()
    // req.logger.http(`Desde production logger: ${req.method} en ${req.url} - ${date}`);
    next()
}

