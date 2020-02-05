let mysqlConfig = require("../Utilities/mysqlConfig");

let initialize = () => {
    mysqlConfig.getDB().query("create table IF NOT EXISTS article (id INT auto_increment primary key,title VARCHAR(24), category VARCHAR(30),  description VARCHAR(50), BookNO INT)");

}

module.exports = {
    initialize: initialize
}