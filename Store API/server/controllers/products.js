const Product = require("../models/product")

const getAllProducts  = async (req,res)=>{
    const {name,featured,company,sort,field,numericFilters} = req.query
    const queryObject = {}

    if(name){
        queryObject.name = {$regex:name,$options:'i'}
    }

    if(company){
        queryObject.company = company
    }

    if(featured){
        queryObject.featured = featured === 'true' ? true : false
    }

    if(numericFilters){
        const operatorMap={
            '>':'$gt','>=':'$gte','<':'$lt','<=':'$lte','=':'$eq',
        }
        let regEx = /\b(<|<=|>|>=|=)\b/g
        let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
        
        const options=['price','rating']
        filters = filters.split(',').forEach(item => {
            const [field,operator,value] = item.split('-')
            if (options.includes(field)){
                if(queryObject[field]){
                    queryObject[field]={...queryObject[field],[operator]:Number(value)}
                }else{
                    queryObject[field] = {[operator] : Number(value)}
                }
            }
        });

        console.log(queryObject);
    }

    let result = Product.find(queryObject)
    if(sort){
        result = result.sort(sort.split(',').join(' '))
    }else{
        result = result.sort('createdAt')
    }

    if(field){
        result = result.select(field.split(',').join(' '))
    }
 
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)
    const products = await result
    res.status(200).json({Hits:products.length,products})
}

module.exports = {
    getAllProducts,
}