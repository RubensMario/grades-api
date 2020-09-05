import mongoose from 'mongoose';
import { Grade } from './gradeModel.js';

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB;
db.gradeModel = Grade;

export { db };
