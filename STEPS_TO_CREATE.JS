/*
!: npm init -y 
     => -y is used to set the default like not entering the yes and dicription and all 

!: npm i express mongoose dotenv
    => using express , mongoose and dotenv
    
!: npm i jsonwebtoken bcryptjs cors cookie-parser cloudinary
        => create a jsonwebtoken file
        => bcryptjs to encrypt the store the sensitive data
        => cors for middleware
        => coockie-parse to store as cookie
    
!: in package.json set at the last "type":"module"
        => to import the packages in the backend as same as how you do in frontend using import command inset of require command
    
        todo since we setting the type as module wile importing files that is created by us should be imported with extension like import auth form "authRouts.js"

!: BACKEND: 
    => create a backend folder and create a sever.js file which is the entry point for the backend and where we are calling the express

!: create a .env 
    =>  file and mention the port in it since the forntend will default take 3000 for backend we use port 5000
    => in server.js import dotenv and dotenv.congif()
    => PORT = process.env.PORT = to access the port in the env file
    
!: MVC = Model , Control , Vie 
    => Model = Backend controllers 
    => control = intercation between client and the server
    =>view => UI

!: app.use("/api/auth",authRoutes)
    => if any request comes in the path from /api/auth  it will be handled by authRoutes

!: Routes
    => if which url is comming after /api/auth/... it will be correspondingly handled by authRoutes which calls the corresponding functions in the authControllers.js file 

!: connect mongodb
    =>in env specfify the mongo url 
    => create a db folder and create ConnectDB.js file 
    => use async function sice it returns a promise 
    => use await mongoose .connect to connect it 
    => catch error and print it 
    todo  process.exit(1) indicates if this error occur it will stop the entire process of the app 1 means true so process.exit(1
    => export it  as default
    => import and use it in server.js since after the port running the connection should be done so we used inside the lister funcion after the connection is done

!: Schema construction 
    => in the models folder create a file userSchema 
    => use mongoose.Schema function
    => create a schema and create a model and export it as default

!: login and logout controllers 
    => add routes for login and logout
    => add controllers for login and logout
    => and import in the routes folder

!: signup controller
    => get the parameter form the req.body
    => to use req.body you need to specify app.use(express.json()) (MIDDLEWARE) in the server.js file
    => import the user model from the db folder for validation
    todo: Email Validation 
        => use regex from the internet to validate the email
        => check weacther the email or username is already in the database via fetcOne
    todo: password hashing 
        => import bcrypt form bcryptjs
        => use salting 
!: postman url hit
    =>use the url 
    => give the body content => raw => jason => your data => send

!: JWT 
    => use generatetoken(newUser._id,res) before saving the newUser which is a fucntion defined in utils -> generateToken.js
    todo => generateToken function
        bug: token => 
            => sign a token with userid , random text which is stored in a env and expires time
        bug: resposne cookie
            => mention jwt wiht the token genereated with object of maxAge , httpOnly , sameSite , secure values .

        export the generate token function 

!: login 
    => checks the username and password in the database since the password in the db is encrypted we use await bcrypt.compare and then returning 

!: logout
    => making the jwt token as null by setting the maxAge to 0 
!: getme 
    => it is a middleware in authroutes middleware is used call protectRoute which is a function defined in middleware folder 
    => which gets the jwt token 
    bug getting jwt token 
        => to get jwt token we have to use a middleware in server.js which to send cookies from cliend to server ,import cookieParser from "cookie-parser", app.use(cookieParser())
    =>decode it and find the user and make it as the req user and use next() to go to the getme fucntion in the controller 

!User routes and controller 
    => create two functions in userroutes getprofile and followunfollowuser 

!: getprofile controller
    => by name as as params find the user 

!: followunfollowuser controller
        => by the id as params find it 

! NOTIFICATION SCHEMA AND A NEW MODEL NOTIFICATION
    => create and save it while following and unfollowing in usercontroller

! suggested post 
    => create a route and a controller with protecetd route for a user
! Update rout 
    => it is used to update the password bio profile , image etc .. 
    => werite a contoller for it 


! some other routes and controllers

    => wirte required controller and routes and models for the required functionality 






! ======================================= frontend ========================================= 
 

 ! npm create-ract-app .
    => if we use npm create-ract-app . it will ask the project name to create since we created the frontend app inside another folder will be created to avoid that we use npm create vite@latest . to initlize in the same folder 
    
    => get some public images from the git 

    => install tailwind 

    => use daisyui for prebuilt components with tailwind 
! Daisyui 
    =>npm i -D daisyui@latest
        => to install the daisyui 
        => import daisyUIThemes  from "daisyui/src/theming/themes" import this us tailwind config 
        => mention the daisyui object in the tailwind.css

! react icons
    => to install the react-icons

    => react-icons -> homepage -> website link        
    
! ROUTER DON INITILIZE
    => npm i react-router-dom
    
    => in the index.js file  import { BrowserRouter } from 'react-router-dom'; and cover the app compnent with BrowserRouter

! after form end 
    => npm i @tanstack/react-query
    => update index.js

!     "build" : "npm install && npm install --include=dev --prefix frontend && npm run build --prefix frontend"
! in the package.json file of the whole application which makes when we use npm run build it will perform all the above commands in the respective folders 








todo : put the .gitignore file in the root and then add 
/frontend/node_modules
/frontend/build
.env
also in the gitignore file 
    */