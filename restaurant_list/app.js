//宣吿 express 必須是'express'語言
//宣吿 exphbs 必須是'express-handlebars'框架
//將restResults資料轉換成restaurants.json格式放入index.handlebars
const express = require('express')
const exphbs = require('express-handlebars')
const restResults = require('./restaurants.json')
const app = express()
const port = 3000

//app.engine(定義樣版引擎為'handlebars'，exphbs({設定為預設依照 'main'}))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))

//app.set透過express載入的'view engine'樣版引擎定義為'handlebars'
app.set('view engine', 'handlebars')

//app.use透過express指派的靜態檔案引入路徑為'public'/javascripts、stylesheets兩條路徑
app.use(express.static('public'))

//建立layout檔案夾/main.handlebars檔案(佈局樣板)
//建立layout/view檔案夾/index.handlebars檔案(restResults首頁)
//伺服器回覆渲染畫面內容'index'= index.handlebars，餐廳資料：restaurants/results清單細目
app.get('/', (req, res) => {
  res.render('index', { restaurants: restResults.results })
})

//將index handlebars search forms 根目錄改成'/search'，利用req裡面的query找出輸入的keyword，找出多部相關的movies再篩選出filter()正確資訊，返回輸入名稱name或類型category，輸入文字全轉為小寫包括餐廳資料裡的名稱也改為小寫
app.get('/search', (req, res) => {
  console.log("keyword", req.query.keyword)
  const keyword = req.query.keyword;
  const restaurant = restResults.results.filter((restaurant) => {
    return (restaurant.name.toLowerCase().includes(keyword.trim().toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.trim().toLowerCase())
    )
  })
  //保留前一次輸入值為預設值
  res.render('index', { restaurants: restaurant, keyword: keyword })
})

//建立餐廳分頁show.handlebars(佈局樣板)路由，透過params取得動態路由:restaurant_id，從restResults.results.filter篩選出使用者restaurant_id是否等於restResults restaurant.id
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restResults.results.filter(restaurant => restaurant.id === Number(req.params.restaurant_id))

  //回覆渲染show handlebars清單restaurant.id等同動態restaurant_id，從第一個位置0開始
  res.render('show', { restaurant: restaurant[0] })
})

//伺服器監聽器
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})