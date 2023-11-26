import passport from "passport";
import local from "passport-local";
import User from "../models/user.schema.js";
import bcrypt from "bcryptjs"; // Librería para encriptar contraseñas
import { hasAdminCredentials } from "../utils/secure.middleware.js";
import GitHubStrategy from "passport-github2";
import EErrors from "../error/invalid.js";
import { generateProductErrorInfo } from "../error/userError.js";
import CustomError from "../error/customError.js"
import logger from "../config/loggers/factory.js"
import  config  from "../../env.js";
import jwt from "passport-jwt";

const JWTStrategy= jwt.Strategy;
const ExtractJWT=jwt.ExtractJwt;

const LocalStrategy= local.Strategy;

const cookieExtractor=req=>{
    let token=null;
    if( req && req.cookies){
        token= req.cookies['coderCookieToken']
    }
    return token
}
const initializePassport =()=>{
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.privateKey,
    }, async(jwt_payload,done)=>{
        try{
            console.log(jwt_payload);
            return done(null,jwt_payload);
 
        }
        catch(err){
            return done(err)
        }
    }))


    passport.use("github",new GitHubStrategy({
        clientID:"Iv1.16380aa0534ce3c7",
        clientSecret:"b7004419dda2c049449905155638560f53c78335",
        callbackURL:`http://localhost:${config.port}/api/sessions/githubcallback`
    },async(accessToken, refreshToken,profile,done)=>{
        try{
            let user= await User.findOne ({email: profile._json.email})
            const saltRounds = 10;
            const password=" " 
            const hashedPassword = bcrypt.hashSync(password, saltRounds);
            if(!user){
                let newUser= new User({
                    first_name: profile._json.name.split(" ")[0],
                    last_name: profile._json.name.split(" ")[1],
                    email: profile._json.email,
                    password: hashedPassword,
                    age: " ",
                    role:
                      profile._json.email == config.adminName ? "admin" : "usuario",
                })
                await newUser.save()
                done(null,newUser)
            }
            else{
                done(null,user)
            }
        }catch(error){
            return done(error)
        }
    }))
    passport.use("register", new LocalStrategy(
        //manejo de error usando customizador
        {passReqToCallback:true, usernameField:"email"}, async (req, username,password, done)=>{
            const { first_name, last_name, email, age } = req.body;
            if (!first_name || !last_name || !age || !email){
                CustomError.createError({
                  name: "Product creation Error",
                  cause:generateProductErrorInfo( {first_name, last_name, email, age}),
                  message: "Error typing to create a product",
                  code: EErrors.INVALID_TYPES_ERROR
                });
              }
            try{
                const existingUser = await User.findOne({ email:username });
                if(existingUser){
                    logger.INFO("User ya existe")
                    return done(null,false)
                }
                const isAdminCredentials = hasAdminCredentials(email, password);
                // Encriptar la contraseña utilizando bcryptjs
                const saltRounds = 10; // Número de rondas de encriptación 
                const hashedPassword = bcrypt.hashSync(password, saltRounds);
                const newUser = new User({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashedPassword,
                    role: isAdminCredentials ? 'admin' : 'usuario'
                });
                await newUser.save();
                // Almacenar toda la información del usuario en la sesión

                logger.INFO(newUser)
                return done(null, newUser)
            }catch(error){
                return done ("error al obtener usuario" + error)
            }
        }
    ))

    passport.use("login",new LocalStrategy({usernameField:"email"}, async(username,password,done)=>{
        try{
            const user= await User.findOne({email: username})
            if(!user){
                logger.INFO("no existe usuario")
                return done (null,false);
            }
            const passwordsMatch = bcrypt.compareSync(password, user.password);
            if(!passwordsMatch) return done (null,false);
            logger.INFO(user)
            return done(null,user);
        }catch(error){
            return done(error);
        }
    }))

    passport.serializeUser((user,done)=>{
        done(null, user._id);
    });

    passport.deserializeUser(async (id,done)=>{
        let user = await User.findById(id);
        done (null,user);
    })
}



export default initializePassport