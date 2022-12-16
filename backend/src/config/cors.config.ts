const origin =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : ['https://tody.kr', 'https://j221-test.tk'];

export default { credentials: true, origin };
