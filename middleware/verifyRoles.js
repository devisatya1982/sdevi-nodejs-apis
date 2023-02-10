const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const allowedRolesArray = [...allowedRoles];
        // const result = req.roles.map(currentRole => allowedRolesArray.includes(currentRole)).find(val => val === true);
        const result = allowedRolesArray.includes(req.roles);
        if (!result) return res.sendStatus(401);
        next();
    }
}

export default verifyRoles