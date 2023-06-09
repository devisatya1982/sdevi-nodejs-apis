import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        // if (!cookies?.jwt) return res.sendStatus(401); // Writing below IF block for user friendly message :(
        if (!cookies?.jwt){
           return res.status(401).json({ 'message': 'No Cookie exist for the token sent to server!' });
        }
        const refreshToken = cookies.jwt;
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    
        const foundUser = await User.findOne({ refreshToken }).exec();
    
        // Detected refresh token reuse!
        if (!foundUser) {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                async (err, decoded) => {
                    if (err) return res.sendStatus(403); //Forbidden
                    // Delete refresh tokens of hacked user
                    const hackedUser = await User.findOne({ email: decoded.email }).exec();
                    hackedUser.refreshToken = [];
                    const result = await hackedUser.save(); // result ?  TODO
                }
            )
            return res.sendStatus(403); //Forbidden
        }
    
        const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    
        // evaluate jwt 
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    // expired refresh token
                    foundUser.refreshToken = [...newRefreshTokenArray];
                    const result = await foundUser.save();
                }
                if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
    
              // Refresh token was still valid
              //  const roles = Object.values(foundUser.roles);
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "email": decoded.email,
                            "roles": foundUser.roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
                );
    
                const newRefreshToken = jwt.sign(
                    { "email": foundUser.email },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
                );
                // Saving refreshToken with current user
                foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
                const result = await foundUser.save();
    
                // Creates Secure Cookie with refresh token
                // secure: true only serves on https
                res.cookie("jwt", newRefreshToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production" ? true : false,
                  sameSite: "None",
                  maxAge: 24 * 60 * 60 * 1000,
                });
    
                res.json({ accessToken })
            }
        );
        
    } catch (error) {
        res.status(500).json({ 'message': error });
    }
   
}

export { handleRefreshToken };