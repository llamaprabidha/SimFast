const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
    },

    properties: {
        value: "",
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "m1", "m2", "m3", "m4", "con", "map","m5", "m6", "m7", "m8",
            "m9", "m10", "m11", "m12", "trk", "usr","m13", "m14", "m15", "m16",
            "clear","backspace","space","enter",
            "init ctrl", "trk rpos", "trk susp", "term ctrl", "ndf off", "flt data", "multi func", "f8", "∆",".",
            "f9", "f10", "ca", "f12", "f13", "f14", "tgt gen", "f16", "ifr +", "vfr /",
            "a", "b", "c", "d", "e", "f", "g", "1", "2", "3",
            "h", "i", "j", "k", "l", "m", "n", "4", "5", "6",
            "o", "p", "q", "r", "s", "t", "u", "7", "8", "9",
            "v", "w", "x", "y", "z", "*", "", "", "0", "",
              ];

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["m8", "m16", "enter", ".", "vfr /", "3", "6", "9"].indexOf(key) !== -1;


            // Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");



            //Switch/cases
            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("BACKSPACE");
                    keyElement.classList.add("keyboard__utility__key__color");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

         
                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("ENTER");
                    keyElement.classList.add("keyboard__enter__key__color");

                    keyElement.addEventListener("click", () => {
                        parseCommand(document.getElementsByClassName('use-keyboard-input').item(0).value);
                        this.properties.value = '';
                        this._triggerEvent("oninput");
                        
                    });

                    break;

                case "clear":
                    keyElement.innerHTML = createIconHTML("CLEAR");
                    keyElement.classList.add("keyboard__utility__key__color");
                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 999999999999999999999)
                        this._triggerEvent("oninput");
                    });

                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("SPACE");
                    keyElement.classList.add("keyboard__utility__key__color");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "0":
                    keyElement.classList.add("keyboard__number__key");
                    keyElement.textContent = key.toUpperCase();
                    keyElement.addEventListener("click", () => {
                        this.properties.value += key;
                        this._triggerEvent("oninput");
                    });
                    break;


                case "m1":
                case "m2":
                case "m3":
                case "m4":
                case "con":
                case "map":
                case "m5":
                case "m6":
                case "m7":
                case "m8":  
                case "m9":
                case "m10":
                case "m11":
                case "m12":
                case "trk":
                case "usr":
                case "m13":
                case "m14":
                case "m15":
                case "m16":
                case "init ctrl":
                case "trk rpos":
                case "trk susp":
                case "term ctrl":
                case "ndf off":
                case "flt data":
                case "multi func":
                case "f8":
                case "f9":
                case "f10":
                case "ca":
                case "f12":
                case "f13":
                case "f14":
                case "tgt gen":
                case "f16":    
                    keyElement.classList.add("keyboard__control__key__color");
                    keyElement.textContent = key.toUpperCase();
                    keyElement.addEventListener("click", () => {
                        this.properties.value += key.toUpperCase();
                        this._triggerEvent("oninput");
                    });
               break;

                
    


                default:
                    keyElement.textContent = key.toUpperCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toUpperCase();
                        this._triggerEvent("oninput");
                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },
 
    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--visible");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--visible");
    }
};


window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});
