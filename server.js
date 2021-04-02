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
    password: 'Tdragon9!',
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
            "View All Employees", "View All Departments", 
            "View All Managers", "Add Employee", "Add Department", "Add Role", "Remove Employee", 
            "Update Employee Role", "Update Employee Manager"]
        })
        .then((answer) => {
            switch (answer.toDo) {
                case "View All Employees":
                    viewAll("employee");
                    break;

                case "View All Departments":
                    byDep();
                    break;

                case "View All Managers":
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

                // case "Remove Employee":
                //     remEmployee();
                //     break;

                case "Update Employee Role":
                    upEmployee();
                    break;

                // case "Update Employee Manager":
                //     upMngr();
                //     break;

                default:
                    console.log(`Invalid action: ${answer.toDo}`);
                    break;
            };
        }).catch((err) => {
            if (err) throw err;
        });
};

// Need console.table for view all


const viewAll = (tableName) => {
    const query =
    `SELECT * FROM ${tableName}`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    });
start();
};

const byDep = () => {
    console.log("this is byDep");
    viewAll('department');
    start();
};

const byMngr = () => {
    getManagers();
    start();
};

const addEmployee = () => {
    // Need to get roles from employee_db.role and managers
    const query = 'SELECT '
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
            roleChoices () {
                const choiceArray = [];
                 
            }
        },
        {
            name: "employeeMngr",
            type: "list",
            message: "Who is the emplyee's manager?",
            
            mngrChoices () {

            }
        })
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "What is the name of the department you would like to add?"
            }
        ]).then((answer) => {
            const query = 'INSERT INTO department (name) VALUES (?)';
            connection.query(query, [answer.department], (res, err) => {
                console.log("New department added!");
            });
            start();
        });
};

const addRole = () => {
    // Need to select for id
    const queryOne = 'SELECT id, name FROM employees_db.department';
    connection.query(queryOne, (err, res) => {
        if (err) throw err;
    
    inquirer
        .prompt([
            {
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
                type: "rawlist",
                message: "What is the department for this role?",
                choices () {
                    const choiceArray = [];
                    res.forEach(({ id, name }) => {
                        choiceArray.push(id + " " + name);
                    });
                    return choiceArray;
                }
        }]).then((answers) => {
            let newRole = {
                title: answers.role,
                salary: answers.salary,
                department: answers.department[0]
            };
            const queryTwo = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            connection.query(queryTwo, [ newRole.title, newRole.salary, newRole.department ], (res, err) => {
                
                console.log("New role added!");
                
            });
            start();
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

const remEmployee = async  () => {
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
    connection.query(`SELECT e.first_name, e.last_name, e.id AS employee_id, r.title, r.id AS role_id, d.name
    FROM employee e
    LEFT JOIN employee em ON e.manager_id = em.id
    INNER JOIN role r ON e.role_id = r.id
    INNER JOIN department d ON r.department_id = d.id
    ORDER BY r.id`, function (err,res) {
        if (err) throw err;
        console.table(res);

    inquirer
        .prompt([{
            name: "updateEmployee",
            type: "list",
            // Need to get employees for choices
            choices: function () {
                var employees = [];
                for (var i = 0; i<res.length; i++) {
                    employees.push(res[i].last_name);
                }
                return employees;
            },
           message: "Which employee's role do you want to update?",
        },
        {
            name: "updateRole",
            type: "list",
            choices: function () {
                var employeeRoles = [];
                for (var i=0; i < res.length; i++) {
                    employeeRoles.push(res[i].role_id);
                }
                var duplicates = new Set(employeeRoles)
                var newArr = [...duplicates];
                return newArr;
            },
            message: "What role do you want to change it to?",
        }]).then(function (answer) {
            connection.query(`UPDATE employee SET ?
            WHERE last_name = "${answer.updateEmployee}"`, { role_id: answer.updateRole }, function (res, err) {
                
                console.log("New employee role has been updated!")
                start();
            })
        })
})
};

const upMngr = () => {
    
    // inquirer
    // .prompt({
    //     name: "updateManager",
    //     type: "list",
    //     message: "Which manager do you want to update?",
    //     // Need to get employees for choices
    //     choices: []
    // })
    console.log('this is upMngr');
};

