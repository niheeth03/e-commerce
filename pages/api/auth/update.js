import { getSession } from 'next-auth/react';
import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import Seller from '../../../models/Seller';
import Advertiser from '../../../models/Advertiser';

import db from '../../../utils/db';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  const { user } = session;
  const { name, email, password ,role } = req.body;

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connect();
  if(role==='user'){
    const toUpdateUser = await User.findById(user._id);
    toUpdateUser.name = name;
    toUpdateUser.email = email;

    if (password) {
      toUpdateUser.password = bcryptjs.hashSync(password);
    }

    await toUpdateUser.save();
    await db.disconnect();
    res.send({
      message: 'User updated',
    });
  }
  else if(role==='seller'){
    const toUpdateUser = await Seller.findById(user._id);
    toUpdateUser.name = name;
    toUpdateUser.email = email;

    if (password) {
      toUpdateUser.password = bcryptjs.hashSync(password);
    }

    await toUpdateUser.save();
    await db.disconnect();
    res.send({
      message: 'Seller updated',
    });
  }
  else if(role==='advertiser'){
      const toUpdateUser = await Advertiser.findById(user._id);
      toUpdateUser.name = name;
      toUpdateUser.email = email;
  
      if (password) {
        toUpdateUser.password = bcryptjs.hashSync(password);
      }
  
      await toUpdateUser.save();
      await db.disconnect();
      res.send({
        message: 'Advertiser updated',
      });
  }
}


export default handler;