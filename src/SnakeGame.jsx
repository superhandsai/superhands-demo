import { useState, useEffect, useRef, useCallback } from 'react'
import './SnakeGame.css'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const GAME_SPEED = 150

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [food, setFood] = useState({ x: 15, y: 15 })
  const [isGameOver, setIsGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const directionRef = useRef(direction)
  const gameLoopRef = useRef(null)

  // Generate random food position
  const generateFood = useCallback((snakeBody) => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  // Check collision with walls or self
  const checkCollision = useCallback((head, snakeBody) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true
    }
    return snakeBody.some(segment => segment.x === head.x && segment.y === head.y)
  }, [])

  // Game loop
  useEffect(() => {
    if (isGameOver || isPaused) return

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0]
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        }

        // Check collision
        if (checkCollision(newHead, prevSnake)) {
          setIsGameOver(true)
          if (score > highScore) {
            setHighScore(score)
          }
          return prevSnake
        }

        const newSnake = [newHead, ...prevSnake]

        // Check if food is eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 10)
          setFood(generateFood(newSnake))
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }, GAME_SPEED)

    return () => clearInterval(gameLoopRef.current)
  }, [isGameOver, isPaused, food, checkCollision, generateFood, score, highScore])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isGameOver) return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          if (directionRef.current.y === 0) {
            directionRef.current = { x: 0, y: -1 }
            setDirection({ x: 0, y: -1 })
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (directionRef.current.y === 0) {
            directionRef.current = { x: 0, y: 1 }
            setDirection({ x: 0, y: 1 })
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (directionRef.current.x === 0) {
            directionRef.current = { x: -1, y: 0 }
            setDirection({ x: -1, y: 0 })
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (directionRef.current.x === 0) {
            directionRef.current = { x: 1, y: 0 }
            setDirection({ x: 1, y: 0 })
          }
          break
        case ' ':
          e.preventDefault()
          setIsPaused(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isGameOver])

  // Reset game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    directionRef.current = INITIAL_DIRECTION
    setFood({ x: 15, y: 15 })
    setIsGameOver(false)
    setIsPaused(false)
    setScore(0)
  }

  return (
    <div className="snake-game-container">
      <div className="game-header">
        <h2>Snake Game</h2>
        <div className="scores">
          <div className="score">Score: {score}</div>
          <div className="high-score">High Score: {highScore}</div>
        </div>
      </div>

      <div className="game-board" style={{
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE
      }}>
        {/* Render snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`snake-segment ${index === 0 ? 'snake-head' : ''}`}
            style={{
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE
            }}
          />
        ))}

        {/* Render food */}
        <div
          className="food"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE
          }}
        />

        {/* Game over overlay */}
        {isGameOver && (
          <div className="game-overlay">
            <div className="game-over-message">
              <h3>Game Over!</h3>
              <p>Final Score: {score}</p>
              <button onClick={resetGame} className="restart-button">
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Pause overlay */}
        {isPaused && !isGameOver && (
          <div className="game-overlay">
            <div className="pause-message">
              <h3>Paused</h3>
              <p>Press SPACE to continue</p>
            </div>
          </div>
        )}
      </div>

      <div className="game-controls">
        <button onClick={() => setIsPaused(prev => !prev)} disabled={isGameOver}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={resetGame}>New Game</button>
      </div>

      <div className="game-instructions">
        <p>Use arrow keys to control the snake</p>
        <p>Press SPACE to pause/resume</p>
      </div>
    </div>
  )
}
