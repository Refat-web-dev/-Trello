import { v4 as uuidv4 } from 'uuid';
import { validate } from './modules/regex';
import { useHttp } from './modules/https.request';

let { request } = useHttp()

function changeGradientColors() {
  const body = document.querySelector('body');
  let hue = 0;
  let rotation = 0;

  setInterval(() => {
    hue += 1;
    rotation += 1;

    const color1 = `hsl(${hue}, 100%, 70%)`;
    const color2 = `hsl(${(hue + 90) % 360}, 100%, 70%)`;

    body.style.background = `linear-gradient(${rotation}deg, ${color1}, ${color2})`;
  }, 100);
}

changeGradientColors();

// function changeGradientColors() {
//   const body = document.querySelector('body');
//   let hue = 0;
//   let rotation = 0;

//   setInterval(() => {

//     rotation += 1;

//     body.style.background = `linear-gradient(${rotation}deg, rgba(9, 50, 108, 1) 0%, rgba(193, 79, 154, 1) 100% )`;
//   }, 100);
// }

// changeGradientColors();
// let allMembers = [
//   {
//     id: 0,
//     name: ""
//   },
//   {
//     id: 1,
//     name: "alex"
//   },
//   {
//     id: 2,
//     name: "amina"
//   },
//   {
//     id: 3,
//     name: "xelo"
//   },
//   {
//     id: 4,
//     name: "Refat"
//   },
// ]

// // select

// let select = document.querySelector("select")
// let wrapper = document.querySelector(".wrapper")

// let selectedMembers = []

// reloadSelect(allMembers, select)

// select.onchange = () => {
//   let val = JSON.parse(select.value)
//   allMembers = allMembers.filter(member => member.id !== val.id)
//   selectedMembers.push(val)
//   reloadMembers(selectedMembers, wrapper)
//   reloadSelect(allMembers, select)
// }

// function reloadSelect(arr, place) {
//   place.innerHTML = ""
//   for (let member of arr) {
//     let opt = new Option(member.name, JSON.stringify(member))
//     place.append(opt)
//   }
// }

// function reloadMembers(arr, place) {
//   place.innerHTML = ""
//   for (let item of arr) {
//     let name = document.createElement("p")

//     name.innerHTML = item.name

//     place.append(name)

//     name.onclick = () => {
//       allMembers.push(item)
//       reloadSelect(allMembers, select)
//       selectedMembers = selectedMembers.filter(member => member.id !== item.id)
//       reloadMembers(selectedMembers, wrapper)
//       console.log(item);
//     }
//   }
// }

let open_add_modal = document.querySelector("#open_add_modal")
let add_modal = document.querySelector(".addNewUserWindow")
let add_modal_bg = document.querySelector(".addNewUserWindow_backGround")
let add_modal_close = document.querySelectorAll(".close")

open_add_modal.onclick = () => {
  setTimeout(() => {
    add_modal.style.opacity = "1"
    add_modal.style.scale = "1"
    add_modal_bg.style.opacity = "1"
  }, 500);
  add_modal.style.display = "flex"
  add_modal_bg.style.display = "block"

}
add_modal_close.forEach(btn => {
  btn.onclick = () => {
    setTimeout(() => {
      add_modal.style.display = "none"
      add_modal_bg.style.display = "none"
    }, 500);
    add_modal.style.opacity = "0"
    add_modal.style.scale = ".5"
    add_modal_bg.style.opacity = "0"
  }
})

let icons = document.querySelectorAll(".icons-cont div")

icons.forEach(icon => {
  let key = icon.getAttribute("data-icon")
  icon.innerHTML = `<img width="40px" src="/public/icons/${key}" alt="">`
  icon.onclick = () => {
    console.log(icon);

    icons.forEach(icon => icon.className = "icon")
    icon.className = "selectedMember"
  }
})



//get New User to cont

let userContForm = document.forms.userCont
let inp = userContForm.querySelector("input")

let members_box = document.querySelector(".members-box")
let members_box_count = document.querySelector(".last-child")
// regex

