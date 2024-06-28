import passport from 'passport';
import local from 'passport-local';
import usersSchema from '../schemas/users.schema.js';
import { createHash, isValidPassword } from '../utils/utils.js';
import GitHubStrategy from 'passport-github2';
import config from "../config.js";
const LocalStrategy = local.Strategy;
const initializePassport =() => {

    //estrategia de registro
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField:'email'}, async (req, username, password, done)=>{
            const {first_name, last_name, email, age} = req.body;
            try{
                let user = await usersSchema.findOne({email:username});
                if(user) {
                    console.log('User already exists');
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

    //Estrategia de login local:
    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (username, password, done)=>{
        try{
            const user = await usersSchema.findOne({email: username})
            if(!user) {
                console.log('User doesn´t exist')
                return done (null, false)
            }
            if(!isValidPassword(user, password)) return done (null, false);
            return done(null, user);
        } catch (error) {
            return done(error)
        }
    }))
    
    //Estrategia de login con github
    passport.use('github', new GitHubStrategy({
        clientID: config.githubPassportClientId,
        clientSecret: config.githubPassportClientSecret,
        callbackURL: `http://localhost:${config.port}/api/sessions/githubcallback`
    }, async (accessToken, refreshToken, profile, done)=>{
        try{
            console.log(profile);
            let user = await usersSchema.findOne({first_name: profile._json.login})
            if(!user) {
                let newUser = {
                    first_name: profile._json.login,
                    last_name: " ",
                    age: 99,
                    email: 'usuario@usuario.com',
                    password: " ",
                }
                let result = await usersSchema.create(newUser);
                done(null, result);
            } else{ done(null, user) }
        } catch(error){
            return done(error)
        }
    }
    ))

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