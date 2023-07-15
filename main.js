import { v4 as uuidv4 } from 'uuid';
import { validate } from './modules/regex';
import { useHttp } from './modules/https.request';
import { changeGradientColors } from './modules/bodyColor';
import { createStatus, newOpt, reloadMembersToBox, reloadTodo } from './modules/reloads';
import { calendar } from './modules/calendar';
import { closeFunc, openFunc } from './modules/functions';

let { request } = useHttp()
calendar("#myDateInput")

changeGradientColors();

let open_add_modal = document.querySelector("#open_add_modal")
let add_modal = document.querySelector(".addNewUserWindow")
let add_modal_bg = document.querySelector(".addNewUserWindow_backGround")
let add_modal_close = document.querySelectorAll(".close")

open_add_modal.onclick = () => {
    openFunc(add_modal, add_modal_bg)
}

add_modal_close.forEach(btn => {
    btn.onclick = () => {
        closeFunc(add_modal, add_modal_bg)
    }
})

let icons = document.querySelectorAll(".icons-cont div")

icons.forEach(icon => {
    let key = icon.getAttribute("data-icon")
    icon.innerHTML = `<img width="40px" src="/public/icons/${key}" alt="">`
    icon.onclick = () => {

        icons.forEach(icon => icon.className = "icon")
        icon.className = "selectedMember"

    }
})



//get New User to cont

let membersBoxForm = document.forms.userCont
let inp = membersBoxForm.querySelector("input")

let members_box = document.querySelector(".members-box")
let members_box_count = document.querySelector(".last-child")

// regex

