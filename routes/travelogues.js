const express = require("express");
const router = express.Router();
const data = require('../data');
const travelogues = data.travelogues;

router.get('/', async(req, res) => {
    res.render('travelogues/search', { Research: false, Detail: false });
});

router.post('/', async(req, res) => {
    console.log(req.body);
    let traveloguesList = await travelogues.getTraveloguesBySearch(req.body.searchTerm);
    res.render('travelogues/search', { Research: true, Detail: false, keyword: "result of " + req.body.searchTerm, Travelogue: traveloguesList });
});


router.get('/found/:id', async(req, res) => {
    if (!req.params.id) {
        throw 'You must provide an id!!!';
    }
    try {
        const travelogue = await travelogues.getTraveloguesById(req.params.id);
        res.render('travelogues/search', {
            Research: false,
            Detail: true,
            Travelogue: travelogue
        });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});


router.get("/add", async(req, res) => {
    if (req.session.user) {
        res.render('travelogues/add');
    } else {
        res.redirect('/users/login')
    }
});

router.post("/add", async(req, res) => {
    let currentTravelogue = { title: req.body.travelogueTitle, content: req.body.travelogueContent }
    await travelogues.addTravelogues(req.session.user.userId, currentTravelogue);
    res.render('travelogues/add', { success: true, Travelogue: currentTravelogue });
});


router.get("/mine", async(req, res) => {
    if (req.session.user) {
        let travelogueList = await travelogues.getTraveloguesByUserId(req.session.user.userId);
        res.render('travelogues/myTravelogues'), { travelogue: travelogueList };
    } else {
        res.redirect('/users/login')
    }
})


module.exports = router;