
// проверка на возможность использования position: sticky
// если нет, то будем использовать самописный полифил

let el: HTMLDivElement = document.createElement("div");
let options: string[] = ["", "-webkit-", "-ms-"];

const supportSticky: boolean = options.some((option: string) => {
    el.style.position = option + "sticky";

    return !!el.style.position;
});

el = null;
options = null;

export { supportSticky };
