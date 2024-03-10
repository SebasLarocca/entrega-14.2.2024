import passport from 'passport';
import local from 'passport-local';
import usersSchema from '../schemas/users.schema';
import { createHash, isValidPassword } from '../utils/utils';

const LocalStrategy = local.Strategy;
const initializePassport =() => {
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
}

export default initializePassport;