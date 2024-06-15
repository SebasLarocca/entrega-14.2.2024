import config from '../../config.js';
export let dynamicLogger;

switch(config.enviroment){
    case "production":
        const  {default: loggerProduction} = await import('./loggerProduction.js');
        console.log(loggerProduction);
        dynamicLogger = loggerProduction;
        console.log(dynamicLogger);
        break;
    case "development":
        const {default: loggerDevelopment} = await import('./loggerDevelopment.js')
        dynamicLogger = loggerDevelopment;
        break;
    }
