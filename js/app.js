const container = document.querySelector('.grid-container');
const modal = document.querySelector('.modal');
const alphabetRow = document.querySelector('.alphabetrow');
const usersUrl = 'https://randomuser.me/api/?results=12&inc=name,location,email,dob,cell,picture&?nat=us,gb';
let employees = [];
const alphabet = ["All","A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];




// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(error => console.log('Looks loke there was a problem', error))
}

fetchData(usersUrl)
    .then(data => data.results)
    .then(data => {
        data.forEach(element => {
            employees.push(element);
            genereteHTML(employees);
        })
    });


// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------


function checkStatus(response) {
    if(response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

// ------------------------------------------
//  HTML BUILDER FUNCTIONS
// ------------------------------------------

function genereteHTML(employees) {

    // Creating employee cards

    let html = '';

    employees.forEach((employee, index) => {

        let firstName = employee.name.first;
        let lastNamme = employee.name.last;
        let email = employee.email;
        let location = employee.location.city;
        let picture = employee.picture.large;


        html += `<div class='card' data-index="${index}">
                <img src='${picture}' alt=''>
                <ul>
                    <li class='employeeName'>${firstName} ${lastNamme}</li>
                    <li>${email}</li>
                    <li>${location}</li>
                </ul>
            </div>`;
    })


    container.innerHTML = html;

    //Create a modal window

    const employeeCard = document.querySelectorAll('.card');
    employeeCard.forEach((card, index) => {
        card.addEventListener('click', () => {
            genereteModalWindow(employees[index]);
        });
    });

;}

//--------------------------------------

function genereteModalWindow (employee) {

    genereteModalHTML(employee);

    modal.style.display = "block";

}

//--------------------------------------

function genereteModalHTML(employee) {
    let picture = employee.picture.large;
    let firstName = employee.name.first;
    let lastNamme = employee.name.last;
    let email = employee.email;
    let streetNumber = employee.location.street.number;
    let streetName = employee.location.street.name;
    let locationCity = employee.location.city;
    let postcode = employee.location.postcode;
    let dob = employee.dob.date.slice(0, 10);

    let modalHTML = '';
    modalHTML +=`
    
        <div class="modal-content">
            <span class="close">&times;</span>
            <span class="previous">&#60;</span>
            <span class="next">&#62;</span>
            <div class='modal_card'>
            <img src='${picture}' alt=''>
            <ul>
                <li class='employeeName'>${firstName} ${lastNamme}</li>
                <li>${email}</li>
                <li>${locationCity}</li>
            </ul>
            <hr>
            <ul>
                <li>${employee.cell}</li>
                <li>${streetNumber} ${streetName} ${locationCity} ${postcode}</li>
                <li>Birthday: ${dob}</li>
            </ul>
            </div>
        </div>`;

    modal.innerHTML += modalHTML;

    // Next and previous employee
    
    const previous = document.querySelector('.previous');
    const next = document.querySelector('.next');
    let i = employees.indexOf(employee);

    previous.addEventListener('click', () => {
        if( i===0 ) {
            modal.innerHTML ='';
            genereteModalHTML(employees[0]);
        } else {
            i--;
            modal.innerHTML ='';
            genereteModalHTML(employees[i]);
        }
    });

    next.addEventListener('click', () => {

        if( i + 1 === employees.length){
            modal.innerHTML ='';
            genereteModalHTML(employees[0]);
        } else {
            i++;
            modal.innerHTML ='';
            genereteModalHTML(employees[i]);
        }
    });

    // Close modal window

    const close = document.querySelector('.close');


    close.addEventListener('click', () => {
        modal.style.display = "none";
        modal.innerHTML ='';
    });
}

// ------------------------------------------
//  Generete alphaber HTML
// ------------------------------------------

    alphabet.forEach(letter => {
        alphabetRow.innerHTML += `<button class='letter' value="${letter}">${letter}</button>`
    });

// ------------------------------------------
//  Filter function
// ------------------------------------------

function filter () {
    alphabetRow.addEventListener('click', (e) => {
        let clickButton = e.target.value;
        if(e.target.value === 'All') {
            container.innerHTML = '';
            genereteHTML(employees);
        } else {
            let filteredEmployees = employees.filter(employee => employee.name.first.charAt(0) === clickButton);
            container.innerHTML = '';
            genereteHTML(filteredEmployees);
        }
    })
}

filter();
