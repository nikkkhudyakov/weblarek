import { Api } from './components/base/Api';
import { BuyerModel } from './components/Models/BuyerModel';
import { CartModel } from './components/Models/CartModel';
import { CatalogModel } from './components/Models/CatalogModel';
import { ShopApi } from './components/Models/ShopApi';
import './scss/styles.scss';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// Тестовые проверки моделей данных
const catalog = new CatalogModel();
catalog.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getProducts());
console.log(
  'Товар по id (первый):',
  catalog.getProductById(apiProducts.items[0]?.id)
);
catalog.setSelectedProduct(apiProducts.items[1] ?? null);
console.log('Выбранный товар:', catalog.getSelectedProduct());

const cart = new CartModel();
cart.add(apiProducts.items[0]);
cart.add(apiProducts.items[1]);
console.log('Корзина: список товаров:', cart.getItems());
console.log('Корзина: количество товаров:', cart.getCount());
console.log('Корзина: общая стоимость:', cart.getTotal());
console.log(
  'Корзина: содержит первый товар?',
  cart.has(apiProducts.items[0].id)
);
cart.remove(apiProducts.items[0].id);
console.log('Корзина после удаления первого товара:', cart.getItems());
cart.clear();
console.log('Корзина после очистки:', cart.getItems());

const buyer = new BuyerModel();
console.log('Покупатель (пустые данные):', buyer.get());
console.log('Валидация (пустые данные):', buyer.validate());
buyer.set({ payment: 'online', email: 'test@test.ru' });
console.log('Покупатель после частичного сохранения:', buyer.get());
buyer.set({ phone: '+71234567890', address: 'Spb Vosstania 1' });
console.log('Покупатель после полного сохранения:', buyer.get());
console.log('Валидация (заполненные данные):', buyer.validate());
buyer.clear();
console.log('Покупатель после очистки:', buyer.get());

// Получение каталога товаров с сервера и сохранение в модель каталога
const api = new Api(API_URL);
const shopApi = new ShopApi(api);
shopApi
  .getProducts()
  .then((items) => {
    catalog.setProducts(items);
    console.log('Каталог, полученный с сервера:', catalog.getProducts());
  })
  .catch((err) => {
    console.error('Ошибка загрузки каталога:', err);
  });
