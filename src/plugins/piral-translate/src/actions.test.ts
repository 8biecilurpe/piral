import { Atom, deref, swap } from '@dbeining/react-atom';
import { createListener } from 'piral-base';
import { createActions as ca } from 'piral-core';
import { createActions } from './actions';

describe('Translation Action Module', () => {
  it('selectLanguage changes the current language', () => {
    const state = Atom.of({
      foo: 5,
      language: {
        foo: 10,
        loading: false,
        selected: 'fr',
      },
    });
    const localizer = {
      language: 'en',
      languages: ['en'],
      messages: {},
      localizeGlobal() {
        return '';
      },
      localizeLocal() {
        return '';
      },
    };
    const actions = createActions(localizer);
    const ctx = ca(state, createListener({}));
    actions.selectLanguage(ctx, 'de');
    expect(deref(state)).toEqual({
      foo: 5,
      language: {
        foo: 10,
        loading: false,
        selected: 'de',
      },
    });
  });

  it('setTranslations sets translations to the global translations', () => {
    const state = Atom.of({
      foo: 5,
      language: {
        foo: 10,
        loading: false,
        selected: 'fr',
      },
    });
    const localizer = {
      language: 'en',
      languages: ['en'],
      messages: {},
      localizeGlobal() {
        return '';
      },
      localizeLocal() {
        return '';
      },
    };
    const ctx = ca(state, createListener({}));
    const actions = createActions(localizer);
    const data = {
      global: {
        car: 'Auto',
        table: 'Tisch',
      },
      locals: [],
    };
    actions.setTranslations(ctx, 'de', data);
    expect(localizer.messages).toEqual({
      de: { car: 'Auto', table: 'Tisch' },
    });
  });

  it('getTranslations returns translations', () => {
    const state = Atom.of({
      foo: 5,
      language: {
        foo: 10,
        loading: false,
        selected: 'fr',
      },
    });
    const localizer = {
      language: 'fr',
      languages: ['fr'],
      messages: {
        fr: {
          foo: 'bár',
          bar: 'bár',
        },
      },
      localizeGlobal() {
        return '';
      },
      localizeLocal() {
        return '';
      },
    };
    const actions = createActions(localizer);
    const ctx = ca(state, createListener({}));
    const result = actions.getTranslations(ctx, 'fr');
    expect(result).toEqual({ global: { foo: 'bár', bar: 'bár' }, locals: [] });
  });
});
