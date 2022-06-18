class User {
    #data = {}

    constructor(userData) {
        this.#data = userData;       
    }

    edit(editData) {

        this.#data = {...this.#data, ...editData};
    }

    get() {
        return this.#data;
    }

};

class Contacts {
    #data = [];
    #lastID = 0;

    async getData() {      
        let apiData = await  fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            return response.json()
        })
        .then(result=> {
            result.forEach(item => {
                const user =  {
                    name: item.name, 
                    email: item.email,
                    phone: item.phone,
                    address: `${item.address.city}`
                }
                this.add(user)
            })
           
        })
        return apiData;
    };

    add(addContactData){ 
        addContactData = {...addContactData, ...{id: this.#lastID}}
        let user = new User(addContactData);
        this.#data.push(user)
        this.#lastID++
    };

    edit(ID, editContactData){
        let contact = this.#data.find((elem) => elem.get().id == ID)
        contact.edit(editContactData)
    };

    remove(ID) {
        let dataTmp = this.#data.filter((elem) => {
            return elem.get().id != ID;
        });

        this.#data = dataTmp;
    };

    get(id) { 
        if (id || id == 0) {
            let display = this.#data.find((elem) => {
                return elem.get().id == id;
            });
            return display
        } else {

        return this.#data;}
    }
};

class ContactsApp extends Contacts {
    #app;

    constructor () {
        super();
        this.getStorage(). then(() => this.update())
        this.update()
    }

    onAdd(userData) {
        this.add(userData);
        this.setStorage()
        this.update();
    }

