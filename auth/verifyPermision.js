const verifyPermission = (roles) => {
  return (req, res, next) => {
    for (let i = 0; i < roles.length; i++) {
      if (req.user.roles.include(roles[i])) next();
      else res.status(403).json({ message: "unauthorized" });
    }
  };
};

export default verifyPermission;
