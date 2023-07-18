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


