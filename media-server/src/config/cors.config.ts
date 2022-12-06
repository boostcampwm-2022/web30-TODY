const origin =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://j221.tk';

export default { credentials: true, origin };