let patterns = {
    name: /^[a-z а-я,.'-]+$/i
}

inp.onkeyup = () => validate(patterns[inp.name], inp)

// create a new member in a membersBox with Form

membersBoxForm.onsubmit = (e) => {

    e.preventDefault()

    let allInputsFilled = true

    inp.classList.remove("error")

    if (inp.value.length === 0) {
        inp.classList.add("error")
        allInputsFilled = false
    }

    if (allInputsFilled) {
        let member = {
            id: uuidv4(),
        }

        let fm = new FormData(membersBoxForm)

        fm.forEach((value, key) => {
            member[key] = value
        })

        icons.forEach(icon => {
            if (icon.classList.contains("selectedMember")) {
                member.icon = icon.getAttribute("data-icon")
            }
        })

        membersBoxForm.reset()

        request("/members", "post", member)

        request("/members", "get")
            .then(res => {

                reloadMembersToBox(res.slice(0, 3), members_box)
                newOpt(res, select)
                if (res.length <= 3) {
                    members_box_count.innerHTML = "+"
                } else {
                    members_box_count.innerHTML = "+" + (res.length - 3)
                }

            }
            )
        closeFunc(add_modal, add_modal_bg)

    }
}


// members box

request("/members", "get")
    .then(res => {
        reloadMembersToBox(res.slice(0, 3), members_box)
        if (res.length <= 3) {
            members_box_count.innerHTML = "+"
            members_box_count.onclick = () => {
                openFunc(add_modal, add_modal_bg)
            }
        } else {
            members_box_count.innerHTML = "+" + (res.length - 3)
        }
    }
    )

let openTodoModal = document.querySelector(".create")
let todoModal = document.querySelector(".todoModal")
let todoModal_bg = document.querySelector(".todoModal_bg")
let todoModal_close = document.querySelectorAll(".todoModal_exit")

openTodoModal.onclick = () => {
    setTimeout(() => {
        todoModal.style.opacity = "1"
        todoModal.style.scale = "1"
        todoModal_bg.style.opacity = "1"
    }, 500);
    todoModal.style.display = "flex"
    todoModal_bg.style.display = "block"
}

todoModal_close.forEach(btn => {
    btn.onclick = () => {
        setTimeout(() => {
            todoModal.style.display = "none"
            todoModal_bg.style.display = "none"
        }, 500);
        todoModal.style.opacity = "0"
        todoModal.style.scale = ".5"
        todoModal_bg.style.opacity = "0"
        selectedArr = []
        request("/members", "get")
            .then(res => newOpt(res, select))

        reloadMembersToSelected(selectedArr, selected_items)
        todoForm.reset()
    }
})

// todo form

let todoForm = document.forms.todoForm
let todoInp = todoForm.querySelectorAll("input")

let todo_wrappers = document.querySelectorAll(".wrapper")
let select = todoForm.querySelector("#members");
let selected_items = todoForm.querySelector(".selected-items");
let allMembers = []
let selectedArr = []

request("/members", "get")
    .then(res => {
        newOpt(res, select)
        allMembers.push(...res)
    });



select.onchange = () => {
    let val = JSON.parse(select.value);
    selectedArr.push(val);
    allMembers = allMembers.filter(selected => selected.id !== val.id);
    newOpt(allMembers, select);
    reloadMembersToSelected(selectedArr, selected_items);
};

function reloadMembersToSelected(arr, place) {
    place.innerHTML = "";

    for (let item of arr) {
        let selected_item = document.createElement("div");
        let img = document.createElement("img");
        let span = document.createElement("span");
        let remove = document.createElement("div");

        selected_item.classList.add("selected-item");

        span.innerHTML = item.name;
        img.src = `/public/icons/${item.icon}`;

        remove.classList.add("remove");
        remove.innerHTML = "x";

        selected_item.append(img, span, remove);
        place.append(selected_item);

        remove.onclick = () => {
            selectedArr = selectedArr.filter(selected => selected.id !== item.id);
            allMembers.push(item)
            newOpt(allMembers, select);
            selected_item.remove();
        };
    }
}

let status_select = document.querySelector("#create-status")

request("/containers", "get")
    .then(res => createStatus(res, status_select))


todoForm.onsubmit = (e) => {

    e.preventDefault()

    let allInputsFilled = true

    todoInp.forEach(inp => {
        inp.classList.remove("error")

        if (inp.value.length === 0) {
            inp.classList.add("error")
            allInputsFilled = false
        }
    })


    if (allInputsFilled) {
        let todo = {
            id: uuidv4(),
        }

        let fm = new FormData(todoForm)

        fm.forEach((value, key) => {
            todo[key] = value
        })
        let membersArr = []
        selectedArr.forEach(member => membersArr.push(member.icon))
        todo.members = membersArr
        todo.status = JSON.parse(todo.status)
        todoForm.reset()
        console.log(todo);

        request("/todos", "post", todo)

        request("/containers", "get")
            .then(res => reloadContainers(res, main))

        setTimeout(() => {
            todoModal.style.display = "none"
            todoModal_bg.style.display = "none"
            selectedArr = []
            request("/members", "get")
                .then(res => newOpt(res, select))

            reloadMembersToSelected(selectedArr, selected_items)
        }, 500);
        todoModal.style.opacity = "0"
        todoModal.style.scale = ".5"
        todoModal_bg.style.opacity = "0"
    }
}

let main = document.querySelector("main")

request("/containers", "get")
    .then(res => reloadContainers(res, main))

function reloadContainers(arr, place) {
    place.innerHTML = ""

    for (let item of arr) {

        let wrapper = document.createElement("div")
        let h2 = document.createElement("h2")
        let todos = document.createElement("div")
        request("/todos", "get")
            .then(res => {
                reloadTodo(res, todos)
            })
        wrapper.className = "wrapper"
        todos.className = "todos"
        todos.id = item.id
        h2.contentEditable = `true`
        h2.innerHTML = item.title
        wrapper.append(h2, todos)
        place.append(wrapper)

        todos.ondragover = (event) => {
            event.preventDefault()
        }
        todos.ondragenter = function (event) {
            event.preventDefault()
            this.className += ' hovered'
        }
        todos.ondragleave = function () {
            this.className = 'todos'
        }
        todos.ondrop = function () {
            this.className = 'todos'
            // this.append(JSON.stringify(item))
        }
    }
}

 