import {tryHandler} from "../utils/global";
import validate from 'uuid-validate'
import models from '../../database/models'
const {User} = models
import {badRequest, noContent, notFound, successResponse} from "../utils/http";
import {paginationOption, reqPaginationQuery} from "../utils/pagination"
import {findUserById, getAllUsers, getAllWorkers, getAllFirstTimers, getAllHODs, getUnitById, getAllWorkersInUnit} from "../utils/query";
import {userType} from "../utils/constant";
import {validateInt} from "../utils/validation";
import sendEmail from "../../email/email";
import { assignedMemberToHODTemplate, assignedMemberToUnitTemplate } from "../../email/template";

export const getWorkers = () => tryHandler(async(req, res) => {
  const {page, limit} = reqPaginationQuery(req);
  const workers = await getAllWorkers(page, limit);
  console.log('====workers', workers)
  if (!workers) {
    return notFound(res, 'no worker found')
  }
  const workersCount = workers.length

  const [allWorkers,
    noOfWorkers] = await Promise.all([workers, workersCount])

  const paginationQuery = paginationOption(req, noOfWorkers);

  return successResponse(res, {allWorkers, paginationQuery})
})

export const getMembers = () => tryHandler(async(req, res) => {
  const {page, limit} = reqPaginationQuery(req);
  const users = await getAllUsers(page, limit);

  const usersCount = User.count();

  const [allMembers,
    noOfMembers] = await Promise.all([users, usersCount])

  const paginationQuery = paginationOption(req, noOfMembers);

  return successResponse(res, {allMembers, paginationQuery})
})

export const getMember = () => tryHandler(async(req, res) => {
  const {user_id} = req.params;
  if (!validate(user_id)) {
    return badRequest(res, 'invalid id')
  }
  const user = await findUserById(user_id);
  if (!user) {
    return notFound(res, 'user not found')
  }
  return successResponse(res, {data: user})
})

export const getFirstTimers = () => tryHandler(async(req, res) => {
  const {page, limit} = reqPaginationQuery(req);
  const firstTimers = await getAllFirstTimers(page, limit)
  if (!firstTimers) {
    return notFound(res, 'no first timer found')
  }
  const firstTimersCount = firstTimers.length

  const [allFirstTimers,
    noOfFirstTimers] = await Promise.all([firstTimers, firstTimersCount]);

  const paginationQuery = paginationOption(req, noOfFirstTimers)

  return successResponse(res, {allFirstTimers, paginationQuery})
})

export const getHODs = () => tryHandler(async(req, res) => {
  const {page, limit} = reqPaginationQuery(req);
  const HODs = await getAllHODs(page, limit);

  if (!HODs) {
    return notFound(res, 'No HOD has been assigned')
  }

  const HODsCount = HODs.length

  const [allHODs, noOfHODs] = Promise.all([HODs, HODsCount])

  const paginationQuery = paginationOption(req, noOfHODs)
  
  return successResponse(res, { allHODs, paginationQuery })
});

export const updateMember = () =>
    tryHandler(async (req, res) => {
        const { body: { address, bio, name, image }, foundUser} = req;
        const userUpdate = {
            address,
            bio, 
            name,
            image
        }
        await foundUser.updateUser(userUpdate);
        return successResponse(res, 'update success')
     })

export const assignMemberAsHOD = () => tryHandler(async (req, res) => {
  const {params:{ user_id}, body: { unit_id } } = req
  if (!validate(user_id)) {
    return badRequest(res, 'invalid id')
  }
  const user = await findUserById(user_id);
  if (!user) {
    return notFound(res, 'user not found')
  }
  if (validateInt(unit_id)) {
    return badRequest(res, 'invalid id')
  }
  const unit = await getUnitById(unit_id);

  if (!unit) {
    return notFound(res, 'no unit found with this id')
  }
  const url = 'https://google.com'
  await user.assignHOD(unit_id)
  await sendEmail(user.email, 'HOD Assignment', assignedMemberToHODTemplate(user, unit, url))
  return noContent(res)
});

export const assignMemberToUnit = () => tryHandler(async (req, res) => {
  const { params: {
    user_id
  }, body: {
    unit_id
  } } = req;
  if (!validate(user_id)) {
    return badRequest(res, 'invalid id')
  }
  const user = await findUserById(user_id);
  if (!user) {
    return notFound(res, 'user not found')
  }
  if (user.account_type === userType.HOD.toString()) {
    return badRequest(res, 'member is an HOD')
  }
  if (validateInt(unit_id)) {
    return badRequest(res, 'invalid unit_id')
  }

  const unit = await getUnitById(unit_id);
  if (!unit) {
    return notFound(res, 'unit doesnt exist')
  }
  await user.assignUnit(unit_id)
  await unit.increment('numberOfPeople')
  await user.mutateWorker(true)
  await user.mutateFirstTimer(false)

  const url = 'https://google.com'
  await sendEmail(user.email, 'Unit Assignment', assignedMemberToUnitTemplate(unit, user, url))
  return successResponse(res, 'member is assigned to a unit')
});

export const mutateFirstTimerToMember = () => tryHandler(async(req, res) => {
  const {params: {
      user_id
    }} = req;
  if (!validate(user_id)) {
    return badRequest(res, 'invalid id')
  }
  const user = await findUserById(user_id);
  if (!user) {
    return notFound(res, 'user not found')
  }
  await user.mutateFirstTimer(false)
  return noContent(res)
})

export const getWorkersInUnit = () => 
  tryHandler(async (req, res) => {
    const {page, limit} = reqPaginationQuery(req)
    const { unit } = req.params;
    if (validateInt(unit)) {
       return badRequest(res, 'invalid id')
    }
    const workers = await getAllWorkersInUnit(unit, page, limit)
    if (!workers) {
      return notFound(res, 'no worker as been assigned to this unit')
    }

    const workersCount = workers.length;

     console.log(unit, workers, workersCount)

    const paginationQuery = paginationOption(req, workersCount);
    
    return successResponse(res, {workers, paginationQuery})
  }) 
