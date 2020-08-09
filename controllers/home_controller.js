const Post = require('../models/posts');
const User = require('../models/user');
module.exports.home = async function (req, res) {

    try {
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user').populate({
                path: 'comments',
                populate:
                {
                    path: 'user'
                }
            });

        let users = await User.find({});

        return res.render('home', {
            title: "Home",
            posts: posts,
            all_user: users
        });
    }
    catch
    {
        console.log("error", err);
        return;
    }
}