const express = require('express');
const bodyParser = require("body-parser");
const jsonfile = require('jsonfile');
const productsFile = 'products.json';
const usersFile = 'users.json';
const productsFileTemp = 'productsTemp.json';
const shopsFile = 'shops.json';
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Helpers
//---------------------------------------------------------------------------------
function filterShops (shops, searchText) {
    const ans = [];
    if (searchText === 'undefined')
        return shops;
    for (let i = 0; i < shops.length; i++) {
        if (shops[i].address.toLowerCase().indexOf(searchText) > -1 ||
            shops[i].manager.toLowerCase().indexOf(searchText) > -1 ||
            shops[i].id.toString().toLowerCase().indexOf(searchText) > -1) {
            ans.push(shops[i]);
        }
    }
    return ans;
}

function generateGraphData(type) {
    const randomValue = () => Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
    
    const ans = [
        [
            {date: JSON.stringify(new Date(2017, 02, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 03, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 04, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 05, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 06, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 07, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 08, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 09, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 10, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 11, 31)), value: randomValue()}
        ],
        [
            {date: JSON.stringify(new Date(2017, 02, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 03, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 04, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 05, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 06, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 07, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 08, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 09, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 10, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 11, 31)), value: randomValue()}
        ],
        [
            {date: JSON.stringify(new Date(2017, 02, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 03, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 04, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 05, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 06, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 07, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 08, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 09, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 10, 31)), value: randomValue()},
            {date: JSON.stringify(new Date(2017, 11, 31)), value: randomValue()}
        ]
    ];
    if (type === 'product') {
        return [ans[0]];
    }
    return ans;
}


function filterProducts(products, searchText) {
    const ans = [];
    if (searchText === 'undefined')
        return products;
    for (let i = 0; i < products.length; i++) {
        if (products[i].product.toLowerCase().indexOf(searchText) > -1 ||
            products[i].category.toLowerCase().indexOf(searchText) > -1 ||
            products[i].id.toString().toLowerCase().indexOf(searchText) > -1) {
            ans.push(products[i]);
        }
    }
    return ans;
}

//---------------------------------------------------------------------------------

//Api
//---------------------------------------------------------------------------------

app.get('/api/user', function(req, res) {
    console.log('GET /api/user');
    const email = req.query.email;
    let ans;

    jsonfile.readFile(usersFile, function(err, users) {
        for (obj of users) {
            if (obj.email === email) {
                ans = obj;
                break;
            }
        }

        res.send(ans);
    });
});

app.post('/api/addUser', function(req, res) {
    console.log('POST /api/addUser');

    const user = req.body;
    const flag = true;
    const users = jsonfile.readFileSync(usersFile);

    for (obj of users) {
        if (obj.email === user.email) {
            res.send(null);
            flag = false;
            break;
        }
    }

    if (flag) {
        user.id = Math.floor(Math.random() * (10000000 - 1000000 + 1)) + 1000000;
        users.push(user);
        jsonfile.writeFileSync(usersFile, users);
        res.send(user);
    }
});

app.get('/api/statistic/get/lineGraph/:type?', function (req, res) {
    console.log('GET /api/statistic/get/lineGraph');
    const type = req.params.type;
    const id = req.query.id;
    const ans = generateGraphData(type);
    
    res.send(ans);
});

app.get('/api/products/get', function (req, res) {
   console.log('GET /api/products/get');
   const pageIndex = parseInt(req.query.pageIndex);
   const pageSize = parseInt(req.query.pageSize);
   const searchText = req.query.searchText;
   const ans = [];
   
    jsonfile.readFile(productsFile, function(err, obj) {
        const start = pageIndex * pageSize;
        const end = (pageIndex + 1) * pageSize;
        const filteredProd = filterProducts(obj, searchText);
        console.log(filteredProd[0]);
       for (let i = start; i < Math.min(end, filteredProd.length); i++) {
           ans.push(filteredProd[i]);
       }
        res.send(ans);
   });
});

app.get('/api/products/productsAmount', function(req, res) {
    console.log('GET /api/products/productsAmount');
    const searchText = req.query.searchText;
    jsonfile.readFile(productsFile, function(err, obj) {
        const filteredProd = filterProducts(obj, searchText);
       res.send({length: filteredProd.length});
    });
});

app.put('/api/products/setDiscount', function(req, res) {
    console.log('PUT /api/products/setDiscount');
    const ids = req.body.ids;
    const discount = req.body.discount;
    const ans = [];
    const obj = jsonfile.readFileSync(productsFile);
    for (let i = 0; i < obj.length; i++) {
       if (ids.indexOf(obj[i].id) > -1) {
           let tempObj = obj[i];
           tempObj.maxDiscount = discount;
           ans.push(tempObj);
       } else {
           ans.push(obj[i]);
       }
    }

    jsonfile.writeFileSync(productsFile, ans);

    res.send({ids: ids, discount: discount});
});

app.get('/api/shops/get', function(req, res) {
    console.log('GET /api/shops/get');
    const pageIndex = parseInt(req.query.pageIndex);
    const pageSize = parseInt(req.query.pageSize);
    const searchText = req.query.searchText;
    const ans = [];
    
    jsonfile.readFile(shopsFile, function(err, obj) {
        const start = pageIndex * pageSize;
        const end = (pageIndex + 1) * pageSize;
        const filteredShops = filterShops(obj, searchText);
        console.log(filteredShops[0]);
       for (let i = start; i < Math.min(end, filteredShops.length); i++) {
           ans.push(filteredShops[i]);
       }
        res.send(ans);
   });
});

app.get('/api/shops/shopsAmount', function(req, res) {
    console.log('GET /api/shops/shopsAmount');
    const searchText = req.query.searchText;
    jsonfile.readFile(shopsFile, function(err, obj) {
        const filteredShops = filterShops(obj, searchText);
       res.send({length: filteredShops.length});
    });
});

app.post('/api/feedback', function (req, res) {
    console.log('POST /api/feedback');
    console.log(req.body);
    res.send({ans: true});
});
//---------------------------------------------------------------------------------

app.listen(8080, function () {
    console.log('mock server is listening on port 8080');
});
