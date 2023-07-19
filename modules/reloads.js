import { temp } from "../main"
import { useHttp } from "./https.request"

let { request } = useHttp()
// subhead memberBox

export function reloadMembersToBox(arr, place) {
    place.innerHTML = ""

    for (let member of arr) {
        let members_box__item = document.createElement("div")
        let img = document.createElement("img")

        members_box__item.classList.add("members-box__item")

        img.src = `/public/icons/${member.icon}`

        members_box__item.append(img)
        place.append(members_box__item)
    }
}

// members to select

export function newOpt(arr, place) {
    place.innerHTML = "";
    let ghostOpt = new Option(" ", JSON.stringify(" "));
    for (let item of arr) {
        let opt = new Option(item.name, JSON.stringify(item));
        ghostOpt.hidden = true;
        place.append(ghostOpt, opt);
    }
}
// status select

export function createStatus(arr, place) {
    place.innerHTML = ""

    let ghostOpt = new Option(" ", " ")

    for (let item of arr) {
        let opt = new Option(item.title, JSON.stringify(item.id))
        ghostOpt.hidden = true;
        place.append(ghostOpt, opt)
    }
}

// todo reload

let temp_id
// containers
export function reloadContainers(arr, place) {

    let addCont = document.createElement("div")

    addCont.className = "addCont"

    place.innerHTML = ""
    place.append(addCont)

    for (let item of arr) {

        let data = item.title.toLowerCase().replaceAll(' ', '')

        let wrapper = document.createElement("div")
        let h2 = document.createElement("h2")
        let todos = document.createElement("div")

        wrapper.className = "wrapper"
        wrapper.setAttribute("data-status", item.title)

        todos.className = "todos"
        todos.setAttribute('data', data)
        todos.id = item.title.toLowerCase().replaceAll(' ', '')
        h2.contentEditable = `true`
        h2.innerHTML = item.title
        h2.className = "status-edit"
        h2.id = item.id

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
            temp.forEach((item) => {

                console.log(item);
                if (item.id == temp_id) {
                    request("/todos/" + item.id, "patch", {
                        status: this.getAttribute(['data'])
                    })
                    this.append(item)
                }
            })
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

// reload todo

export function reloadTodo(arr, place) {

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
        todo.setAttribute = ("data", item.status)

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

        let blockToAppend = document.querySelector(`#${item.status}`)
        blockToAppend.append(todo)

        console.log(item.status);
        temp.push(todo)

        todo.ondragstart = () => {
            temp_id = item.id
            todo.classList.add('hold')
            setTimeout(() => (todo.className = 'invisible'), 0)
            temp_id = item.id
        }

        todo.ondragend = () => {
            todo.className = 'todo'
        }

    }
}
