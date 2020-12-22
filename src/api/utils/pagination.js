
export const reqPaginationQuery = (req) => {
    let { limit = 5, page = 1 } = req.query;

    if (Number(limit) < 1) {
        limit = 5
    }
    if (Number(page) < 1) {
        page = 1
    }

    return {limit, page}
} 

export const paginate = ({limit, page}) => {
     const offset = Number(limit) * (Number(page) - 1)
    return {offset, pageLimit: Number(limit)}
}

export const paginationOption = (req, count) => {
    const next = {};
    const previous = {};

    let { page = 1, limit = 5 } = req.query;

     if (Number(limit) < 1) {
        limit = 5
    }
    if (Number(page) < 1) {
        page = 1
    }

    if (Number(page) * Number(limit) < count) {
        next.page = Number(page) + 1
        next.limit = Number(limit)
    }
    if (Number(page) > 1) {
        previous.page = Number(page) - 1;
        previous.limit = Number(limit)
    }

    return {next, previous, count}
}