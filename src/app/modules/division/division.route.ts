import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionSchema } from "./division.validation";
import { DivisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";


const router = Router();

router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createDivisionSchema),
    DivisionController.createDivision
)

export const DivisionRoutes = router