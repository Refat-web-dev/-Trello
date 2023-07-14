export const closeFunc = (modal, modal_bg) => {
    setTimeout(() => {
        modal.style.display = "none"
        modal_bg.style.display = "none"
    }, 500);
    modal.style.opacity = "0"
    modal.style.scale = ".5"
    modal_bg.style.opacity = "0"
}

export const openFunc = (modal, modal_bg) => {
    setTimeout(() => {
        modal.style.opacity = "1"
        modal.style.scale = "1"
        modal_bg.style.opacity = "1"
    }, 500);
    modal.style.display = "flex"
    modal_bg.style.display = "block"
}
