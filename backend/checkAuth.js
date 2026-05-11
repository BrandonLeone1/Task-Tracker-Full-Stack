import User from "./User.js"

async function checkAuth (req, res) {
    try {
        const user = await User.findById(req.userID)
        if (!user) {
            return res.status(401).json({success: false, message: "No user found"})
        }

        res.status(200).json({success: true, message: "Retreived user", user: {
            ...user._doc,
            password: null
        }})

    } catch (error) {
        return res.status(401).json({success: false, message: "No user found"})
    }
}

export default checkAuth