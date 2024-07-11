import getAccData from "../db/getAccData.js";
export default (req, res, next) => {
    const data = getAccData();
    if (data instanceof Error) {
        res.status(500);
        next(data);
        return;
    }
    return res.status(200).json({ dbResponse: data });
};
