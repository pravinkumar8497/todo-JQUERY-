var listOfTask = [];
var id = 1;
var subTaskId = 1;
var stepId = 1;
var task = getById("task");
var taskId = getById("taskId");
var subTaskIdCommon = getById("sub-task-id");
var steps = getById("add-steps");
var step = getById("steps");
init();

/**
 * object with constructor to take have an subtask
 * @param {number} id subtask id to iterate it 
 * @param {string} name subtask name
 * @param {boolean} status active status for that subtask
 * @param {array} steps array of steps inside a subtask
 */
function SubTask(id, name, status, steps) { 
    this.id = id;
    this.name = name; 
    this.status = status;
    this.steps = steps;
}

/**
 * Object with constructor to take a task
 * @param {number} id id to get task by unique
 * @param {string} name name to get a task name
 * @param {array} subTaskList array of subtask
 */
function Task(id, name, subTaskList) { 
    this.id = id; 
    this.name = name; 
    this.subTaskList = subTaskList;
}

/**
 * Object to add step inside a subtask
 * @param {number} id 
 * @param {string} name 
 * @param {boolean} status 
 */
function Step(id, name, status) {
    this.id = id;
    this.name = name;
    this.status = status;
}
/**
 * Opening an toggle to add a task
 * @param {number} tabName id of an element to which the function should take care
 */
function openTab(tabName) {
    getById(tabName).addClass("toggle-open");
}

/**
 * Toggle an nav by adjusting it's width according to need
 * @param {number} tabName id of an element to toggle a nav bar
 */
function toggle(tabName) {
    getById(tabName).toggleClass("toggle-open");
}
function init() {
    getById("taskName").on("keypress", addTaskName);
    getById("subTask").on("keypress", addSubTaskName);
    getById("add-steps").on("keypress", addStepsName);
    getById("task-name").on("keypress", updateTaskName);
    getById("sub-task-name").on("keypress", updateSubTaskName);
}

function getById(id) {
    return $("#" + id);
}

/**
 * To add a task name after filling a value in 
 *     text box by checking the element through it's event
 */
function addTaskName(event) {
    if((event.keyCode) === 13 ) {
        var taskValue = getById("taskName").val();
        var subTask = [];
        if(taskValue) {
          addTask(taskValue, id);
          listOfTask.push(
            new Task(id, taskValue, subTask) 
          )
          getTask(id);
          id++;
          getById("taskName").val("");
        }
    }
}

/**
 * To add a subtask name after filling a value in 
 *     text box by checking the element through it's event
 */
function addSubTaskName(action) {
    if((action.keyCode) === 13) {
        var subTaskValue = getById("subTask").val();
        var status = true;
        var step = [];
        if(subTaskValue) {
            listOfTask[getTaskIndex(taskId.text())].subTaskList.push(
                new SubTask(subTaskId, subTaskValue, status, step)
            )
            listSubTask(subTaskValue, subTaskId, status);
            getById("subTask").val("");
            subTaskId++;
        }
    }
}

/**
 * To add a steps name inside a subtask by getting a value after filling a value in 
 *     text box by checking the element through it's event
 */
function addStepsName(action) {
    if((action.keyCode) === 13) {
        var stepsInput = getById("add-steps").val();
        var taskIndex = getTaskIndex(taskId.text());
        var subTaskIndex = getSubTaskIndex(subTaskIdCommon.text(), taskIndex);
        var status = true;
        if(stepsInput) {
            listOfTask[taskIndex].subTaskList[subTaskIndex].steps.push (
                new Step(stepId, stepsInput, status)
            )
            listSteps(stepId, stepsInput);
            getById("add-steps").val("");
            stepId++;
        }
    }
}

/**
 * To update a task name after filling a value in 
 *     text box by checking the element through it's event
 */
function updateTaskName(action) {
    var tasks = getById("taskList");
    if((action.keyCode) === 13) {
       listOfTask[getTaskIndex(taskId.text())].name = getById("task-name").val();
    }
    tasks.empty();
    for(var taskIndex = 0; taskIndex < listOfTask.length; taskIndex++) {
        addTask(listOfTask[taskIndex].name, listOfTask[taskIndex].id);
    }
}

