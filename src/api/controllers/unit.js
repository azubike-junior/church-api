import { tryHandler } from "../utils/global";
import { badRequest, createdResponse, noContent, notFound, successResponse } from "../utils/http";
import { paginationOption, reqPaginationQuery } from "../utils/pagination";
import { createUnit, deleteUnitById, getAllUnits, getUnitById } from "../utils/query";
import { validateInt } from "../utils/validation";

export const createAUnit = () =>
    tryHandler(async (req, res) => {
        const { name } = req.body;
        await createUnit(name);
        return createdResponse(res, 'unit created')
    });

export const getUnits = () =>
    tryHandler(async (req, res) => {
        const {page, limit} = reqPaginationQuery(req)
       const units = await getAllUnits(page, limit)
         const unitsCount = units.length

    const [allUnits,
        noOfUnits] = await Promise.all([units, unitsCount])

    const paginationQuery = paginationOption(req, noOfUnits);

    return successResponse(res, {allUnits, paginationQuery})
    });

export const getAUnit = () =>
    tryHandler(async (req, res) => {
        const { unit_id } = req.params;
        if (validateInt(unit_id)) {
            return badRequest(res, 'invalid id')
        }
        const unit = await getUnitById(unit_id);
        if (!unit) {
            return notFound(res, 'unit not found')
        }
         return successResponse(res, {unit})
    })

export const deleteUnit = () =>
    tryHandler(async (req, res) => {
        const { unit_id } = req.params;
        if (validateInt(unit_id)) {
            return badRequest(res, 'invalid id')
        }
         await deleteUnitById(unit_id);
         return noContent(res)
    })
