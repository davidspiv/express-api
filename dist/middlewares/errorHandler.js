export default (err, req, res, next) => {
    if (err.message) {
        res.json({ message: err.message });
        return;
    }
    res.status(500).json({ message: err.message });
};
