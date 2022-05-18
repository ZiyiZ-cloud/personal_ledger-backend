
const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlUpdate } = require("../helpers/sql");

class Expenses{
    
    // create new expense
    static async createExpense(username,data) {
        if(data.category==="") return (`Category Not Found`);
        const result = await db.query(
              `INSERT INTO expenses(amount,
                                    category,
                                    detail,
                                    date,
                                    username)
               VALUES ($1, $2, $3, $4, $5)
               RETURNING id, amount, category, detail, date, username`,
            [
              data.amount,
              data.category,
              data.detail,
              data.date,
              username
            ]);
        let expense = result.rows[0];
    
        return expense;
    }

    // return one user expenses
    static async getExpense(username){
        const userRes = await db.query(
            `SELECT username,
                    first_name,
                    last_name,
                    email
                FROM users
                WHERE username = $1`,
            [username]
        );
    
        const user = userRes.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);
                
        const userExpenseRes = await db.query(
            `SELECT e.id,
                    e.amount,
                    e.category,
                    e.detail,
                    e.date
                FROM expenses AS e
                WHERE e.username = $1
                ORDER BY e.date`, [username]);
                
        return userExpenseRes.rows;
    }   

    // return selected expense from user
    static async getSelectedExpense(username,id){
        const userRes = await db.query(
            `SELECT username,
                    first_name,
                    last_name,
                    email
                FROM users
                WHERE username = $1`,
            [username]
        );
    
        const user = userRes.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);
                
        const userExpenseRes = await db.query(
            `SELECT e.id,
                    e.amount,
                    e.category,
                    e.detail,
                    e.date
                FROM expenses AS e
                WHERE e.username = $1 AND e.id = $2
                ORDER BY e.date`, [username,id]);
                
        return userExpenseRes.rows;
    }   

    // get all expenses based on category
    static async getByCategory(username,category){
        const userRes = await db.query(
            `SELECT username,
                    first_name,
                    last_name,
                    email
                FROM users
                WHERE username = $1`,
            [username]
        );
    
        const user = userRes.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);
                
        const userExpenseRes = await db.query(
            `SELECT id,amount,
                    category,
                    detail,
                    date
                FROM expenses
                WHERE username = $1 AND category = $2
                ORDER BY date`, [username,category]);
                
        return userExpenseRes.rows;
    }

    // get annual expenses
    static async getAnnual(username,year){
        const userRes = await db.query(
            `SELECT username,
                    first_name,
                    last_name,
                    email
                FROM users
                WHERE username = $1`,
            [username]
        );
    
        const user = userRes.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);
                
        const userExpenseRes = await db.query(
            `SELECT id,amount,
                    category,
                    detail,
                    date
            FROM expenses
            WHERE username = $1 AND EXTRACT(year FROM date) = $2
            ORDER BY date`,[username,year]
        )

        return userExpenseRes.rows;
    }

    // get monthly expenses
    static async getMonthly(username,year,month){
        const userRes = await db.query(
            `SELECT username,
                    first_name,
                    last_name,
                    email
                FROM users
                WHERE username = $1`,
            [username]
        );
    
        const user = userRes.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);
                
        const userExpenseRes = await db.query(
            `SELECT id,amount,
                    category,
                    detail,
                    date
            FROM expenses
            WHERE username = $1 AND EXTRACT(year FROM date) = $2 AND EXTRACT(month FROM date) = $3
            ORDER BY date`,[username,year,month]
        )

        return userExpenseRes.rows;
    }

    // get monthly total income
    static async getMonthlyTotalIncome(username,year,month){
        const userRes = await db.query(
            `SELECT username,
                    first_name,
                    last_name,
                    email
                FROM users
                WHERE username = $1`,
            [username]
        );
    
        const user = userRes.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);
                
        const userExpenseRes = await db.query(
            `SELECT id,amount,
                    category,
                    detail,
                    date
            FROM expenses
            WHERE username = $1 AND EXTRACT(year FROM date) = $2 AND EXTRACT(month FROM date) = $3
            AND amount >=0
            ORDER BY date`,[username,year,month]
        )

        let result = 0;
        for(let row of userExpenseRes.rows){
            result += row.amount
        }
        return result;
    }

    // get monthly total expense
    static async getMonthlyTotalExpense(username,year,month){
        const userRes = await db.query(
            `SELECT username,
                    first_name,
                    last_name,
                    email
                FROM users
                WHERE username = $1`,
            [username]
        );
    
        const user = userRes.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);
                
        const userExpenseRes = await db.query(
            `SELECT id,amount,
                    category,
                    detail,
                    date
            FROM expenses
            WHERE username = $1 AND EXTRACT(year FROM date) = $2 AND EXTRACT(month FROM date) = $3
            AND amount <0
            ORDER BY date`,[username,year,month]
        )

        let result = 0;
        for(let row of userExpenseRes.rows){
            result -= row.amount
        }
        return result;
    }
        

    //get daily expenses
    static async getDailyExpense(username,year,month){
        const userRes = await db.query(
            `SELECT username,
                    first_name,
                    last_name,
                    email
                FROM users
                WHERE username = $1`,
            [username]
        );
    
        const user = userRes.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);

        let day = 1;
        let res = [];
        while(day<32){
            let userExpenseRes = await db.query(
                `SELECT amount
                FROM expenses
                WHERE username = $1 AND EXTRACT(year FROM date) = $2 AND EXTRACT(month FROM date) = $3 AND EXTRACT(day FROM date) = $4
                AND amount < 0
                ORDER BY date`,[username,year,month,day]
            )
            let result = 0;

            userExpenseRes.rows.map(c=>result-=c.amount)

            res[day-1]=[day,result];

            day++
        }
        return res;
    }

    //get daily income
    static async getDailyIncome(username,year,month){
        const userRes = await db.query(
            `SELECT username,
                    first_name,
                    last_name,
                    email
                FROM users
                WHERE username = $1`,
            [username]
        );
    
        const user = userRes.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);


        let date = 1;
        let res = [];
        while(date<32){
            let userExpenseRes = await db.query(
                `SELECT amount
                FROM expenses
                WHERE username = $1 AND EXTRACT(year FROM date) = $2 AND EXTRACT(month FROM date) = $3 AND EXTRACT(day FROM date) = $4
                AND amount >= 0
                ORDER BY date`,[username,year,month,date]
            )
            let result = 0;

            userExpenseRes.rows.map(c=>result+=c.amount)

            res[date-1]=[date,result];

            date++
        }
        return res;
    }

    // get monthly expense by category

    static async getMonthlyCategoryExpense(username,year,month){
        const userRes = await db.query(
            `SELECT username,
                    first_name,
                    last_name,
                    email
                FROM users
                WHERE username = $1`,
            [username]
        );
    
        const user = userRes.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);

        let Categories = ['housing','food','fun','child-expenses','insurance','healthcare','utilities','personal-care','taxes','transportation','gifts','income','givings','house-supplies','cosumer-debt','clothing','savings','pets','services-membership','services-membership','others'];
        let res = [];
        let number = 0;
        for(let category of Categories){
            let userExpenseRes = await db.query(
                `SELECT amount
                FROM expenses
                WHERE username = $1 AND EXTRACT(year FROM date) = $2 AND EXTRACT(month FROM date) = $3
                AND category = $4 AND amount < 0
                ORDER BY date`,[username,year,month,category]
            )
            let result = 0;

            userExpenseRes.rows.map(c=>result+=c.amount)

            res[number]=[category,result];

            number++;

        }
        return res;
    }

    // get monthly income by category
    static async getMonthlyCategoryIncome(username,year,month){
        const userRes = await db.query(
            `SELECT username,
                    first_name,
                    last_name,
                    email
                FROM users
                WHERE username = $1`,
            [username]
        );
    
        const user = userRes.rows[0];
    
        if (!user) throw new NotFoundError(`No user: ${username}`);

        let categories = ['housing','food','fun','child-expenses','insurance','healthcare','utilities','personal-care','taxes','transportation','gifts','income','givings','house-supplies','cosumer-debt','clothing','savings','pets','services-membership','services-membership','others'];
        let res = [];
        let count = 0;
        for(let category of categories){
            let userExpenseRes = await db.query(
                `SELECT amount
                FROM expenses
                WHERE username = $1 AND EXTRACT(year FROM date) = $2 AND EXTRACT(month FROM date) = $3
                AND category = $4 AND amount >= 0
                ORDER BY date`,[username,year,month,category]
            )
            let result = 0;

            userExpenseRes.rows.map(c=>result+=c.amount)

            res[count]=[category,result];

            count++;

        }
        return res;
    }

    // update expense
    static async updateExpense(id,data){
        // set up variables for sql update
        const{setColumns, values} = sqlUpdate(
            data,
            {
                amount: 'amount',
                category:'category',
                detail:'detail',
                date:'date'
            }
        );
        // set up username value index to look for correct user
        const expenseIdVarIdx = "$" + (values.length+1);
        
        // set up sql command
        const querySql = `UPDATE expenses 
                      SET ${setColumns} 
                      WHERE id = ${expenseIdVarIdx} 
                      RETURNING amount,
                                category,
                                detail,
                                date`;
        const result = await db.query(querySql, [...values, id]);
        const expense = result.rows[0];

        if (!expense) throw new NotFoundError(`No expense: ${id}`);

        return expense;
    }

    // delete expense

    static async deleteExpense(id) {
        const result = await db.query(
              `DELETE
               FROM expenses
               WHERE id = $1
               RETURNING id`, [id]);
        const expense = result.rows[0];
    
        if (!expense) throw new NotFoundError(`No expense: ${id}`);
    }

}

module.exports = Expenses;