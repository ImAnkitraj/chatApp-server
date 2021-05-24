const express = require('express');
const { GET_USER, ADD_FRIEND, GET_FRIENDS, GET_ROOM, ADD_MESSAGE, SEARCH } = require('../controllers/index');
const router = express.Router();

router.get('/:id', GET_USER);
router.post('/add_friend', ADD_FRIEND);
router.get('/get_friends/:id', GET_FRIENDS);
router.get('/get_room/:id', GET_ROOM);
router.post('/search', SEARCH)
module.exports = router