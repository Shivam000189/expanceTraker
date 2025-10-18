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

        const deleteExpance = await Expance.findByIdAndDelete(id);
        
        if(!deleteExpance){
            return res.status(404).json({ msg: 'Expance Not found'});
        }
        res.status(200).json({msg:'Expance delete succsesfully'})
    }catch(error){
        console.error('Error fetching expenses:', error);
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

        const updateExpance = await Expance.findByIdAndUpdate(
            id,
            {title, amount, category, date},
            {new:true}     
        );

        if(!updateExpance){
            return res.status(404).json({ msg: 'Expance Not Found'})
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


router.get('/filter', async (req, res)=> {

    try{
        const {category, from , to} = req.query;
        const query = {userId: req.user.userId};

        if(category){
           query.category = category; 
        }
        if(from && to){
            query.date = {$gte: new Date(from), $lte: new Date(to)};
        }

        const expance = await Expance.find(query);
        res.status(200).json(expance)
    }catch(error){
        console.error('Error filtering expenses:', error);
        res.status(500).json({ msg: 'Server error' });
    }

})



router.get('/filter', async (req , res)=>{
    try{
        const { hightest , latest } = req.query;
        const query = {userId: req.user.userId}

        let sortOption = {};

        if(hightest){
            sortOption.amount = -1;
        }

        if(latest){
            sortOption.date = -1;
        }

        const expance = await Expance.find(query).sort(sortOption);
        res.status(200).json(expance);
    }catch(error){
        console.error('Error filtering expenses:', error);
        res.status(500).json({ msg: 'Server error' });
    }
})



router.get('/filter', async (req, res)=> {
    try{
        const {category, from, to , hightest, latest} = req.query;
        const query = {userId: req.user.userId};


        if(category){
            query.category = category;
        }
        if(from && to){
            query.date = {$gte: new Date(from), $lte: new Date(to)};
        }

        let sortOption = {};


        if(hightest){
            sortOption.amount = -1;
        }
        if(latest){
            sortOption.date = -1;
        }


        const expances = await Expance.find(query).sort(sortOption);

        res.status(200).json(expances);
    }catch(error){
        console.error('Error filtering expenses:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});



router.get('/filter', async (req, res) => {
  try {
    const { category, from, to, highest, latest, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.userId };

    if (category) query.category = category;
    if (from && to) query.date = { $gte: new Date(from), $lte: new Date(to) };

    let sortOption = {};
    if (highest) sortOption.amount = -1;
    else if (latest) sortOption.date = -1;

    const skip = (page - 1) * limit;

    const expenses = await Expance.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      currentPage: page,
      totalItems: expenses.length,
      expenses,
    });
  } catch (error) {
    console.error('Error filtering expenses:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});






module.exports = router;