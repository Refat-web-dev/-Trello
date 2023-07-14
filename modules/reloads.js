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

// members to selected-items

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
