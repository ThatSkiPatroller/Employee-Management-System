require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoletable = require('console.table');
// const sequelize = require('./Config/connections');
// Do we need sequelize?

// const connection = mysql.createConnection({
//     host: 'localhost',
//     port: 3306,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// connection.connect((err) => {
//     if (err) throw err;
//     start();
// });


const start = () => {
    inquirer
        .prompt({
            name: "toDo",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
            "View All Employees", "View All Employees By Department", 
            "View All Employees By Manager", "Add Employee", "Remove Employee", 
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
    // const query =
    //     'SELECT * FROM employees_db';
    //     connection.query(query, (err, res) => {
    //         res.console.table([{}])
    //     });
    console.log('this is view all');
};

const byDep = () => {
    console.log('this is byDep');
};

const byMngr = () => {
    console.log('this is byMngr');
};

const addEmployee = () => {
    console.log('this is addEmployee');
};

const remEmployee = () => {
    console.log('this is remEmployee');
};

const upEmployee = () => {
    console.log('this is upEmployee');
};

const upMngr = () => {
    console.log('this is upMngr');
};

start();