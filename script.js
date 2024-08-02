let input = document.getElementById("input")
let btn = document.getElementById("btn")
let listContainer = document.querySelector(".list-container")

btn.addEventListener("click", () => {
    if (input.value == "") {
        input.classList.add("red")
        input.placeholder = `Please enter a Task`
        input.classList.toggle("shake")
        audioEffect()
    }
    else {
        input.classList.remove("red")
        input.classList.remove("shake")
        input.placeholder = `Enter your task here`

        if (btn.textContent === "Update" && taskBeingEdited) {
            taskBeingEdited.firstChild.textContent = input.value;;
            btn.textContent = "Add";
            taskBeingEdited = null;
        }
        else {
            let task = createTask(input.value)
        }
    }
    input.value = ""
    saveData();
})


input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        btn.click()
    }
})


const createTask = (taskText) => {
    let li = document.createElement("li")
    li.innerHTML = taskText
    listContainer.appendChild(li)
    updateMsg()
    let div = document.createElement("div")
    div.classList.add("icons")
    div.innerHTML += `<i class="fa fa-edit edit"></i>`
    div.innerHTML += `<i class="fa fa-trash trash"></i>`
    li.appendChild(div)
    editEvent(li)
    trashEvent(li)
    return li
}


const editEvent = (li) => {
    let editIcon = li.querySelector('.fa-edit')
    editIcon.addEventListener('mouseover', () => {
        editIcon.classList.add('fa-bounce');
    });
    editIcon.addEventListener('mouseout', () => {
        editIcon.classList.remove('fa-bounce');
    });
}

const trashEvent = (li) => {
    let trashIcon = li.querySelector('.fa-trash')
    trashIcon.addEventListener('mouseover', () => {
        trashIcon.classList.add('fa-shake');
    });
    trashIcon.addEventListener('mouseout', () => {
        trashIcon.classList.remove('fa-shake');
    });
}
const updateMsg = () => {
    if (!listContainer.querySelector("li")) {
        let msg = document.createElement("div")
        msg.classList.add("msg")
        msg.textContent = "No task added yet"
        listContainer.appendChild(msg)
    } else {
        let msg = document.querySelector(".msg")
        if (msg) {
            msg.remove()
        }
    }
}
updateMsg()
listContainer.addEventListener("click", (e) => {
    const li = e.target.closest("li");

    if (e.target.tagName === "I" && e.target.classList.contains("fa-trash")) {
        e.target.parentElement.parentElement.remove();
        deleteData(Array.prototype.indexOf.call(listContainer.children, e.target.closest("li")));
        updateMsg()
    } else if (e.target.tagName === "I" && e.target.classList.contains("fa-edit")) {
        editTask(e.target.parentElement.parentElement);
    } else if (li && !e.target.closest(".icons")) {
        // Ensure we are working with the li element and not clicking on icons
        li.classList.toggle("checked");
        const editIcon = li.querySelector(".edit");

        if (li.classList.contains("checked")) {
            editIcon.classList.remove("fa-edit");
        } else {
            editIcon.classList.add("fa-edit");
        }
    }
}, false);

const editTask = (li) => {
    let taskText = li.textContent
    input.value = taskText
    btn.textContent = "Update"
    taskBeingEdited = li
    input.focus()


}

const audioEffect = () => {
    let audio = new Audio("/Audio/wrong-47985.mp3")
    audio.play()
}
const saveData = () => {
    const listItems = listContainer.querySelectorAll('li');
    const data = [];
    listItems.forEach((item) => {
        data.push({ text: item.textContent });
    });
    localStorage.setItem('data', JSON.stringify(data));
}

const loadTasks = () => {
    const data = JSON.parse(localStorage.getItem('data')) || [];
    data.forEach(task => {
        createTask(task.text);
    });
};

const deleteData = (taskIndex) => {
    const data = JSON.parse(localStorage.getItem("data"))
    data.splice(taskIndex, 1)
    localStorage.setItem("data", JSON.stringify(data))
}

document.addEventListener("DOMContentLoaded", loadTasks())

const hasTakenTour = localStorage.getItem("hasTakenTour")

if (!hasTakenTour) {
    const driver = window.driver.js.driver;


    const driverObj = driver({
        showProgress: true,
        steps: [
            { element: '#container', popover: { title: 'About', description: 'Hello Guys! In this to-do webapp you can manage your tasks with \n(CRUD) functions', popoverClass: 'driver-popover driverjs-theme' } },

            { element: '#input-container', popover: { title: 'Task', description: 'Here you can write your task in input field and Click the \n(Add) button to add your task ', popoverClass: 'driver-popover driverjs-theme' } },

            { element: 'li', popover: { title: '', description: 'Click the Task to make it (Done) or (unDone)', popoverClass: 'driver-popover driverjs-theme' } },

            { element: '.edit', popover: { title: 'Edit Task', description: 'Click this icon to Edit your task with the updated task', popoverClass: 'driver-popover driverjs-theme' } },

            { element: '.trash', popover: { title: 'Delete Task', description: 'Click this icon to (Delete) your task ', popoverClass: 'driver-popover driverjs-theme' } },
        ]
    });
    driverObj.drive();
    localStorage.setItem("hasTakenTour", true)

}
