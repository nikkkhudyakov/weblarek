import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { BuyerModel } from './components/Models/BuyerModel';
import { CartModel } from './components/Models/CartModel';
import { CatalogModel } from './components/Models/CatalogModel';
import { ShopApi } from './components/Models/ShopApi';
import { CartView } from './components/View/CartView';
import { CatalogView } from './components/View/CatalogView';
import { CheckoutFormStep1 } from './components/View/forms/CheckoutFormStep1';
import { CheckoutFormStep2 } from './components/View/forms/CheckoutFormStep2';
import { HeaderView } from './components/View/HeaderView';
import { ModalView } from './components/View/ModalView';
import { OrderSuccessView } from './components/View/OrderSuccessView';
import { PreviewCard } from './components/View/PreviewCard';
import './scss/styles.scss';
import { IProduct, TPayment } from './types';
import { API_URL } from './utils/constants';

// Presenter wiring
const events = new EventEmitter();
const catalog = new CatalogModel(undefined, events);
const cart = new CartModel(undefined, events);
const buyer = new BuyerModel(undefined, events);

// Views
const gallery = document.querySelector('main.gallery') as HTMLElement;
const headerEl = document.querySelector('.header') as HTMLElement;
const modalEl = document.getElementById('modal-container') as HTMLElement;
const headerView = new HeaderView(headerEl, events);
const catalogView = new CatalogView(gallery, events);
const modalView = new ModalView(modalEl, events);

let currentStep1: CheckoutFormStep1 | null = null;
let currentStep2: CheckoutFormStep2 | null = null;

// Делегирование клика в модалке на кнопку оформления (на случай проблем с вложенными обработчиками)
modalEl.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  const checkoutBtn = target.closest(
    '.basket__button'
  ) as HTMLButtonElement | null;
  if (checkoutBtn && !checkoutBtn.disabled) {
    events.emit('cart:checkout');
  }
});

// Render helpers
const renderCatalog = () => {
  const items = catalog.getProducts().map((p) => ({
    id: p.id,
    title: p.title,
    image: p.image,
    category: p.category,
    price: p.price,
    inCart: cart.has(p.id),
  }));
  catalogView.items = items;
};

const renderCartModal = () => {
  const list = cart.getItems().map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.image,
    category: p.category,
  }));
  const cartView = new CartView(events);
  cartView.items = list;
  cartView.total = cart.getTotal();
  cartView.canCheckout = cart.getCount() > 0;
  modalView.open(cartView.render());
  // Fallback: если по каким-то причинам событие из CartView не дошло,
  // навесим делегированный обработчик на кнопку оформления
  const checkoutBtn = modalEl.querySelector(
    '.basket__button'
  ) as HTMLButtonElement | null;
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      if (checkoutBtn.disabled) return;
      events.emit('cart:checkout');
    };
  }
};

// Model events
events.on('catalog:changed', () => renderCatalog());
events.on<{ product: IProduct | null }>('catalog:selected', ({ product }) => {
  if (!product) return;
  const preview = new PreviewCard(events);
  modalView.open(
    preview.render({
      id: product.id,
      title: product.title,
      image: product.image,
      category: product.category,
      price: product.price,
      description: product.description,
      inCart: cart.has(product.id),
    })
  );
});

events.on('cart:changed', () => {
  headerView.count = cart.getCount();
  renderCatalog();
  // Если открыта корзина, перерисуем её содержимое
  if (modalEl.querySelector('.basket')) {
    renderCartModal();
  }
});

// View events
events.on<{ id: string }>('card:click', ({ id }) => {
  const product = catalog.getProductById(id);
  catalog.setSelectedProduct(product ?? null);
});

events.on<{ id: string }>('card:action', ({ id }) => {
  const product = catalog.getProductById(id);
  if (!product || product.price === null) return;
  if (cart.has(id)) {
    cart.remove(id);
  } else {
    cart.add(product);
  }
  modalView.close();
});

events.on('cart:open', () => renderCartModal());

events.on<{ id: string }>('cart:item-remove', ({ id }) => {
  if (cart.has(id)) {
    cart.remove(id);
  }
});

events.on('cart:checkout', () => {
  currentStep2 = null;
  currentStep1 = new CheckoutFormStep1(events);
  currentStep1.valid = false;
  currentStep1.errors = {};
  modalView.open(currentStep1.render());
});

events.on<
  | import('./components/View/forms/CheckoutFormStep1').Step1Data
  | import('./components/View/forms/CheckoutFormStep2').Step2Data
>('form:change', (data) => {
  const isStep1 = 'payment' in data || 'address' in data;
  const isStep2 = 'email' in data || 'phone' in data;

  if (isStep1 && currentStep1) {
    const d =
      data as import('./components/View/forms/CheckoutFormStep1').Step1Data;
    const paymentValid = !!d.payment;
    const addressValid = !!(d.address && d.address.trim());
    const valid = paymentValid && addressValid;
    buyer.set({
      payment: (d.payment ?? undefined) as TPayment,
      address: d.address || '',
    });
    currentStep1.valid = valid;
    currentStep1.errors = {
      payment: paymentValid ? undefined : 'Не выбран вид оплаты',
      address: addressValid ? undefined : 'Укажите адрес',
    };
  } else if (isStep2 && currentStep2) {
    const d =
      data as import('./components/View/forms/CheckoutFormStep2').Step2Data;
    const email = d.email || '';
    const phone = d.phone || '';
    const emailValid = !!email.trim();
    const phoneValid = !!phone.trim();
    const valid = emailValid && phoneValid;
    buyer.set({ email, phone });
    currentStep2.valid = valid;
    currentStep2.errors = {
      email: emailValid ? undefined : 'Укажите email',
      phone: phoneValid ? undefined : 'Укажите телефон',
    };
  }
});

events.on('form:submit', () => {
  const isStep1 = !!modalEl.querySelector('form[name="order"]');
  const isStep2 = !!modalEl.querySelector('form[name="contacts"]');

  if (isStep1) {
    currentStep2 = new CheckoutFormStep2(events);
    currentStep1 = null;
    currentStep2.valid = false;
    currentStep2.errors = {};
    modalView.open(currentStep2.render());
    return;
  }

  if (isStep2) {
    const api = new Api(API_URL);
    const shopApi = new ShopApi(api);
    const items = cart.getItems().map((p) => p.id);
    const total = cart.getTotal();
    shopApi
      .createOrder({
        payment: buyer.get().payment,
        email: buyer.get().email,
        phone: buyer.get().phone,
        address: buyer.get().address,
        total,
        items,
      })
      .then(({ total }) => {
        cart.clear();
        buyer.clear();
        const success = new OrderSuccessView(events);
        success.total = total;
        modalView.open(success.render());
      })
      .catch((err) => {
        console.error('Ошибка оплаты:', err);
      });
  }
});

events.on('order:success-close', () => modalView.close());
events.on('modal:close', () => {
  /* no-op */
});

// Получение каталога товаров с сервера и сохранение в модель каталога
const api = new Api(API_URL);
const shopApi = new ShopApi(api);
shopApi
  .getProducts()
  .then((items) => {
    catalog.setProducts(items);
  })
  .catch((err) => {
    console.error('Ошибка загрузки каталога:', err);
  });
