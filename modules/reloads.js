import { contModal, contModal_bg, temp, todoModal, todoModal_bg } from "../main"
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
    ghostOpt.hidden = true;

    for (let item of arr) {
        let opt = new Option(item.title, JSON.stringify(item.title))
        place.append(opt)
    }
}

// todo reload

let temp_id

// containers

export function reloadContainers(arr, place) {
    let addCont = document.createElement("div");
    addCont.className = "addCont";

    place.innerHTML = "";
    place.append(addCont);

    for (let item of arr) {
        let data = item.title.toLowerCase().replaceAll(' ', '');
        let wrapper = document.createElement("div");
        let h2 = document.createElement("h2");
        let more = document.createElement("span");
        let todos = document.createElement("div");

        more.className = "more";
        wrapper.className = "wrapper";
        wrapper.setAttribute("data-status", item.title);

        todos.className = "todos";
        todos.setAttribute('data', data);
        todos.id = item.title.toLowerCase().replaceAll(' ', '');
        h2.contentEditable = true;
        h2.innerHTML = item.title;
        h2.className = "status-edit";
        h2.id = item.id;
        more.innerHTML = "...";
        wrapper.append(h2, more, todos);
        place.append(wrapper);

        let startX; // Начальная позиция по оси X
        let isDragging = false;

        // Функция для обработки начала перемещения элемента
        function handleMouseDown(event) {
            if (event.target === more) { // Проверяем, что событие происходит на элементе "more"
                isDragging = true;
                startX = event.clientX - wrapper.offsetLeft;
            }
        }

        // Функция для обработки перемещения элемента
        function handleMouseMove(event) {
            if (isDragging) {
                const newX = event.clientX - startX;
                wrapper.style.left = `${newX}px`; // Устанавливаем новую позицию элемента по оси X
            }
        }

        // Функция для обработки окончания перемещения элемента
        function handleMouseUp() {
            isDragging = false;
        }

        // Добавляем обработчики событий только для элемента "more"
        more.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        h2.onkeydown = () => {
            request("/containers/" + h2.id, "patch", { title: h2.innerHTML });

            request("/todos", "get").then(res => {
                res.forEach(todo => {
                    console.log(todo);
                    if (todo.status === todos.getAttribute("data")) {
                        request("/todos/" + todo.id, "patch", {
                            status: h2.innerHTML.toLowerCase().replaceAll(" ", "")
                        });
                    }
                });
            });
        };

        todos.ondragover = event => {
            event.preventDefault();
        };

        todos.ondragenter = function (event) {
            event.preventDefault();
            this.className += ' hovered';
        };

        todos.ondragleave = function () {
            this.className = 'todos';
        };

        todos.ondrop = function () {
            this.className = 'todos';
            let todosBlock = document.querySelectorAll('.todo');
            todosBlock.forEach(el => el.style.margin = "0");
            temp.forEach(item => {
                if (item.id == temp_id) {
                    request("/todos/" + item.id, "patch", {
                        status: this.getAttribute(['data'])
                    });
                    this.append(item);
                }
            });
        };

        addCont.onclick = () => {
            contModal.style.display = "block";
            setTimeout(() => {
                contModal.style.top = "12%";
            }, 0);
            contModal_bg.style.display = "block";
            setTimeout(() => {
                contModal_bg.style.opacity = "1";
            }, 0);
        };
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
            img.src = `icons/${avatar}`
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

        temp.push(todo)

        todo.ondragstart = () => {
            temp_id = item.id
            todo.classList.add('hold')
            setTimeout(() => (todo.className = 'invisible'), 0)
        }

        todo.ondragend = () => {
            todo.className = 'todo'
        }

        let todos = document.querySelectorAll('.todo')

        todos.forEach(card => {
            card.ondragenter = function (e) {
                let center = card.getBoundingClientRect().height / 2
                let {
                    layerY
                } = e
                todos.forEach(card => card.style.margin = "0px")

                if (layerY > center) {
                    card.style.marginBottom = "146px"
                } else {
                    card.style.marginTop = "146px"
                }

            }
        });

        pencil.onclick = () => {
            todoModal.querySelector("#title").value = item.title
            todoModal.querySelector("textarea").value = item.description
            todoModal.querySelector("#myDateInput").value = item.date

            setTimeout(() => {
                todoModal.style.opacity = "1"
                todoModal.style.scale = "1"
                todoModal_bg.style.opacity = "1"
            }, 500);
            todoModal.style.display = "flex"
            todoModal_bg.style.display = "block"
        }

    }
}
