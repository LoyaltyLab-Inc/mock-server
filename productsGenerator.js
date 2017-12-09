const jsonfile = require('jsonfile');
const fileTo = 'products.json';
const fileFrom = 'product_base.json';


const randomValue = () => Math.floor(Math.random() * (2000000 - 1000000 + 1)) + 1000000;
const randomDiscount = () => Math.floor(Math.random() * (100 - 50 + 1)) + 50;

jsonfile.readFile(fileFrom, function(err, obj) {
  const prods = [];
  for (const prod of obj.products) {
      prod.id = randomValue();
      prod.actualPrice = parseFloat(prod.actualPrice);
      prod.maxDiscount = randomDiscount();
      prods.push(prod);
  }
    jsonfile.writeFile(fileTo, prods, function (err) {
        console.error(err)
    });
});
