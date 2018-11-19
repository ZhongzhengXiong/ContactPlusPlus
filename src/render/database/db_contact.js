import DB from './db_settings'
import { callbackify } from 'util';

const db = new DB()
const connect = db.init()
const contacts = connect.contacts

export default {

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
        return contacts.find({ _id: id }, (err, doc) => {
            if (err) { }
            return cb(doc)
        })
    },

}
