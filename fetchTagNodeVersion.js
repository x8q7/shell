const https = require('https');

const owner = 'pahen'; // 替换为仓库所有者
const repo = 'madge'; // 替换为仓库名

function fetchFromGitHubApi(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: path,
            headers: {
                'User-Agent': 'node.js',
                'Accept': 'application/vnd.github.v3.raw'
            }
        };

        https.get(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    reject(new Error(`GitHub API request failed with status code ${res.statusCode}`));
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function fetchTags() {
    const path = `/repos/${owner}/${repo}/tags`;
    try {
        const data = await fetchFromGitHubApi(path);
        return JSON.parse(data).map(tag => tag.name);
    } catch (error) {
        console.error('Error fetching tags:', error.message);
        return [];
    }
}

async function fetchPackageJson(tag) {
    const path = `/repos/${owner}/${repo}/contents/package.json?ref=${tag}`;
    try {
        return await fetchFromGitHubApi(path);
    } catch (error) {
        console.error(`Error fetching package.json for tag ${tag}:`, error.message);
        return null;
    }
}

async function extractEngines() {
    try {
        const tags = await fetchTags();
        for (const tag of tags) {
            const packageJson = await fetchPackageJson(tag);
            if (packageJson) {
                const { engines } = JSON.parse(packageJson);
                if (engines) {
                    console.log(`Engines for tag ${tag}:`, engines);
                } else {
                    console.log(`No engines field found in tag ${tag}`);
                }
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

extractEngines();
