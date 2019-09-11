import mongoose from 'mongoose';

export const DBconnect = async () => {
  await mongoose
    .connect('mongodb://localhost:27017/premierAPI', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => 'connection successful')
    .catch(err => {
      // console.error(err.message);
      process.exit(1);
    });
};

export async function DBdisconnect() {
  await mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
  // console.log('connection closed');
}
