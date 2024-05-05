
/**
 * @typedef dataBaseManager
 * @type {Object}
 * @property {MongoClient} client - The official MongoDB driver for Node.js 
 */
export default class DataBaseManager{
    constructor(client){
        self.client = client;
    }
}