import shortid from 'shortid';

const COOKIE_AGE = 24 * 60 * 60 * 1000; // one day

export default (req, res, next) => {
  if (req.cookies.userId) {
    req.userId = req.cookies.userId;
  } else {
    req.userId = shortid.generate();
    console.log('Setting User ID', req.userId);
    res.cookie('userId', req.userId, { maxAge: COOKIE_AGE });
  }
  next();
};