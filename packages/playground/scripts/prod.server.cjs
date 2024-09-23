// 使用 koa 启动静态文件服务, 并挂载到指定路由下
const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const fs = require('fs')
const path = require('path')

const app = new Koa()
const port = 9999

const PREFIX = '/customPrefix'

app.use(mount(PREFIX, serve(path.join(__dirname, '../dist'))))

app.use(async (ctx, next) => {
    if (ctx.url.startsWith(PREFIX)) {
        ctx.response.type = 'text/html';
        ctx.response.body = fs.readFileSync(path.join(__dirname, '../dist/index.html'))
        return
    }

    next()
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}${PREFIX}`)
})
