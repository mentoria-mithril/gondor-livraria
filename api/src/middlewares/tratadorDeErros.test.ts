import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { NextFunction, Request, Response } from 'express';
import { tratadorDeErros } from './tratadorDeErros.js';

function catchResponse() {
    const caught = { status: 0, body: undefined as unknown };
    const res = {
        status(code: number) {
            caught.status = code;
            return this;
        },
        json(body: unknown) {
            caught.body = body;
        },
    };
    
    return { caught, res: res as unknown as Response };
}

test('JSON inválido retorna status 400 e mensagem de erro', () => {
    const error = Object.assign(new SyntaxError('Unexpected token'), {
        status: 400,
        type: 'entity.parse.failed',
    });
    const { caught, res } = catchResponse();

    tratadorDeErros(error, {} as Request, res, (() => {}) as NextFunction);

    assert.equal(caught.status, 400);
    assert.deepEqual(caught.body, { erro: 'JSON inválido.' });
});

test('corpo grande demais retorna status 413 e mensagem de erro', () => {
    const error = Object.assign(new Error('Request entity too large'), {
        status: 413,
        type: 'entity.too.large',
    });
    const { caught, res } = catchResponse();

    tratadorDeErros(error, {} as Request, res, (() => {}) as NextFunction);

    assert.equal(caught.status, 413);
    assert.deepEqual(caught.body, { erro: 'Corpo grande demais.' });
});