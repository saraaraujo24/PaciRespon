const mongoose = require("mongoose");


//o que vai armazenar no banco de dados//


const PostSchema = new mongoose.Schema({
    nome: String,
    idade: Number,
    email:String,
    senha: String,
    questao1: String,
    questao2: String,
    questao3: String,
    questao4: String,
  
    createdAt: {
      type: Date,
      default: Date.now
    }

  });

  
module.exports = mongoose.model("Post", PostSchema);
 
 

