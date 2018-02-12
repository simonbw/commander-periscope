import Router from 'express';
import CustomLobbies from '../resources/CustomLobbies';
import Games from '../resources/Games';

export default (getIo) => {
  const router = new Router();
  
  router.get('/', (req, res) => {
    const games = Games._instances.size;
    const lobbies = CustomLobbies._instances.size;
    const connections = getIo().engine.clientsCount;
    const version = process.env.SOURCE_VERSION;
    res.send({
      status: 'OK', // When is it not?
      version,
      connections,
      games,
      lobbies,
    });
  });
  
  return router;
}
