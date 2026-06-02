import { Router, type IRouter } from "express";
import healthRouter from "./health";
import reconRouter from "./recon";
import threatRouter from "./threat";
import fileRouter from "./file";
import passwordRouter from "./password";
import networkRouter from "./network";

const router: IRouter = Router();

router.use(healthRouter);
router.use(reconRouter);
router.use(threatRouter);
router.use(fileRouter);
router.use(passwordRouter);
router.use(networkRouter);

export default router;
