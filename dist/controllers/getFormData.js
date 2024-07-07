import getFormData from "../db/getFormData.js";
export default (req, res, next) => {
    const data = getFormData();
    if (data instanceof Error) {
        res.status(500);
        next(data);
        return;
    }
    return res.status(200).json({ dbResponse: data });
};