/**
 * To update a subtask name inside a task after filling a value in 
 *     text box by checking the element through it's event
 */
function updateSubTaskName(action) {
    if((action.keyCode) === 13) {
       var subTasks = getById("subTasks");
       var taskIndex = getTaskIndex(taskId.text());
       var subTaskIndex = getSubTaskIndex(subTaskIdCommon.text(), taskIndex)
       listOfTask[taskIndex].subTaskList[subTaskIndex].name = getById("sub-task-name").val();
       subTasks.empty();
       getTask(taskId.text());
       getById("step-content").removeClass().addClass("step-content step-content-open");
       getById("task-content").removeClass().addClass("task-content task-content-min");
    }
}

/**
 * method to add an element in a html after a new task is added
 * @param {string} taskValue the value of the task that which have to be added
 * @param {number} id Unique id for an element to make it's functionality unique
 */
function addTask(taskValue, id) {
    var div = $(document.createElement("div"));
    div.addClass("taskname");
    div.attr("id", id);
    div.attr("onclick", `getTask(${id})`);
    var i = $(document.createElement("i"));
    i.attr("class", "ms-Icon ms-Icon--BulletedList2 iconSize-24");
    div.append(i);
    var p = $(document.createElement("p"));
    p.attr("id", id);
    p.text(taskValue);
    div.append(p);
    getById("taskList").append(div);
}

/**
 * method to add an element in a html after a new subtask is added inside a task
 * @param {string} subTaskValue the value of subtask that which have to be added
 * @param {number} id Unique id for an element to make it's fuctionality after clicking it
 */
function listSubTask(subTaskValue, id, status) {
    var subTaskId = getById("sub-task-id").text();
    var taskIndex = getTaskIndex(taskId.text());
    var subTaskIndex = getSubTaskIndex(id, taskIndex)


    var div = $(document.createElement("div"));
    div.attr("class", "subtask-listing");
    var input = $(document.createElement("input"));
    input.attr("type", "checkbox");
    input.attr("id", "checkbox-id");
    input.attr("class", "subtask-checkbox");
    input.attr("name", "subtask-checkbox");
    input.attr("onclick", `changeStatus(${id})`);
    var checkboxInput = $(document.createElement("span"));
    var inputLabel = $(document.createElement("label"));
    inputLabel.attr("htmlFor", "checkbox-id");
    var img = $(document.createElement("img"));
    img.attr("name", "image-id");
    img.attr("id", id);
    img.attr("src", "images/circle-unchecked.svg");
    img.attr("onclick", `changeStatus(${id})`);
    inputLabel.append(img);
    checkboxInput.append(input);
    checkboxInput.append(inputLabel);
    div.append(checkboxInput);
    var valueElement = $(document.createElement("div"));
    valueElement.attr("id", id);
    valueElement.attr("class", "sub-task-list");
    valueElement.attr("name", "subtask-name");
    valueElement.attr("onclick", `getStep(${id})`);
    valueElement.text(subTaskValue);
    var idElement = $(document.createElement("span"));
    idElement.attr("id", "subtask-id");
    idElement.text(subTaskId);
    valueElement.append(idElement);
    div.append(valueElement);
    getById("subTasks").append(div);
}

/**
 * Listing a subtask accordingly for a subtask
 * @param {string} steps step array to which have to be added inside a subtask
 */
function listSteps(id, steps) {

    var stepElement = $(document.createElement("span"));
    var checkbox = $(document.createElement("img"));
    var stepValueElement = $(document.createElement("p"));
    stepElement.attr("class", "step-list");
    checkbox.attr("src", "images/step-unchecked.svg");
    checkbox.attr("name", "step-checkbox");
    checkbox.attr("id", id);
    checkbox.attr("onclick", `stepDone(${id})`);
    stepValueElement.attr("id", id);
    stepValueElement.attr("name", "step-value");
    stepValueElement.text(steps);
    stepElement.append(checkbox);
    stepElement.append(stepValueElement);
    step.append(stepElement);
}

/**
 * To toggle a steps and load a steps according to it's id related steps
 * @param {number} id id of subtask to get all the steps to that particular subtask
 */
