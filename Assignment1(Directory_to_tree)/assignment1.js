const fs = require('fs');
const path = require('path');

function serializeDirTree(rootDir, depth) {
    const fullPath = path.resolve(process.cwd(), rootDir);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Path does not exist: ${fullPath}`);
    }

    const stats = fs.statSync(fullPath);
    const name = path.basename(fullPath);

    const node = {
        name: name,
        path: path.relative(process.cwd(), fullPath),
        type: stats.isDirectory() ? 'dir' : 'file',
        size: stats.size
    };

    if (stats.isDirectory() && depth > 0) {
        node.children = fs.readdirSync(fullPath)
            .map(child => serializeDirTree(path.join(fullPath, child), depth - 1));
    }

    return node;
}

module.exports = serializeDirTree;

console.log(JSON.stringify(serializeDirTree("dummy_dir", 5), null, 2));
