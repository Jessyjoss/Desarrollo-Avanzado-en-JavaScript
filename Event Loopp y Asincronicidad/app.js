const orderList = document.getElementById('orderList');
const addOrderBtn = document.getElementById('addOrderBtn');
const orderTypeSelect = document.getElementById('orderType');

let nextId = 1;

const durations = {
  'Frappuccino': 5000,
  'Hot cakes': 8000,
  'Café Americano': 2000,
  'Café expresso': 2000,
  'Sandwich': 3000,
  'Pastel de chocolate': 10000,
  'Café helado': 3000,
  'Café Latte Vainilla': 5000,
  'Capuccino Moka': 4000,
};

function addOrder(order) {
  const li = document.createElement('li');
  li.id = `order-${order.id}`;
  li.className = 'order';
  li.innerHTML = `
    Pedido #${order.id} (${order.type}) — <span class="status">${order.status}</span>
    | Tiempo restante: <span class="timer">${(durations[order.type]/1000).toFixed(0)}</span>s
    <button class="cancel-btn">Cancelar</button>
  `;
  orderList.appendChild(li);
}

function updateStatus(orderId, status) {
  const li = document.getElementById(`order-${orderId}`);
  if (li) li.querySelector('.status').textContent = status;
}

function updateTimer(orderId, secs) {
  const li = document.getElementById(`order-${orderId}`);
  if (li) li.querySelector('.timer').textContent = secs.toFixed(0);
}

// Simula preparación con posibilidad de cancelación
function prepareOrder(order, controller) {
  return new Promise((resolve, reject) => {
    const ms = durations[order.type] || 4000;
    const start = Date.now();
    const id = setTimeout(() => {
      resolve(order.id);
    }, ms);

    controller.signal.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new Error('Pedido cancelado'));
    });
  });
}

function countdown(orderId, totalMs, controller) {
  let remaining = totalMs / 1000;
  const interval = setInterval(() => {
    remaining -= 1;
    updateTimer(orderId, remaining);
    if (remaining <= 0 || controller.signal.aborted) {
      clearInterval(interval);
    }
  }, 1000);
}

async function processOrder(order) {
  const controller = new AbortController();

  document.querySelector(`#order-${order.id} .cancel-btn`)
    .addEventListener('click', () => {
      controller.abort();
      updateStatus(order.id, 'Cancelado');
    });

  updateStatus(order.id, 'En Proceso');
  countdown(order.id, durations[order.type], controller);

  try {
    await prepareOrder(order, controller);
    if (!controller.signal.aborted) {
      updateStatus(order.id, 'Completado');
    }
  } catch (err) {
    if (err.name === 'Error') {
      console.warn(`Pedido #${order.id} cancelado`);
    }
  }
}

addOrderBtn.addEventListener('click', () => {
  const type = orderTypeSelect.value;
  const order = { id: nextId++, type, status: 'Pendiente' };
  addOrder(order);
  processOrder(order);
});