let patterns = {
  name: /^[a-z а-я,.'-]+$/i
}

inp.onkeyup = () => validate(patterns[inp.name], inp)

userContForm.onsubmit = (e) => {

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

    let fm = new FormData(userContForm)

    fm.forEach((value, key) => {
      member[key] = value
    })
    icons.forEach(icon => {
      if (icon.classList.contains("selectedMember")) {
        member.icon = icon.getAttribute("data-icon")
      }
    })
    userContForm.reset()
    console.log(member);

    request("/members", "post", member)
    // members box

    request("/members", "get")
      .then(res => {
        reloadMembersToBox(res.slice(0, 3), members_box)
        members_box_count.innerHTML = "+" + (res.length - 3)
      }
      )
    setTimeout(() => {
      add_modal.style.display = "none"
      add_modal_bg.style.display = "none"
    }, 500);
    add_modal.style.opacity = "0"
    add_modal.style.scale = ".5"
    add_modal_bg.style.opacity = "0"
  }
}

// members box

request("/members", "get")
  .then(res => {
    reloadMembersToBox(res.slice(0, 3), members_box)
    members_box_count.innerHTML = "+" + (res.length - 3)
  }
  )


function reloadMembersToBox(arr, place) {
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

flatpickr("#myDateInput", {
  theme: "gray" // Использование красной темы
});

// Инициализация "flatpickr" с настройками
flatpickr("#myDateInput", {
  dateFormat: "d.m.Y", // Формат даты
  minDate: "today", // Минимальная дата (сегодняшняя дата)
  maxDate: new Date().fp_incr(30), // Максимальная дата (через 30 дней от сегодняшней даты)
  locale: {
    firstDayOfWeek: 1, // Понедельник как первый день недели
    weekdays: {
      shorthand: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      longhand: [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
      ],
    },
    months: {
      shorthand: [
        "Янв",
        "Фев",
        "Мар",
        "Апр",
        "Май",
        "Июн",
        "Июл",
        "Авг",
        "Сен",
        "Окт",
        "Ноя",
        "Дек",
      ],
      longhand: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ],
    },
  },
});

let createTodoModal = document.querySelector(".create")
let todoModal = document.querySelector(".todoModal")
let todoModal_bg = document.querySelector(".todoModal_bg")
let todoModal_close = document.querySelectorAll(".todoModal_exit")

createTodoModal.onclick = () => {
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

  }
})

// todo form

let todoForm = document.forms.todoForm
let todoInp = todoForm.querySelectorAll("input")

let todo_wrappers = document.querySelector(".wrapper")
let select = todoForm.querySelector("#members")
let selected_items = todoForm.querySelector(".selected-items")


request("/members", "get")
  .then(res => {
    newOpt(res, select)
  })

function newOpt(arr, place) {
  place.innerHTML = ""
  for (let item of arr) {
    let opt = new Option(item.name, JSON.stringify(item))
    let ghostOpt = new Option(" ", JSON.stringify(" "))
    ghostOpt.hidden = "true"
    place.append(ghostOpt, opt)
  }
}
let selectedArr = []

select.onchange = () => {
  let val = JSON.parse(select.value)
  request("/members/" + val.id, "delete",)
  selectedArr.push(val)
  request("/members", "get")
    .then(res => {
      res = res.filter(selected => selected.id !== val.id)
      newOpt(res, select)
    })
  reloadMembersToSelected(selectedArr, selected_items)
}

function reloadMembersToSelected(arr, place) {
  place.innerHTML = ""

  for (let item of arr) {

    let selected_item = document.createElement("div")

    let img = document.createElement("img")
    let span = document.createElement("span")
    let remove = document.createElement("div")

    selected_item.classList.add("selected-item")

    span.innerHTML = item.name
    img.src = `/public/icons/${item.icon}`

    remove.classList.add("remove")
    remove.innerHTML = "x"

    selected_item.append(img, span, remove)
    place.append(selected_item)

    remove.onclick = () => {
      selectedArr = selectedArr.filter(selected => selected.id !== item.id)
      selected_item.remove()
      request("members", "post", item)
      let opt = new Option(item.name, JSON.stringify(item))
      select.append(opt)
    }
  }
}
// regex

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


    userContForm.reset()
    console.log(todo);

    request("/todos", "post", todo)
    // members box

    // request("/todos", "get")
    //   .then(res => {
    //     todo_wrappers.forEach(wrapper => {
    //       reloadTodos(res, wrapper)
    //     })
    //   }
    //   )
    setTimeout(() => {
      todoModal.style.display = "none"
      todoModal_bg.style.display = "none"
    }, 500);
    todoModal.style.opacity = "0"
    todoModal.style.scale = ".5"
    todoModal_bg.style.opacity = "0"
  }
}
