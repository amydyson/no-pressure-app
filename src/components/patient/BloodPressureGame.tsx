import { Box, Typography, Button, Card, CardContent, Alert } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LanguageContext from "../../LanguageContext";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const BloodPressureGame = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [feedback, setFeedback] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState<number[]>([]);

  const allQuestions: Question[] = [
    {
      question: language === 'pt' ? 'Qual é a pressão arterial normal?' : 'What is normal blood pressure?',
      options: language === 'pt' ? ['Menos de 120/80 mmHg', '130/85 mmHg', '140/90 mmHg', '150/95 mmHg'] : ['Less than 120/80 mmHg', '130/85 mmHg', '140/90 mmHg', '150/95 mmHg'],
      correctAnswer: 0,
      explanation: language === 'pt' ? 'Pressão normal é menor que 120/80 mmHg' : 'Normal pressure is less than 120/80 mmHg'
    },
    {
      question: language === 'pt' ? 'Qual alimento ajuda a reduzir a pressão arterial?' : 'Which food helps reduce blood pressure?',
      options: language === 'pt' ? ['Sal', 'Banana', 'Açúcar', 'Gordura'] : ['Salt', 'Banana', 'Sugar', 'Fat'],
      correctAnswer: 1,
      explanation: language === 'pt' ? 'Bananas são ricas em potássio, que ajuda a controlar a pressão' : 'Bananas are rich in potassium, which helps control blood pressure'
    },
    {
      question: language === 'pt' ? 'Quantas vezes por semana deve-se exercitar?' : 'How many times per week should you exercise?',
      options: language === 'pt' ? ['1 vez', '3-5 vezes', '7 vezes', 'Nunca'] : ['1 time', '3-5 times', '7 times', 'Never'],
      correctAnswer: 1,
      explanation: language === 'pt' ? 'Exercitar 3-5 vezes por semana ajuda a manter a pressão saudável' : 'Exercising 3-5 times per week helps maintain healthy blood pressure'
    },
    {
      question: language === 'pt' ? 'O que acontece quando você fuma?' : 'What happens when you smoke?',
      options: language === 'pt' ? ['Diminui a pressão', 'Aumenta a pressão', 'Não afeta', 'Melhora a circulação'] : ['Decreases pressure', 'Increases pressure', 'No effect', 'Improves circulation'],
      correctAnswer: 1,
      explanation: language === 'pt' ? 'Fumar aumenta a pressão arterial e danifica os vasos sanguíneos' : 'Smoking increases blood pressure and damages blood vessels'
    },
    {
      question: language === 'pt' ? 'Qual é o limite de sal por dia?' : 'What is the daily salt limit?',
      options: language === 'pt' ? ['10g', '6g', '15g', '20g'] : ['10g', '6g', '15g', '20g'],
      correctAnswer: 1,
      explanation: language === 'pt' ? 'O limite recomendado é 6g de sal por dia' : 'The recommended limit is 6g of salt per day'
    },
    {
      question: language === 'pt' ? 'Classificar: 125/75 mmHg' : 'Classify: 125/75 mmHg',
      options: language === 'pt' ? ['Normal', 'Elevada', 'Hipertensão Estágio 1', 'Hipertensão Estágio 2'] : ['Normal', 'Elevated', 'Stage 1 Hypertension', 'Stage 2 Hypertension'],
      correctAnswer: 1,
      explanation: language === 'pt' ? '125/75 é pressão elevada (120-129 sistólica)' : '125/75 is elevated pressure (120-129 systolic)'
    },
    {
      question: language === 'pt' ? 'O estresse afeta a pressão arterial?' : 'Does stress affect blood pressure?',
      options: language === 'pt' ? ['Não', 'Sim, aumenta', 'Sim, diminui', 'Só em idosos'] : ['No', 'Yes, increases it', 'Yes, decreases it', 'Only in elderly'],
      correctAnswer: 1,
      explanation: language === 'pt' ? 'O estresse pode aumentar temporariamente a pressão arterial' : 'Stress can temporarily increase blood pressure'
    },
    {
      question: language === 'pt' ? 'Qual bebida é melhor para a pressão?' : 'Which drink is best for blood pressure?',
      options: language === 'pt' ? ['Refrigerante', 'Água', 'Álcool', 'Café'] : ['Soda', 'Water', 'Alcohol', 'Coffee'],
      correctAnswer: 1,
      explanation: language === 'pt' ? 'Água é a melhor opção para manter-se hidratado e saudável' : 'Water is the best option to stay hydrated and healthy'
    },
    {
      question: language === 'pt' ? 'Classificar: 140/90 mmHg' : 'Classify: 140/90 mmHg',
      options: language === 'pt' ? ['Normal', 'Elevada', 'Hipertensão Estágio 1', 'Hipertensão Estágio 2'] : ['Normal', 'Elevated', 'Stage 1 Hypertension', 'Stage 2 Hypertension'],
      correctAnswer: 3,
      explanation: language === 'pt' ? '140/90 é hipertensão estágio 2 (≥140/90)' : '140/90 is stage 2 hypertension (≥140/90)'
    },
    {
      question: language === 'pt' ? 'Quantas horas de sono são recomendadas?' : 'How many hours of sleep are recommended?',
      options: language === 'pt' ? ['4-5 horas', '6-7 horas', '7-9 horas', '10+ horas'] : ['4-5 hours', '6-7 hours', '7-9 hours', '10+ hours'],
      correctAnswer: 2,
      explanation: language === 'pt' ? '7-9 horas de sono ajudam a manter a pressão saudável' : '7-9 hours of sleep help maintain healthy blood pressure'
    },
    {
      question: language === 'pt' ? 'O que é hipertensão do avental branco?' : 'What is white coat hypertension?',
      options: language === 'pt' ? ['Pressão alta em casa', 'Pressão alta no médico', 'Pressão baixa', 'Pressão normal'] : ['High pressure at home', 'High pressure at doctor', 'Low pressure', 'Normal pressure'],
      correctAnswer: 1,
      explanation: language === 'pt' ? 'É quando a pressão sobe apenas no consultório médico devido ao nervosismo' : 'It is when pressure rises only at the doctor\'s office due to nervousness'
    },
    {
      question: language === 'pt' ? 'Classificar: 110/70 mmHg' : 'Classify: 110/70 mmHg',
      options: language === 'pt' ? ['Normal', 'Elevada', 'Hipertensão Estágio 1', 'Hipertensão Estágio 2'] : ['Normal', 'Elevated', 'Stage 1 Hypertension', 'Stage 2 Hypertension'],
      correctAnswer: 0,
      explanation: language === 'pt' ? '110/70 é pressão normal (<120/80)' : '110/70 is normal pressure (<120/80)'
    },
    {
      question: language === 'pt' ? 'Qual exercício é melhor para o coração?' : 'Which exercise is best for the heart?',
      options: language === 'pt' ? ['Levantamento de peso', 'Caminhada', 'Corrida intensa', 'Yoga'] : ['Weight lifting', 'Walking', 'Intense running', 'Yoga'],
      correctAnswer: 1,
      explanation: language === 'pt' ? 'Caminhada é um exercício aeróbico seguro e eficaz' : 'Walking is a safe and effective aerobic exercise'
    },
    {
      question: language === 'pt' ? 'Com que frequência medir a pressão?' : 'How often should you measure blood pressure?',
      options: language === 'pt' ? ['Diariamente', 'Semanalmente', 'Mensalmente', 'Anualmente'] : ['Daily', 'Weekly', 'Monthly', 'Annually'],
      correctAnswer: 1,
      explanation: language === 'pt' ? 'Para pessoas com pressão normal, semanalmente é suficiente' : 'For people with normal pressure, weekly is sufficient'
    },
    {
      question: language === 'pt' ? 'Classificar: 135/85 mmHg' : 'Classify: 135/85 mmHg',
      options: language === 'pt' ? ['Normal', 'Elevada', 'Hipertensão Estágio 1', 'Hipertensão Estágio 2'] : ['Normal', 'Elevated', 'Stage 1 Hypertension', 'Stage 2 Hypertension'],
      correctAnswer: 2,
      explanation: language === 'pt' ? '135/85 é hipertensão estágio 1 (130-139 ou 80-89)' : '135/85 is stage 1 hypertension (130-139 or 80-89)'
    }
  ];

  const getRandomQuestion = (): Question => {
    let availableQuestions = allQuestions.filter((_, index) => !usedQuestions.includes(index));
    if (availableQuestions.length === 0) {
      availableQuestions = allQuestions;
      setUsedQuestions([]);
    }
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    const originalIndex = allQuestions.indexOf(selectedQuestion);
    setUsedQuestions(prev => [...prev, originalIndex]);
    return selectedQuestion;
  };

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setScore(0);
    setQuestionNumber(0);
    setUsedQuestions([]);
    setShowFeedback(false);
    setCurrentQuestion(getRandomQuestion());
  };

  const handleAnswer = (selectedAnswerIndex: number) => {
    if (!currentQuestion) return;

    const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswer;
    const newQuestionNumber = questionNumber + 1;
    setQuestionNumber(newQuestionNumber);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback(`${language === 'pt' ? 'Correto! 🎉' : 'Correct! 🎉'} ${currentQuestion.explanation}`);
    } else {
      setFeedback(
        `${language === 'pt' ? 'Incorreto.' : 'Incorrect.'} ${currentQuestion.explanation}`
      );
    }
    
    setShowFeedback(true);
    
    // Check if game is complete (5 questions)
    if (newQuestionNumber >= 5) {
      setTimeout(() => {
        setGameCompleted(true);
        setShowFeedback(false);
      }, 3000);
    } else {
      // Auto-advance to next question after 3 seconds
      setTimeout(() => {
        setShowFeedback(false);
        setCurrentQuestion(getRandomQuestion());
      }, 3000);
    }
  };

  const getScoreColor = () => {
    const percentage = questionNumber > 0 ? (score / questionNumber) * 100 : 0;
    if (percentage >= 80) return '#4CAF50';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  if (gameCompleted) {
    const percentage = Math.round((score / 5) * 100);
    return (
      <Box>
        <Typography variant="h3" sx={{ textAlign: 'center', mt: 4, mb: 2, color: '#2F4F4F', fontWeight: 'bold' }}>
          {language === 'pt' ? 'Jogo de Pressão Arterial' : 'Blood Pressure Game'}
        </Typography>
        <Box sx={{ p: 4, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
        <Typography variant="h4" sx={{ mb: 3, color: '#2F4F4F' }}>
          {language === 'pt' ? 'Quiz Concluído!' : 'Quiz Complete!'}
        </Typography>
        
        <Typography variant="h2" sx={{ mb: 2, color: getScoreColor(), fontWeight: 'bold' }}>
          {score}/5
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 3, color: getScoreColor() }}>
          {percentage}%
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
          {percentage >= 80 
            ? (language === 'pt' ? 'Excelente! Você conhece bem sobre pressão arterial.' : 'Excellent! You know a lot about blood pressure.')
            : percentage >= 60
            ? (language === 'pt' ? 'Bom trabalho! Continue aprendendo.' : 'Good job! Keep learning.')
            : (language === 'pt' ? 'Continue estudando sobre pressão arterial.' : 'Keep studying about blood pressure.')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            onClick={startGame}
            sx={{ 
              bgcolor: '#BE550F',
              color: '#FFFFFF',
              '&:hover': { bgcolor: '#9A4409' }
            }}
          >
            {language === 'pt' ? 'Jogar Novamente' : 'Play Again'}
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => navigate('/patient')}
            sx={{ 
              borderColor: '#666',
              color: '#666'
            }}
          >
            {language === 'pt' ? 'Sair' : 'Exit'}
          </Button>
        </Box>
        </Box>
      </Box>
    );
  }

  if (!gameStarted) {
    return (
      <Box>
        <Typography variant="h3" sx={{ textAlign: 'center', mt: 4, mb: 2, color: '#2F4F4F', fontWeight: 'bold' }}>
          {language === 'pt' ? 'Jogo de Pressão Arterial' : 'Blood Pressure Game'}
        </Typography>
        <Box sx={{ p: 4, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
        
        
        <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
          {language === 'pt' 
            ? 'Teste seus conhecimentos sobre pressão arterial e saúde cardiovascular! Responda 5 perguntas sobre classificação, prevenção e cuidados.'
            : 'Test your knowledge of blood pressure and cardiovascular health! Answer 5 questions about classification, prevention and care.'}
        </Typography>
        
        <Button 
          variant="contained" 
          size="large"
          onClick={startGame}
          sx={{ 
            bgcolor: '#BE550F',
            color: '#FFFFFF',
            '&:hover': { bgcolor: '#9A4409' }
          }}
        >
          {language === 'pt' ? 'Iniciar Jogo' : 'Start Game'}
        </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h3" sx={{ textAlign: 'center', mt: 4, mb: 2, color: '#2F4F4F', fontWeight: 'bold' }}>
        {language === 'pt' ? 'Jogo de Pressão Arterial' : 'Blood Pressure Game'}
      </Typography>
      <Box sx={{ p: 4, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h6" sx={{ color: getScoreColor(), fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
        {language === 'pt' ? 'Pergunta' : 'Question'} {questionNumber + 1}/5 | {language === 'pt' ? 'Pontuação' : 'Score'}: {score}/{questionNumber || 1}
      </Typography>

      {showFeedback && (
        <Alert severity={feedback.includes('Correto') || feedback.includes('Correct') ? 'success' : 'error'} sx={{ mb: 3 }}>
          {feedback}
        </Alert>
      )}

      {currentQuestion && (
        <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, color: '#333', textAlign: 'center' }}>
              {currentQuestion.question}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  sx={{
                    p: 2,
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    borderColor: '#BE550F',
                    color: '#BE550F',
                    '&:hover': {
                      borderColor: '#9A4409',
                      color: '#9A4409',
                      bgcolor: 'rgba(190, 85, 15, 0.04)'
                    }
                  }}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/patient')}
          sx={{ 
            borderColor: '#666',
            color: '#666'
          }}
        >
          {language === 'pt' ? 'Sair do Jogo' : 'Exit Game'}
        </Button>
      </Box>
      </Box>
    </Box>
  );
};

export default BloodPressureGame;