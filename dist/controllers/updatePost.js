//@route PUT /api/posts/:id
export default (req, res, next) => {
    const id = Number.parseInt(req.params.id);
    const post = posts.find((post) => post.id === id);
    if (!post) {
        const error = new Error(`A post with the id of ${id} was not found`);
        res.status(404);
        return next(error);
    }
    post.title = req.body.title;
    res.status(200).json(posts);
};
