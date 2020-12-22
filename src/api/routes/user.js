import { assignMemberAsHOD, assignMemberToUnit, getFirstTimers, getHODs, getMember, getMembers, getWorkers, mutateFirstTimerToMember, updateMember } from "../controllers/user";
import { Router } from 'express';
import { getUser } from "../middlewares/user";
import { isAdmin, isHOD, isHodOrAdmin, verifyUser } from "../middlewares/auth";

const userRouter = Router();


userRouter.get(
    '/',
    verifyUser(),
    getUser(),
    isAdmin(),
    getMembers());

userRouter.get('/worker',
    verifyUser(),
    isHodOrAdmin(),
    getWorkers());

userRouter.get(
    '/first-timers',
    verifyUser(),
    getUser(),
    isAdmin(),
    getFirstTimers());

userRouter.get(
    '/HODs',
    verifyUser(),
    getUser(),
    isAdmin(),
    getHODs());

userRouter.get(
    '/:user_id', 
    verifyUser(),
    getUser(), 
    getMember());

userRouter.put(
    '/:user_id/update-member',
    verifyUser(),
    getUser(),
    updateMember());

userRouter.put(
    '/:user_id/assign-member-unit', 
    verifyUser(), 
    isHOD(), 
    getUser(), 
    assignMemberToUnit())

userRouter.put(
    '/:user_id/assign-member-HOD', 
    verifyUser(),
    isAdmin(),  
    getUser(), 
    assignMemberAsHOD());

userRouter.put(
    '/:user_id/change-first-timer', 
    verifyUser(), 
    isAdmin(), 
    getUser(), 
    mutateFirstTimerToMember());


export default userRouter