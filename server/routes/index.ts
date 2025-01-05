import express from 'express';
import  slideRouter  from './slideRoutes';
const router = express.Router();


router.use(slideRouter);

export default router;