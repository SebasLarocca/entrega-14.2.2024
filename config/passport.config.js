import passport from 'passport';
import local from 'passport-local';
import usersSchema from '../schemas/users.schema.js';
import { createHash, isValidPassword } from '../utils/utils.js';

const LocalStrategy = local.Strategy;
const initializePassport =() => {

    //estrategia de registro
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField:'email'}, async (req, username, password, done)=>{
            const {first_name, last_name, email, age} = req.body;
            try{
                let user = await usersSchema.findOne({email:username});
                if(user) {
                    console.log('USer already exists');
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                let result = await usersSchema.create(newUser);
                return done(null, result);
            } catch (error) {
                return done('Error al obtener el usuario' + error)
            }
        }
    ))

    //Estrategia de login:
    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done)=>{
        try{
            const user = await usersSchema.findOne({email: username})
            if(!user) {
                console.log('User doesn´t exist')
                return done (null, false)
            }
            if(isValidPassword(user, password)) return done (null, false);
            return done(null, user);
        } catch (error) {
            return done(error)
        }
    }))
    
    //Serializacion y deserializacion, aplican a todas las estrategias, tanto local como de 3ros
    passport.serializeUser((user, done) =>{
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done)=>{
        let user = await usersSchema.findById(id);
        done(null, user)
    });
}

export default initializePassport;