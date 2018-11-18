const DB = require('./db_settings')
// import { callbackify } from 'util';

const db = new DB()
const connect = db.init()
const contacts = db.contacts

export default{
    
    addContact(data, cb){
        return contacts.instert(data, (err, docs) => {
            if(err){}
            return cb(docs)
        })
    },
    deleteContact(id){
        contacts.remove({_id:id}, (err, numRemoved) =>{
            if(err){}
        })
    },
    updateContact(id, doc){
        contacts.update({_id: id}, doc, {},  (err, num)=>{
            if(err){
            }
        })
    },
    fetchAll(cb){
        return contacts.find({}.exec((err, docs)=>{
            if(err){
                cb(docs)
            }
        }))
    },
    findContact(id, cb){
        return contacts.find({_id: id}, (err, doc)=>{
            if(err){}
            return cb(doc)
        })
    },
    
}
