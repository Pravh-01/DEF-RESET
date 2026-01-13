const list = [
  'UP BEFORE THE ENEMY',
  'GET AFTER IT',
  'PRIORITIZE & EXECUTE',
  'HYDRATE',
  'GOOD FUEL',
  'BACK TO BOOK',
].map((task, i) => ({
  id: i + 1,
  task,
  days: Array(7).fill(false),
}))

export default list