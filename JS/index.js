// handler of submit button
function api_submit() {

    // validate entered name
    if (!checkName()) {
        showError("Not valid")
        return false;
    }

    let url = create_url()

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    "Network response was not ok, " + response.status
                );
            }
            return response.text();
        })
        .then((content) => {
            fill_box(content)
        })
        .catch((error) => {
            showError(error)
        });
}


// validate entered name
function checkName() {

    let term = document.forms["name-box"]["name"].value

    // just letters and space is valid, max length checked before in html.
    var re = /^[a-zA-Z\s]*$/

    return re.test(term)
}


// create url by concatenating website address and name query.
function create_url() {

    let base_url = "https://api.genderize.io/?name="
    let name = document.forms["name-box"]["name"].value
    let complete_url = base_url + name

    return complete_url
}


// fill right box with result
function fill_box(text) {

    let obj = JSON.parse(text)

    document.getElementById("predicted_gender").textContent = "Gender: " + obj.gender
    document.getElementById("predicted_probability").textContent = "probability: %" + obj.probability * 100

    // get saved value
    let saved_gender = localStorage.getItem(obj.name)
    console.log("saved_gender:", saved_gender)

    // if gender saved for this user before, show it.
    if (saved_gender) {

        let parent = document.getElementById("saved_data_box")
        parent.style.visibility = "visible"

        // if has child, edit the context.
        if (parent.hasChildNodes()) {

            let ch1 = document.getElementById("saved_data_box_paragraph")
            ch1.innerText = "saved gender: " + saved_gender

            // if it doesn't have child, add a new one. 
        } else {

            create_new_child(parent, saved_gender, obj.name)
        }

        // if gender didn't save for this user before, hide the box.
    } else {

        let parent = document.getElementById("saved_data_box")
        parent.style.visibility = "hidden"
    }
}

// create new child that consist of a paragraph and a button.
function create_new_child(parent, saved_gender, name) {

    // a paragraph to show the result
    let ch1 = document.createElement("p");
    ch1.id = "saved_data_box_paragraph"
    ch1.className = "item"
    ch1.innerText = "saved gender: " + saved_gender;
    parent.appendChild(ch1);

    // a button to clear saved result
    let ch2 = document.createElement("button");
    ch2.id = "saved_data_box_button"
    ch2.className = "btn"
    ch2.innerHTML = 'clear';

    // add event listener for clear button to clear saved name and gender.
    ch2.addEventListener("click", function () {
        clear_button_on_click(name);
    });

    parent.appendChild(ch2);
}


// handler for clear button
function clear_button_on_click(name) {

    localStorage.removeItem(name)
    let parent = document.getElementById("saved_data_box")
    parent.style.visibility = "hidden"
    console.log("removed one item from local storage")
}


// handler for save button 
function save_local_storage() {

    let name = document.forms["name-box"]["name"].value
    let gender = ""

    // if one of the radio buttons checked, it saves.
    if (document.getElementById('radio1').checked) {
        gender = "male"

    } else if (document.getElementById('radio2').checked) {
        gender = "female"

        // if none of them checked, save predicted value.
    } else {

        gender = document.getElementById("predicted_gender").textContent
    }

    localStorage.setItem(name, gender)
    console.log("new item saved to local storage.")
}


// show error box
function showError(text) {
    let errorWrapper = document.getElementById('error')
    errorWrapper.style.width = '30%'
    errorWrapper.textContent = text
    setTimeout(() => {
        errorWrapper.style.width = '0'
        errorWrapper.textContent = ''
    }, 3000)
}