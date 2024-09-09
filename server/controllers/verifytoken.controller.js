const VerifyToken = async (req, res) => {
    try {
        res.status(200).json({ message: 'Token is valid', userId: req.userId });
    } catch (error) {
        console.log(error)
    }
}

export default VerifyToken;