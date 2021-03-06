import { Router } from 'express';
import multer from 'multer';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

// CONTROLLERS IMPORT
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController'


import validateUserStore from './app/validations/UserStore';
import validateUserUpdate from './app/validations/UserUpdate';
import validateSessionStore from './app/validations/SessionStore';
import validateAppointmentStore from './app/validations/AppointmentStore';

const routes = new Router();

const upload = multer(multerConfig)

const bruteStore = new BruteRedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

const bruteForce = new Brute(bruteStore);


// TEST ROUTE
routes.get('/', (req, res) =>
    res.send('Server running with success! :)')
);

// SESSION ROUTE
routes.post('/sessions', bruteForce.prevent, validateSessionStore, SessionController.store);

// MIDDLEWARE ROUTE
routes.use(authMiddleware);

// USER ROUTES
routes.post('/users', validateUserStore, UserController.store);
routes.put('/users', validateUserUpdate, UserController.update);

// PROVIDER ROUTES
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

// APPOINTMENT ROUTES
routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', validateAppointmentStore, AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.destroy);

// SCHEDULE ROUTE
routes.get('/schedule', ScheduleController.index);

// NOTIFICATION ROUTE
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

// FILE ROUTE
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
