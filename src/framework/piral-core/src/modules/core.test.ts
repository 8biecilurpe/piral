import { createElement, FC } from 'react';
import { createCoreApi } from './core';

jest.mock('../hooks');

const StubComponent: FC = (props) => createElement('div', props);
StubComponent.displayName = 'StubComponent';

const moduleMetadata = {
  name: 'my-module',
  version: '1.0.0',
  link: undefined,
  custom: undefined,
  hash: '123',
};

function createMockContainer() {
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      converters: {},
      readState() {
        return undefined;
      },
    } as any,
    api: {} as any,
  };
}

function createApi(container) {
  Object.assign(container.api, createCoreApi(container.context)(container.api, moduleMetadata));
  return container.api;
}

describe('Core API Module', () => {
  it('createCoreApi can register and unregister a page', () => {
    const container = createMockContainer();
    container.context.registerPage = jest.fn();
    container.context.unregisterPage = jest.fn();
    const api = createApi(container);
    api.registerPage('/route', StubComponent);
    expect(container.context.registerPage).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterPage).toHaveBeenCalledTimes(0);
    api.unregisterPage('/route');
    expect(container.context.unregisterPage).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterPage.mock.calls[0][0]).toBe(container.context.registerPage.mock.calls[0][0]);
  });

  it('createCoreApi can dispose a registered page', () => {
    const container = createMockContainer();
    container.context.registerPage = jest.fn();
    container.context.unregisterPage = jest.fn();
    const api = createApi(container);
    const dispose = api.registerPage('/route', StubComponent);
    expect(container.context.registerPage).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterPage).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterPage).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterPage.mock.calls[0][0]).toBe(container.context.registerPage.mock.calls[0][0]);
  });

  it('createCoreApi can register and unregister an extension', () => {
    const container = createMockContainer();
    container.context.registerExtension = jest.fn();
    container.context.unregisterExtension = jest.fn();
    const api = createApi(container);
    api.registerExtension('ext', StubComponent);
    expect(container.context.registerExtension).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterExtension).toHaveBeenCalledTimes(0);
    api.unregisterExtension('ext', StubComponent);
    expect(container.context.unregisterExtension).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterExtension.mock.calls[0][0]).toBe(
      container.context.registerExtension.mock.calls[0][0],
    );
  });

  it('createCoreApi can dispose an registered extension', () => {
    const container = createMockContainer();
    container.context.registerExtension = jest.fn();
    container.context.unregisterExtension = jest.fn();
    const api = createApi(container);
    const dispose = api.registerExtension('ext', StubComponent);
    expect(container.context.registerExtension).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterExtension).toHaveBeenCalledTimes(0);
    dispose();
    expect(container.context.unregisterExtension).toHaveBeenCalledTimes(1);
    expect(container.context.unregisterExtension.mock.calls[0][0]).toBe(
      container.context.registerExtension.mock.calls[0][0],
    );
  });

  it('createCoreApi read data by its name', () => {
    const container = createMockContainer();
    container.context.readDataValue = jest.fn((name) => name);
    const api = createApi(container);
    const result = api.getData('foo');
    expect(result).toBe('foo');
    expect(container.context.readDataValue).toHaveBeenCalled();
  });

  it('createCoreApi write data without options shall pass, but memory should not emit events', () => {
    const container = createMockContainer();
    container.context.tryWriteDataItem = jest.fn(() => true);
    const api = createApi(container);
    api.setData('foo', 5);
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
    expect(container.context.emit).not.toHaveBeenCalled();
  });

  it('createCoreApi write data with empty options shall pass, but memory should not emit events', () => {
    const container = createMockContainer();
    container.context.tryWriteDataItem = jest.fn(() => true);
    const api = createApi(container);
    api.setData('foo', 5, {});
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
    expect(container.context.emit).not.toHaveBeenCalled();
  });

  it('createCoreApi write data by the simple option should not pass, never emitting events', () => {
    const container = createMockContainer();
    container.context.tryWriteDataItem = jest.fn(() => false);
    const api = createApi(container);
    api.setData('foo', 5, 'remote');
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
    expect(container.context.emit).not.toHaveBeenCalled();
  });

  it('createCoreApi write data by the simple option shall pass with remote', () => {
    const container = createMockContainer();
    container.context.tryWriteDataItem = jest.fn(() => true);
    const api = createApi(container);
    api.setData('foo', 5, 'remote');
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
  });

  it('createCoreApi write data by the object options shall pass with remote', () => {
    const container = createMockContainer();
    container.context.tryWriteDataItem = jest.fn(() => true);
    const api = createApi(container);
    api.setData('foo', 15, {
      expires: 10,
      target: 'local',
    });
    expect(container.context.tryWriteDataItem).toHaveBeenCalled();
  });
});
