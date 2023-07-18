import { v4 as uuidv4 } from 'uuid';
import { validate } from './modules/regex';
import { useHttp } from './modules/https.request';
import { changeGradientColors } from './modules/bodyColor';
import { createStatus, newOpt, reloadMembersToBox } from './modules/reloads';
import { calendar } from './modules/calendar';
import { closeFunc, openFunc } from './modules/functions';

let { request } = useHttp()
calendar("#myDateInput")


changeGradientColors();

let open_add_modal = document.querySelector("#open_add_modal")
let add_modal = document.querySelector(".addNewUserWindow")
let add_modal_bg = document.querySelector(".addNewUserWindow_backGround")
let add_modal_close = document.querySelectorAll(".close")
let search_inp = document.querySelector('#search')
let search_canvas = document.querySelector('.canvas-for-search')
let main = document.querySelector('main')
let todos_for_search = []
let temp_id

let todos = document.querySelectorAll(".todos")

let boardBtn = document.querySelector(".board-btn")
let board_container = document.querySelector(".board_container")
boardBtn.onclick = () => {
    board_container.style.display = "block"
    setTimeout(() => {
        board_container.style.opacity = "1"
        board_container.style.height = "fit-content"
    }, 0);
    boardBtn.nextElementSibling.classList.add("board-btn-next")
}
request("/containers", "get")
    .then(res => {
        board_container.innerHTML = ""
        let close = document.createElement("div")
        close.className = "board-close"
        close.innerHTML = "x"
        board_container.append(close)
        close.onclick = () => {
            board_container.style.opacity = "0"
            board_container.style.height = "0"
            setTimeout(() => {
                board_container.style.display = "none"
            }, 0);
            boardBtn.nextElementSibling.classList.remove("board-btn-next")
            request("/containers", "get")
                .then(res => reloadContainers(res, main))
        }

        for (let item of res) {
            let p = document.createElement("p")
            p.innerHTML = item.title
            p.setAttribute("data-name", item.title)
            board_container.append(p)

            p.onclick = () => {
                let key = p.getAttribute("data-name")
                console.log(key);
                request("/containers?title=" + key, "get")
                    .then(res => reloadContainers(res, main))
            }
        }


    })



request("/containers", "get")
    .then(res => {
        reloadContainers(res, main)
    })

request("/todos", "get")
    .then(res => {
        todos_for_search = res
        todos.forEach(todo_wrap => {
        })
    })

open_add_modal.onclick = () => {
    openFunc(add_modal, add_modal_bg)
}
search_inp.onfocus = () => {
    search_canvas.style.display = "block"
    setTimeout(() => {
        search_canvas.style.opacity = "1"
    }, 0);
}
search_inp.onblur = () => {
    search_canvas.style.opacity = "0"
    setTimeout(() => {
        search_canvas.style.display = "none"
    }, 400);
    let elems = document.querySelectorAll('.finded')
    elems.forEach(el => el.classList.remove('finded'))
}

add_modal_close.forEach(btn => {
    btn.onclick = () => {
        closeFunc(add_modal, add_modal_bg)
        icons.forEach(icon => {
            icon.className = "icon"
            icon.style.border = "none"
            inp.style.border = "none"

        })
    }
})

search_inp.oninput = (e) => {
    let val = e.target.value.toLowerCase().trim()

    let filtered = todos_for_search.filter(item => item.title.toLowerCase().trim().includes(val))

    if (val) {
        let elems = document.querySelectorAll('.finded')
        elems.forEach(el => el.classList.remove('finded'))

        for (let finded of filtered) {
            let elem = document.getElementById(finded.id)
            let { bottom, top, height } = elem.getBoundingClientRect()
            elem.classList.add('finded')

            main.scrollTo({
                top: top - (height),
                behavior: "smooth"
            })
        }
    } else {
        for (let finded of filtered) {
            let elem = document.getElementById(finded.id)
            elem.classList.remove('finded')
        }
    }



}

let icons = document.querySelectorAll(".icons-cont div")

