import { v4 as uuidv4 } from 'uuid';
import { validate } from './modules/regex';
import { useHttp } from './modules/https.request';
import { changeGradientColors } from './modules/bodyColor';
import { createStatus, newOpt, reloadContainers, reloadMembersToBox, reloadTodo } from './modules/reloads';
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



export let temp = []


let boardBtn = document.querySelector(".board-btn")
let board_container = document.querySelector(".board_container")
boardBtn.onclick = () => {
    board_container.style.display = "block"
    setTimeout(() => {
        board_container.style.opacity = "1"
    }, 0);
    boardBtn.nextElementSibling.classList.add("board-btn-next")
}
request("/containers", "get")
    .then(res => {
        reloadContainers(res, main)


        board_container.innerHTML = ""

        let close = document.createElement("div")
        let all = document.createElement("p")

        close.className = "board-close"
        all.innerHTML = "All"
        close.innerHTML = "x"

        board_container.append(all, close)

        close.onclick = () => {
            board_container.style.opacity = "0"
            setTimeout(() => {
                board_container.style.display = "none"
            }, 300);
            boardBtn.nextElementSibling.classList.remove("board-btn-next")
        }

        all.onclick = () => {
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
                request("/containers?title=" + key, "get")
                    .then(res => reloadContainers(res, main))
            }
        }


    }).then(() => {

        let status_list = main.querySelectorAll(".status-edit")

        status_list.forEach(h2 => {

            h2.onkeyup = () => {

                request("/containers/" + h2.id, "patch", { title: h2.innerHTML })
            }
        })

        request("/todos", "get")
            .then(res => {
                todos_for_search = res

                let todos = document.querySelectorAll(".todos")

                todos.forEach(todo_wrap => {
                    reloadTodo(res, todo_wrap)
                })
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
    let val = e.target.value.toLowerCase().trim();
    let filtered = todos_for_search.filter(item => item.title.toLowerCase().trim().includes(val));

    if (val) {
        let elems = document.querySelectorAll('.finded');
        elems.forEach(el => el.classList.remove('finded'));

        let topBoundary = null;
        let bottomBoundary = null;

        for (let finded of filtered) {
            let elem = document.getElementById(finded.id);
            let { top, bottom } = elem.getBoundingClientRect();
            elem.classList.add('finded');

            if (topBoundary === null || top < topBoundary) {
                topBoundary = top;
            }

            if (bottomBoundary === null || bottom > bottomBoundary) {
                bottomBoundary = bottom;
            }
        }

        if (topBoundary !== null && bottomBoundary !== null) {
            // Если хотя бы один элемент за пределами видимой области, выполните прокрутку к первому из них
            if (topBoundary < 0 || bottomBoundary > window.innerHeight) {
                main.scrollTo({
                    top: topBoundary + main.scrollTop - (window.innerHeight / 2),
                    behavior: 'smooth'
                });
            }
        }
    } else {
        let elems = document.querySelectorAll('.finded');
        elems.forEach(el => el.classList.remove('finded'));
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
export let todoModal = document.querySelector(".todoModal")
export let todoModal_bg = document.querySelector(".todoModal_bg")
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
        todo.status = JSON.parse(todo.status.toLowerCase().replaceAll(" ", ""))
        todoForm.reset()


        request("/todos", "post", todo)


        request("/containers", "get")
            .then(res => {
                reloadContainers(res, main)
            })

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
            id: uuidv4()
        }
        let fm = new FormData(createContForm)

        fm.forEach((val, key) => {
            container[key] = val
        })

        createContForm.reset()

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
