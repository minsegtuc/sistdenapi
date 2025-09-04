const VerifyToken = async (req, res) => {
    try {
        res.status(200).json({ message: 'Token is valid', usuario: req.user });
    } catch (error) {
        console.log(error)
    }
}

export default VerifyToken;