icons.forEach(icon => {
    let key = icon.getAttribute("data-icon")
    icon.innerHTML = `<img width="40px" src="/public/icons/${key}" alt="">`
    icon.onclick = () => {

        icons.forEach(icon => icon.className = "icon")
        icon.className = "selectedMember"
        icon.style.border = "none"

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
    icons.forEach(icon => {
        if (inp.value.length === 0 && !icon.classList.contains("selectedMember")) {
            allInputsFilled = false
            icon.style.border = "2px solid red"
            icon.style.borderRadius = "100%"
            inp.classList.add("error")


            for (let i = 0; i < icons.length; i++) {
                if (!inp.value.length === 0 && icons[i].classList.contains("selectedMember")) {
                    icon.style.border = "2px solid none"
                    allInputsFilled = true;


                    break; // Прерываем цикл, если найден элемент с классом selectedMember
                }
            }
        }
    })
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
    if (selectedArr.length === 0) {
        allInputsFilled = false
        select.classList.add("error")
    }

    if (allInputsFilled) {
        let todo = {
            id: uuidv4(),
        }

        let fm = new FormData(todoForm)
        let membersArr = []

        fm.forEach((value, key) => {
            todo[key] = value
        })
        selectedArr.forEach(member => membersArr.push(member.icon))
        todo.members = membersArr
        todo.status = JSON.parse(todo.status)
        todoForm.reset()


        request("/todos", "post", todo)


        request("/containers", "get")
            .then(res => {
                reloadContainers(res, main)
            })

        request("/containers/" + todo.status, "get")
            .then(res =>
                request("/containers/" + todo.status, "patch", { todos_id: [...res.todos_id, todo.id] })
            )

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

let contModal = document.querySelector(".contModal")
let contModal_bg = document.querySelector(".contModal_bg")
let createContForm = document.forms.createContForm
let containerName = createContForm.querySelector("input")

contModal_bg.onclick = () => {
    contModal.style.top = "-5%"
    setTimeout(() => {
        contModal.style.display = "none"
    }, 500);
    contModal_bg.style.opacity = "0"
    setTimeout(() => {
        contModal_bg.style.display = "none"
    }, 500);

}

createContForm.onsubmit = (e) => {
    e.preventDefault()

    let inpFilled = true

    containerName.style.border = "inherit"

    if (containerName.value.length === 0) {
        inpFilled = false
        containerName.style.border = "1px solid red"
    }
    if (inpFilled) {

        let container = {
            id: uuidv4(),
            todos_id: []
        }
        let fm = new FormData(createContForm)

        fm.forEach((val, key) => {
            container[key] = val
        })

        createContForm.reset()
        console.log(container);

        request("/containers", "post", container)

        request("/containers", "get")
            .then(res => {
                reloadContainers(res, main)
            })

        request("/containers", "get")
            .then(res => createStatus(res, status_select))



        contModal.style.top = "-5%"
        setTimeout(() => {
            contModal.style.display = "none"
        }, 500);
        contModal_bg.style.opacity = "0"
        setTimeout(() => {
            contModal_bg.style.display = "none"
        }, 500);
    }
}

// containers
function reloadContainers(arr, place) {

    let addCont = document.createElement("div")

    addCont.className = "addCont"

    place.innerHTML = ""
    place.append(addCont)

    for (let item of arr) {

        let wrapper = document.createElement("div")
        let h2 = document.createElement("h2")
        let todos = document.createElement("div")

        request("/todos", "get")
            .then(res => reloadTodo(res, todos))

        wrapper.className = "wrapper"
        wrapper.setAttribute("data-status", item.title)

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
            request("/todos", "get")
                .then(res => {
                    res.forEach(item => {
                        if (item.id === temp_id) {
                            this.append(JSON.stringify(item))
                        }
                    })
                })
        }
        h2.onkeyup = () => {

            request("/containers/" + todos.id, "patch", { title: [h2.innerHTML] })

        }
        addCont.onclick = () => {
            contModal.style.display = "block"
            setTimeout(() => {
                contModal.style.top = "12%"
            }, 0);
            contModal_bg.style.display = "block"
            setTimeout(() => {
                contModal_bg.style.opacity = "1"
            }, 0);
        }
    }
}
function reloadTodo(arr, place) {

    place.innerHTML = ""
    for (let item of arr) {

        let todo = document.createElement("div")
        let p = document.createElement("p")
        let descr = document.createElement("div")
        let todo_members = document.createElement("div")
        let pencil = document.createElement("div")
        let pencilSvg = document.createElement("img")



        for (let avatar of item.members) {
            let img = document.createElement("img")
            img.src = `/public/icons/${avatar}`
            todo_members.append(img)
        }



        let date = document.createElement("div")
        let exec_member = document.createElement("img")
        let span = document.createElement("span")

        todo.className = "todo"
        todo.draggable = "true";
        todo.id = item.id

        pencil.className = "pencil"
        p.innerHTML = item.title
        descr.className = "description"
        descr.innerHTML = item.description
        todo_members.className = "todo_members"
        date.className = "date"
        exec_member.className = "exec-member"
        exec_member.draggable = `false`
        exec_member.src = "/public/icons/deadline.png"
        pencilSvg.src = "/public/icons/pencil.svg"
        const number = new Date();
        number.setMonth(item.date.split(".")[1] - 1);
        span.innerHTML = item.date.split(".")[0] + " " + number.toLocaleString('en-US', { month: 'long' })


        todo.append(p, descr, todo_members, date, pencil)
        pencil.append(pencilSvg)
        date.append(exec_member, span)
        if (place.id === item.status) {
            place.append(todo)
        }
        todo.ondragstart = () => {
            todo.classList.add('hold')
            setTimeout(() => (todo.className = 'invisible'), 0)
            temp_id = item.id
        }
        todo.ondragend = () => {
            todo.className = 'todo'
        }

    }
}

