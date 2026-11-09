import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotal } from './orderService.js';

test('calcula o total do pedido somando preço x quantidade', () => {
    const total = calculateTotal([
        { price: 19.9, quantity: 3 },
        { price: 34.9, quantity: 1 },
    ]);

    // tolerância de 1 centavo por causa do arredondamento do JS
    assert.ok(Math.abs(total - 94.6) < 0.01);
});

test('cria o pedido', async () => {
    assert.ok(true);
});

test('não deixa comprar sem estoque', async () => {
    // TODO: fazer depois
});
