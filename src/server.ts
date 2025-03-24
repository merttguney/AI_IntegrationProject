
require('dotenv').config();
import app from './app';

const PORT = process.env.PORT || 3000;
console.log('initing configuration via dotenv')
console.log('Rabbit mq url' + process.env.RABBITMQ_URL)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});