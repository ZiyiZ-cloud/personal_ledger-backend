
const jsonschema = require('jsonschema');

const express = require('express');
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Expenses = require("../models/expense");
const { createToken } = require("../helpers/tokens");

const router = express.Router();

// add new expense

router.post('/:username', ensureCorrectUser, async function(req,res,next){
    try{
        // use jsonschema to validate input 

        //once successfully validate, add new expense to current user
        const expense = await Expenses.createExpense(req.params.username,req.body)
        return res.status(201).json({expense})
        }catch(err){
        return next(err)
    }
})
 

//get all expenses for current user

router.get('/:username', ensureCorrectUser,async function(req,res,next){
    try{
        const expenses = await Expenses.getExpense(req.params.username);
        return res.json({expenses})
    }catch(err){
        return next(err)
    }
})

// get all expenses based on category
router.get('/:username/category/:category',ensureCorrectUser,async function(req,res,next){
    try{
        const expenses = await Expenses.getByCategory(req.params.username,req.params.category);
        return res.json({expenses})
    }catch(err){
        return next(err)
    }
})

// get annual expenses
router.get('/:username/year/:year',ensureCorrectUser,async function(req,res,next){
    try{
        const expenses = await Expenses.getAnnual(req.params.username,req.params.year);
        return res.json({expenses})
    }catch(err){
        return next(err)
    }
})

// get monthly expenses
router.get('/:username/year/:year/month/:month',ensureCorrectUser,async function(req,res,next){
    try{
        const expenses = await Expenses.getMonthly(req.params.username,req.params.year,req.params.month);
        return res.json({expenses})
    }catch(err){
        return next(err)
    }
})

//get daily expenses
router.get('/:username/year/:year/month/:month/day/expense',ensureCorrectUser,async function(req,res,next){
    try{
        const dailyExpense = await Expenses.getDailyExpense(req.params.username,req.params.year,req.params.month);

        return res.json({dailyExpense})
    }catch(err){
        return next(err)
    }
})

//get daily income
router.get('/:username/year/:year/month/:month/day/income',ensureCorrectUser,async function(req,res,next){
    try{
        const dailyIncome = await Expenses.getDailyIncome(req.params.username,req.params.year,req.params.month);
        return res.json({dailyIncome})
    }catch(err){
        return next(err)
    }
})

//get monthly category income
router.get('/:username/year/:year/month/:month/category/income',ensureCorrectUser,async function(req,res,next){
    try{
        const categoryIncome = await Expenses.getMonthlyCategoryIncome(req.params.username,req.params.year,req.params.month);
        return res.json({categoryIncome})
    }catch(err){
        return next(err)
    }
})

//get monthly category expense
router.get('/:username/year/:year/month/:month/category/expense',ensureCorrectUser,async function(req,res,next){
    try{
        const categoryExpense = await Expenses.getMonthlyCategoryExpense(req.params.username,req.params.year,req.params.month);
        return res.json({categoryExpense})
    }catch(err){
        return next(err)
    }
})

//get monthly total income
router.get('/:username/year/:year/month/:month/total/income',ensureCorrectUser,async function(req,res,next){
    try{
        const monthlytotalIncome = await Expenses.getMonthlyTotalIncome(req.params.username,req.params.year,req.params.month);
        return res.json({monthlytotalIncome})
    }catch(err){
        return next(err)
    }
})
//get monthly total expense
router.get('/:username/year/:year/month/:month/total/expense',ensureCorrectUser,async function(req,res,next){
    try{
        const monthlytotalExpense = await Expenses.getMonthlyTotalExpense(req.params.username,req.params.year,req.params.month);
        return res.json({monthlytotalExpense})
    }catch(err){
        return next(err)
    }
})

// get single expense
router.get('/:username/:id',ensureCorrectUser,async function(req,res,next){
    try{
        // use jsonschema to validate new data

        // once validate update data fit requirement, update and return new user information
        const expense = await Expenses.getSelectedExpense(req.params.username,req.params.id);
        return res.json({expense});
    }catch(err){
        return next(err)
    }
})

// update expense
router.patch('/:username/:id',ensureCorrectUser,async function(req,res,next){
    try{
        // use jsonschema to validate new data

        // once validate update data fit requirement, update and return new user information
        const expense = await Expenses.updateExpense(req.params.id,req.body);
        return res.json({expense});
    }catch(err){
        return next(err)
    }
})

// delete expense
router.delete('/:username/:id',ensureCorrectUser,async function(req,res,next){
    try {
        await Expenses.deleteExpense(req.params.id);
        return res.json({ deleted: req.params.id });
      } catch (err) {
        return next(err);
      }
})

module.exports = router;