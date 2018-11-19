import jetpack from 'fs-jetpack'
import fs from 'fs'
import DataStore from 'nedb'
import {remote} from 'electron'


export default class {
    constructor () {
      this.db = null
      this.useDataDir = jetpack.cwd(remote.app.getPath('home'))
    }
  
    createOrReadDatabase (db) {
      const dirName = process.env.NODE_ENV === 'development' ? '.contact-plus-plus-dev' : '.contact-plus-plus'
      const existsDir = jetpack.exists(this.useDataDir.path(dirName))
      if (!existsDir) {
        fs.mkdir(this.useDataDir.path(`${dirName}`), (err) => {
          if (err) {}
        })
      }

      const existsContact = fs.existsSync(this.useDataDir.path(`${dirName}/${db.contacts}`))

      let database = {}
  
      if(!existsContact){
          this.useDataDir.write(this.useDataDir.path(`${dirName}/${db.contacts}`),'')
      }

      database.contacts = new DataStore({
          filename: this.useDataDir.path(`${dirName}/${db.contacts}`),
          autoload: true
      })

      return database
    }
  
    init () {
      if (this.db) {
        return this.db
      }
  
      this.db = this.createOrReadDatabase({
          contacts: 'contacts.db'
      })
  
      return this.db
    }
  }