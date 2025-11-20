const express = require('express');
const Expance = require('../models/expance');
const authMiddler = require('../middleware/authMiddleware');


const router = express.Router();

router.use(express.json());
router.use(authMiddler);


router.post('/', async (req, res) => {
    try{

        const {title, amount, category, date} = req.body;

        if(!title || !amount || !category || !date){
            return res.status(400).json({ msg:'All fields are required'});
        }

        const newExpance = await Expance.create({
            title,
            amount,
            category,
            date,
            userId: req.user.userId
        });
        return res.status(201).json({ msg: 'Expance added succesfully', expense: newExpance})

    }catch(error){
        console.error('Error adding expense:', error);
        res.status(500).json({ msg: 'Server error' });
    }
})

router.get('/', async (req, res)=> {
    try{
        const expanses = await Expance.find({ userId: req.user.userId });
        res.status(200).json(expanses)
    }catch(error){
        console.error('Error fetching expenses:', error);
        res.status(500).json({ msg: 'Server error' }); 
    }   
})


router.delete('/:id' , async (req, res) => {
    try{
        const { id } = req.params;

        // Verify the expense belongs to the user
        const expense = await Expance.findOne({ _id: id, userId: req.user.userId });
        if(!expense){
            return res.status(404).json({ msg: 'Expense not found'});
        }

        const deleteExpance = await Expance.findByIdAndDelete(id);
        
        if(!deleteExpance){
            return res.status(404).json({ msg: 'Expense not found'});
        }
        res.status(200).json({msg:'Expense deleted successfully'})
    }catch(error){
        console.error('Error deleting expense:', error);
        res.status(500).json({ msg: 'Server error' });
    }   
})



router.put('/:id', async (req, res)=> {
    try{
        const { id } = req.params;
        const {title , amount, category, date} = req.body;


        if(!title || !amount || !category || !date){
            return res.status(400).json({ msg:'All fields are required'})
        }

        // Verify the expense belongs to the user
        const existingExpense = await Expance.findOne({ _id: id, userId: req.user.userId });
        if(!existingExpense){
            return res.status(404).json({ msg: 'Expense not found'})
        }

        const updateExpance = await Expance.findByIdAndUpdate(
            id,
            {title, amount, category, date},
            {new:true, runValidators: true}     
        );

        if(!updateExpance){
            return res.status(404).json({ msg: 'Expense not found'})
        }
        res.status(200).json({
            msg: 'Expense updated successfully',
            expense: updateExpance,
        });
    }catch(error){
        console.error('Error updating expense:', error);
        res.status(500).json({ msg: 'Server error' });
    }
})


router.get('/filter', async (req, res) => {
    try {
        const {
            category,
            from,
            to,
            highest,
            hightest,
            latest,
            page = 1,
            limit = 10,
        } = req.query;

        const query = { userId: req.user.userId };

        if (category) {
            query.category = category;
        }

        if (from && to) {
            query.date = { $gte: new Date(from), $lte: new Date(to) };
        }

        const sortOption = {};

        if (highest || hightest) {
            sortOption.amount = -1;
        }

        if (latest) {
            sortOption.date = -1;
        }

        const numericPage = Math.max(parseInt(page, 10) || 1, 1);
        const numericLimit = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (numericPage - 1) * numericLimit;

        const [expenses, totalItems] = await Promise.all([
            Expance.find(query).sort(sortOption).skip(skip).limit(numericLimit),
            Expance.countDocuments(query),
        ]);

        res.status(200).json({
            currentPage: numericPage,
            totalItems,
            totalPages: Math.ceil(totalItems / numericLimit),
            expenses,
        });
    } catch (error) {
        console.error('Error filtering expenses:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});






module.exports = router;