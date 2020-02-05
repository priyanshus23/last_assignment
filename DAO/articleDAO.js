let dbConfig = require("../Utilities/mysqlConfig");



let getArticle = (criteria, callback) => {
    criteria.aricle_id ? conditions += ` and aricle_id = '${criteria.aricle_id}'` : true;
    dbConfig.getDB().query(`select * from article where 1`,criteria, callback);
}

let getArticleDetail = (criteria, callback) => {
    console.log("in dao");
	let conditions = "";
    criteria.id ? conditions += ` and id = '${criteria.id}'` : true;
    dbConfig.getDB().query(`select * from article where 1 ${conditions}`, callback);
}

let createArticle = (dataToSet, callback) => {
    console.log("insert into article set ? ", dataToSet)
    dbConfig.getDB().query("insert into article set ? ", dataToSet, callback);
    //dbConfig.getDB().close();       //mine addition
    }

let deleteArticle = (criteria, callback) => {
    let conditions = "";
   criteria.id ? conditions += ` and id = '${criteria.id}'` : true;
   console.log(`delete from article where 1 ${conditions}`);
   dbConfig.getDB().query(`delete from article where 1 ${conditions}`, callback);
   //dbConfig.getDB().close();

}

let updateArticle = (criteria,dataToSet,callback) => {
	let conditions = "";
    let setData = "";
    criteria.id ? conditions += ` and id = '${criteria.id}'` : true;
    dataToSet.category ? setData += `category = '${dataToSet.category}'` : true;
    dataToSet.title ? setData += `, title = '${dataToSet.title}'` : true;
    dataToSet.description ? setData += `, description = '${dataToSet.description}'`:true;
    dataToSet.BookNO ? setData += `, BookNO = '${dataToSet.BookNO}'`:true;
    console.log(`UPDATE article SET ${setData} where 1 ${conditions}`);
    dbConfig.getDB().query(`UPDATE article SET ${setData} where 1 ${conditions}`, callback);
}
module.exports = {
    getArticle : getArticle,
    createArticle : createArticle,
    deleteArticle : deleteArticle,
    updateArticle : updateArticle,
    getArticleDetail : getArticleDetail
}