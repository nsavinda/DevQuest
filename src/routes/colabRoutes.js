import express from "express";
import ColabService from "../services/colabService.js";
import HttpStatus from "../enums/httpStatus.js";
const router = express.Router();
import path from "path";
import mime from "mime";
import fs from "fs";
import colabService from "../services/colabService.js";


router.get('/find-shared-docs/:groupId', async (req, res) => {
    let group_id = req.params.groupId;
    let groups = await colabService.getAllDocsByGroup(group_id);
    res.json(groups);
});

router.post("/add-doc-group", async (req, res) => {
    try {
        let data = req.body;
        if (req.body) {
            let file_name = data.file_name;
            let db_file_data = {
                file_name: file_name,
                file_path: "./client/uploads/" + file_name,
                file_desc: data.file_desc,
                group_id: parseInt(data.group_id),
                user_id: parseInt(data.user_id)
            }
            let response = await colabService.addNewDoc(db_file_data);
            if (response.status == HttpStatus.FORBIDDEN) {
                res.status(response.status).json({ message: "IRequest already sent" });
            } else {
                uploadDoc(data);
                res.status(response.status).json(response);
            }
        } else {
            throw Error("No file found");
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/upload-doc", async (req, res) => {
    try {
        if (!req.files) {

            res.send({
                status: false,
                message: 'No file uploaded',
            });
        } else {
            let doc = req.files.doc;
            uploadDoc(doc);
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: doc.name,
                    mimetype: doc.mimetype,
                    size: doc.size,
                    path: `./client/uploads/${doc.name}`
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});
router.post('/download-doc/', async (req, res) => {
    try {
        let data = req.body;
        let doc_id = data.doc_id;
        const getResponse = await colabService.getDocById(doc_id);
        const response = getResponse.response;
        if (response.status == HttpStatus.FORBIDDEN) {
            res.status(response.status).json({ message: "IRequest already sent" });
        } else {

            let file_path = response.file_path;
            let filename = path.basename(file_path);
            let mimetype = mime.lookup(file_path);

            res.setHeader('Access-Control-Expose-Headers', 'File-Name');
            res.setHeader('File-Name', `${filename}`);
            res.setHeader('Content-type', mimetype);
            res.download("./" + file_path, filename); // Set disposition and send it.
        }

    } catch (err) {
        res.status(500).send(err);
    }

});

router.get('/get-whiteboard/:groupId', async (req, res) => {
    let group_id = req.params.groupId;
    let whiteboardData = await colabService.getWhiteBoardDataByGroup(group_id);
    res.json(whiteboardData);
});

router.post('/post-whiteboard/', async (req, res) => {
    try {
        let data = req.body;
        let response = await colabService.addWhiteBoardData(data);
        if (response.status == HttpStatus.FORBIDDEN) {
            res.status(response.status).json({ message: "IRequest already sent" });
        } else {
            res.status(response.status).json(response);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

async function uploadDoc(doc) {
    await doc.mv("./client/uploads/" + doc.file_name);
}

export default router;
