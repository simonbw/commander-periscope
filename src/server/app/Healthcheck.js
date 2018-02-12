import Router from 'express';

export default (getIo) => {
  const router = new Router();
  
  router.get('/', (req, res) => {
    res.send({ status: 'OK' });
  });
  
  return router;
}
