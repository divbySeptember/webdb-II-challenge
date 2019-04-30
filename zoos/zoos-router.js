const router = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  debug: true
};

const db = knex(knexConfig);

router.get("/", (req, res) => {
  db("zoos")
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db("zoos")
    .where({ id })
    .first()
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ message: "Please provide a name for the zoo." });
  }
  db("zoos")
    .insert(req.body)
    .then(ids => {
      const id = ids[0];
      db("zoos")
        .where({ id })
        .first()
        .then(zoo => {
          res.status(201).json(zoo);
        });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db("zoos")
    .where({ id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "The Zoo could not be found." });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;

  if (!req.body.name) {
    return res.status(400).json({ message: "Please provide an updated name." });
  }

  db("zoos")
    .where({ id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "The Zoo could not be found." });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