function getStep(id) {
    getById("step-content").removeClass().addClass("step-content step-content-open");
    getById("task-content").removeClass().addClass("task-content task-content-min");
    var taskIndex = getTaskIndex(taskId.text());
    var subTaskIndex = getSubTaskIndex(id, taskIndex);
    var task = listOfTask[getTaskIndex(taskId.text())];
    for(var subTask = 0; subTask < task.subTaskList.length; subTask++) {
        if(task.subTaskList[subTask].id == id) {
            getById("sub-task-name").val("");
            getById("sub-task-name").val(task.subTaskList[subTask].name);
            getById("sub-task-name").removeClass().addClass((task.subTaskList[subTask].status) ? "text-normal step-input-box" : "line-through step-input-box");
            getById("subtask-id-steps").attr("src", ((task.subTaskList[subTask].status) ? "images/circle-unchecked.svg" : "images/circle-checked.svg"));
        }
    }
    getById("sub-task-id").text(id);
    step.empty();
    for(var stepsIndex = 0; stepsIndex < listOfTask[taskIndex].subTaskList[subTaskIndex].steps.length; stepsIndex++) {
        listSteps(listOfTask[taskIndex].subTaskList[subTaskIndex].steps[stepsIndex].id, 
           listOfTask[taskIndex].subTaskList[subTaskIndex].steps[stepsIndex].name);
        var stepStatus = listOfTask[taskIndex].subTaskList[subTaskIndex].steps[stepsIndex].status
        $("[name=step-checkbox]")[stepsIndex].src = (stepStatus) ? "images/step-unchecked.svg" : "images/step-checked.svg";
        $("[name=step-value]")[stepsIndex].className = (stepStatus) ? "line-through" : "text-normal";
    }
}

/**
 * To load a sub task accordingly for the task
 * @param {number} id id of the task to get it's subtask
 */
function getTask(id) {
    var subTaskName;
    var subTasks = getById("subTasks");
    subTasks.empty();
    getById("step-content").removeClass().addClass("step-content step-content-close");
    getById("task-content").removeClass().addClass("task-content task-content-full");
    getIndexForId(id);
    subTaskName = listOfTask[getTaskIndex(id)].name;    
    getById("task-name").val(subTaskName);
    task.text("");
    getById("subTask").focus();
    taskId.text(id);
}

/**
 * To load a sub task if id of the task is given as param
 * @param {number} id id of the task for which subtask has to be loaded
 */
function getIndexForId(id) {
    for(var listIndex = 0; listIndex < listOfTask.length; listIndex++){
        if(listOfTask[listIndex].id == id) {
            var subTaskArray = listOfTask[listIndex].subTaskList;
            for(var subTask = 0; subTask < subTaskArray.length; subTask++) {
                listSubTask(subTaskArray[subTask].name, subTaskArray[subTask].id, subTaskArray[subTask].status);
                $("[name=image-id]")[subTask].src = (subTaskArray[subTask].status) ? "images/circle-unchecked.svg" : "images/circle-checked.svg";
                $("[name=subtask-name]")[subTask].className = (subTaskArray[subTask].status) ? "text-normal sub-task-list" : "line-through sub-task-list";
                $("[name=subtask-checkbox]")[subTask].checked = (subTaskArray[subTask].status) ? false : true;
            }
        }
    }
}

/**
 * To get an index of task for that particular id
 * @param {number} id id for which the task index is required from common method
 */
function getTaskIndex(id) {
    for(var listIndex = 0; listIndex < listOfTask.length; listIndex++){
        if(listOfTask[listIndex].id == id) {
            return listIndex;
        }
    }
}

/**
 * To get a sub task index for that id 
 * @param {number} id id for which the sub task index is required from common method
 * @param {number} taskIndex task index for which subtask index has to be identified
 */
function getSubTaskIndex(id, taskIndex) {
    for(var subTaskIndex = 0; subTaskIndex < listOfTask[taskIndex].subTaskList.length; subTaskIndex++){
        if(listOfTask[taskIndex].subTaskList[subTaskIndex].id == id){
            return subTaskIndex;
        }
    }
}

