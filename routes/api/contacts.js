const express = require('express')
const contacts = require('../../models/contacts.js')
const router = express.Router()

router.get('/', async (req, res, next) => {
  contacts.listContacts().then(
    (contacts)=> {
      res.status(200).json({ message: contacts })
    }
  )
})

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  contacts.getContactById(contactId).then(
    (contact)=> {
      (contact.length === 1)
        ? res.status(200).json({ message: contact })
        : res.status(404).json({ message: 'Not found' })
    }
  )
})

router.post('/', async (req, res, next) => {
  const { name, email, phone} = req.body;
  (name=== undefined || email===undefined || phone===undefined)
    ? res.status(400).json({message: "missing fields"})
    : contacts.addContact(name, email, phone).then(
      (contacts)=> {
        res.status(200).json({ message: contacts })
      }
    )
})

router.delete('/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    contacts.removeContact(contactId).then(
      (result)=> {
        result.contactRemoved
        ? res.status(200).json({ message: result.newContactList })
        : res.status(404).json({ message: 'Not found' })
      }
    )      
})

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone} = req.body;
  (name=== undefined || email===undefined || phone===undefined)
    ? res.status(400).json({message: "missing fields"})
    : contacts.updateContact(contactId, name, email, phone).then(
        (result)=> {
          (result.contactUpdated === true)
            ? res.status(202).json({ message: result.newContactList})
            : res.status(404).json({ message: 'Not found' }) 
        }
      )
})

module.exports = router
// http://localhost:3000/api/contacts/rsKkOQUi80UsgVPCcLZZW
// {
//   "name": "sss",
//   "email": "sss",
//   "phone": "sss"
// }
