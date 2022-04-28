const express = require('express');

const router = express.Router();

const auth = require('../middlewares/auth.middleware');

const {
  putRegister,
  postLogin,
  getMe,
  postLogout,
  postLogoutAll,
} = require('../controllers/auth.controllers');

router.put('/register', putRegister);

router.post('/login', postLogin);

router.get('/me', auth, getMe);

router.post('/logout', auth, postLogout);

router.post('/logoutall', auth, postLogoutAll);

module.exports = router;
