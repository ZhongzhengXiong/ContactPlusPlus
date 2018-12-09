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
    'head_portrait': 'file://user/xiongzhongzheng/.../img/jessica-avatar.jpg
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
import {remote} from 'electron'
import db_contact from '../../dist/render/database/db_contact.js';
import jetpack from 'fs-jetpack'
import fs from 'fs'


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
function createContactObject(form, contact_id) {
    let doc = {}
    doc['social_account'] = {}
    doc['im_account'] = {}
    let elements = form.querySelectorAll('input, textarea')
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        if (element.name) {
            // for radio button, use the checked value
            if (element.type === 'radio') {
                if (element.checked)
                    doc[element.name] = element.value
            }
            else if (element.className === 'social_account' || element.className === 'im_account')
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
    db.deleteContact(_id)
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
        str += `<td><img alt="portrait" 
        style="width:50px;height:50px;"
        onerror='loadDefaultPortrait(this)'
        src=${contact.head_portrait}></td>`
        str += `<td>${contact._id}</td>`
        str += `<td>${contact.first_name}</td>`
        str += `<td>${contact.last_name}</td>`
        str += `<td>${contact.phone}</td>`
        str += `<td>${contact.email}</td>`
        str += `<td><button onclick=showContactDetail('${contact._id}')>  view  </button> 
        <button onclick=deleteContactAndRefresh('${contact._id}')>  delete   </button>
        </td>`
        str += '</tr>'
    }
    $("#contact_list").empty();
    $("#contact_list").append(str);
}

function showContactDetail(contact_id){
    console.log(contact_id)
    db_contact.findContact(contact_id, contacts =>{
        if(contacts.length > 1)
            console.error("the id of the contact is not unique");
        let contact = contacts[0]
        console.log('show contact detail')
        console.log(JSON.stringify(contact))
        $('#first_name').val(contact.first_name)
        $('#last_name').val(contact.last_name)
        $('#phone').val(contact.phone)
        $('#email').val(contact.email)
        $('#tag').val(contact.tag)
        $('#address').val(contact.address)
        $('#birthday').val(contact.birthday)
        $('#country').val(contact.country)
        $('#gender').val(contact.sex)
        $(`input[name=sex][value=${contact.sex}]`).attr("checked",true);
        $('#twitter').val(contact.social_account['twitter'])
        $('#weibo').val(contact.social_account['weibo'])
        $('#qq').val(contact.im_account['qq'])
        $('#edit_contact').attr('onclick', `editContact(this, '${contact_id}')`)
        $('#head_portrait').attr('src', contact.head_portrait)
    })
}


function saveContact(btn, contact_id){
    const contactForm = document.getElementById('contact_info_form')
    let contactObject = createContactObject(contactForm)
    // attention: the contactObject now only contains text information without picture information
    // we need to copy the picture that user choosed to our own directory and rename it with the 
    // contact id, then add the new picture src to the contact object and update it.

    // first check the image's src
    if($('#head_portrait').attr('src') != undefined){
        const userDataDir = jetpack.cwd(remote.app.getAppPath('userData'))
        const dirName = 'head_portraits'
        const existsDir = jetpack.exists(userDataDir.path(dirName))
        if (!existsDir) {
          fs.mkdir(userDataDir.path(`${dirName}`), (err) => {
            if (err) {}
          })
        }
        
        const source = $('#head_portrait').attr('src')
        const fileExtension = source.split('.').pop()
        const newFilename = `${contact_id}.${fileExtension}`
        const portraitDir = jetpack.cwd(userDataDir.path(dirName))
        jetpack.copy(source, portraitDir.path(newFilename), {
            overwrite: true 
        })
        contactObject['head_portrait'] = portraitDir.path(newFilename)
    } else{
        contactObject['head_portrait'] = ''
    }


    updateContact(contact_id, contactObject)
    $(btn).html('edit')
    $('#contact_info_fieldset').attr('disabled', true)
    $(btn).attr("onclick", `editContact(this, '${contact_id}')`)
    // $(btn).click(event => {
    //     editContact(btn, contact_id)
    // })
    fetchAllContacts()
}

function editContact(btn, contact_id){
    // console.log(btn.value)
    $(btn).html('save')
    $('#contact_info_fieldset').attr('disabled', false)
    $(btn).attr("onclick", `saveContact(this, '${contact_id}')`)
    
    // $(btn).click(event=>{
    //     saveContact(btn, contact_id)
    // })
}

$(window).on('load', function(){ fetchAllContacts()});

// add event listener, only for test
$('#add_contact').click(event => {
    document.getElementById('contact_info_form').reset()
    const contactForm = document.getElementById('contact_info_form')
    let contactObject = createContactObject(contactForm)
    addContact(contactObject)
    fetchAllContacts()
})
$('#head_portrait').attr('onerror', 'loadDefaultPortrait(this)')
$('#head_portrait').click(event =>{
    // check whether the form is disabled
    if($('#contact_info_fieldset').attr('disabled') === 'disabled')
        return 
    // load picture
    let filePaths = addHeadPortrait()
    console.log(filePaths)
    $('#head_portrait').attr('src', filePaths[0])
})

function deleteContactAndRefresh(contact_id){
    deleteContact(contact_id)
    fetchAllContacts()
}

function addHeadPortrait(){
    const dialog = remote.dialog
    let filePaths =  dialog.showOpenDialog({
        properties: ['openFile'],
        filters:[
            {name: 'Images', extensions: ['jpg', 'png', 'jpeg']}
        ]
    })
    return filePaths
}

function loadDefaultPortrait(img){
    $(img).attr('src', '../../assets/default_portrait.png')
}