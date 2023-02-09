import User from '../model/User.js';

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204); //No content
        
        const refreshToken = cookies.jwt;
    
        // Is refreshToken in db?
        const foundUser = await User.findOne({ refreshToken }).exec();
        if (!foundUser) {
            // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            res.clearCookie('jwt', { httpOnly: true});
            return res.sendStatus(204);
        }
    
        // Delete refreshToken in db
        foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
        const result = await foundUser.save();
        console.log(JSON.stringify(result, null, 2));
    
        // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.clearCookie('jwt', { httpOnly: true });
        res.sendStatus(204);
        
    } catch (error) {
        res.status(500).json({ 'message': error });
    }
   
}

export { handleLogout }