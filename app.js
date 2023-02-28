const express = require("express")
const morgan = require("morgan")
const postBank = require("./postBank")
const app = express()

app.use(express.static('public'))
app.use(morgan('dev'))

app.get( '/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if(!post.id){
    res.status(404)
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        <h1>
        404: Page Not Found
        </h1>
      </div>
    </body>
    `)
  }else{
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        <h1>
        ${post.title}
        </h1>
        <p>
        ${post.content}
        </p>
      </div>
    </body>`);
  }
})

app.get("/", (req, res) => {
  const posts = postBank.list()
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`
  res.send(html)
})

const { PORT = 1337 } = process.env

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
})
