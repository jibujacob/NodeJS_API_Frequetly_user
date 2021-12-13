
const getAllProducts = (req,res)=>{
    res.status(200).json({msg:"All product listed"})
}

module.exports = {
    getAllProducts,
}