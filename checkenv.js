#!/usr/bin/env node

const fs = require('fs');


const configPath = {
    servers: `${__dirname}/config/servers.json`
}
const dev = {
    clientHost: '192.168.1.145'
}
const pro = {
    clientHost: 'https://mingrifish.com'
}

const args = process.argv.splice(2);
const env = args[0] || 'dev';
const init = async function () {
    console.log('====================');
    console.log(`执行环境：${env=== 'pro'?'生产环境':'开发环境'}`);
    console.log("检查配置项");
    checkServers();
    
}

const checkServers = async function (params) {
    let servers = require(configPath.servers);
    if (env === 'pro') {
        servers['production'].connector[0].clientHost = pro.clientHost;
    } else {
        servers['development'].connector[0].clientHost = dev.clientHost;
    }
    fs.writeFileSync(configPath.servers, JSON.stringify(servers, null, "\t"));
    console.log("server.json 配置完成");
}

init();