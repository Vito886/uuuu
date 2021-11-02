let res = 0;
count = 0;

function calculateAverage(){
    count = 0;
    res = 0;
    document.querySelectorAll(".task1 .table input").forEach((item) => {
        count++;
        if(item.checked){
            res += Number(item.value);
        }
    })
    document.querySelector("#resSpan").innerHTML = "Cредний балл: " + res / (count  / 3);
}

function updateListeners(){
    document.querySelectorAll(".task1 .table input").forEach((elem) => {
        elem.addEventListener('change', calculateAverage);
    })
}



function getXMLDocument(url)  
{  
    let xml;  
    if(window.XMLHttpRequest)  
    {  
        xml=new window.XMLHttpRequest();  
        xml.open("GET", url, false);  
        xml.send("");  
        return xml.responseXML;  
    }  
    else  
        if(window.ActiveXObject)  
        {  
            xml=new ActiveXObject("Microsoft.XMLDOM");  
            xml.async=false;  
            xml.load(url);  
            return xml;  
        }  
        else  
        {  
            alert("Загрузка XML не поддерживается браузером");  
            return null;  
        }  
} 

let facultetInput = document.querySelector('#XMLfacultet');
let courceInput = document.querySelector('#XMLcource');
let groupSelect = document.querySelector('#XMLgroup');
let nameSelect = document.querySelector('#XMLname');
let xml = getXMLDocument("students.xml");
let groups = xml.getElementsByTagName('group');
let table = document.querySelector('.task1 .table');

function fillGroups(){
    
    for(let i = 0; i < groups.length; i++){
        let option = document.createElement('option');
        let group = groups[i].getElementsByTagName('name')[0].innerHTML;
        option.innerHTML = group;
        option.value = group;
        groupSelect.append(option);
    }
}

function fillNames(group){
    while(nameSelect.firstChild){
        nameSelect.firstChild.remove();
    }
    for(let i = 0; i < groups.length; i++){
        if(groups[i].getElementsByTagName('name')[0].innerHTML == group){
            let students = groups[i].getElementsByTagName('student');
            for(let j = 0; j < students.length; j++){
                let option = document.createElement('option');
                let name = students[j].getElementsByTagName('name')[0].innerHTML;
                option.innerHTML = name;
                option.value = name;
                nameSelect.append(option);
            }
            break;
        }
    }
} 

function setFacultet(group){
    for(let i = 0; i < groups.length; i++){
        if(groups[i].getElementsByTagName('name')[0].innerHTML == group){
            facultetInput.value = groups[i].getElementsByTagName('facultet')[0].innerHTML;
            break;
        }
    }
}

function setCource(group){
    for(let i = 0; i < groups.length; i++){
        if(groups[i].getElementsByTagName('name')[0].innerHTML == group){
            courceInput.value = groups[i].getElementsByTagName('cource')[0].innerHTML;
            break;
        }
    }
}

function fillSubjects(group){
    table.querySelectorAll('.row:not(.header)').forEach(elem => {
        elem.remove();
    });
    for(let i = 0; i < groups.length; i++){
        if(groups[i].getElementsByTagName('name')[0].innerHTML == group){
            let subjects = groups[i].getElementsByTagName('subject');
            for(let i = 0; i < subjects.length; i++){
                let row = document.createElement('div');
                row.classList.add('row');
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.innerHTML = subjects[i].getElementsByTagName('name')[0].innerHTML;
                row.append(cell);

                for(let j = 0; j < 3; j++){
                    let radio = document.createElement('div');
                    radio.classList.add('cell');

                    let input = document.createElement('input');
                    input.setAttribute('type', 'radio');
                    input.value = j;
                    input.setAttribute('name', cell.innerHTML);
                    radio.append(input);
                    row.append(radio);
                }


                table.append(row);
            }
            break;
        }
    }
    updateListeners();
}

function fillMarks(group, name){
    for(let i = 0; i < groups.length; i++){
        if(groups[i].getElementsByTagName('name')[0].innerHTML == group){

            let students = groups[i].getElementsByTagName('student');

            for(let j = 0; j < students.length; j++){
                if(students[j].firstElementChild.innerHTML == name){
                    let marks = students[j].getElementsByTagName('mark');
                    let cells = table.querySelectorAll('.row:not(.header)');
                    for(let z = 0; z < marks.length; z++){
                        cells[z].querySelectorAll('input')[Number(marks[z].innerHTML)].checked = true;
                        calculateAverage();
                    }

                    break;
                }
            }
        }
    }
}

fillGroups();
groupSelect.addEventListener('change', (event) => {
    fillNames(groupSelect.value);
    setFacultet(groupSelect.value);
    setCource(groupSelect.value);
    fillSubjects(groupSelect.value);
    fillMarks(groupSelect.value, nameSelect.value);
})

nameSelect.addEventListener('change', (event) => {
    fillMarks(groupSelect.value, nameSelect.value);
})
