import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import LanguageContext from "../../LanguageContext";

interface GameCard {
  id: number;
  type: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryCardGame = () => {
  const { language } = useContext(LanguageContext);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const cardTypes = [
    { type: 'salad', emoji: '🥗' },
    { type: 'exercise', emoji: '🏃‍♂️' },
    { type: 'salt', emoji: '🧂' },
    { type: 'water', emoji: '💧' },
    { type: 'meditation', emoji: '🧘‍♀️' },
    { type: 'heart', emoji: '❤️' }
  ];

  const initializeGame = () => {
    const gameCards: GameCard[] = [];
    let id = 0;
    
    cardTypes.forEach(cardType => {
      // Add two cards of each type
      gameCards.push({
        id: id++,
        type: cardType.type,
        emoji: cardType.emoji,
        isFlipped: false,
        isMatched: false
      });
      gameCards.push({
        id: id++,
        type: cardType.type,
        emoji: cardType.emoji,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);

      if (firstCard && secondCard && firstCard.type === secondCard.type) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matches === cardTypes.length) {
      setGameWon(true);
    }
  }, [matches]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const getCardTitle = (type: string) => {
    const titles = {
      salad: language === 'pt' ? 'Alimentação Saudável' : 'Healthy Eating',
      exercise: language === 'pt' ? 'Exercício' : 'Exercise',
      salt: language === 'pt' ? 'Evitar Sal' : 'Avoid Salt',
      water: language === 'pt' ? 'Hidratação' : 'Hydration',
      meditation: language === 'pt' ? 'Relaxamento' : 'Relaxation',
      heart: language === 'pt' ? 'Coração Saudável' : 'Healthy Heart'
    };
    return titles[type as keyof typeof titles] || type;
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ mb: 2, color: '#2F4F4F' }}>
        {language === 'pt' ? 'Jogo da Memória - Pressão Arterial' : 'Memory Game - Blood Pressure'}
      </Typography>
      
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          {language === 'pt' ? `Movimentos: ${moves}` : `Moves: ${moves}`}
        </Typography>
        <Typography variant="body1">
          {language === 'pt' ? `Pares encontrados: ${matches}/${cardTypes.length}` : `Pairs found: ${matches}/${cardTypes.length}`}
        </Typography>
      </Box>

      {gameWon && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: '#BE550F', fontWeight: 'bold', mb: 2 }}>
            {language === 'pt' ? '🎉 Parabéns! Você venceu!' : '🎉 Congratulations! You won!'}
          </Typography>
          <Typography variant="body1">
            {language === 'pt' 
              ? `Você completou o jogo em ${moves} movimentos!`
              : `You completed the game in ${moves} moves!`}
          </Typography>
        </Box>
      )}

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 2, 
        mb: 3,
        maxWidth: 600,
        width: '100%'
      }}>
        {cards.map((card) => (
          <Card 
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            sx={{ 
              height: 120,
              cursor: card.isMatched || card.isFlipped ? 'default' : 'pointer',
              bgcolor: card.isMatched ? '#e8f5e8' : card.isFlipped ? '#fff' : '#2F4F4F',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: card.isMatched || card.isFlipped 
                  ? 'none' 
                  : 'scale(1.05)'
              }
            }}
          >
            <CardContent sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              p: 1
            }}>
              {card.isFlipped || card.isMatched ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Typography variant={card.type === 'salt' ? 'h4' : 'h3'}>
                      {card.emoji}
                    </Typography>
                    {card.type === 'salt' && (
                      <Typography variant="h4" sx={{ color: 'red', ml: 0.2 }}>
                        ❌
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ textAlign: 'center', fontSize: '0.7rem' }}>
                    {getCardTitle(card.type)}
                  </Typography>
                </>
              ) : (
                <Typography variant="h4" sx={{ color: '#F4c430' }}>
                  ?
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Button 
        variant="contained"
        onClick={initializeGame}
        sx={{ 
          bgcolor: '#BE550F',
          '&:hover': { bgcolor: '#9A4409' },
          fontWeight: 'bold'
        }}
      >
        {language === 'pt' ? 'Novo Jogo' : 'New Game'}
      </Button>

      <Box sx={{ mt: 3, textAlign: 'center', maxWidth: 500 }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {language === 'pt' 
            ? 'Encontre os pares de cartas relacionadas à saúde cardiovascular!'
            : 'Find matching pairs of cards related to cardiovascular health!'}
        </Typography>
      </Box>
    </Box>
  );
};

export default MemoryCardGame;