const origin =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://tody.kr';

export default { credentials: true, origin };
