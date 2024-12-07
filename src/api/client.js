const db = require("../config/db");
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
	const client = { ...req.body };

	const query = `CALL register_client (?, ?, ?, ?, ?, @output);
        SELECT @output;`;
	db.query(query, [client.cpf, client.name, client.email, client.phone, client.address], (err, result) => {
		if (err) {
			res.status(500).send(err);
			return;
		}

		//get the ouput
		const [output] = result[1];
		if (output["@output"] === 1) {
			res.status(200).send("Usuario cadastrado");
		} else {
			res.status(400).send("Usuario ja cadstrado");
		}
	});
});

router.get("/", (req, res) => {
	const query = "SELECT * FROM client;";
	db.query(query, (err, result) => {
		if (err) {
			return res.status(500).send();
		}
		return res.status(200).json(result);
	});
});

router.get("/:cpf", (req, res) => {
	const cpf = req.params.cpf;
	const query =
		"SELECT * FROM client\
        WHERE client.cpf = ?;";
	db.query(query, [cpf], (err, result) => {
		if (err) {
			res.status(500).send();
			return;
		}

		if (result.length > 0) {
			res.status(200).json(result);
			return;
		}
		res.status(404).send("Cliente nao encontrado");
	});
});

router.delete("/:cpf", (req, res) => {
	const cpf = req.params.cpf;
	const query =
		"CALL delete_client (?, @output);\
        SELECT @output;";
	db.query(query, [cpf], (err, result) => {
		if (err) {
			res.status(500).send();
			return;
		}

		const [output] = result[1];
		if (output["@output"] === 1) {
			res.status(200).send("Cliente Deletado");
			return;
		}
		res.status(404).send("Usuario não encontrado");
	});
});

router.put("/", (req, res) => {
	const client = { ...req.body };
	console.log(client);
	const query =
		"CALL update_client (?, ?, ?, ?, ?, @output);\
        SELECT @output;";
	db.query(query, [client.cpf, client.name, client.email, client.phone, client.address], (err, result) => {
		if (err) {
			res.status(500).send();
			return;
		}
		const [output] = result[1];
		if (output["@output"] === 1) {
			res.status(200).send("Cliente Atualizado");
			return;
		}
		res.status(404).send("Usuario não encontrado");
	});
});

module.exports = router;
