// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All contact related funtionality will be implemented 
// in this file.

import db from './database/db_contact'
import Fuse from 'fuse.js'

const filters= {
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
        if(state.type !== 'search'){
            return filters[state.type](orderedContacts)
        }
        if(state.type === 'search'){
            const fuse = new Fuse(state.contacts, searchOption)
            if (state.search !== '') {
                return fuse.search(state.search)
            }
        }
        return filters['all'](orderedContacts)
    }
}