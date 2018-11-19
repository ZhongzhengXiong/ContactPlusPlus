// This file will be embedded by the index.html file and will
// be executed in the renderer process for that window.
// All contact related funtionality will be implemented 
// in this file.
/*
contact = { 
    // necessary property
    'firt_name': 'jessica' // contact's name
    'last_name': 'white'
    'phone': '1001023729' // contact's telphone number
    'email': 'jessica@gmail.com'
    // unnecessary property
    'tag': 'classmate' // contact' tag (namely as group)
    'address': 'Rd.Zhangheng No.825'
    'birthday': 2018/01/01
    'country': 'Canada'
    'gender': 'female'
    'description': 'software engineer of google mountain view'
    'avatar': 'file://user/xiongzhongzheng/.../img/jessica-avatar.jpg
    'social_account':{
        'twitter': 'jessica@gmail.com'
        'weibo': 'jessica@gmail.com'
    }
    'im':{
        'qq': '1231231231'
    }
}
*/


// since it's embedded in the html page, the it has the same file position 
// with the index html page. so when importing your own module by relative 
// path, you should use the path of the module relative to index.html file
// (which locates in "src/render/views/index.html") rather that this file.
import db from '../../dist/render/database/db_contact.js'
import Fuse from 'fuse'
import _ from 'lodash'

const filters = {
    search: (contacts, search) => contacts.filter(contact => contact.name.match(search)),
    all: contacts => contacts,
    tag: (contacs, tag) => contacts.filter(contact => contact.tag === tag)
}

const searchOption = {
    caseSensitive: true,
    shouldSort: true,
    threshold: 0.6,
    distance: 100,
    maxPatternLength: 100,
    minMatchCharLength: 1,
    keys: ['name']
}

const getters = {
    filteredContacts: state => {
        const orderedContacts = _.orderBy(state.contacts, ['name'], ['desc'])
        if (state.type !== 'search') {
            return filters[state.type](orderedContacts)
        }
        if (state.type === 'search') {
            const fuse = new Fuse(state.contacts, searchOption)
            if (state.search !== '') {
                return fuse.search(state.search)
            }
        }
        return filters['all'](orderedContacts)
    }
}

// deliver the form data, construct a json object correspondingly
function createContactObject(form) {
    let doc = {}
    doc['social-account'] = {}
    doc['im-account'] = {}
    let elements = form.querySelectorAll('input, textarea')
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        if (element.name) {
            // for radio button, use the checked value
            if (element.type === 'radio') {
                if (element.checked)
                    doc[element.name] = element.value
            }
            else if (element.className === 'social-account' || element.className === 'im-account')
                doc[element.className][element.name] = element.value
            else
                doc[element.name] = element.value
        }
    }
    console.log(JSON.stringify(doc))
    return doc
}




function addContact(doc) {
    // add into local database
    db.addContact(doc, newDoc => {
        console.log('INFO: successfully saved document: ' + JSON.stringify(newDoc));
    })
    // sync with remote account
}

function deleteContact(_id) {
    // add into local database
    db.delteContact(_id)
    console.log(`delete contact ${_id}`)
    // sync with remote account
}

function updateContact(_id, doc) {
    // update local database
    db.updateContact(_id, doc)
    console.log(`update doc ${_id} to `, doc)
    // sync with remote account
}

function fetchContactInfo(_id) {
    return db.findContact(_id, doc => {
        console.log('get doc', doc)
    })
}

function fetchAllContacts() {
    db.fetchAll(docs => {
        console.log(`INFO: successful fetch all contacts: ${JSON.stringify(docs)}`)
        showContactList(docs)
    })
}

function fetchPageContacts(page_no, page_num) {
    // to-do
}

function fetchPageContactsList() {
    // to-do
}

function showContactList(contact_list) {
    let str = '<tr><th>ID</th><th>Avatar</th><th>Name</th><th>Detail</th></tr>'
    for (let i = 0; i < contact_list.length; i++) {
        let contact = contact_list[i]
        str += `<tr id=${contact._id}>`
        str += `<td>${contact.first_name}</td>`
        str += `<td>${contact.last_name}</td>`
        str += `<td>${contact.phone}</td>`
        str += `<td>${contact.email}</td>`
        str += `<td><button onclick=showDetail(${contact._id})>  查看  </button> <button onclick=deleteContact(${contact._id})>  删除   </button></td>`;
        str += '</tr>'
    }
    $("#contact-list").empty();
    $("#contact-list").append(str);
}



// add event listener, only for test
$('#add-contact').click(event => {
    // get the input value
    const contactForm = document.getElementById('contact-info-form')
    let contactObject = createContactObject(contactForm)
    console.log('add contact')
    console.log(contactObject)
    addContact(contactObject)
    fetchAllContacts()
    // let contact_list = fetchAllContacts()
    // showContactList(contact_list)
})