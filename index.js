const express = require('express');
const bodyParser = require("body-parser");
const jsonfile = require('jsonfile');
const productsFile = 'products.json';
const productsFileTemp = 'productsTemp.json';
const shopsFile = 'shops.json';
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/user', function(req, res) {
    console.log('GET /api/user');

    const ans = {
	name: 'Anton',
	surname: 'Vakhrushin',
	position: 'CTO',
	image: 'https://pp.userapi.com/c841227/v841227203/13492/TIjlbFh8sQg.jpg'
    };

    res.send(ans);
});

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
    /*jsonfile.readFile(productsFile, function (err, obj) {
        for (let i = 0; i < obj.length; i++) {
           if (ids.indexOf(obj[i].id) > -1) {
               let tempObj = obj[i];
               tempObj.maxDiscount = discount;
               ans.push(tempObj);
           } else {
               ans.push(obj[i]);
           }
       } 
       jsonfile.writeFile(productsFileTemp, ans, function(err) {
           console.error(err);
       })
    });*/
    jsonfile.writeFileSync(productsFile, ans);
    /*jsonfile.readFile(productsFileTemp, function(err, obj) {
        const ansObj = obj;
        jsonfile.writeFile(productsFile, ansObj, function (err) {
            console.error(err);
        })
    })*/
    res.send({ids: ids, discount: discount});
});

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

app.post('/api/feedback', function (req, res) {
    console.log('POST /api/feedback');
    console.log(req.body);
    res.send({ans: true});
});


app.listen(8080, function () {
    console.log('mock server is listening on port 8080');
});
