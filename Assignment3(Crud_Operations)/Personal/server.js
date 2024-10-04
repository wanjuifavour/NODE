const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'db.json');

function getNextId() {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const maxId = data.reduce((max, item) => Math.max(max, parseInt(item.id)), 0);
    return (maxId + 1).toString();
}

// In your POST route handler:
app.post('/data', (req, res) => {
    const newItem = req.body;
    newItem.id = getNextId();

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    data.push(newItem);
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.json(newItem);
});

app.put('/data/:id', (req, res) => {
    const id = req.params.id;
    const updatedProduct = req.body;

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const index = data.findIndex(item => item.id === id);

    if (index !== -1) {
        data[index] = { ...data[index], ...updatedProduct };
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        res.json(data[index]);
    } else {
        res.status(404).send('Product not found');
    }
});