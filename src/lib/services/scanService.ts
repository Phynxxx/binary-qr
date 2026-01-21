import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import ScanLog from '@/lib/models/ScanLog';

export async function claim(usernameRaw: string, phase: string, volunteerId: string) {
  await dbConnect();
  const username = usernameRaw.trim().toLowerCase();
  const now = new Date();
  const isSwag = phase === 'swag';
  
  // Validate phase if not swag
  const validMeals = ['lunch1', 'dinner1', 'midnight', 'breakfast2', 'lunch2'];
  if (!isSwag && !validMeals.includes(phase)) {
     await ScanLog.create({ username, type: isSwag ? 'SWAG' : 'MEAL', mealKey: phase, volunteerId, status: 'ERROR', message: 'Invalid phase' });
     return { status: 'ERROR', message: 'Invalid phase' };
  }

  const updatePath = isSwag ? 'swag.claimed' : `meals.${phase}.claimed`;
  const setFields: any = {
    [updatePath]: true
  };
  
  // set timestamps and claimedBy
  if (isSwag) {
    setFields['swag.claimedAt'] = now;
    setFields['swag.claimedBy'] = volunteerId;
  } else {
    setFields[`meals.${phase}.claimedAt`] = now;
    setFields[`meals.${phase}.claimedBy`] = volunteerId;
  }

  // 1. Try conditional update (existing user path)
  const query = { username, [updatePath]: { $ne: true } };
  const update = { $set: setFields, $setOnInsert: { username, createdAt: now } };

  try {
    const updated = await User.findOneAndUpdate(query, update, { new: true });
    
    if (updated) {
      await ScanLog.create({ username, type: isSwag ? 'SWAG' : 'MEAL', mealKey: isSwag ? null : phase, volunteerId, status: 'SUCCESS', message: 'Granted' });
      return { status: 'SUCCESS', message: 'Granted', user: updated };
    }

    // 2. Not updated, check if user exists
    const existing = await User.findOne({ username });
    if (existing) {
      // If existing user found but findOneAndUpdate didn't return it, it means [updatePath] was already true
      await ScanLog.create({ username, type: isSwag ? 'SWAG' : 'MEAL', mealKey: isSwag ? null : phase, volunteerId, status: 'DUPLICATE', message: 'Already claimed' });
      return { status: 'DUPLICATE', message: 'Already claimed' };
    }

    // 3. User does not exist: create (lazy)
    const newUserDoc: any = {
      username,
      meals: {
        lunch1: { claimed: false }, dinner1: { claimed: false }, midnight: { claimed: false },
        breakfast2: { claimed: false }, lunch2: { claimed: false }
      },
      swag: { claimed: false }
    };
    
    // flip the appropriate flag
    if (isSwag) {
      newUserDoc.swag = { claimed: true, claimedAt: now, claimedBy: volunteerId };
    } else {
      newUserDoc.meals[phase] = { claimed: true, claimedAt: now, claimedBy: volunteerId };
    }

    await User.create(newUserDoc);
    await ScanLog.create({ username, type: isSwag ? 'SWAG' : 'MEAL', mealKey: isSwag ? null : phase, volunteerId, status: 'SUCCESS', message: 'New user created and granted' });
    return { status: 'SUCCESS', message: 'New user created & granted' };

  } catch (err: any) {
    // Duplicate key means a concurrent create happened → retry conditional update
    if (err.code === 11000) {
      const updatedRetry = await User.findOneAndUpdate(query, update, { new: true });
      if (updatedRetry) {
        await ScanLog.create({ username, type: isSwag ? 'SWAG' : 'MEAL', mealKey: isSwag ? null : phase, volunteerId, status: 'SUCCESS', message: 'Granted on retry' });
        return { status: 'SUCCESS', message: 'Granted on retry' };
      } else {
        await ScanLog.create({ username, type: isSwag ? 'SWAG' : 'MEAL', mealKey: isSwag ? null : phase, volunteerId, status: 'DUPLICATE', message: 'Duplicate after retry' });
        return { status: 'DUPLICATE', message: 'Already claimed' };
      }
    }
    // other errors
    console.error(err);
    await ScanLog.create({ username, type: isSwag ? 'SWAG' : 'MEAL', mealKey: isSwag ? null : phase, volunteerId, status: 'ERROR', message: String(err) });
    throw err;
  }
}
