import { NextFunction, Request, Response, Router } from "express";
import { UserControllers } from "./user.controller";
import { AnyZodObject } from "zod";
import { createUserZodSchema } from "./user.validation";

const validateRequest = (zodSchema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = await zodSchema.parseAsync(req.body)
        next()
    } catch (error) {
        next(error)
    }
}

const router = Router()

// router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         req.body = await createUserZodSchema.parseAsync(req.body)
//         next()
//     } catch (error) {
//         next(error)
//     }
// },
//     UserControllers.createUser
// )

router.post('/register', validateRequest(createUserZodSchema), UserControllers.createUser)
router.get('/all-users', UserControllers.getAllUsers)

export const UserRoutes = router