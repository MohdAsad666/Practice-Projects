const Post = require('../models/posts');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created! "
            });
        }
        req.flash('success', 'Post Created!')
        return res.redirect('back');
    }
    catch (err) {
        req.flash('error', err);
        console.log("error", err);
        return;
    }
}


module.exports.destroy = async function (req, res) {
    try {
        let post = await Post.findById(req.params.id);
        if (post.user == req.user.id) {
            post.remove();

            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted Successfully"
                })
            }

            req.flash('success', 'post and associated comment got deleted!');
            return res.redirect('back');
        }
        else {
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }
    }
    catch (err) {
        // console.log("Error", err);
        req.flash('error', err);
        return res.redirect('back');
    }
}