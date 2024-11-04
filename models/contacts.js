const fs = require('fs/promises')
const { v4: uuidv4 } = require('uuid');

const contactsPath = './models/db/contacts.json';


const readingFile = async () => {
  try{
    const buffor = await fs.readFile(contactsPath)
    const contacts = JSON.parse(buffor)
    return contacts
  } catch(err) {
    console.log(err)
  }

}
const updateFile = async (data) => {
  try{
    const fileData = JSON.stringify(data)
    fs.writeFile(contactsPath, fileData)
  } catch(err) {
    console.log(err)
  }

}

const listContacts = async () => {
  return readingFile().then((contacts)=> contacts)
}

const getContactById = async (contactId) => {
  return readingFile().then((contacts)=> contacts.filter(contact => contact.id===contactId))
}

const removeContact = async (contactId) => {
   return readingFile().then((contacts)=> {
            let contactRemoved = false
            const newContactList = contacts.filter(contact => contact.id!==contactId)
            
            if(contacts.length===newContactList.length) {
              return {contactRemoved}
            }
            contactRemoved = true
            updateFile(newContactList)
            return {contactRemoved, newContactList}
          })
 
}

const addContact = async (name, email, phone) => {
  return readingFile().then((contacts)=> {
    const newContactsList = [...contacts, {"id": uuidv4(), 
                                          "name": name, 
                                          "email": email, 
                                          "phone": phone
                                         }
                            ]
    updateFile(newContactsList)
    return newContactsList
  })
  
}
const updateContact = async (contactId, name, email, phone) => {
  return readingFile().then((contacts)=> {

    let contactUpdated = false
    const contactToUpdate = contacts.find(({id}) => id===contactId)

    if(contactToUpdate === undefined ) {
      return {contactUpdated}
    }

    contactUpdated = true
    const updateContact ={...contactToUpdate, "name": name, "email": email, "phone": phone}
    const originContacts = contacts.filter(contact => contact.id!==contactId)
    const newContactList = [...originContacts,updateContact]
    updateFile(newContactList)

    return {contactUpdated, newContactList}
  })


}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
