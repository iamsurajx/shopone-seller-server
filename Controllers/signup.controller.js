import User from '../Models/user.model.js'; // Import the User model
import bcrypt from 'bcrypt';

// Signup
export const signup = async (req, res) => {
    const { firstName, lastName, email, password, phoneNumber, address } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            address
        });

        const newUser = await user.save();
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};