import mongoose from "mongoose" 
//  this Function Connected the MongoDB
export async function conneDB(url){
    await mongoose.connect(url)
}