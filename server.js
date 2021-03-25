require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoletable = require('console.table');
// const sequelize = require('./Config/connections');
// Do we need sequelize?

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employees_db'
});

connection.connect((err) => {
    if (err) throw err;
    start();
});


const start = () => {
    inquirer
        .prompt({
            name: "toDo",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
            "View All Employees", "View All Employees By Department", 
            "View All Employees By Manager", "Add Employee", "Add Department", "Add Role", "Remove Employee", 
            "Update Employee Role", "Update Employee Manager"]
        })
        .then((answer) => {
            switch (answer.toDo) {
                case "View All Employees":
                    viewAll();
                    break;

                case "View All Employees By Department":
                    byDep();
                    break;

                case "View All Employees By Manager":
                    byMngr();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Department":
                    addDepartment();
                    break;
                
                case "Add Role":
                    addRole();
                    break;

                case "Remove Employee":
                    remEmployee();
                    break;

                case "Update Employee Role":
                    upEmployee();
                    break;

                case "Update Employee Manager":
                    upMngr();
                    break;

                default:
                    console.log(`Invalid action: ${answer.toDo}`);
                    break;
            };
        }).catch((err) => {
            if (err) throw err;
        });
};

// Need console.table for view all
const viewAll = () => {
    const query =
    'SELECT * FROM employee';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
console.log('this is view all');
start();
};

const byDep = () => {
    inquirer  
        .prompt({
            name: "department",
            type: "list",
            message: "What department are you looking for?",
            choices: ["Sales", "Engineering", "Finance", "Legal"]
        }).then((answer) => {
            
        });
    start();
};

const byMngr = () => {
    getManagers();
    start();
};

const addEmployee = () => {
    inquirer
        .prompt({
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?",
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "role",
            type: "list",
            message: "What is the employee's role?",
            choices: [
            "Sales lead", "Salesperson", "Lead Engineer", "Software Engineer", 
            "Account Manager", "Accountant", "Legal Team Lead"
        ]
        },
        {
            name: "employeeMngr",
            type: "list",
            message: "Who is the emplyee's manager?",
            // Need to get managers from employees_db for choices
            choices: []
        })
};

const addDepartment = () => {
    
};

const addRole = () => {
    inquirer
        .prompt({
            name: "role",
            type: "input",
            message: "What is the title of this role?"
        },
        {
            name: "salary",
            type: "number",
            message: "What is the salary for this role?"
        },
        {
            name: "department",
            type: "input",
            message: "What is the department for this role?"
        }).then((answers) => {
            let newRole = {
                title: answers.role,
                salary: answers.salary,
                department: answers.department
            };
            const query = 'INSTER INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            connection.query(query, [ newRole.title, newRole.salary, newRole.department ], (res, err) => {
                if (err) throw err;
                console.log("New role added!");
                console.log(res);
            });
        });
};


const getManagers = () => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT CONCAT (b.first_name, " ", b.last_name) AS Name 
        FROM employee a LEFT JOIN employee b
        ON a.manager_id = b.id
        WHERE a.manager_id IS NOT NULL;`, (err,res) => {
            if (err) reject(err);
            resolve(res);
            console.table(res);
        });
    });
};

const getEmployees = () => {

}

const remEmployee = async () => {
    let choices = await employees_db.getEmployees();
    console.log(choices);
    inquirer
        .prompt({
            name: "removeEmployee",
            type: "list",
            message: "Which employee do you want to remove?",
            choices: choices
        })
        .then((answer) => {
            const query = 'SELECT first_name, last_name FROM employees_db';
            connection.query(query, (err, res) => {
                res.forEach(({ first_name, last_name }) => {
                    console.table([{first_name, last_name}])
                });
                if (err) throw err;
            });
        });
};

const upEmployee = () => {
    inquirer
        .prompt({
            name: "updateEmployee",
            type: "list",
            message: "Which employee do you want to update?",
            // Need to get employees for choices
            choices: []
        })
    console.log('this is upEmployee');
};

const upMngr = () => {
    inquirer
    .prompt({
        name: "updateManager",
        type: "list",
        message: "Which manager do you want to update?",
        // Need to get employees for choices
        choices: []
    })
    console.log('this is upMngr');
};

