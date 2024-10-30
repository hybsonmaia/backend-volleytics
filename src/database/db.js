import mongoose from "mongoose";

async function connectDatabase() {
  await mongoose.connect(
    "mongodb+srv://volleytics:6h4RiTEHAwdgazTw@cluster0.bnx0g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
}

export default connectDatabase;