function getStepIndex(stepId, taskIndex, subTaskIndex) {
    for(var stepIndex = 0; stepIndex < listOfTask[taskIndex].subTaskList[subTaskIndex].steps.length; stepIndex++) {
        var step = listOfTask[taskIndex].subTaskList[subTaskIndex].steps[stepIndex];
        if(step.id == stepId) {
            return stepIndex;
        }
    }
}
/**
 * To change the status for that id given as param
 * @param {number} id To change the status of that id
 */
function changeStatus(id) { 
    var taskIndex = getTaskIndex(taskId.text());
    var subTaskIndex = getSubTaskIndex(id, taskIndex);
    var subTaskStatus = listOfTask[taskIndex].subTaskList[subTaskIndex].status;
    listOfTask[taskIndex].subTaskList[subTaskIndex].status = !(subTaskStatus);
    var changedStatus = listOfTask[taskIndex].subTaskList[subTaskIndex].status;
    $("[name=image-id]")[subTaskIndex].src = (changedStatus) ? "images/circle-unchecked.svg" : "images/circle-checked.svg";
    $("[name=subtask-name]")[subTaskIndex].className = (changedStatus) ? "text-normal sub-task-list" : "line-through sub-task-list";
    getStep(id);
}

/**
 * To change the status for the element which is available in step 
 */
function changeSubtaskStatus() { 
    var id = subTaskIdCommon.text();
    var taskIndex = getTaskIndex(taskId.text());
    var subTaskIndex = getSubTaskIndex(id, taskIndex);
    var subTaskStatus = listOfTask[taskIndex].subTaskList[subTaskIndex].status;
    listOfTask[taskIndex].subTaskList[subTaskIndex].status = !(subTaskStatus);
    $("[name=image-id]")[subTaskIndex].src = (subTaskStatus) ? "images/circle-checked.svg" : "images/circle-unchecked.svg";
    $("[name=subtask-name]")[subTaskIndex].className = (subTaskStatus) ? "line-through sub-task-list" : "text-normal sub-task-list";
    getStep(id);
}

/**
 * To toggle close a step area wheb  close step is triggered
 */
function closeStep() {
    getById("step-content").removeClass().addClass("step-content step-content-close");
    getById("task-content").removeClass().addClass("task-content task-content-full");
}

/**
 * To get a confirmation of delete from an user
 */
function confirmDelete() {
    getById("delete-block").removeClass().addClass("delete-block disp-block");
    getById("whole-body").removeClass().addClass("whole-body disp-block");
}

/**
 * To cancel a delete
 */
function cancelDelete() {
    getById("delete-block").removeClass().addClass("delete-block disp-none");
    getById("whole-body").removeClass().addClass("whole-body disp-none");
}

/**
 * To delete a sub task
 */
function deleteSubTask() {
    var taskIndex = getTaskIndex(taskId.text());
    var subTaskIndex = getSubTaskIndex(subTaskIdCommon.text(), taskIndex);
    listOfTask[taskIndex].subTaskList.splice(subTaskIndex, 1);
    getById("delete-block").removeClass().addClass("delete-block disp-none");
    getTask(taskId.text());
    getById("step-content").removeClass().addClass("step-content step-content-close");
    getById("task-content").removeClass().addClass("task-content task-content-full");
    getById("whole-body").removeClass().addClass("whole-body disp-none");
}

/**
 * To change the status of step
 * @param {number} stepId Step id to which status has to be changed
 */
function stepDone(stepId) {    
    var subtaskId = subTaskIdCommon.text();
    var taskIndex = getTaskIndex(taskId.text());
    var subTaskIndex = getSubTaskIndex(subtaskId, taskIndex);
    var stepIndex = getStepIndex(stepId, taskIndex, subTaskIndex);
    var stepStatus = listOfTask[taskIndex].subTaskList[subTaskIndex].steps[stepIndex].status;
    listOfTask[taskIndex].subTaskList[subTaskIndex].steps[stepIndex].status = (stepStatus) ? false : true;
    $("[name=step-checkbox]")[stepIndex].src = (stepStatus) ? "images/step-checked.svg" : "images/step-unchecked.svg";
    $("[name=step-value]")[stepIndex].className = (stepStatus) ? "line-through" : "text-normal";

}

