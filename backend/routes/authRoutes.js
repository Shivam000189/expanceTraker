const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/auth');
const jwt = require('jsonwebtoken');
const authMiddler = require('../middleware/authMiddleware');

const SECRET_KEY = process.env.SECRET_KEY || process.env.JWT_SECRET;

if (!SECRET_KEY) {
  console.error('WARNING: SECRET_KEY or JWT_SECRET environment variable is not set!');
}

const router = express.Router();


router.post("/register", async (req, res) => {
    try{
        const {name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await User.create({
            name,
            email,
            password:hashedPassword,
            monthlyIncome: 0
        })
        res.status(201).json({ msg: 'User registered successfully' });
    } catch(error){
        console.error("Error during Registeration:", error);
        res.status(500).json({msg:"Server error, please try again later"});
    }
    } )
    




router.post('/login', async (req, res)=> {
    try{

        const {email, password} = req.body;
        
        if(!email || !password){
            return res.status(400).json({ msg: "All fields are required" });
        }
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ msg: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                msg:"Invalid email or password",
            })
        }

        if (!SECRET_KEY) {
            console.error('Missing SECRET_KEY environment variable');
            return res.status(500).json({ msg: 'Server configuration error' });
        }

        const token = jwt.sign(
            {userId : user._id, email: user.email},
            SECRET_KEY,
            {expiresIn:'1h'}
        );


        res.status(200).json({
            msg:"Login Successfully",
            token:token,
            user: {
                name: user.name,
                email: user.email,
                id: user._id,
                monthlyIncome: user.monthlyIncome || 0
            }
        });
    }catch(error){
        console.error("Error during login:", error);
        res.status(500).json({
            msg:"there is something Problem",
        })
    }

})



router.get('/dashboard', authMiddler, (req, res) => {
    res.json({
        msg: `Welcome ${req.user.email}, you are authorized!`,
    })
});

router.get('/profile', authMiddler, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('name email monthlyIncome');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

router.put('/profile', authMiddler, async (req, res) => {
    try {
        const { name, email, monthlyIncome } = req.body;

        if (!name || !email) {
            return res.status(400).json({ msg: 'Name and email are required' });
        }

        const parsedMonthlyIncome = Number(monthlyIncome);
        if (Number.isNaN(parsedMonthlyIncome) || parsedMonthlyIncome < 0) {
            return res.status(400).json({ msg: 'Monthly income must be a valid non-negative number' });
        }

        const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            {
                name,
                email,
                monthlyIncome: parsedMonthlyIncome,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select('name email monthlyIncome');

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        return res.status(200).json({
            msg: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