    update() {
        
        this.clearStorage()

        if (document.querySelector('.add_new_contact')) document.querySelector('#addNewContact').remove()
        let container = document.querySelector('.app');
        this.#app = document.createElement('div');
        this.#app.classList.add('add_new_contact');
        this.#app.id = 'addNewContact';
        container.append(this.#app);

        const h1 = document.createElement('div');
        h1.innerHTML = `
            <h1>Список Контактов</h1>
        `
    
        const inputName = document.createElement('input');
        inputName.classList.add('contact-form-name');
        inputName.name = 'name';
        inputName.type = 'text';
        inputName.placeholder = 'Фамилия Имя Отчество';

        const inputEmail = document.createElement('input');
        inputEmail.classList.add('contact-form-email');
        inputEmail.name = 'email';
        inputEmail.type = 'email';
        inputEmail.placeholder = 'Email';

        const inputPhone = document.createElement('input');
        inputPhone.classList.add('contact-form-phone');
        inputPhone.name = 'phone';
        inputPhone.type = 'number';
        inputPhone.placeholder = 'Номер телефона';
        
        const inputAddress = document.createElement('input');
        inputAddress.classList.add('contact-form-address');
        inputAddress.name = 'address';
        inputAddress.type = 'text';
        inputAddress.placeholder = 'Адрес';

        const addButton = document.createElement('button');
        addButton.classList.add('add_btn');
        addButton.innerHTML = `
            <img src="img/add-user.png">
            <span>Добавить контакт</span>
        `

        const data = this.get()
        const listContacts = document.createElement('div');
        listContacts.classList.add('list_contacts');

        const ulName = document.createElement('ul')
        ulName.classList.add('ul_name');
            ulName.innerHTML = `
            <li>
                <img src="img/user.png">
                <span>Ф.И.О</span>
            </li>
            <li>
                <img src="img/email.png">
                <span>Email</span>
            </li>
            <li>
                <img src="img/telephone.png">
                <span>Телефон</span>
            </li>
            <li>
                <img src="img/home.png">
                <span>Адрес</span>
            </li>
            <li>Действия</li>
            `

        this.#app.append(h1, inputName, inputEmail, inputPhone, inputAddress, addButton, ulName, listContacts)
        
        data.forEach((contact) => {
            const contactData = contact.get();

            const contactInfo = document.createElement('ul')
            contactInfo.innerHTML = `
            <li>${contactData.name}</li>
            <li>${contactData.email}</li>
            <li>${contactData.phone}</li>
            <li>${contactData.address}</li>
            `

            const editButton = document.createElement('button');
            editButton.classList.add('edit')
            
            const imgEdit = document.createElement('img')
            imgEdit.setAttribute('src','img/edit.png')
            imgEdit.setAttribute('alt','#')
            editButton.append(imgEdit)
            editButton.addEventListener('click', (event) => {
                this.onEdit(contactData.id)
            })
            
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove')
            
            const imgRemove = document.createElement('img')
            imgRemove.setAttribute('src','img/bin.png')
            removeButton.append(imgRemove)
            removeButton.addEventListener('click', (event) => {
                this.onRemove(contactData.id);
            })

                listContacts.append(contactInfo)
                contactInfo.append(editButton, removeButton)
                
            });
            
            addButton.addEventListener('click', (event) => {
                event.preventDefault()
    
                if (inputName.value == '' && inputEmail.value == '' && inputPhone.value == '' && inputAddress.value == '') {
                    return;
                } else {
                    const userData = {
                    name:inputName.value,
                    email:inputEmail.value,
                    phone:inputPhone.value,
                    address:inputAddress.value,
                }
    
                this.onAdd(userData)
               
                }
            });       
           
        };

        clearStorage() {
            if (document.cookie.includes('storageExpiration') == false) {
                localStorage.removeItem('addNewContact')
            }
        }

        setStorage() { 

            let dataTmp = this.get().map(elem =>{
                return elem.get()
            })
          
            dataTmp = JSON.stringify(dataTmp)
    
            localStorage.setItem('addNewContact', dataTmp)
    
            let date = new Date(Date.now() + 259200000);
            date = date.toUTCString();
            document.cookie = 'storageExpiration=true; expires=' + date
        }

        async getStorage() { 

            let dataLocal = localStorage.getItem('addNewContact')
        
            if (!dataLocal || dataLocal == '[]') {
                dataLocal = await  this.getData();
                return dataLocal
            } 
    
            dataLocal = JSON.parse(dataLocal);
           
            dataLocal.forEach(item => {
                console.log(item)
                this.add(item);
            });
    
        }

        onRemove(id) { 
            this.remove(id);
            this.setStorage()
            this.update();
        }

        onEdit(id) { 
            let contact = this.get(id)
            
            let editForm = document.querySelector('.editForm');
            if (editForm) editForm.remove();
    
            editForm = document.createElement('div');
            editForm.classList.add('editForm');

            let heading = document.createElement('div');
            heading.classList.add('heading');

            const imgHeadingEdit = document.createElement('img')
            imgHeadingEdit.setAttribute('src','img/edit.png')
            heading.append(imgHeadingEdit)

            let span = document.createElement('span')
            span.innerHTML = 'Редактировать контакт'
            heading.append(span)
            
            const inputName = document.createElement('input');
            inputName.value = contact.get().name
            
            const inputEmail = document.createElement('input');
            inputEmail.value = contact.get().email
    
            const inputPhone = document.createElement('input');
            inputPhone.value = contact.get().phone
    
            const inputAddress = document.createElement('input');
            inputAddress.value = contact.get().address
    
            const saveUpdate = document.createElement('button');
            saveUpdate.classList.add('update_btn');
            saveUpdate.innerHTML = `
                <img src="img/diskette.png">
                <span>Сохранить редактирование</span>
            `

            editForm.append(heading, inputName, inputEmail, inputPhone, inputAddress, saveUpdate);

            document.body.append(editForm)
    
            saveUpdate.addEventListener('click', () => {
                let newData = {};
    
                newData.name = inputName.value
                newData.phone = inputPhone.value
                newData.email = inputEmail.value
                newData.address = inputAddress.value
    
                editForm.remove();
    
                this.edit(id, newData)
                this.setStorage()
                this.update()
            });
        };
    };

let contacts = new ContactsApp();