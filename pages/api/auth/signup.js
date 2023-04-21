import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import Seller from '../../../models/Seller';
import Advertiser from '../../../models/Advertiser';
import db from '../../../utils/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const { name, email, password,selectedOccupation } = req.body;
  if (
    !name ||
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connect();
  console.log(selectedOccupation)

  if(selectedOccupation=='User'){

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(422).json({ message: 'User exists already!' });
      await db.disconnect();
      return;
    }

    const newUser = new User({
      name,
      email,
      password: bcryptjs.hashSync(password),
    });

    const user = await newUser.save()

    console.log(user)
  }
  else if (selectedOccupation ==="Seller"){
    const existingUser = await Seller.findOne({ email: email });
    if (existingUser) {
      res.status(422).json({ message: 'User exists already!' });
      await db.disconnect();
      return;
    }

    const newUser = new Seller({
      name,
      email,
      password: bcryptjs.hashSync(password),
    });

    const user = await newUser.save();
    console.log(user)
  }
  else if (selectedOccupation ==="Advertiser"){
    const existingUser = await Advertiser.findOne({ email: email });
    if (existingUser) {
      res.status(422).json({ message: 'User exists already!' });
      await db.disconnect();
      return;
    }

    const newUser = new Advertiser({
      name,
      email,
      password: bcryptjs.hashSync(password),
    });

    const user = await newUser.save();
    console.log(user)
  }
  await db.disconnect();
  res.status(201).send({
    message: {selectedOccupation},
  });
}

export default handler;