import RemoteDev from 'remotedev';

const remotedev = RemoteDev.connectViaExtension();

const toAction = msg => {
  const type = msg => (msg && msg.ctor ? `${msg.ctor}:${type(msg._0)}` : '');
  return {
    type: type(msg).slice(0, -1),
    ...toJs(msg),
  };
};

const toJs = model => {
  if (model && typeof model === 'object') {
    switch (model.ctor) {
      // Empty List.
      case '[]':
        return [];
      // Non-empty List.
      case '::':
        const array = [];
        let head = model;
        while (head.ctor === '::') {
          array.push(toJs(head._0));
          head = head._1;
        }
        return array;
      // A record.
      default:
        // If a record only contains one field named '_0' and that field doesn't
        // have a ctor, collapse the object.
        // This collapses a lot of unnecessary nesting created by types like:
        // type Msg = FooMsg Foo.Msg | BarMsg Bar.Msg | BazMsg Baz.Msg
        if (
          '_0' in model &&
          'ctor' in model &&
          Object.keys(model).length == 2 &&
          typeof model._0 === 'object' &&
          !('ctor' in model._0)
        ) {
          return {
            $$: model.ctor,
            ...toJs(model._0),
          };
        }

        const object = {};
        for (const key in model) {
          object[key === 'ctor' ? '$' : key] = toJs(model[key]);
        }
        return object;
    }
  }
  return model;
};

export const send = (msg, model) => {
  const action = toAction(msg);
  const state = toJs(model);
  remotedev.send(action, state);
};
