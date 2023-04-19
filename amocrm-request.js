const limit = 25;
const now = new Date();
const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
let completeTill = Math.round(oneDayFromNow / 1000);
let page = 1;
let getContactsListQueryUrl = '/api/v4/contacts';
let createTaskQueryUrl = '/api/v4/tasks';

//получаем контакты
function getContacts() {
    $.ajax({
        url: getContactsListQueryUrl,
        method: 'GET',
        data: {
            limit: limit,
            with: 'leads',
            page: page
        }
    }).done(function(data) {
        if (!!data && !!data._embedded && !!data._embedded.contacts) {
            data._embedded.contacts.forEach(function(contact) {
                if (!contact._embedded || !contact._embedded.leads || contact._embedded.leads.length === 0) {
                    createTask(contact.id);
                }
            });

            // Если есть еще страницы с контактами, запрашиваем следующую страницу
            if (data._embedded.contacts.length === limit) {
                page++;
                getContacts();
            }
        } else {
            console.log('Контактов нет');
            return false;
        }
    }).fail(function(data) {
        console.log('Что-то пошло не так c получением контактов');
        console.log(data);
        return false;
    })
}

function createTask(contactId) {
    $.ajax({
        url: createTaskQueryUrl,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            complete_till: completeTill,
            text: "Контакт без сделок"
        })
    }).done(function(data) {
        console.log('Создана задача для контакта с ID ' + contactId);
    }).fail(function(data) {
        console.log('Ошибка при создании задачи');
        console.log(data);
    })
}
getContacts();