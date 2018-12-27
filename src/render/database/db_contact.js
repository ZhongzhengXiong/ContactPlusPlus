import DB from './db_settings'
import { callbackify } from 'util';

const db = new DB()
const connect = db.init()
const contacts = connect.contacts

export default{

    addContact(data, cb) {
        return contacts.insert(data, (err, docs) => {
            if (err) {
                console.log('ERROR: adding contact: ' + JSON.stringify(doc) + '. Caused by: ' + error);
                throw error;
            }
            return cb(docs)
        })
    },
    deleteContact(id) {
        contacts.remove({ _id: id }, (err, numRemoved) => {
            if (err) { }
        })
    },
    updateContact(id, doc) {
        contacts.update({ _id: id }, doc, {}, (err, num) => {
            if (err) {
            }
        })
    },
    fetchAll(cb) {
        contacts.find({}, (err, docs) => {
            if (err) {
                console.log("ERROR: cannot execute fetchAll() method")
            }
            cb(docs)
        })
    },
    findContact(id, cb) {
        contacts.findOne({ _id: id }, (err, doc) => {
            if (err) { }
            return cb(doc)
        })
    },
    findConacts(id_list, cb){
        contacts.find({_id: { $in: id_list }}, (err, docs) => {
            if(err){
                console.error("the method findContacts(id_list) failed ")
                throw err
            }
            cb(docs)
        })
    },      
    fetchContactByPage(skip, limit, cb){
        contacts.find({}).skip(skip).limit(limit).exec((err, docs) =>{
            if(err){
                console.log("ERROR: cannot execute fetchContactByPage() method")
                throw err
            }
            cb(docs)
        })
    },
    fetchContactListByPage(skip, limit, cb, sortBy){
        if(sortBy === 'tag'){
            contacts.find({}, {first_name: 1, last_name: 1, tag: 1}).sort({tag: 1, first_name:1 , last_name:1}).skip(skip).limit(limit).exec((err, docs)=>{
                if(err){
                    console.log("ERROR: cannot execute fetchContactListByPage()")
                    throw err
                }
                cb(docs)
                })
        }else{
            contacts.find({}, {first_name: 1, last_name: 1, tag: 1}).sort({first_name:1 , last_name:1, tag: 1}).skip(skip).limit(limit).exec((err, docs)=>{
            if(err){
                console.log("ERROR: cannot execute fetchContactListByPage()")
                throw err
            }
            cb(docs)
            })
        }
        
    },
    removeAll(){
        contacts.remove({}, { multi: true },  (err, numRemoved) => {
            if(err)
                throw err
            console.log(numRemoved)
        })
    }
    

    
}
