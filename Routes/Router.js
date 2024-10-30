// Importing modules
import Router  from 'express';

import {signupValidator} from '../Middlewares/signupValidation.js'
import {loginValidator} from '../Middlewares/loginValidation.js'
import {signup} from '../Controllers/signup.controller.js'
import {login} from '../Controllers/login.controller.js'
import {validateRequest} from '../Middlewares/validateRequest.js'

// Create a new router instance
const router = Router();


// Signup route
router.post('/signup', signupValidator, validateRequest, signup);

// Login route
router.post('/login', loginValidator, validateRequest, login);



//Default route to check express is working or not
router.get('/', (req, res) => {
  res.send("<h1>ExpressJS...</h1>");
});

// Export the router
export default router;
