import { Router } from 'express';
import { createAUnit, deleteUnit, getAUnit, getUnits } from '../controllers/unit';
import { getWorkersInUnit } from '../controllers/user';
import { isAdmin, isHodOrAdmin, verifyUser } from '../middlewares/auth';
import { getUser } from '../middlewares/user';
import { validateCreateUnit } from '../utils/validation';

const unitRouter = Router();

unitRouter.get('/', verifyUser(), getUser(), isAdmin(), getUnits())
unitRouter.post('/', verifyUser(), getUser(), isAdmin(), validateCreateUnit(), createAUnit())
unitRouter.get('/:unit_id', verifyUser(), getUser(), isAdmin(), getAUnit())
unitRouter.delete('/:unit_id', verifyUser(), getUser(), isAdmin(), deleteUnit());
unitRouter.get('/:unit/workers', verifyUser(), getUser(), isHodOrAdmin(), getWorkersInUnit());

export default unitRouter