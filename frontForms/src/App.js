import { Box, HStack, Input,  Button} from "@chakra-ui/react";
import  { useEffect, useState, useRef } from "react";
import axios from "axios";
import './App.css'

function App() {
  const [posts, setPosts] = useState([]);
  const [_id, setSelectedId] = useState("");
  const [answers, setAnswers] = useState([]);
  const [infoPaciente, setInfoPaciente] = useState({});
  const isSubmitDisabled = answers.some((a) => !a.trim()); // Disable button if any answer is empty
  const answersRefs = useRef([]);




  useEffect(() => {
    answersRefs.current = Array(posts.length).fill(null); // Initialize refs on post change
  }, [posts]);

  useEffect(() => {
    if (_id) {
      fetchQuestions(_id);
    }
  }, [_id]);


  const fetchQuestions = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8005/perguntas/${id}`);
      const questionList = response.data.map((post) =>
        post.selectedQuestions.map((question) => question.pergunta)
      );
      setPosts(questionList.flat());
      setAnswers(Array(questionList.length).fill("")); // Initialize answers with empty strings

      // Access and store infoPaciente from the response
      const { infoPaciente } = response.data[0]; // Assuming infoPaciente is in the first object
      setInfoPaciente(infoPaciente);
    } catch (error) {
      // Handle errors here
    }
  };

  const handleIdChange = (event) => {
    setSelectedId(event.target.value);
  };

  const handleAnswerChange = (index, answer) => {
    setAnswers((prevAnswers) => [
      ...prevAnswers.slice(0, index),
      answer,
      ...prevAnswers.slice(index + 1),
    ]);
  };

  async function handleSubmit() {
  
    
    const selectedId = _id; // Assuming _id is used for identification

    const dataToSend = posts.map((pergunta, index) => ({
      pergunta: pergunta, // Use corrected field name 'pergunta'
      resposta: answers[index],
    }));

    try {
      const response = await axios.post("http://localhost:8005/response", {
        infoPaciente,
        _id: selectedId,
        responses: dataToSend,
      });

      console.log("Respostas salvas com sucesso!", response.data);
      // Clear answers and refetch data to display thank you message
      setAnswers([]);
      setSelectedId("");
       alert("Obrigada por responder!");
      // Use window.location.reload(true) to fully reload the page
      window.location.reload(true);
    } catch (error) {
      console.error(error);
      alert('Enviar as respostas somente uma vez')
      // Handle errors, e.g., display error messages
    }
  }

  return (
    <div className="App">
      <div className="Colum">
    
      <h3>Insira seu Cpf</h3>
      <HStack spacing={8}>
        <Box w="100%" ml="0%" mt="3%">
          <Input
            className="wrap-input"
            id="cpfInput"
            value={_id}
            onChange={handleIdChange}
            placeholder="Digite seu Cpf..."
          />
        </Box>
      </HStack>

     {posts.length > 0 ? (
        <div className="perg" >
          {posts.map((question, index) => (
            <div key={index}>
              {question}
              <br />
              <Input className="wrap-res"
                ref={(el) => (answersRefs.current[index] = el)} // Use ref for uncontrolled input
                type={answersRefs.current[index]?.type || "text"} // Handle potential undefined type
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </div>
          ))}
          <div className="container-Finalizar-form-btn">
      <Button className="Finalizar-form-btn"
      isDisabled={isSubmitDisabled} onClick={handleSubmit}>
            Enviar 
      </Button>
      </div>
        </div>
      ) : (
        <Box textAlign="center">Loading...</Box>
      )}
        </div>
    </div>
  );
}

export default App;





