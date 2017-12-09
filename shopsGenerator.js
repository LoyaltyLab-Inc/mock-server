const jsonfile = require('jsonfile');
const fileTo = 'shops.json';

function generate() {
    function getShops() {
        const randomId = () => Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
    
        const ans = [
            {id: randomId(),
            name: 'ОКЕЙ',
            address: 'Ленинский пр., 101, Москва, 119421',
            phone: '8 (495) 258-60-14',
            manager: 'Иван Ургант 0_0'
            },
            {id: randomId(),
            name: 'ОКЕЙ',
            address: 'Кировоградская ул., 13а, Москва, 117519',
            phone: '8 (495) 734-78-46',
            manager: 'Андрей Олегович'
            },
            {id: randomId(),
            name: 'ОКЕЙ',
            address: 'Каширское ш., 14, Москва, 115230',
            phone: '8 (499) 951-05-36',
            manager: 'Максим Петрович'
            },
            {id: randomId(),
            name: 'ОКЕЙ',
            address: 'МФК «Витте Молл», Веневская ул., 6, Москва, 117042',
            phone: '8 (495) 411-78-48',
            manager: 'Савелий Олегович'
            },
            {id: randomId(),
            name: 'ОКЕЙ',
            address: 'ТЦ «Водный», Головинское ш., 5, Москва, 125212',
            phone: '8 (495) 139-20-85',
            manager: 'Василий Германович'
            },
            {id: randomId(),
            name: 'ОКЕЙ',
            address: 'пр-т Мира, 211, корп. 2, Москва, 129226',
            phone: '8 (495) 213-32-61',
            manager: 'Павел Антонов'
            },
            {id: randomId(),
            name: 'ОКЕЙ',
            address: 'Святоозёрская ул., 1А, Москва, 111675',
            phone: '8 (495) 795-09-86',
            manager: 'Павел Антонов'
            }
        ];
        return ans;
    }
    const ans = getShops();
    jsonfile.writeFile(fileTo, ans, function (err) {
        console.error(err);
    });
}

generate();