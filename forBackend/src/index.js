const express = require("express")
const morgan = require("morgan");
const app = express();
const mongoose = require('mongoose')
const cors = require("cors");

const bodyParser= require("body-parser");

app.use(morgan("dev"));
app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())



// Conexão com o banco de dados MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/questions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Resposta = mongoose.model('Response', {
 // selectedId:Number,
 // posts:Array,
 _id: String,
 infoPaciente:Array,
 responses:Array

});

/*app.post("/response", async (req, res) => {
  try {
    const { selectedId,posts } = req.body;

    // Input validation (optional):
    // Validate the data's structure and content (e.g., presence, type)

    // Sanitize input (optional):
    // Apply appropriate sanitization techniques to prevent security vulnerabilities

    const newResposta = new Resposta({
      selectedId,posts
     
      // Add timestamps, user ID, or other relevant fields
    });

    await newResposta.save();

    // Integrate with your existing logic:
    // - Update related document(s) in Perguntas collection
    // - Trigger other actions or data processing

    res.json({ message: "Dados salvos com sucesso!", data: newResposta });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar dados" });
  }
});
*/

app.post('/response', async (req, res) => {
  try {
    const { _id, responses,infoPaciente } = req.body;

    const newResposta = new Resposta({ _id, responses,infoPaciente });
    await newResposta.save();

    res.json({ message: 'Dados salvos com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar dados' });
  }
});




const Perguntas = mongoose.model('PergSelecPaci', {
  _id:String,
  infoPaciente:Array,
  selectedQuestions: [{
    perguntaId: String,
    pergunta: String,
  }],

});

app.get('/perguntas/:cpf', async (req, res) => {
  const { cpf } = req.params;

  try {
    const posts = await Perguntas.find({ 'infoPaciente.cpf': cpf }); // Filter based on 'cpf' field within 'infoPaciente'
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter dados' });
  }
});

app.post('/response', async (req, res) => {
  try {
    const { responses } = req.body;

    const newResposta = new Resposta({ responses });
    await newResposta.save();

    // Handle success, e.g., send confirmation response
  } catch (err) {
    // Handle errors
  }
});

app.listen(8005, ()=> {
    console.log("Rodando");
})







