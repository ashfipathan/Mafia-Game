const MongoClient = require('mongodb').MongoClient

class Connection {
    static connectToMongo() {
        if ( this.db ) return Promise.resolve(this.db)
        return MongoClient.connect(this.url, this.options)
            .then( (db) => {
              this.db = db.db();
            });
    }

    // or in the new async world
    // static async connectToMongo() {
    //     if (this.db) return this.db;
    //     this.db = await MongoClient.connect(this.url, this.options)
    //     return this.db
    // }
}

Connection.db = null
Connection.url = 'mongodb://127.0.0.1:27017/test_db'
Connection.options = {
    useUnifiedTopology: true 
}

module.exports = { Connection }